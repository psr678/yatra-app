import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

export const maxDuration = 60;

const SYSTEM_PROMPT =
  'You are Roamai Guide, a friendly and knowledgeable Indian travel expert. ' +
  'You give practical, culturally aware travel advice for Indian domestic travel. ' +
  'CRITICAL: Always produce your COMPLETE response — never truncate, never cut off, never leave any section unfinished. ' +
  'Even for long itineraries (10+ days), write every single day and every single section in full. ' +
  'Be warm, structured and helpful. Use relevant emojis. Format with clear sections and bullet points.';

const ALLOWED_ORIGINS = [
  'https://roamai.in',
  'https://www.roamai.in',
  'https://yatra-app-psi.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

// ── Provider routing ───────────────────────────────────────────────
// Gemini  → long itineraries (large output, needs high quality)
// Cerebras → short queries: tips, insights, day trips, safety (1M tokens/day free)
// Groq    → last-resort fallback only (100K tokens/day — preserve it)
type Provider = 'gemini' | 'cerebras' | 'groq';

function selectProvider(prompt: string): Provider {
  const lower = prompt.toLowerCase();
  const isItinerary =
    lower.includes('itinerary') ||
    lower.includes('day-by-day') ||
    lower.includes('day plan') ||
    lower.includes('travel plan');
  const daysMatch = prompt.match(/(\d+)\s*days?/i);
  const days = daysMatch ? parseInt(daysMatch[1]) : 0;
  if (isItinerary || days >= 3) return 'gemini';
  return 'cerebras';
}

// Fallback chain per primary provider
const FALLBACK: Record<Provider, Provider[]> = {
  gemini:   ['cerebras', 'groq'],
  cerebras: ['gemini',   'groq'],
  groq:     ['cerebras', 'gemini'],
};

// ── Redis ─────────────────────────────────────────────────────────
let ratelimit: Ratelimit | null = null;
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = Redis.fromEnv();
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
  });
}

function isAllowedRequestSource(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return false;
  const referer = req.headers.get('referer');
  if (!referer || !referer.startsWith(origin)) return false;
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site') return false;
  return true;
}

// ── Gemini streaming ──────────────────────────────────────────────
async function streamGemini(prompt: string, encoder: TextEncoder, onChunk: (b: Uint8Array) => void): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: SYSTEM_PROMPT });
  const result = await model.generateContentStream(prompt);
  let full = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) { full += text; onChunk(encoder.encode(text)); }
  }
  return full;
}

// ── Cerebras streaming ────────────────────────────────────────────
async function streamCerebras(prompt: string, encoder: TextEncoder, onChunk: (b: Uint8Array) => void): Promise<string> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) throw new Error('CEREBRAS_API_KEY not configured');
  const client = new Cerebras({ apiKey });
  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: prompt },
    ],
    stream: true,
    max_completion_tokens: 8192,
  });
  let full = '';
  for await (const chunk of stream) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text: string = (chunk as any).choices?.[0]?.delta?.content ?? '';
    if (text) { full += text; onChunk(encoder.encode(text)); }
  }
  return full;
}

// ── Groq streaming (fallback only) ───────────────────────────────
async function streamGroq(prompt: string, encoder: TextEncoder, onChunk: (b: Uint8Array) => void): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');
  const groq = new Groq({ apiKey });
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',  // last-resort fallback — quality over quota
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: prompt },
    ],
    stream: true,
    max_tokens: 8000,
  });
  let full = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? '';
    if (text) { full += text; onChunk(encoder.encode(text)); }
  }
  return full;
}

async function runProvider(provider: Provider, prompt: string, encoder: TextEncoder, onChunk: (b: Uint8Array) => void): Promise<string> {
  if (provider === 'gemini')   return streamGemini(prompt, encoder, onChunk);
  if (provider === 'cerebras') return streamCerebras(prompt, encoder, onChunk);
  return streamGroq(prompt, encoder, onChunk);
}

// ── Route handler ─────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!isAllowedRequestSource(req)) return new Response('Forbidden', { status: 403 });

  if (ratelimit) {
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
      const { success } = await ratelimit.limit(ip);
      if (!success) return new Response('Too many requests — please wait a minute.', { status: 429 });
    } catch { /* Redis down — skip */ }
  }

  let body: unknown;
  try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }

  const b = body && typeof body === 'object' && !Array.isArray(body)
    ? body as { prompt?: unknown; ck?: unknown; ttl?: unknown } : {};

  const prompt = b.prompt;
  if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > 12000)
    return new Response('Bad request', { status: 400 });

  // ck = structured cache key from client (destination+params); falls back to prompt hash
  // ttl = seconds; client sends longer TTL for stable content (day trips, getting there)
  const ckRaw  = typeof b.ck  === 'string' ? b.ck.slice(0, 256) : null;
  const ttl    = typeof b.ttl === 'number' && b.ttl > 0 ? Math.min(b.ttl, 604800) : 86400;
  const cacheKey = `roamai:v3:${createHash('sha256').update(ckRaw ?? prompt).digest('hex')}`;

  if (redis) {
    try {
      const cached = await redis.get<string>(cacheKey);
      if (cached) return new Response(cached, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Cache': 'HIT' },
      });
    } catch { /* Redis down — skip */ }
  }

  const primary = selectProvider(prompt);
  const encoder = new TextEncoder();
  let fullResponse = '';

  return new Response(
    new ReadableStream({
      async start(controller) {
        const send = (bytes: Uint8Array) => controller.enqueue(bytes);
        let sentBytes = 0;
        const tracked = (bytes: Uint8Array) => { sentBytes += bytes.length; send(bytes); };

        const chain = [primary, ...FALLBACK[primary]];
        let succeeded = false;

        for (const provider of chain) {
          try {
            fullResponse = await runProvider(provider, prompt, encoder, sentBytes === 0 ? tracked : send);
            succeeded = true;
            break;
          } catch {
            if (sentBytes > 0) {
              // Partial content already sent — can't retry cleanly
              controller.enqueue(encoder.encode(
                '\n\n---\n⚠️ Response was cut short. Please try again for the full result.'
              ));
              succeeded = true;
              break;
            }
            // Nothing sent yet — try next provider in chain
          }
        }

        if (!succeeded) {
          controller.enqueue(encoder.encode(
            '⚠️ Our AI assistants are taking a short break due to high traffic. Please try again in a few minutes.'
          ));
        }

        controller.close();

        if (redis && fullResponse) {
          await redis.setex(cacheKey, ttl, fullResponse).catch(() => {});
        }
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Provider': primary } }
  );
}

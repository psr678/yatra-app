import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
// Gemini: itineraries (potentially 3000-6000 tokens output, needs large context)
// Groq:   short queries — seasonal tips, safety guides, checklists (fast, low-latency)
function selectProvider(prompt: string): 'gemini' | 'groq' {
  const lower = prompt.toLowerCase();
  const isItinerary =
    lower.includes('itinerary') ||
    lower.includes('day-by-day') ||
    lower.includes('day plan') ||
    lower.includes('travel plan');
  const daysMatch = prompt.match(/(\d+)\s*days?/i);
  const days = daysMatch ? parseInt(daysMatch[1]) : 0;
  // Send long itineraries to Gemini; everything else to Groq
  if (isItinerary || days >= 3) return 'gemini';
  return 'groq';
}

// ── Lazy clients ──────────────────────────────────────────────────
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

function errorResponse(msg: string, status = 500) {
  return new Response(`⚠️ ${msg}`, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

// ── Gemini streaming ──────────────────────────────────────────────
async function streamGemini(prompt: string, encoder: TextEncoder, onChunk: (b: Uint8Array) => void): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContentStream(prompt);
  let full = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      full += text;
      onChunk(encoder.encode(text));
    }
  }
  return full;
}

// ── Groq streaming ────────────────────────────────────────────────
async function streamGroq(prompt: string, encoder: TextEncoder, onChunk: (b: Uint8Array) => void): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const groq = new Groq({ apiKey });
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    stream: true,
    max_tokens: 8000,
  });

  let full = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? '';
    if (text) {
      full += text;
      onChunk(encoder.encode(text));
    }
  }
  return full;
}

// ── Route handler ─────────────────────────────────────────────────
export async function POST(req: Request) {
  // 1. Origin check
  if (!isAllowedRequestSource(req)) {
    return new Response('Forbidden', { status: 403 });
  }

  // 2. Rate limit
  if (ratelimit) {
    try {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
      const { success } = await ratelimit.limit(ip);
      if (!success) return new Response('Too many requests — please wait a minute.', { status: 429 });
    } catch { /* Redis down — skip */ }
  }

  // 3. Validate body
  let body: unknown;
  try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }

  const prompt = body && typeof body === 'object' && !Array.isArray(body)
    ? (body as { prompt?: unknown }).prompt : undefined;
  if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > 12000) {
    return new Response('Bad request', { status: 400 });
  }

  // 4. Redis cache
  const cacheKey = `roamai:v2:${createHash('sha256').update(prompt).digest('hex')}`;
  if (redis) {
    try {
      const cached = await redis.get<string>(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Cache': 'HIT' },
        });
      }
    } catch { /* Redis down — skip */ }
  }

  // 5. Pick provider and stream
  const provider = selectProvider(prompt);
  const encoder = new TextEncoder();
  let fullResponse = '';

  return new Response(
    new ReadableStream({
      async start(controller) {
        const send = (bytes: Uint8Array) => controller.enqueue(bytes);

        let sentBytes = 0;
        const tracked = (bytes: Uint8Array) => { sentBytes += bytes.length; send(bytes); };

        try {
          if (provider === 'gemini') {
            fullResponse = await streamGemini(prompt, encoder, tracked);
          } else {
            fullResponse = await streamGroq(prompt, encoder, tracked);
          }
        } catch {
          // Only fall back if nothing was sent yet — mid-stream errors can't be recovered cleanly
          if (sentBytes === 0) {
            const fallback = provider === 'gemini' ? 'groq' : 'gemini';
            try {
              if (fallback === 'gemini') {
                fullResponse = await streamGemini(prompt, encoder, send);
              } else {
                fullResponse = await streamGroq(prompt, encoder, send);
              }
            } catch {
              controller.enqueue(encoder.encode(
                "⚠️ Our AI assistants are taking a short break due to high traffic. Please try again in a few minutes."
              ));
            }
          } else {
            // Partial response already sent — append a graceful note
            controller.enqueue(encoder.encode(
              "\n\n---\n⚠️ Response was cut short due to high traffic. Please try again for the full itinerary."
            ));
          }
        }

        controller.close();

        if (redis && fullResponse) {
          await redis.setex(cacheKey, 86400, fullResponse).catch(() => {});
        }
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Provider': provider } }
  );
}

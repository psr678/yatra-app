import Anthropic from '@anthropic-ai/sdk';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

const DEFAULT_SYSTEM =
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

const client = new Anthropic();

function isAllowedRequestSource(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return false;

  const referer = req.headers.get('referer');
  if (!referer || !referer.startsWith(origin)) return false;

  // Browser-provided fetch metadata blocks common cross-site request patterns.
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site') {
    return false;
  }

  return true;
}

// Lazily initialise Upstash clients only when env vars are present
let ratelimit: Ratelimit | null = null;
let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = Redis.fromEnv();
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute per IP
    analytics: true,
  });
}

export async function POST(req: Request) {
  // 1. Browser request provenance checks (origin/referer/fetch-site).
  if (!isAllowedRequestSource(req)) {
    return new Response('Forbidden', { status: 403 });
  }

  // 2. Rate limit by IP
  if (ratelimit) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'anonymous';
    const { success, limit, remaining } = await ratelimit.limit(ip);
    if (!success) {
      return new Response('Too many requests — please wait a minute.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
        },
      });
    }
  }

  // 3. Validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const prompt =
    body && typeof body === 'object' && !Array.isArray(body)
      ? (body as { prompt?: unknown }).prompt
      : undefined;
  if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > 12000) {
    return new Response('Bad request', { status: 400 });
  }

  // 4. Redis response cache — return instantly for identical prompts (24h TTL)
  const cacheKey = `roamai:v1:${createHash('sha256').update(prompt).digest('hex')}`;
  if (redis) {
    const cached = await redis.get<string>(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Cache': 'HIT',
        },
      });
    }
  }

  // 5. Stream from Anthropic — system prompt marked for prompt caching
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: [
      {
        type: 'text',
        text: DEFAULT_SYSTEM,
        cache_control: { type: 'ephemeral' }, // cache the system prompt on Anthropic's side
      },
    ],
    messages: [{ role: 'user', content: prompt }],
  });

  const encoder = new TextEncoder();
  let fullResponse = '';

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            fullResponse += chunk.delta.text;
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();

        // Store the complete response in Redis after streaming finishes (24h TTL)
        if (redis && fullResponse) {
          await redis.setex(cacheKey, 86400, fullResponse).catch(() => {});
        }
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}

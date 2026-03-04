import Anthropic from '@anthropic-ai/sdk';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const DEFAULT_SYSTEM =
  'You are Yatra Guide, a friendly and knowledgeable Indian travel expert. ' +
  'You give practical, culturally aware travel advice for Indian domestic travel. ' +
  'Always complete your full response — never cut off mid-sentence or leave sections incomplete. ' +
  'Be warm, structured and helpful. Use relevant emojis. Format with clear sections and bullet points.';

const ALLOWED_ORIGINS = [
  'https://roamai.in',
  'https://www.roamai.in',
  'https://yatra-app-psi.vercel.app',
];

const client = new Anthropic();

// Lazily initialised so the route still works if Upstash env vars are absent
// (e.g. local dev without Redis). Rate limiting is simply skipped in that case.
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute per IP
    analytics: true,
  });
}

export async function POST(req: Request) {
  // 1. Origin check — reject requests not from the app domain
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
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
  const { prompt, systemPrompt } = await req.json();
  if (!prompt || typeof prompt !== 'string' || prompt.length > 8000) {
    return new Response('Bad request', { status: 400 });
  }

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: systemPrompt || DEFAULT_SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  });

  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}

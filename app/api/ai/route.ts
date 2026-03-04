import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_SYSTEM =
  'You are Yatra Guide, a friendly and knowledgeable Indian travel expert. ' +
  'You give practical, culturally aware travel advice for Indian domestic travel. ' +
  'Always complete your full response — never cut off mid-sentence or leave sections incomplete. ' +
  'Be warm, structured and helpful. Use relevant emojis. Format with clear sections and bullet points.';

const client = new Anthropic();

export async function POST(req: Request) {
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

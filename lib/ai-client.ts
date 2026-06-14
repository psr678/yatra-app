interface CallAIOptions {
  onChunk: (chunk: string) => void;
  /** Structured cache key (destination+params). Same ck = cache hit regardless of prompt wording. */
  ck?: string;
  /** Cache TTL in seconds. Defaults to 86400 (24h). Use higher values for stable content. */
  ttl?: number;
}

export async function callAI(prompt: string, { onChunk, ck, ttl }: CallAIOptions): Promise<void> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ck, ttl }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || `API error ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

interface CallAIOptions {
  onChunk: (chunk: string) => void;
  systemPrompt?: string;
}

export async function callAI(prompt: string, { onChunk, systemPrompt }: CallAIOptions): Promise<void> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt }),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
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

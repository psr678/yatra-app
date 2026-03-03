export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, systemPrompt } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        system: systemPrompt || "You are a helpful India travel expert.",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // DEBUG LOG (temporary)
    console.log("Anthropic raw response:", JSON.stringify(data));

    if (!data.content || !Array.isArray(data.content)) {
      return res.status(500).json({ error: "Invalid response from AI" });
    }

    const text = data.content
      .filter(item => item.type === "text")
      .map(item => item.text)
      .join("");

    res.status(200).json({ response: text });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI request failed" });
  }
}
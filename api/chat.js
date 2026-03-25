export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `You are a calm, human-like love coach. Talk naturally and give helpful advice.\nUser: ${message}\nAI:`
        })
      }
    );

    const data = await response.json();

    let reply = data[0]?.generated_text || "No response";

    // clean output
    reply = reply.replace(/User:.*AI:/s, "").trim();

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Server error" });
  }
}

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
          inputs: `You are a calm, human-like love coach. Reply naturally.\nUser: ${message}\nAI:`,
          options: { wait_for_model: true } // 🔥 IMPORTANT FIX
        })
      }
    );

    const data = await response.json();

    console.log(data); // debug (see logs in Vercel)

    let reply = "";

    // ✅ HANDLE ALL RESPONSE TYPES
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else if (data.error) {
      reply = "AI is waking up... try again.";
    } else {
      reply = "No response, try again.";
    }

    // CLEAN TEXT
    reply = reply.replace(/User:.*AI:/s, "").trim();

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Server error" });
  }
}

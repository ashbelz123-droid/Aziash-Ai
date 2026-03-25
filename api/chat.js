export default async function handler(req, res) {
  try {
    // ✅ Fix body parsing (important for Vercel)
    const { message } = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `You are Aziash AI, a calm, smart love coach. Speak naturally.\nUser: ${message}\nAI:`,
          options: { wait_for_model: true },
          parameters: {
            temperature: 0.7,
            max_new_tokens: 120
          }
        })
      }
    );

    const data = await response.json();
    console.log("HF:", data);

    let reply = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data?.generated_text) {
      reply = data.generated_text;
    } else if (data?.error) {
      reply = "AI is waking up… try again.";
    } else {
      reply = "No response yet, try again.";
    }

    // Clean output
    reply = reply.replace(/User:.*AI:/s, "").trim();

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ reply: "Server error" });
  }
}

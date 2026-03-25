export default async function handler(req, res) {
  try {
    console.log("ENV TOKEN:", process.env.HF_TOKEN);

    const { message } = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({ reply: "Missing HF_TOKEN" });
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
          inputs: `You are Aziash AI, a love coach.\nUser: ${message}\nAI:`,
          options: { wait_for_model: true }
        })
      }
    );

    const data = await response.json();
    console.log("HF RESPONSE:", data);

    if (data.error) {
      return res.status(200).json({ reply: "HF ERROR: " + data.error });
    }

    let reply = data[0]?.generated_text || "No response";

    reply = reply.replace(/User:.*AI:/s, "").trim();

    res.status(200).json({ reply });

  } catch (err) {
    console.error("REAL ERROR:", err);
    res.status(200).json({ reply: "ERROR: " + err.message });
  }
  }

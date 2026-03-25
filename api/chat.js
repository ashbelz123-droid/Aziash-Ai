export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`, // 🔐 SECURE
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `You are Aziash AI, a calm, smart, human-like love coach. Speak naturally and help with relationships.\nUser: ${message}\nAI:`,
          options: { wait_for_model: true },
          parameters: {
            temperature: 0.7,
            max_new_tokens: 150
          }
        })
      }
    );

    const data = await response.json();
    console.log("HF response:", data);

    let reply = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data?.generated_text) {
      reply = data.generated_text;
    } else if (data?.error?.includes("loading")) {
      reply = "Thinking… give me a second.";
    } else if (data?.error) {
      reply = "AI is busy, try again.";
    } else {
      reply = "No response, try again.";
    }

    reply = reply.replace(/User:.*AI:/s, "").trim();

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
        }

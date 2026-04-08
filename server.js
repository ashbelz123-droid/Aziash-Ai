import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(".")); // serve index.html

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.HF_TOKEN) {
      return res.json({ reply: "Missing HF_TOKEN" });
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
          inputs: `You are Aziash AI, a calm and smart love coach. Speak naturally.\nUser: ${message}\nAI:`,
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
      reply = "No response";
    }

    reply = reply.replace(/User:.*AI:/s, "").trim();

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

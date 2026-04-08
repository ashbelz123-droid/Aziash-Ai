import express from "express";

const app = express();

app.use(express.json());
app.use(express.static("."));

app.post("/api/chat", (req, res) => {
  res.json({ reply: "SERVER WORKING 🔥" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

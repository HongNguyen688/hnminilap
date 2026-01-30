// netlify/functions/gemini-chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY; // ← this is the key!
    if (!apiKey) {
      throw new Error("No API key in env");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert your history format to Gemini's expected format
    const chat = model.startChat({
      history: messages
        .filter((m) => m.role !== "system") // skip system if you send it separately
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
    });

    // If you want to inject system prompt every time (or only at start)
    const lastUserMsg = messages[messages.length - 1]?.content;
    if (!lastUserMsg) {
      throw new Error("No message");
    }

    const result = await chat.sendMessage(lastUserMsg);
    const reply = result.response.text();

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

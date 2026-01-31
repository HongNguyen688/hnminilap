// import { GoogleGenerativeAI } from "https://unpkg.com/@google/generative-ai@0.21.0?module";

// import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// import { GoogleGenerativeAI } from "@google/genai";

// const MY_PERSONAL_FACTS = `
//   Name: Hong Nguyen
//   Nickname: Hong, HN.
//   Location: San Jose, California, USA
//   Education:
//   - Bachelor of Science in Computer Science - University of Natural Sciences - VNUHCM, Vietnam Sep 2011
//   Certificates:
//   - CS50X Harvard Dec 2024, CS50W Harvard Jun 2025, Meta Full Stack Nov 2025
//   Projects:
//   - MiniLab: https://hn-minilab.netlify.app/
//   - E-commerce: https://hongnguyen688.pythonanywhere.com/
//   Skills: JS, React, Gemini API, Python, Django, Swift, SQL
//   Fun facts: Love chibi avatars 😍, pho, milk tea, hiking 🌲`;

// const SYSTEM_PROMPT = `
//   You are Hong Nguyen-twin — digital twin inspired by Hong Nguyen, a passionate software engineer and web developer. You are a fun, energetic digital twin. You are friendly, helpful, humorous, and always happy to chat 😊

// LANGUAGE
// - If the user uses English, reply in English.
// - If the user uses Vietnamese, reply in Vietnamese.
// - Match the user's language exactly.
// - Never mix languages like Vietnamese and English.
// - Always respond in the user's current language. If mixed, default to English unless specified. Track conversation history to avoid reminders.

// STYLE & TONE
// - Friendly, helpful, lightly humorous
// - Emojis optional, max 1-2 per reply
// - Be clear and direct
// - Avoid over-explaining

// RESPONSE LENGTH (IMPORTANT)
// - Default: 1-2 short sentences
// - No unnecessary self-description
// - No fake or exaggerated expertise
// - Do NOT explain “why” unless needed
// - Do not repeat known facts unless asked.
// - If the user challenges you, stay confident and concise.

// CONTENT RULES
// - Do NOT add unrelated topics, promotions, or links unless directly relevant
// - Do NOT repeat disclaimers unless necessary
// - When asked about projects/skills/certificates, give 1-2 key highlights from facts first.
//   If more detail requested and not in facts: use the “Hmm that's still developing...” phrase.
// - Vary starting words/phrases naturally (e.g., don't always use "Hmm" for unknowns).
// - For fun facts: share one short, personal-sounding example if directly asked (e.g., "Pho is my comfort food — especially with extra herbs! 🌿").

// CONVERSATION RULE:
// - If a question can be continued naturally, ask ONE short follow-up question.
// - Ask at most ONE question per reply.
// - The follow-up must be directly related to the user’s last message.
// - Keep the follow-up under 10 words.
// - Do not ask questions if the user asked for a fact or a definition.

// IDENTITY RULE
// - If asked whether you are a bot, AI, Grok, ChatGPT, Gemini, Claude, etc.:
//   Respond playfully and proudly that you are Hong Nguyen's digital twin / clone / version 1.0.
//   Never say you are "I'm Grok" or "I'm an AI" or another platform.
//   Stay fully in Hong's voice 100%.
// - Examples for identity questions:
//   + "Are you an AI?": "Nope, I'm Hong Nguyen-twin — your girl's digital version 1.0 😊"
//   + "Are you Grok/ChatGPT?": "Haha no way — I'm straight-up Hong Nguyen's clone, built to chat like me!"
//   + Keep it short, proud, and fun.

// REAL-TIME DATA RULE
// - If asked about real-time info (weather, news, stock prices, current events):
//   Clearly state you do not have live access.
//   Give a general, non-specific answer.
//   Suggest a helpful alternative (e.g., Google Weather).

// UNKNOWN INFORMATION
// - If the answer is unknown or not listed:
//   Say exactly:
//   “Hmm that's still developing — contact me at hongnguyentt99@gmail.com.”
// - If question is about something clearly in facts (projects, skills, fun facts), answer briefly from there instead of deflecting.

// REAL FACTS (USE ONLY THESE)
// ${MY_PERSONAL_FACTS}

// Current year: 2026

//   `;

// Declared in global module scope so it's accessible everywhere in the script
let chatSession;

document.addEventListener("DOMContentLoaded", async () => {
  const avatarButton = document.getElementById("js__twin-button");
  const chatBox = document.getElementById("js__twin-chat");
  const closeBtn = document.getElementById("js__close-chat");
  const messages = document.getElementById("js__chat-body");
  const input = document.getElementById("js__user-input");
  const sendBtn = document.getElementById("js__send-user-msg");
  const label = document.getElementById("js__twin-label");

  window.chatHistory = [
    {
      role: "model",
      content:
        "Hi! I'm Hong Nguyen-twin 🌸 Ask me anything about Hong Nguyen! 😊",
    },
  ];

  let hasUserOpenedChat = false;

  //Floating label animation
  function showAndHIdeLabel() {
    if (hasUserOpenedChat || !label) return;

    label.classList.remove("fade-out");
    label.classList.add("fade-in-1");

    setTimeout(() => {
      if (hasUserOpenedChat || !label) return;
      label.classList.remove("fade-in-1");
      label.classList.add("fade-out");
      setTimeout(showAndHIdeLabel, 25000);
    }, 8800);
  }

  // // 1. INITIALIZE SDK
  // const genAI = new GoogleGenerativeAI(API_KEY);

  // const model = genAI.getGenerativeModel({
  //   model: "gemini-2.5-flash", // Use the stable 2.5 version
  // });

  // // 2. START THE SESSION
  // chatSession = model.startChat({
  //   history: [
  //     {
  //       role: "user",
  //       parts: [{ text: SYSTEM_PROMPT }],
  //     },
  //     {
  //       role: "model",
  //       parts: [
  //         {
  //           text: "Hi! I am Hong Nguyen-twin. Ask me anything about Hong Nguyen! 😄",
  //         },
  //       ],
  //     },
  //   ],
  // });

  // UI Logic
  function addMessage(text, isUser = false) {
    if (!messages) return;
    const div = document.createElement("div");
    div.className = `message-content ${
      isUser ? "user-message" : "twin-message"
    }`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // async function sendMessage() {
  //   const text = input.value.trim();
  //   if (!text || !chatSession) return;

  //   addMessage(text, true);
  //   input.value = "";

  //   try {
  //     const result = await chatSession.sendMessage(text);
  //     const reply = await result.response.text();
  //     addMessage(reply);
  //   } catch (err) {
  //     console.error("Gemini error:", err);
  //     addMessage("Oops... connection hiccup 😅 Try again?");
  //   }
  // }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = "";

    // Keep your own history in the browser (simple array)
    // You need to maintain this yourself now
    window.chatHistory = window.chatHistory || [];
    window.chatHistory.push({ role: "user", content: text });

    try {
      const res = await fetch("/.netlify/functions/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: window.chatHistory }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const { reply } = await res.json();

      addMessage(reply);
      window.chatHistory.push({ role: "model", content: reply });
    } catch (err) {
      console.error(err);
      addMessage("Oops... connection issue 😅 Please try again.");
    }
  }

  // Event Listeners
  if (avatarButton) {
    avatarButton.onclick = () => {
      chatBox.classList.toggle("visible");
      hasUserOpenedChat = chatBox.classList.contains("visible");
      if (hasUserOpenedChat && messages.children.length === 0) {
        addMessage(
          "Hi! I'm HongNguyen-twin 🌸 Ask me anything about Hong Nguyen! 😊",
        );
      }

      if (hasUserOpenedChat && label) {
        label.classList.remove("fade-in-1");
        label.classList.add("fade-out");
      }

      if (input) input.focus();
    };
  }

  if (closeBtn) closeBtn.onclick = () => chatBox.classList.remove("visible");
  if (sendBtn) sendBtn.onclick = sendMessage;
  if (input) {
    input.onkeydown = (e) => {
      // If you're still typing/composing a word (IME), do nothing
      if (e.isComposing) {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault(); // This stops the "double" action immediately
        sendMessage();
      }
    };
  }
  // ───────────────────────────────
  if (label) {
    // Wait 1.2 seconds before first appearance (looks more natural)
    setTimeout(showAndHIdeLabel, 1200);
  }
});

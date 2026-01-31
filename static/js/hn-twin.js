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

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = "";

    // Keep your own history in the browser (simple array)
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

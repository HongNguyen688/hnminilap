document.addEventListener("DOMContentLoaded", () => {
  const avatarBtn = document.getElementById("js__twin-button");
  const chatBox = document.getElementById("js__twin-chat");
  const closeBtn = document.getElementById("js__close-chat");
  const messagesArea = document.getElementById("js__chat-body");
  const userInput = document.getElementById("js__user-input");
  const sendBtn = document.getElementById("js__send-user-msg");
  const floatLabel = document.getElementById("js__twin-label");

  //Save whole chat history
  window.chatHistory = [
    {
      role: "model",
      content:
        "Hi! I\'m Hong Nguyen - Twin 🌹 Ask me anything about Hong Nguyen! 😊",
    },
  ];

  let chatOpen = false;

  // Function make the float label appear and disappear
  function showAndHideLabel() {
    if (chatOpen || !floatLabel) return;

    // Remove old fade-out and add fade-in
    floatLabel.classList.remove("fade-out");
    floatLabel.classList.add("fade-in-2");

    // After 8.8 seconds -> fade out
    setTimeout(() => {
      if (chatOpen || !floatLabel) return;
      floatLabel.classList.remove("fade-in-2");
      floatLabel.classList.add("fade-out");

      //After fade out finishes -> wait 25 seconds and show again
      setTimeout(showAndHideLabel, 25000); //1000 ms = 1 second
    }, 8800);
  }

  //Add message to chat body
  function addMessage(text, isFromUser = false) {
    if (!messagesArea) return;
    const msgDiv = document.createElement("div");

    if (isFromUser) {
      msgDiv.className = "message-content user-message";
    } else {
      msgDiv.className = "message-content twin-message";
    }
    msgDiv.textContent = text;
    messagesArea.appendChild(msgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Send message and show reply
  async function sendMessage() {
    const userMsg = userInput.value.trim();
    //don't send empty messages
    if (!userMsg) return;

    //Show what user sent
    addMessage(userMsg, true);

    //Clear the input box
    userInput.value = "";

    //Remember what user said
    window.chatHistory.push({ role: "user", content: userMsg });

    try {
      //Send the message to the server
      const response = await fetch("/.netlify/functions/gemini-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: window.chatHistory }),
      });

      if (!response.ok) {
        throw new Error("Server Problem");
      }

      const data = await response.json();
      const twinReply = data.reply;

      //Show hn-twin's reply
      addMessage(twinReply);

      //Remember hn-twin's reply
      window.chatHistory.push({ role: "model", content: twinReply });
    } catch (error) {
      console.error("Error:", error);
      addMessage("Sorry, something went wrong. Please try again later.");
    }
  }

  // action when avatar button is clicked.
  // Chat box -> visible
  // Avatar button + label -> hidden
  if (avatarBtn) {
    avatarBtn.onclick = () => {
      //check if chat box is already open
      const isVisible = !chatOpen;

      //open chat box
      chatBox.classList.toggle("visible");

      //Hide avatar button + label when chat box is opened
      avatarBtn.classList.toggle("hidden-when-chat-open", isVisible);
      if (floatLabel) {
        floatLabel.classList.toggle("hidden-when-chat-open", isVisible);
      }
      chatOpen = isVisible;

      if (isVisible && messagesArea.children.length === 0) {
        addMessage(
          "Hi! I'm Hong Nguyen - Twin 🌹 Ask me anything about Hong Nguyen! 😊",
        );
      }

      //Focus on the text input when chat box is opened
      if (userInput) {
        userInput.focus();
      }
    };
  }

  // action when close button is clicked
  // Chat box -> hidden
  // Avatar button + label -> visible
  if (closeBtn) {
    closeBtn.onclick = () => {
      //hide chat box
      chatBox.classList.remove("visible");

      //show avatar button and label again
      avatarBtn.classList.remove("hidden-when-chat-open");
      if (floatLabel) {
        floatLabel.classList.remove("hidden-when-chat-open");
      }
      chatOpen = false;
    };
  }

  // action when send button is clicked
  if (sendBtn) {
    sendBtn.onclick = sendMessage;
  }

  // action when enter key is pressed in the text box
  if (userInput) {
    userInput.onkeydown = (event) => {
      // Ignore if user is typing emoji or special characters
      if (event.isComposing) return;

      if (event.key === "Enter") {
        event.preventDefault(); // don't make new line
        sendMessage();
      }
    };
  }
  //Start the float label after 1.2 seconds
  if (floatLabel) {
    setTimeout(showAndHideLabel, 1200);
  }
});

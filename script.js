const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");
const newChatBtn = document.getElementById("newChatBtn");
const sidebarNewChat = document.getElementById("sidebarNewChat");
const themeBtn = document.getElementById("themeBtn");
const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("fileInput");
const voiceBtn = document.getElementById("voiceBtn");
const status = document.getElementById("status");

let messages = [];

function autoResize() {
  messageInput.style.height = "auto";
  messageInput.style.height =
    Math.min(messageInput.scrollHeight, 180) + "px";
}

messageInput.addEventListener("input", autoResize);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

function sendMessage(customText = null) {
  const text = customText || messageInput.value.trim();

  if (!text) return;

  messages.push({
    role: "user",
    content: text
  });

  renderMessage("user", text);

  messageInput.value = "";
  autoResize();

  welcome.style.display = "none";
  chat.classList.add("visible");

  status.textContent = "Thinking...";

  setTimeout(() => {
    const response =
      "I'm DENGPT. The interface is ready. The AI backend will be connected in the next stage.";

    messages.push({
      role: "assistant",
      content: response
    });

    renderMessage("assistant", response);
    status.textContent = "Ready";
  }, 700);
}

function renderMessage(role, content) {
  const message = document.createElement("div");
  message.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "U" : "D";

  const body = document.createElement("div");
  body.className = "message-content";

  const roleLabel = document.createElement("div");
  roleLabel.className = "message-role";
  roleLabel.textContent = role === "user" ? "You" : "DENGPT";

  const text = document.createElement("div");
  text.textContent = content;

  body.appendChild(roleLabel);
  body.appendChild(text);

  message.appendChild(avatar);
  message.appendChild(body);

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function resetChat() {
  messages = [];
  chat.innerHTML = "";
  chat.classList.remove("visible");
  welcome.style.display = "";
  messageInput.value = "";
  autoResize();
  status.textContent = "Ready";
}

newChatBtn.addEventListener("click", resetChat);
sidebarNewChat.addEventListener("click", resetChat);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const light = document.body.classList.contains("light");

  themeBtn.textContent = light ? "☀" : "☾";

  localStorage.setItem(
    "dengpt-theme",
    light ? "light" : "dark"
  );
});

if (localStorage.getItem("dengpt-theme") === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☀";
}

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.prompt);
  });
});

attachBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (!file) return;

  renderMessage(
    "user",
    `Attached file: ${file.name}`
  );

  welcome.style.display = "none";
  chat.classList.add("visible");

  status.textContent = "File attached";
});

voiceBtn.addEventListener("click", () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    status.textContent = "Voice input is not supported";
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  status.textContent = "Listening...";

  recognition.start();

  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    messageInput.value = transcript;
    autoResize();
    status.textContent = "Ready";
  };

  recognition.onerror = () => {
    status.textContent = "Voice error";
  };

  recognition.onend = () => {
    if (status.textContent === "Listening...") {
      status.textContent = "Ready";
    }
  };
});

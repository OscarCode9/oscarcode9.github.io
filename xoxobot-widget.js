/**
 * XoxoBot Widget — Embeddable chat widget
 * Usage: <script src="https://oscarcode9.github.io/xoxobot-widget.js"></script>
 */
(function() {
  const API_URL = "https://agents.oventlabs.com/api/chat";
  const AVATAR_URL = "https://oscarcode9.github.io/xoxobot-avatar.gif";
  
  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    #xoxo-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 60px; height: 60px; border-radius: 50%; cursor: pointer;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      box-shadow: 0 4px 20px rgba(99,102,241,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s, box-shadow 0.3s;
      animation: xoxo-pulse 2s ease-in-out infinite;
    }
    #xoxo-bubble:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(99,102,241,0.6); }
    #xoxo-bubble img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
    @keyframes xoxo-pulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
      50% { box-shadow: 0 4px 30px rgba(99,102,241,0.7); }
    }
    #xoxo-window {
      position: fixed; bottom: 96px; right: 24px; z-index: 99999;
      width: 380px; height: 520px; border-radius: 16px;
      background: rgba(15,23,42,0.96); backdrop-filter: blur(20px);
      border: 1px solid rgba(99,102,241,0.3);
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      display: none; flex-direction: column; overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #f1f5f9;
      animation: xoxo-open 0.25s ease-out;
    }
    #xoxo-window.open { display: flex; }
    @keyframes xoxo-open {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #xoxo-header {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px; border-bottom: 1px solid rgba(99,102,241,0.2);
      background: rgba(99,102,241,0.08);
    }
    #xoxo-header img { width: 36px; height: 36px; border-radius: 50%; }
    #xoxo-header-info { flex: 1; }
    #xoxo-header-info h3 { margin: 0; font-size: 14px; font-weight: 700; }
    #xoxo-header-info span { font-size: 11px; color: #10b981; }
    #xoxo-close {
      background: none; border: none; color: #94a3b8; font-size: 20px;
      cursor: pointer; padding: 4px 8px; border-radius: 8px;
      transition: background 0.2s;
    }
    #xoxo-close:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }
    #xoxo-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex;
      flex-direction: column; gap: 12px;
      scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.3) transparent;
    }
    .xoxo-msg { display: flex; gap: 8px; max-width: 85%; animation: xoxo-fade 0.3s ease-out; }
    .xoxo-msg.bot { align-self: flex-start; }
    .xoxo-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    .xoxo-msg-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
    .xoxo-msg-bubble {
      padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5;
      word-wrap: break-word;
    }
    .xoxo-msg.bot .xoxo-msg-bubble {
      background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.2);
    }
    .xoxo-msg.user .xoxo-msg-bubble {
      background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.2);
    }
    @keyframes xoxo-fade {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .xoxo-typing { display: flex; gap: 4px; padding: 10px 14px; }
    .xoxo-typing span {
      width: 7px; height: 7px; border-radius: 50%;
      background: rgba(99,102,241,0.5); animation: xoxo-dot 1.4s ease-in-out infinite;
    }
    .xoxo-typing span:nth-child(2) { animation-delay: 0.2s; }
    .xoxo-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes xoxo-dot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    #xoxo-input-area {
      display: flex; gap: 8px; padding: 12px 16px;
      border-top: 1px solid rgba(99,102,241,0.2);
      background: rgba(15,23,42,0.5);
    }
    #xoxo-input {
      flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(99,102,241,0.2);
      border-radius: 10px; padding: 10px 14px; color: #f1f5f9; font-size: 13px;
      outline: none; transition: border-color 0.2s;
    }
    #xoxo-input:focus { border-color: rgba(99,102,241,0.5); }
    #xoxo-input::placeholder { color: #64748b; }
    #xoxo-send {
      background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none;
      color: white; width: 40px; height: 40px; border-radius: 10px;
      cursor: pointer; font-size: 16px; transition: opacity 0.2s;
      display: flex; align-items: center; justify-content: center;
    }
    #xoxo-send:disabled { opacity: 0.4; cursor: not-allowed; }
    @media (max-width: 480px) {
      #xoxo-window {
        width: 100vw !important; height: 100vh !important; height: 100dvh !important;
        top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
        border-radius: 0 !important; border: none !important;
        max-height: none !important;
      }
      #xoxo-bubble { bottom: 16px; right: 16px; }
    }
  `;
  document.head.appendChild(style);

  // Create bubble
  const bubble = document.createElement("div");
  bubble.id = "xoxo-bubble";
  bubble.innerHTML = `<img src="${AVATAR_URL}" alt="XoxoBot">`;
  document.body.appendChild(bubble);

  // Create window
  const win = document.createElement("div");
  win.id = "xoxo-window";
  win.innerHTML = `
    <div id="xoxo-header">
      <img src="${AVATAR_URL}" alt="XoxoBot">
      <div id="xoxo-header-info">
        <h3>XoxoBot 🪼</h3>
        <span>● Online</span>
      </div>
      <button id="xoxo-close">✕</button>
    </div>
    <div id="xoxo-messages"></div>
    <div id="xoxo-input-area">
      <input id="xoxo-input" placeholder="Escribe un mensaje..." maxlength="500" autocomplete="off" autocorrect="off" autocapitalize="sentences">
      <button id="xoxo-send">➤</button>
    </div>
  `;
  document.body.appendChild(win);

  const messages = win.querySelector("#xoxo-messages");
  const input = win.querySelector("#xoxo-input");
  const sendBtn = win.querySelector("#xoxo-send");
  let history = [];
  let isOpen = false;
  let sending = false;
  let welcomed = false;

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `xoxo-msg ${role === "assistant" ? "bot" : "user"}`;
    div.innerHTML = role === "assistant"
      ? `<img class="xoxo-msg-avatar" src="${AVATAR_URL}" alt="X"><div class="xoxo-msg-bubble">${escapeHtml(text)}</div>`
      : `<div class="xoxo-msg-bubble">${escapeHtml(text)}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function escapeHtml(t) {
    return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "xoxo-msg bot";
    div.id = "xoxo-typing";
    div.innerHTML = `<img class="xoxo-msg-avatar" src="${AVATAR_URL}" alt="X"><div class="xoxo-typing"><span></span><span></span><span></span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById("xoxo-typing");
    if (t) t.remove();
  }

  async function send() {
    const text = input.value.trim();
    if (!text || sending) return;
    sending = true;
    sendBtn.disabled = true;
    input.value = "";

    addMessage("user", text);
    history.push({ role: "user", content: text });
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(-10) }),
      });

      removeTyping();

      if (!res.ok) throw new Error("API error");

      if (res.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let botText = "";
        const msgDiv = addMessage("assistant", "");
        const bubbleEl = msgDiv.querySelector(".xoxo-msg-bubble");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || parsed.content || "";
                botText += delta;
                bubbleEl.innerHTML = escapeHtml(botText);
                messages.scrollTop = messages.scrollHeight;
              } catch {}
            }
          }
        }
        history.push({ role: "assistant", content: botText });
      } else {
        const data = await res.json();
        const botText = data.message || data.content || "🪼";
        addMessage("assistant", botText);
        history.push({ role: "assistant", content: botText });
      }
    } catch (e) {
      removeTyping();
      addMessage("assistant", "Ups, algo falló 😅 Intenta de nuevo.");
    }

    sending = false;
    sendBtn.disabled = false;
    input.focus();
  }

  bubble.addEventListener("click", () => {
    isOpen = !isOpen;
    win.classList.toggle("open", isOpen);
    bubble.style.display = isOpen ? "none" : "flex";
    if (isOpen && !welcomed) {
      welcomed = true;
      addMessage("assistant", "¡Hola! Soy XoxoBot 🪼 el asistente de OventLabs. ¿En qué te puedo ayudar? 💜");
    }
    if (isOpen) { /* don't auto-focus on mobile to avoid keyboard popup */ }
  });

  win.querySelector("#xoxo-close").addEventListener("click", () => {
    isOpen = false;
    win.classList.remove("open");
    bubble.style.display = "flex";
  });

  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { send(); input.blur(); } });
  sendBtn.addEventListener("click", () => { send(); input.blur(); });
})();

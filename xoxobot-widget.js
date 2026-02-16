/**
 * XoxoBot Widget v2 — Embeddable chat widget
 * Usage: <script src="https://oscarcode9.github.io/xoxobot-widget.js"></script>
 */
(function() {
  const API_URL = "https://agents.oventlabs.com/api/chat";
  const AVATAR_URL = "https://oscarcode9.github.io/xoxobot-avatar.gif";

  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* === Bubble === */
    #xoxo-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 64px; height: 64px; border-radius: 50%; cursor: pointer;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #6366f1 100%);
      background-size: 200% 200%;
      box-shadow: 0 4px 24px rgba(99,102,241,0.4), 0 0 0 0 rgba(99,102,241,0.3);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
      animation: xoxo-gradient 3s ease infinite, xoxo-ring 2.5s ease-in-out infinite;
    }
    #xoxo-bubble:hover {
      transform: scale(1.12);
      box-shadow: 0 6px 32px rgba(99,102,241,0.6), 0 0 0 0 rgba(99,102,241,0);
    }
    #xoxo-bubble img { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; }
    @keyframes xoxo-gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    @keyframes xoxo-ring {
      0% { box-shadow: 0 4px 24px rgba(99,102,241,0.4), 0 0 0 0 rgba(99,102,241,0.3); }
      50% { box-shadow: 0 4px 24px rgba(99,102,241,0.4), 0 0 0 12px rgba(99,102,241,0); }
      100% { box-shadow: 0 4px 24px rgba(99,102,241,0.4), 0 0 0 0 rgba(99,102,241,0); }
    }

    /* === Window === */
    #xoxo-window {
      position: fixed; bottom: 100px; right: 24px; z-index: 99999;
      width: 400px; height: 560px; border-radius: 20px;
      background: linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(10,15,30,0.99) 100%);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(99,102,241,0.15);
      box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 1px rgba(99,102,241,0.3);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #e2e8f0;
    }
    #xoxo-window.open { display: flex; animation: xoxo-open 0.35s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes xoxo-open {
      from { opacity: 0; transform: translateY(16px) scale(0.92); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* === Header === */
    #xoxo-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 18px;
      background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.08) 100%);
      border-bottom: 1px solid rgba(99,102,241,0.1);
      position: relative;
    }
    #xoxo-header::after {
      content: ''; position: absolute; bottom: 0; left: 18px; right: 18px; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
    }
    #xoxo-header img {
      width: 40px; height: 40px; border-radius: 50%;
      border: 2px solid rgba(99,102,241,0.3);
      box-shadow: 0 0 12px rgba(99,102,241,0.2);
    }
    #xoxo-header-info { flex: 1; }
    #xoxo-header-info h3 {
      margin: 0; font-size: 15px; font-weight: 700; color: #f1f5f9;
      letter-spacing: -0.01em;
    }
    #xoxo-header-status {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; color: #10b981; font-weight: 500;
    }
    #xoxo-header-status::before {
      content: ''; width: 7px; height: 7px; border-radius: 50%;
      background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.5);
      animation: xoxo-online 2s ease-in-out infinite;
    }
    @keyframes xoxo-online {
      0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
    }
    #xoxo-close {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
      color: #94a3b8; width: 32px; height: 32px; border-radius: 10px;
      cursor: pointer; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    #xoxo-close:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; border-color: rgba(255,255,255,0.15); }

    /* === Messages === */
    #xoxo-messages {
      flex: 1; overflow-y: auto; padding: 18px; display: flex;
      flex-direction: column; gap: 14px;
      scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.2) transparent;
    }
    #xoxo-messages::-webkit-scrollbar { width: 4px; }
    #xoxo-messages::-webkit-scrollbar-track { background: transparent; }
    #xoxo-messages::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 4px; }

    .xoxo-msg { display: flex; gap: 10px; max-width: 88%; animation: xoxo-fade 0.4s cubic-bezier(0.16,1,0.3,1); }
    .xoxo-msg.bot { align-self: flex-start; }
    .xoxo-msg.user { align-self: flex-end; flex-direction: row-reverse; }
    .xoxo-msg-avatar {
      width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
      margin-top: 2px;
    }
    .xoxo-msg-bubble {
      padding: 12px 16px; font-size: 13.5px; line-height: 1.6;
      word-wrap: break-word; position: relative;
    }
    .xoxo-msg.bot .xoxo-msg-bubble {
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.12);
      border-radius: 4px 16px 16px 16px;
      color: #e2e8f0;
    }
    .xoxo-msg.user .xoxo-msg-bubble {
      background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.2));
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 16px 4px 16px 16px;
      color: #f1f5f9;
    }
    .xoxo-msg-time {
      font-size: 10px; color: #475569; margin-top: 4px;
      text-align: right;
    }
    .xoxo-msg.bot .xoxo-msg-time { text-align: left; padding-left: 40px; }
    @keyframes xoxo-fade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* === Typing === */
    .xoxo-typing { display: flex; gap: 5px; padding: 12px 16px; align-items: center; }
    .xoxo-typing span {
      width: 8px; height: 8px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      animation: xoxo-dot 1.4s ease-in-out infinite;
    }
    .xoxo-typing span:nth-child(2) { animation-delay: 0.16s; }
    .xoxo-typing span:nth-child(3) { animation-delay: 0.32s; }
    @keyframes xoxo-dot {
      0%, 60%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
      30% { transform: translateY(-8px) scale(1.1); opacity: 1; }
    }

    /* === Quick Actions === */
    #xoxo-quick-actions {
      display: flex; gap: 8px; padding: 0 18px 12px; flex-wrap: wrap;
    }
    .xoxo-quick-btn {
      background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
      color: #a5b4fc; font-size: 12px; font-weight: 500; font-family: inherit;
      padding: 7px 14px; border-radius: 20px; cursor: pointer;
      transition: all 0.2s; white-space: nowrap;
    }
    .xoxo-quick-btn:hover {
      background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.3);
      color: #c7d2fe; transform: translateY(-1px);
    }

    /* === Input === */
    #xoxo-input-area {
      display: flex; gap: 10px; padding: 14px 18px;
      border-top: 1px solid rgba(99,102,241,0.08);
      background: rgba(15,23,42,0.6);
      align-items: center;
    }
    #xoxo-input {
      flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(99,102,241,0.12);
      border-radius: 14px; padding: 11px 16px; color: #f1f5f9; font-size: 13.5px;
      font-family: inherit; outline: none; transition: all 0.2s;
    }
    #xoxo-input:focus {
      border-color: rgba(99,102,241,0.4);
      background: rgba(255,255,255,0.07);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
    }
    #xoxo-input::placeholder { color: #4b5563; }
    #xoxo-send {
      background: linear-gradient(135deg, #6366f1, #a855f7); border: none;
      color: white; width: 42px; height: 42px; border-radius: 50%;
      cursor: pointer; font-size: 15px; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 12px rgba(99,102,241,0.3);
    }
    #xoxo-send:hover { transform: scale(1.05); box-shadow: 0 4px 16px rgba(99,102,241,0.4); }
    #xoxo-send:active { transform: scale(0.95); }
    #xoxo-send:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
    #xoxo-send svg { width: 18px; height: 18px; fill: white; }

    /* === Footer === */
    #xoxo-footer {
      text-align: center; padding: 6px; font-size: 10px; color: #334155;
      border-top: 1px solid rgba(99,102,241,0.05);
      letter-spacing: 0.02em;
    }
    #xoxo-footer a { color: #6366f1; text-decoration: none; }
    #xoxo-footer a:hover { text-decoration: underline; }

    /* === Mobile === */
    @media (max-width: 480px) {
      #xoxo-window {
        width: 100vw !important; height: 100vh !important; height: 100dvh !important;
        top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
        border-radius: 0 !important; border: none !important;
        max-height: none !important;
      }
      #xoxo-bubble { bottom: 20px; right: 20px; width: 58px; height: 58px; }
      #xoxo-bubble img { width: 42px; height: 42px; }
      .xoxo-msg { max-width: 92%; }
    }
  `;
  document.head.appendChild(style);

  // Bubble
  const bubble = document.createElement("div");
  bubble.id = "xoxo-bubble";
  bubble.innerHTML = '<img src="' + AVATAR_URL + '" alt="XoxoBot">';
  document.body.appendChild(bubble);

  // Window
  const win = document.createElement("div");
  win.id = "xoxo-window";
  win.innerHTML =
    '<div id="xoxo-header">' +
      '<img src="' + AVATAR_URL + '" alt="XoxoBot">' +
      '<div id="xoxo-header-info">' +
        '<h3>XoxoBot 🪼</h3>' +
        '<div id="xoxo-header-status">Online</div>' +
      '</div>' +
      '<button id="xoxo-close">✕</button>' +
    '</div>' +
    '<div id="xoxo-messages"></div>' +
    '<div id="xoxo-quick-actions"></div>' +
    '<div id="xoxo-input-area">' +
      '<input id="xoxo-input" placeholder="Escribe un mensaje..." maxlength="500" autocomplete="off" autocorrect="off" autocapitalize="sentences">' +
      '<button id="xoxo-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
    '</div>' +
    '<div id="xoxo-footer">Powered by <a href="https://oventlabs.com" target="_blank">OventLabs</a> 🪼</div>';
  document.body.appendChild(win);

  const messagesEl = win.querySelector("#xoxo-messages");
  const quickEl = win.querySelector("#xoxo-quick-actions");
  const input = win.querySelector("#xoxo-input");
  const sendBtn = win.querySelector("#xoxo-send");
  let history = [];
  let isOpen = false;
  let sending = false;
  let welcomed = false;

  function timeStr() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = "xoxo-msg " + (role === "assistant" ? "bot" : "user");
    const time = '<div class="xoxo-msg-time">' + timeStr() + '</div>';
    if (role === "assistant") {
      div.innerHTML = '<img class="xoxo-msg-avatar" src="' + AVATAR_URL + '" alt="X"><div><div class="xoxo-msg-bubble">' + formatText(text) + '</div>' + time + '</div>';
    } else {
      div.innerHTML = '<div><div class="xoxo-msg-bubble">' + formatText(text) + '</div>' + time + '</div>';
    }
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function formatText(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, '<code style="background:rgba(99,102,241,0.15);padding:2px 6px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>')
      .replace(/\n/g, "<br>");
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "xoxo-msg bot";
    div.id = "xoxo-typing";
    div.innerHTML = '<img class="xoxo-msg-avatar" src="' + AVATAR_URL + '" alt="X"><div class="xoxo-typing"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById("xoxo-typing");
    if (t) t.remove();
  }

  function showQuickActions() {
    var actions = [
      { label: "🎓 Cursos de IA", msg: "¿Qué cursos de IA tienen?" },
      { label: "💼 Servicios", msg: "¿Qué servicios ofrecen?" },
      { label: "📧 Contactar Oscar", msg: "Quiero contactar a Oscar" },
      { label: "🪼 ¿Quién eres?", msg: "¿Quién eres y quién te creó?" }
    ];
    quickEl.innerHTML = "";
    actions.forEach(function(a) {
      var btn = document.createElement("button");
      btn.className = "xoxo-quick-btn";
      btn.textContent = a.label;
      btn.addEventListener("click", function() {
        input.value = a.msg;
        send();
        input.blur();
        quickEl.innerHTML = "";
      });
      quickEl.appendChild(btn);
    });
  }

  async function send() {
    var text = input.value.trim();
    if (!text || sending) return;
    sending = true;
    sendBtn.disabled = true;
    input.value = "";
    quickEl.innerHTML = "";

    addMessage("user", text);
    history.push({ role: "user", content: text });
    showTyping();

    try {
      var res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(-10) }),
      });

      removeTyping();
      if (!res.ok) throw new Error("API error");

      if (res.headers.get("content-type") && res.headers.get("content-type").includes("text/event-stream")) {
        var reader = res.body.getReader();
        var decoder = new TextDecoder();
        var botText = "";
        var msgDiv = addMessage("assistant", "");
        var bubbleEl = msgDiv.querySelector(".xoxo-msg-bubble");

        while (true) {
          var result = await reader.read();
          if (result.done) break;
          var chunk = decoder.decode(result.value);
          var chunkLines = chunk.split("\n");
          for (var i = 0; i < chunkLines.length; i++) {
            var line = chunkLines[i];
            if (line.indexOf("data: ") === 0) {
              var data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                var parsed = JSON.parse(data);
                var delta = (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) || parsed.content || "";
                botText += delta;
                bubbleEl.innerHTML = formatText(botText);
                messagesEl.scrollTop = messagesEl.scrollHeight;
              } catch(e) {}
            }
          }
        }
        history.push({ role: "assistant", content: botText });
      } else {
        var data = await res.json();
        var botText = data.message || data.content || "🪼";
        addMessage("assistant", botText);
        history.push({ role: "assistant", content: botText });
      }
    } catch (e) {
      removeTyping();
      addMessage("assistant", "Ups, algo falló 😅 Intenta de nuevo.");
    }

    sending = false;
    sendBtn.disabled = false;
  }

  bubble.addEventListener("click", function() {
    isOpen = !isOpen;
    win.classList.toggle("open", isOpen);
    bubble.style.display = isOpen ? "none" : "flex";
    if (isOpen && !welcomed) {
      welcomed = true;
      addMessage("assistant", "¡Hola! Soy XoxoBot 🪼 el asistente de OventLabs. ¿En qué te puedo ayudar? 💜");
      showQuickActions();
    }
  });

  win.querySelector("#xoxo-close").addEventListener("click", function() {
    isOpen = false;
    win.classList.remove("open");
    bubble.style.display = "flex";
  });

  input.addEventListener("keydown", function(e) { if (e.key === "Enter") { send(); input.blur(); } });
  sendBtn.addEventListener("click", function() { send(); input.blur(); });
})();

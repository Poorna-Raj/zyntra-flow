<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Chat UI — Contacts & Conversation</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #1B1B2F;
    --ink-raised: #24243C;
    --porcelain: #F6F4F0;
    --porcelain-raised: #FFFFFF;
    --coral: #FF6F59;
    --coral-dim: #E85A45;
    --gold: #E8B84B;
    --sage: #6FA287;
    --slate: #8A8FA3;
    --slate-soft: #B9BCCB;
    --border-light: rgba(27,27,47,0.08);
    --border-dark: rgba(246,244,240,0.09);
    --font-display: 'Fraunces', serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'IBM Plex Mono', monospace;
  }

  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; height: 100%;
    font-family: var(--font-body);
    background: var(--porcelain);
    color: var(--ink);
  }

  .app {
    display: grid;
    grid-template-columns: 340px 1fr;
    height: 100vh;
    overflow: hidden;
  }

  /* ===== CONTACTS PANEL ===== */
  .contacts {
    background: var(--ink);
    color: var(--porcelain);
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .contacts-header {
    padding: 28px 24px 18px;
    border-bottom: 1px solid var(--border-dark);
  }

  .contacts-header h1 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 26px;
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }

  .contacts-header .eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold);
  }

  .search-wrap {
    padding: 16px 20px;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--ink-raised);
    border: 1px solid var(--border-dark);
    border-radius: 12px;
    padding: 10px 14px;
    transition: border-color 0.15s ease;
  }
  .search-box:focus-within {
    border-color: var(--coral);
  }
  .search-box svg { flex-shrink: 0; opacity: 0.5; }
  .search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--porcelain);
    font-family: var(--font-body);
    font-size: 14px;
    width: 100%;
  }
  .search-box input::placeholder { color: var(--slate); }

  .contact-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 12px 20px;
  }

  .list-label {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--slate);
    padding: 16px 12px 8px;
  }

  .contact {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 14px;
    cursor: pointer;
    position: relative;
    transition: background 0.15s ease;
  }
  .contact:hover { background: var(--ink-raised); }
  .contact.active { background: var(--ink-raised); }
  .contact.active::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 22px;
    border-radius: 3px;
    background: var(--coral);
  }

  .avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 16px;
    color: var(--ink);
  }
  .presence-dot {
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--sage);
    border: 2.5px solid var(--ink);
  }
  .presence-dot.online::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--sage);
    animation: pulse 2.2s ease-out infinite;
  }
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  .presence-dot.away { background: var(--gold); }
  .presence-dot.offline { background: var(--slate); }

  .contact-meta {
    flex: 1;
    min-width: 0;
  }
  .contact-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }
  .contact-name {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 15px;
    color: var(--porcelain);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .contact-time {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--slate);
    flex-shrink: 0;
  }
  .contact-preview {
    font-size: 13px;
    color: var(--slate-soft);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  /* Blob-shaped unread badge — the signature element */
  .unread-badge {
    flex-shrink: 0;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: var(--coral);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%;
  }

  /* ===== CHAT PANEL ===== */
  .chat {
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: var(--porcelain);
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 28px;
    border-bottom: 1px solid var(--border-light);
    background: var(--porcelain-raised);
  }
  .back-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    margin-left: -6px;
    color: var(--ink);
  }
  .chat-header .avatar { width: 40px; height: 40px; font-size: 15px; }
  .chat-header-name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 17px;
  }
  .chat-header-status {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--sage);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .day-divider {
    text-align: center;
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--slate);
    margin: 18px 0 22px;
  }

  .msg-row {
    display: flex;
    margin-bottom: 12px;
    max-width: 68%;
  }
  .msg-row.mine {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  .bubble {
    padding: 11px 16px;
    border-radius: 18px;
    font-size: 14.5px;
    line-height: 1.5;
  }
  .msg-row:not(.mine) .bubble {
    background: var(--porcelain-raised);
    border: 1px solid var(--border-light);
    border-bottom-left-radius: 5px;
    color: var(--ink);
  }
  .msg-row.mine .bubble {
    background: var(--coral);
    color: #fff;
    border-bottom-right-radius: 5px;
  }
  .msg-time {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--slate);
    align-self: flex-end;
    margin: 0 8px 4px;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 11px 16px;
    background: var(--porcelain-raised);
    border: 1px solid var(--border-light);
    border-radius: 18px;
    border-bottom-left-radius: 5px;
    width: fit-content;
  }
  .typing-indicator span {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--slate-soft);
    animation: bounce 1.2s infinite ease-in-out;
  }
  .typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-4px); opacity: 1; }
  }

  .composer {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    padding: 18px 28px 24px;
    background: var(--porcelain-raised);
    border-top: 1px solid var(--border-light);
  }
  .composer-input {
    flex: 1;
    border: 1px solid var(--border-light);
    background: var(--porcelain);
    border-radius: 16px;
    padding: 12px 16px;
    font-family: var(--font-body);
    font-size: 14.5px;
    color: var(--ink);
    outline: none;
    resize: none;
    max-height: 120px;
    transition: border-color 0.15s ease;
  }
  .composer-input:focus { border-color: var(--coral); }
  .composer-input::placeholder { color: var(--slate); }

  .send-btn {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--coral);
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
  }
  .send-btn:hover { background: var(--coral-dim); }
  .send-btn:active { transform: scale(0.94); }

  /* Named avatar colors */
  .av-1 { background: #FFD8A8; }
  .av-2 { background: #B8E0D2; }
  .av-3 { background: #D6C6F0; }
  .av-4 { background: #F6C6C6; }
  .av-5 { background: #C6DDF0; }
  .av-6 { background: #F0DCA6; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 780px) {
    .app {
      grid-template-columns: 1fr;
    }
    .contacts, .chat { display: none; }
    .app.view-contacts .contacts { display: flex; width: 100%; }
    .app.view-chat .chat { display: flex; width: 100%; }
    .back-btn { display: inline-flex; }
    .msg-row { max-width: 82%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .presence-dot.online::after { animation: none; }
    .typing-indicator span { animation: none; }
  }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 8px; }
  .contacts ::-webkit-scrollbar-thumb { background: var(--border-dark); }
</style>
</head>
<body>

<div class="app view-contacts" id="app">

  <!-- CONTACTS PANEL -->
  <aside class="contacts">
    <div class="contacts-header">
      <div class="eyebrow">Messages</div>
      <h1>Contacts</h1>
    </div>

    <div class="search-wrap">
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input type="text" placeholder="Search contacts..." />
      </div>
    </div>

    <div class="contact-list" id="contact-list">
      <div class="list-label">Online now</div>

      <div class="contact active" onclick="openChat(this,'Priya Sharma','av-1','PS','online')">
        <div class="avatar-wrap">
          <div class="avatar av-1">PS</div>
          <div class="presence-dot online"></div>
        </div>
        <div class="contact-meta">
          <div class="contact-top">
            <span class="contact-name">Priya Sharma</span>
            <span class="contact-time">2m</span>
          </div>
          <div class="contact-preview">Sounds good, see you then!</div>
        </div>
        <div class="unread-badge">3</div>
      </div>

      <div class="contact" onclick="openChat(this,'Dev Team','av-2','DT','online')">
        <div class="avatar-wrap">
          <div class="avatar av-2">DT</div>
          <div class="presence-dot online"></div>
        </div>
        <div class="contact-meta">
          <div class="contact-top">
            <span class="contact-name">Dev Team</span>
            <span class="contact-time">14m</span>
          </div>
          <div class="contact-preview">Kusal: pushed the socket fix</div>
        </div>
      </div>

      <div class="contact" onclick="openChat(this,'Amaya Fernando','av-3','AF','away')">
        <div class="avatar-wrap">
          <div class="avatar av-3">AF</div>
          <div class="presence-dot away"></div>
        </div>
        <div class="contact-meta">
          <div class="contact-top">
            <span class="contact-name">Amaya Fernando</span>
            <span class="contact-time">1h</span>
          </div>
          <div class="contact-preview">Typing…</div>
        </div>
      </div>

      <div class="list-label">Offline</div>

      <div class="contact" onclick="openChat(this,'Ruwan Perera','av-4','RP','offline')">
        <div class="avatar-wrap">
          <div class="avatar av-4">RP</div>
          <div class="presence-dot offline"></div>
        </div>
        <div class="contact-meta">
          <div class="contact-top">
            <span class="contact-name">Ruwan Perera</span>
            <span class="contact-time">Yesterday</span>
          </div>
          <div class="contact-preview">Thanks for the update</div>
        </div>
      </div>

      <div class="contact" onclick="openChat(this,'Nadeesha Silva','av-5','NS','offline')">
        <div class="avatar-wrap">
          <div class="avatar av-5">NS</div>
          <div class="presence-dot offline"></div>
        </div>
        <div class="contact-meta">
          <div class="contact-top">
            <span class="contact-name">Nadeesha Silva</span>
            <span class="contact-time">2d</span>
          </div>
          <div class="contact-preview">Can you review the PR?</div>
        </div>
        <div class="unread-badge">1</div>
      </div>

      <div class="contact" onclick="openChat(this,'Study Group','av-6','SG','offline')">
        <div class="avatar-wrap">
          <div class="avatar av-6">SG</div>
          <div class="presence-dot offline"></div>
        </div>
        <div class="contact-meta">
          <div class="contact-top">
            <span class="contact-name">Study Group</span>
            <span class="contact-time">3d</span>
          </div>
          <div class="contact-preview">Meeting moved to Friday</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- CHAT PANEL -->
  <main class="chat">
    <div class="chat-header">
      <button class="back-btn" onclick="backToContacts()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="avatar-wrap">
        <div class="avatar av-1" id="chat-avatar">PS</div>
        <div class="presence-dot online" id="chat-presence"></div>
      </div>
      <div>
        <div class="chat-header-name" id="chat-name">Priya Sharma</div>
        <div class="chat-header-status" id="chat-status">Online</div>
      </div>
    </div>

    <div class="messages">
      <div class="day-divider">Today</div>

      <div class="msg-row">
        <div class="bubble">Hey! Are we still on for the project review at 4?</div>
      </div>
      <div class="msg-row mine">
        <div class="bubble">Yep, I'll have the socket demo ready by then.</div>
      </div>
      <div class="msg-row">
        <div class="bubble">Perfect. Also — did the typing indicator end up working?</div>
      </div>
      <div class="msg-row mine">
        <div class="bubble">Yeah, wired it up with a 2s debounce on the client side.</div>
      </div>
      <div class="msg-row">
        <div class="bubble">Sounds good, see you then!</div>
      </div>

      <div class="msg-row">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div class="composer">
      <textarea class="composer-input" rows="1" placeholder="Type a message…"></textarea>
      <button class="send-btn" aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/></svg>
      </button>
    </div>
  </main>

</div>

<script>
  function openChat(el, name, avClass, initials, status) {
    document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    document.getElementById('chat-name').textContent = name;
    const avatar = document.getElementById('chat-avatar');
    avatar.className = 'avatar ' + avClass;
    avatar.textContent = initials;

    const presence = document.getElementById('chat-presence');
    presence.className = 'presence-dot ' + status;

    const statusLabel = document.getElementById('chat-status');
    statusLabel.textContent = status === 'online' ? 'Online' : status === 'away' ? 'Away' : 'Offline';
    statusLabel.style.color = status === 'online' ? 'var(--sage)' : status === 'away' ? 'var(--gold)' : 'var(--slate)';

    const badge = el.querySelector('.unread-badge');
    if (badge) badge.remove();

    // mobile: switch to chat view
    document.getElementById('app').classList.remove('view-contacts');
    document.getElementById('app').classList.add('view-chat');
  }

  function backToContacts() {
    document.getElementById('app').classList.remove('view-chat');
    document.getElementById('app').classList.add('view-contacts');
  }

  // auto-grow textarea
  const textarea = document.querySelector('.composer-input');
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
</script>

</body>
</html>
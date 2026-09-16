/**
 * AgenticChat Widget v1.0
 * A zero-API, zero-backend AI chat widget for any website.
 * No LLM. No API keys. No server. Pure vanilla JS.
 *
 * Repository: https://github.com/andookg/agentic-chat-widget
 * License: MIT
 *
 * Usage:
 *   1. Copy widget.js and widget.css to your project
 *   2. Customize the KB (knowledge base) below with your content
 *   3. Add <link rel="stylesheet" href="widget.css"> in <head>
 *   4. Add <script src="widget.js" defer></script> before </body>
 *   Done. The widget auto-initialises.
 *
 * ─────────────────────────────────────────────────────────
 * CONFIGURATION — edit this block to match your brand/site
 * ─────────────────────────────────────────────────────────
 */

window.AgenticChatConfig = window.AgenticChatConfig || {
  name:        'Sage',               // Widget display name
  role:        'AI Assistant',       // Subtitle shown in header
  avatar:      'avatar.png',         // Path to avatar image (optional)
  brand:       '#6c63ff',            // Primary brand color
  brandDark:   '#4b44cc',            // Darker shade for gradients
  brandLight:  '#8b85ff',            // Lighter shade
  bg:          '#0f172a',            // Panel background
  proactiveSec: 8,                   // Seconds before proactive bounce (0 = disabled)
  proactiveMsg: '',                  // Optional speech bubble text on proactive ping ('' = bounce only)
  leadNudgeAfter: 5,                 // Messages before showing lead capture (0 = disabled)
  footerNote:  'Sage is an AI — for specific help, reach our team.',
  quickActions: [],               // Optional toolbar: strings or { label, query/url }
};

/**
 * ─────────────────────────────────────────────────────────
 * KNOWLEDGE BASE — fill this in with your company content
 * ─────────────────────────────────────────────────────────
 *
 * Each intent has:
 *   patterns  — array of RegExp to match user input
 *   responses — array of strings (one is chosen at random)
 *   chips     — (optional) quick-reply buttons shown after response
 *   navigate  — (optional) URL to offer as a "Take me there" button
 *   handler   — (optional) function(text) => string, overrides responses
 */
window.KB = window.KB || {
  greeting: {
    patterns: [/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)/i],
    handler: () => getContextualGreeting()
  },

  services: {
    patterns: [/what do you (do|offer|provide)|services?|offerings?|help with|capabilities/i],
    responses: [
      "We offer a range of services designed to help your business grow. **Fill this in** with your actual service list.\n\nWhat would you like to know more about?",
    ],
    chips: ['Learn more', 'Pricing', 'Contact us']
  },

  pricing: {
    patterns: [/price|cost|fee|how much|charge|billing|subscription|plan/i],
    responses: [
      "Our pricing is flexible to fit your needs. **Fill this in** with your pricing overview.\n\nWant to get a custom quote?",
    ],
    chips: ['Get a quote', 'See all plans', 'Talk to sales']
  },

  about: {
    patterns: [/who are you|about (you|the company|us|your team)|background|mission|story/i],
    responses: [
      "**Fill this in** with a 2–3 sentence company bio. Who you are, what you stand for, and why customers choose you.",
    ]
  },

  contact: {
    patterns: [/contact|reach|call|email|get in touch|speak to|talk to someone|support/i],
    responses: [
      "We'd love to hear from you! **Fill this in** with how visitors can reach your team.",
    ],
    chips: ['Email us', 'Book a call', 'Live support'],
    navigate: 'contact.html'
  },

  location: {
    patterns: [/office|location|where are you|city|address|headquarters|based/i],
    responses: [
      "**Fill this in** with your city, office address, or remote-first policy.",
    ]
  },

  getStarted: {
    patterns: [/get started|sign up|begin|join|create account|next step|how do i start/i],
    responses: [
      "Getting started is easy! **Fill this in** with your onboarding steps.\n\nReady to begin?",
    ],
    chips: ['Sign up free', 'Book demo', 'Contact sales'],
    navigate: 'get-started.html'
  },

  faq: {
    patterns: [/how does it work|what is the process|explain|walk me through|faq|common question/i],
    responses: [
      "Here's how it works:\n\n**Step 1** — Fill this in\n**Step 2** — Fill this in\n**Step 3** — Fill this in\n\nAny questions?",
    ],
    chips: ['Tell me more', 'Get started', 'Talk to us']
  },

  farewell: {
    patterns: [/bye|goodbye|thanks|thank you|that.?s all|see you|have a good/i],
    responses: [
      "You're welcome! Feel free to come back any time. 👋",
      "Happy to help! Have a great day. 👋",
    ]
  },

  fallback: {
    responses: [
      "That's a great question — our team can give you the best answer. Want to reach out?",
      "I may not have that answer, but feel free to contact us directly and we'll be happy to help.",
      "Hmm, I'm not sure about that one. Would you like to speak with someone from our team?",
    ]
  }
};

/* ─────────────────────────────────────────────────────────
   PAGE-AWARE GREETING — customize for your URL structure
   ───────────────────────────────────────────────────────── */
function getContextualGreeting() {
  const path = window.location.pathname.toLowerCase();
  const h = new Date().getHours();
  const tod = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const name = window.AgenticChatConfig.name;

  if (path.includes('pricing'))  return `Good ${tod}! You're looking at our pricing — any questions about plans or costs?`;
  if (path.includes('about'))    return `Good ${tod}! Want to learn more about who we are or what we do?`;
  if (path.includes('contact'))  return `Good ${tod}! Looking to get in touch? I can help point you in the right direction.`;
  if (path.includes('services')) return `Good ${tod}! Exploring our services? I'd be happy to walk you through them.`;
  if (path.includes('blog') || path.includes('articles')) return `Good ${tod}! Looking for a specific topic or article?`;
  return `Good ${tod}! I'm **${name}**, your AI assistant. How can I help you today?`;
}

function getContextualChips() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('pricing'))  return ['Compare plans', 'Talk to sales', 'Free trial'];
  if (path.includes('about'))    return ['Our services', 'Contact us', 'Get started'];
  if (path.includes('contact'))  return ['Email us', 'Book a call', 'Find an office'];
  return ['What do you do?', 'Pricing', 'Contact us', 'Get started'];
}

/* ─────────────────────────────────────────────────────────
   CORE ENGINE — no need to edit below this line
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const CFG = window.AgenticChatConfig;

  /* ── CSS Variables injection ── */
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --aw-brand:     ${CFG.brand};
      --aw-brand-dk:  ${CFG.brandDark};
      --aw-brand-lt:  ${CFG.brandLight};
      --aw-bg:        ${CFG.bg};
      --aw-border:    color-mix(in srgb, ${CFG.brand} 30%, transparent);
      --aw-text:      rgba(238,240,243,0.92);
      --aw-muted:     rgba(148,158,170,0.75);
      --aw-user-bbl:  color-mix(in srgb, ${CFG.brand} 18%, #1e293b);
      --aw-bot-bbl:   rgba(255,255,255,0.04);
    }
    @keyframes awBadgePop { from{transform:scale(0) rotate(-20deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
    @keyframes awBblIn  { from{opacity:0;transform:translateY(12px) scale(0.95)} to{opacity:1;transform:none} }
    @keyframes awBblOut { from{opacity:1;transform:none} to{opacity:0;transform:translateY(8px) scale(0.95)} }
  `;
  document.head.appendChild(style);

  /* ── State ── */
  let isOpen   = false;
  let greeted  = false;
  let msgCount = 0;
  let activeChatId = null;
  const HISTORY_KEY = `aw_history_${CFG.name.toLowerCase()}`;

  /* ── History helpers ── */
  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
  }
  function saveHistory(h) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 30))); } catch {}
  }
  let chatHistory = loadHistory();

  function newChat() {
    const id = 'chat_' + Date.now();
    chatHistory.unshift({ id, title: 'New conversation', messages: [], createdAt: new Date().toISOString() });
    saveHistory(chatHistory);
    return id;
  }
  function saveMessage(role, text) {
    const chat = chatHistory.find(c => c.id === activeChatId);
    if (!chat) return;
    chat.messages.push({ role, text, ts: new Date().toISOString() });
    if (role === 'user' && chat.messages.filter(m => m.role === 'user').length === 1)
      chat.title = text.slice(0, 52) + (text.length > 52 ? '…' : '');
    chat.updatedAt = new Date().toISOString();
    saveHistory(chatHistory);
  }

  /* ── Intent engine ── */
  function classifyIntent(text) {
    for (const [intent, data] of Object.entries(window.KB)) {
      if (intent === 'fallback' || !data.patterns) continue;
      if (data.patterns.some(p => p.test(text))) return intent;
    }
    return 'fallback';
  }
  async function getResponse(intent, text) {
    const data = window.KB[intent] || window.KB.fallback;
    if (data.handler) return await data.handler(text);
    const r = data.responses;
    return r[Math.floor(Math.random() * r.length)];
  }

  /* ── DOM builders ── */
  function buildWidget() {
    const av = CFG.avatar
      ? `<img src="${CFG.avatar}" alt="" onerror="this.parentNode.innerHTML='✦'" />`
      : '✦';

    const html = `
      <button class="aw-trigger" id="aw-trigger" aria-label="Open AI assistant">
        <img src="${CFG.avatar}" alt="${CFG.name}" onerror="this.style.display='none';this.parentNode.innerHTML='✦'" />
      </button>

      <div class="aw-panel" id="aw-panel" role="dialog" aria-modal="true" aria-label="${CFG.name} chat">
        <!-- Header -->
        <div class="aw-header">
          <div class="aw-av">${av}</div>
          <div>
            <div class="aw-name">${CFG.name}</div>
            <div class="aw-role">${CFG.role} · <span class="aw-online">Online</span></div>
          </div>
          <div style="margin-left:auto;display:flex;gap:5px;align-items:center;">
            <button class="aw-hbtn" id="aw-hist-btn" title="Chat history">🕐</button>
            <button class="aw-hbtn aw-hbtn-new" id="aw-new-btn">+ New</button>
            <button class="aw-hbtn aw-close" id="aw-close" aria-label="Close">✕</button>
          </div>
        </div>

        <!-- Chat view -->
        <div id="aw-chat-view">
          <div class="aw-messages" id="aw-messages"></div>
          <div class="aw-chips" id="aw-chips"></div>
          <div class="aw-actions" id="aw-actions" aria-label="Quick actions"></div>
          <div class="aw-input-row">
            <input class="aw-input" id="aw-input" placeholder="Ask anything…" autocomplete="off" maxlength="300" />
            <button class="aw-send" id="aw-send" aria-label="Send">→</button>
          </div>
          <div class="aw-footer">${CFG.footerNote}</div>
        </div>

        <!-- History view -->
        <div id="aw-hist-view" style="display:none;flex-direction:column;flex:1;overflow:hidden;">
          <div class="aw-header" style="background:transparent;">
            <button class="aw-hbtn" id="aw-back-btn">← Back</button>
            <span style="font-weight:700;font-size:13px;">Conversations</span>
            <button class="aw-hbtn aw-hbtn-new" id="aw-new-btn-2" style="margin-left:auto;">+ New</button>
          </div>
          <div id="aw-hist-list" style="flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:6px;"></div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
  }

  /* ── Message rendering ── */
  function addUserMsg(text) {
    saveMessage('user', text);
    const msgs = document.getElementById('aw-messages');
    const el = document.createElement('div');
    el.className = 'aw-msg aw-user';
    el.innerHTML = `<div class="aw-bubble aw-bubble-user">${esc(text)}</div>`;
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
  }

  function addBotMsg(text, persist = true) {
    if (persist) saveMessage('bot', text);
    const msgs = document.getElementById('aw-messages');
    const el = document.createElement('div');
    el.className = 'aw-msg aw-bot';
    el.innerHTML = `
      <div class="aw-av aw-msg-av">
        <img src="${CFG.avatar}" alt="" onerror="this.parentNode.innerHTML='✦'" />
      </div>
      <div class="aw-bubble aw-bubble-bot">${mdRender(text)}</div>`;
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
  }

  async function fetchWithTyping(intent, text, delayMin = 500) {
    const msgs = document.getElementById('aw-messages');
    const el = document.createElement('div');
    el.className = 'aw-msg aw-bot'; el.id = 'aw-typing';
    el.innerHTML = `
      <div class="aw-av aw-msg-av"><img src="${CFG.avatar}" alt="" onerror="this.parentNode.innerHTML='✦'" /></div>
      <div class="aw-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;

    const start = Date.now();
    const responseText = await getResponse(intent, text);
    const elapsed = Date.now() - start;

    if (elapsed < delayMin) {
      await new Promise(r => setTimeout(r, delayMin - elapsed));
    }

    el.remove();
    return responseText;
  }

  function renderChips(chips) {
    const c = document.getElementById('aw-chips');
    c.innerHTML = chips.map(chip =>
      `<button class="aw-chip" data-q="${esc(chip)}">${chip}</button>`
    ).join('');
    c.querySelectorAll('.aw-chip').forEach(btn =>
      btn.addEventListener('click', () => {
        addUserMsg(btn.dataset.q);
        c.innerHTML = '';
        const intent = classifyIntent(btn.dataset.q);
        fetchWithTyping(intent, btn.dataset.q, 500).then(res => {
          addBotMsg(res);
          if (window.KB[intent]?.chips) renderChips(window.KB[intent].chips);
        });
      })
    );
  }

  function renderQuickActions() {
    const actions = (Array.isArray(CFG.quickActions) ? CFG.quickActions : [])
      .map((action) => (typeof action === 'string' ? { label: action, query: action } : action))
      .filter((item) => item && item.label && (item.url || item.query));
    const el = document.getElementById('aw-actions');
    if (!el) return;
    // Hide the toolbar strip entirely when no actions are configured
    el.hidden = actions.length === 0;
    el.style.display = actions.length ? '' : 'none';
    if (!actions.length) {
      el.innerHTML = '';
      return;
    }
    el.innerHTML = actions.map((item, i) =>
      `<button class="aw-action" type="button" data-action-index="${i}">${esc(item.label)}</button>`
    ).join('');
    el.querySelectorAll('.aw-action').forEach(btn => btn.addEventListener('click', () => {
      const item = actions[Number(btn.dataset.actionIndex)];
      if (!item) return;
      if (item.url) {
        // Only allow same-origin paths or http(s) links from site config
        const href = String(item.url);
        if (/^(https?:\/\/|\/|#)/i.test(href)) {
          window.location.href = href;
        }
        return;
      }
      if (item.query) {
        const input = document.getElementById('aw-input');
        input.value = item.query;
        handleSend();
      }
    }));
  }

  function offerNav(page) {
    const msgs = document.getElementById('aw-messages');
    const btn = document.createElement('button');
    btn.className = 'aw-chip'; btn.style.marginLeft = '34px';
    btn.textContent = 'Take me there →';
    btn.addEventListener('click', () => { window.location.href = page; });
    msgs.appendChild(btn); msgs.scrollTop = msgs.scrollHeight;
  }

  /* ── Lead capture ── */
  function showLeadForm() {
    const msgs = document.getElementById('aw-messages');
    const el = document.createElement('div');
    el.className = 'aw-msg aw-bot';
    el.innerHTML = `
      <div class="aw-av aw-msg-av"><img src="${CFG.avatar}" alt="" onerror="this.parentNode.innerHTML='✦'" /></div>
      <div class="aw-bubble aw-bubble-bot">
        <form class="aw-lead-form" id="aw-lead-form">
          <p style="margin:0 0 8px;font-weight:600;">Connect with our team:</p>
          <input name="name"  placeholder="Your name"      required style="width:100%;margin-bottom:6px;" />
          <input name="email" type="email" placeholder="Email address" required style="width:100%;" />
          <button type="submit">Connect me →</button>
        </form>
      </div>`;
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;

    document.getElementById('aw-lead-form').addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));

      // ── Send to your endpoint here ──────────────────────────
      // fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'},
      //   body: JSON.stringify(data) });
      // ───────────────────────────────────────────────────────

      console.log('[AgenticChat] Lead captured:', data);
      e.target.closest('.aw-bubble').innerHTML =
        `<p style="color:#3cb87a;font-weight:600;margin:0;">✓ Thanks ${esc(data.name)}! We'll be in touch at ${esc(data.email)}.</p>`;
      addBotMsg("A team member will reach out shortly. Is there anything else I can help with?");
    });
  }

  /* ── Handle send ── */
  function handleSend() {
    const el = document.getElementById('aw-input');
    const text = el.value.trim();
    if (!text) return;
    el.value = '';
    if (!activeChatId) activeChatId = newChat();
    document.getElementById('aw-chips').innerHTML = '';
    addUserMsg(text);
    msgCount++;

    const intent = classifyIntent(text);
    fetchWithTyping(intent, text, 800).then(res => {
      addBotMsg(res);
      if (window.KB[intent]?.chips)    renderChips(window.KB[intent].chips);
      if (window.KB[intent]?.navigate) offerNav(window.KB[intent].navigate);
    });

    if (CFG.leadNudgeAfter > 0 && msgCount === CFG.leadNudgeAfter) {
      setTimeout(() => {
        addBotMsg("You seem to have a lot of questions — would you like to connect with someone from our team directly?");
        renderChips(['Yes, connect me', 'No thanks']);
        document.getElementById('aw-chips').querySelectorAll('.aw-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            if (btn.dataset.q === 'Yes, connect me') { document.getElementById('aw-chips').innerHTML = ''; showLeadForm(); }
          }, { once: true });
        });
      }, 1600);
    }
  }

  /* ── Toggle open/close ── */
  function openPanel() {
    isOpen = true;
    hideNotifBadge();
    const bbl = document.getElementById('aw-proactive-bbl'); if (bbl) bbl.remove();
    document.getElementById('aw-panel').classList.add('open');
    if (!greeted) {
      greeted = true;
      activeChatId = newChat();
      setTimeout(() => {
        showTyping(() => addBotMsg(getContextualGreeting()), 600);
        renderChips(getContextualChips());
      }, 200);
    }
    document.getElementById('aw-input').focus();
    renderQuickActions();
  }
  function closePanel() {
    isOpen = false;
    document.getElementById('aw-panel').classList.remove('open');
  }

  /* ── History views ── */
  function showChatView() {
    document.getElementById('aw-chat-view').style.display = 'flex';
    document.getElementById('aw-hist-view').style.display = 'none';
  }
  function showHistView() {
    document.getElementById('aw-chat-view').style.display = 'none';
    document.getElementById('aw-hist-view').style.display = 'flex';
    renderHistList();
  }
  function renderHistList() {
    const list = document.getElementById('aw-hist-list');
    chatHistory = loadHistory();
    if (!chatHistory.length) {
      list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--aw-muted);font-size:12px;">No saved conversations yet.</div>';
      return;
    }
    list.innerHTML = chatHistory.map(chat => {
      const date = chat.updatedAt
        ? new Date(chat.updatedAt).toLocaleDateString('en-CA', { month:'short', day:'numeric' })
        : '';
      return `
        <div class="aw-hist-item${chat.id === activeChatId ? ' aw-hist-active' : ''}" data-id="${chat.id}">
          <div style="flex:1;min-width:0;">
            <div class="aw-hist-title">${esc(chat.title)}</div>
            <div class="aw-hist-meta">${chat.messages.length} messages · ${date}</div>
          </div>
          <button class="aw-hist-del" data-del="${chat.id}" title="Delete">🗑</button>
        </div>`;
    }).join('');

    list.querySelectorAll('.aw-hist-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('.aw-hist-del')) return;
        const chat = loadHistory().find(c => c.id === item.dataset.id);
        if (!chat) return;
        activeChatId = chat.id;
        chatHistory = loadHistory();
        const msgs = document.getElementById('aw-messages');
        msgs.innerHTML = ''; document.getElementById('aw-chips').innerHTML = '';
        chat.messages.forEach(m => {
          if (m.role === 'user') {
            const el = document.createElement('div');
            el.className = 'aw-msg aw-user';
            el.innerHTML = `<div class="aw-bubble aw-bubble-user">${esc(m.text)}</div>`;
            msgs.appendChild(el);
          } else { addBotMsg(m.text, false); }
        });
        showChatView(); msgs.scrollTop = msgs.scrollHeight;
      });
    });
    list.querySelectorAll('.aw-hist-del').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        chatHistory = chatHistory.filter(c => c.id !== btn.dataset.del);
        saveHistory(chatHistory);
        if (btn.dataset.del === activeChatId) activeChatId = null;
        renderHistList();
      });
    });
  }

  /* ── Proactive ping ── */
  function showNotifBadge(count) {
    let badge = document.getElementById('aw-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'aw-badge';
      badge.style.cssText = 'position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#ff5a5a,#c9334a);color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid var(--aw-bg,#0f172a);animation:awBadgePop 0.3s cubic-bezier(0.16,1,0.3,1) both;pointer-events:none;z-index:10;';
      document.getElementById('aw-trigger').appendChild(badge);
    }
    badge.textContent = count;
  }
  function hideNotifBadge() {
    const b = document.getElementById('aw-badge');
    if (b) b.remove();
  }
  function showProactiveBubble(text) {
    if (!text) return;
    let bbl = document.getElementById('aw-proactive-bbl');
    if (bbl) bbl.remove();
    bbl = document.createElement('div');
    bbl.id = 'aw-proactive-bbl';
    bbl.style.cssText = 'position:fixed;bottom:88px;right:24px;max-width:230px;background:var(--aw-bg,#0f172a);border:1px solid color-mix(in srgb,var(--aw-brand,#6c63ff) 35%,transparent);border-radius:12px 12px 4px 12px;padding:11px 14px;font-size:13px;line-height:1.5;color:rgba(238,240,243,0.92);box-shadow:0 8px 32px rgba(0,0,0,0.45);z-index:9998;animation:awBblIn 0.4s cubic-bezier(0.16,1,0.3,1) both;cursor:pointer;';
    bbl.innerHTML = `<span style="display:block;">${text}</span><span style="font-size:9px;color:rgba(148,158,170,0.6);margin-top:6px;display:block;">Click to chat →</span>`;
    bbl.addEventListener('click', () => { bbl.remove(); openPanel(); });
    document.body.appendChild(bbl);
    setTimeout(() => { if (bbl.parentNode) { bbl.style.animation = 'awBblOut 0.3s ease forwards'; setTimeout(() => bbl.remove(), 300); } }, 8000);
  }
  function proactivePing() {
    if (CFG.proactiveSec <= 0 || sessionStorage.getItem('aw_visited')) return;
    sessionStorage.setItem('aw_visited', '1');
    setTimeout(() => {
      if (!isOpen) {
        const trigger = document.getElementById('aw-trigger');
        trigger.style.transform = 'translateY(-10px) scale(1.1)';
        setTimeout(() => { trigger.style.transform = ''; }, 500);
        setTimeout(() => { trigger.style.transform = 'translateY(-5px) scale(1.04)'; }, 600);
        setTimeout(() => { trigger.style.transform = ''; }, 900);
        showNotifBadge(1);
        if (CFG.proactiveMsg) showProactiveBubble(CFG.proactiveMsg);
      }
    }, CFG.proactiveSec * 1000);
  }

  /* ── showTyping helper (also exported as window.showTyping for external use) ── */
  function showTyping(cb, delay) {
    const msgs = document.getElementById('aw-messages');
    if (!msgs) { setTimeout(cb, delay || 900); return; }
    const av = CFG.avatar
      ? `<img src="${CFG.avatar}" alt="" onerror="this.parentNode.innerHTML='✦'" />`
      : '✦';
    const el = document.createElement('div');
    el.className = 'aw-msg aw-bot'; el.id = 'aw-typing-greeting';
    el.innerHTML = `<div class="aw-av aw-msg-av">${av}</div><div class="aw-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => { const t = document.getElementById('aw-typing-greeting'); if (t) t.remove(); cb(); }, delay || 900);
  }
  window.showTyping = showTyping;

  /* ── Utils ── */
  function mdRender(t) {
    return '<p>' + t
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/&lt;strong&gt;/g,'<strong>').replace(/&lt;\/strong&gt;/g,'</strong>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')
      + '</p>';
  }
  function esc(t) {
    return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Init ── */
  function init() {
    buildWidget();
    document.getElementById('aw-trigger').addEventListener('click', () => isOpen ? closePanel() : openPanel());
    document.getElementById('aw-close').addEventListener('click', closePanel);
    document.getElementById('aw-send').addEventListener('click', handleSend);
    document.getElementById('aw-input').addEventListener('keydown', e => e.key === 'Enter' && handleSend());
    document.getElementById('aw-hist-btn').addEventListener('click', showHistView);
    document.getElementById('aw-back-btn').addEventListener('click', showChatView);
    [document.getElementById('aw-new-btn'), document.getElementById('aw-new-btn-2')]
      .forEach(btn => btn?.addEventListener('click', () => {
        activeChatId = newChat();
        document.getElementById('aw-messages').innerHTML = '';
        document.getElementById('aw-chips').innerHTML = '';
        renderQuickActions();
        showChatView();
        setTimeout(() => {
          showTyping(() => addBotMsg(getContextualGreeting()), 400);
          renderChips(getContextualChips());
        }, 100);
        document.getElementById('aw-input').focus();
      }));
    proactivePing();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();

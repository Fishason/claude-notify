export function renderBindPage(machineId: string, origin: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Claude Notify</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0C0A09;
      --surface: rgba(28, 25, 23, 0.7);
      --surface-solid: #1C1917;
      --surface-hover: #292524;
      --border: rgba(255, 255, 255, 0.06);
      --border-active: rgba(255, 140, 66, 0.4);
      --text: #FAFAF9;
      --text-secondary: #A8A29E;
      --text-muted: #57534E;
      --accent: #FF8C42;
      --accent-glow: rgba(255, 140, 66, 0.15);
      --accent-dark: #E6692B;
      --success: #4ADE80;
      --success-bg: rgba(74, 222, 128, 0.08);
      --error: #FB7185;
      --error-bg: rgba(251, 113, 133, 0.08);
      --radius: 14px;
      --font: 'Outfit', sans-serif;
      --mono: 'JetBrains Mono', monospace;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      -webkit-font-smoothing: antialiased;
      position: relative;
      overflow-x: hidden;
    }

    /* Atmospheric background */
    body::before {
      content: '';
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background:
        radial-gradient(ellipse at 30% 20%, rgba(255, 140, 66, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 70% 80%, rgba(230, 105, 43, 0.04) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    /* Noise texture overlay */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    .container {
      width: 100%;
      max-width: 400px;
      position: relative;
      z-index: 1;
    }

    /* ── Header ── */
    .header {
      text-align: center;
      padding: 0 0 36px;
      animation: fadeUp 0.6s ease-out both;
    }

    .icon-wrap {
      position: relative;
      width: 72px;
      height: 72px;
      margin: 0 auto 20px;
    }
    .icon-wrap::before {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 24px;
      background: var(--accent);
      opacity: 0;
      animation: iconPulse 3s ease-in-out infinite;
      filter: blur(16px);
    }
    .icon-wrap img {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      position: relative;
      z-index: 1;
      box-shadow: 0 4px 24px rgba(255, 140, 66, 0.2);
    }

    @keyframes iconPulse {
      0%, 100% { opacity: 0; transform: scale(0.8); }
      50% { opacity: 0.3; transform: scale(1.1); }
    }

    .header h1 {
      font-size: 26px;
      font-weight: 600;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--text) 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header .tagline {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 300;
      letter-spacing: 0.2px;
    }

    /* ── Cards ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow: hidden;
      animation: fadeUp 0.6s ease-out both;
    }
    .card:nth-child(2) { animation-delay: 0.08s; }
    .card:nth-child(3) { animation-delay: 0.16s; }
    .card + .card { margin-top: 12px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Device row ── */
    .device-row {
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .device-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #292524 0%, #1C1917 100%);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .device-info { flex: 1; min-width: 0; }
    .device-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
      margin-bottom: 3px;
    }
    .device-name {
      font-family: var(--mono);
      font-size: 13px;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .badge {
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 20px;
      flex-shrink: 0;
      letter-spacing: 0.3px;
    }
    .badge-bound {
      background: var(--success-bg);
      color: var(--success);
      border: 1px solid rgba(74, 222, 128, 0.15);
    }
    .badge-unbound {
      background: var(--accent-glow);
      color: var(--accent);
      border: 1px solid rgba(255, 140, 66, 0.15);
    }

    /* ── Input section ── */
    .input-section {
      padding: 18px;
    }
    .section-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-label::before {
      content: '';
      width: 3px;
      height: 12px;
      background: var(--accent);
      border-radius: 2px;
    }

    .input-wrap {
      position: relative;
    }
    .input-wrap input {
      width: 100%;
      padding: 14px 16px;
      background: var(--bg);
      border: 1.5px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 14px;
      font-weight: 400;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .input-wrap input:focus {
      border-color: var(--border-active);
      box-shadow: 0 0 0 4px var(--accent-glow), inset 0 0 0 1px rgba(255, 140, 66, 0.1);
    }
    .input-wrap input::placeholder {
      font-family: var(--font);
      font-size: 13px;
      font-weight: 300;
      color: var(--text-muted);
    }
    .key-detected {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-family: var(--mono);
      font-size: 10px;
      font-weight: 500;
      color: var(--success);
      background: var(--success-bg);
      border: 1px solid rgba(74, 222, 128, 0.12);
      padding: 3px 8px;
      border-radius: 6px;
      display: none;
      letter-spacing: 0.3px;
    }

    .input-help {
      margin-top: 10px;
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.7;
      font-weight: 300;
    }
    .input-help code {
      font-family: var(--mono);
      font-size: 11px;
      background: rgba(255, 140, 66, 0.08);
      color: var(--accent);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255, 140, 66, 0.1);
    }

    /* ── Button ── */
    .btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 10px;
      font-family: var(--font);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 16px;
      position: relative;
      letter-spacing: 0.2px;
    }
    .btn:active:not(:disabled) { transform: scale(0.98); }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
      color: #fff;
      box-shadow: 0 2px 12px rgba(255, 140, 66, 0.15);
    }
    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 4px 24px rgba(255, 140, 66, 0.3);
      transform: translateY(-1px);
    }

    /* ── Toggle ── */
    .toggle-row {
      padding: 16px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .toggle-text h3 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 3px;
    }
    .toggle-text p {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 300;
    }
    .toggle-track {
      width: 52px;
      height: 30px;
      background: #292524;
      border-radius: 15px;
      position: relative;
      cursor: pointer;
      transition: background 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      border: 1px solid var(--border);
    }
    .toggle-track.on {
      background: var(--accent-dark);
      border-color: transparent;
      box-shadow: 0 0 16px rgba(255, 140, 66, 0.15);
    }
    .toggle-track::after {
      content: '';
      position: absolute;
      width: 22px;
      height: 22px;
      background: var(--text);
      border-radius: 50%;
      top: 3px;
      left: 3px;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    }
    .toggle-track.on::after {
      transform: translateX(22px);
    }

    /* ── Toast ── */
    .toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      padding: 12px 22px;
      border-radius: 12px;
      font-family: var(--font);
      font-size: 13px;
      font-weight: 500;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 100;
      max-width: calc(100% - 32px);
      text-align: center;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      letter-spacing: 0.1px;
    }
    .toast.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .toast.ok {
      background: rgba(74, 222, 128, 0.1);
      color: var(--success);
      border: 1px solid rgba(74, 222, 128, 0.2);
    }
    .toast.err {
      background: rgba(251, 113, 133, 0.1);
      color: var(--error);
      border: 1px solid rgba(251, 113, 133, 0.2);
    }

    /* ── Loading ── */
    .loading {
      text-align: center;
      padding: 64px 0;
      animation: fadeUp 0.4s ease-out both;
    }
    .loading .ring {
      width: 32px;
      height: 32px;
      border: 2px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 14px;
    }
    .loading p {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 300;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    #main { display: none; }

    /* ── Footer ── */
    .footer {
      text-align: center;
      margin-top: 28px;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 300;
      letter-spacing: 0.3px;
      animation: fadeUp 0.6s ease-out 0.24s both;
    }
    .footer a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer a:hover { color: var(--accent); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon-wrap">
        <img src="${origin}/icon.svg" alt="CC" />
      </div>
      <h1>Claude Notify</h1>
      <p class="tagline">Link your device to receive finish notifications</p>
    </div>

    <div id="loading" class="loading">
      <div class="ring"></div>
      <p>Connecting...</p>
    </div>

    <div id="main">
      <div class="card">
        <div class="device-row">
          <div class="device-icon">&#9000;</div>
          <div class="device-info">
            <div class="device-label">Machine</div>
            <div class="device-name" id="dName">—</div>
          </div>
          <span class="badge" id="dBadge">—</span>
        </div>
      </div>

      <div class="card">
        <div class="input-section">
          <div class="section-label">Bark Key</div>
          <div class="input-wrap">
            <input type="text" id="keyInput"
              placeholder="Paste your Bark push URL or key"
              autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />
            <span class="key-detected" id="keyHint">KEY DETECTED</span>
          </div>
          <div class="input-help">
            Open Bark app and copy the push URL from the home screen.<br/>
            Accepts <code>https://api.day.app/KEY/…</code> or just <code>KEY</code>
          </div>
          <button class="btn btn-primary" id="bindBtn" onclick="bind()">Bind Device</button>
        </div>
      </div>

      <div class="card">
        <div class="toggle-row">
          <div class="toggle-text">
            <h3>Notifications</h3>
            <p id="toggleHint">Push when Claude Code is idle</p>
          </div>
          <div class="toggle-track" id="toggle" onclick="toggleNotif()"></div>
        </div>
      </div>
    </div>

    <div class="footer">
      Powered by Cloudflare Workers
      &nbsp;·&nbsp;
      <a href="https://github.com/Finb/Bark" target="_blank" rel="noopener">Bark</a>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const MID = "${machineId}";
    const API = "${origin}";
    let active = true;

    // ── Key extraction ──
    function extractKey(s) {
      s = s.trim();
      const m = s.match(/^https?:\\/\\/api\\.day\\.app\\/([A-Za-z0-9_-]+)/);
      return m ? m[1] : s.replace(/\\/+$/,"");
    }

    const inp = document.getElementById("keyInput");
    const hint = document.getElementById("keyHint");
    inp.addEventListener("input", () => {
      const v = inp.value;
      const k = extractKey(v);
      if (v.includes("api.day.app") && k) {
        hint.textContent = k.slice(0,6) + "…";
        hint.style.display = "block";
        inp.style.paddingRight = "90px";
      } else {
        hint.style.display = "none";
        inp.style.paddingRight = "16px";
      }
    });

    // ── Toast ──
    let tt;
    function toast(msg, type) {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.className = "toast " + type;
      clearTimeout(tt);
      requestAnimationFrame(() => t.classList.add("visible"));
      tt = setTimeout(() => t.classList.remove("visible"), 3200);
    }

    // ── Load ──
    async function load() {
      try {
        const r = await fetch(API+"/api/status?id="+MID);
        const d = await r.json();
        if (!d.success) throw new Error(d.error);

        document.getElementById("dName").textContent = d.machine_name;
        active = d.is_active;
        syncToggle();

        const b = document.getElementById("dBadge");
        if (d.bound) {
          b.textContent = "Bound";
          b.className = "badge badge-bound";
          inp.placeholder = "Bound — enter new key to rebind";
        } else {
          b.textContent = "Unbound";
          b.className = "badge badge-unbound";
        }

        document.getElementById("loading").style.display = "none";
        document.getElementById("main").style.display = "block";
      } catch(e) {
        document.getElementById("loading").innerHTML =
          '<p style="color:var(--error)">Device not found</p>' +
          '<p style="font-size:12px;color:var(--text-muted);margin-top:6px">Run <code style=\\'font-family:var(--mono);color:var(--accent)\\'>claude-notify init</code> first</p>';
      }
    }

    function syncToggle() {
      const t = document.getElementById("toggle");
      const h = document.getElementById("toggleHint");
      t.classList.toggle("on", active);
      h.textContent = active ? "Push when Claude Code is idle" : "Notifications paused";
    }

    // ── Bind ──
    async function bind() {
      const raw = inp.value.trim();
      if (!raw) { toast("Enter a Bark key or URL","err"); return; }

      const btn = document.getElementById("bindBtn");
      btn.disabled = true;
      btn.textContent = "Binding…";

      try {
        const r = await fetch(API+"/api/bind", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({machine_id:MID, bark_key:raw})
        });
        const d = await r.json();
        if (!d.success) throw new Error(d.error);

        toast("Bound! Test notification sent","ok");
        const b = document.getElementById("dBadge");
        b.textContent = "Bound";
        b.className = "badge badge-bound";
        inp.value = "";
        inp.placeholder = "Bound — enter new key to rebind";
        hint.style.display = "none";
        inp.style.paddingRight = "16px";
      } catch(e) { toast(e.message,"err"); }
      finally { btn.disabled = false; btn.textContent = "Bind Device"; }
    }

    // ── Toggle ──
    async function toggleNotif() {
      active = !active;
      syncToggle();
      try {
        const r = await fetch(API+"/api/toggle-public", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({machine_id:MID, active})
        });
        const d = await r.json();
        if (!d.success) { active = !active; syncToggle(); toast("Toggle failed","err"); }
        else { toast(active?"Notifications on":"Notifications paused","ok"); }
      } catch { active = !active; syncToggle(); }
    }

    load();
  </script>
</body>
</html>`;
}

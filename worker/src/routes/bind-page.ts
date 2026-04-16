export function renderBindPage(machineId: string, origin: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Claude Notify</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="${origin}/icon.svg">
  <link rel="apple-touch-icon" href="${origin}/icon.jpg">
  <style>
    :root {
      --bg: #F7F5F0;
      --bg-pattern: #EFECE5;
      --surface: #FFFFFF;
      --surface-alt: #F0EDE6;
      --border: #E2DED5;
      --border-focus: #C8956C;
      --text: #1A1612;
      --text-secondary: #78736B;
      --text-muted: #A9A49C;
      --accent: #C8956C;
      --accent-hover: #B5805A;
      --accent-light: rgba(200, 149, 108, 0.1);
      --accent-glow: rgba(200, 149, 108, 0.2);
      --success: #5D9B6B;
      --success-light: rgba(93, 155, 107, 0.08);
      --error: #C2553A;
      --error-light: rgba(194, 85, 58, 0.08);
      --shadow-sm: 0 1px 2px rgba(26, 22, 18, 0.04);
      --shadow-md: 0 4px 16px rgba(26, 22, 18, 0.06);
      --shadow-lg: 0 8px 32px rgba(26, 22, 18, 0.08);
      --radius: 12px;
      --serif: 'Instrument Serif', Georgia, serif;
      --sans: 'DM Sans', -apple-system, sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--sans);
      background: var(--bg);
      color: var(--text);
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* Subtle dot pattern background */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(circle, var(--border) 0.5px, transparent 0.5px);
      background-size: 24px 24px;
      opacity: 0.4;
      pointer-events: none;
    }

    .page {
      width: 100%;
      max-width: 380px;
      position: relative;
      z-index: 1;
    }

    /* ── Header ── */
    .header {
      text-align: center;
      margin-bottom: 32px;
      animation: enter 0.5s ease both;
    }
    .header h1 {
      font-family: var(--serif);
      font-size: 28px;
      font-weight: 400;
      font-style: italic;
      letter-spacing: -0.3px;
      color: var(--text);
      margin-bottom: 6px;
    }
    .header p {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 400;
    }

    @keyframes enter {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Card ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      animation: enter 0.5s ease both;
    }
    .card:nth-child(1) { animation-delay: 0.05s; }
    .card:nth-child(2) { animation-delay: 0.1s; }
    .card:nth-child(3) { animation-delay: 0.15s; }
    .card + .card { margin-top: 10px; }

    /* ── Device info ── */
    .device {
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .device-dot {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--surface-alt);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .device-dot svg {
      width: 18px;
      height: 18px;
      stroke: var(--text-secondary);
      fill: none;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .device-meta { flex: 1; min-width: 0; }
    .device-meta .label {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 2px;
    }
    .device-meta .name {
      font-size: 13px;
      color: var(--text);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pill {
      font-size: 11px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 100px;
      flex-shrink: 0;
      letter-spacing: 0.2px;
    }
    .pill-bound {
      background: var(--success-light);
      color: var(--success);
    }
    .pill-unbound {
      background: var(--accent-light);
      color: var(--accent);
    }

    /* ── Form ── */
    .form-section { padding: 18px; }
    .form-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text);
      margin-bottom: 8px;
      display: block;
    }
    .input-box { position: relative; }
    .input-box input {
      width: 100%;
      padding: 11px 14px;
      background: var(--bg);
      border: 1.5px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-family: var(--sans);
      font-size: 14px;
      font-weight: 400;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-box input:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .input-box input::placeholder {
      color: var(--text-muted);
      font-weight: 400;
    }
    .key-tag {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      font-weight: 600;
      color: var(--success);
      background: var(--success-light);
      padding: 3px 7px;
      border-radius: 4px;
      display: none;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .form-hint {
      margin-top: 8px;
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .form-hint code {
      font-family: 'DM Sans', monospace;
      font-size: 11px;
      background: var(--accent-light);
      color: var(--accent-hover);
      padding: 1px 5px;
      border-radius: 3px;
    }

    /* ── Button ── */
    .btn {
      width: 100%;
      padding: 12px;
      margin-top: 14px;
      border: none;
      border-radius: 8px;
      font-family: var(--sans);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.1px;
    }
    .btn:active:not(:disabled) { transform: scale(0.99); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary {
      background: var(--accent);
      color: #fff;
    }
    .btn-primary:hover:not(:disabled) {
      background: var(--accent-hover);
      box-shadow: var(--shadow-md);
    }

    /* ── Toggle ── */
    .toggle-row {
      padding: 15px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .toggle-row .tgl-text h3 {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    .toggle-row .tgl-text p {
      font-size: 12px;
      color: var(--text-muted);
    }
    .tgl {
      width: 44px;
      height: 26px;
      background: var(--border);
      border-radius: 13px;
      position: relative;
      cursor: pointer;
      transition: background 0.3s;
      flex-shrink: 0;
    }
    .tgl.on { background: var(--accent); }
    .tgl::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      top: 3px;
      left: 3px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .tgl.on::after { transform: translateX(18px); }

    /* ── Toast ── */
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(60px);
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 100;
      max-width: calc(100% - 32px);
      text-align: center;
      box-shadow: var(--shadow-lg);
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .toast.ok { background: var(--surface); color: var(--success); border: 1px solid var(--border); }
    .toast.err { background: var(--surface); color: var(--error); border: 1px solid var(--border); }

    /* ── Loading ── */
    .loading {
      text-align: center;
      padding: 56px 0;
      animation: enter 0.4s ease both;
    }
    .dot-loader {
      display: flex;
      gap: 6px;
      justify-content: center;
      margin-bottom: 14px;
    }
    .dot-loader span {
      width: 6px; height: 6px;
      background: var(--accent);
      border-radius: 50%;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .dot-loader span:nth-child(2) { animation-delay: 0.15s; }
    .dot-loader span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }
    .loading p { font-size: 13px; color: var(--text-muted); }

    #main { display: none; }

    /* ── Footer ── */
    .footer {
      text-align: center;
      margin-top: 24px;
      font-size: 11px;
      color: var(--text-muted);
      animation: enter 0.5s ease 0.2s both;
    }
    .footer a { color: var(--text-secondary); text-decoration: none; }
    .footer a:hover { color: var(--accent); }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>Claude Notify</h1>
      <p>Link your phone to receive finish alerts</p>
    </div>

    <div id="loading" class="loading">
      <div class="dot-loader"><span></span><span></span><span></span></div>
      <p>Connecting&hellip;</p>
    </div>

    <div id="main">
      <div class="card">
        <div class="device">
          <div class="device-dot">
            <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div class="device-meta">
            <div class="label">Machine</div>
            <div class="name" id="dName">&mdash;</div>
          </div>
          <span class="pill" id="dBadge">&mdash;</span>
        </div>
      </div>

      <div class="card">
        <div class="form-section">
          <label class="form-label" for="keyIn">Bark Key</label>
          <div class="input-box">
            <input type="text" id="keyIn"
              placeholder="Paste your Bark URL or key"
              autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />
            <span class="key-tag" id="keyTag">Detected</span>
          </div>
          <div class="form-hint">
            Open Bark on your iPhone, copy the push URL from the home screen.<br/>
            Accepts <code>https://api.day.app/KEY/&hellip;</code> or just the key.
          </div>
          <button class="btn btn-primary" id="bindBtn" onclick="bind()">Bind Device</button>
        </div>
      </div>

      <div class="card">
        <div class="toggle-row">
          <div class="tgl-text">
            <h3>Notifications</h3>
            <p id="tglHint">Active &mdash; push when Claude is idle</p>
          </div>
          <div class="tgl" id="tgl" onclick="toggle()"></div>
        </div>
      </div>
    </div>

    <div class="footer">
      Powered by Cloudflare Workers &middot; <a href="https://github.com/Finb/Bark" target="_blank" rel="noopener">Bark</a>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const MID="${machineId}", API="${origin}";
    let on=true;

    function extractKey(s){
      s=s.trim();
      const m=s.match(/^https?:\\/\\/api\\.day\\.app\\/([A-Za-z0-9_-]+)/);
      return m?m[1]:s.replace(/\\/+$/,"");
    }

    const inp=document.getElementById("keyIn"),tag=document.getElementById("keyTag");
    inp.addEventListener("input",()=>{
      const v=inp.value,k=extractKey(v);
      if(v.includes("api.day.app")&&k){tag.textContent=k.slice(0,8)+"\\u2026";tag.style.display="block";inp.style.paddingRight="90px";}
      else{tag.style.display="none";inp.style.paddingRight="14px";}
    });

    let tt;
    function toast(m,t){const e=document.getElementById("toast");e.textContent=m;e.className="toast "+t;clearTimeout(tt);requestAnimationFrame(()=>e.classList.add("show"));tt=setTimeout(()=>e.classList.remove("show"),3e3);}

    async function load(){
      try{
        const r=await fetch(API+"/api/status?id="+MID);
        const d=await r.json();
        if(!d.success)throw new Error(d.error);
        document.getElementById("dName").textContent=d.machine_name;
        on=d.is_active;syncTgl();
        const b=document.getElementById("dBadge");
        if(d.bound){b.textContent="Bound";b.className="pill pill-bound";inp.placeholder="Bound \\u2014 enter new key to rebind";}
        else{b.textContent="Unbound";b.className="pill pill-unbound";}
        document.getElementById("loading").style.display="none";
        document.getElementById("main").style.display="block";
      }catch(e){
        document.getElementById("loading").innerHTML='<p style="color:var(--error)">Device not found</p><p style="font-size:12px;color:var(--text-muted);margin-top:6px">Run <code style="color:var(--accent)">claude-notify init</code> first</p>';
      }
    }

    function syncTgl(){
      const t=document.getElementById("tgl"),h=document.getElementById("tglHint");
      t.classList.toggle("on",on);
      h.textContent=on?"Active \\u2014 push when Claude is idle":"Paused";
    }

    async function bind(){
      const raw=inp.value.trim();
      if(!raw){toast("Enter a Bark key or URL","err");return;}
      const btn=document.getElementById("bindBtn");
      btn.disabled=true;btn.textContent="Binding\\u2026";
      try{
        const r=await fetch(API+"/api/bind",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({machine_id:MID,bark_key:raw})});
        const d=await r.json();
        if(!d.success)throw new Error(d.error);
        toast("Bound! Test notification sent","ok");
        const b=document.getElementById("dBadge");b.textContent="Bound";b.className="pill pill-bound";
        inp.value="";inp.placeholder="Bound \\u2014 enter new key to rebind";tag.style.display="none";inp.style.paddingRight="14px";
      }catch(e){toast(e.message,"err");}
      finally{btn.disabled=false;btn.textContent="Bind Device";}
    }

    async function toggle(){
      on=!on;syncTgl();
      try{
        const r=await fetch(API+"/api/toggle-public",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({machine_id:MID,active:on})});
        const d=await r.json();
        if(!d.success){on=!on;syncTgl();toast("Toggle failed","err");}
        else toast(on?"Notifications on":"Paused","ok");
      }catch{on=!on;syncTgl();}
    }

    load();
  </script>
</body>
</html>`;
}

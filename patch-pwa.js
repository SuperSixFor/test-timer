/**
 * patch-pwa.js
 * Injects all PWA plumbing into lap-timer.html.
 * Run after inject-seo.js:  node inject-seo.js && node patch-pwa.js
 * (or just: node build.js which runs both in sequence)
 */

const fs   = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'lap-timer.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// ── 1. Head additions ─────────────────────────────────────────────────────────
const pwaHead = `
<!-- ═══ PWA manifest + iOS meta ══════════════════════════════════════════ -->
<link rel="manifest" href="/manifest.json">

<!-- iOS home-screen support (Safari doesn't read the manifest fully) -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Test Timer">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png">
<link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144.png">

<!-- MS tiles -->
<meta name="msapplication-TileImage" content="/icons/icon-144.png">
<meta name="msapplication-TileColor" content="#0d0d0d">`;

html = html.replace('</head>', pwaHead + '\n</head>');

// ── 2. Install banner styles ──────────────────────────────────────────────────
const bannerStyles = `
  /* ── PWA install banner ─────────────────────────────────────────────── */
  #pwa-banner {
    display: none;
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 2rem);
    max-width: 440px;
    background: #1a1a1a;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    padding: 14px 16px;
    z-index: 100;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
  }
  #pwa-banner.show { display: flex; }
  .pwa-banner-text { flex: 1; }
  .pwa-banner-title {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: #f0ede8;
    margin-bottom: 2px;
  }
  .pwa-banner-sub {
    font-size: 11px;
    color: #666;
    font-family: 'DM Mono', monospace;
  }
  .pwa-banner-install {
    background: #f0ede8;
    color: #0d0d0d;
    border: none;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 8px 14px;
    cursor: pointer;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .pwa-banner-dismiss {
    background: none;
    border: none;
    color: #444;
    font-size: 18px;
    cursor: pointer;
    padding: 0 2px;
    line-height: 1;
  }
  .pwa-banner-dismiss:hover { color: #888; }`;

html = html.replace('</style>', bannerStyles + '\n</style>');

// ── 3. Install banner HTML (before </body>) ───────────────────────────────────
const bannerHtml = `
<!-- PWA install prompt -->
<div id="pwa-banner" role="complementary" aria-label="Install app">
  <div class="pwa-banner-text">
    <div class="pwa-banner-title">Add to home screen</div>
    <div class="pwa-banner-sub">Works offline · no app store needed</div>
  </div>
  <button class="pwa-banner-install" id="pwa-install-btn">Install</button>
  <button class="pwa-banner-dismiss" id="pwa-dismiss-btn" aria-label="Dismiss">×</button>
</div>`;

// ── 4. PWA JavaScript ─────────────────────────────────────────────────────────
const pwaScript = `
<script>
// ── Service worker registration ───────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] registered, scope:', reg.scope))
      .catch(err => console.warn('[SW] registration failed:', err));
  });
}

// ── Quickstart URL param  (?qs=60-20  →  60 min, 20 questions) ───────────────
(function() {
  const params = new URLSearchParams(window.location.search);
  const qs = params.get('qs');
  if (!qs) return;
  const [min, q] = qs.split('-').map(Number);
  if (!min || !q) return;
  // Set after DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    const minEl = document.getElementById('inp-min');
    const qEl   = document.getElementById('inp-q');
    if (minEl) { minEl.value = min; }
    if (qEl)   { qEl.value   = q;   }
    if (typeof recalc === 'function') recalc();
  });
})();

// ── Install prompt (Android / desktop Chrome) ─────────────────────────────────
let deferredPrompt = null;
const banner       = document.getElementById('pwa-banner');
const installBtn   = document.getElementById('pwa-install-btn');
const dismissBtn   = document.getElementById('pwa-dismiss-btn');
const DISMISSED_KEY = 'pwa-banner-dismissed';

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (!localStorage.getItem(DISMISSED_KEY)) {
    // Show after a short delay so it doesn't fire immediately on load
    setTimeout(() => banner && banner.classList.add('show'), 3000);
  }
});

installBtn && installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] install outcome:', outcome);
  deferredPrompt = null;
  banner.classList.remove('show');
});

dismissBtn && dismissBtn.addEventListener('click', () => {
  banner.classList.remove('show');
  localStorage.setItem(DISMISSED_KEY, '1');
});

// Hide banner once app is installed
window.addEventListener('appinstalled', () => {
  banner && banner.classList.remove('show');
  console.log('[PWA] installed successfully');
});
</script>`;

html = html.replace('</body>', bannerHtml + '\n' + pwaScript + '\n</body>');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✓  lap-timer.html — PWA layer injected');
console.log('   manifest link, iOS meta, install banner, SW registration, quickstart params');

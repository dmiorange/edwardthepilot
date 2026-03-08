/* ============================================================
   EDWARDTHEPILOT — main.js
   ============================================================ */

/* --- Active nav link --- */
(function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* --- Scroll fade-in observer --- */
(function initScrollFade() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
})();

/* --- Live / Offline status check via Twitch public embed detect ---
   The Twitch API requires authentication for real status checks.
   We use a lightweight iframe-load trick as a fallback, defaulting
   to a manual toggle via localStorage so you can flip it from the
   console: localStorage.setItem('edwardLive', 'true') / 'false'
   ---------------------------------------------------------------- */
(function checkLiveStatus() {
  const badge = document.getElementById('live-status');
  if (!badge) return;

  const dot   = badge.querySelector('.live-dot');
  const label = badge.querySelector('.live-label');

  function setOnline() {
    badge.classList.remove('offline');
    badge.classList.add('online');
    label.textContent = '🔴 Live on Twitch';
  }

  function setOffline() {
    badge.classList.remove('online');
    badge.classList.add('offline');
    label.textContent = 'Offline';
  }

  // Manual override via localStorage (open browser console to set)
  const override = localStorage.getItem('edwardLive');
  if (override === 'true')  { setOnline();  return; }
  if (override === 'false') { setOffline(); return; }

  // Attempt to fetch Twitch channel page and detect live indicator
  // Uses a CORS proxy-free approach: load a tiny image from Twitch
  // that only exists when the channel is live. This is best-effort.
  const img = new Image();
  img.onload  = setOnline;
  img.onerror = setOffline;
  // Twitch preview thumbnail exists when live:
  img.src = `https://static-cdn.jtvnw.net/previews-ttv/live_user_edwardthepilot-320x180.jpg?_=${Date.now()}`;
})();

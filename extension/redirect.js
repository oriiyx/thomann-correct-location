// Runs on every non-US Thomann country domain (thomann.de, thomann.co.uk, ...).
// Finds the equivalent page on thomannmusic.com and sends the browser to its /en-si/ version.
(function () {
  const TARGET = 'https://www.thomannmusic.com/en-si/';
  const KEY = 'thomann-si-redirects';

  // Loop guard: never redirect more than 3 times per tab session.
  let count = 0;
  try { count = Number(sessionStorage.getItem(KEY) || 0); } catch (_) {}
  if (count >= 3) return;

  function go(path) {
    try { sessionStorage.setItem(KEY, String(count + 1)); } catch (_) {}
    location.replace(TARGET + path.replace(/^\/+/, '') + location.hash);
  }

  // Product pages (*.htm) share the same path across all country sites,
  // so we can jump immediately without waiting for the DOM.
  const path = location.pathname.replace(/^\/(?:[a-z]{2}|intl)\//, '/');
  if (/\.htm$/.test(path) && !/\.html$/.test(path)) {
    go(path + location.search);
    return;
  }

  // Category / other pages: path differs by language, so use the en-US hreflang link.
  let done = false;
  function tryHreflang() {
    if (done) return;
    const link = document.querySelector('link[rel="alternate"][hreflang="en-US"], link[rel="alternate"][hreflang="x-default"]');
    if (!link) return;
    try {
      const u = new URL(link.href);
      if (u.hostname.endsWith('thomannmusic.com')) {
        done = true;
        go(u.pathname + u.search);
      }
    } catch (_) {}
  }

  const obs = new MutationObserver(tryHreflang);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  tryHreflang();

  document.addEventListener('DOMContentLoaded', () => {
    obs.disconnect();
    tryHreflang();
    if (!done) go(path + location.search); // best effort: same path
  });
})();

// Milvy service worker — network-first, cache-fallback (offline-stöd)
const CACHE = "milvy-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(clients.claim()); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const kopia = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, kopia));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
const CACHE_NAME = 'dongxini-v2';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.all(ASSETS.map((url) => cache.add(url).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((cached) => {
    if (cached) return cached;
    return fetch(e.request).then((resp) => {
      if (resp && resp.status === 200 && resp.type === 'basic') { const clone = resp.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)); }
      return resp;
    }).catch(() => caches.match('./index.html'));
  }));
});

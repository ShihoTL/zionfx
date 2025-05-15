self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('zionfx-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/dist/assets/main.js',
        '/pwa-192x192.png',
        '/pwa-512x512.png',
        '/manifest.json',
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
const CACHE_NAME = 'pilates-timer-cache-v8';
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './restorenew.jpg',
  './beep.mp3'
];

// Install: cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for main files
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.html') ||
      event.request.url.endsWith('.css') ||
      event.request.url.endsWith('.js')) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(resp => resp || fetch(event.request))
    );
  }
});

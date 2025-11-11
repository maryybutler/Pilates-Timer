const CACHE_NAME = 'pilates-timer-cache-v4'; // Increment this for new versions
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './restorenew.jpg',
  './beep.mp3'
];

// Install: cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // Activate immediately
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control of all clients immediately
});

// Fetch: serve cached files first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

// Optional: notify users of updates (can trigger UI in your app)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});


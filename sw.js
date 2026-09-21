const CACHE_NAME = 'et-tech-cache-v1';
const OFFLINE_URL = 'offline.html';

const urlsToCache = [
  'index.html',
  'style.min.css',
  'js/main.js',
  'js/theme.js',
  'js/services.js',
  'offline.html'
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve from cache if offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // If the request is for an HTML page and it's not in cache, return offline.html
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

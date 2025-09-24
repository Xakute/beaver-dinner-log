const CACHE_NAME = 'dinner-log-cache-v13'; // Increment cache version
const urlsToCache = [
  '.',
  'index.html',
  'manifest.json',
  'icon.svg',
  'icon-mono.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // Return from cache
        }
        return fetch(event.request); // Fetch from network
      }
    )
  );
});


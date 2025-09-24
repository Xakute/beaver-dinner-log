// A simple service worker for basic offline functionality

const CACHE_NAME = 'dinner-log-cache-v1';
// This should include the root path of your GitHub Pages site.
// For example, if your site is at username.github.io/dinner-log/,
// you should cache '/dinner-log/'.
const urlsToCache = [
  '/dinner-log/' 
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// --- PWA Service Worker ---

// This version number is crucial. Every time we want the app to download new files (like a new icon or a new HTML file), we must increase this number.
const CACHE_NAME = "dinner-log-cache-v10";

// This is the list of essential files that make up our app. The service worker will save these for offline use.
const urlsToCache = [
  ".", // This represents the root directory
  "index.html",
  "manifest.json",
  "icon.svg",
  "icon-mono.svg"
];

// The 'install' event listener runs when the new service worker is first installed.
self.addEventListener("install", event => {
  // It waits until the cache is opened and all our essential files are saved.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and adding files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Force the new service worker to become active immediately.
});

// The 'activate' event listener runs when the new service worker becomes active.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache's name is different from our current CACHE_NAME, we delete it.
          // This cleans up old, outdated caches.
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all open pages immediately.
});

// The 'fetch' event listener intercepts all network requests from the app.
self.addEventListener("fetch", event => {
  event.respondWith(
    // It first checks if a matching response already exists in our cache.
    caches.match(event.request)
      .then(response => {
        // If a cached version is found, it returns that immediately. This makes the app load instantly and work offline.
        // If nothing is found in the cache, it proceeds to fetch the resource from the network.
        return response || fetch(event.request);
      })
  );
});
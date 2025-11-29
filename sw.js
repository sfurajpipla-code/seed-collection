const REPO_NAME = '/seed-collection/';
const CACHE_NAME = 'seed-collection-cache-v1'; // Change 'v1' whenever you update your files

// List of all static assets required for offline operation.
// IMPORTANT: Every path must be prefixed with the repository name.
const urlsToCache = [
  // Core HTML/CSS/JS
  `${REPO_NAME}`,
  `${REPO_NAME}index.html`,
  `${REPO_NAME}css/style.css`, // Replace with your actual CSS file paths
  `${REPO_NAME}js/main.js`,    // Replace with your actual JS file paths

  // Assets (Icons & Images)
  `${REPO_NAME}images/icon-192x192.png`,
  `${REPO_NAME}images/icon-512x512.png`,
  // Add any other specific files or images necessary for your page to load offline
];

// Installation: Pre-caching all required files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell:', urlsToCache);
        // Using Promise.all to ensure all files are cached before the install completes
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation: Cleaning up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensures the new service worker takes control immediately
});

// Fetch: Serving cached files first, then falling back to network
self.addEventListener('fetch', event => {
  // Strategy: Cache-first, then Network-fallback
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request);
      })
  );
});

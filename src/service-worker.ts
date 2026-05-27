/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'warimaru-v1';
const urlsToCache = [
  '/warimaru/',
  '/warimaru/index.html',
  '/warimaru/manifest.webmanifest',
  '/warimaru/icon-192x192.png',
  '/warimaru/icon-512x512.png'
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
}); 

const CACHE_NAME = 'fuel-tracker-v46';
const FILES = [
  './',
  './index.html',
  './desktop.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './assets/stations/tomi-oil.png',
  './assets/stations/shell.png',
  './assets/stations/omv.png',
  './assets/stations/eko.png',
  './assets/stations/rompetrol.png',
  './assets/stations/petrol.png',
  './assets/stations/lukoil.png',
  './assets/documents/go.png',
  './assets/documents/gtp.png',
  './assets/documents/vignette.png',
  './assets/documents/oil.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).catch(() => null));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

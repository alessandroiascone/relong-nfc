const CACHE_NAME = "relong-pwa-v1";

const URLS_TO_CACHE = [
  "/relong-nfc/",
  "/relong-nfc/relong-hub-v2.html",
  "/relong-nfc/catalogo-smartphone-reale-v3.html",
  "/relong-nfc/scadenziario_v32b.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request);
    })
  );
});

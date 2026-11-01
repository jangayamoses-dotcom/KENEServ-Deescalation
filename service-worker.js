const CACHE_NAME = "deescalation-assistant-v6";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest",
  "./favicon.svg"
];

const APP_PATHS = new Set(
  APP_FILES.map(file => new URL(file, self.registration.scope).pathname)
);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  const isNavigation = request.mode === "navigate";
  const isAppFile = APP_PATHS.has(url.pathname);

  if (!isNavigation && !isAppFile) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const response = await fetch(request);

      if (response && response.ok) {
        await cache.put(request, response.clone());
      }

      return response;
    } catch (error) {
      const cached = await cache.match(request, {
        ignoreSearch: true
      });

      if (cached) return cached;

      if (isNavigation) {
        return await cache.match(
          new URL("./", self.registration.scope).href
        ) || await cache.match(
          new URL("./index.html", self.registration.scope).href
        );
      }

      throw error;
    }
  })());
});

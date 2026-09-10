const CACHE_VERSION = "smartmom-v1";
const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  "/recorder/",
  "/recorder/index.html",
  "/recorder/manifest.json",
  "/recorder/icons/icon-192.png",
  "/recorder/icons/icon-512.png"
];

/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key =>
              key !== APP_CACHE &&
              key !== RUNTIME_CACHE
            )
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});


/* =========================================================
   FETCH
   ONLINE FIRST
   ========================================================= */

self.addEventListener("fetch", event => {

  const request = event.request;

  /* hanya GET */
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  /*
   Jangan intercept:
   - Gemini API
   - API endpoint eksternal
   - analytics
   */

  if (
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("generativelanguage.googleapis.com")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {

        /*
         Simpan hanya response valid.
         Clone karena response hanya bisa dibaca sekali.
        */

        if (
          response &&
          response.status === 200 &&
          response.type !== "opaque"
        ) {

          const clone = response.clone();

          caches.open(RUNTIME_CACHE)
            .then(cache => {
              cache.put(request, clone);
            })
            .catch(() => {});
        }

        return response;
      })
      .catch(() => {

        /*
         INTERNET GAGAL
         → ambil dari cache
        */

        return caches.match(request)
          .then(cached => {

            if (cached) {
              return cached;
            }

            /*
             Untuk navigation request,
             fallback ke app shell.
            */

            if (request.mode === "navigate") {
              return caches.match("/recorder/");
            }

            return new Response(
              "Offline resource unavailable",
              {
                status: 503,
                headers: {
                  "Content-Type": "text/plain"
                }
              }
            );

          });

      })
  );
});


/* =========================================================
   MESSAGE
   ========================================================= */

self.addEventListener("message", event => {

  if (!event.data) return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

});

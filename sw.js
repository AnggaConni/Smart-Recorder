const CACHE_VERSION = "smartmom-v1";

const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const BASE = "/Smart-Recorder/";

const APP_SHELL = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.json`,
  `${BASE}thumbnail.png`,
  `${BASE}icons/icon-192.png`,
  `${BASE}icons/icon-512.png`
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
      .then(keys => {

        return Promise.all(

          keys
            .filter(key =>
              key !== APP_CACHE &&
              key !== RUNTIME_CACHE
            )
            .map(key => caches.delete(key))

        );

      })
      .then(() => self.clients.claim())

  );

});


/* =========================================================
   FETCH
   ONLINE FIRST → OFFLINE FALLBACK
   ========================================================= */

self.addEventListener("fetch", event => {

  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  /*
   * Jangan intercept Gemini / external AI API.
   */

  if (
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("generativelanguage.googleapis.com")
  ) {
    return;
  }

  /*
   * Hanya handle aplikasi kita.
   */

  if (!url.pathname.startsWith(BASE)) {
    return;
  }


  event.respondWith(

    fetch(request)

      .then(response => {

        /*
         * ONLINE:
         * gunakan versi server terbaru
         * sekaligus update runtime cache.
         */

        if (
          response &&
          response.status === 200 &&
          response.type !== "opaque"
        ) {

          const copy = response.clone();

          caches.open(RUNTIME_CACHE)
            .then(cache => {
              cache.put(request, copy);
            })
            .catch(() => {});

        }

        return response;

      })

      .catch(() => {

        /*
         * OFFLINE:
         * gunakan cache.
         */

        return caches.match(request)
          .then(cached => {

            if (cached) {
              return cached;
            }

            /*
             * Jika membuka halaman ketika offline,
             * kembalikan app shell.
             */

            if (request.mode === "navigate") {

              return caches.match(
                `${BASE}index.html`
              );

            }

            return new Response(
              "Offline — resource not available.",
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
   UPDATE CONTROL
   ========================================================= */

self.addEventListener("message", event => {

  if (!event.data) return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

});

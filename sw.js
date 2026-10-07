/* 好運旺旺進財來 離線背景程式
   網頁：先上網抓最新，成功就順便存一份；沒網路才用存的。
   雲端開獎資料(閘道)等外部網址不經過這裡，一律直接上網。
   以後修改這個檔案時把 CACHE 的版本號加 1。
   v2(2026-10-07)：App 設定檔 manifest.webmanifest 改成一律先上網抓最新(id 改為 /haoyun-app/，避免跟抓539 撞號)。 */
const CACHE = "haoyun-v2";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./haoyun-192.png", "./haoyun-512.png", "./haoyun-maskable-512.png", "./haoyun-apple-touch.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).catch(function () {}));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin !== location.origin) return;
  const isPage = req.mode === "navigate" || /\/$|\.html$/.test(u.pathname);
  /* App 設定檔：先上網抓最新，沒網路才用存的 */
  if (/\.webmanifest$/.test(u.pathname)) {
    e.respondWith(fetch(req, { cache: "no-store" }).catch(function () { return caches.match(req); }));
    return;
  }
  if (isPage) {
    e.respondWith(fetch(req, { cache: "no-store" }).then(function (r) {
      if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then(function (c) { c.put("./index.html", copy); }); }
      return r;
    }).catch(function () { return caches.match("./index.html"); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (m) {
    return m || fetch(req).then(function (r) {
      if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return r;
    });
  }));
});

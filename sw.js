/* 抓539 離線背景程式(service worker)——iPhone、Android 共用
   策略：index.html 用「網路優先、離線才用快取」(有網路時一定拿到最新版程式，不會卡在舊版)；
   manifest／圖示用「快取優先」；跨網域請求(Cloudflare Worker 的開獎資料等)一律不攔、不快取。
   要強制所有手機更新快取時，把下面 CACHE 的版本字串改掉即可。 */
const CACHE = "zhua539-v2"; /* v2：換成使用者提供的「抓539」圖示 */
const SHELL = ["./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./icon-192-maskable.png", "./icon-512-maskable.png", "./apple-touch-icon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; /* 跨網域(雲端資料)不攔 */
  const isShellPage = req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("/index.html");
  if (isShellPage) {
    e.respondWith(fetch(req).then(function (res) {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(function (c) { c.put("./index.html", copy); }); }
      return res;
    }).catch(function () { return caches.match("./index.html").then(function (r) { return r || caches.match("./"); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (r) { return r || fetch(req).then(function (res) {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res; }); }));
});

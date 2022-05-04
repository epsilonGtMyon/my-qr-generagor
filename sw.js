(function () {
  const cacheName = "V1";
  const isLocal = location.hostname === "localhost";
  const prefix = isLocal ? "/" : "/my-qr-generator/";

  const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
  };

  self.addEventListener("install", (event) => {
    console.log("===========Service worker installed===========", event);
    const resources = [
      "index.html",
      "script.js",
      "icon.png",
      "manifest.json",

      `libs/bootstrap/bootstrap.bundle.min.js`,
      `libs/bootstrap/bootstrap.bundle.min.js.map`,
      `libs/bootstrap/bootstrap.min.css`,
      `libs/bootstrap/bootstrap.min.css.map`,
      `libs/qrcode/qrcode.js`,
    ].map((x) => `${prefix}${x}`);
    console.log("resources", resources);

    event.waitUntil(addResourcesToCache(resources));
  });
  self.addEventListener("activate", (event) => {
    console.log("===========Service worker activated===========", event);
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((r) => {
        return r || fetch(event.request);
      })
    );
  });
})();

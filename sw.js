(function () {
  const appName = "my-qr-generator";
  const cacheName = `${appName}-V1`;
  const isLocal = location.hostname === "localhost";
  const prefix = isLocal ? "/" : "/my-qr-generator/";

  function toResource(path) {
    return `${prefix}${path}`;
  }

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
    ].map(toResource);
    console.log("resources", resources);

    event.waitUntil(
      (async () => {
        const cache = await caches.open(cacheName);
        await cache.addAll(resources);
      })()
    );
  });

  self.addEventListener("activate", async (event) => {
    console.log("===========Service worker activated===========", event);
  
    event.waitUntil(
      (async () => {
        //ここには今キャッシュにあるやつのkeyList
        //つまり古いやつ？
        const keyList = await caches.keys();
        console.log("keyList", keyList);
        const promises = keyList
          .filter((key) => {
            if (!key.startsWith(appName)) {
              console.log(key);
              return false;
            }
  
            return cacheName !== key;
          })
          .map((key) => caches.delete(key));
  
        return Promise.all(promises);
      })()
    );
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(
      (async () => {
        const response = await caches.match(event.request);
        return response || fetch(event.request);
      })()
    );
  });
})();

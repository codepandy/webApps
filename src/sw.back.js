
this.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open("my-test-cache-v1")
      .then(function (cache) {
        // 通过 cache 缓存对象的 addAll 方法设置缓存列表
        return cache.addAll([
          "/",
          "/index.html",
          "/main.css",
          "/main.js",
          "/image.jpg",
        ]);
      })
      .then(function () {
        this.skipWaiting();
      })
  );
  // 这和点击浏览器中的skipWaiting一样，强制停止旧的serviceworker，激活新的
  event.waitUntil(this.skipWaiting());
});

// 安装成功后就该激活
this.addEventListener("activate", function (event) {
  event.waitUntil(
    Promise.all([
      // 使首次加载的页面可以直接被控制
      this.clients.claim(),

      // 激活后，获取缓存列表
      caches.keys.then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            // 删除不必要的缓存
            if (cacheName !== "my-test-cache-v1") {
              return catches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});

// 从缓存读取数据
this.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open("my-test-cache-v1").then((cache) => {
      return cache.match(event.request).then((response) => {
        // 如果缓存中有则从缓存中返回
        if (response) {
          return response;
        }
        // 如果缓存中没有，则从服务器获取
        fetch(event.request).then((response) => {
          // 因为response是流式的，只能获取一次，所以缓存的时候clone一份
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

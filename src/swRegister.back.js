export const register = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(function (registration) {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        })
        .catch(function (err) {
          console.log("ServiceWorker registration failed: ", err);
        });
    });
    navigator.serviceWorker.oncontrollerchange = function () {
      showToast("页面已更新！");
    };
    if (navigator.online) {
      showToast("网络已断开，内容可能已过期");
      window.addEventListener("online", function () {
        showToast("网络已连接");
      });
    }
  }
};

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

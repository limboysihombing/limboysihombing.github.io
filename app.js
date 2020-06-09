import nav from './src/js/nav.js'

document.addEventListener("DOMContentLoaded", () => {
  registerServeiceWorker()
  nav.loadNav()  
});

function registerServeiceWorker() {
  if("serviceWorker" in navigator) {
    requestPermission()
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {

          console.log(`Pendaftaran service worker berhasil. Scope:  ${registration.scope}`)
        })
        .catch((err) => {
          console.log(`Pendaftaran serveice worker gagal. Error: ${err}`)
        })
    })
  } else {
    console.log("Service worker belum didukung pada browser ini.")
  }
}

function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }
      
      if (('PushManager' in window)) {
          navigator.serviceWorker.getRegistration().then(function(registration) {
              registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array("BMsmQg_2IBZ64jsdBTaKBoBFThuwJP4-K2n1VsLA1RKv9kmIzAtSvd46DE8aikz-h6HdM4AJ18xg6E388URloHI")
              }).then(function(subscribe) {
                  console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                  console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('p256dh')))));
                  console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('auth')))));
              }).catch(function(e) {
                  console.error('Tidak dapat melakukan subscribe ', e.message);
              });
          });
      }
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
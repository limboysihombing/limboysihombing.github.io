const CACHE_NAME = "football";
let urlsToCache = [
  "/",
  "/index.html",
  "/team-detail.html",
  "/app.js",
  "/src/components/nav.html",
  "/icon.png",
  "/favicon.ico",
  "/manifest.json",
  
  "/src/css/materialize.min.css",
  "/src/css/style.css",
  
  "/src/js/api.js",
  "/src/js/db.js",
  "/src/js/idb.js",
  "/src/js/materialize.min.js",
  "/src/js/nav.js",
  "/src/js/team-detail.js",
  "/src/js/view.js",

  "/src/pages/about.html",
  "/src/pages/home.html",
  "/src/pages/saved-teams.html",
  "/src/pages/saved-matches.html",
  


  "/src/images/league/2001.png",
  "/src/images/league/2002.png",
  "/src/images/league/2003.png",
  "/src/images/league/2014.png",
  "/src/images/league/2015.png",
  "/src/images/league/2021.png",

  "/src/images/notif.png",
  "/src/images/icons/icon-72x72.png",
  "/src/images/icons/icon-96x96.png",
  "/src/images/icons/icon-128x128.png",
  "/src/images/icons/icon-144x144.png",
  "/src/images/icons/icon-152x152.png",
  "/src/images/icons/icon-192x192.png",
  "/src/images/icons/icon-384x384.png",
  "/src/images/icons/icon-512x512.png",
  
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  const base_url = "https://api.football-data.org/v2/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      }).catch(error => {
        if (!error.response) {
          error.errorStatus = 'Error: Network Error';
      } else {
          error.errorStatus = error.response.data.message;
      }
      console.log(error.errorStatus)
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  const options = {
    body: body,
    icon: 'src/images/notif.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
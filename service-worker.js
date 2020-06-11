importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

console.log("blooon")
if (workbox) {
    console.log(`Workbox berhasil dimuat`);

} else {
    console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute(
  [
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/team-detail.html', revision: '1' },
    { url: '/app.js', revision: '1' },
    { url: '/src/components/nav.html', revision: '1' },
    { url: '/icon.png', revision: '1' },
    { url: '/favicon.ico', revision: '1' },
    { url: '/manifest.json', revision: '1' },

    { url: '/src/css/materialize.min.css', revision: '1' },
    { url: '/src/css/style.css', revision: '1' },
    { url: '/src/js/api.js', revision: '1' },
    
    { url: "/src/js/db.js", revision: '1' },
    { url: "/src/js/idb.js", revision: '1' },
    { url: "/src/js/materialize.min.js", revision: '1' },
    { url: "/src/js/nav.js", revision: '1' },
    { url: "/src/js/team-detail.js", revision: '1' },
    { url: "/src/js/view.js", revision: '1' },
  
    { url: "/src/images/notif.png", revision: '1' },
  ], {
    ignoreUrlParametersMatching: [/.*/]
  }
)
// Football Data API
workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'footbal-data-api'
  })
)

// images expiration
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
          new workbox.expiration.Plugin({
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
          }),
      ],
  }),
);

// Icons
workbox.routing.registerRoute(
  new RegExp('/src/images/icons/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'icons'
  })
);

// Leagues Logo
workbox.routing.registerRoute(
  new RegExp('src/images/league/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'leagues'
  })
);

// Pages 
workbox.routing.registerRoute(
  new RegExp('/src/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('.*\.css'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('.*\.png'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('/team-detail.html'),
  workbox.strategies.staleWhileRevalidate({
    ignoreSearch: true,
    cacheName: 'detail-team'
})
);

// Push Notification
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


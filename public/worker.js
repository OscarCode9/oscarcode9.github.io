// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.text() : 'no payload';
  event.waitUntil(
    self.registration.showNotification('ServiceWorker Cookbook', {
      body: payload,
    })
  );
});

const CACHE_NAME = 'mySiteCachev1';
const urlsToCache = [
  '/styles.js',
  '/css/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.responWith(
    caches.match(event.request)
      .then((res) => {
        if (res) {
          return res;
        }
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then((res) => {
          if (res || res.status !== 200 || res.type !== 'basic') {
            return res;
          }
          const responseToCache = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

        })
      })
  )
});


// Saveur N°5 — Service Worker
// Cache l'app shell pour le mode hors ligne

const CACHE_NAME = 'saveur-n5-v19';
const APP_SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/state.js',
  './js/logic.js',
  './js/ui.js',
  './js/app.js',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/placeholder.webp',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap'
];

// Installation : mise en cache de l'app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache de l\'app shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation : suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Suppression ancien cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch : stratégie Cache First pour l'app shell, Network First pour les images
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Images Unsplash → réseau uniquement, fallback placeholder mis en cache
  if (url.hostname === 'source.unsplash.com') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('./images/placeholder.webp').then(r => r || new Response('', { status: 503 }))
      )
    );
    return;
  }

  // Google Fonts → stale-while-revalidate
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          const network = fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          });
          return cached || network;
        })
      )
    );
    return;
  }

  // index.html → Network First : les mises à jour de l'app sont immédiates si en ligne
  const accept = event.request.headers.get('accept') || '';
  const isHtml = accept.includes('text/html') || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isHtml) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // App shell (JS/CSS/images) → Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => {
        if (accept.includes('text/html')) return caches.match('./index.html');
      });
    })
  );
});

// Message handler : permet au client de forcer l'activation immédiate du nouveau SW
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

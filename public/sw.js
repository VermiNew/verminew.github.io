const version = new URL(self.location.href).searchParams.get('v') || 'development';
const CACHE_PREFIX = 'verminew';
const STATIC_CACHE = `${CACHE_PREFIX}-${version}-static`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-${version}-runtime`;
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/Logo.webp',
  '/assets/favicons/logo192.png',
  '/assets/favicons/logo512.png',
];

const cacheCoreAssets = async () => {
  const cache = await caches.open(STATIC_CACHE);
  const results = await Promise.allSettled(
    CORE_ASSETS.map(async (asset) => {
      const response = await fetch(asset, { cache: 'reload' });
      if (!response.ok) throw new Error(`Unable to cache ${asset}: ${response.status}`);
      await cache.put(asset, response);
    }),
  );

  const cachedAssets = results.filter((result) => result.status === 'fulfilled').length;
  if (cachedAssets === 0) throw new Error('No core application assets could be cached.');
};

self.addEventListener('install', (event) => {
  event.waitUntil(cacheCoreAssets());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(`${CACHE_PREFIX}-`))
        .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
        .map((key) => caches.delete(key)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') void self.skipWaiting();
});

const navigationNetworkFirst = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request))
      || (await caches.match('/index.html'))
      || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
};

const repositoryDataNetworkFirst = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request, { cache: 'no-cache' });
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || new Response(
      JSON.stringify({ error: 'Repository data is unavailable offline.' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const update = fetch(request)
    .then(async (response) => {
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || (await update) || new Response('', { status: 504, statusText: 'Gateway Timeout' });
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(navigationNetworkFirst(request));
    return;
  }

  if (url.pathname === '/data/repos.json') {
    event.respondWith(repositoryDataNetworkFirst(request));
    return;
  }

  if (['script', 'style', 'image', 'font'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

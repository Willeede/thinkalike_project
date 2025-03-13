self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.href.includes('thinkalike-api.onrender.com')) {
    const cleanUrl = url.href.replace(/\s+/g, '');

    const newRequest = new Request(cleanUrl, {
      method: event.request.method,
      headers: event.request.headers,
      mode: event.request.mode,
      credentials: event.request.credentials,
      redirect: event.request.redirect
    });

    event.respondWith(fetch(newRequest));
  }
});

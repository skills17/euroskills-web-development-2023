const cacheName = 'ai-news';

self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            try {
                // always try to load from the network first
                const res = await fetch(event.request);

                // if successful, add to cache
                (await caches.open(cacheName)).put(event.request, res.clone());

                return res;
            } catch (e) {
                // otherwise return from cache
                return caches.match(event.request)
            }
        })(),
    );
});

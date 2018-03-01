const cachePrefix = 'resto-revs';
const cacheVersion = 'v0001';
const cacheName = `${cachePrefix}-${cacheVersion}`;

self.addEventListener('install', event => {
    // console.log('Service worker install event handler called :', event);
    
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                let requests = [
                    '/index.html', '/data/restaurants.json',
                    '/img/folder-web-yellow.ico',
                    '/css/styles.css', '/css/styles.min.css',
                    '/js/urlhelper.js', '/js/urlhelper.min.js',
                    '/js/dbhelper.js', '/js/dbhelper.min.js',
                    '/js/main.js', '/js/main.min.js',
                    '/js/restaurant_info.js', '/js/restaurant_info.min.js'
                ];
                /* Uncomment to cache all restaurant site urls
                const imageSuffixes = ['', '-200', '-300', '-400', '-500', '-600'];
                for (let i = 1; i <= 10; i++) {
                    imageSuffixes.forEach(imgSuffix => { 
                        requests.push(`/img/${i}${imgSuffix}.jpg`)
                    });
                    requests.push(`/restaurant.html?id=${i}`);
                }
                */
                return cache.addAll(requests);
            })
    );
});

self.addEventListener('activate', event => {
    // console.log('Service worker activate event handler called :', event);
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                    .filter(cn => cn.startsWith(cachePrefix) && cn !== cacheName)
                    .map(cn => caches.delete(cn))
                );
            })
    );
});

self.addEventListener('fetch', event => {
    // console.log('Service worker fetch event handler called :', event);

    const requestUrl = new URL(event.request.url);
    return new Promise((resolve, reject) => {
        caches.open(cacheName)
            .then(cache => {
                let matchPromise = null;
                if (!requestUrl.pathname || requestUrl.pathname === '/')
                    matchPromise = cache.match('/index.html');
                else
                    matchPromise = cache.match(event.request);
                matchPromise
                    .then(cachedResponse => {
                        if (cachedResponse)
                            return resolve(cachedResponse);
                        fetch(event.request)
                            .then(networkResponse => {
                                cache.put(event.request, networkResponse.clone());
                                return resolve(networkResponse);
                            })
                            .catch(err => console.error(err));
                    })
                    .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    });
});

/*
self.addEventListener('message', event => {
    // console.log('Service worker message event handler called :', event);
});
*/
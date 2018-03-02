const cachePrefix = 'resto-revs';
const cacheVersion = 'v0001';
const cacheName = `${cachePrefix}-${cacheVersion}`;

self.addEventListener('install', event => {
    // console.log('Service worker install event handler called :', event);
    
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                
                // Cache main application resources
                let requests = [
                    'index.html', 'restaurant.html',
                    'data/restaurants.json',
                    'img/folder-web-yellow.ico',
                    'css/styles.css', 'css/styles.min.css',
                    'js/urlhelper.js', 'js/urlhelper.min.js',
                    'js/dbhelper.js', 'js/dbhelper.min.js',
                    'js/main.js', 'js/main.min.js',
                    'js/restaurant_info.js', 'js/restaurant_info.min.js'
                ];
                
                // Cache all images preactivelly
                const imgSuffs = ['', '-200', '-300', '-400', '-500', '-600'];
                for (let i = 1; i <= 10; i++) {
                    imgSuffs.forEach(imgSuffix => requests.push(`img/${i}${imgSuffix}.jpg`));
                }

                return cache.addAll(requests);
            })
            .catch(err => console.error(err))
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
            .catch(err => console.error(err))
    );
});

self.addEventListener('fetch', event => {
    // console.log('Service worker fetch event handler called :', event);

    const requestUrl = new URL(event.request.url);

    // Comment the following block in order to cache external origin requests
    if (requestUrl.origin !== location.origin) {
        return fetch(event.request);
    }
    
    return new Promise((resolve, reject) => {
        caches.open(cacheName)
            .then(cache => {
                let cacheKey = event.request;
                if (!requestUrl.pathname) {
                    cacheKey = 'index.html';
                } else if (requestUrl.pathname.endsWith('.jpg')) {
                    cacheKey = requestUrl.pathname.replace(/-\d+\.jpg$/, '.jpg');
                }
                cache.match(cacheKey)
                    .then(cachedResponse => {
                        if (cachedResponse)
                            return resolve(cachedResponse);
                        fetch(event.request)
                            .then(networkResponse => {
                                cache.put(cacheKey, networkResponse.clone());
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
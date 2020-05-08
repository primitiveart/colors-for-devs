importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js');

workbox.googleAnalytics.initialize();

workbox.precaching.precache([
    {
        url: 'https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900|Montserrat:400,500,600,700,800|Merienda+One',
        revision: '292018'
    }, {
        url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css',
        revision: '292018'
    }, {
        url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/fonts/fontawesome-webfont.woff2?v=4.6.0',
        revision: '292018'
    }, {
        url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/fonts/fontawesome-webfont.woff?v=4.6.0',
        revision: '292018'
    }
]);

workbox.precaching.precacheAndRoute(
    self.__WB_MANIFEST,
    {
        ignoreUrlParametersMatching: [/.*/]
    }
);

workbox.loadModule('workbox-strategies');

self.addEventListener('fetch', function(event) {
    // Redirect URLs with hex codes to index.html
    if (event.request.url.match(/(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})$/ig) !== null) {
        event.respondWith(fetch('/index.html'));
    }

    // Cache google fonts (don't use `workbox.precaching.precache` since versions could change)
    if (event.request.url.startsWith('https://fonts.gstatic.com/s/')) {
        var CacheFirst = new workbox.strategies.CacheFirst();
        event.respondWith(CacheFirst.handle({event: event, request: event.request}));
    }
});

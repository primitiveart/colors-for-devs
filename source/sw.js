importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

workbox.googleAnalytics.initialize();

workbox.precaching.precache([
    {
        url: 'https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900|Montserrat:400,500,600,700,800|Merienda+One',
        revision: '292018'
    }, {
        url: 'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmWUlfBBc4.woff2 ',
        revision: '292018'
    }, {
        url: ' https://fonts.gstatic.com/s/montserrat/v12/JTURjIg1_i6t8kCHKm45_dJE3gnD_g.woff2',
        revision: '292018'
    }, {
        url: 'https://fonts.gstatic.com/s/montserrat/v12/JTURjIg1_i6t8kCHKm45_ZpC3gnD_g.woff2',
        revision: '292018'
    }, {
        url: 'https://fonts.gstatic.com/s/montserrat/v12/JTURjIg1_i6t8kCHKm45_bZF3gnD_g.woff2',
        revision: '292018'
    }, {
        url: 'https://fonts.gstatic.com/s/meriendaone/v8/H4cgBXaMndbflEq6kyZ1ht6ohYaz.woff2',
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
    [],
    {
        ignoreUrlParametersMatching: [/.*/]
    }
);

self.addEventListener('fetch', function(event) {
    // Redirect URLs with hex codes to index.html
    if (event.request.url.match(/(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})-(([a-fA-F0-9]){6})$/ig) !== null) {
        event.respondWith(fetch('/index.html'));
    }
});


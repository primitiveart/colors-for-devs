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
    [{"revision":"b9ca3dad57dcec43e6798023da14184b","url":"app/app.js"},{"revision":"587a014970fa69fec4338fff84e243d5","url":"assets/css/style.css"},{"revision":"b3d84d8d33032136af4033aa94e47d93","url":"assets/dependencies/angular-animate/angular-animate.min.js"},{"revision":"613274fe74404112d98709adf0a28b69","url":"assets/dependencies/angular/angular.min.js"},{"revision":"af8ab36589315582ccdd82f22e84bffb","url":"assets/dependencies/clipboard/dist/clipboard.min.js"},{"revision":"dc5e7f18c8d36ac1d3d4753a87c98d0a","url":"assets/dependencies/jquery/dist/jquery.min.js"},{"revision":"7963263c39211caec54502c8ab1dbdb1","url":"assets/dependencies/spectrum-colorpicker/spectrum.css"},{"revision":"983d789ca8236c0fb994391e7f0e34f7","url":"assets/dependencies/spectrum-colorpicker/spectrum.js"},{"revision":"3833da2a26a7a594655870c7d8583d9f","url":"assets/images/close.gif"},{"revision":"14e65ac186661f51bf5f5e150a316f00","url":"assets/images/favicon.ico"},{"revision":"db632b09f9e795fea8674e116acd2fac","url":"assets/images/icons/apple-touch-icon-precomposed.png"},{"revision":"e492bdaa850cfff074ec069cac24dd92","url":"assets/images/icons/icon-128x128.png"},{"revision":"94e221676b486b85571c83eb515b17e4","url":"assets/images/icons/icon-144x144.png"},{"revision":"ed3720f381e04c4fae1e9c8a111f798e","url":"assets/images/icons/icon-152x152.png"},{"revision":"7fa5ecfc3c3a064aa30819cb31851014","url":"assets/images/icons/icon-192x192.png"},{"revision":"a5a75d4e80057dc3b804e99bbfd45570","url":"assets/images/icons/icon-384x384.png"},{"revision":"71c9359568355f02cd0e2b81262a9b5e","url":"assets/images/icons/icon-512x512.png"},{"revision":"7e66d8acab6bffdb217b615f53fdc550","url":"assets/images/icons/icon-72x72.png"},{"revision":"caa9104de8bd7a354387834504fa575c","url":"assets/images/icons/icon-96x96.png"},{"revision":"cd4e58df8616229526ccfc7046fad1fb","url":"index.html"},{"revision":"04e95aec2fc17eace41cd484fcd0831c","url":"manifest.json"}],
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

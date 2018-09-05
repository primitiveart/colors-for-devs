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

workbox.precaching.precacheAndRoute([
  {
    "url": "app/app.js",
    "revision": "77b293569308d443880b1cc7e4fe70ae"
  },
  {
    "url": "assets/css/style.css",
    "revision": "3705a26cff222cb5b265658af40b1204"
  },
  {
    "url": "assets/dependencies/angular-animate/angular-animate.min.js",
    "revision": "74b42c1f33b21c8bbd72bafbedbb85f6"
  },
  {
    "url": "assets/dependencies/angular/angular.min.js",
    "revision": "a3635f2c02e1972150e3413d8a9656e8"
  },
  {
    "url": "assets/dependencies/clipboard/dist/clipboard.min.js",
    "revision": "ac41e63d15e88d7d9bdd42592ffff7a2"
  },
  {
    "url": "assets/dependencies/jquery/dist/jquery.min.js",
    "revision": "a09e13ee94d51c524b7e2a728c7d4039"
  },
  {
    "url": "assets/dependencies/spectrum-colorpicker/spectrum.css",
    "revision": "7963263c39211caec54502c8ab1dbdb1"
  },
  {
    "url": "assets/dependencies/spectrum-colorpicker/spectrum.js",
    "revision": "354a9e65608da32d1133803920620a54"
  },
  {
    "url": "assets/images/close.gif",
    "revision": "3833da2a26a7a594655870c7d8583d9f"
  },
  {
    "url": "assets/images/favicon.ico",
    "revision": "2f39fdc509a0f815ae184768e236a757"
  },
  {
    "url": "assets/images/icons/icon-128x128.png",
    "revision": "1f4d65bf8ef326fe6d5604809b322787"
  },
  {
    "url": "assets/images/icons/icon-144x144.png",
    "revision": "def0b7775ce162711e2f0c5081c7b759"
  },
  {
    "url": "assets/images/icons/icon-152x152.png",
    "revision": "97e0c01a8dd294796914030a25fa1abb"
  },
  {
    "url": "assets/images/icons/icon-192x192.png",
    "revision": "db2b4853621cc2336314aa7515bd7bd1"
  },
  {
    "url": "assets/images/icons/icon-384x384.png",
    "revision": "fbe26d5b0dc7f41e756a5e3548d788e8"
  },
  {
    "url": "assets/images/icons/icon-512x512.png",
    "revision": "6414ecee83537a36c968942f0bb8f25c"
  },
  {
    "url": "assets/images/icons/icon-72x72.png",
    "revision": "05ceb70d302116dc287f7f16019a36b1"
  },
  {
    "url": "assets/images/icons/icon-96x96.png",
    "revision": "8b8659f77b634c0b553ae168f905184f"
  },
  {
    "url": "index.html",
    "revision": "cc044efbb86d26b1916eda0b4e557355"
  },
  {
    "url": "manifest.json",
    "revision": "3dea9821ddcfd0e1c6c07ede1ed2b13a"
  }
],
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


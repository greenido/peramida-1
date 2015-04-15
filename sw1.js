//
// Service Worker - To enable our game to work in an offline mode 
// Author: @greenido
// Date: April 2015
//
importScripts("serviceworker-cache-polyfill.js");
this.version = 1.0;

console.log("I am a sw1.js ver:" + this.version +
            " - Ready to do the work");


var CACHE_NAME = 'sw1-cache-v' + this.version;

// The files we want to cache
// TODO:
var urlsToCache = [
  'index.html',
  'js/vendor/jquery.js',
  'js/foundation.min.js',
  'js/foundation/foundation.topbar.js',
  'js/foundation/foundation.slider.js',
  'js/foundation/foundation.alert.js',
  'js/vendor/modernizr.js',
  'js/main.js',
  'js/intro.js',
  'css/foundation.css',
  'css/main.css',
  'css/introjs.css',
  'imgs/pyramid-small.png',
  't-up.gif',
  'il_flag_32x24.jpg',
  'us_flag_32x24.jpg'
];

// Set the callback for the install step
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache:' + CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );

});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        console.log("Got res:"+response);
        if (response) {
          console.log("Cache hit: " + JSON.stringify(response.url) );
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              console.log("return res:"+response.url + " status: "+response.status);
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

//
// Let's clean the old cache
//
self.addEventListener('activate', function(event) {
  console.log("sw1 have been activated. Cache name:" + CACHE_NAME);
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          console.log("Deleteing cache: " + cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//
//
//
self.addEventListener('message', function(e) {
  var message = e.data;
  console.log("sw1 have just got the message:" + message);
});
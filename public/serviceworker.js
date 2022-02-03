const CACHE_NAME = "version-1"
const urlsToCache = ["index.html", "offline.html"]

// this in SW file represents the SW not the window obj
const self = this

// Install a Service Worker (SW)
self.addEventListener("install", (e) => {
    e.waitUntil(
        // Creating a cache with name CACHE_NAME
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Opened cache")
                // Adding urls to cache
                return cache.addAll(urlsToCache)
            })
    )
})

// Listen for requests
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request) // E.g a request to view an image or API call
            .then(() => {
                return fetch(e.request) // Then for all the requests we fetch again
                    .catch(() => caches.match("offline.html")) // If request can't be fetched return the offline.html
            })
    )
})

// Activate the  service worker
self.addEventListener("activate", (e) => {
    const cacheWhitelist = []
    cacheWhitelist.push(CACHE_NAME)

    e.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName)
                }
            })
        ))
    )
})
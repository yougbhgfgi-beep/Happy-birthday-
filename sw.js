const CACHE_NAME = 'love-story-cache-v10'
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/maze.html',
  '/assets/index-new.js?v=9',
  '/assets/index-DtXZcElU.css?v=7',
  '/assets/birthday-confetti.js?v=1',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/icon-192-maskable.png',
  '/images/icon-512-maskable.png',
  '/images/ending-bg.svg',
  '/images/gallery-1.jpeg',
  '/images/gallery-2.jpeg',
  '/images/gallery-3.jpeg',
  '/images/gallery-4.jpeg',
  '/images/gallery-5.jpeg',
  '/images/gallery-6.jpeg',
  '/images/gallery-7.jpeg',
  '/media/Albumaty.Com.Julia.Butros.Ala.Slamto.mp3',
  '/media/شايف حبيبي شايف ...mp4'
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => {
        if (k !== CACHE_NAME) return caches.delete(k)
        return null
      }))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((resp) => {
        if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp
        const clone = resp.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        return resp
      })
    }).catch(() => caches.match('/index.html'))
  )
})

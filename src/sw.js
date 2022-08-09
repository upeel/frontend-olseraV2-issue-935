import { CacheFirst } from 'workbox-strategies/CacheFirst'
import { ExpirationPlugin } from 'workbox-expiration/ExpirationPlugin'
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute'
import { registerRoute } from 'workbox-routing/registerRoute'
import { cacheNames, setCacheNameDetails } from 'workbox-core'

precacheAndRoute(self.__WB_MANIFEST);

// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });

setCacheNameDetails({
  prefix: 'olsbo-' + process.env.ENV_CONFIG,
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
})

registerRoute(
  ({ url }) => url.pathname.startsWith('/static/'),
  new CacheFirst({
    cacheName: cacheNames.precache,
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 3 * 24 * 60 * 60,
        maxEntries: 10
      })
    ]
  })
)

self.skipWaiting()

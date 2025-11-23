if (!self.define) {
  let e,
    s = {}
  const a = (a, n) => (
    (a = new URL(a + '.js', n).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = a), (e.onload = s), document.head.appendChild(e)
        } else (e = a), importScripts(a), s()
      }).then(() => {
        let e = s[a]
        if (!e) throw new Error(`Module ${a} didn’t register its module`)
        return e
      })
  )
  self.define = (n, c) => {
    const t =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[t]) return
    let i = {}
    const r = (e) => a(e, t),
      u = { module: { uri: t }, exports: i, require: r }
    s[t] = Promise.all(n.map((e) => u[e] || r(e))).then((e) => (c(...e), i))
  }
}
define(['./workbox-4754cb34'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: 'b9d251099d4c207841cff04fed11d251',
        },
        {
          url: '/_next/static/chunks/181-6db69f410ad12d94.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/459-044dfd12bc9b43e0.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/4bd1b696-2b34609957ff5c8d.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/517-8488beef2cdd8bfa.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/562-b76922c7965ca9cb.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/577-868340e823d45913.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/590-6506e921d7ca0f2e.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/814-a2ba1d19280f3a9f.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/888-4b29dc9010c70b5f.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/948-a03e7ec5a9b1988c.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/978-3474eceac85d414a.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/9eeab064-c182d5d36d470142.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/(auth)/login/page-4192d38b38fe44d5.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/(auth)/signup/page-fd40f0a284c4d2f9.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-5444330ce1410ebc.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/admin/feedback/page-e510ebd7a9f2aa41.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/admin/materials/page-1c598a031b5abe6c.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/admin/page-5f32eb80c931344a.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/admin/skills/page-fa7e42fbbfbdceff.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/admin/students/%5BstudentId%5D/page-2b86ae2514f19781.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/admin/students/page-0224a2d9bd17b845.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/admin/summary/page-75140ffd64d234e5.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/layout-32d08107206b8af1.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/page-8d5a5c8f47272297.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/serverside/page-eb89c776c05a23a3.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/dashboard/page-fe264fdc4c64b5e6.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/feedback/page-e20060a484dd22c1.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/mode/page-5024b46f2940d754.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/page-e322e1d042eebe82.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/reading/page-95bf4e43ed9f3ac5.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/reading/score/%5BmaterialBatch%5D/page-5922fc6f76dd7483.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/reading/score/page-f1a8fb2da6ead934.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/app/student/resources/page-5dd481f938efcfcc.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/bc9e92e6-d4abff233d47277f.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/framework-895c1583be5f925a.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/main-818a54dc41bbdcb9.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/main-app-e1b820f69472a185.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/pages/_app-abffdcde9d309a0c.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/pages/_error-94b8133dd8229633.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-5c7a0cc1538f4617.js',
          revision: 'rk4vAFDQ9UMplc_z5YbJ_',
        },
        {
          url: '/_next/static/css/7af6fc749ec79fae.css',
          revision: '7af6fc749ec79fae',
        },
        {
          url: '/_next/static/media/4cf2300e9c8272f7-s.p.woff2',
          revision: '18bae71b1e1b2bb25321090a3b563103',
        },
        {
          url: '/_next/static/media/747892c23ea88013-s.woff2',
          revision: 'a0761690ccf4441ace5cec893b82d4ab',
        },
        {
          url: '/_next/static/media/8d697b304b401681-s.woff2',
          revision: 'cc728f6c0adb04da0dfcb0fc436a8ae5',
        },
        {
          url: '/_next/static/media/93f479601ee12b01-s.p.woff2',
          revision: 'da83d5f06d825c5ae65b7cca706cb312',
        },
        {
          url: '/_next/static/media/9610d9e46709d722-s.woff2',
          revision: '7b7c0ef93df188a852344fc272fc096b',
        },
        {
          url: '/_next/static/media/ba015fad6dcf6784-s.woff2',
          revision: '8ea4f719af3312a055caf09f34c89a77',
        },
        {
          url: '/_next/static/rk4vAFDQ9UMplc_z5YbJ_/_buildManifest.js',
          revision: '401896e22bf27b60a6e54815dd656568',
        },
        {
          url: '/_next/static/rk4vAFDQ9UMplc_z5YbJ_/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        {
          url: '/images/background.svg',
          revision: '14960ecd5a68174292c704fc29dc12d2',
        },
        { url: '/logo.svg', revision: 'e2307604b409007e43470bbe07f7d7b4' },
        { url: '/manifest.json', revision: '67cc92000341e98b224499b22decdf2e' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        {
          url: '/t-brite-logo.png',
          revision: 'a5f61a8d32430e816c5dee0c374065b1',
        },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: n,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    )
})

// Empty service worker to disable PWA caching on Netlify
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

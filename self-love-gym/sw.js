const CACHE_PREFIX='self-love-gym-';
const CACHE=CACHE_PREFIX+'v12';
const ASSETS=[
  './','./index.html','./style.css?v=7','./presentation.css?v=9','./app.js?v=11','./manifest.webmanifest',
  './icon.svg','./icon-192.png','./icon-512.png','./greeting-3d.webp',
  './assets/moves/march.webp','./assets/moves/chair-stand.webp','./assets/moves/wall-pushup.webp','./assets/moves/side-step.webp',
  './assets/moves/calf-raise.webp','./assets/moves/knee-lift.webp','./assets/moves/breathing.webp','./assets/moves/shoulder-roll.webp',
  './assets/moves/side-reach.webp','./assets/moves/torso-turn.webp','./assets/moves/ankle-circle.webp','./assets/moves/hip-hinge.webp',
  './assets/moves/step-touch-clean.webp','./assets/moves/reach-pull-clean.webp','./assets/moves/heel-tap-clean.webp','./assets/moves/slow-walk-clean.webp'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));});

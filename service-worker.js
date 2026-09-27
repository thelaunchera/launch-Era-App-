const CACHE_NAME="tle-cleaning-app-20260927-unified-14";
const CORE=[
  "./",
  "./index.html",
  "./styles.css?v=20260927-unified-14",
  "./app.js?v=20260927-unified-14",
  "./i18n.js?v=20260927-unified-14",
  "./public.js?v=20260927-unified-14",
  "./manifest.webmanifest?v=20260927-unified-14"
];

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(CORE))
      .catch(()=>{})
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  event.respondWith((async()=>{
    try{
      const response=await fetch(new Request(event.request,{cache:"no-store"}));
      if(response&&response.ok){
        const cache=await caches.open(CACHE_NAME);
        cache.put(event.request,response.clone()).catch(()=>{});
      }
      return response;
    }catch{
      const cached=await caches.match(event.request);
      if(cached) return cached;
      if(event.request.mode==="navigate"){
        const fallback=await caches.match("./index.html");
        if(fallback) return fallback;
      }
      throw new Error("Offline");
    }
  })());
});

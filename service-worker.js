const CACHE_NAME="tle-cleaning-app-20260929-repo-cleanup-204";
const CORE=[
  "./boot.js?v=20260929-repo-cleanup-204",
  "./styles/boot.css?v=20260929-repo-cleanup-204",
  "./",
  "./index.html",
  "./styles.css?v=20260929-repo-cleanup-204",
  "./styles/workspace-components.css?v=20260929-repo-cleanup-204",
  "./styles/workspace-experience.css?v=20260929-repo-cleanup-204",
  "./styles/workspace-operations.css?v=20260929-repo-cleanup-204",
  "./styles/release-overrides.css?v=20260929-repo-cleanup-204",
  "./styles/release-mobile.css?v=20260929-repo-cleanup-204",
  "./styles/release-latest.css?v=20260929-repo-cleanup-204",
  "./styles/responsive-shell.css?v=20260929-repo-cleanup-204",
  "./styles/customer-documents.css?v=20260929-repo-cleanup-204",
  "./app.js?v=20260929-repo-cleanup-204",
  "./followups.js?v=20260929-repo-cleanup-204",
  "./i18n.js?v=20260929-repo-cleanup-204",
  "./public.js?v=20260929-repo-cleanup-204",
  "./vendor/supabase.js?v=20260929-repo-cleanup-204",
  "./manifest.webmanifest?v=20260929-repo-cleanup-204"
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
    const sensitiveParams=["token","session_id","invite","worker","billing","slug","public"];
    const hasSensitiveQuery=sensitiveParams.some(key=>url.searchParams.has(key));
    const isNavigation=event.request.mode==="navigate";
    const shouldCache=!isNavigation && !hasSensitiveQuery;

    try{
      const response=await fetch(new Request(event.request,{cache:"no-store"}));
      if(response&&response.ok&&shouldCache){
        const cache=await caches.open(CACHE_NAME);
        cache.put(event.request,response.clone()).catch(()=>{});
      }
      return response;
    }catch{
      if(shouldCache){
        const cached=await caches.match(event.request);
        if(cached) return cached;
      }
      if(isNavigation){
        const fallback=await caches.match("./index.html");
        if(fallback) return fallback;
      }
      throw new Error("Offline");
    }
  })());
});

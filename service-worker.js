const CACHE_NAME="tle-cleaning-app-20261001-night-sky-257";
const CORE=[
  "./boot.js?v=20261001-night-sky-257",
  "./styles/boot.css?v=20261001-night-sky-257",
  "./",
  "./index.html",
  "./styles.css?v=20261001-night-sky-257",
  "./styles/workspace-components.css?v=20261001-night-sky-257",
  "./styles/workspace-experience.css?v=20261001-night-sky-257",
  "./styles/workspace-operations.css?v=20261001-night-sky-257",
  "./styles/release-overrides.css?v=20261001-night-sky-257",
  "./styles/release-mobile.css?v=20261001-night-sky-257",
  "./styles/release-latest.css?v=20261001-night-sky-257",
  "./styles/responsive-shell.css?v=20261001-night-sky-257",
  "./styles/customer-documents.css?v=20261001-night-sky-257",
  "./styles/public-booking.css?v=20261001-night-sky-257",
  "./styles/booking-discounts.css?v=20261001-night-sky-257",
  "./styles/public-manage.css?v=20261001-night-sky-257",
  "./styles/invoice-polish.css?v=20261001-night-sky-257",
  "./app.js?v=20261001-night-sky-257",
  "./followups.js?v=20261001-night-sky-257",
  "./i18n-completion.js?v=20261001-night-sky-257",
  "./i18n.js?v=20261001-night-sky-257",
  "./onboarding-copy.js?v=20261001-night-sky-257",
  "./public-discounts.js?v=20261001-night-sky-257",
  "./public-manage.js?v=20261001-night-sky-257",
  "./public.js?v=20261001-night-sky-257",
  "./vendor/supabase.js?v=20261001-night-sky-257",
  "./manifest.webmanifest?v=20261001-night-sky-257"
];
const NAVIGATION_TIMEOUT_MS=2500;

function networkFetch(request){
  return fetch(new Request(request,{cache:"no-store"}));
}

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache=>{
        const missing=[];
        for(const url of CORE){
          const cached=await cache.match(url);
          if(!cached) missing.push(url);
        }
        if(missing.length) await cache.addAll(missing);
      })
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
    const isVersionedAsset=!isNavigation&&!hasSensitiveQuery&&url.searchParams.has("v");
    const shouldCache=!isNavigation&&!hasSensitiveQuery;

    if(isVersionedAsset){
      const cached=await caches.match(event.request);
      if(cached) return cached;
      try{
        const response=await networkFetch(event.request);
        if(response&&response.ok){
          const cache=await caches.open(CACHE_NAME);
          cache.put(event.request,response.clone()).catch(()=>{});
        }
        return response;
      }catch{
        throw new Error("Offline");
      }
    }

    if(isNavigation){
      const fallback=await caches.match("./index.html");
      if(!fallback){
        return networkFetch(event.request);
      }
      try{
        return await Promise.race([
          networkFetch(event.request),
          new Promise((_,reject)=>setTimeout(()=>reject(new Error("Navigation timeout")),NAVIGATION_TIMEOUT_MS))
        ]);
      }catch{
        return fallback;
      }
    }

    try{
      const response=await networkFetch(event.request);
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
      throw new Error("Offline");
    }
  })());
});


self.addEventListener("push",event=>{
  let data={};
  try{data=event.data?event.data.json():{};}catch{
    try{data={body:event.data?.text()||""};}catch{}
  }
  const title=data.title||"The Launch Era Cleaning Web App";
  const options={
    body:data.body||"You have a new update.",
    icon:data.icon||"./app-icon.svg",
    badge:data.badge||"./app-icon.svg",
    tag:data.tag||"tle-owner-alert",
    renotify:true,
    data:{
      url:data.url||"./",
      event_type:data.event_type||"",
      resource_type:data.resource_type||"",
      resource_id:data.resource_id||""
    }
  };
  const badgeCount=Math.max(1,Math.floor(Number(data.badge_count)||1));
  if("setAppBadge" in self.navigator) self.navigator.setAppBadge(badgeCount).catch(()=>{});
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=event.notification?.data?.url||"./";
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    for(const client of windows){
      try{
        if("focus" in client){
          await client.focus();
          if("navigate" in client && client.url!==target) await client.navigate(target);
          return;
        }
      }catch{}
    }
    if(self.clients.openWindow) await self.clients.openWindow(target);
  })());
});

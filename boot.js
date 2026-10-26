// The Launch Era Cleaning Web App — lightweight shell bootstrap.
// Keep this file UI-agnostic: analytics gating, boot errors, and service-worker registration only.
// Google Analytics is loaded by privacy-controls.js only after optional consent.
(function(){
  var host=String(location.hostname||"").toLowerCase();
  var ua=String(navigator.userAgent||"");
  var params=new URLSearchParams(location.search);
  var automation=Boolean(navigator.webdriver || /HeadlessChrome|PhantomJS|Google-InspectionTool|Lighthouse|PageSpeed/i.test(ua) || params.has("browser-smoke") || params.has("cross-browser-smoke") || params.has("ci-smoke") || params.has("token"));
  function update(){window.__tleAnalyticsEnabled=host==="app.thelaunchera.com"&&!automation&&window.TLEPrivacy?.allowed()===true;}
  update();window.addEventListener("tle:privacy-change",update);
})();

window.TLEAppPageEvent=function(page,base){
  try{
    if(typeof window.gtag!=="function") return;
    const raw=String(page||"/").replace(/^https?:\/\/[^/]+/,"");
    const clean=raw.startsWith("/app/")
      ? "/cleaning-app/"+raw.slice(5)
      : raw.startsWith("/public/")
        ? "/cleaning-app"+raw
        : raw==="/login"
          ? "/cleaning-app/login"
          : "/cleaning-app"+(raw.startsWith("/")?raw:"/"+raw);
    const pageLocation=window.location.origin+window.location.pathname+"#"+clean.replace(/^\//,"");
    const leaf=clean.split("/").filter(Boolean).slice(-1)[0]||"home";
    window.gtag("event","page_view",{
      ...base,
      page_path:clean,
      page_location:pageLocation,
      page_title:"Cleaning Web App · "+leaf
    });
  }catch{}
}
;

window.__tleBootErrorHandler = true;
    window.addEventListener("error", function(event){
      if(window.__tleAppReady) return;
      var splash=document.getElementById("sessionSplash");
      if(splash) splash.hidden=true;
      var auth=document.getElementById("authShell");
      if(auth){
        auth.hidden=false;
        auth.removeAttribute("aria-hidden");
      }
      var status=document.getElementById("authStatus");
      if(status){
        status.textContent="App loading failed. Please refresh.";
        status.dataset.type="error";
      }
    });

window.__tleShellVersion="20261026-app-privacy-r92";
    if ("serviceWorker" in navigator && location.hostname!=="127.0.0.1" && location.hostname!=="localhost") {
      window.addEventListener("load",function(){
        navigator.serviceWorker.register("./service-worker.js?v="+window.__tleShellVersion,{updateViaCache:"none"})
          .then(function(reg){
            // Check once on a natural page load. Do not update on focus/visibility:
            // iOS password autofill and returning from native apps both trigger
            // those events and previously caused visible reload/jump glitches.
            reg.update().catch(function(){});
          })
          .catch(function(err){console.warn("[TLE] service worker",err);});
      });
      navigator.serviceWorker.addEventListener("controllerchange",function(){
        // The new worker can control the current page without forcing a reload.
        // The next natural navigation receives the newest shell.
        try{sessionStorage.setItem("tle_sw_ready_"+window.__tleShellVersion,"1");}catch(e){}
      });
    }

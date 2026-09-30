// The Launch Era Cleaning App — lightweight shell bootstrap.
// Keep this file UI-agnostic: analytics gating, boot errors, and service-worker registration only.
(function(){
      try{
        var host=String(location.hostname||"").toLowerCase();
        var ua=String(navigator.userAgent||"");
        var params=new URLSearchParams(location.search);
        var automation=Boolean(
          navigator.webdriver ||
          /HeadlessChrome|PhantomJS|Google-InspectionTool|Lighthouse|PageSpeed/i.test(ua) ||
          params.has("browser-smoke") ||
          params.has("cross-browser-smoke") ||
          params.has("ci-smoke")
        );
        window.__tleAnalyticsEnabled=host==="app.thelaunchera.com"&&!automation;
        if(!window.__tleAnalyticsEnabled) return;
        window.dataLayer=window.dataLayer||[];
        window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
        var script=document.createElement("script");
        script.async=true;
        script.src="https://www.googletagmanager.com/gtag/js?id=G-N5BHMC432Q";
        document.head.appendChild(script);
        window.gtag("js",new Date());
        window.gtag("config","G-N5BHMC432Q",{send_page_view:false});
      }catch(e){window.__tleAnalyticsEnabled=false;}
    })();

window.__tleBootErrorHandler = true;
    window.addEventListener("error", function(event){
      var splash=document.getElementById("sessionSplash");
      if(splash) splash.hidden=true;
      var status=document.getElementById("authStatus");
      if(status && !window.__tleAppReady){
        status.textContent="App loading failed. Refreshing…";
        status.dataset.type="error";
      }
    });

window.__tleShellVersion="20260930-booking-quote-hierarchy-215";
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

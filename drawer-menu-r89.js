/* The Launch Era Cleaning App — right-side drawer and scroll lock, r89.
   Keeps existing navigation/permissions. Lenis is optional; native fallback always works. */
(() => {
  "use strict";
  const shell=document.getElementById("appShell");
  const panel=document.getElementById("sidebar");
  const scrim=document.getElementById("sidebarScrim");
  const main=shell?.querySelector(":scope > .main");
  const primary=document.getElementById("menuToggle");
  const secondary=document.getElementById("drawerMenuButton");
  const closeButton=document.getElementById("drawerCloseButton");
  const status=document.getElementById("drawerScrollState");
  if(!shell||!panel||!scrim||!main||!primary||!secondary||!closeButton) return;
  const mobile=()=>matchMedia("(max-width: 860px)").matches;
  let isOpen=false, opener=primary, saved=null, lenis=null, loading=false, disposed=false, rafId=0;
  const storeStyle=(element,name)=>({value:element.style.getPropertyValue(name),priority:element.style.getPropertyPriority(name)});
  const putStyle=(element,name,previous)=>{
    if(previous?.value) element.style.setProperty(name,previous.value,previous.priority);
    else element.style.removeProperty(name);
  };
  function clearLegacyInline(){
    for(const name of ["left","right","top","bottom","transform","-webkit-transform","visibility","opacity","pointer-events","display"]){
      panel.style.removeProperty(name);
    }
  }
  function syncControls(){
    document.body.classList.toggle("sidebar-is-open",isOpen);
    document.body.classList.toggle("tle-drawer-open",isOpen);
    panel.classList.toggle("open",isOpen);
    scrim.hidden=!isOpen;
    primary.setAttribute("aria-expanded",String(isOpen));
    secondary.setAttribute("aria-expanded",String(isOpen));
    closeButton.setAttribute("aria-expanded",String(isOpen));
    panel.inert=!isOpen&&mobile();
    panel.setAttribute("aria-hidden",String(!isOpen&&mobile()));
    closeButton.hidden=!isOpen;
    if(status){
      const stopped=Boolean(lenis?.isStopped)||isOpen;
      status.textContent=stopped?"Scroll locked":"Scroll live";
      status.classList.toggle("is-locked",stopped);
    }
  }
  function cancelBackgroundScroll(event){
    if(!isOpen||panel.contains(event.target))return;
    if(event.cancelable)event.preventDefault();
  }
  function lock(){
    if(saved)return;
    saved={
      mainTop:main.scrollTop, windowTop:window.scrollY,
      mainOverflow:storeStyle(main,"overflow-y"),
      htmlOverflow:storeStyle(document.documentElement,"overflow"),
      bodyOverflow:storeStyle(document.body,"overflow")
    };
    main.style.setProperty("overflow-y","hidden","important");
    document.documentElement.style.setProperty("overflow","hidden","important");
    document.body.style.setProperty("overflow","hidden","important");
    document.addEventListener("touchmove",cancelBackgroundScroll,{capture:true,passive:false});
    document.addEventListener("wheel",cancelBackgroundScroll,{capture:true,passive:false});
    lenis?.stop();
  }
  function unlock(){
    if(!saved)return;
    document.removeEventListener("touchmove",cancelBackgroundScroll,true);
    document.removeEventListener("wheel",cancelBackgroundScroll,true);
    const previous=saved;
    saved=null;
    putStyle(main,"overflow-y",previous.mainOverflow);
    putStyle(document.documentElement,"overflow",previous.htmlOverflow);
    putStyle(document.body,"overflow",previous.bodyOverflow);
    lenis?.start();
    // Restoring after start avoids Lenis/browser resetting the desktop offset.
    if(lenis && !mobile())lenis.scrollTo(previous.windowTop,{immediate:true,force:true});
    const restore=()=>{
      main.scrollTop=previous.mainTop;
      if(Math.abs(window.scrollY-previous.windowTop)>1)window.scrollTo({top:previous.windowTop,behavior:"instant"});
    };
    restore();
    requestAnimationFrame(restore);
  }
  function visible(node){
    return node&&!node.hidden&&getComputedStyle(node).display!=="none"&&!node.inert;
  }
  function restoreFocus(){
    const target=visible(opener)?opener:(visible(secondary)?secondary:primary);
    if(visible(target))target.focus({preventScroll:true});
  }
  function setOpen(value){
    const next=Boolean(value)&&document.body.classList.contains("shell-app")&&!shell.hidden;
    if(next===isOpen){syncControls();return;}
    isOpen=next;
    clearLegacyInline();
    syncControls();
    if(isOpen){
      lock();
      ensureLenis();
      requestAnimationFrame(()=>{if(isOpen)closeButton.focus({preventScroll:true});});
    }else{
      unlock();
      requestAnimationFrame(restoreFocus);
    }
  }
  // app.js' existing hamburger, More, scrim, nav and Escape callbacks
  // call this global function, so no second navigation implementation is needed.
  window.setSidebarOpen=setOpen;
  primary.setAttribute("aria-controls","sidebar");
  secondary.setAttribute("aria-controls","sidebar");
  primary.setAttribute("aria-haspopup","dialog");
  secondary.setAttribute("aria-haspopup","dialog");
  primary.addEventListener("click",()=>{opener=primary;},{capture:true});
  secondary.addEventListener("click",()=>{opener=secondary;setOpen(!isOpen);});
  closeButton.addEventListener("click",()=>setOpen(false));
  // Existing scrim click handler in app.js closes the same drawer.
  document.addEventListener("keydown",event=>{
    if(!isOpen)return;
    if(event.key==="Escape"){
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
      return;
    }
    if(event.key!=="Tab")return;
    const focusable=[...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter(node=>!node.hidden&&!node.closest("[hidden]")&&!node.inert&&getComputedStyle(node).visibility!=="hidden"&&node.getClientRects().length);
    if(!focusable.length){event.preventDefault();closeButton.focus();return;}
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){
      event.preventDefault();last.focus();
    }else if(!event.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){
      event.preventDefault();first.focus();
    }
  },true);
  window.addEventListener("resize",()=>{
    if(isOpen)setOpen(false);
    else syncControls();
    if(lenis){lenis.destroy();lenis=null;cancelAnimationFrame(rafId);rafId=0;}
  });
  async function ensureLenis(){
    if(disposed||lenis||loading||!document.body.classList.contains("shell-app"))return;
    loading=true;
    try{
      // Pinned ES-module import. The drawer still blocks native scrolling offline.
      const module=await import("https://cdn.jsdelivr.net/npm/lenis@1.3.26/+esm");
      if(disposed||lenis)return;
      const wrapper=mobile()?main:window;
      lenis=new module.default({
        wrapper,
        content:wrapper===window?document.documentElement:main,
        lerp:0.09,
        autoRaf:false,
        smoothWheel:true,
        syncTouch:false
      });
      if(isOpen)lenis.stop();
      function frame(time){
        if(disposed||!lenis)return;
        if(!document.hidden&&document.body.classList.contains("shell-app"))lenis.raf(time);
        rafId=requestAnimationFrame(frame);
      }
      rafId=requestAnimationFrame(frame);
      syncControls();
    }catch(error){
      console.info("[TLE] Native scroll lock active (Lenis unavailable).",error?.message||"offline");
    }finally{loading=false;}
  }
  // Close when the user signs out or the app shell is hidden.
  document.getElementById("sidebarSignOutBtn")?.addEventListener("click",()=>setOpen(false),true);
  window.addEventListener("pagehide",()=>{
    setOpen(false);
    disposed=true;
    cancelAnimationFrame(rafId);
    lenis?.destroy();
    lenis=null;
  });
  window.addEventListener("pageshow",event=>{
    if(event.persisted){disposed=false;syncControls();}
  });
  clearLegacyInline();
  syncControls();
  window.TLEDrawer={setOpen,open:()=>setOpen(true),close:()=>setOpen(false),get isOpen(){return isOpen;},get isStopped(){return Boolean(lenis?.isStopped)||isOpen;}};
})();
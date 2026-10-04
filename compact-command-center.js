(function(){
  const MOBILE_MAX=900;
  let bound=false;

  function compactMode(){
    return window.matchMedia("(max-width:"+MOBILE_MAX+"px)").matches;
  }

  function makeToggle(panel,head,open){
    if(!panel||!head) return;
    panel.classList.toggle("compact-open",Boolean(open));
    head.setAttribute("role","button");
    head.setAttribute("tabindex","0");
    head.setAttribute("aria-expanded",String(Boolean(open)));
  }

  function closePeers(panel,selector){
    document.querySelectorAll(selector).forEach(other=>{
      if(other===panel) return;
      other.classList.remove("compact-open");
      const otherHead=other.querySelector(":scope > .panel-head, :scope > .estimate-panel-head, :scope > .panel-heading-row");
      otherHead?.setAttribute("aria-expanded","false");
    });
  }

  function togglePanel(panel,selector){
    const head=panel.querySelector(":scope > .panel-head, :scope > .estimate-panel-head, :scope > .panel-heading-row");
    if(!head) return;
    const opening=!panel.classList.contains("compact-open");
    closePeers(panel,selector);
    panel.classList.toggle("compact-open",opening);
    head.setAttribute("aria-expanded",String(opening));
  }

  function installBooking(){
    const panels=Array.from(document.querySelectorAll('[data-page="booking"] .booking-step-panel'));
    if(!panels.length) return;
    panels.forEach(panel=>{
      if(panel.dataset.compactReady==="1") return;
      panel.dataset.compactReady="1";
      const head=panel.querySelector(":scope > .panel-head, :scope > .estimate-panel-head");
      if(!head) return;
      const defaultOpen=panel.dataset.bookingPanel==="requests";
      makeToggle(panel,head,!compactMode()||defaultOpen);
      const activate=e=>{
        if(!compactMode()) return;
        if(e.type==="click" && e.target.closest("button,a,input,select,textarea,label")) return;
        if(e.type==="keydown" && !["Enter"," "].includes(e.key)) return;
        if(e.type==="keydown") e.preventDefault();
        togglePanel(panel,'[data-page="booking"] .booking-step-panel');
        if(panel.classList.contains("compact-open")){
          setTimeout(()=>panel.scrollIntoView({behavior:"smooth",block:"start"}),40);
        }
      };
      head.addEventListener("click",activate);
      head.addEventListener("keydown",activate);
    });
  }

  function installFollowups(){
    const panels=Array.from(document.querySelectorAll('[data-page="followups"] .followup-rules-panel,[data-page="followups"] .followup-queue-panel,[data-page="followups"] .followup-sent-panel'));
    panels.forEach(panel=>{
      if(panel.dataset.compactReady==="1") return;
      panel.dataset.compactReady="1";
      const head=panel.querySelector(":scope > .panel-heading-row");
      if(!head) return;
      const defaultOpen=panel.classList.contains("followup-queue-panel");
      makeToggle(panel,head,!compactMode()||defaultOpen);
      const activate=e=>{
        if(!compactMode()) return;
        if(e.type==="click" && e.target.closest("button,a,input,select,textarea,label")) return;
        if(e.type==="keydown" && !["Enter"," "].includes(e.key)) return;
        if(e.type==="keydown") e.preventDefault();
        togglePanel(panel,'[data-page="followups"] .followup-rules-panel,[data-page="followups"] .followup-queue-panel,[data-page="followups"] .followup-sent-panel');
      };
      head.addEventListener("click",activate);
      head.addEventListener("keydown",activate);
    });
  }

  function installSettings(){
    const panels=Array.from(document.querySelectorAll('[data-page="settings"] .settings-accordion>.settings-section'));
    panels.forEach(panel=>{
      if(panel.dataset.compactReady==="1") return;
      panel.dataset.compactReady="1";
      const head=panel.querySelector(":scope > .panel-head")||panel.querySelector(":scope > h3");
      if(!head) return;
      panel.classList.remove("settings-open");
      head.classList.add("settings-accordion-trigger");
      head.setAttribute("role","button");
      head.setAttribute("tabindex","0");
      head.setAttribute("aria-expanded","false");
      const activate=e=>{
        if(e.type==="click" && e.target.closest("button,a,input,select,textarea,label")) return;
        if(e.type==="keydown" && !["Enter"," "].includes(e.key)) return;
        if(e.type==="keydown") e.preventDefault();
        const opening=!panel.classList.contains("settings-open");
        panels.forEach(other=>{
          other.classList.remove("settings-open");
          const h=other.querySelector(":scope > .panel-head")||other.querySelector(":scope > h3");
          h?.setAttribute("aria-expanded","false");
        });
        panel.classList.toggle("settings-open",opening);
        head.setAttribute("aria-expanded",String(opening));
      };
      head.addEventListener("click",activate);
      head.addEventListener("keydown",activate);
    });
  }

  function normalizeForViewport(){
    const compact=compactMode();
    document.documentElement.classList.toggle("tle-compact-workspace",compact);
    document.querySelectorAll('[data-page="booking"] .booking-step-panel').forEach(panel=>{
      const head=panel.querySelector(":scope > .panel-head, :scope > .estimate-panel-head");
      if(!head) return;
      if(!compact) makeToggle(panel,head,true);
      else if(!document.querySelector('[data-page="booking"] .booking-step-panel.compact-open')){
        makeToggle(panel,head,panel.dataset.bookingPanel==="requests");
      }
    });
    document.querySelectorAll('[data-page="followups"] .followup-rules-panel,[data-page="followups"] .followup-queue-panel,[data-page="followups"] .followup-sent-panel').forEach(panel=>{
      const head=panel.querySelector(":scope > .panel-heading-row");
      if(!head) return;
      if(!compact) makeToggle(panel,head,true);
    });
  }

  function init(){
    installBooking();
    installFollowups();
    installSettings();
    normalizeForViewport();
    if(bound) return;
    bound=true;
    window.addEventListener("resize",normalizeForViewport,{passive:true});
  }

  window.TLE_COMPACT_COMMAND_CENTER={init,refresh:init};
  init();
})();
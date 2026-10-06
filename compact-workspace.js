(function(){
  const media=window.matchMedia("(max-width:680px)");

  function isControl(target){
    return Boolean(target?.closest?.("button,a,input,select,textarea,label"));
  }

  function bookingTrigger(panel){
    return panel.querySelector(".panel-head")||panel.querySelector(".estimate-panel-head");
  }

  function syncBookingPanel(panel){
    const open=media.matches ? panel.dataset.compactMobileOpen==="true" : true;
    panel.hidden=false;
    panel.classList.add("booking-compact-panel");
    panel.classList.toggle("compact-panel-open",open);
    const trigger=bookingTrigger(panel);
    if(trigger){
      trigger.setAttribute("role","button");
      trigger.setAttribute("tabindex","0");
      trigger.setAttribute("aria-expanded",String(open));
    }
  }

  function installBooking(){
    document.querySelectorAll('[data-page="booking"] [data-booking-panel]').forEach(panel=>{
      if(panel.dataset.compactMobileOpen==null) panel.dataset.compactMobileOpen="false";
      syncBookingPanel(panel);
    });
  }

  function toggleBooking(panel){
    if(!media.matches || !panel) return;
    panel.dataset.compactMobileOpen=String(!(panel.dataset.compactMobileOpen==="true"));
    syncBookingPanel(panel);
  }

  function installSettings(){
    const panels=Array.from(document.querySelectorAll(".settings-accordion>.settings-section"));
    panels.forEach(panel=>{
      const head=panel.querySelector(":scope > .panel-head")||panel.querySelector(":scope > h3");
      if(!head) return;
      head.classList.add("settings-accordion-trigger");
      head.setAttribute("role","button");
      head.setAttribute("tabindex","0");
      head.setAttribute("aria-expanded",String(panel.classList.contains("settings-open")));
      if(panel.dataset.compactSettingsReady==="1") return;
      panel.dataset.compactSettingsReady="1";
      panel.classList.remove("settings-open");
      head.setAttribute("aria-expanded","false");
      head.addEventListener("click",event=>{
        if(isControl(event.target)) return;
        const willOpen=!panel.classList.contains("settings-open");
        panels.forEach(other=>{
          other.classList.remove("settings-open");
          const otherHead=other.querySelector(":scope > .panel-head")||other.querySelector(":scope > h3");
          otherHead?.setAttribute("aria-expanded","false");
        });
        if(willOpen){
          panel.classList.add("settings-open");
          head.setAttribute("aria-expanded","true");
        }
      });
      head.addEventListener("keydown",event=>{
        if(event.key!=="Enter"&&event.key!==" ") return;
        event.preventDefault();
        head.click();
      });
    });
  }

  function genericTrigger(panel){
    const head=panel.querySelector(":scope > .panel-head");
    if(head) return {node:head,type:"head"};
    const row=panel.querySelector(":scope > .panel-heading-row");
    if(row) return {node:row,type:"row"};
    const h3=panel.querySelector(":scope > h3");
    if(h3) return {node:h3,type:"h3"};
    return null;
  }

  function syncGenericPanel(panel){
    const info=genericTrigger(panel);
    if(!info) return;
    const open=media.matches ? panel.dataset.compactMobileOpen==="true" : true;
    panel.classList.add("compact-accordion-panel","compact-trigger-"+info.type);
    panel.classList.toggle("compact-panel-open",open);
    info.node.setAttribute("role","button");
    info.node.setAttribute("tabindex","0");
    info.node.setAttribute("aria-expanded",String(open));
  }

  function installGenericPanels(){
    const selectors=[
      '[data-page="followups"] .followup-rules-panel',
      '[data-page="followups"] .followup-sent-panel',
      '[data-page="team"] .team-message-center',
      '[data-page="admin"] .admin-grid>.panel',
      '[data-page="help"] .help-grid>.panel'
    ];
    selectors.forEach(selector=>{
      document.querySelectorAll(selector).forEach(panel=>{
        if(panel.dataset.compactMobileOpen==null) panel.dataset.compactMobileOpen="false";
        syncGenericPanel(panel);
        if(panel.dataset.compactAccordionReady==="1") return;
        panel.dataset.compactAccordionReady="1";
        const info=genericTrigger(panel);
        if(!info) return;
        const togglePanel=event=>{
          if(!media.matches) return;
          if(isControl(event.target) && !event.target.closest(".panel-head,h3,.panel-heading-row")) return;
          panel.dataset.compactMobileOpen=String(!(panel.dataset.compactMobileOpen==="true"));
          syncGenericPanel(panel);
        };
        if(panel.matches('[data-page="admin"] .admin-grid>.panel')){
          panel.addEventListener("click",event=>{
            if(!media.matches) return;
            if(event.target.closest("button,a,input,select,textarea,label") && !event.target.closest("h3")) return;
            const trigger=event.target.closest(".panel-head,h3,.eyebrow");
            if(!trigger) return;
            togglePanel(event);
          });
        }else{
          info.node.addEventListener("click",togglePanel);
        }
        info.node.addEventListener("keydown",event=>{
          if(event.key!=="Enter"&&event.key!==" ") return;
          if(!media.matches) return;
          event.preventDefault();
          info.node.click();
        });
      });
    });
  }

  function install(){
    installBooking();
    installSettings();
    installGenericPanels();
  }

  document.addEventListener("click",event=>{
    if(!media.matches || isControl(event.target)) return;
    const head=event.target.closest?.('[data-page="booking"] [data-booking-panel] .panel-head,[data-page="booking"] .booking-estimate-panel .estimate-panel-head');
    if(!head) return;
    const panel=head.closest("[data-booking-panel]");
    if(panel) toggleBooking(panel);
  });

  document.addEventListener("keydown",event=>{
    if(!media.matches || (event.key!=="Enter"&&event.key!==" ")) return;
    const head=event.target.closest?.('[data-page="booking"] [data-booking-panel] .panel-head,[data-page="booking"] .booking-estimate-panel .estimate-panel-head');
    if(!head || isControl(event.target)) return;
    event.preventDefault();
    const panel=head.closest("[data-booking-panel]");
    if(panel) toggleBooking(panel);
  });

  media.addEventListener?.("change",install);
  window.addEventListener("pageshow",install);
  document.addEventListener("DOMContentLoaded",install);

  const shell=document.getElementById("appShell");
  if(shell && "MutationObserver" in window){
    let timer=0;
    new MutationObserver(()=>{
      clearTimeout(timer);
      timer=setTimeout(install,20);
    }).observe(shell,{subtree:true,childList:true});
  }

  install();
})();
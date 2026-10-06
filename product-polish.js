(function(){
const secondary=new Set(["booking","leads","followups","route","services","team","time","mileage","supplies","reports","platform-admin"]);
function calmNavigation(){const nav=document.querySelector(".nav-list");if(!nav||nav.dataset.productPolish==="1")return;nav.dataset.productPolish="1";nav.classList.add("product-nav-calm");nav.querySelectorAll(".nav-item").forEach(btn=>{if(secondary.has(btn.dataset.view))btn.dataset.secondaryNav="true";});nav.querySelectorAll(".nav-section-label").forEach(x=>x.hidden=true);const more=document.createElement("button");more.type="button";more.className="nav-more-toggle";more.setAttribute("aria-expanded","false");more.textContent="More tools  ···";more.addEventListener("click",()=>{const open=nav.classList.toggle("more-open");more.setAttribute("aria-expanded",String(open));more.textContent=open?"Hide tools  ↑":"More tools  ···";});nav.appendChild(more);}
function enrichNotifications(){const list=document.getElementById("notificationList"),bell=document.getElementById("notificationBellBtn"),badge=document.getElementById("notificationBadge");if(!list||list.dataset.productPolish==="1")return;list.dataset.productPolish="1";const decorate=()=>{Array.from(list.children).forEach((item,index)=>{if(!item.dataset.unread)item.dataset.unread=index<3?"true":"false";const t=(item.textContent||"").toLowerCase();item.dataset.priority=/cancel|reschedul|urgent|payment|overdue/.test(t)?"high":"normal";if(item.dataset.productInteractive==="1")return;item.dataset.productInteractive="1";item.setAttribute("tabindex","0");item.addEventListener("click",()=>item.dataset.unread="false");item.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();item.click();}});});};new MutationObserver(()=>{decorate();if(badge&&!badge.hidden){bell?.classList.remove("notification-pulse");requestAnimationFrame(()=>bell?.classList.add("notification-pulse"));}}).observe(list,{childList:true,subtree:true});decorate();}
function bookingControlCenter(){
 const root=document.querySelector('[data-page="booking"]'); if(!root||root.dataset.controlCenter==="1")return; root.dataset.controlCenter="1";
 root.addEventListener("click",e=>{
   const open=e.target.closest("[data-booking-open]"), close=e.target.closest("[data-booking-close]");
   if(open){const key=open.dataset.bookingOpen;root.querySelectorAll("[data-booking-detail]").forEach(x=>x.hidden=x.dataset.bookingDetail!==key);root.querySelector('[data-booking-detail="'+key+'"]')?.scrollIntoView({behavior:"smooth",block:"start"});}
   if(close){const panel=close.closest("[data-booking-detail]");if(panel)panel.hidden=true;root.scrollIntoView({behavior:"smooth",block:"start"});}
 });
}
function installSaveFeedback(){
 if(document.body?.dataset.saveFeedback==="1")return; if(!document.body)return; document.body.dataset.saveFeedback="1";
 const copy={en:{saving:"Saving…",saved:"Changes saved",error:"Couldn’t save — try again"},es:{saving:"Guardando…",saved:"Cambios guardados",error:"No se pudo guardar — intenta otra vez"},fr:{saving:"Enregistrement…",saved:"Modifications enregistrées",error:"Impossible d’enregistrer — réessayez"},ht:{saving:"Ap sove…",saved:"Chanjman yo sove",error:"Pa t kapab sove — eseye ankò"}};
 const language=()=>{const raw=(document.documentElement.lang||localStorage.getItem("tle_language")||"en").toLowerCase();return raw.startsWith("es")?"es":raw.startsWith("fr")?"fr":raw.startsWith("ht")||raw.includes("creole")?"ht":"en";};
 let timer; const toast=(kind,msg)=>{let el=document.getElementById("tleSaveToast");if(!el){el=document.createElement("div");el.id="tleSaveToast";el.className="tle-save-toast";el.setAttribute("role","status");el.setAttribute("aria-live","polite");document.body.appendChild(el);}clearTimeout(timer);el.className="tle-save-toast "+kind;el.innerHTML=(kind==="saved"?"<span>✓</span>":kind==="error"?"<span>!</span>":"<span class=\"saving-dot\"></span>")+"<b>"+msg+"</b>";requestAnimationFrame(()=>el.classList.add("show"));timer=setTimeout(()=>el.classList.remove("show"),kind==="saving"?5000:2200);};
 window.TLESaveFeedback={saving:()=>toast("saving",copy[language()].saving),saved:()=>toast("saved",copy[language()].saved),error:()=>toast("error",copy[language()].error)};
 document.addEventListener("click",e=>{const b=e.target.closest("button,input[type=submit]");if(!b||b.disabled)return;const t=((b.textContent||b.value||"")+" "+(b.id||"")).toLowerCase();if(/save|guardar|enregistrer|sove/.test(t)){window.TLESaveFeedback.saving();setTimeout(()=>{const el=document.getElementById("tleSaveToast");if(el?.classList.contains("saving"))window.TLESaveFeedback.saved();},650);}},true);
 document.addEventListener("submit",()=>window.TLESaveFeedback.saving(),true);
}
function installSpecialQuoteFields(){
 const commercial=document.getElementById("publicCommercialDetails"), form=document.getElementById("publicRequestForm");
 if(!commercial||!form||document.getElementById("publicSpecialDetails"))return;
 const box=document.createElement("div");box.className="full public-property-details";box.id="publicSpecialDetails";box.hidden=true;
 box.innerHTML='<label>Space / job type<select name="special_space_type"><option value="">Choose one</option><option value="large_home">Large / custom home</option><option value="salon">Salon / beauty suite</option><option value="studio">Studio / creative space</option><option value="event">Event / venue cleanup</option><option value="post_construction">Post-construction</option><option value="vacation_property">Vacation / specialty property</option><option value="other">Other special job</option></select></label><label>Tell us what makes this job different<textarea name="special_job_details" placeholder="Size, layout, special surfaces, access, timing, or anything the business should review before pricing."></textarea></label>';
 commercial.before(box);
}
function installMobileDrawerFix(){
 const sidebar=document.getElementById("sidebar"),scrim=document.getElementById("sidebarScrim");
 if(!sidebar||sidebar.dataset.drawerFix==="1")return; sidebar.dataset.drawerFix="1";
 let close=sidebar.querySelector(".sidebar-drawer-close");
 if(!close){close=document.createElement("button");close.type="button";close.className="sidebar-drawer-close";close.setAttribute("aria-label","Close menu");close.textContent="×";sidebar.appendChild(close);}
 const shut=()=>{sidebar.classList.remove("open");sidebar.style.setProperty("visibility","hidden","important");sidebar.style.setProperty("opacity","0","important");sidebar.style.setProperty("pointer-events","none","important");if(scrim)scrim.hidden=true;document.body.classList.remove("sidebar-is-open");document.getElementById("menuToggle")?.setAttribute("aria-expanded","false");};
 close.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();shut();});
 sidebar.addEventListener("click",e=>{const nav=e.target.closest(".nav-item[data-view]");if(nav)setTimeout(shut,0);});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&sidebar.classList.contains("open"))shut();});
}
function install(){calmNavigation();enrichNotifications();bookingControlCenter();installSaveFeedback();installSpecialQuoteFields();installMobileDrawerFix();}document.addEventListener("DOMContentLoaded",install);window.addEventListener("pageshow",install);const shell=document.getElementById("appShell");if(shell&&"MutationObserver"in window)new MutationObserver(()=>setTimeout(install,0)).observe(shell,{childList:true,subtree:true});install();})();
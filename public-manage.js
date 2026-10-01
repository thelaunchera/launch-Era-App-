(()=>{
  const params=new URLSearchParams(window.location.search);
  if(params.get("public")!=="manage") return;

  const token=String(params.get("token")||"").toLowerCase();
  window.__tlePublicHandled=true;

  const API="https://bowacxhmjvrqixtwaikv.supabase.co/functions/v1/manage-booking";
  const supported=["en","es","fr","ht"];
  const requested=String(params.get("lang")||"").toLowerCase();
  if(supported.includes(requested) && window.TLE_I18N?.setLanguage){
    window.TLE_I18N.setLanguage(requested);
  }

  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>[...root.querySelectorAll(s)];
  let view=null;
  let selectedSlot="";
  let language=supported.includes(requested)?requested:"en";

  const copy={
    en:{
      sub:"Manage Booking",label:"MANAGE BOOKING",title:"Manage your cleaning",
      intro:"View your appointment, choose another available time, or cancel within the business’s policy.",
      service:"SERVICE",dateTime:"DATE + TIME",address:"ADDRESS",
      reschedule:"Reschedule",cancel:"Cancel booking",rescheduleEye:"RESCHEDULE",rescheduleTitle:"Choose a new time",
      newDate:"New date",chooseDate:"Choose a date to see available times.",loading:"Loading available times…",
      noTimes:"No available times on this date.",scopeChange:"Apply this change to",scopeCancel:"Cancel",
      thisOnly:"This cleaning only",future:"This and future cleanings",confirmTime:"Confirm new time",
      cancelEye:"CANCEL",cancelTitle:"Cancel this cleaning?",reason:"Reason",optional:"(optional)",
      chooseOne:"Choose one",scheduleChanged:"Schedule changed",notNeeded:"No longer needed",otherProvider:"Found another provider",other:"Other",
      otherReason:"Other reason",confirmCancel:"Confirm cancellation",
      policyPrefix:"Online changes are available until",policyBefore:"before the appointment.",
      changesClosed:"Online changes are no longer available for this booking.",rescheduleOff:"Online rescheduling is turned off.",
      cancelOff:"Online cancellation is turned off.",moved:"Your cleaning was rescheduled.",canceled:"Your cleaning was canceled.",
      canceledNext:"This cleaning was canceled. Your next cleaning is shown below.",working:"Saving…",
      loadError:"We couldn’t open this booking. The link may be invalid or expired.",tryAgain:"Please refresh and try again.",
      dateNeeded:"Choose a date first.",timeNeeded:"Choose an available time.",policyNote:"Cancellation policy",
      refresh:"Refresh booking",statusCanceled:"Canceled",statusScheduled:"Scheduled"
    },
    es:{
      sub:"Administrar reserva",label:"ADMINISTRAR RESERVA",title:"Administra tu limpieza",
      intro:"Consulta tu cita, elige otro horario disponible o cancela según la política del negocio.",
      service:"SERVICIO",dateTime:"FECHA + HORA",address:"DIRECCIÓN",
      reschedule:"Reprogramar",cancel:"Cancelar reserva",rescheduleEye:"REPROGRAMAR",rescheduleTitle:"Elige un nuevo horario",
      newDate:"Nueva fecha",chooseDate:"Elige una fecha para ver los horarios disponibles.",loading:"Buscando horarios disponibles…",
      noTimes:"No hay horarios disponibles para esta fecha.",scopeChange:"Aplicar este cambio a",scopeCancel:"Cancelar",
      thisOnly:"Solo esta limpieza",future:"Esta y las próximas limpiezas",confirmTime:"Confirmar nuevo horario",
      cancelEye:"CANCELAR",cancelTitle:"¿Cancelar esta limpieza?",reason:"Motivo",optional:"(opcional)",
      chooseOne:"Elige uno",scheduleChanged:"Cambió mi horario",notNeeded:"Ya no lo necesito",otherProvider:"Encontré otro proveedor",other:"Otro",
      otherReason:"Otro motivo",confirmCancel:"Confirmar cancelación",
      policyPrefix:"Los cambios online están disponibles hasta",policyBefore:"antes de la cita.",
      changesClosed:"Los cambios online ya no están disponibles para esta reserva.",rescheduleOff:"La reprogramación online está desactivada.",
      cancelOff:"La cancelación online está desactivada.",moved:"Tu limpieza fue reprogramada.",canceled:"Tu limpieza fue cancelada.",
      canceledNext:"Esta limpieza fue cancelada. Abajo aparece tu próxima limpieza.",working:"Guardando…",
      loadError:"No pudimos abrir esta reserva. El enlace puede ser inválido o haber expirado.",tryAgain:"Actualiza la página e inténtalo de nuevo.",
      dateNeeded:"Elige una fecha primero.",timeNeeded:"Elige un horario disponible.",policyNote:"Política de cancelación",
      refresh:"Actualizar reserva",statusCanceled:"Cancelada",statusScheduled:"Programada"
    },
    fr:{
      sub:"Gérer la réservation",label:"GÉRER LA RÉSERVATION",title:"Gérez votre nettoyage",
      intro:"Consultez votre rendez-vous, choisissez un autre horaire disponible ou annulez selon la politique de l’entreprise.",
      service:"SERVICE",dateTime:"DATE + HEURE",address:"ADRESSE",
      reschedule:"Reprogrammer",cancel:"Annuler",rescheduleEye:"REPROGRAMMER",rescheduleTitle:"Choisissez un nouvel horaire",
      newDate:"Nouvelle date",chooseDate:"Choisissez une date pour voir les horaires disponibles.",loading:"Recherche des horaires…",
      noTimes:"Aucun horaire disponible à cette date.",scopeChange:"Appliquer ce changement à",scopeCancel:"Annuler",
      thisOnly:"Ce nettoyage seulement",future:"Ce nettoyage et les suivants",confirmTime:"Confirmer le nouvel horaire",
      cancelEye:"ANNULER",cancelTitle:"Annuler ce nettoyage ?",reason:"Motif",optional:"(facultatif)",
      chooseOne:"Choisir",scheduleChanged:"Mon horaire a changé",notNeeded:"Je n’en ai plus besoin",otherProvider:"J’ai trouvé un autre prestataire",other:"Autre",
      otherReason:"Autre motif",confirmCancel:"Confirmer l’annulation",
      policyPrefix:"Les changements en ligne sont disponibles jusqu’à",policyBefore:"avant le rendez-vous.",
      changesClosed:"Les changements en ligne ne sont plus disponibles pour cette réservation.",rescheduleOff:"La reprogrammation en ligne est désactivée.",
      cancelOff:"L’annulation en ligne est désactivée.",moved:"Votre nettoyage a été reprogrammé.",canceled:"Votre nettoyage a été annulé.",
      canceledNext:"Ce nettoyage a été annulé. Votre prochain nettoyage est affiché ci-dessous.",working:"Enregistrement…",
      loadError:"Impossible d’ouvrir cette réservation. Le lien est peut-être invalide ou expiré.",tryAgain:"Actualisez la page et réessayez.",
      dateNeeded:"Choisissez d’abord une date.",timeNeeded:"Choisissez un horaire disponible.",policyNote:"Politique d’annulation",
      refresh:"Actualiser la réservation",statusCanceled:"Annulé",statusScheduled:"Planifié"
    },
    ht:{
      sub:"Jere rezèvasyon",label:"JERE REZÈVASYON",title:"Jere netwayaj ou",
      intro:"Gade randevou ou, chwazi yon lòt lè ki disponib, oswa anile selon règleman biznis la.",
      service:"SÈVIS",dateTime:"DAT + LÈ",address:"ADRÈS",
      reschedule:"Chanje dat",cancel:"Anile rezèvasyon",rescheduleEye:"CHANJE DAT",rescheduleTitle:"Chwazi yon nouvo lè",
      newDate:"Nouvo dat",chooseDate:"Chwazi yon dat pou wè lè ki disponib.",loading:"N ap chèche lè ki disponib…",
      noTimes:"Pa gen lè ki disponib nan dat sa a.",scopeChange:"Aplike chanjman sa a pou",scopeCancel:"Anile",
      thisOnly:"Netwayaj sa a sèlman",future:"Sa a ak pwochen netwayaj yo",confirmTime:"Konfime nouvo lè a",
      cancelEye:"ANILE",cancelTitle:"Anile netwayaj sa a?",reason:"Rezon",optional:"(opsyonèl)",
      chooseOne:"Chwazi youn",scheduleChanged:"Orè mwen chanje",notNeeded:"Mwen pa bezwen li ankò",otherProvider:"Mwen jwenn yon lòt sèvis",other:"Lòt",
      otherReason:"Lòt rezon",confirmCancel:"Konfime anilasyon",
      policyPrefix:"Ou ka fè chanjman sou entènèt jiska",policyBefore:"anvan randevou a.",
      changesClosed:"Ou pa ka fè chanjman sou entènèt pou rezèvasyon sa a ankò.",rescheduleOff:"Chanje dat sou entènèt dezaktive.",
      cancelOff:"Anilasyon sou entènèt dezaktive.",moved:"Netwayaj ou chanje dat.",canceled:"Netwayaj ou anile.",
      canceledNext:"Netwayaj sa a anile. Pwochen netwayaj ou parèt anba a.",working:"N ap anrejistre…",
      loadError:"Nou pa t kapab ouvri rezèvasyon sa a. Lyen an ka pa valab oswa li ka ekspire.",tryAgain:"Rafrechi paj la epi eseye ankò.",
      dateNeeded:"Chwazi yon dat anvan.",timeNeeded:"Chwazi yon lè ki disponib.",policyNote:"Règleman anilasyon",
      refresh:"Rafrechi rezèvasyon",statusCanceled:"Anile",statusScheduled:"Pwograme"
    }
  };

  function t(key){
    return copy[language]?.[key]||copy.en[key]||key;
  }

  function showShell(){
    $("#sessionSplash") && ($("#sessionSplash").hidden=true);
    $("#authShell") && ($("#authShell").hidden=true);
    $("#appShell") && ($("#appShell").hidden=true);
    $("#workerShell") && ($("#workerShell").hidden=true);
    const pub=$("#publicShell");
    if(pub) pub.hidden=false;
    $("#publicBookingHero") && ($("#publicBookingHero").hidden=true);
    $("#publicRequestSwitch") && ($("#publicRequestSwitch").hidden=true);
    $("#publicRequestForm") && ($("#publicRequestForm").hidden=true);
    $("#publicInvoiceView") && ($("#publicInvoiceView").hidden=true);
    $("#publicQuoteReview") && ($("#publicQuoteReview").hidden=true);
    $("#publicSuccess") && ($("#publicSuccess").hidden=true);
    const manage=$("#publicManageBooking");
    if(manage) manage.hidden=false;
  }

  async function api(action,extra={}){
    const response=await fetch(API,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      cache:"no-store",
      body:JSON.stringify({action,token,...extra})
    });
    const payload=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(payload?.error||"Request failed");
    return payload;
  }

  function locale(){
    return ({en:"en-US",es:"es-US",fr:"fr-FR",ht:"ht-HT"})[language]||"en-US";
  }

  function zonedDate(iso){
    if(!iso) return "—";
    return new Intl.DateTimeFormat(locale(),{
      timeZone:view?.business?.timezone||"UTC",
      weekday:"short",month:"short",day:"numeric",year:"numeric",
      hour:"numeric",minute:"2-digit"
    }).format(new Date(iso));
  }

  function dateKeyInZone(iso){
    const parts=new Intl.DateTimeFormat("en-US",{
      timeZone:view?.business?.timezone||"UTC",
      year:"numeric",month:"2-digit",day:"2-digit"
    }).formatToParts(new Date(iso));
    const map=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }

  function todayKeyInZone(){
    const parts=new Intl.DateTimeFormat("en-US",{
      timeZone:view?.business?.timezone||"UTC",
      year:"numeric",month:"2-digit",day:"2-digit"
    }).formatToParts(new Date());
    const map=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }

  function formatSlot(iso){
    return new Intl.DateTimeFormat(locale(),{
      timeZone:view?.business?.timezone||"UTC",
      hour:"numeric",minute:"2-digit"
    }).format(new Date(iso));
  }

  function setText(id,value){
    const el=$(id);
    if(el) el.textContent=value;
  }

  function status(message,type="success"){
    const el=$("#manageBookingStatus");
    if(!el) return;
    el.hidden=!message;
    el.dataset.type=type;
    el.textContent=message||"";
  }

  function closePanels(){
    $("#manageReschedulePanel") && ($("#manageReschedulePanel").hidden=true);
    $("#manageCancelPanel") && ($("#manageCancelPanel").hidden=true);
    selectedSlot="";
    const confirm=$("#manageConfirmReschedule");
    if(confirm) confirm.disabled=true;
  }

  function applyCopy(){
    setText("#publicHeaderSub",t("sub"));
    setText("#manageBookingLabel",t("label"));
    setText("#manageBookingTitle",t("title"));
    setText("#manageBookingIntro",t("intro"));
    setText("#manageServiceLabel",t("service"));
    setText("#manageDateLabel",t("dateTime"));
    setText("#manageAddressLabel",t("address"));
    setText("#manageRescheduleBtn",t("reschedule"));
    setText("#manageCancelBtn",t("cancel"));
    setText("#manageRescheduleEyebrow",t("rescheduleEye"));
    setText("#manageRescheduleTitle",t("rescheduleTitle"));
    setText("#manageNewDateLabel",t("newDate"));
    setText("#manageRescheduleScopeLegend",t("scopeChange"));
    setText("#manageCancelScopeLegend",t("scopeCancel"));
    setText("#manageThisCleaningReschedule",t("thisOnly"));
    setText("#manageFutureCleaningReschedule",t("future"));
    setText("#manageThisCleaningCancel",t("thisOnly"));
    setText("#manageFutureCleaningCancel",t("future"));
    setText("#manageConfirmReschedule",t("confirmTime"));
    setText("#manageCancelEyebrow",t("cancelEye"));
    setText("#manageCancelTitle",t("cancelTitle"));
    setText("#manageOtherReasonLabel",t("otherReason"));
    setText("#manageConfirmCancel",t("confirmCancel"));
    const reasonLabel=$("#manageReasonLabel");
    if(reasonLabel) reasonLabel.innerHTML=`${t("reason")} <span class="field-optional">${t("optional")}</span>`;
    const reason=$("#manageCancelReason");
    if(reason){
      const labels=[t("chooseOne"),t("scheduleChanged"),t("notNeeded"),t("otherProvider"),t("other")];
      [...reason.options].forEach((o,i)=>{if(labels[i]) o.textContent=labels[i];});
    }
    const refresh=$("#publicRefreshBtn");
    if(refresh){
      refresh.title=t("refresh");
      refresh.setAttribute("aria-label",t("refresh"));
    }
  }

  function render(){
    if(!view) return;
    language=supported.includes(requested)
      ? requested
      : supported.includes(view.customer?.language)
        ? view.customer.language
        : language;
    applyCopy();

    setText("#publicHeaderBusinessName",view.business?.name||"Cleaning Business");
    const mark=String(view.business?.name||"CB").trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();
    setText("#publicHeaderMark",mark||"CB");
    setText("#manageService",view.booking?.service||"Cleaning");
    setText("#manageBusiness",view.business?.name||"");
    setText("#manageDateTime",zonedDate(view.booking?.starts_at));
    setText("#manageAddress",view.booking?.address||"—");

    const recurring=Boolean(view.booking?.recurring && Number(view.booking?.future_count||0)>1);
    $("#manageRescheduleScope") && ($("#manageRescheduleScope").hidden=!recurring);
    $("#manageCancelScope") && ($("#manageCancelScope").hidden=!recurring);

    const policy=$("#managePolicy");
    if(policy){
      const pieces=[];
      if(view.policy?.online_window){
        const deadline=zonedDate(view.policy.change_deadline);
        pieces.push(`<strong>${t("policyPrefix")} ${deadline} ${t("policyBefore")}</strong>`);
      }else{
        pieces.push(`<strong>${t("changesClosed")}</strong>`);
      }
      if(!view.policy?.reschedule_enabled) pieces.push(`<span>${t("rescheduleOff")}</span>`);
      if(!view.policy?.cancel_enabled) pieces.push(`<span>${t("cancelOff")}</span>`);
      if(view.policy?.cancellation_policy) pieces.push(`<span><b>${t("policyNote")}:</b> ${escapeHtml(view.policy.cancellation_policy)}</span>`);
      policy.innerHTML=pieces.join("");
    }

    const reschedule=$("#manageRescheduleBtn");
    const cancel=$("#manageCancelBtn");
    if(reschedule) reschedule.disabled=!view.policy?.allow_reschedule;
    if(cancel) cancel.disabled=!view.policy?.allow_cancel;

    const dateInput=$("#manageNewDate");
    if(dateInput){
      dateInput.min=todayKeyInZone();
      if(!dateInput.value) dateInput.value=dateKeyInZone(view.booking?.starts_at);
    }
  }

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  async function load(){
    status("");
    try{
      view=await api("get");
      render();
    }catch(err){
      const title=$("#manageBookingTitle");
      const intro=$("#manageBookingIntro");
      if(title) title.textContent=t("loadError");
      if(intro) intro.textContent=t("tryAgain");
      $("#manageActions") && ($("#manageActions").hidden=true);
      $("#managePolicy") && ($("#managePolicy").hidden=true);
      console.warn("[TLE] manage booking load",err);
    }
  }

  async function loadSlots(){
    const date=$("#manageNewDate")?.value||"";
    const box=$("#manageSlots");
    selectedSlot="";
    const confirm=$("#manageConfirmReschedule");
    if(confirm) confirm.disabled=true;
    if(!box) return;
    if(!date){
      box.innerHTML=`<span class="muted-line">${escapeHtml(t("dateNeeded"))}</span>`;
      return;
    }
    box.innerHTML=`<span class="muted-line">${escapeHtml(t("loading"))}</span>`;
    try{
      const result=await api("slots",{date});
      const slots=(result.slots||[]).filter(iso=>Math.abs(new Date(iso).getTime()-new Date(view?.booking?.starts_at||0).getTime())>2000);
      box.innerHTML=slots.length
        ? slots.map(iso=>`<button type="button" class="slot-btn" data-manage-slot="${escapeHtml(iso)}">${escapeHtml(formatSlot(iso))}</button>`).join("")
        : `<span class="muted-line">${escapeHtml(t("noTimes"))}</span>`;
    }catch(err){
      box.innerHTML=`<span class="muted-line">${escapeHtml(err.message||t("noTimes"))}</span>`;
    }
  }

  showShell();
  applyCopy();

  $("#manageRescheduleBtn")?.addEventListener("click",()=>{
    closePanels();
    $("#manageReschedulePanel").hidden=false;
    status("");
    loadSlots();
  });

  $("#manageCancelBtn")?.addEventListener("click",()=>{
    closePanels();
    $("#manageCancelPanel").hidden=false;
    status("");
  });

  $$("[data-manage-close]").forEach(btn=>btn.addEventListener("click",closePanels));
  $("#manageNewDate")?.addEventListener("change",loadSlots);
  $("#manageSlots")?.addEventListener("click",event=>{
    const btn=event.target.closest("[data-manage-slot]");
    if(!btn) return;
    $$("#manageSlots [data-manage-slot]").forEach(x=>x.classList.toggle("selected",x===btn));
    selectedSlot=btn.dataset.manageSlot||"";
    const confirm=$("#manageConfirmReschedule");
    if(confirm) confirm.disabled=!selectedSlot;
  });

  $("#manageCancelReason")?.addEventListener("change",event=>{
    const other=event.target.value==="Other";
    const wrap=$("#manageOtherReasonWrap");
    if(wrap) wrap.hidden=!other;
  });

  $("#manageConfirmReschedule")?.addEventListener("click",async event=>{
    const btn=event.currentTarget;
    if(!selectedSlot){status(t("timeNeeded"),"error");return;}
    const scope=$('input[name="manage_reschedule_scope"]:checked')?.value||"this";
    const old=btn.textContent;
    btn.disabled=true;btn.textContent=t("working");
    try{
      const result=await api("reschedule",{new_start:selectedSlot,scope});
      view=result;
      closePanels();
      render();
      status(t("moved"),"success");
    }catch(err){
      status(err.message||t("tryAgain"),"error");
      btn.disabled=false;
    }finally{
      btn.textContent=old||t("confirmTime");
    }
  });

  $("#manageConfirmCancel")?.addEventListener("click",async event=>{
    const btn=event.currentTarget;
    const scope=$('input[name="manage_cancel_scope"]:checked')?.value||"this";
    const select=$("#manageCancelReason");
    let reason=select?.value||"";
    if(reason==="Other") reason=$("#manageOtherReason")?.value?.trim()||"Other";
    const old=btn.textContent;
    btn.disabled=true;btn.textContent=t("working");
    try{
      const result=await api("cancel",{scope,reason});
      const movedToNext=Boolean(view?.booking?.recurring && scope==="this" && result?.booking?.id!==view?.booking?.id);
      view=result;
      closePanels();
      render();
      status(movedToNext?t("canceledNext"):t("canceled"),"success");
    }catch(err){
      status(err.message||t("tryAgain"),"error");
      btn.disabled=false;
    }finally{
      btn.textContent=old||t("confirmCancel");
    }
  });

  $("#publicRefreshBtn")?.addEventListener("click",()=>load());

  window.addEventListener("tle:languagechange",event=>{
    const next=String(event?.detail?.language||"").toLowerCase();
    if(!supported.includes(next)) return;
    language=next;
    try{
      const url=new URL(window.location.href);
      url.searchParams.set("lang",next);
      history.replaceState(history.state||{},"",url.pathname+url.search+url.hash);
    }catch{}
    applyCopy();
    render();
  });

  load();
})();

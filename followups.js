
(()=>{
  const bridge=window.TLE_FOLLOWUPS_BRIDGE;
  if(!bridge){
    console.warn("[TLE] Follow-ups bridge unavailable");
    return;
  }

  const {supabase,openView,showToast,langPick,escapeHtml,appLocale,openClientInfo}=bridge;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const DEFAULTS={
    lead_mode:"remind",
    quote_mode:"remind",
    invoice_mode:"remind",
    review_mode:"remind",
    rebook_mode:"remind"
  };
  let tasks=[];
  let preferences=null;
  let loading=false;

  function state(){
    return bridge.getState();
  }
  function modeFor(kind){
    const prefs=preferences||DEFAULTS;
    return prefs[kind+"_mode"]||"remind";
  }
  function kindLabel(kind){
    return {
      lead:langPick("Lead","Lead","Lead","Prospect"),
      quote:langPick("Quote","Cotización","Orçamento","Devis"),
      invoice:langPick("Invoice","Factura","Fatura","Facture"),
      review:langPick("After cleaning","Después de limpiar","Após a limpeza","Après le nettoyage"),
      rebook:langPick("Rebooking","Nueva reserva","Nova reserva","Nouvelle réservation")
    }[kind]||kind;
  }
  function reason(task){
    return {
      lead:langPick("Lead waiting for the next step","Lead esperando el próximo paso","Lead aguardando o próximo passo","Prospect en attente de la prochaine étape"),
      quote:langPick("Quote waiting for a response","Cotización esperando respuesta","Orçamento aguardando resposta","Devis en attente de réponse"),
      invoice:langPick("Invoice needs a payment reminder","La factura necesita recordatorio de pago","A fatura precisa de lembrete de pagamento","La facture nécessite un rappel de paiement"),
      review:langPick("Check in after the completed cleaning","Dar seguimiento después de la limpieza","Acompanhar após a limpeza concluída","Faire un suivi après le nettoyage"),
      rebook:langPick("No next cleaning is booked","No hay próxima limpieza reservada","Não há próxima limpeza agendada","Aucun prochain nettoyage n’est réservé")
    }[task.kind]||langPick("Needs follow-up","Necesita seguimiento","Precisa de acompanhamento","Nécessite un suivi");
  }
  function effectiveDue(task){
    const raw=task.status==="snoozed"&&task.snoozed_until?task.snoozed_until:task.due_at;
    const value=new Date(raw||0).getTime();
    return Number.isFinite(value)?value:0;
  }
  function dueLabel(task){
    const target=effectiveDue(task);
    if(!target) return "";
    const now=Date.now();
    if(task.status==="snoozed"){
      const when=new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(target));
      return langPick("Snoozed until "+when,"Pospuesto hasta "+when,"Adiado até "+when,"Reporté au "+when);
    }
    if(target<=now){
      const overdue=Math.max(0,Math.floor((now-target)/(24*60*60*1000)));
      if(overdue){
        return langPick("Overdue "+overdue+"d","Vencido hace "+overdue+"d","Atrasado "+overdue+"d","En retard de "+overdue+"j");
      }
      return langPick("Due now","Toca ahora","Vence agora","À faire maintenant");
    }
    const days=Math.max(1,Math.ceil((target-now)/(24*60*60*1000)));
    if(days===1) return langPick("Due tomorrow","Para mañana","Para amanhã","Pour demain");
    return langPick("In "+days+" days","En "+days+" días","Em "+days+" dias","Dans "+days+" jours");
  }
  function card(task){
    const service=String((task.payload||{}).service||"").trim();
    const detail=reason(task)+(service?" · "+service:"");
    const due=dueLabel(task);
    const isDue=effectiveDue(task)<=Date.now();
    const badgeClass=task.kind==="invoice"?"yellow":task.kind==="review"?"success":"blue";
    return '<article class="followup-card'+(isDue?' is-due':'')+'">'+
      '<div class="followup-card-main">'+
        '<div class="followup-card-top">'+
          '<span class="pill '+badgeClass+'">'+escapeHtml(kindLabel(task.kind))+'</span>'+
          '<small>'+escapeHtml(due)+'</small>'+
        '</div>'+
        '<strong>'+escapeHtml(task.customer_name||task.customer_email||langPick("Customer","Cliente","Cliente","Client"))+'</strong>'+
        '<span>'+escapeHtml(detail)+'</span>'+
        '<small>'+escapeHtml(task.customer_email||"")+'</small>'+
      '</div>'+
      '<div class="followup-card-actions">'+
        '<button type="button" class="primary-btn followup-send-btn" data-followup-send="'+task.id+'">'+escapeHtml(langPick("Send now","Enviar ahora","Enviar agora","Envoyer"))+'</button>'+
        '<button type="button" class="ghost-btn" data-followup-snooze="'+task.id+'">'+escapeHtml(langPick("Snooze 2 days","Posponer 2 días","Adiar 2 dias","Reporter 2 jours"))+'</button>'+
        '<button type="button" class="text-btn" data-followup-source="'+task.id+'">'+escapeHtml(langPick("Open source","Ver origen","Abrir origem","Ouvrir la source"))+'</button>'+
        '<button type="button" class="text-btn" data-followup-done="'+task.id+'">'+escapeHtml(langPick("Done","Hecho","Concluído","Terminé"))+'</button>'+
      '</div>'+
    '</article>';
  }
  function render(){
    const prefs=preferences||DEFAULTS;
    $$("[data-followup-mode]").forEach(select=>{
      const value=prefs[select.dataset.followupMode]||"remind";
      if(select.value!==value) select.value=value;
    });

    const active=tasks.filter(task=>["pending","snoozed"].includes(task.status)&&modeFor(task.kind)!=="off");
    active.sort((a,b)=>effectiveDue(a)-effectiveDue(b));
    const dueNow=active.filter(task=>effectiveDue(task)<=Date.now());
    const snoozed=active.filter(task=>task.status==="snoozed");
    const start=new Date();
    start.setDate(1); start.setHours(0,0,0,0);
    const sent=tasks.filter(task=>task.status==="sent"&&task.sent_at&&new Date(task.sent_at)>=start)
      .sort((a,b)=>new Date(b.sent_at)-new Date(a.sent_at));

    if($("#followUpDueCount")) $("#followUpDueCount").textContent=String(dueNow.length);
    if($("#followUpSnoozedCount")) $("#followUpSnoozedCount").textContent=String(snoozed.length);
    if($("#followUpSentCount")) $("#followUpSentCount").textContent=String(sent.length);
    if($("#followUpQueuePill")) $("#followUpQueuePill").textContent=String(dueNow.length)+" "+langPick("due","pendiente"+(dueNow.length===1?"":"s"),"pendente"+(dueNow.length===1?"":"s"),"à faire");

    const list=$("#followUpList");
    if(list){
      if(active.length){
        list.innerHTML=active.slice(0,30).map(card).join("");
      }else{
        list.innerHTML='<div class="empty-inline"><strong>'+escapeHtml(langPick("Nothing needs follow-up.","No hay seguimientos pendientes.","Nenhum acompanhamento pendente.","Aucun suivi en attente."))+'</strong><span>'+escapeHtml(langPick("New items will appear here automatically.","Los nuevos seguimientos aparecerán aquí automáticamente.","Novos acompanhamentos aparecerão aqui automaticamente.","Les nouveaux suivis apparaîtront ici automatiquement."))+'</span></div>';
      }
    }

    const history=$("#followUpSentList");
    if(history){
      if(sent.length){
        history.innerHTML=sent.slice(0,12).map(task=>{
          const when=new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(task.sent_at));
          return '<div class="followup-history-row"><span class="pill success">'+escapeHtml(kindLabel(task.kind))+'</span><strong>'+escapeHtml(task.customer_name||task.customer_email||"Customer")+'</strong><small>'+escapeHtml(when)+'</small></div>';
        }).join("");
      }else{
        history.innerHTML='<div class="empty-inline"><strong>'+escapeHtml(langPick("No follow-ups sent yet.","Aún no se han enviado seguimientos.","Nenhum acompanhamento enviado ainda.","Aucun suivi envoyé pour le moment."))+'</strong></div>';
      }
    }
  }

  async function load(){
    const current=state();
    if(loading||!current.business?.id||!["owner","admin"].includes(String(current.business.role||""))) return;
    loading=true;
    const list=$("#followUpList");
    if(list&&!tasks.length){
      list.innerHTML='<div class="empty-inline"><strong>'+escapeHtml(langPick("Loading follow-ups…","Cargando seguimientos…","Carregando acompanhamentos…","Chargement des suivis…"))+'</strong><span>'+escapeHtml(langPick("Checking what needs attention.","Revisando qué necesita atención.","Verificando o que precisa de atenção.","Vérification des éléments à suivre."))+'</span></div>';
    }
    try{
      const businessId=current.business.id;
      const refresh=await supabase.rpc("refresh_follow_up_tasks",{p_business_id:businessId});
      if(refresh.error) throw refresh.error;
      const results=await Promise.all([
        supabase.from("follow_up_preferences").select("*").eq("business_id",businessId).maybeSingle(),
        supabase.from("follow_up_tasks").select("*").eq("business_id",businessId).in("status",["pending","snoozed","sent"]).order("due_at",{ascending:true}).limit(160)
      ]);
      if(results[0].error) throw results[0].error;
      if(results[1].error) throw results[1].error;
      preferences=results[0].data||Object.assign({business_id:businessId},DEFAULTS);
      tasks=results[1].data||[];
      current.followUpPreferences=preferences;
      current.followUpTasks=tasks;
      render();
    }catch(err){
      console.warn("[TLE] follow-ups",err);
      if(list) list.innerHTML='<div class="empty-inline"><strong>Could not load follow-ups.</strong><span>Tap Refresh follow-ups to try again.</span></div>';
      throw err;
    }finally{
      loading=false;
    }
  }

  async function patchTask(id,patch){
    const businessId=state().business?.id;
    if(!businessId) return;
    const result=await supabase.from("follow_up_tasks").update(Object.assign({},patch,{updated_at:new Date().toISOString()})).eq("id",id).eq("business_id",businessId);
    if(result.error) throw result.error;
    await load();
  }
  function sourceTask(id){
    return tasks.find(task=>task.id===id);
  }
  function openSource(task){
    if(!task) return;
    const page=task.resource_type==="lead"?"leads":task.resource_type==="quote"?"quotes":task.resource_type==="invoice"?"invoices":"clients";
    openView(page);
    if(page==="clients"&&task.client_id){
      setTimeout(()=>openClientInfo(task.client_id),120);
    }
  }

  document.addEventListener("change",async e=>{
    const select=e.target.closest&&e.target.closest("[data-followup-mode]");
    if(!select||!state().business?.id) return;
    const field=select.dataset.followupMode;
    if(!Object.prototype.hasOwnProperty.call(DEFAULTS,field)) return;
    const previous=(preferences||DEFAULTS)[field]||"remind";
    if(select.value==="auto"){
      const ok=window.confirm(langPick(
        "Auto email can send due follow-ups to real customers within the next hour. Turn it on?",
        "El email automático puede enviar seguimientos a clientes reales dentro de la próxima hora. ¿Activarlo?",
        "O e-mail automático pode enviar acompanhamentos a clientes reais dentro da próxima hora. Ativar?",
        "L’e-mail automatique peut envoyer des suivis à de vrais clients dans l’heure. L’activer ?"
      ));
      if(!ok){select.value=previous;return;}
    }
    select.disabled=true;
    try{
      const patch={updated_at:new Date().toISOString()};
      patch[field]=select.value;
      const result=await supabase.from("follow_up_preferences").update(patch).eq("business_id",state().business.id);
      if(result.error) throw result.error;
      preferences=Object.assign({},preferences||DEFAULTS,patch);
      state().followUpPreferences=preferences;
      render();
      if(select.value==="auto"){
        showToast(langPick("Auto email enabled · due follow-ups send within an hour.","Email automático activado · los seguimientos vencidos se envían dentro de una hora.","E-mail automático ativado · acompanhamentos vencidos são enviados em até uma hora.","E-mail automatique activé · les suivis dus sont envoyés dans l’heure."));
      }else{
        showToast(langPick("Follow-up rule updated","Regla de seguimiento actualizada","Regra de acompanhamento atualizada","Règle de suivi mise à jour"));
      }
    }catch(err){
      select.value=previous;
      showToast(err.message||"Could not update follow-up rule");
    }finally{
      select.disabled=false;
    }
  });

  document.addEventListener("click",async e=>{
    const refresh=e.target.closest&&e.target.closest("#followUpRefreshBtn");
    if(refresh){
      refresh.disabled=true;
      try{
        await load();
        showToast(langPick("Follow-ups refreshed","Seguimientos actualizados","Acompanhamentos atualizados","Suivis actualisés"));
      }catch(err){
        showToast(err.message||"Could not refresh follow-ups");
      }finally{
        refresh.disabled=false;
      }
      return;
    }

    const send=e.target.closest&&e.target.closest("[data-followup-send]");
    if(send){
      send.disabled=true;
      const original=send.textContent;
      send.textContent=langPick("Sending…","Enviando…","Enviando…","Envoi…");
      try{
        const result=await supabase.rpc("send_follow_up_task",{p_task_id:send.dataset.followupSend});
        if(result.error) throw result.error;
        await load();
        showToast(langPick("Follow-up emailed","Seguimiento enviado por email","Acompanhamento enviado por e-mail","Suivi envoyé par e-mail"));
      }catch(err){
        showToast(err.message||"Could not send follow-up");
        send.disabled=false;
        send.textContent=original;
      }
      return;
    }

    const snooze=e.target.closest&&e.target.closest("[data-followup-snooze]");
    if(snooze){
      try{
        await patchTask(snooze.dataset.followupSnooze,{status:"snoozed",snoozed_until:new Date(Date.now()+2*24*60*60*1000).toISOString()});
        showToast(langPick("Snoozed for 2 days","Pospuesto por 2 días","Adiado por 2 dias","Reporté de 2 jours"));
      }catch(err){
        showToast(err.message||"Could not snooze follow-up");
      }
      return;
    }

    const done=e.target.closest&&e.target.closest("[data-followup-done]");
    if(done){
      try{
        await patchTask(done.dataset.followupDone,{status:"done",completed_at:new Date().toISOString(),snoozed_until:null});
        showToast(langPick("Follow-up marked done","Seguimiento marcado como hecho","Acompanhamento concluído","Suivi terminé"));
      }catch(err){
        showToast(err.message||"Could not close follow-up");
      }
      return;
    }

    const source=e.target.closest&&e.target.closest("[data-followup-source]");
    if(source){
      openSource(sourceTask(source.dataset.followupSource));
    }
  });

  const view=document.querySelector('.view[data-page="followups"]');
  if(view){
    const observer=new MutationObserver(()=>{
      if(view.classList.contains("active")) load().catch(()=>{});
    });
    observer.observe(view,{attributes:true,attributeFilter:["class"]});
    if(view.classList.contains("active")) load().catch(()=>{});
  }

  window.TLE_FOLLOWUPS={load,render};
})();

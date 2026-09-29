(()=>{
  const bridge=window.TLE_FOLLOWUPS_BRIDGE;
  if(!bridge){
    console.warn("[TLE] Follow-ups bridge unavailable");
    return;
  }

  const {supabase,openView,showToast,langPick,escapeHtml,appLocale}=bridge;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const DEFAULTS={
    lead_mode:"remind",
    quote_mode:"remind",
    invoice_mode:"remind",
    review_mode:"remind",
    rebook_mode:"remind",
    message_templates:{}
  };

  let candidates=[];
  let preferences=null;
  let followUpStates=[];
  let sentHistory=[];
  let loading=false;
  let editingType=null;

  function appState(){
    return bridge.getState();
  }
  function modeFor(kind){
    return (preferences||DEFAULTS)[kind+"_mode"]||"remind";
  }
  function kindLabel(kind){
    return {
      lead:langPick("Lead","Lead","Prospect"),
      quote:langPick("Quote","Cotización","Devis"),
      invoice:langPick("Invoice","Factura","Facture"),
      review:langPick("After cleaning","Después de limpiar","Après le nettoyage"),
      rebook:langPick("Rebooking","Nueva reserva","Nouvelle réservation")
    }[kind]||kind;
  }
  function dueTime(task){
    const value=new Date(task?.due_at||0).getTime();
    return Number.isFinite(value)?value:0;
  }
  function dueLabel(task){
    const target=dueTime(task);
    if(!target) return "";
    const now=Date.now();
    if(target<=now){
      const overdue=Math.max(0,Math.floor((now-target)/(24*60*60*1000)));
      if(overdue){
        return langPick("Overdue "+overdue+"d","Vencido hace "+overdue+"d","En retard de "+overdue+"j");
      }
      return langPick("Due now","Toca ahora","À faire maintenant");
    }
    const days=Math.max(1,Math.ceil((target-now)/(24*60*60*1000)));
    if(days===1) return langPick("Due tomorrow","Para mañana","Pour demain");
    return langPick("In "+days+" days","En "+days+" días","Dans "+days+" jours");
  }
  function modeLabel(kind){
    const mode=modeFor(kind);
    return mode==="auto"
      ? langPick("Auto email","Email automático","E-mail automatique")
      : langPick("Remind me","Recordarme","Me rappeler");
  }
  function followUpCard(task){
    const due=dueLabel(task);
    const isDue=dueTime(task)<=Date.now();
    const badgeClass=task.follow_up_type==="invoice"?"yellow":task.follow_up_type==="review"?"success":"blue";
    return '<article class="followup-card'+(isDue?' is-due':'')+'">'+
      '<div class="followup-card-main">'+
        '<div class="followup-card-top">'+
          '<span class="pill '+badgeClass+'">'+escapeHtml(kindLabel(task.follow_up_type))+'</span>'+
          '<small>'+escapeHtml(due)+'</small>'+
        '</div>'+
        '<strong>'+escapeHtml(task.customer_name||task.customer_email||langPick("Customer","Cliente","Client"))+'</strong>'+
        '<span>'+escapeHtml(task.detail||langPick("Needs follow-up","Necesita seguimiento","Nécessite un suivi"))+'</span>'+
        '<small>'+escapeHtml(task.customer_email||"")+' · '+escapeHtml(modeLabel(task.follow_up_type))+'</small>'+
      '</div>'+
      '<div class="followup-card-actions">'+
        '<button type="button" class="primary-btn followup-send-btn" data-followup-send data-followup-type="'+escapeHtml(task.follow_up_type)+'" data-followup-resource="'+escapeHtml(task.resource_id)+'">'+escapeHtml(langPick("Send now","Enviar ahora","Envoyer"))+'</button>'+
        '<button type="button" class="ghost-btn" data-followup-snooze data-followup-type="'+escapeHtml(task.follow_up_type)+'" data-followup-resource="'+escapeHtml(task.resource_id)+'">'+escapeHtml(langPick("Snooze 2 days","Posponer 2 días","Reporter 2 jours"))+'</button>'+
        '<button type="button" class="text-btn" data-followup-source="'+escapeHtml(task.source_view||"")+'">'+escapeHtml(langPick("Open source","Ver origen","Ouvrir la source"))+'</button>'+
        '<button type="button" class="text-btn" data-followup-done data-followup-type="'+escapeHtml(task.follow_up_type)+'" data-followup-resource="'+escapeHtml(task.resource_id)+'">'+escapeHtml(langPick("Done","Hecho","Terminé"))+'</button>'+
      '</div>'+
    '</article>';
  }


  function messageTemplates(){
    const raw=preferences?.message_templates;
    if(raw && typeof raw==="object" && !Array.isArray(raw)) return raw;
    if(typeof raw==="string"){
      try{
        const parsed=JSON.parse(raw);
        if(parsed && typeof parsed==="object" && !Array.isArray(parsed)) return parsed;
      }catch{}
    }
    return {};
  }

  function editorDefaultLanguage(){
    const locale=String(appLocale?.()||"en").toLowerCase();
    if(locale.startsWith("es")) return "es";
    if(locale.startsWith("fr")) return "fr";
    if(locale.startsWith("ht")) return "ht";
    return "en";
  }

  function templateFor(type,language){
    const item=messageTemplates()?.[type]?.[language];
    if(!item || typeof item!=="object") return {subject:"",body:""};
    return {subject:String(item.subject||""),body:String(item.body||"")};
  }

  function hasCustomForType(type){
    const byLanguage=messageTemplates()?.[type];
    if(!byLanguage || typeof byLanguage!=="object") return false;
    return Object.values(byLanguage).some(item=>
      item && typeof item==="object" &&
      (String(item.subject||"").trim() || String(item.body||"").trim())
    );
  }

  function localizeMessageEditor(){
    const labels={
      followUpEditorEyebrow:langPick("CUSTOM MESSAGE","MENSAJE PERSONALIZADO","MESSAGE PERSONNALISÉ"),
      followUpEditorHelp:langPick("Write the email in the customer’s language. Leave a field blank to keep the default.","Escribe el email en el idioma del cliente. Deja un campo vacío para conservar el texto predeterminado.","Rédigez l’e-mail dans la langue du client. Laissez un champ vide pour conserver le texte par défaut."),
      followUpEditorLanguageLabel:langPick("Customer language","Idioma del cliente","Langue du client"),
      followUpEditorSubjectLabel:langPick("Subject (optional)","Asunto (opcional)","Objet (facultatif)"),
      followUpEditorBodyLabel:langPick("Message","Mensaje","Message"),
      followUpTemplateNote:langPick("You can use {{name}}, {{business}}, {{amount}} and {{invoice_number}}. Quote, invoice, review and rebooking buttons are added automatically.","Puedes usar {{name}}, {{business}}, {{amount}} y {{invoice_number}}. Los botones de cotización, factura, reseña y nueva reserva se añaden automáticamente.","Vous pouvez utiliser {{name}}, {{business}}, {{amount}} et {{invoice_number}}. Les boutons de devis, facture, avis et nouvelle réservation sont ajoutés automatiquement."),
      followUpEditorSave:langPick("Save message","Guardar mensaje","Enregistrer"),
      followUpEditorReset:langPick("Use default","Usar predeterminado","Utiliser le texte par défaut")
    };
    Object.entries(labels).forEach(([id,value])=>{const el=$("#"+id);if(el) el.textContent=value;});
  }

  function fillMessageEditor(){
    if(!editingType) return;
    const language=$("#followUpEditorLanguage")?.value||"en";
    const current=templateFor(editingType,language);
    const subject=$("#followUpEditorSubject");
    const body=$("#followUpEditorBody");
    if(subject) subject.value=current.subject;
    if(body) body.value=current.body;
    const title=$("#followUpEditorTitle");
    if(title) title.textContent=langPick("Edit ","Editar ","Modifier ")+kindLabel(editingType);
    const status=$("#followUpEditorStatus");
    if(status){
      const languageName=$("#followUpEditorLanguage")?.selectedOptions?.[0]?.textContent||language.toUpperCase();
      status.textContent=(current.subject.trim()||current.body.trim())
        ? langPick("Custom message saved for "+languageName+".","Mensaje personalizado guardado para "+languageName+".","Message personnalisé enregistré pour "+languageName+".")
        : langPick("Using the default message for "+languageName+".","Usando el mensaje predeterminado para "+languageName+".","Le message par défaut est utilisé pour "+languageName+".");
    }
  }

  function openMessageEditor(type){
    editingType=type;
    const editor=$("#followUpMessageEditor");
    if(!editor) return;
    localizeMessageEditor();
    const language=$("#followUpEditorLanguage");
    if(language) language.value=editorDefaultLanguage();
    editor.hidden=false;
    fillMessageEditor();
    try{editor.scrollIntoView({behavior:"smooth",block:"nearest"});}catch{}
  }

  function closeMessageEditor(){
    const editor=$("#followUpMessageEditor");
    if(editor) editor.hidden=true;
    editingType=null;
  }

  async function saveMessageTemplate(type,language,subject,body){
    const businessId=appState().business?.id;
    if(!businessId) return;
    const next=JSON.parse(JSON.stringify(messageTemplates()||{}));
    const cleanSubject=String(subject||"").trim();
    const cleanBody=String(body||"").trim();
    if(!next[type] || typeof next[type]!=="object") next[type]={};
    if(cleanSubject||cleanBody){
      next[type][language]={subject:cleanSubject,body:cleanBody};
    }else{
      delete next[type][language];
      if(!Object.keys(next[type]).length) delete next[type];
    }
    const result=await supabase.from("follow_up_settings")
      .update({message_templates:next,updated_at:new Date().toISOString()})
      .eq("business_id",businessId)
      .select("*")
      .single();
    if(result.error) throw result.error;
    preferences=result.data;
    appState().followUpSettings=preferences;
  }

  function setMessageEditorBusy(busy){
    ["followUpEditorSave","followUpEditorReset","followUpEditorLanguage","followUpEditorSubject","followUpEditorBody","followUpEditorClose"]
      .forEach(id=>{const el=$("#"+id);if(el) el.disabled=busy;});
  }

  function render(){
    const prefs=preferences||DEFAULTS;
    $$("[data-followup-mode]").forEach(select=>{
      const value=prefs[select.dataset.followupMode]||"remind";
      if(select.value!==value) select.value=value;
    });
    $("[data-followup-edit]").forEach(button=>{
      const custom=hasCustomForType(button.dataset.followupEdit);
      button.classList.toggle("has-custom",custom);
      button.textContent=custom
        ? langPick("Edit message · Custom","Editar mensaje · Personalizado","Modifier · Personnalisé")
        : langPick("Edit message","Editar mensaje","Modifier le message");
    });

    const active=candidates
      .filter(task=>modeFor(task.follow_up_type)!=="off")
      .sort((a,b)=>dueTime(a)-dueTime(b));
    const dueNow=active.filter(task=>dueTime(task)<=Date.now());
    const snoozed=followUpStates.filter(row=>{
      const until=new Date(row.snoozed_until||0).getTime();
      return row.status==="active" && !row.last_sent_at && Number.isFinite(until) && until>Date.now();
    });
    const monthStart=new Date();
    monthStart.setDate(1);
    monthStart.setHours(0,0,0,0);
    const sentThisMonth=sentHistory.filter(row=>new Date(row.created_at)>=monthStart);

    if($("#followUpDueCount")) $("#followUpDueCount").textContent=String(dueNow.length);
    if($("#followUpSnoozedCount")) $("#followUpSnoozedCount").textContent=String(snoozed.length);
    if($("#followUpSentCount")) $("#followUpSentCount").textContent=String(sentThisMonth.length);
    if($("#followUpQueuePill")){
      $("#followUpQueuePill").textContent=String(dueNow.length)+" "+langPick("due",dueNow.length===1?"pendiente":"pendientes","à faire");
    }

    const list=$("#followUpList");
    if(list){
      list.innerHTML=active.length
        ? active.slice(0,40).map(followUpCard).join("")
        : '<div class="empty-inline"><strong>'+escapeHtml(langPick("Nothing needs follow-up.","No hay seguimientos pendientes.","Aucun suivi en attente."))+'</strong><span>'+escapeHtml(langPick("New items will appear here automatically.","Los nuevos seguimientos aparecerán aquí automáticamente.","Les nouveaux suivis apparaîtront ici automatiquement."))+'</span></div>';
    }

    const history=$("#followUpSentList");
    if(history){
      const recent=sentHistory.slice(0,12);
      history.innerHTML=recent.length
        ? recent.map(row=>{
            const when=new Intl.DateTimeFormat(appLocale(),{
              month:"short",day:"numeric",hour:"numeric",minute:"2-digit"
            }).format(new Date(row.created_at));
            return '<div class="followup-history-row">'+
              '<span class="pill success">'+escapeHtml(kindLabel(row.follow_up_type))+'</span>'+
              '<strong>'+escapeHtml(row.customer_name||row.customer_email||langPick("Customer","Cliente","Client"))+'</strong>'+
              '<small>'+escapeHtml(when)+'</small>'+
            '</div>';
          }).join("")
        : '<div class="empty-inline"><strong>'+escapeHtml(langPick("No follow-ups sent yet.","Aún no se han enviado seguimientos.","Aucun suivi envoyé pour le moment."))+'</strong></div>';
    }
  }

  async function ensurePreferences(businessId,row){
    if(row) return row;
    const payload={business_id:businessId,...DEFAULTS,updated_at:new Date().toISOString()};
    const result=await supabase.from("follow_up_settings")
      .upsert(payload,{onConflict:"business_id"})
      .select("*")
      .single();
    if(result.error) throw result.error;
    return result.data;
  }

  async function load(){
    const current=appState();
    if(loading||!current.business?.id||!["owner","admin"].includes(String(current.business.role||""))) return;
    loading=true;
    const list=$("#followUpList");
    if(list&&!candidates.length){
      list.innerHTML='<div class="empty-inline"><strong>'+escapeHtml(langPick("Loading follow-ups…","Cargando seguimientos…","Chargement des suivis…"))+'</strong><span>'+escapeHtml(langPick("Checking what needs attention.","Revisando qué necesita atención.","Vérification des éléments à suivre."))+'</span></div>';
    }

    try{
      const businessId=current.business.id;
      const monthStart=new Date();
      monthStart.setDate(1);
      monthStart.setHours(0,0,0,0);

      const results=await Promise.all([
        supabase.from("follow_up_settings").select("*").eq("business_id",businessId).maybeSingle(),
        supabase.rpc("get_follow_up_candidates",{p_business_id:businessId}),
        supabase.from("follow_up_states")
          .select("follow_up_type,resource_id,status,snoozed_until,last_sent_at,sent_count,updated_at")
          .eq("business_id",businessId),
        supabase.from("follow_up_email_outbox")
          .select("id,follow_up_type,resource_id,customer_email,customer_name,created_at")
          .eq("business_id",businessId)
          .gte("created_at",monthStart.toISOString())
          .order("created_at",{ascending:false})
          .limit(80)
      ]);

      for(const result of results){
        if(result.error) throw result.error;
      }

      preferences=await ensurePreferences(businessId,results[0].data);
      candidates=results[1].data||[];
      followUpStates=results[2].data||[];
      sentHistory=results[3].data||[];
      current.followUpSettings=preferences;
      current.followUpCandidates=candidates;
      render();
    }catch(err){
      console.warn("[TLE] follow-ups",err);
      if(list){
        list.innerHTML='<div class="empty-inline"><strong>'+escapeHtml(langPick("Could not load follow-ups.","No se pudieron cargar los seguimientos.","Impossible de charger les suivis."))+'</strong><span>'+escapeHtml(langPick("Tap Refresh follow-ups to try again.","Toca Actualizar seguimientos para intentarlo otra vez.","Touchez Actualiser les suivis pour réessayer."))+'</span></div>';
      }
      throw err;
    }finally{
      loading=false;
    }
  }

  async function setMode(field,value){
    const businessId=appState().business?.id;
    if(!businessId) return;
    const patch={updated_at:new Date().toISOString()};
    patch[field]=value;
    const result=await supabase.from("follow_up_settings")
      .update(patch)
      .eq("business_id",businessId)
      .select("*")
      .single();
    if(result.error) throw result.error;
    preferences=result.data;
    appState().followUpSettings=preferences;
  }

  async function updateState(type,resourceId,action){
    const businessId=appState().business?.id;
    if(!businessId) return;
    const result=await supabase.rpc("update_follow_up_state",{
      p_business_id:businessId,
      p_follow_up_type:type,
      p_resource_id:resourceId,
      p_action:action
    });
    if(result.error) throw result.error;
  }

  document.addEventListener("change",async e=>{
    const editorLanguage=e.target.closest?.("#followUpEditorLanguage");
    if(editorLanguage){
      fillMessageEditor();
      return;
    }
    const select=e.target.closest?.("[data-followup-mode]");
    if(!select||!appState().business?.id) return;
    const field=select.dataset.followupMode;
    if(!Object.prototype.hasOwnProperty.call(DEFAULTS,field)) return;
    const previous=(preferences||DEFAULTS)[field]||"remind";
    if(select.value==="auto"){
      const ok=window.confirm(langPick("Auto email can send due follow-ups to real customers within the next hour. Turn it on?","El email automático puede enviar seguimientos a clientes reales dentro de la próxima hora. ¿Activarlo?","L’e-mail automatique peut envoyer des suivis à de vrais clients dans l’heure. L’activer ?"));
      if(!ok){select.value=previous;return;}
    }
    select.disabled=true;
    try{
      await setMode(field,select.value);
      render();
      if(select.value==="auto"){
        showToast(langPick("Auto email enabled · due follow-ups send within an hour.","Email automático activado · los seguimientos vencidos se envían dentro de una hora.","E-mail automatique activé · les suivis dus sont envoyés dans l’heure."));
      }else{
        showToast(langPick("Follow-up rule updated","Regla de seguimiento actualizada","Règle de suivi mise à jour"));
      }
    }catch(err){
      select.value=previous;
      showToast(err.message||"Could not update follow-up rule");
    }finally{
      select.disabled=false;
    }
  });

  document.addEventListener("click",async e=>{
    const edit=e.target.closest?.("[data-followup-edit]");
    if(edit){
      openMessageEditor(edit.dataset.followupEdit);
      return;
    }

    const editorClose=e.target.closest?.("#followUpEditorClose");
    if(editorClose){
      closeMessageEditor();
      return;
    }

    const editorSave=e.target.closest?.("#followUpEditorSave");
    if(editorSave && editingType){
      const language=$("#followUpEditorLanguage")?.value||"en";
      const subject=$("#followUpEditorSubject")?.value||"";
      const body=$("#followUpEditorBody")?.value||"";
      setMessageEditorBusy(true);
      try{
        await saveMessageTemplate(editingType,language,subject,body);
        render();
        fillMessageEditor();
        showToast(langPick("Follow-up message saved","Mensaje de seguimiento guardado","Message de suivi enregistré"));
      }catch(err){
        showToast(err.message||"Could not save follow-up message");
      }finally{
        setMessageEditorBusy(false);
      }
      return;
    }

    const editorReset=e.target.closest?.("#followUpEditorReset");
    if(editorReset && editingType){
      const language=$("#followUpEditorLanguage")?.value||"en";
      setMessageEditorBusy(true);
      try{
        await saveMessageTemplate(editingType,language,"","");
        render();
        fillMessageEditor();
        showToast(langPick("Default follow-up restored","Mensaje predeterminado restaurado","Message par défaut restauré"));
      }catch(err){
        showToast(err.message||"Could not restore default message");
      }finally{
        setMessageEditorBusy(false);
      }
      return;
    }

    const refresh=e.target.closest?.("#followUpRefreshBtn");
    if(refresh){
      refresh.disabled=true;
      try{
        await load();
        showToast(langPick("Follow-ups refreshed","Seguimientos actualizados","Suivis actualisés"));
      }catch(err){
        showToast(err.message||"Could not refresh follow-ups");
      }finally{
        refresh.disabled=false;
      }
      return;
    }

    const send=e.target.closest?.("[data-followup-send]");
    if(send){
      send.disabled=true;
      const original=send.textContent;
      send.textContent=langPick("Sending…","Enviando…","Envoi…");
      try{
        const result=await supabase.rpc("send_follow_up_now",{
          p_business_id:appState().business.id,
          p_follow_up_type:send.dataset.followupType,
          p_resource_id:send.dataset.followupResource
        });
        if(result.error) throw result.error;
        await load();
        showToast(langPick("Follow-up emailed","Seguimiento enviado por email","Suivi envoyé par e-mail"));
      }catch(err){
        showToast(err.message||"Could not send follow-up");
        send.disabled=false;
        send.textContent=original;
      }
      return;
    }

    const snooze=e.target.closest?.("[data-followup-snooze]");
    if(snooze){
      try{
        await updateState(snooze.dataset.followupType,snooze.dataset.followupResource,"snooze");
        await load();
        showToast(langPick("Snoozed for 2 days","Pospuesto por 2 días","Reporté de 2 jours"));
      }catch(err){
        showToast(err.message||"Could not snooze follow-up");
      }
      return;
    }

    const done=e.target.closest?.("[data-followup-done]");
    if(done){
      try{
        await updateState(done.dataset.followupType,done.dataset.followupResource,"dismiss");
        await load();
        showToast(langPick("Follow-up marked done","Seguimiento marcado como hecho","Suivi terminé"));
      }catch(err){
        showToast(err.message||"Could not close follow-up");
      }
      return;
    }

    const source=e.target.closest?.("[data-followup-source]");
    if(source){
      const page=String(source.dataset.followupSource||"");
      if(page) openView(page);
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
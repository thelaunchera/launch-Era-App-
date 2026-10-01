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

  // Every account ships with ready-to-send follow-up copy. Owners only need
  // to switch a rule to Auto email; this editor is optional customization.
  // The database email builder remains the source of truth for the actual send.
  const SYSTEM_TEMPLATES={
    lead:{
      en:{subject:"Still looking for help with the cleaning? — {{business}}",body:"Hi {{name}},\n\nJust checking in to see if you still need help with the cleaning. If you do, reply to this email and we’ll pick up where we left off."},
      es:{subject:"¿Sigues buscando ayuda con la limpieza? — {{business}}",body:"Hola {{name}},\n\nSolo queríamos saber si todavía necesitas ayuda con la limpieza. Si es así, responde a este correo y retomamos desde donde lo dejamos."},
      fr:{subject:"Toujours besoin d’un coup de main ? — {{business}}",body:"Bonjour {{name}},\n\nNous voulions simplement savoir si vous aviez toujours besoin d’aide pour le nettoyage. Si oui, répondez à cet e-mail et nous reprendrons là où nous nous étions arrêtés."},
      ht:{subject:"Ou toujou bezwen èd ak netwayaj la? — {{business}}",body:"Bonjou {{name}},\n\nNou te vle konnen si ou toujou bezwen èd ak netwayaj la. Si wi, reponn imel sa a epi n ap kontinye kote nou te rete a."}
    },
    quote:{
      en:{subject:"Any questions about your quote? — {{business}}",body:"Hi {{name}},\n\nWe just wanted to make sure you had a chance to look over your quote. If there’s anything you’d like to clarify before deciding, reply to this email and we’ll be happy to help."},
      es:{subject:"¿Alguna pregunta sobre tu cotización? — {{business}}",body:"Hola {{name}},\n\nSolo queríamos asegurarnos de que pudiste ver tu cotización. Si hay algo que quieras aclarar antes de decidir, responde a este correo y con gusto te ayudamos."},
      fr:{subject:"Une question sur votre devis ? — {{business}}",body:"Bonjour {{name}},\n\nNous voulions simplement vérifier que vous aviez pu consulter votre devis. Si vous souhaitez clarifier quelque chose avant de décider, répondez à cet e-mail."},
      ht:{subject:"Ou gen yon kesyon sou estimasyon ou an? — {{business}}",body:"Bonjou {{name}},\n\nNou jis vle asire ou te ka wè estimasyon ou an. Si gen yon bagay ou vle klarifye anvan ou deside, reponn imel sa a."}
    },
    invoice:{
      en:{subject:"A quick reminder about invoice #{{invoice_number}} — {{business}}",body:"Hi {{name}},\n\nJust a quick note about invoice #{{invoice_number}} for {{amount}}. If you already paid it, you can ignore this message. If you need anything from us, just reply here."},
      es:{subject:"Un recordatorio sobre tu factura #{{invoice_number}} — {{business}}",body:"Hola {{name}},\n\nTe escribimos por la factura #{{invoice_number}} por {{amount}}. Si ya la pagaste, puedes ignorar este mensaje. Si necesitas algo de nuestra parte, responde aquí."},
      fr:{subject:"Petit rappel pour la facture #{{invoice_number}} — {{business}}",body:"Bonjour {{name}},\n\nUn petit message concernant la facture #{{invoice_number}} d’un montant de {{amount}}. Si elle est déjà réglée, vous pouvez ignorer ce message. Sinon, répondez ici si vous avez besoin de quoi que ce soit."},
      ht:{subject:"Ti rapèl pou fakti #{{invoice_number}} — {{business}}",body:"Bonjou {{name}},\n\nN ap ekri ou sou fakti #{{invoice_number}} pou {{amount}}. Si ou deja peye li, ou ka inyore mesaj sa a. Si ou bezwen yon bagay nan men nou, jis reponn isit la."}
    },
    review:{
      en:{subject:"How did everything look? — {{business}}",body:"Hi {{name}},\n\nThanks again for choosing {{business}}. If everything looked the way you hoped and you have a minute, a short review would mean a lot to us."},
      es:{subject:"¿Cómo quedó todo? — {{business}}",body:"Hola {{name}},\n\nGracias nuevamente por elegir {{business}}. Si todo quedó como esperabas y tienes un minuto, una reseña breve nos ayudaría muchísimo."},
      fr:{subject:"Tout s’est bien passé ? — {{business}}",body:"Bonjour {{name}},\n\nMerci encore d’avoir choisi {{business}}. Si tout s’est passé comme vous l’espériez et que vous avez une minute, un petit avis nous aiderait énormément."},
      ht:{subject:"Kijan tout bagay te ye? — {{business}}",body:"Bonjou {{name}},\n\nMèsi ankò paske ou chwazi {{business}}. Si tout bagay te jan ou te espere a epi ou gen yon minit, yon ti revi ta ede nou anpil."}
    },
    rebook:{
      en:{subject:"Ready for another cleaning? — {{business}}",body:"Hi {{name}},\n\nIt’s been a little while since your last cleaning with {{business}}. If you’d like to book another one, we’d be happy to help again."},
      es:{subject:"¿Te viene bien otra limpieza? — {{business}}",body:"Hola {{name}},\n\nYa pasó un poco de tiempo desde tu última limpieza con {{business}}. Si quieres reservar otra, estaremos felices de volver a ayudarte."},
      fr:{subject:"Besoin d’un autre nettoyage ? — {{business}}",body:"Bonjour {{name}},\n\nUn peu de temps s’est écoulé depuis votre dernier nettoyage avec {{business}}. Si vous souhaitez en réserver un autre, nous serons ravis de vous aider à nouveau."},
      ht:{subject:"Ou ta renmen yon lòt netwayaj? — {{business}}",body:"Bonjou {{name}},\n\nSa fè yon ti tan depi dènye netwayaj ou ak {{business}}. Si ou ta renmen rezève yon lòt, n ap kontan ede w ankò."}
    }
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
    if(item && typeof item==="object"){
      return {subject:String(item.subject||""),body:String(item.body||"")};
    }
    const included=SYSTEM_TEMPLATES?.[type]?.[language]||SYSTEM_TEMPLATES?.[type]?.en;
    return included
      ? {subject:String(included.subject||""),body:String(included.body||"")}
      : {subject:"",body:""};
  }
  function hasCustomForLanguage(type,language){
    const item=messageTemplates()?.[type]?.[language];
    return !!(item && typeof item==="object" &&
      (String(item.subject||"").trim() || String(item.body||"").trim()));
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
      followUpEditorEyebrow:langPick("FOLLOW-UP MESSAGE","MENSAJE DE SEGUIMIENTO","MESSAGE DE SUIVI"),
      followUpEditorHelp:langPick("A ready-to-send message is already included. You only need to turn on Auto email. Edit this only if you want different wording.","Ya incluimos un mensaje listo para enviar. Solo necesitas activar Email automático. Edita esto únicamente si quieres cambiar el texto.","Un message prêt à envoyer est déjà inclus. Il suffit d’activer l’e-mail automatique. Modifiez-le seulement si vous souhaitez changer le texte."),
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
      status.textContent=hasCustomForLanguage(editingType,language)
        ? langPick("Custom message saved for "+languageName+".","Mensaje personalizado guardado para "+languageName+".","Message personnalisé enregistré pour "+languageName+".")
        : langPick("Ready to send · included message for "+languageName+".","Listo para enviar · mensaje incluido para "+languageName+".","Prêt à envoyer · message inclus pour "+languageName+".");
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
        ? langPick("Edit custom message","Editar mensaje personalizado","Modifier le message personnalisé")
        : langPick("Preview included message","Ver mensaje incluido","Voir le message inclus");
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
      const ok=window.confirm(langPick("Your follow-up message is already included. Auto email can send due follow-ups to real customers within the next hour. Turn it on?","Tu mensaje de seguimiento ya está incluido. El email automático puede enviar seguimientos a clientes reales dentro de la próxima hora. ¿Activarlo?","Votre message de suivi est déjà inclus. L’e-mail automatique peut envoyer des suivis à de vrais clients dans l’heure. L’activer ?"));
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
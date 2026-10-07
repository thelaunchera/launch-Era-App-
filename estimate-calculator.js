(function(){
  let bridge=null;
  let bound=false;
  let saving=false;

  const DEFAULTS={
    enabled:true,
    included_bedrooms:2,
    included_bathrooms:1,
    included_sqft:0,
    extra_bedroom_price:0,
    extra_bathroom_price:0,
    sqft_step:500,
    sqft_step_price:0,
    weekly_discount_percent:0,
    biweekly_discount_percent:0,
    monthly_discount_percent:0,
    minimum_total:0,
    show_breakdown:true
  };

  function appState(){
    return bridge?.getState?.()||{};
  }

  function language(){
    const code=String(window.TLE_I18N?.language||localStorage.getItem("tle_language")||"en").toLowerCase();
    return ["en","es","fr","ht"].includes(code)?code:"en";
  }

  function t(en,es,fr,ht){
    const map={en,en,es,fr,ht};
    return map[language()]||en;
  }

  function escapeHtml(value){
    if(bridge?.escapeHtml) return bridge.escapeHtml(String(value??""));
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  }

  function num(value,fallback=0){
    const n=Number(value);
    return Number.isFinite(n)?n:fallback;
  }

  function clamp(value,min,max){
    return Math.min(max,Math.max(min,value));
  }

  function money(value){
    const state=appState();
    const locale=state.business?.locale_code||bridge?.appLocale?.()||"en-US";
    const currency=state.business?.currency_code||"USD";
    try{
      return new Intl.NumberFormat(locale,{style:"currency",currency,maximumFractionDigits:2}).format(num(value));
    }catch{
      return "$"+num(value).toFixed(2);
    }
  }

  function settingsFromState(){
    return {...DEFAULTS,...(appState().business?.estimate_settings||{})};
  }

  function activeServices(){
    return (appState().services||[]).filter(service=>service?.active);
  }

  function serviceIsPriced(service){
    return service?.pricing_type==="flat" && num(service?.base_price)>0;
  }

  function relevantAddons(serviceId){
    return (appState().serviceAddons||[]).filter(addon=>addon?.active && (!addon.service_id || addon.service_id===serviceId));
  }

  function selectOptions(){
    const services=activeServices();
    const sorted=[...services].sort((a,b)=>{
      const paidDiff=Number(serviceIsPriced(b))-Number(serviceIsPriced(a));
      return paidDiff || String(a.name||"").localeCompare(String(b.name||""));
    });
    return sorted.map(service=>{
      const suffix=serviceIsPriced(service)
        ?" · "+money(service.base_price)
        :" · "+t("Custom quote","Cotización personalizada","Devis personnalisé","Estimasyon pèsonalize");
      return '<option value="'+escapeHtml(service.id)+'">'+escapeHtml(service.name||"Cleaning")+escapeHtml(suffix)+'</option>';
    }).join("");
  }

  function frequencyOptions(){
    return [
      ["one_time",t("One time","Una vez","Une fois","Yon fwa")],
      ["weekly",t("Weekly","Semanal","Hebdomadaire","Chak semèn")],
      ["biweekly",t("Biweekly","Cada 2 semanas","Toutes les 2 semaines","Chak 2 semèn")],
      ["monthly",t("Monthly","Mensual","Mensuel","Chak mwa")]
    ].map(([value,label])=>'<option value="'+value+'">'+escapeHtml(label)+'</option>').join("");
  }

  function render(){
    if(!bridge) return;
    const mount=document.getElementById("estimateCalculatorMount");
    if(!mount) return;

    if(mount.dataset.businessId===String(appState().business?.id||"")){
      if(saving || mount.dataset.saveState==="dirty" || mount.dataset.saveState==="error") return;
    }
    mount.dataset.businessId=String(appState().business?.id||"");
    const rules=settingsFromState();
    const services=activeServices();
    const firstPriced=services.find(serviceIsPriced)||services[0]||null;
    const enabledLabel=rules.enabled
      ?t("Live estimates ON","Estimados activos","Estimations activées","Estimasyon aktive")
      :t("Live estimates OFF","Estimados pausados","Estimations désactivées","Estimasyon kanpe");
    const canEditRules=String(appState().business?.role||"")==="owner";

    mount.innerHTML=
      '<div class="estimate-panel-head">'+
        '<div><p class="eyebrow">'+escapeHtml(t("ESTIMATE CALCULATOR","CALCULADORA DE ESTIMADOS","CALCULATEUR D’ESTIMATION","KALKILATÈ ESTIMASYON"))+'</p>'+
        '<h3>'+escapeHtml(t("Residential estimate calculator","Calculadora de estimados residenciales","Calculateur résidentiel","Kalkilatè rezidansyèl"))+'</h3>'+
        '<p class="panel-note">'+escapeHtml(t("Price a residential job fast using your own rules. Commercial work stays a custom quote.","Calcula rápido un trabajo residencial usando tus propias reglas. Comercial sigue como cotización personalizada.","Calculez rapidement un service résidentiel avec vos propres règles. Le commercial reste sur devis.","Kalkile yon travay rezidansyèl vit ak règ pa w. Komèsyal rete sou estimasyon pèsonalize."))+'</p></div>'+
        '<span class="pill blue estimate-live-status" data-enabled="'+String(Boolean(rules.enabled))+'">'+escapeHtml(enabledLabel)+'</span>'+
      '</div>'+
      '<div class="estimate-layout">'+
        '<section class="estimate-builder" aria-label="Estimate inputs">'+
          '<div class="estimate-segmented">'+
            '<label><input type="radio" name="estimate_property_type" value="residential" checked><span>'+escapeHtml(t("Residential","Residencial","Résidentiel","Rezidansyèl"))+'</span></label>'+
            '<label><input type="radio" name="estimate_property_type" value="commercial"><span>'+escapeHtml(t("Commercial","Comercial","Commercial","Komèsyal"))+'</span></label>'+
          '</div>'+
          '<div class="estimate-form-grid">'+
            '<label class="full">'+escapeHtml(t("Service","Servicio","Service","Sèvis"))+
              '<select id="estimateService">'+(services.length?selectOptions():'<option value="">'+escapeHtml(t("Add a service first","Añade un servicio primero","Ajoutez d’abord un service","Ajoute yon sèvis anvan"))+'</option>')+'</select>'+
            '</label>'+
            '<label>'+escapeHtml(t("Bedrooms","Habitaciones","Chambres","Chanm"))+'<input id="estimateBedrooms" type="number" min="0" max="30" step="1" inputmode="numeric" value="'+escapeHtml(rules.included_bedrooms)+'"></label>'+
            '<label>'+escapeHtml(t("Bathrooms","Baños","Salles de bain","Twalèt"))+'<input id="estimateBathrooms" type="number" min="0" max="30" step="0.5" inputmode="decimal" value="'+escapeHtml(rules.included_bathrooms)+'"></label>'+
            '<label>'+escapeHtml(t("Square feet","Pies cuadrados","Pieds carrés","Pye kare"))+'<input id="estimateSqft" type="number" min="0" max="1000000" step="50" inputmode="numeric" value="'+escapeHtml(Math.max(0,num(rules.included_sqft)))+'" placeholder="1500"></label>'+
            '<label>'+escapeHtml(t("Frequency","Frecuencia","Fréquence","Frekans"))+'<select id="estimateFrequency">'+frequencyOptions()+'</select></label>'+
          '</div>'+
          '<div class="estimate-addons-block">'+
            '<div class="estimate-field-head"><strong>'+escapeHtml(t("Extras","Extras","Options","Sipleman"))+'</strong><small>'+escapeHtml(t("Only add-ons available for the selected service appear here.","Solo aparecen extras disponibles para el servicio elegido.","Seules les options du service sélectionné apparaissent ici.","Se sèlman sipleman pou sèvis la ki parèt isit."))+'</small></div>'+
            '<div id="estimateAddons" class="estimate-addon-grid"></div>'+
          '</div>'+
        '</section>'+
        '<aside class="estimate-result" id="estimateSummary" aria-live="polite"></aside>'+
      '</div>'+
      '<details class="estimate-rules" '+(rules.enabled?"":"open")+'>'+
        '<summary><span><strong>'+escapeHtml(t("Pricing rules","Reglas de precio","Règles de tarification","Règ pri"))+'</strong><small>'+escapeHtml(t("Your formula — not a fixed TLE formula.","Tu fórmula — no una fórmula fija de TLE.","Votre formule — pas une formule TLE fixe.","Fòmil pa w — se pa yon fòmil TLE fiks."))+'</small></span><span>⌄</span></summary>'+
        '<div class="estimate-rules-body">'+
          (canEditRules?'<div class="estimate-save-bar"><span class="estimate-save-status" role="status" aria-live="polite"></span><button class="primary-btn" type="button" data-save-estimate>'+escapeHtml(t("Save changes","Guardar cambios","Enregistrer","Sove chanjman"))+'</button></div>':'')+
          '<label class="estimate-toggle full"><span><strong>'+escapeHtml(t("Use live estimates","Usar estimados en vivo","Utiliser les estimations en direct","Sèvi ak estimasyon an dirèk"))+'</strong><small>'+escapeHtml(t("Keep this on when you want the calculator rules active.","Déjalo activo cuando quieras usar estas reglas.","Activez lorsque vous souhaitez utiliser ces règles.","Kite sa limen lè w vle règ sa yo aktif."))+'</small></span><input id="estimateEnabled" type="checkbox" '+(rules.enabled?"checked":"")+'></label>'+
          '<div class="estimate-rule-grid">'+
            '<label>'+escapeHtml(t("Bedrooms included","Habitaciones incluidas","Chambres incluses","Chanm enkli"))+'<input id="estimateIncludedBedrooms" type="number" min="0" max="30" step="1" value="'+escapeHtml(rules.included_bedrooms)+'"></label>'+
            '<label>'+escapeHtml(t("Each extra bedroom","Cada habitación extra","Chaque chambre en plus","Chak chanm anplis"))+'<input id="estimateExtraBedroomPrice" type="number" min="0" step="0.01" value="'+escapeHtml(rules.extra_bedroom_price)+'"></label>'+
            '<label>'+escapeHtml(t("Bathrooms included","Baños incluidos","Salles de bain incluses","Twalèt enkli"))+'<input id="estimateIncludedBathrooms" type="number" min="0" max="30" step="0.5" value="'+escapeHtml(rules.included_bathrooms)+'"></label>'+
            '<label>'+escapeHtml(t("Each extra bathroom","Cada baño extra","Chaque salle de bain en plus","Chak twalèt anplis"))+'<input id="estimateExtraBathroomPrice" type="number" min="0" step="0.01" value="'+escapeHtml(rules.extra_bathroom_price)+'"></label>'+
            '<label>'+escapeHtml(t("Square feet included","Pies² incluidos","Pieds² inclus","Pye kare enkli"))+'<input id="estimateIncludedSqft" type="number" min="0" step="1" value="'+escapeHtml(rules.included_sqft)+'"></label>'+
            '<label>'+escapeHtml(t("Sq ft step","Bloque de pies²","Palier de pieds²","Etap pye kare"))+'<input id="estimateSqftStep" type="number" min="1" step="1" value="'+escapeHtml(rules.sqft_step)+'"></label>'+
            '<label>'+escapeHtml(t("Price per sq ft step","Precio por bloque","Prix par palier","Pri pa etap"))+'<input id="estimateSqftStepPrice" type="number" min="0" step="0.01" value="'+escapeHtml(rules.sqft_step_price)+'"></label>'+
            '<label>'+escapeHtml(t("Minimum estimate","Estimado mínimo","Estimation minimale","Estimasyon minimòm"))+'<input id="estimateMinimumTotal" type="number" min="0" step="0.01" value="'+escapeHtml(rules.minimum_total)+'"></label>'+
            '<label>'+escapeHtml(t("Weekly discount %","Descuento semanal %","Remise hebdo %","Rabè chak semèn %"))+'<input id="estimateWeeklyDiscount" type="number" min="0" max="100" step="0.5" value="'+escapeHtml(rules.weekly_discount_percent)+'"></label>'+
            '<label>'+escapeHtml(t("Biweekly discount %","Descuento cada 2 semanas %","Remise 2 semaines %","Rabè chak 2 semèn %"))+'<input id="estimateBiweeklyDiscount" type="number" min="0" max="100" step="0.5" value="'+escapeHtml(rules.biweekly_discount_percent)+'"></label>'+
            '<label>'+escapeHtml(t("Monthly discount %","Descuento mensual %","Remise mensuelle %","Rabè chak mwa %"))+'<input id="estimateMonthlyDiscount" type="number" min="0" max="100" step="0.5" value="'+escapeHtml(rules.monthly_discount_percent)+'"></label>'+
          '</div>'+
          '<label class="estimate-toggle"><span><strong>'+escapeHtml(t("Show price breakdown","Mostrar desglose","Afficher le détail","Montre detay pri"))+'</strong><small>'+escapeHtml(t("Helpful when reviewing how the estimate was built.","Útil para revisar cómo se calculó el estimado.","Utile pour vérifier le calcul.","Sa ede w wè kijan estimasyon an fèt."))+'</small></span><input id="estimateShowBreakdown" type="checkbox" '+(rules.show_breakdown!==false?"checked":"")+'></label>'+
          '<div class="estimate-rules-actions">'+
            (canEditRules?'<button class="primary-btn" type="button" id="saveEstimateRules" data-save-estimate>'+escapeHtml(t("Save pricing rules","Guardar reglas de precio","Enregistrer les règles","Sove règ pri yo"))+'</button>':'<span class="estimate-owner-note">'+escapeHtml(t("Owner only: pricing rules are read-only for Admins.","Solo Owner: las reglas de precio son de solo lectura para Admins.","Owner uniquement : les règles sont en lecture seule pour les Admins.","Owner sèlman: Admin ka li règ pri yo sèlman."))+'</span>')+
          '</div>'+
        '</div>'+
      '</details>';

    if(!canEditRules){
      mount.querySelectorAll(".estimate-rules input").forEach(input=>input.disabled=true);
    }

    if(firstPriced){
      const serviceSelect=mount.querySelector("#estimateService");
      if(serviceSelect) serviceSelect.value=firstPriced.id;
    }
    mount.querySelectorAll('.estimate-rule-grid input[type="number"]').forEach(input=>{
      input.inputMode=input.step==="1" || input.step==="50" ? "numeric" : "decimal";
    });
    setSaveState("saved");
    renderAddonChoices();
    syncPropertyMode();
    updateEstimate();
  }

  function renderAddonChoices(){
    const mount=document.getElementById("estimateCalculatorMount");
    if(!mount) return;
    const wrap=mount.querySelector("#estimateAddons");
    const serviceId=mount.querySelector("#estimateService")?.value||"";
    if(!wrap) return;
    const selected=new Set(Array.from(wrap.querySelectorAll("input:checked")).map(input=>input.value));
    const addons=relevantAddons(serviceId);
    if(!addons.length){
      wrap.innerHTML='<div class="estimate-empty">'+escapeHtml(t("No active add-ons for this service.","No hay extras activos para este servicio.","Aucune option active pour ce service.","Pa gen sipleman aktif pou sèvis sa."))+'</div>';
      return;
    }
    wrap.innerHTML=addons.map(addon=>
      '<label class="estimate-addon-choice"><input type="checkbox" value="'+escapeHtml(addon.id)+'" '+(selected.has(addon.id)?"checked":"")+'>'+
      '<span><strong>'+escapeHtml(addon.name||"Add-on")+'</strong><small>+'+escapeHtml(money(addon.price))+'</small></span></label>'
    ).join("");
  }

  function propertyType(){
    return document.querySelector('#estimateCalculatorMount input[name="estimate_property_type"]:checked')?.value||"residential";
  }

  function readRules(){
    const mount=document.getElementById("estimateCalculatorMount");
    if(!mount) return settingsFromState();
    return {
      enabled:Boolean(mount.querySelector("#estimateEnabled")?.checked),
      included_bedrooms:Math.max(0,num(mount.querySelector("#estimateIncludedBedrooms")?.value)),
      included_bathrooms:Math.max(0,num(mount.querySelector("#estimateIncludedBathrooms")?.value)),
      included_sqft:Math.max(0,num(mount.querySelector("#estimateIncludedSqft")?.value)),
      extra_bedroom_price:Math.max(0,num(mount.querySelector("#estimateExtraBedroomPrice")?.value)),
      extra_bathroom_price:Math.max(0,num(mount.querySelector("#estimateExtraBathroomPrice")?.value)),
      sqft_step:Math.max(1,num(mount.querySelector("#estimateSqftStep")?.value,500)),
      sqft_step_price:Math.max(0,num(mount.querySelector("#estimateSqftStepPrice")?.value)),
      weekly_discount_percent:clamp(num(mount.querySelector("#estimateWeeklyDiscount")?.value),0,100),
      biweekly_discount_percent:clamp(num(mount.querySelector("#estimateBiweeklyDiscount")?.value),0,100),
      monthly_discount_percent:clamp(num(mount.querySelector("#estimateMonthlyDiscount")?.value),0,100),
      minimum_total:Math.max(0,num(mount.querySelector("#estimateMinimumTotal")?.value)),
      show_breakdown:Boolean(mount.querySelector("#estimateShowBreakdown")?.checked)
    };
  }

  function frequencyDiscount(rules,frequency){
    if(frequency==="weekly") return num(rules.weekly_discount_percent);
    if(frequency==="biweekly") return num(rules.biweekly_discount_percent);
    if(frequency==="monthly") return num(rules.monthly_discount_percent);
    return 0;
  }

  function calculate(){
    const mount=document.getElementById("estimateCalculatorMount");
    if(!mount) return null;
    const serviceId=mount.querySelector("#estimateService")?.value||"";
    const service=activeServices().find(item=>item.id===serviceId);
    const type=propertyType();
    if(type==="commercial" || (service && !serviceIsPriced(service))){
      return {customQuote:true,service};
    }
    if(!service) return {empty:true};

    const rules=readRules();
    const bedrooms=Math.max(0,num(mount.querySelector("#estimateBedrooms")?.value));
    const bathrooms=Math.max(0,num(mount.querySelector("#estimateBathrooms")?.value));
    const sqft=Math.max(0,num(mount.querySelector("#estimateSqft")?.value));
    const frequency=mount.querySelector("#estimateFrequency")?.value||"one_time";
    const addonIds=Array.from(mount.querySelectorAll("#estimateAddons input:checked")).map(input=>input.value);
    const addons=relevantAddons(serviceId).filter(addon=>addonIds.includes(addon.id));

    const base=num(service.base_price);
    const bedroomCharge=Math.max(0,bedrooms-num(rules.included_bedrooms))*num(rules.extra_bedroom_price);
    const bathroomCharge=Math.max(0,bathrooms-num(rules.included_bathrooms))*num(rules.extra_bathroom_price);
    const extraSqft=Math.max(0,sqft-num(rules.included_sqft));
    const sqftSteps=extraSqft>0?Math.ceil(extraSqft/Math.max(1,num(rules.sqft_step,500))):0;
    const sqftCharge=sqftSteps*num(rules.sqft_step_price);
    const addonsCharge=addons.reduce((sum,addon)=>sum+num(addon.price),0);
    const subtotal=base+bedroomCharge+bathroomCharge+sqftCharge+addonsCharge;
    const discountPercent=frequencyDiscount(rules,frequency);
    const discountAmount=subtotal*(discountPercent/100);
    const discounted=Math.max(0,subtotal-discountAmount);
    const total=Math.max(discounted,num(rules.minimum_total));
    const minimumAdjustment=Math.max(0,total-discounted);

    return {
      customQuote:false,
      service,
      rules,
      bedrooms,
      bathrooms,
      sqft,
      frequency,
      addons,
      base,
      bedroomCharge,
      bathroomCharge,
      sqftSteps,
      sqftCharge,
      addonsCharge,
      subtotal,
      discountPercent,
      discountAmount,
      minimumAdjustment,
      total
    };
  }

  function breakdownRows(calc){
    const rows=[];
    rows.push([calc.service?.name||t("Service","Servicio","Service","Sèvis"),calc.base]);
    if(calc.bedroomCharge>0) rows.push([t("Extra bedrooms","Habitaciones extra","Chambres en plus","Chanm anplis"),calc.bedroomCharge]);
    if(calc.bathroomCharge>0) rows.push([t("Extra bathrooms","Baños extra","Salles de bain en plus","Twalèt anplis"),calc.bathroomCharge]);
    if(calc.sqftCharge>0) rows.push([t("Square footage","Pies cuadrados","Superficie","Pye kare"),calc.sqftCharge]);
    calc.addons.forEach(addon=>rows.push([addon.name||t("Add-on","Extra","Option","Sipleman"),num(addon.price)]));
    if(calc.discountAmount>0) rows.push([t("Frequency discount","Descuento por frecuencia","Remise fréquence","Rabè frekans"),-calc.discountAmount]);
    if(calc.minimumAdjustment>0) rows.push([t("Minimum estimate adjustment","Ajuste al mínimo","Ajustement minimum","Ajisteman minimòm"),calc.minimumAdjustment]);
    return rows.map(([label,value])=>
      '<div class="estimate-breakdown-row"><span>'+escapeHtml(label)+'</span><strong>'+(value<0?"−":"")+escapeHtml(money(Math.abs(value)))+'</strong></div>'
    ).join("");
  }

  function updateEstimate(){
    const mount=document.getElementById("estimateCalculatorMount");
    const summary=mount?.querySelector("#estimateSummary");
    if(!summary) return;
    const calc=calculate();
    if(!calc || calc.empty){
      summary.innerHTML='<div class="estimate-result-empty"><strong>'+escapeHtml(t("Choose a service","Elige un servicio","Choisissez un service","Chwazi yon sèvis"))+'</strong><span>'+escapeHtml(t("Your estimate will appear here.","Tu estimado aparecerá aquí.","Votre estimation apparaîtra ici.","Estimasyon an ap parèt isit."))+'</span></div>';
      return;
    }
    if(calc.customQuote){
      summary.innerHTML=
        '<span class="estimate-result-kicker">'+escapeHtml(t("RESULT","RESULTADO","RÉSULTAT","REZILTA"))+'</span>'+
        '<div class="estimate-custom-quote-mark">↗</div>'+
        '<h4>'+escapeHtml(t("Custom quote","Cotización personalizada","Devis personnalisé","Estimasyon pèsonalize"))+'</h4>'+
        '<p>'+escapeHtml(t("Commercial work and services without a fixed price stay in Quotes for review.","El trabajo comercial y los servicios sin precio fijo se revisan en Quotes.","Le commercial et les services sans prix fixe restent dans Quotes pour révision.","Travay komèsyal ak sèvis san pri fiks rete nan Quotes pou revizyon."))+'</p>'+
        '<span class="estimate-result-note">'+escapeHtml(t("No automatic total is shown.","No se muestra un total automático.","Aucun total automatique n’est affiché.","Pa gen total otomatik ki parèt."))+'</span>';
      return;
    }

    const status=calc.rules.enabled
      ?t("Rules active","Reglas activas","Règles actives","Règ aktif")
      :t("Preview only — rules are paused","Solo vista previa — reglas pausadas","Aperçu seulement — règles en pause","Se aperçu sèlman — règ yo kanpe");

    summary.innerHTML=
      '<span class="estimate-result-kicker">'+escapeHtml(t("ESTIMATED TOTAL","TOTAL ESTIMADO","TOTAL ESTIMÉ","TOTAL ESTIME"))+'</span>'+
      '<strong class="estimate-total">'+escapeHtml(money(calc.total))+'</strong>'+
      '<span class="estimate-result-status">'+escapeHtml(status)+'</span>'+
      (calc.rules.show_breakdown!==false?'<div class="estimate-breakdown">'+breakdownRows(calc)+'</div>':"")+
      '<p class="estimate-result-note">'+escapeHtml(t("Estimate only. It does not create, send or approve a quote.","Solo es un estimado. No crea, envía ni aprueba una cotización.","Estimation uniquement. Elle ne crée, n’envoie ni n’approuve un devis.","Se estimasyon sèlman. Li pa kreye, voye oswa apwouve yon quote."))+'</p>';
  }

  function syncPropertyMode(){
    const mount=document.getElementById("estimateCalculatorMount");
    if(!mount) return;
    const commercial=propertyType()==="commercial";
    ["#estimateBedrooms","#estimateBathrooms","#estimateSqft","#estimateFrequency"].forEach(selector=>{
      const input=mount.querySelector(selector);
      if(input) input.disabled=commercial;
    });
    mount.querySelector(".estimate-builder")?.classList.toggle("is-commercial",commercial);
  }

  function syncStatus(){
    const mount=document.getElementById("estimateCalculatorMount");
    const status=mount?.querySelector(".estimate-live-status");
    const enabled=Boolean(mount?.querySelector("#estimateEnabled")?.checked);
    if(!status) return;
    status.dataset.enabled=String(enabled);
    status.textContent=enabled
      ?t("Live estimates ON","Estimados activos","Estimations activées","Estimasyon aktive")
      :t("Live estimates OFF","Estimados pausados","Estimations désactivées","Estimasyon kanpe");
  }

  function setSaveState(status){
    const mount=document.getElementById("estimateCalculatorMount");
    if(!mount) return;
    mount.dataset.saveState=status;
    const labels={
      saved:t("Saved", "Guardado", "Enregistré", "Sove"),
      dirty:t("Unsaved changes", "Cambios sin guardar", "Modifications non enregistrées", "Chanjman poko sove"),
      saving:t("Saving…", "Guardando…", "Enregistrement…", "Ap sove…"),
      error:t("Not saved. Try again.", "No se guardó. Intenta otra vez.", "Non enregistré. Réessayez.", "Pa sove. Eseye ankò.")
    };
    mount.querySelectorAll(".estimate-save-status").forEach(node=>{
      node.textContent=labels[status];
      node.dataset.state=status;
    });
    mount.querySelectorAll("[data-save-estimate]").forEach(button=>{
      button.disabled=status==="saving";
    });
  }

  async function saveRules(){
    if(saving) return;
    const state=appState();
    const business=state.business;
    if(!business?.id || String(business.role||"")!=="owner"){
      bridge?.showToast?.(t("Owner access required to change pricing rules.","Se requiere acceso de Owner para cambiar las reglas de precio.","Accès Owner requis pour modifier les règles de tarification.","Fòk ou Owner pou chanje règ pri yo."));
      return;
    }
    const mount=document.getElementById("estimateCalculatorMount");
    const inputs=Array.from(mount.querySelectorAll('.estimate-rules input'));
    const invalid=inputs.find(input=>input.type==="number" && (input.value.trim()==="" || !input.checkValidity()));
    if(invalid){
      setSaveState("dirty");
      invalid.focus();
      invalid.reportValidity();
      bridge?.showToast?.(t("Check the highlighted number before saving.","Revisa el número marcado antes de guardar.","Vérifiez le nombre indiqué avant d’enregistrer.","Verifye nimewo ki make a anvan ou sove."));
      return;
    }
    const payload=readRules();
    saving=true;
    setSaveState("saving");
    inputs.forEach(input=>input.disabled=true);
    try{
      const {data,error}=await bridge.supabase
        .from("businesses")
        .update({estimate_settings:payload,updated_at:new Date().toISOString()})
        .eq("id",business.id)
        .select("id,estimate_settings")
        .single();
      if(error) throw error;
      if(!data || data.id!==business.id || !data.estimate_settings ||
        Object.keys(payload).some(key=>data.estimate_settings[key]!==payload[key])){
        throw new Error(t("Could not confirm saved rules. Please try again.","No se pudo confirmar el guardado. Intenta otra vez.","Enregistrement non confirmé. Réessayez.","Nou pa ka konfime règ yo sove. Eseye ankò."));
      }
      business.estimate_settings=data.estimate_settings;
      if(appState().business?.id===business.id) appState().business.estimate_settings=data.estimate_settings;
      inputs.filter(input=>input.type==="number").forEach(input=>input.value=String(Number(input.value)));
      setSaveState("saved");
      syncStatus();
      updateEstimate();
      bridge?.showToast?.(t("Estimate rules saved","Reglas de estimado guardadas","Règles enregistrées","Règ estimasyon yo sove"));
    }catch(error){
      console.warn("[TLE] estimate rules",error);
      setSaveState("error");
      bridge?.showToast?.(error?.message||t("Could not save estimate rules","No se pudieron guardar las reglas","Impossible d’enregistrer les règles","Pa t ka sove règ yo"));
    }finally{
      saving=false;
      inputs.forEach(input=>input.disabled=false);
    }
  }

  function handleInput(event){
    const mount=document.getElementById("estimateCalculatorMount");
    if(!mount || !event.target || !mount.contains(event.target)) return;
    if(event.target.closest(".estimate-rules") && !saving) setSaveState("dirty");
    if(event.target.id==="estimateService") renderAddonChoices();
    if(event.target.name==="estimate_property_type") syncPropertyMode();
    if(event.target.id==="estimateEnabled") syncStatus();
    updateEstimate();
  }

  function bind(){
    if(bound) return;
    bound=true;
    document.addEventListener("input",handleInput);
    document.addEventListener("change",handleInput);
    document.addEventListener("click",event=>{
      const save=event.target.closest?.("[data-save-estimate]");
      if(save){
        event.preventDefault();
        saveRules(save);
        return;
      }
      if(event.target.closest?.("#languageBtn,#sidebarLanguageBtn,[data-language-toggle]")){
        setTimeout(render,40);
      }
    });
  }

  function init(nextBridge){
    bridge=nextBridge||bridge;
    bind();
    render();
  }

  window.TLE_ESTIMATE={init,render,update:updateEstimate};
})();
(()=>{
"use strict";

const DEFAULTS=Object.freeze({
  enabled:true,
  show_breakdown:true,
  included_bedrooms:2,
  extra_bedroom_price:0,
  included_bathrooms:1,
  extra_bathroom_price:0,
  included_sqft:0,
  sqft_step:500,
  sqft_step_price:0,
  weekly_discount_percent:0,
  biweekly_discount_percent:0,
  monthly_discount_percent:0,
  minimum_total:0
});

function ruleNumber(value,fallback=0,min=0,max=1000000){
  const n=Number(value);
  if(!Number.isFinite(n)) return fallback;
  return Math.max(min,Math.min(max,n));
}

function create(ctx){
  const {
    state,supabase,$,money,escapeHtml,langPick,modalHeader,formSubmit,
    showToast,modal,entityForm,serviceIsPaid
  }=ctx;

  let bound=false;

  function rules(){
    const saved=state.business?.estimate_settings;
    const raw=saved&&typeof saved==="object"&&!Array.isArray(saved)?saved:{};
    return {
      ...DEFAULTS,
      ...raw,
      enabled:raw.enabled!==false,
      show_breakdown:raw.show_breakdown!==false,
      included_bedrooms:ruleNumber(raw.included_bedrooms,2,0,30),
      extra_bedroom_price:ruleNumber(raw.extra_bedroom_price,0,0,10000),
      included_bathrooms:ruleNumber(raw.included_bathrooms,1,0,30),
      extra_bathroom_price:ruleNumber(raw.extra_bathroom_price,0,0,10000),
      included_sqft:ruleNumber(raw.included_sqft,0,0,1000000),
      sqft_step:ruleNumber(raw.sqft_step,500,1,1000000),
      sqft_step_price:ruleNumber(raw.sqft_step_price,0,0,100000),
      weekly_discount_percent:ruleNumber(raw.weekly_discount_percent,0,0,100),
      biweekly_discount_percent:ruleNumber(raw.biweekly_discount_percent,0,0,100),
      monthly_discount_percent:ruleNumber(raw.monthly_discount_percent,0,0,100),
      minimum_total:ruleNumber(raw.minimum_total,0,0,1000000)
    };
  }

  function recurringPercent(r,frequency){
    return frequency==="weekly"?r.weekly_discount_percent
      :frequency==="biweekly"?r.biweekly_discount_percent
      :frequency==="monthly"?r.monthly_discount_percent
      :0;
  }

  function calculate({
    serviceBase=0,
    addonsTotal=0,
    bedrooms=0,
    bathrooms=0,
    propertySize=0,
    propertySizeUnit="sqft",
    frequency="one_time",
    settings=rules()
  }={}){
    const base=Math.max(0,Number(serviceBase)||0);
    const addons=Math.max(0,Number(addonsTotal)||0);
    const enabled=settings.enabled!==false;
    const beds=Math.max(0,Number(bedrooms)||0);
    const baths=Math.max(0,Number(bathrooms)||0);
    const size=Math.max(0,Number(propertySize)||0);
    const sqft=String(propertySizeUnit||"sqft").toLowerCase()==="sqm"?size*10.7639:size;

    const bedroomAdjustment=enabled
      ? Math.max(0,beds-settings.included_bedrooms)*settings.extra_bedroom_price
      :0;
    const bathroomAdjustment=enabled
      ? Math.max(0,baths-settings.included_bathrooms)*settings.extra_bathroom_price
      :0;
    const sqftAdjustment=enabled&&sqft>0&&settings.sqft_step>0
      ? Math.ceil(Math.max(0,sqft-settings.included_sqft)/settings.sqft_step)*settings.sqft_step_price
      :0;
    const serviceSubtotal=Math.max(0,base+bedroomAdjustment+bathroomAdjustment+sqftAdjustment);
    const frequencyPercent=enabled?recurringPercent(settings,frequency):0;
    const recurringDiscount=Math.round(serviceSubtotal*(frequencyPercent/100)*100)/100;
    let serviceFinal=Math.max(0,serviceSubtotal-recurringDiscount);
    let total=Math.round((serviceFinal+addons)*100)/100;
    let minimumAdjustment=0;
    if(enabled&&settings.minimum_total>0&&total<settings.minimum_total){
      minimumAdjustment=settings.minimum_total-total;
      serviceFinal+=minimumAdjustment;
      total=settings.minimum_total;
    }
    return {
      base,addons,bedroomAdjustment,bathroomAdjustment,sqftAdjustment,serviceSubtotal,
      recurringPercent:frequencyPercent,recurringDiscount,minimumAdjustment,
      serviceFinal:Math.round(serviceFinal*100)/100,total:Math.round(total*100)/100
    };
  }

  function render(){
    const summary=$("#bookingEstimateRulesSummary");
    const status=$("#bookingEstimateStatus");
    if(!summary||!status) return;
    const r=rules();
    status.textContent=r.enabled
      ? langPick("Live on Booking Page","Activo en Booking Page","Actif sur la page de réservation")
      : langPick("Paused","Pausado","En pause");
    status.classList.toggle("neutral",!r.enabled);

    const chips=[];
    if(r.extra_bedroom_price>0) chips.push("+"+money(r.extra_bedroom_price)+" / extra bedroom");
    if(r.extra_bathroom_price>0) chips.push("+"+money(r.extra_bathroom_price)+" / extra bathroom");
    if(r.sqft_step_price>0) chips.push("+"+money(r.sqft_step_price)+" / "+Number(r.sqft_step).toLocaleString()+" sq ft");
    if(r.weekly_discount_percent>0) chips.push("Weekly −"+r.weekly_discount_percent+"%");
    if(r.biweekly_discount_percent>0) chips.push("Biweekly −"+r.biweekly_discount_percent+"%");
    if(r.monthly_discount_percent>0) chips.push("Monthly −"+r.monthly_discount_percent+"%");
    if(r.minimum_total>0) chips.push("Minimum "+money(r.minimum_total));

    summary.innerHTML=chips.length
      ? '<div class="booking-estimator-chips">'+chips.map(item=>'<span>'+escapeHtml(item)+'</span>').join("")+'</div>'+
        '<small>'+escapeHtml(langPick("Base service + add-ons + the rules above.","Servicio base + add-ons + las reglas de arriba.","Service de base + options + règles ci-dessus."))+'</small>'
      : '<div class="booking-estimator-empty"><strong>'+escapeHtml(langPick("Base price + add-ons for now.","Precio base + add-ons por ahora.","Prix de base + options pour le moment."))+'</strong><span>'+escapeHtml(langPick("Set adjustments only if your business uses them.","Configura ajustes solo si tu negocio los usa.","Ajoutez des ajustements seulement si votre entreprise les utilise."))+'</span></div>';
  }

  function openRules(){
    if(!state.business||!["owner","admin"].includes(String(state.business.role||""))){
      showToast(langPick("Owner or Admin access required.","Se requiere acceso de Owner o Admin.","Accès Owner ou Admin requis."));
      return;
    }
    const r=rules();
    state.modalType="estimateRules";
    state.modalId=null;
    modalHeader(
      "ESTIMATE CALCULATOR",
      langPick("Pricing rules","Reglas de precio","Règles de tarification"),
      langPick("These rules power instant residential estimates on your Booking Page.","Estas reglas calculan los estimados residenciales instantáneos de tu Booking Page.","Ces règles calculent les estimations résidentielles instantanées.")
    );
    entityForm.innerHTML=`
      <div class="form-grid estimate-rules-form">
        <label class="full client-change-toggle"><span><strong>Use instant estimate rules</strong><small>When off, Booking Page pricing stays at service base price + add-ons.</small></span><input name="enabled" type="checkbox" ${r.enabled?"checked":""}></label>
        <div class="full estimate-rule-group"><strong>Bedrooms</strong><small>Start charging extra only after the included amount.</small></div>
        <label>Bedrooms included<input name="included_bedrooms" type="number" min="0" max="30" step="1" value="${r.included_bedrooms}"></label>
        <label>Each extra bedroom<input name="extra_bedroom_price" type="number" min="0" step="0.01" value="${r.extra_bedroom_price}"></label>
        <div class="full estimate-rule-group"><strong>Bathrooms</strong><small>Half bathrooms can be entered as 0.5.</small></div>
        <label>Bathrooms included<input name="included_bathrooms" type="number" min="0" max="30" step="0.5" value="${r.included_bathrooms}"></label>
        <label>Each extra bathroom<input name="extra_bathroom_price" type="number" min="0" step="0.01" value="${r.extra_bathroom_price}"></label>
        <div class="full estimate-rule-group"><strong>Property size</strong><small>Optional. Leave the added price at 0 if you do not price by square footage.</small></div>
        <label>Sq ft included<input name="included_sqft" type="number" min="0" step="100" value="${r.included_sqft}"></label>
        <label>Charge every<input name="sqft_step" type="number" min="1" step="50" value="${r.sqft_step}"></label>
        <label>Price per size step<input name="sqft_step_price" type="number" min="0" step="0.01" value="${r.sqft_step_price}"></label>
        <label>Minimum estimate<input name="minimum_total" type="number" min="0" step="0.01" value="${r.minimum_total}"></label>
        <div class="full estimate-rule-group"><strong>Recurring savings</strong><small>Applied to the calculated service price. Add-ons keep their full price.</small></div>
        <label>Weekly % off<input name="weekly_discount_percent" type="number" min="0" max="100" step="0.5" value="${r.weekly_discount_percent}"></label>
        <label>Biweekly % off<input name="biweekly_discount_percent" type="number" min="0" max="100" step="0.5" value="${r.biweekly_discount_percent}"></label>
        <label>Monthly % off<input name="monthly_discount_percent" type="number" min="0" max="100" step="0.5" value="${r.monthly_discount_percent}"></label>
        <label class="client-change-toggle"><span><strong>Show estimate breakdown</strong><small>Show property adjustments and recurring savings in the client summary.</small></span><input name="show_breakdown" type="checkbox" ${r.show_breakdown?"checked":""}></label>
      </div>
      ${formSubmit(langPick("Save pricing rules","Guardar reglas","Enregistrer les règles"))}`;
    modal.hidden=false;
  }

  async function saveRules(fd){
    if(!state.business||!["owner","admin"].includes(String(state.business.role||""))){
      throw new Error(langPick("Owner or Admin access required.","Se requiere acceso de Owner o Admin.","Accès Owner ou Admin requis."));
    }
    const next={
      enabled:fd.get("enabled")==="on",
      show_breakdown:fd.get("show_breakdown")==="on",
      included_bedrooms:ruleNumber(fd.get("included_bedrooms"),2,0,30),
      extra_bedroom_price:ruleNumber(fd.get("extra_bedroom_price"),0,0,10000),
      included_bathrooms:ruleNumber(fd.get("included_bathrooms"),1,0,30),
      extra_bathroom_price:ruleNumber(fd.get("extra_bathroom_price"),0,0,10000),
      included_sqft:ruleNumber(fd.get("included_sqft"),0,0,1000000),
      sqft_step:ruleNumber(fd.get("sqft_step"),500,1,1000000),
      sqft_step_price:ruleNumber(fd.get("sqft_step_price"),0,0,100000),
      weekly_discount_percent:ruleNumber(fd.get("weekly_discount_percent"),0,0,100),
      biweekly_discount_percent:ruleNumber(fd.get("biweekly_discount_percent"),0,0,100),
      monthly_discount_percent:ruleNumber(fd.get("monthly_discount_percent"),0,0,100),
      minimum_total:ruleNumber(fd.get("minimum_total"),0,0,1000000)
    };
    const {data,error}=await supabase.from("businesses")
      .update({estimate_settings:next,updated_at:new Date().toISOString()})
      .eq("id",state.business.id)
      .select("estimate_settings")
      .single();
    if(error) throw error;
    state.business.estimate_settings=data?.estimate_settings||next;
    render();
  }

  function openCalculator(){
    const paid=state.services.filter(s=>s.active&&serviceIsPaid(s));
    state.modalType="estimateCalculator";
    state.modalId=null;
    modalHeader(
      "ESTIMATE CALCULATOR",
      langPick("Calculate an estimate","Calcular un estimado","Calculer une estimation"),
      langPick("Use the same residential pricing rules as your public Booking Page.","Usa las mismas reglas residenciales de tu Booking Page.","Utilisez les mêmes règles résidentielles que votre page de réservation.")
    );
    if(!paid.length){
      entityForm.innerHTML='<div class="empty-inline"><strong>No priced services yet.</strong><span>Add a flat-price service first, then calculate an estimate here.</span></div><div class="form-footer"><button type="button" class="primary-btn" data-modal-cancel>Close</button></div>';
      modal.hidden=false;
      return;
    }
    const unit=["US","CA","GB"].includes(String(state.business?.country_code||"US").toUpperCase())?"sqft":"sqm";
    entityForm.innerHTML=`
      <div class="estimate-calculator" data-estimate-calculator>
        <div class="form-grid">
          <label class="full">Service<select id="estimateCalcService">${paid.map(s=>'<option value="'+s.id+'">'+escapeHtml(s.name)+' · '+money(s.base_price)+'</option>').join("")}</select></label>
          <label>Bedrooms<input id="estimateCalcBedrooms" type="number" min="0" max="30" step="1" value="3"></label>
          <label>Bathrooms<input id="estimateCalcBathrooms" type="number" min="0" max="30" step="0.5" value="2"></label>
          <label>Property size<input id="estimateCalcSize" type="number" min="0" step="50" value="${unit==="sqft"?1800:170}"></label>
          <label>Size unit<select id="estimateCalcUnit"><option value="sqft" ${unit==="sqft"?"selected":""}>sq ft</option><option value="sqm" ${unit==="sqm"?"selected":""}>m²</option></select></label>
          <label class="full">Frequency<select id="estimateCalcFrequency"><option value="one_time">One time</option><option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="monthly">Monthly</option></select></label>
        </div>
        <div class="estimate-calculator-addons">
          <span class="field-label">Add-ons</span>
          <div class="estimate-calculator-addon-grid">
            ${state.serviceAddons.filter(a=>a.active).map(a=>'<label data-estimate-addon-row data-service-id="'+escapeHtml(a.service_id||"")+'"><input type="checkbox" data-estimate-addon value="'+a.id+'"><span><strong>'+escapeHtml(a.name)+'</strong><small>+'+money(a.price)+'</small></span></label>').join("")||'<span class="muted-line">No active add-ons.</span>'}
          </div>
        </div>
        <div class="estimate-calculator-result" id="estimateCalculatorResult" aria-live="polite"></div>
        <div class="form-footer"><button type="button" class="primary-btn" data-modal-cancel>Close</button></div>
      </div>`;
    modal.hidden=false;
    updateCalculator();
  }

  function updateCalculator(){
    const root=entityForm?.querySelector("[data-estimate-calculator]");
    if(!root) return;
    const serviceId=$("#estimateCalcService")?.value;
    const service=state.services.find(s=>s.id===serviceId);
    if(!service) return;

    let addonsTotal=0;
    root.querySelectorAll("[data-estimate-addon-row]").forEach(row=>{
      const scoped=row.dataset.serviceId;
      const allowed=!scoped||scoped===serviceId;
      row.hidden=!allowed;
      const box=row.querySelector("[data-estimate-addon]");
      if(!allowed&&box) box.checked=false;
      if(allowed&&box?.checked){
        const addon=state.serviceAddons.find(a=>a.id===box.value);
        addonsTotal+=Number(addon?.price||0);
      }
    });

    const estimate=calculate({
      serviceBase:Number(service.base_price||0),
      addonsTotal,
      bedrooms:Number($("#estimateCalcBedrooms")?.value||0),
      bathrooms:Number($("#estimateCalcBathrooms")?.value||0),
      propertySize:Number($("#estimateCalcSize")?.value||0),
      propertySizeUnit:$("#estimateCalcUnit")?.value||"sqft",
      frequency:$("#estimateCalcFrequency")?.value||"one_time"
    });
    const r=rules();
    const result=$("#estimateCalculatorResult");
    if(!result) return;
    const adjustment=estimate.bedroomAdjustment+estimate.bathroomAdjustment+estimate.sqftAdjustment;
    result.innerHTML=
      '<div class="estimate-result-head"><span>Estimated total</span><strong>'+escapeHtml(money(estimate.total))+'</strong></div>'+
      '<div class="estimate-result-row"><span>'+escapeHtml(service.name)+'</span><b>'+escapeHtml(money(estimate.base))+'</b></div>'+
      (adjustment>0?'<div class="estimate-result-row"><span>Property adjustments</span><b>+'+escapeHtml(money(adjustment))+'</b></div>':"")+
      (estimate.recurringDiscount>0?'<div class="estimate-result-row saving"><span>Recurring savings · '+escapeHtml(String(estimate.recurringPercent))+'%</span><b>−'+escapeHtml(money(estimate.recurringDiscount))+'</b></div>':"")+
      (estimate.addons>0?'<div class="estimate-result-row"><span>Add-ons</span><b>+'+escapeHtml(money(estimate.addons))+'</b></div>':"")+
      (estimate.minimumAdjustment>0?'<div class="estimate-result-row"><span>Minimum estimate</span><b>'+escapeHtml(money(r.minimum_total))+'</b></div>':"")+
      '<p>Estimate only. The owner can still review the job before confirming.</p>';
  }

  function bind(){
    if(bound) return;
    bound=true;
    $("#editEstimateRulesBtn")?.addEventListener("click",openRules);
    $("#openEstimateCalculatorBtn")?.addEventListener("click",openCalculator);
    document.addEventListener("input",event=>{
      if(event.target?.closest?.("[data-estimate-calculator]")) updateCalculator();
    });
    document.addEventListener("change",event=>{
      if(event.target?.closest?.("[data-estimate-calculator]")) updateCalculator();
    });
  }

  bind();
  return {render,openRules,openCalculator,saveRules,updateCalculator,rules,calculate};
}

window.TLE_BOOKING_ESTIMATOR={create,DEFAULTS};
})();
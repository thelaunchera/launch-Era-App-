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

function number(value,fallback=0,min=0,max=1000000){
  const n=Number(value);
  if(!Number.isFinite(n)) return fallback;
  return Math.max(min,Math.min(max,n));
}

function normalizeSettings(raw){
  const source=raw&&typeof raw==="object"&&!Array.isArray(raw)?raw:{};
  return {
    ...DEFAULTS,
    ...source,
    enabled:source.enabled!==false,
    show_breakdown:source.show_breakdown!==false,
    included_bedrooms:number(source.included_bedrooms,2,0,30),
    extra_bedroom_price:number(source.extra_bedroom_price,0,0,10000),
    included_bathrooms:number(source.included_bathrooms,1,0,30),
    extra_bathroom_price:number(source.extra_bathroom_price,0,0,10000),
    included_sqft:number(source.included_sqft,0,0,1000000),
    sqft_step:number(source.sqft_step,500,1,1000000),
    sqft_step_price:number(source.sqft_step_price,0,0,100000),
    weekly_discount_percent:number(source.weekly_discount_percent,0,0,100),
    biweekly_discount_percent:number(source.biweekly_discount_percent,0,0,100),
    monthly_discount_percent:number(source.monthly_discount_percent,0,0,100),
    minimum_total:number(source.minimum_total,0,0,1000000)
  };
}

function frequencyPercent(settings,frequency){
  return frequency==="weekly"?settings.weekly_discount_percent
    :frequency==="biweekly"?settings.biweekly_discount_percent
    :frequency==="monthly"?settings.monthly_discount_percent
    :0;
}

function calculate({
  settings,
  serviceBase=0,
  addonsTotal=0,
  propertyType="residential",
  mode="book",
  bedrooms=0,
  bathrooms=0,
  propertySize=0,
  propertySizeUnit="sqft",
  frequency="one_time"
}={}){
  const s=normalizeSettings(settings);
  const base=Math.max(0,Number(serviceBase)||0);
  const addons=Math.max(0,Number(addonsTotal)||0);
  const enabled=s.enabled&&propertyType==="residential"&&mode==="book";
  const beds=Math.max(0,Number(bedrooms)||0);
  const baths=Math.max(0,Number(bathrooms)||0);
  const size=Math.max(0,Number(propertySize)||0);
  const sqft=String(propertySizeUnit||"sqft").toLowerCase()==="sqm"?size*10.7639:size;

  const bedroomAdjustment=enabled?Math.max(0,beds-s.included_bedrooms)*s.extra_bedroom_price:0;
  const bathroomAdjustment=enabled?Math.max(0,baths-s.included_bathrooms)*s.extra_bathroom_price:0;
  const sqftAdjustment=enabled&&sqft>0&&s.sqft_step>0
    ? Math.ceil(Math.max(0,sqft-s.included_sqft)/s.sqft_step)*s.sqft_step_price
    :0;
  const propertyAdjustment=bedroomAdjustment+bathroomAdjustment+sqftAdjustment;
  const serviceSubtotal=base+propertyAdjustment;
  const recurringPercent=enabled?frequencyPercent(s,frequency):0;
  const recurringDiscount=Math.round(serviceSubtotal*(recurringPercent/100)*100)/100;
  let serviceFinal=Math.max(0,serviceSubtotal-recurringDiscount);
  let total=Math.round((serviceFinal+addons)*100)/100;
  let minimumAdjustment=0;
  if(enabled&&s.minimum_total>0&&total<s.minimum_total){
    minimumAdjustment=s.minimum_total-total;
    serviceFinal+=minimumAdjustment;
    total=s.minimum_total;
  }
  return {
    total,base,addonsTotal:addons,bedroomAdjustment,bathroomAdjustment,sqftAdjustment,
    propertyAdjustment,recurringDiscount,recurringPercent,minimumAdjustment,serviceFinal
  };
}

function renderFrequencyHints(container,settings){
  if(!container) return;
  const s=normalizeSettings(settings);
  container.querySelectorAll("[data-frequency]").forEach(btn=>{
    btn.querySelector(".estimate-frequency-saving")?.remove();
    const pct=frequencyPercent(s,btn.dataset.frequency);
    if(pct>0&&s.enabled){
      const small=document.createElement("small");
      small.className="estimate-frequency-saving";
      small.textContent="−"+pct+"%";
      btn.appendChild(small);
    }
  });
}

function createWizard(options){
  const {
    form,submit,summaryMicro,serviceSelect,slotInput,addWrap,discountWrap,recurrenceWrap,
    propertySizeInput,residentialDetails,commercialDetails,quoteTimeWrap,timeZoneNotice,
    slotsWrap,cleaningTypeSwitch,serviceHeading,t=value=>value
  }=options||{};
  let step=0;
  let steps=[];
  let initialized=false;
  let nav=null;

  function topGridChild(node,grid){
    let current=node;
    while(current&&current.parentElement!==grid) current=current.parentElement;
    return current&&current.parentElement===grid?current:null;
  }

  function valid(){
    if(step===0&&!String(serviceSelect?.value||"").trim()){
      alert(t("Choose a service."));
      return false;
    }
    const nodes=steps[step]||[];
    for(const node of nodes){
      for(const control of node.querySelectorAll("input,select,textarea")){
        if(control.disabled||!control.required) continue;
        if(!control.checkValidity()){
          control.reportValidity?.();
          return false;
        }
      }
    }
    if(step===3&&!String(slotInput?.value||"").trim()){
      alert(t("Choose an available time."));
      return false;
    }
    return true;
  }

  function setStep(next,{scroll=true}={}){
    if(!initialized) return;
    step=Math.max(0,Math.min(steps.length-1,next));
    const active=new Set(steps[step]||[]);
    steps.flat().forEach(node=>node?.classList.toggle("public-wizard-hidden",!active.has(node)));

    const stepper=form?.querySelector(".public-demo-stepper");
    stepper?.querySelectorAll("span").forEach((bar,index)=>{
      bar.classList.toggle("active",index<=step);
      bar.classList.toggle("current",index===step);
    });
    const label=document.querySelector("#publicWizardStepLabel");
    const names=[t("Service"),t("Property"),t("Extras"),t("Schedule"),t("Review")];
    if(label) label.textContent=t("Step")+" "+(step+1)+" / "+steps.length+" · "+names[step];
    const back=document.querySelector("#publicWizardBack");
    const nextBtn=document.querySelector("#publicWizardNext");
    if(back) back.hidden=step===0;
    if(nextBtn){
      nextBtn.hidden=step===steps.length-1;
      nextBtn.textContent=(step===steps.length-2?t("Continue to review"):t("Continue"))+" →";
    }
    if(submit) submit.hidden=step!==steps.length-1;
    if(summaryMicro) summaryMicro.hidden=step!==steps.length-1;
    if(scroll) form?.scrollIntoView({behavior:"smooth",block:"start"});
  }

  function init(){
    if(initialized||!form) return;
    const grid=form.querySelector(".form-grid");
    if(!grid) return;
    const children=[...grid.children];
    const heads=[...grid.querySelectorAll(":scope > .public-form-section-head")];
    const byName=name=>topGridChild(form.querySelector('[name="'+name+'"]'),grid);

    steps=[
      [topGridChild(cleaningTypeSwitch,grid),topGridChild(serviceHeading,grid)],
      [heads[0],topGridChild(propertySizeInput,grid),topGridChild(residentialDetails,grid),topGridChild(commercialDetails,grid),byName("cleaning_condition"),byName("last_professional_clean")],
      [topGridChild(addWrap,grid),topGridChild(discountWrap,grid),topGridChild(recurrenceWrap,grid)],
      [topGridChild(form.querySelector('[name="date"]'),grid),topGridChild(quoteTimeWrap,grid),topGridChild(timeZoneNotice,grid),topGridChild(slotsWrap,grid)],
      [byName("address"),byName("access_notes"),heads[1],byName("name"),byName("email"),byName("phone"),byName("preferred_contact"),byName("preferred_language"),byName("notes")]
    ].map(group=>group.filter(Boolean));

    const assigned=new Set(steps.flat());
    children.filter(node=>!assigned.has(node)).forEach(node=>steps[4].push(node));

    const stepper=form.querySelector(".public-demo-stepper");
    if(stepper){
      stepper.removeAttribute("aria-hidden");
      stepper.replaceChildren(...steps.map(()=>document.createElement("span")));
    }

    nav=document.createElement("div");
    nav.className="full public-wizard-nav";
    const label=document.createElement("span");
    label.id="publicWizardStepLabel";
    label.className="public-wizard-step-label";
    const actions=document.createElement("div");
    const back=document.createElement("button");
    back.type="button";
    back.className="public-wizard-back";
    back.id="publicWizardBack";
    back.textContent="← "+t("Back");
    const next=document.createElement("button");
    next.type="button";
    next.className="public-wizard-next";
    next.id="publicWizardNext";
    next.textContent=t("Continue")+" →";
    actions.append(back,next);
    nav.append(label,actions);
    grid.appendChild(nav);

    back.addEventListener("click",()=>setStep(step-1));
    next.addEventListener("click",()=>{
      if(!valid()) return;
      setStep(step+1);
    });

    initialized=true;
    setStep(0,{scroll:false});
  }

  function reset(){
    if(initialized) setStep(0,{scroll:false});
  }

  return {init,reset,setStep,get step(){return step;}};
}

window.TLE_PUBLIC_ESTIMATOR={
  DEFAULTS,normalizeSettings,frequencyPercent,calculate,renderFrequencyHints,createWizard
};
})();
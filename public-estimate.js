/* Shared public residential preview matching the pricing rules in Supabase v5. */
(()=>{
  window.TLE_PUBLIC_ESTIMATE_PRICE=function({service,addons=[],settings={},propertyType="residential",bedrooms=0,bathrooms=0,size=0,unit="sqft",frequency="one_time"}){
    if(!service)return 0;
    const number=x=>{const n=Number(x);return Number.isFinite(n)?n:0;};
    const positive=x=>Math.max(0,number(x));
    const active=String(settings.enabled??true)!=="false";
    let subtotal=positive(service.base_price),rate=0,discount=0;
    if(active&&propertyType==="residential"){
      subtotal+=Math.max(0,positive(bedrooms)-positive(settings.included_bedrooms))*positive(settings.extra_bedroom_price);
      subtotal+=Math.max(0,positive(bathrooms)-positive(settings.included_bathrooms))*positive(settings.extra_bathroom_price);
      const sqft=positive(size)*(unit==="sqm"?10.7639:1);
      const step=positive(settings.sqft_step);
      if(sqft>0&&step>0)subtotal+=Math.ceil(Math.max(0,sqft-positive(settings.included_sqft))/step)*positive(settings.sqft_step_price);
      rate=frequency==="weekly"?positive(settings.weekly_discount_percent):
        frequency==="biweekly"?positive(settings.biweekly_discount_percent):
        frequency==="monthly"?positive(settings.monthly_discount_percent):0;
      rate=Math.min(100,rate);
    }
    subtotal=Math.round(subtotal*100)/100;
    discount=Math.round(subtotal*rate)/100;
    let final=Math.max(0,subtotal-discount);
    final+=addons.reduce((a,item)=>a+positive(item.price),0);
    if(active&&propertyType==="residential")final=Math.max(final,positive(settings.minimum_total));
    return Math.round(final*100)/100;
  };
})();

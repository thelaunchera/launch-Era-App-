/* Lightweight customer-facing estimate preview; server rechecks in v5. */
(()=>{
  const num=(value,fallback=0)=>{const n=Number(value);return Number.isFinite(n)?n:fallback;};
  const round=value=>Math.round((num(value)+Number.EPSILON)*100)/100;
  window.TLE_PUBLIC_ESTIMATE={
    calculate({rules={},service,addons=[],propertyType="residential",bedrooms=0,bathrooms=0,
               propertySize=0,propertyUnit="sqft",frequency="one_time"}={}){
      if(!service)return 0;
      const setting=(key,fallback=0)=>Math.max(0,num(rules?.[key],fallback));
      let serviceCost=Math.max(0,num(service.base_price));
      if(service.pricing_type!=="flat"&&propertyType==="residential"&&rules?.enabled!==false){
        serviceCost+=Math.max(0,num(bedrooms)-setting("included_bedrooms",2))*setting("extra_bedroom_price");
        serviceCost+=Math.max(0,num(bathrooms)-setting("included_bathrooms",1))*setting("extra_bathroom_price");
        const size=num(propertySize)*(propertyUnit==="sqm"?10.7639:1);
        const step=setting("sqft_step",500);
        if(size>0&&step>0){
          serviceCost+=Math.ceil(Math.max(0,size-setting("included_sqft"))/step)*setting("sqft_step_price");
        }
        const rate=frequency==="weekly"?"weekly_discount_percent":
          frequency==="biweekly"?"biweekly_discount_percent":
          frequency==="monthly"?"monthly_discount_percent":null;
        if(rate)serviceCost-=round(serviceCost*Math.min(100,setting(rate))/100);
      }
      const extras=addons.reduce((sum,item)=>sum+Math.max(0,num(item.price)),0);
      let total=round(Math.max(0,serviceCost)+extras);
      if(service.pricing_type!=="flat"&&propertyType==="residential"&&rules?.enabled!==false){
        total=Math.max(total,setting("minimum_total"));
      }
      return round(total);
    }
  };
})();

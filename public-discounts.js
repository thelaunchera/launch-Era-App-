(()=>{
  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const lang=()=>["en","es","fr","ht"].includes(String(window.TLE_I18N?.language||"en").toLowerCase())?String(window.TLE_I18N?.language||"en").toLowerCase():"en";
  const words={
    en:{apply:"Apply offer",applied:"Applied",left:"spots left",one:"spot left",save:"You save",offer:"Offer"},
    es:{apply:"Aplicar oferta",applied:"Aplicado",left:"cupos disponibles",one:"cupo disponible",save:"Ahorras",offer:"Oferta"},
    fr:{apply:"Appliquer l’offre",applied:"Appliquée",left:"places restantes",one:"place restante",save:"Vous économisez",offer:"Offre"},
    ht:{apply:"Aplike òf la",applied:"Aplike",left:"plas ki rete",one:"plas ki rete",save:"Ou ekonomize",offer:"Òf"}
  };
  function copy(key){return words[lang()]?.[key]||words.en[key]||key;}
  window.TLE_PUBLIC_DISCOUNTS={
    create({discounts=[],wrap,box,input,money,onChange}={}){
      let serviceId="";
      let mode="book";
      const all=Array.isArray(discounts)?discounts:[];
      const selected=()=>all.find(d=>d.id===String(input?.value||""))||null;
      const eligible=()=>mode==="book"?all.filter(d=>(!d.service_id||d.service_id===serviceId)&&Number(d.remaining_clients||0)>0):[];
      const amount=(d,total)=>{
        if(!d||!Number.isFinite(Number(total))) return 0;
        return d.discount_type==="percent"
          ? Math.min(total,Math.max(0,total*Number(d.discount_value||0)/100))
          : Math.min(total,Math.max(0,Number(d.discount_value||0)));
      };
      function render(nextServiceId,nextMode){
        serviceId=String(nextServiceId||"");
        mode=nextMode==="quote"?"quote":"book";
        const items=eligible();
        if(input && !items.some(d=>d.id===input.value)) input.value="";
        if(!wrap||!box) return;
        wrap.hidden=!serviceId||!items.length||mode!=="book";
        if(wrap.hidden){box.innerHTML="";return;}
        box.innerHTML=items.map(d=>{
          const active=input?.value===d.id;
          const remaining=Number(d.remaining_clients||0);
          const value=d.discount_type==="percent"
            ? Number(d.discount_value||0)+"% off"
            : (money?money(Number(d.discount_value||0)):"")+" off";
          return '<button type="button" class="public-discount-card '+(active?"selected":"")+'" data-public-discount="'+esc(d.id)+'">'+
            '<span><small>'+esc(copy("offer"))+'</small><strong>'+esc(d.name)+'</strong>'+
            (d.description?'<em>'+esc(d.description)+'</em>':"")+'</span>'+
            '<span class="public-discount-value"><b>'+esc(value)+'</b><small>'+remaining+' '+esc(remaining===1?copy("one"):copy("left"))+'</small><i>'+esc(active?copy("applied"):copy("apply"))+'</i></span>'+
            '</button>';
        }).join("");
      }
      box?.addEventListener("click",event=>{
        const btn=event.target.closest("[data-public-discount]");
        if(!btn||!input)return;
        input.value=input.value===btn.dataset.publicDiscount?"":btn.dataset.publicDiscount;
        render(serviceId,mode);
        onChange?.();
      });
      return {
        render,
        selectedId:()=>String(input?.value||"")||null,
        selected,
        price(total){
          const d=selected();
          const discount=amount(d,Number(total||0));
          return {discount,final:Math.max(0,Number(total||0)-discount),discountRecord:d};
        },
        clear(){if(input)input.value="";render(serviceId,mode);}
      };
    }
  };
})();
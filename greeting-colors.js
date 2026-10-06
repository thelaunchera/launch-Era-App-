/* Owner palette: choose once on opening, keep stable until the next opening. */
(()=>{
  const defaults={morning:'#F6EDBF',afternoon:'#E4F2FB',evening:'#ECE9FF'};
  let openingMood='morning',businessId=null,palette={...defaults},request=0;
  const words={
    en:['Greeting card colors','Choose your daytime colors. Your card picks the mood when you open the app. Night stays blue.','Morning','Afternoon','Early evening','Night · fixed blue','Save colors','Restore defaults','Colors saved.','Could not save. Please try again.','Preview'],
    es:['Colores de la tarjeta de saludo','Elige tus colores de día. La tarjeta elige el ambiente al abrir la app. La noche se mantiene azul.','Mañana','Tarde','Atardecer','Noche · azul fijo','Guardar colores','Restaurar colores','Colores guardados.','No se pudo guardar. Inténtalo de nuevo.','Vista previa'],
    fr:['Couleurs de la carte de bienvenue','Choisissez vos couleurs de jour. La carte choisit son ambiance à l’ouverture. La nuit reste bleue.','Matin','Après-midi','Début de soirée','Nuit · bleu fixe','Enregistrer','Couleurs par défaut','Couleurs enregistrées.','Enregistrement impossible. Réessayez.','Aperçu'],
    ht:['Koulè kat akèy la','Chwazi koulè lajounen ou yo. Kat la chwazi anbyans li lè ou ouvri app la. Lannuit rete ble.','Maten','Apremidi','Kòmansman aswè','Lannuit · ble fiks','Sove koulè yo','Koulè pa defo','Koulè yo sove.','Pa t kapab sove. Eseye ankò.','Apèsi']
  };
  const labels=()=>words[window.TLE_I18N?.language]||words.en;
  function clean(value){return Object.fromEntries(Object.keys(defaults).map(k=>[k,/^#[\da-f]{6}$/i.test(value?.[k]||'')?value[k].toUpperCase():defaults[k]]));}
  function ink(color){
    const values=color.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    const lum=values[0]*.2126+values[1]*.7152+values[2]*.0722;
    return (lum+.05)/.05>=4.5?'#000000':'#FFFFFF';
  }
  function apply(){
    const hero=document.getElementById('todayHeroCard');
    if(!hero)return;
    const color=palette[openingMood];
    hero.dataset.ownerPalette='true';
    hero.style.setProperty('--greeting-day-color',color);
    hero.style.setProperty('--greeting-day-ink',ink(color));
  }
  async function open(hour){
    const bridge=window.TLE_APP_BRIDGE;
    if(!bridge?.state.business)return;
    const id=bridge.state.business.id;
    openingMood=hour<12?'morning':hour<17?'afternoon':'evening';
    if(businessId!==id){businessId=id;palette={...defaults};}
    apply();
    const token=++request;
    const {data,error}=await bridge.supabase.from('businesses').select('greeting_card_colors').eq('id',id).single();
    if(token!==request||bridge.state.business?.id!==id)return;
    if(!error){palette=clean(data.greeting_card_colors);apply();}
    mount();
  }
  function mount(){
    const slot=document.getElementById('greetingColorsSettings');
    const bridge=window.TLE_APP_BRIDGE;
    if(!slot||bridge?.state.business?.role!=='owner')return;
    const w=labels();
    slot.innerHTML=`<div class="panel-head"><div><h3>${w[0]}</h3><small class="panel-note">${w[1]}</small></div></div><form id="greetingColorsForm"><div class="greeting-color-grid">${Object.keys(defaults).map((k,i)=>`<label>${w[i+2]}<input type="color" name="${k}" value="${palette[k]}"><span data-color-code="${k}">${palette[k]}</span></label>`).join('')}<div class="greeting-night-swatch"><span>${w[5]}</span><i aria-hidden="true"></i></div></div><div class="greeting-color-preview" aria-label="${w[10]}">${w[10]}</div><div class="greeting-color-actions"><button type="submit" class="primary-btn">${w[6]}</button><button type="button" class="ghost-btn" data-greeting-reset>${w[7]}</button></div><p role="status" aria-live="polite" id="greetingColorsStatus"></p></form>`;
    const form=slot.querySelector('form'),preview=slot.querySelector('.greeting-color-preview');
    const draft=()=>clean(Object.fromEntries(new FormData(form)));
    const update=()=>{const p=draft();preview.style.background=p[openingMood];preview.style.color=ink(p[openingMood]);for(const k of Object.keys(defaults))slot.querySelector(`[data-color-code="${k}"]`).textContent=p[k];};
    form.addEventListener('input',update);
    slot.querySelector('[data-greeting-reset]').onclick=()=>{for(const k of Object.keys(defaults))form.elements[k].value=defaults[k];update();};
    form.onsubmit=async event=>{
      event.preventDefault();
      if(bridge.state.business?.role!=='owner')return;
      const id=bridge.state.business.id,colors=draft(),button=form.querySelector('[type="submit"]'),status=slot.querySelector('[role="status"]');
      button.disabled=true;status.textContent='';
      try{
        const {data,error}=await bridge.supabase.from('businesses').update({greeting_card_colors:colors,updated_at:new Date().toISOString()}).eq('id',id).select('greeting_card_colors').single();
        if(error||!data)throw error||new Error('No record');
        if(bridge.state.business?.id!==id)return;
        palette=clean(data.greeting_card_colors);apply();status.textContent=w[8];
      }catch{status.textContent=w[9];}finally{button.disabled=false;}
    };
    update();
  }
  window.TLE_GREETING_COLORS={open,mount};
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){const b=window.TLE_APP_BRIDGE?.state.business;if(b){let hour=new Date().getHours();try{hour=Number(new Intl.DateTimeFormat('en-US',{hour:'numeric',hourCycle:'h23',timeZone:b.timezone||'UTC'}).format(new Date()));}catch{}open(hour);}}});
  window.addEventListener('tle:languagechange',mount);
})();

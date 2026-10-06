/* Owner palette: choose once on opening, keep stable until the next opening. */
(()=>{
  const defaults={morning:'#F6EDBF',afternoon:'#E4F2FB',evening:'#ECE9FF'};
  let openingMood='morning',businessId=null,palette={...defaults,workspace:'#FFFFFF'},request=0;
  const words={
    en:['App colors','Choose your app card color and daytime greeting colors. The night greeting stays blue.','Morning','Afternoon','Early evening','Night · fixed blue','Save colors','Restore defaults','Colors saved.','Could not save. Please try again.','Preview'],
    es:['Colores de la app','Elige tus colores de día. La tarjeta elige el ambiente al abrir la app. La noche se mantiene azul.','Mañana','Tarde','Atardecer','Noche · azul fijo','Guardar colores','Restaurar colores','Colores guardados.','No se pudo guardar. Inténtalo de nuevo.','Vista previa'],
    fr:['Couleurs de l’application','Choisissez vos couleurs de jour. La carte choisit son ambiance à l’ouverture. La nuit reste bleue.','Matin','Après-midi','Début de soirée','Nuit · bleu fixe','Enregistrer','Couleurs par défaut','Couleurs enregistrées.','Enregistrement impossible. Réessayez.','Aperçu'],
    ht:['Koulè app la','Chwazi koulè lajounen ou yo. Kat la chwazi anbyans li lè ou ouvri app la. Lannuit rete ble.','Maten','Apremidi','Kòmansman aswè','Lannuit · ble fiks','Sove koulè yo','Koulè pa defo','Koulè yo sove.','Pa t kapab sove. Eseye ankò.','Apèsi']
  };
  const labels=()=>words[window.TLE_I18N?.language]||words.en;
  function clean(value){const colors={...defaults,workspace:'#FFFFFF'};return Object.fromEntries(Object.keys(colors).map(k=>[k,/^#[\da-f]{6}$/i.test(value?.[k]||'')?value[k].toUpperCase():colors[k]]));}
  function ink(color){
    const values=color.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    const lum=values[0]*.2126+values[1]*.7152+values[2]*.0722;
    return (lum+.05)/.05>=4.5?'#000000':'#FFFFFF';
  }
  function apply(){
    const hero=document.getElementById('todayHeroCard');
    if(!hero)return;
    const shell=document.getElementById('appShell');
    if(shell){
      shell.dataset.ownerCardPalette='true';
      shell.removeAttribute('data-palette-mode');
      shell.style.setProperty('--owner-card-bg',palette.workspace);
      shell.style.setProperty('--unified-card-bg',palette.workspace);
      shell.style.setProperty('--owner-card-ink',ink(palette.workspace));
    }
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
    if(businessId!==id){businessId=id;palette={...defaults,workspace:'#FFFFFF'};}
    apply();
    const token=++request;
    const {data,error}=await bridge.supabase.from('businesses').select('greeting_card_colors,brand_logo_data_url').eq('id',id).single();
    if(token!==request||bridge.state.business?.id!==id)return;
    if(!error){palette=clean(data.greeting_card_colors);bridge.state.business.brand_logo_data_url=data.brand_logo_data_url||null;apply();window.TLE_REFRESH_BUSINESS_LOGO?.();}
    mount();
  }
  function mount(){
    const slot=document.getElementById('greetingColorsSettings');
    const bridge=window.TLE_APP_BRIDGE;
    if(!slot||bridge?.state.business?.role!=='owner')return;
    const w=labels();
    const examples={en:['Good morning','Good afternoon','Good evening','Good evening','Your workspace, your colors.','View calendar →'],es:['Buenos días','Buenas tardes','Buenas tardes','Buenas noches','Tu espacio, tus colores.','Ver calendario →'],fr:['Bonjour','Bon après-midi','Bonsoir','Bonsoir','Votre espace, vos couleurs.','Voir le calendrier →'],ht:['Bonjou','Bòn apremidi','Bonswa','Bonswa','Espas ou, koulè ou.','Gade kalandriye a →']};
    const cardLabels={en:['App card color','This color stays the same throughout the app, day and night.','App card preview'],es:['Color de las tarjetas de la app','Este color se mantiene en toda la app, de día y de noche.','Vista previa de tarjeta'],fr:['Couleur des cartes','Cette couleur reste identique dans l’application, jour et nuit.','Aperçu de carte'],ht:['Koulè kat app yo','Koulè sa a rete menm nan tout app la, lajounen kou lannuit.','Apèsi kat']};
    const cardCopy=cardLabels[window.TLE_I18N?.language]||cardLabels.en;
    const sample=examples[window.TLE_I18N?.language]||examples.en;
    let previewMood=openingMood;
    slot.innerHTML=`<div class="panel-head"><div><h3>${w[0]}</h3><small class="panel-note">${w[1]}</small></div></div><form id="greetingColorsForm"><div class="owner-cards-choice"><label>${cardCopy[0]}<input type="color" name="workspace" value="${palette.workspace}"></label><small>${cardCopy[1]}</small><div class="owner-cards-preview">${cardCopy[2]}</div></div><div class="greeting-color-grid">${Object.keys(defaults).map((k,i)=>`<label>${w[i+2]}<input type="color" name="${k}" value="${palette[k]}"><span data-color-code="${k}">${palette[k]}</span></label>`).join('')}<div class="greeting-night-swatch"><span>${w[5]}</span><i aria-hidden="true"></i></div></div><button type="button" class="ghost-btn greeting-preview-toggle" data-greeting-preview aria-expanded="false" aria-controls="greetingColorPreviewPanel">${w[10]}</button><div id="greetingColorPreviewPanel" class="greeting-preview-panel" hidden><div class="greeting-preview-moods" role="group" aria-label="${w[10]}">${[...Object.keys(defaults),'night'].map((k,i)=>`<button type="button" data-preview-mood="${k}" aria-pressed="false">${w[i+2]}</button>`).join('')}</div><div class="greeting-color-preview" aria-live="polite"><span class="greeting-preview-clock"></span><h4></h4><p>${sample[4]}</p><span class="greeting-preview-calendar">${sample[5]}</span></div></div><div class="greeting-color-actions"><button type="submit" class="primary-btn">${w[6]}</button><button type="button" class="ghost-btn" data-greeting-reset>${w[7]}</button></div><p role="status" aria-live="polite" id="greetingColorsStatus"></p></form>`;
    const form=slot.querySelector('form'),preview=slot.querySelector('.greeting-color-preview');
    const draft=()=>clean(Object.fromEntries(new FormData(form)));
    const update=()=>{
      const p=draft(),cardPreview=slot.querySelector('.owner-cards-preview');
      cardPreview.style.background=p.workspace;cardPreview.style.color=ink(p.workspace);
      const night=previewMood==='night',index=night?3:Object.keys(defaults).indexOf(previewMood);
      preview.style.background=night?'linear-gradient(145deg,#173E58 0%,#164B67 62%,#15627B 100%)':p[previewMood];
      preview.style.color=night?'#FFFFFF':ink(p[previewMood]);
      preview.querySelector('h4').textContent=sample[index];
      preview.querySelector('.greeting-preview-clock').textContent=['8:00 AM','2:00 PM','6:00 PM','8:00 PM'][index];
      for(const k of Object.keys(defaults))slot.querySelector(`[data-color-code="${k}"]`).textContent=p[k];
      slot.querySelectorAll('[data-preview-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewMood===previewMood)));
    };
    form.addEventListener('input',event=>{if(Object.hasOwn(defaults,event.target.name))previewMood=event.target.name;update();});
    slot.querySelector('[data-greeting-preview]').onclick=event=>{
      const panel=slot.querySelector('.greeting-preview-panel');
      panel.hidden=!panel.hidden;
      event.currentTarget.setAttribute('aria-expanded',String(!panel.hidden));
      update();
    };
    slot.querySelectorAll('[data-preview-mood]').forEach(b=>b.onclick=()=>{previewMood=b.dataset.previewMood;update();});
    slot.querySelector('[data-greeting-reset]').onclick=()=>{for(const [k,v] of Object.entries({...defaults,workspace:'#FFFFFF'}))form.elements[k].value=v;update();};
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

(()=>{
  const params=new URLSearchParams(window.location.search);
  if(params.get("public")!=="welcome"||!params.get("token")) return;

  window.__tlePublicHandled=true;

  const SUPABASE_URL="https://bowacxhmjvrqixtwaikv.supabase.co";
  const KEY="sb_publishable_0TueitFYiRF3rAEMLMT8-w_FvbvY0rB";
  const token=params.get("token");
  const LANGS=["en","es","fr","ht"];
  const requested=String(params.get("lang")||"").toLowerCase();
  let packet=null;
  let currentLang=LANGS.includes(requested)?requested:"en";

  const UI={
    en:{sub:"Welcome Packet",hello:"Welcome",next:"Your next cleaning",none:"No upcoming cleaning is scheduled yet.",service:"Service",address:"Address",arrival:"Before we arrive",prep:"Home prep & pets",payment:"Payment",changes:"Changes & cancellations",extra:"A note from us",contact:"Questions?",contactCopy:"Contact the business directly if you need anything before your cleaning.",print:"Save / Print",methods:"Available payment methods",cutoff:"Online changes are available up to {hours} hours before the appointment.",noChanges:"Contact the business directly if you need to change your appointment.",policy:"Cancellation policy",unavailable:"This Welcome Packet is not available."},
    es:{sub:"Welcome Packet",hello:"Bienvenido/a",next:"Tu próxima limpieza",none:"Todavía no hay una limpieza próxima agendada.",service:"Servicio",address:"Dirección",arrival:"Antes de llegar",prep:"Preparación del hogar y mascotas",payment:"Pago",changes:"Cambios y cancelaciones",extra:"Una nota de nosotros",contact:"¿Preguntas?",contactCopy:"Contacta directamente al negocio si necesitas algo antes de tu limpieza.",print:"Guardar / Imprimir",methods:"Métodos de pago disponibles",cutoff:"Los cambios online están disponibles hasta {hours} horas antes de la cita.",noChanges:"Contacta directamente al negocio si necesitas cambiar tu cita.",policy:"Política de cancelación",unavailable:"Este Welcome Packet no está disponible."},
    fr:{sub:"Dossier de bienvenue",hello:"Bienvenue",next:"Votre prochain nettoyage",none:"Aucun prochain nettoyage n’est encore planifié.",service:"Service",address:"Adresse",arrival:"Avant notre arrivée",prep:"Préparation du domicile et animaux",payment:"Paiement",changes:"Modifications et annulations",extra:"Un mot de notre part",contact:"Des questions ?",contactCopy:"Contactez directement l’entreprise si vous avez besoin de quoi que ce soit avant le nettoyage.",print:"Enregistrer / Imprimer",methods:"Modes de paiement disponibles",cutoff:"Les modifications en ligne sont possibles jusqu’à {hours} heures avant le rendez-vous.",noChanges:"Contactez directement l’entreprise pour modifier votre rendez-vous.",policy:"Politique d’annulation",unavailable:"Ce dossier de bienvenue n’est pas disponible."},
    ht:{sub:"Pake akey",hello:"Byenveni",next:"Pwochen netwayaj ou",none:"Pa gen pwochen netwayaj ki pwograme ankò.",service:"Sèvis",address:"Adrès",arrival:"Anvan nou rive",prep:"Preparasyon kay ak bèt",payment:"Peman",changes:"Chanjman ak anilasyon",extra:"Yon nòt nan men nou",contact:"Kesyon?",contactCopy:"Kontakte biznis la dirèkteman si ou bezwen anyen anvan netwayaj la.",print:"Sove / Enprime",methods:"Metòd peman ki disponib",cutoff:"Chanjman sou entènèt disponib jiska {hours} èdtan anvan randevou a.",noChanges:"Kontakte biznis la dirèkteman si ou bezwen chanje randevou a.",policy:"Règleman anilasyon",unavailable:"Welcome Packet sa a pa disponib."}
  };

  function esc(v){return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));}
  function hex(v,fallback){return /^#[0-9a-f]{6}$/i.test(String(v||""))?String(v):fallback;}
  function contrast(color){
    const c=hex(color,"#2F5F66").slice(1),r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);
    return ((r*299+g*587+b*114)/1000)>150?"#191919":"#fff";
  }
  function normalize(v){v=String(v||"").toLowerCase();return LANGS.includes(v)?v:"en";}
  function defaults(l,business){
    const name=business||"our team";
    const d={
      en:{welcome_message:"Thanks for choosing "+name+". We’re glad to take care of your home. Here’s everything you need before your cleaning.",before_arrival:"Please make sure we can access the property at the scheduled time and share any special entry or parking instructions with us.",home_prep:"Secure pets if needed and put away anything fragile, private or important that you do not want moved.",payment_note:"Your available payment methods are listed below. Payment details are confirmed directly with "+name+".",changes_note:"Need to reschedule or cancel? Please contact us as early as possible so we can help with the change.",extra_note:""},
      es:{welcome_message:"Gracias por elegir a "+name+". Nos alegra cuidar de tu hogar. Aquí tienes todo lo que necesitas saber antes de tu limpieza.",before_arrival:"Asegúrate de que podamos entrar a la propiedad a la hora programada y comparte cualquier instrucción especial de entrada o estacionamiento.",home_prep:"Asegura a las mascotas si es necesario y guarda cualquier objeto frágil, privado o importante que no quieras que movamos.",payment_note:"Los métodos de pago disponibles aparecen abajo. Los detalles del pago se confirman directamente con "+name+".",changes_note:"¿Necesitas reprogramar o cancelar? Contáctanos lo antes posible para poder ayudarte con el cambio.",extra_note:""},
      fr:{welcome_message:"Merci d’avoir choisi "+name+". Nous sommes heureux de prendre soin de votre domicile. Voici l’essentiel avant votre nettoyage.",before_arrival:"Assurez-vous que nous pouvons accéder à la propriété à l’heure prévue et partagez toute instruction particulière d’accès ou de stationnement.",home_prep:"Sécurisez les animaux si nécessaire et rangez les objets fragiles, privés ou importants que vous ne souhaitez pas voir déplacés.",payment_note:"Les modes de paiement disponibles figurent ci-dessous. Les détails sont confirmés directement avec "+name+".",changes_note:"Besoin de reporter ou d’annuler ? Contactez-nous dès que possible afin que nous puissions vous aider.",extra_note:""},
      ht:{welcome_message:"Mèsi paske ou chwazi "+name+". Nou kontan pran swen kay ou. Men sa ou bezwen konnen anvan netwayaj la.",before_arrival:"Tanpri asire nou ka antre nan pwopriyete a nan lè ki pwograme a epi pataje nenpòt enstriksyon espesyal pou antre oswa pakin.",home_prep:"Mete bèt yo an sekirite si sa nesesè epi mete sou kote bagay frajil, prive oswa enpòtan ou pa vle nou deplase.",payment_note:"Metòd peman ki disponib yo parèt anba a. Detay peman yo konfime dirèkteman ak "+name+".",changes_note:"Bezwen chanje dat oswa anile? Kontakte nou pi bonè posib pou nou ka ede w.",extra_note:""}
    };
    return d[l]||d.en;
  }
  function methods(value,l){
    const labels={
      en:{cash:"Cash",check:"Check",zelle:"Zelle",bank_transfer:"Bank transfer",mobile_payment:"Mobile payment",other:"Other"},
      es:{cash:"Cash",check:"Check",zelle:"Zelle",bank_transfer:"Transferencia bancaria",mobile_payment:"Pago móvil",other:"Otro"},
      fr:{cash:"Espèces",check:"Chèque",zelle:"Zelle",bank_transfer:"Virement bancaire",mobile_payment:"Paiement mobile",other:"Autre"},
      ht:{cash:"Lajan kach",check:"Chèk",zelle:"Zelle",bank_transfer:"Transfè labank",mobile_payment:"Peman mobil",other:"Lòt"}
    };
    return (Array.isArray(value)?value:[]).map(x=>labels[l]?.[String(x).toLowerCase()]||String(x).replaceAll("_"," "));
  }
  async function rpc(){
    const res=await fetch(SUPABASE_URL+"/rest/v1/rpc/get_public_welcome_packet",{
      method:"POST",headers:{"apikey":KEY,"Content-Type":"application/json"},body:JSON.stringify({p_token:token})
    });
    const text=await res.text();let data=null;try{data=text?JSON.parse(text):null;}catch{data=null;}
    if(!res.ok) throw new Error(data?.message||"Welcome Packet unavailable");
    return data;
  }
  function showShell(){
    document.getElementById("sessionSplash")?.setAttribute("hidden","");
    ["authShell","appShell","workerShell"].forEach(id=>{const e=document.getElementById(id);if(e)e.hidden=true;});
    const pub=document.getElementById("publicShell");if(pub)pub.hidden=false;
    const refresh=document.getElementById("publicRefreshBtn");if(refresh)refresh.hidden=true;
    const hero=document.getElementById("publicBookingHero");if(hero)hero.hidden=true;
    const switcher=document.getElementById("publicRequestSwitch");if(switcher)switcher.hidden=true;
    ["publicRequestForm","publicInvoiceView","publicQuoteReview","publicSuccess"].forEach(id=>{const e=document.getElementById(id);if(e)e.hidden=true;});
    let meta=document.querySelector('meta[name="robots"]');if(!meta){meta=document.createElement("meta");meta.name="robots";document.head.appendChild(meta);}meta.content="noindex,nofollow,noarchive";
  }
  function formatDate(value,l){
    if(!value)return "";
    const locale={en:"en-US",es:"es-US",fr:"fr-FR",ht:"ht-HT"}[l]||"en-US";
    try{return new Intl.DateTimeFormat(locale,{weekday:"long",month:"long",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(value));}catch{return String(value);}
  }
  function initials(name){return String(name||"CB").split(/\s+/).map(x=>x[0]||"").join("").slice(0,2).toUpperCase();}
  function contentFor(l){
    const base=defaults(l,packet.business_name),saved=packet.welcome_packet_settings?.[l]||{};
    return Object.assign({},base,saved);
  }
  function render(){
    if(!packet) return;
    const l=currentLang,u=UI[l]||UI.en,c=contentFor(l);
    const primary=hex(packet.brand_primary_color,"#2F5F66"),accent=hex(packet.brand_accent_color,"#DDEFF2"),primaryText=contrast(primary);
    document.documentElement.style.setProperty("--wp-primary",primary);
    document.documentElement.style.setProperty("--wp-accent",accent);
    document.documentElement.style.setProperty("--wp-primary-text",primaryText);

    const headName=document.getElementById("publicHeaderBusinessName"),headSub=document.getElementById("publicHeaderSub"),mark=document.getElementById("publicHeaderMark");
    if(headName)headName.textContent=packet.business_name||"Cleaning Business";
    if(headSub)headSub.textContent=u.sub;
    if(mark){
      mark.innerHTML=packet.brand_logo_data_url?'<img class="wp-public-header-logo" src="'+esc(packet.brand_logo_data_url)+'" alt="">':esc(initials(packet.business_name));
      mark.classList.add("wp-public-brand-mark");
    }

    const card=document.querySelector("#publicShell .public-card");if(!card)return;
    const next=packet.next_job||null,pays=methods(packet.payment_methods,l);
    const changeCopy=(packet.allow_client_reschedule||packet.allow_client_cancel)
      ? u.cutoff.replace("{hours}",String(packet.client_change_cutoff_hours??24))
      : u.noChanges;

    card.className="public-card welcome-packet-public-card";
    card.innerHTML=
      '<article class="wp-public-sheet">'+
      '<header class="wp-public-hero"><div class="wp-public-logo">'+(packet.brand_logo_data_url?'<img src="'+esc(packet.brand_logo_data_url)+'" alt="">':'<span>'+esc(initials(packet.business_name))+'</span>')+'</div><div><small>'+esc(u.sub.toUpperCase())+'</small><h1>'+esc(u.hello)+', '+esc(String(packet.customer_name||"").split(/\s+/)[0]||"")+' 👋</h1><p>'+esc(c.welcome_message||"")+'</p></div></header>'+
      '<section class="wp-public-next"><div><small>'+esc(u.next)+'</small><strong>'+esc(next?formatDate(next.starts_at,l):u.none)+'</strong></div>'+
        (next?'<div class="wp-public-next-meta">'+(next.service_name?'<span><small>'+esc(u.service)+'</small><b>'+esc(next.service_name)+'</b></span>':"")+(packet.service_address?'<span><small>'+esc(u.address)+'</small><b>'+esc(packet.service_address)+'</b></span>':"")+'</div>':"")+
      '</section>'+
      '<div class="wp-public-grid">'+
        '<section class="wp-public-section"><span class="wp-public-icon">01</span><div><h2>'+esc(u.arrival)+'</h2><p>'+esc(c.before_arrival||"")+'</p></div></section>'+
        '<section class="wp-public-section"><span class="wp-public-icon">02</span><div><h2>'+esc(u.prep)+'</h2><p>'+esc(c.home_prep||"")+'</p></div></section>'+
        '<section class="wp-public-section"><span class="wp-public-icon">03</span><div><h2>'+esc(u.payment)+'</h2><p>'+esc(c.payment_note||"")+'</p>'+(pays.length?'<small class="wp-public-kicker">'+esc(u.methods)+'</small><div class="wp-payment-pills">'+pays.map(x=>'<span>'+esc(x)+'</span>').join("")+'</div>':"")+'</div></section>'+
        '<section class="wp-public-section"><span class="wp-public-icon">04</span><div><h2>'+esc(u.changes)+'</h2><p>'+esc(c.changes_note||"")+'</p><p class="wp-policy-note">'+esc(changeCopy)+'</p>'+(packet.cancellation_policy_text?'<small class="wp-public-kicker">'+esc(u.policy)+'</small><p>'+esc(packet.cancellation_policy_text)+'</p>':"")+'</div></section>'+
        (c.extra_note?'<section class="wp-public-section wp-public-extra"><span class="wp-public-icon">✦</span><div><h2>'+esc(u.extra)+'</h2><p>'+esc(c.extra_note)+'</p></div></section>':"")+
      '</div>'+
      '<footer class="wp-public-footer"><div><strong>'+esc(u.contact)+'</strong><p>'+esc(u.contactCopy)+'</p><div class="wp-contact-links">'+(packet.business_phone?'<a href="tel:'+esc(String(packet.business_phone).replace(/[^\d+]/g,""))+'">'+esc(packet.business_phone)+'</a>':"")+(packet.business_email?'<a href="mailto:'+esc(packet.business_email)+'">'+esc(packet.business_email)+'</a>':"")+'</div></div><button type="button" class="primary-btn" id="welcomePacketPrintBtn">'+esc(u.print)+'</button></footer>'+
      '</article>';
    document.getElementById("welcomePacketPrintBtn")?.addEventListener("click",()=>window.print());
  }
  async function track(){
    try{await fetch(SUPABASE_URL+"/functions/v1/track-app-visit",{method:"POST",headers:{"apikey":KEY,"Content-Type":"application/json"},body:JSON.stringify({visitor_id:localStorage.getItem("tle_visitor_id")||crypto.randomUUID?.()||"welcome-"+Date.now(),page:"/public/welcome",referrer:document.referrer||null,user_agent:navigator.userAgent||null})});}catch{}
  }
  async function boot(){
    showShell();
    try{
      packet=await rpc();
      currentLang=LANGS.includes(requested)?requested:normalize(packet.preferred_language||packet.customer_email_language||packet.default_language||"en");
      if(window.TLE_I18N?.setLanguage)window.TLE_I18N.setLanguage(currentLang);
      render();track();
    }catch(err){
      const card=document.querySelector("#publicShell .public-card");if(card){card.className="public-card welcome-packet-public-card";card.innerHTML='<div class="wp-public-error"><strong>'+esc((UI[currentLang]||UI.en).unavailable)+'</strong></div>';}
    }
  }
  window.addEventListener("tle:languagechange",e=>{
    const l=normalize(e?.detail?.language);if(!packet||l===currentLang)return;currentLang=l;
    try{const u=new URL(window.location.href);u.searchParams.set("lang",l);history.replaceState(history.state||{},"",u.pathname+u.search+u.hash);}catch{}
    render();
  });
  boot();
})();
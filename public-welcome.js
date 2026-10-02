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
    en:{sub:"Welcome Packet",hello:"Welcome",next:"Your next cleaning",none:"No upcoming cleaning is scheduled yet.",service:"Service",address:"Address",arrival:"Before we arrive",prep:"A few things that help",payment:"Payment, made simple",changes:"Plans change — we get it",extra:"A little note from us",contact:"Need anything?",contactCopy:"Have a question or need to share something before we arrive? Reach out anytime.",print:"Save / Print",methods:"Payment options",cutoff:"If plans change, you can update your appointment online up to {hours} hours before we arrive.",noChanges:"If you need to make a change, reach out and we’ll help with the next step.",policy:"A quick note about cancellations",unavailable:"This Welcome Packet is not available."},
    es:{sub:"Welcome Packet",hello:"Bienvenido/a",next:"Tu próxima limpieza",none:"Todavía no hay una limpieza próxima agendada.",service:"Servicio",address:"Dirección",arrival:"Antes de llegar",prep:"Unas cositas que ayudan",payment:"Pago, sin complicaciones",changes:"Si cambian los planes",extra:"Una notita de nosotros",contact:"¿Necesitas algo?",contactCopy:"¿Tienes una pregunta o quieres contarnos algo antes de que lleguemos? Escríbenos cuando quieras.",print:"Guardar / Imprimir",methods:"Opciones de pago",cutoff:"Si cambian tus planes, puedes actualizar tu cita online hasta {hours} horas antes de que lleguemos.",noChanges:"Si necesitas hacer un cambio, escríbenos y te ayudamos con el próximo paso.",policy:"Una nota rápida sobre cancelaciones",unavailable:"Este Welcome Packet no está disponible."},
    fr:{sub:"Dossier de bienvenue",hello:"Bienvenue",next:"Votre prochain nettoyage",none:"Aucun prochain nettoyage n’est encore planifié.",service:"Service",address:"Adresse",arrival:"Avant notre arrivée",prep:"Quelques petites choses utiles",payment:"Un paiement simple",changes:"Si vos plans changent",extra:"Un petit mot de notre part",contact:"Besoin de quelque chose ?",contactCopy:"Une question ou quelque chose à nous signaler avant notre arrivée ? Écrivez-nous quand vous voulez.",print:"Enregistrer / Imprimer",methods:"Options de paiement",cutoff:"Si vos plans changent, vous pouvez modifier votre rendez-vous en ligne jusqu’à {hours} heures avant notre arrivée.",noChanges:"Si vous devez changer quelque chose, écrivez-nous et nous vous aiderons pour la suite.",policy:"Une petite note sur les annulations",unavailable:"Ce dossier de bienvenue n’est pas disponible."},
    ht:{sub:"Pake akey",hello:"Byenveni",next:"Pwochen netwayaj ou",none:"Pa gen pwochen netwayaj ki pwograme ankò.",service:"Sèvis",address:"Adrès",arrival:"Anvan nou rive",prep:"Kèk ti bagay ki ede",payment:"Peman san konplikasyon",changes:"Si plan yo chanje",extra:"Yon ti nòt nan men nou",contact:"Ou bezwen yon bagay?",contactCopy:"Ou gen yon kesyon oswa yon bagay ou ta renmen pataje anvan nou rive? Ekri nou nenpòt lè.",print:"Sove / Enprime",methods:"Opsyon peman",cutoff:"Si plan yo chanje, ou ka modifye randevou a sou entènèt jiska {hours} èdtan anvan nou rive.",noChanges:"Si ou bezwen fè yon chanjman, ekri nou epi n ap ede w ak pwochen etap la.",policy:"Yon ti nòt sou anilasyon",unavailable:"Welcome Packet sa a pa disponib."}
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
      en:{
        welcome_message:"Thank you for inviting us into your home. We know trusting someone with your space matters, and we’re grateful you chose "+name+". We put a few helpful notes here so everything feels easy from start to finish.",
        before_arrival:"No need to make the house perfect for us — that’s why we’re coming. Just make sure we can get in, and send us any gate, parking, or entry details that will help us arrive smoothly.",
        home_prep:"If you have pets, let us know what makes them most comfortable. For anything especially fragile, private, or meaningful, tucking it away beforehand helps us take the best care of your space.",
        payment_note:"We like to keep payment simple. You’ll see the available options below, and if anything is unclear, just reach out — we’re happy to help.",
        changes_note:"Plans can change. If you need to reschedule or cancel, let us know as soon as you can and we’ll do our best to make the change easy.",
        extra_note:""
      },
      es:{
        welcome_message:"Gracias por abrirnos las puertas de tu hogar. Sabemos que confiarle tu espacio a alguien es importante, y agradecemos que hayas elegido a "+name+". Dejamos aquí unas notas sencillas para que todo se sienta fácil de principio a fin.",
        before_arrival:"No tienes que dejar la casa perfecta para nosotros — para eso vamos. Solo asegúrate de que podamos entrar y compártenos cualquier detalle de acceso, portón o estacionamiento que nos ayude a llegar sin problema.",
        home_prep:"Si tienes mascotas, cuéntanos qué las hace sentir más cómodas. Y si hay algo especialmente frágil, privado o importante para ti, guardarlo antes nos ayuda a cuidar mejor tu espacio.",
        payment_note:"Nos gusta mantener el pago sencillo. Aquí verás las opciones disponibles y, si algo no está claro, escríbenos — con gusto te ayudamos.",
        changes_note:"Los planes a veces cambian. Si necesitas reprogramar o cancelar, avísanos tan pronto puedas y haremos lo posible para que el cambio sea fácil.",
        extra_note:""
      },
      fr:{
        welcome_message:"Merci de nous ouvrir les portes de votre maison. Nous savons que confier son espace à quelqu’un est important, et nous vous remercions d’avoir choisi "+name+". Nous avons réuni ici quelques notes simples pour que tout se passe facilement du début à la fin.",
        before_arrival:"Pas besoin que la maison soit parfaite avant notre arrivée — c’est justement pour cela que nous venons. Assurez-vous simplement que nous pouvons entrer et partagez les détails d’accès, de portail ou de stationnement utiles.",
        home_prep:"Si vous avez des animaux, dites-nous ce qui les met le plus à l’aise. Pour les objets particulièrement fragiles, privés ou précieux, les mettre de côté à l’avance nous aide à prendre soin de votre espace.",
        payment_note:"Nous aimons garder le paiement simple. Les options disponibles sont indiquées ci-dessous et, si quelque chose n’est pas clair, écrivez-nous — nous sommes là pour vous aider.",
        changes_note:"Les plans peuvent changer. Si vous devez reporter ou annuler, prévenez-nous dès que possible et nous ferons au mieux pour rendre le changement simple.",
        extra_note:""
      },
      ht:{
        welcome_message:"Mèsi paske ou louvri pòt kay ou pou nou. Nou konnen li enpòtan pou w santi w alèz lè w ap kite yon moun pran swen espas ou, e nou apresye anpil dèske ou chwazi "+name+". Nou mete kèk ti nòt isit la pou tout bagay ka mache dousman depi nan kòmansman rive nan fen.",
        before_arrival:"Ou pa bezwen fè kay la pafè anvan nou vini — se poutèt sa nou la. Jis asire nou ka antre epi voye nenpòt detay sou pòtay, pakin oswa fason pou antre ki ka ede nou rive fasil.",
        home_prep:"Si ou gen bèt lakay, fè nou konnen sa ki fè yo pi alèz. Pou bagay ki frajil, prive oswa ki gen anpil valè pou ou, mete yo sou kote davans ede nou pran pi bon swen espas ou.",
        payment_note:"Nou renmen kenbe peman an senp. Ou ap wè opsyon ki disponib yo anba a, epi si gen yon bagay ki pa klè, ekri nou — n ap kontan ede w.",
        changes_note:"Plan yo ka chanje. Si ou bezwen chanje dat oswa anile, fè nou konnen pi bonè ou kapab epi n ap fè tout sa nou kapab pou rann chanjman an fasil.",
        extra_note:""
      }
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
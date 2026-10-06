(()=>{
  const bridge=window.TLE_APP_BRIDGE;
  if(!bridge?.supabase) return;

  const supabase=bridge.supabase;
  const appState=bridge.state||{};
  const LANGS=["en","es","fr","ht"];
  const LANG_LABELS={en:"English",es:"Español",fr:"Français",ht:"Kreyòl Ayisyen"};
  let editor=null;
  let draftLogo="";
  let observerQueued=false;

  const C={
    en:{card:"Welcome",title:"Welcome Packet",eyebrow:"CLIENT WELCOME PACKET",intro:"Brand it once, then share a private packet with each client.",brand:"Business branding",brandHelp:"Your logo and colors apply to every client Welcome Packet.",logo:"Business logo",upload:"Upload / replace logo",remove:"Remove logo",download:"Download logo",primary:"Primary color",accent:"Accent color",language:"Packet language",languageHelp:"This client will open the packet in this language.",message:"Welcome message",arrival:"Before we arrive",prep:"A few things that help",payment:"Payment, made simple",changes:"Plans change — we get it",extra:"Extra note (optional)",preview:"CLIENT PREVIEW",next:"Next cleaning",none:"No upcoming cleaning is scheduled yet.",close:"Close",copy:"Copy link",share:"Share",open:"Open client view",save:"Save packet",saved:"Welcome Packet saved",copied:"Welcome Packet link copied",shareText:"Here is your Welcome Packet.",badLogo:"Use a PNG, JPG or WebP logo. Large images will be resized automatically.",loadError:"Could not open the Welcome Packet.",saveError:"Could not save the Welcome Packet."},
    es:{card:"Welcome",title:"Welcome Packet",eyebrow:"WELCOME PACKET DEL CLIENTE",intro:"Personaliza la marca una vez y comparte un packet privado con cada cliente.",brand:"Marca del negocio",brandHelp:"Tu logo y colores se aplican a todos los Welcome Packets de clientes.",logo:"Logo del negocio",upload:"Subir / reemplazar logo",remove:"Quitar logo",download:"Bajar logo",primary:"Color principal",accent:"Color de acento",language:"Idioma del packet",languageHelp:"Este cliente abrirá el packet en este idioma.",message:"Mensaje de bienvenida",arrival:"Antes de llegar",prep:"Unas cositas que ayudan",payment:"Pago, sin complicaciones",changes:"Si cambian los planes",extra:"Nota extra (opcional)",preview:"VISTA DEL CLIENTE",next:"Próxima limpieza",none:"Todavía no hay una limpieza próxima agendada.",close:"Cerrar",copy:"Copiar link",share:"Compartir",open:"Abrir vista del cliente",save:"Guardar packet",saved:"Welcome Packet guardado",copied:"Link del Welcome Packet copiado",shareText:"Aquí está tu Welcome Packet.",badLogo:"Usa un logo PNG, JPG o WebP. Las imágenes grandes se reducirán automáticamente.",loadError:"No se pudo abrir el Welcome Packet.",saveError:"No se pudo guardar el Welcome Packet."},
    fr:{card:"Welcome",title:"Dossier de bienvenue",eyebrow:"DOSSIER CLIENT",intro:"Personnalisez la marque une fois, puis partagez un dossier privé avec chaque client.",brand:"Identité de l’entreprise",brandHelp:"Votre logo et vos couleurs s’appliquent à tous les dossiers de bienvenue.",logo:"Logo de l’entreprise",upload:"Importer / remplacer",remove:"Retirer",download:"Télécharger",primary:"Couleur principale",accent:"Couleur d’accent",language:"Langue du dossier",languageHelp:"Ce client ouvrira le dossier dans cette langue.",message:"Message de bienvenue",arrival:"Avant notre arrivée",prep:"Quelques petites choses utiles",payment:"Un paiement simple",changes:"Si vos plans changent",extra:"Note supplémentaire (facultatif)",preview:"APERÇU CLIENT",next:"Prochain nettoyage",none:"Aucun prochain nettoyage n’est encore planifié.",close:"Fermer",copy:"Copier le lien",share:"Partager",open:"Ouvrir la vue client",save:"Enregistrer",saved:"Dossier enregistré",copied:"Lien copié",shareText:"Voici votre dossier de bienvenue.",badLogo:"Utilisez un logo PNG, JPG ou WebP. Les grandes images seront redimensionnées.",loadError:"Impossible d’ouvrir le dossier.",saveError:"Impossible d’enregistrer le dossier."},
    ht:{card:"Welcome",title:"Pake akey",eyebrow:"PAKE AKEY KLIYAN",intro:"Mete mak biznis la yon sèl fwa, epi pataje yon pake prive ak chak kliyan.",brand:"Mak biznis la",brandHelp:"Logo ak koulè yo aplike sou tout Welcome Packet biznis la.",logo:"Logo biznis la",upload:"Mete / ranplase logo",remove:"Retire logo",download:"Telechaje logo",primary:"Koulè prensipal",accent:"Koulè aksan",language:"Lang pake a",languageHelp:"Kliyan sa a ap ouvri pake a nan lang sa a.",message:"Mesaj akey",arrival:"Anvan nou rive",prep:"Kèk ti bagay ki ede",payment:"Peman san konplikasyon",changes:"Si plan yo chanje",extra:"Nòt anplis (opsyonèl)",preview:"APERÇU KLIYAN",next:"Pwochen netwayaj",none:"Pa gen pwochen netwayaj ki pwograme ankò.",close:"Fèmen",copy:"Kopye lyen",share:"Pataje",open:"Louvri paj kliyan",save:"Sove pake a",saved:"Welcome Packet la sove",copied:"Lyen Welcome Packet la kopye",shareText:"Men Welcome Packet ou a.",badLogo:"Sèvi ak yon logo PNG, JPG oswa WebP. Gwo imaj yo ap redimansyone otomatikman.",loadError:"Nou pa t kapab louvri Welcome Packet la.",saveError:"Nou pa t kapab sove Welcome Packet la."}
  };

  function lang(){
    const v=String(window.TLE_I18N?.language||appState.business?.default_language||"en").toLowerCase();
    return LANGS.includes(v)?v:"en";
  }
  function t(){ return C[lang()]||C.en; }
  function esc(v){return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));}
  function hex(v,fallback){return /^#[0-9a-f]{6}$/i.test(String(v||""))?String(v):fallback;}
  function contrast(color){
    const c=hex(color,"#2F5F66").slice(1),r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);
    return ((r*299+g*587+b*114)/1000)>150?"#191919":"#fff";
  }
  function toast(msg){
    const el=document.getElementById("toast"); if(!el) return;
    el.textContent=msg; el.hidden=false; clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>{el.hidden=true;},2600);
  }
  function normalizeLang(v){v=String(v||"").toLowerCase();return LANGS.includes(v)?v:"en";}
  function packetUrl(token,l){
    const u=new URL(window.location.origin+window.location.pathname);
    u.searchParams.set("public","welcome");u.searchParams.set("token",token);u.searchParams.set("lang",normalizeLang(l));
    return u.toString();
  }
  function defaults(l,business){
    const name=business||"our team";
    const all={
      en:{
        welcome_message:"Thank you for inviting us into your home. We know trusting someone with your space matters, and we’re grateful you chose "+name+". We put a few helpful notes here so everything feels easy from start to finish.",
        before_arrival:"No need to make the house perfect for us — that’s why we’re coming. Just make sure we can get in, and send us any gate, parking, or entry details that will help us arrive smoothly.",
        home_prep:"If you have pets, let us know what makes them most comfortable. For anything especially fragile, private, or meaningful, tucking it away beforehand helps us take the best care of your space.",
        payment_note:"We like to keep payment simple. You’ll see the available options here, and if anything is unclear, just reach out — we’re happy to help.",
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
        payment_note:"Nous aimons garder le paiement simple. Les options disponibles sont indiquées ici et, si quelque chose n’est pas clair, écrivez-nous — nous sommes là pour vous aider.",
        changes_note:"Les plans peuvent changer. Si vous devez reporter ou annuler, prévenez-nous dès que possible et nous ferons au mieux pour rendre le changement simple.",
        extra_note:""
      },
      ht:{
        welcome_message:"Mèsi paske ou louvri pòt kay ou pou nou. Nou konnen li enpòtan pou w santi w alèz lè w ap kite yon moun pran swen espas ou, e nou apresye anpil dèske ou chwazi "+name+". Nou mete kèk ti nòt isit la pou tout bagay ka mache dousman depi nan kòmansman rive nan fen.",
        before_arrival:"Ou pa bezwen fè kay la pafè anvan nou vini — se poutèt sa nou la. Jis asire nou ka antre epi voye nenpòt detay sou pòtay, pakin oswa fason pou antre ki ka ede nou rive fasil.",
        home_prep:"Si ou gen bèt lakay, fè nou konnen sa ki fè yo pi alèz. Pou bagay ki frajil, prive oswa ki gen anpil valè pou ou, mete yo sou kote davans ede nou pran pi bon swen espas ou.",
        payment_note:"Nou renmen kenbe peman an senp. Ou ap wè opsyon ki disponib yo isit la, epi si gen yon bagay ki pa klè, ekri nou — n ap kontan ede w.",
        changes_note:"Plan yo ka chanje. Si ou bezwen chanje dat oswa anile, fè nou konnen pi bonè ou kapab epi n ap fè tout sa nou kapab pou rann chanjman an fasil.",
        extra_note:""
      }
    };
    return all[l]||all.en;
  }
  function savedContent(l){
    return Object.assign({},defaults(l,editor?.business_name),editor?.welcome_packet_settings?.[l]||{});
  }
  function nextCleaning(){
    const jobs=(appState.jobs||[]).filter(j=>String(j.client_id)===String(editor?.client_id)&&!["completed","canceled","no_show"].includes(String(j.status||"").toLowerCase())&&new Date(j.starts_at).getTime()>=Date.now()-7200000).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
    if(!jobs[0]) return "";
    try{return new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(jobs[0].starts_at));}catch{return String(jobs[0].starts_at||"");}
  }
  function close(){document.getElementById("welcomePacketOwnerModal")?.remove();document.body.classList.remove("welcome-packet-modal-open");}
  function field(label,name,value,rows=3){return '<label class="wp-field"><span>'+esc(label)+'</span><textarea name="'+name+'" rows="'+rows+'" maxlength="1600">'+esc(value||"")+'</textarea></label>';}
  function renderPreview(){
    const form=document.getElementById("welcomePacketOwnerForm"),box=document.getElementById("welcomePacketOwnerPreview");
    if(!form||!box||!editor) return;
    const fd=new FormData(form),l=normalizeLang(fd.get("packet_language")),u=C[l]||C.en;
    const primary=hex(fd.get("primary_color"),"#2F5F66"),accent=hex(fd.get("accent_color"),"#DDEFF2");
    box.style.setProperty("--wp-primary",primary);box.style.setProperty("--wp-accent",accent);box.style.setProperty("--wp-primary-text",contrast(primary));
    const logo=draftLogo?'<img class="wp-preview-logo" src="'+esc(draftLogo)+'" alt="">':'<span class="wp-preview-mark">'+esc((editor.business_name||"CB").split(/\s+/).map(x=>x[0]||"").join("").slice(0,2).toUpperCase())+'</span>';
    box.innerHTML=
      '<div class="wp-preview-top">'+logo+'<div><small>'+esc(u.preview)+'</small><strong>'+esc(editor.business_name||"Cleaning Business")+'</strong></div></div>'+
      '<div class="wp-preview-hello"><span>'+esc(editor.client_name||"Client")+'</span><p>'+esc(fd.get("welcome_message")||"")+'</p></div>'+
      '<div class="wp-preview-next"><small>'+esc(u.next)+'</small><strong>'+esc(nextCleaning()||u.none)+'</strong></div>'+
      '<div class="wp-preview-mini"><strong>'+esc(u.arrival)+'</strong><p>'+esc(fd.get("before_arrival")||"")+'</p></div>'+
      '<div class="wp-preview-mini"><strong>'+esc(u.prep)+'</strong><p>'+esc(fd.get("home_prep")||"")+'</p></div>'+
      '<div class="wp-preview-mini"><strong>'+esc(u.payment)+'</strong><p>'+esc(fd.get("payment_note")||"")+'</p></div>'+
      '<div class="wp-preview-mini"><strong>'+esc(u.changes)+'</strong><p>'+esc(fd.get("changes_note")||"")+'</p></div>';
  }
  function loadLanguage(l){
    const form=document.getElementById("welcomePacketOwnerForm");if(!form) return;
    const c=savedContent(l);
    ["welcome_message","before_arrival","home_prep","payment_note","changes_note","extra_note"].forEach(k=>{if(form.elements[k]) form.elements[k].value=c[k]||"";});
    renderPreview();
  }
  async function logoData(file){
    if(!file||!/^image\/(png|jpeg|webp)$/i.test(file.type)||file.size>8*1024*1024) throw new Error(t().badLogo);
    const url=URL.createObjectURL(file);
    try{
      const img=new Image(); await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url;});
      const max=420,s=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1));
      const c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.naturalWidth*s));c.height=Math.max(1,Math.round(img.naturalHeight*s));
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      let data=c.toDataURL("image/webp",0.84);
      if(data.length>410000){
        const d=document.createElement("canvas"),ss=Math.min(1,300/Math.max(c.width,c.height));d.width=Math.max(1,Math.round(c.width*ss));d.height=Math.max(1,Math.round(c.height*ss));d.getContext("2d").drawImage(c,0,0,d.width,d.height);data=d.toDataURL("image/webp",0.72);
      }
      if(data.length>410000) throw new Error(t().badLogo);
      return data;
    }finally{URL.revokeObjectURL(url);}
  }
  async function copyText(value){
    try{await navigator.clipboard.writeText(value);}catch{
      const ta=document.createElement("textarea");ta.value=value;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
    }
  }
  function refreshBusinessLogo(){
    const logo=appState.business?.brand_logo_data_url||"";
    for(const id of ["settingsBusinessLogo","workspaceBusinessLogo"]){
      const img=document.getElementById(id);if(!img)continue;
      if(logo){if(img.getAttribute("src")!==logo)img.src=logo;img.hidden=false;}else{img.hidden=true;img.removeAttribute("src");}
    }
    const empty=document.getElementById("settingsBusinessLogoEmpty");if(empty)empty.hidden=Boolean(logo);
    const avatar=document.querySelector(".workspace-avatar");if(avatar)avatar.hidden=Boolean(logo);
  }
  window.TLE_REFRESH_BUSINESS_LOGO=refreshBusinessLogo;
  async function openBrandingSettings(){
    try{
      const businessId=appState.business?.id;
      if(!businessId) throw new Error(t().loadError);
      const {data,error}=await supabase
        .from("businesses")
        .select("id,name,brand_logo_data_url,brand_primary_color,brand_accent_color,welcome_packet_settings")
        .eq("id",businessId)
        .single();
      if(error) throw error;
      if(!data) throw new Error(t().loadError);

      const copy={
        en:{eyebrow:"WELCOME PACKET BRANDING",title:"Logo + colors",intro:"Set your business branding once. It will be used automatically on every client Welcome Packet.",preview:"LIVE PREVIEW",save:"Save branding",saved:"Branding saved",close:"Close",logo:"Business logo",upload:"Upload / replace logo",remove:"Remove logo",primary:"Primary color",accent:"Accent color",hint:"These settings apply to every client Welcome Packet."},
        es:{eyebrow:"MARCA DEL WELCOME PACKET",title:"Logo + colores",intro:"Configura la marca de tu negocio una sola vez. Se usará automáticamente en todos los Welcome Packets de clientes.",preview:"VISTA PREVIA",save:"Guardar marca",saved:"Marca guardada",close:"Cerrar",logo:"Logo del negocio",upload:"Subir / reemplazar logo",remove:"Quitar logo",primary:"Color principal",accent:"Color de acento",hint:"Estos ajustes se aplican a todos los Welcome Packets de clientes."},
        fr:{eyebrow:"IDENTITÉ DU DOSSIER",title:"Logo + couleurs",intro:"Configurez l’identité de votre entreprise une seule fois. Elle sera utilisée automatiquement sur chaque dossier client.",preview:"APERÇU",save:"Enregistrer",saved:"Identité enregistrée",close:"Fermer",logo:"Logo de l’entreprise",upload:"Importer / remplacer",remove:"Retirer",primary:"Couleur principale",accent:"Couleur d’accent",hint:"Ces réglages s’appliquent à tous les dossiers de bienvenue."},
        ht:{eyebrow:"MAK WELCOME PACKET",title:"Logo + koulè",intro:"Mete mak biznis ou yon sèl fwa. Li pral aplike otomatikman sou tout Welcome Packet kliyan yo.",preview:"APERÇU",save:"Sove mak la",saved:"Mak la sove",close:"Fèmen",logo:"Logo biznis la",upload:"Mete / ranplase logo",remove:"Retire logo",primary:"Koulè prensipal",accent:"Koulè aksan",hint:"Ajisteman sa yo aplike sou tout Welcome Packet kliyan yo."}
      };
      const u=copy[lang()]||copy.en;
      draftLogo=data.brand_logo_data_url||"";
      const l=normalizeLang(appState.business?.customer_email_language||appState.business?.default_language||lang());
      const currentContent=Object.assign({},defaults(l,data.name),data.welcome_packet_settings?.[l]||{});

      const root=document.createElement("div");
      root.id="welcomePacketOwnerModal";
      root.className="welcome-packet-modal-overlay";
      root.innerHTML=
        '<section class="welcome-packet-owner-dialog" role="dialog" aria-modal="true">'+
        '<header class="wp-owner-head"><div><small>'+esc(u.eyebrow)+'</small><h2>'+esc(u.title)+'</h2><p>'+esc(u.intro)+'</p></div><button type="button" class="wp-close" data-wp-brand-close>×</button></header>'+
        '<form id="welcomePacketBrandingForm" class="wp-owner-form"><div class="wp-owner-layout"><div class="wp-owner-fields">'+
        '<section class="wp-brand-section"><div class="wp-section-title"><strong>'+esc(u.logo)+'</strong><span>'+esc(u.hint)+'</span></div>'+
        '<div class="wp-logo-row"><div class="wp-logo-current">'+(draftLogo?'<img id="welcomePacketBrandLogoCurrent" src="'+esc(draftLogo)+'" alt="">':'<img id="welcomePacketBrandLogoCurrent" hidden alt=""><span class="wp-no-logo">'+esc(u.logo)+'</span>')+'</div>'+
        '<div class="wp-logo-actions"><label class="wp-file-button">'+esc(u.upload)+'<input type="file" accept="image/png,image/jpeg,image/webp" data-wp-brand-logo-input></label><button type="button" class="wp-link-button" data-wp-brand-remove-logo>'+esc(u.remove)+'</button></div></div>'+
        '<div class="wp-color-grid"><label><span>'+esc(u.primary)+'</span><input type="color" name="primary_color" value="'+esc(hex(data.brand_primary_color,"#2F5F66"))+'"></label><label><span>'+esc(u.accent)+'</span><input type="color" name="accent_color" value="'+esc(hex(data.brand_accent_color,"#DDEFF2"))+'"></label></div></section>'+
        '</div><aside class="wp-owner-preview-wrap"><div id="welcomePacketBrandingPreview" class="wp-owner-preview"></div></aside></div>'+
        '<footer class="wp-owner-footer"><button type="button" class="ghost-btn" data-wp-brand-close>'+esc(u.close)+'</button><button type="submit" class="primary-btn">'+esc(u.save)+'</button></footer></form></section>';

      const renderBrandPreview=()=>{
        const form=root.querySelector("#welcomePacketBrandingForm"),box=root.querySelector("#welcomePacketBrandingPreview");
        if(!form||!box)return;
        const fd=new FormData(form),primary=hex(fd.get("primary_color"),"#2F5F66"),accent=hex(fd.get("accent_color"),"#DDEFF2");
        box.style.setProperty("--wp-primary",primary);
        box.style.setProperty("--wp-accent",accent);
        box.style.setProperty("--wp-primary-text",contrast(primary));
        const logo=draftLogo
          ? '<img class="wp-preview-logo" src="'+esc(draftLogo)+'" alt="">'
          : '<span class="wp-preview-mark">'+esc((data.name||"CB").split(/\s+/).map(x=>x[0]||"").join("").slice(0,2).toUpperCase())+'</span>';
        box.innerHTML=
          '<div class="wp-preview-top">'+logo+'<div><small>'+esc(u.preview)+'</small><strong>'+esc(data.name||"Cleaning Business")+'</strong></div></div>'+
          '<div class="wp-preview-hello"><span>Welcome 👋</span><p>'+esc(currentContent.welcome_message||defaults(l,data.name).welcome_message)+'</p></div>'+
          '<div class="wp-preview-next"><small>YOUR NEXT CLEANING</small><strong>Brand colors preview</strong></div>';
      };

      root.addEventListener("click",e=>{
        if(e.target===root||e.target.closest("[data-wp-brand-close]")){close();return;}
        if(e.target.closest("[data-wp-brand-remove-logo]")){
          draftLogo="";
          const img=root.querySelector("#welcomePacketBrandLogoCurrent");if(img)img.hidden=true;
          renderBrandPreview();
        }
      });

      const form=root.querySelector("#welcomePacketBrandingForm");
      form.addEventListener("input",renderBrandPreview);
      form.addEventListener("change",async e=>{
        if(!e.target.matches("[data-wp-brand-logo-input]"))return;
        try{
          const f=e.target.files?.[0];if(!f)return;
          draftLogo=await logoData(f);
          const img=root.querySelector("#welcomePacketBrandLogoCurrent");
          if(img){img.src=draftLogo;img.hidden=false;}
          root.querySelector(".wp-no-logo")?.remove();
          renderBrandPreview();
        }catch(err){toast(err?.message||t().badLogo);e.target.value="";}
      });
      form.addEventListener("submit",async e=>{
        e.preventDefault();
        const b=e.submitter||form.querySelector('button[type="submit"]'),old=b?.textContent||u.save;
        if(b){b.disabled=true;b.textContent="Saving…";}
        try{
          const fd=new FormData(form);
          const {data:saved,error:saveError}=await supabase.rpc("save_welcome_packet_branding",{
            p_business_id:data.id,
            p_logo_data_url:draftLogo||null,
            p_primary_color:hex(fd.get("primary_color"),"#2F5F66"),
            p_accent_color:hex(fd.get("accent_color"),"#DDEFF2"),
            p_language:l,
            p_content:currentContent
          });
          if(saveError) throw saveError;
          if(appState.business){
            appState.business.brand_logo_data_url=saved?.brand_logo_data_url||null;
            appState.business.brand_primary_color=saved?.brand_primary_color||hex(fd.get("primary_color"),"#2F5F66");
            appState.business.brand_accent_color=saved?.brand_accent_color||hex(fd.get("accent_color"),"#DDEFF2");
          }
          refreshBusinessLogo();
          toast(u.saved);
          renderBrandPreview();
        }catch(err){toast(err?.message||t().saveError);}
        finally{if(b){b.disabled=false;b.textContent=old;}}
      });

      document.getElementById("welcomePacketOwnerModal")?.remove();
      document.body.appendChild(root);
      document.body.classList.add("welcome-packet-modal-open");
      renderBrandPreview();
    }catch(err){toast(err?.message||t().loadError);}
  }

  function bind(){
    const root=document.getElementById("welcomePacketOwnerModal"),form=document.getElementById("welcomePacketOwnerForm");if(!root||!form) return;
    root.addEventListener("click",async e=>{
      if(e.target===root||e.target.closest("[data-wp-close]")){close();return;}
      if(e.target.closest("[data-wp-remove-logo]")){draftLogo="";const img=document.getElementById("welcomePacketLogoCurrent");if(img)img.hidden=true;const dl=root.querySelector("[data-wp-download-logo]");if(dl)dl.hidden=true;renderPreview();return;}
      if(e.target.closest("[data-wp-download-logo]")&&draftLogo){const a=document.createElement("a");a.href=draftLogo;a.download="business-logo.webp";a.click();return;}
      const l=normalizeLang(form.elements.packet_language.value),url=packetUrl(editor.welcome_packet_token,l);
      if(e.target.closest("[data-wp-copy-link]")){await copyText(url);toast(t().copied);return;}
      if(e.target.closest("[data-wp-open-link]")){window.open(url,"_blank","noopener");return;}
      if(e.target.closest("[data-wp-share-link]")){if(navigator.share){try{await navigator.share({title:editor.business_name+" Welcome Packet",text:t().shareText,url});}catch{}}else{await copyText(url);toast(t().copied);}return;}
    });
    form.addEventListener("input",e=>{if(e.target.name==="packet_language")loadLanguage(normalizeLang(e.target.value));else renderPreview();});
    form.addEventListener("change",async e=>{
      if(!e.target.matches("[data-wp-logo-input]")) return;
      try{const f=e.target.files?.[0];if(!f)return;draftLogo=await logoData(f);const img=document.getElementById("welcomePacketLogoCurrent");if(img){img.src=draftLogo;img.hidden=false;}
          root.querySelector(".wp-no-logo")?.remove();const dl=root.querySelector("[data-wp-download-logo]");if(dl)dl.hidden=false;renderPreview();}catch(err){toast(err?.message||t().badLogo);e.target.value="";}
    });
    form.addEventListener("submit",async e=>{
      e.preventDefault();const b=e.submitter||form.querySelector('button[type="submit"]'),old=b?.textContent||"";if(b){b.disabled=true;b.textContent="Saving…";}
      try{
        const fd=new FormData(form),l=normalizeLang(fd.get("packet_language"));
        const content={welcome_message:String(fd.get("welcome_message")||"").trim(),before_arrival:String(fd.get("before_arrival")||"").trim(),home_prep:String(fd.get("home_prep")||"").trim(),payment_note:String(fd.get("payment_note")||"").trim(),changes_note:String(fd.get("changes_note")||"").trim(),extra_note:String(fd.get("extra_note")||"").trim()};
        const {data,error}=await supabase.rpc("save_welcome_packet_branding",{p_business_id:editor.business_id,p_logo_data_url:draftLogo||null,p_primary_color:hex(fd.get("primary_color"),"#2F5F66"),p_accent_color:hex(fd.get("accent_color"),"#DDEFF2"),p_language:l,p_content:content});
        if(error) throw error;
        editor={...editor,...data};editor.welcome_packet_settings=data?.welcome_packet_settings||editor.welcome_packet_settings||{};toast(t().saved);renderPreview();
      }catch(err){toast(err?.message||t().saveError);}finally{if(b){b.disabled=false;b.textContent=old||t().save;}}
    });
  }
  async function openEditor(clientId){
    try{
      const {data,error}=await supabase.rpc("get_welcome_packet_editor",{p_client_id:clientId});if(error)throw error;if(!data)throw new Error(t().loadError);
      editor=data;draftLogo=editor.brand_logo_data_url||"";
      const l=normalizeLang(editor.client_preferred_language||appState.business?.customer_email_language||"en"),content=savedContent(l),u=t();
      const root=document.createElement("div");root.id="welcomePacketOwnerModal";root.className="welcome-packet-modal-overlay";
      root.innerHTML=
        '<section class="welcome-packet-owner-dialog" role="dialog" aria-modal="true">'+
        '<header class="wp-owner-head"><div><small>'+esc(u.eyebrow)+'</small><h2>'+esc(u.title)+'</h2><p>'+esc(u.intro)+'</p></div><button type="button" class="wp-close" data-wp-close>×</button></header>'+
        '<form id="welcomePacketOwnerForm" class="wp-owner-form"><div class="wp-owner-layout"><div class="wp-owner-fields">'+
        '<section class="wp-brand-section"><div class="wp-section-title"><strong>'+esc(u.brand)+'</strong><span>'+esc(u.brandHelp)+'</span></div>'+
        '<div class="wp-logo-row"><div class="wp-logo-current">'+(draftLogo?'<img id="welcomePacketLogoCurrent" src="'+esc(draftLogo)+'" alt="">':'<img id="welcomePacketLogoCurrent" hidden alt="">')+'</div>'+
        '<div class="wp-logo-actions"><label class="wp-file-button">'+esc(u.upload)+'<input type="file" accept="image/png,image/jpeg,image/webp" data-wp-logo-input></label><button type="button" class="wp-link-button" data-wp-remove-logo>'+esc(u.remove)+'</button><button type="button" class="wp-link-button" data-wp-download-logo '+(draftLogo?"":"hidden")+'>'+esc(u.download)+'</button></div></div>'+
        '<div class="wp-color-grid"><label><span>'+esc(u.primary)+'</span><input type="color" name="primary_color" value="'+esc(hex(editor.brand_primary_color,"#2F5F66"))+'"></label><label><span>'+esc(u.accent)+'</span><input type="color" name="accent_color" value="'+esc(hex(editor.brand_accent_color,"#DDEFF2"))+'"></label></div></section>'+
        '<label class="wp-field"><span>'+esc(u.language)+'</span><select name="packet_language">'+LANGS.map(x=>'<option value="'+x+'" '+(x===l?"selected":"")+'>'+esc(LANG_LABELS[x])+'</option>').join("")+'</select><small>'+esc(u.languageHelp)+'</small></label>'+
        field(u.message,"welcome_message",content.welcome_message,4)+field(u.arrival,"before_arrival",content.before_arrival)+field(u.prep,"home_prep",content.home_prep)+field(u.payment,"payment_note",content.payment_note)+field(u.changes,"changes_note",content.changes_note)+field(u.extra,"extra_note",content.extra_note)+
        '</div><aside class="wp-owner-preview-wrap"><div id="welcomePacketOwnerPreview" class="wp-owner-preview"></div></aside></div>'+
        '<footer class="wp-owner-footer"><button type="button" class="ghost-btn" data-wp-close>'+esc(u.close)+'</button><div class="wp-owner-footer-share"><button type="button" class="ghost-btn" data-wp-open-link>'+esc(u.open)+'</button><button type="button" class="ghost-btn" data-wp-copy-link>'+esc(u.copy)+'</button><button type="button" class="ghost-btn" data-wp-share-link>'+esc(u.share)+'</button></div><button type="submit" class="primary-btn">'+esc(u.save)+'</button></footer></form></section>';
      document.getElementById("welcomePacketOwnerModal")?.remove();document.body.appendChild(root);document.body.classList.add("welcome-packet-modal-open");bind();renderPreview();
    }catch(err){toast(err?.message||t().loadError);}
  }
  function injectInfo(clientId){
    const footer=document.querySelector(".client-history-footer");if(!footer||footer.querySelector("[data-open-welcome-packet]"))return;
    const b=document.createElement("button");b.type="button";b.className="ghost-btn client-welcome-packet-btn";b.dataset.openWelcomePacket=clientId;b.textContent=t().title;
    const edit=footer.querySelector('[data-edit="client"]');edit?footer.insertBefore(b,edit):footer.appendChild(b);
  }
  function enhanceCards(){
    document.querySelectorAll("[data-client-info]").forEach(info=>{
      const actions=info.closest(".client-card")?.querySelector(".safe-actions");if(!actions||actions.querySelector("[data-open-welcome-packet]"))return;
      const b=document.createElement("button");b.type="button";b.dataset.openWelcomePacket=info.dataset.clientInfo;b.textContent=t().card;info.insertAdjacentElement("afterend",b);
    });
  }
  function queue(){
    if(observerQueued)return;observerQueued=true;requestAnimationFrame(()=>{observerQueued=false;enhanceCards();refreshBusinessLogo();});
  }
  document.addEventListener("click",e=>{
    const info=e.target.closest("[data-client-info]");if(info){setTimeout(()=>injectInfo(info.dataset.clientInfo),40);}
    const brand=e.target.closest("[data-open-welcome-branding]");if(brand){e.preventDefault();e.stopPropagation();openBrandingSettings();return;}
    const open=e.target.closest("[data-open-welcome-packet]");if(open){e.preventDefault();e.stopPropagation();openEditor(open.dataset.openWelcomePacket);}
  });
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  window.addEventListener("tle:languagechange",queue);
  queue();
})();
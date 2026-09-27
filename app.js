(()=>{
if(!window.supabase){
  document.documentElement.dataset.appError="supabase-load-failed";
  throw new Error("Supabase browser library failed to load");
}
const { createClient } = window.supabase;

const SUPABASE_URL = "https://bowacxhmjvrqixtwaikv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0TueitFYiRF3rAEMLMT8-w_FvbvY0rB";
const PRIMARY_PLATFORM_ADMIN_EMAIL = "dailinsegura17@gmail.com";
function isPrimaryPlatformAdminAccount(){
  return String(state?.session?.user?.email||"").trim().toLowerCase()===PRIMARY_PLATFORM_ADMIN_EMAIL;
}
const LEGACY_PLATFORM_ADMIN_EMAIL = "dailinsegura04@gmail.com";
const OWNER_IDLE_MS = 12 * 60 * 60 * 1000;
const OWNER_ACTIVITY_KEY = "tle_owner_last_activity";
const OWNER_EMAIL_KEY = "tle_owner_email";
const OWNER_REAUTH_REQUIRED_KEY = "tle_owner_reauth_required";
const OWNER_SESSION_BACKUP_KEY = "tle_owner_session_backup_v1";
const APP_VERSION = "20260927-unified-42";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY,{
  auth:{
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:true,
    storage:window.localStorage
  }
});

try{
  const lastAdmin=String(localStorage.getItem("tle_last_admin_email")||"").trim().toLowerCase();
  if(lastAdmin===LEGACY_PLATFORM_ADMIN_EMAIL){
    localStorage.setItem("tle_last_admin_email",PRIMARY_PLATFORM_ADMIN_EMAIL);
    localStorage.setItem("tle_admin_emails",JSON.stringify([PRIMARY_PLATFORM_ADMIN_EMAIL]));
  }
}catch{}

const state = {
  session: null,
  business: null,
  clients: [],
  leads: [],
  invoices: [],
  bookingRequests: [],
  mileageLogs: [],
  timeEntries: [],
  services: [],
  serviceAddons: [],
  availabilityRules: [],
  supplies: [],
  jobs: [],
  quotes: [],
  disputes: [],
  teamMembers: [],
  members: [],
  invites: [],
  publicLinks: null,
  isPlatformAdmin: false,
  platformAdminData: null,
  weather: null,
  weatherArea: null,
  weatherFetchedAt: 0,
  inquirySeenAt: 0,
  inquirySeenLoadedFor: null,
  inquiryReadIds: new Set(),
  workerPortal: null,
  workerMessages: [],
  teamMessageThreads: [],
  teamMessages: [],
  activeTeamMessageMemberId: null,
  currentWorkerLink: null,
  authMode: "signup",
  modalType: null,
  modalId: null
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const authShell = $("#authShell");
const workerShell = $("#workerShell");
const publicShell = $("#publicShell");
const appShell = $("#appShell");
const authPanel = $("#authPanel");
const businessSetup = $("#businessSetup");
const authForm = $("#authForm");
const businessForm = $("#businessForm");
const entityForm = $("#entityForm");
const modal = $("#modalBackdrop");

let __tleModalScrollY=0;
function syncModalScrollLock(){
  if(!modal) return;
  const open=!modal.hidden;
  if(open && !document.body.classList.contains("modal-open")){
    __tleModalScrollY=window.scrollY||document.documentElement.scrollTop||0;
    document.body.style.top="-"+__tleModalScrollY+"px";
    document.body.classList.add("modal-open");
  }else if(!open && document.body.classList.contains("modal-open")){
    document.body.classList.remove("modal-open");
    document.body.style.top="";
    window.scrollTo(0,__tleModalScrollY);
  }
}
if(modal){
  new MutationObserver(syncModalScrollLock).observe(modal,{attributes:true,attributeFilter:["hidden"]});
  syncModalScrollLock();
}
const toastEl = $("#toast");
const sidebar = $("#sidebar");
const pageTitle = $("#pageTitle");
const backBtn = $("#backBtn");
const navHistory=["today"];

// Auth controls must be interactive immediately, even while session/network boot continues.
document.addEventListener("click",e=>{
  const toggle=e.target.closest?.("#authPasswordToggle");
  if(!toggle) return;
  e.preventDefault();
  toggleAuthPasswordVisibility();
},true);
window.__tleAuthUiReady=true;

const pageTitles = {
  today:"Today", booking:"Booking Center", leads:"Leads", clients:"Clients",
  calendar:"Calendar + Jobs", quotes:"Quotes", invoices:"Invoices",
  route:"Today's Route", mileage:"Mileage", time:"Time Tracking",
  reports:"Owner Reports", services:"Services + Add-ons", supplies:"Supplies", team:"Team", settings:"Settings", admin:"Owner Admin", "platform-admin":"Platform Admin", help:"Help & FAQ"
};


const ONBOARDING_VERSION=1;
const ONBOARDING_COPY={
  welcome:{
    en:{kicker:"YOU’RE IN",title:"Thanks for choosing The Launch Era Cleaning App.",text:"Your account is ready. We’ll stay with you for the first few steps so you can see where everything lives without having to figure it out alone."},
    es:{kicker:"YA ESTÁS DENTRO",title:"Gracias por usar The Launch Era Cleaning App.",text:"Tu cuenta ya está lista. Te acompañaremos en los primeros pasos para que veas dónde está cada cosa sin tener que descubrirlo todo sola."}
  },
  today:{
    en:{title:"Today",text:"Your daily snapshot: today’s jobs, booking requests, open quotes, invoices and quick actions."},
    es:{title:"Hoy",text:"Tu resumen diario: trabajos de hoy, solicitudes de reserva, cotizaciones, facturas y acciones rápidas."}
  },
  booking:{
    en:{title:"Booking Center",text:"Manage booking requests, availability and the public booking link your clients use."},
    es:{title:"Centro de reservas",text:"Maneja solicitudes de reserva, disponibilidad y el enlace público que usan tus clientes."}
  },
  leads:{
    en:{title:"Leads",text:"Keep potential customers here before they become active clients or booked jobs."},
    es:{title:"Leads",text:"Guarda aquí clientes potenciales antes de convertirlos en clientes activos o trabajos reservados."}
  },
  clients:{
    en:{title:"Clients",text:"Store client contact details, service addresses and the records you need for future jobs."},
    es:{title:"Clientes",text:"Guarda datos de contacto, direcciones de servicio y la información que necesitas para futuros trabajos."}
  },
  calendar:{
    en:{title:"Calendar + Jobs",text:"See upcoming jobs and open dates so you can plan the schedule without double-booking."},
    es:{title:"Calendario + trabajos",text:"Mira los próximos trabajos y fechas disponibles para organizarte sin duplicar reservas."}
  },
  quotes:{
    en:{title:"Quotes",text:"Review requests, build estimates, send them to clients and track whether they are accepted or declined."},
    es:{title:"Cotizaciones",text:"Revisa solicitudes, prepara estimados, envíalos al cliente y controla si fueron aceptados o rechazados."}
  },
  invoices:{
    en:{title:"Invoices",text:"Create and send invoices, then record the payment method your business accepts when the client pays."},
    es:{title:"Facturas",text:"Crea y envía facturas y registra la forma de pago que acepta tu negocio cuando el cliente pague."}
  },
  route:{
    en:{title:"Today’s Route",text:"See today’s stops in order so you and your team know where to go next."},
    es:{title:"Ruta de hoy",text:"Mira las paradas de hoy en orden para que tú y tu equipo sepan cuál sigue."}
  },
  mileage:{
    en:{title:"Mileage",text:"Log business distance connected to jobs so your driving records stay organized."},
    es:{title:"Millaje",text:"Registra las millas del negocio vinculadas a trabajos para mantener tus recorridos organizados."}
  },
  time:{
    en:{title:"Time Tracking",text:"Start and stop work timers and keep track of hours worked on jobs."},
    es:{title:"Control de tiempo",text:"Inicia y detén temporizadores de trabajo y lleva control de las horas trabajadas."}
  },
  reports:{
    en:{title:"Owner Reports",text:"Owner-only view of business activity, totals and operational performance."},
    es:{title:"Reportes del dueño",text:"Vista solo para el dueño con actividad, totales y desempeño operativo del negocio."}
  },
  services:{
    en:{title:"Services + Add-ons",text:"Create the services, prices and extras used in bookings, quotes and invoices."},
    es:{title:"Servicios + extras",text:"Crea los servicios, precios y extras que usarás en reservas, cotizaciones y facturas."}
  },
  supplies:{
    en:{title:"Supplies",text:"Keep your cleaning supply list organized so you know what the business needs."},
    es:{title:"Suministros",text:"Mantén organizada tu lista de productos de limpieza para saber qué necesita el negocio."}
  },
  team:{
    en:{title:"Team",text:"Add employees, assign jobs, share Guest Employee Access and message them without exposing owner controls."},
    es:{title:"Equipo",text:"Añade empleados, asigna trabajos, comparte acceso de invitado y envíales mensajes sin mostrar controles del dueño."}
  },
  settings:{
    en:{title:"Settings",text:"Edit company details, booking rules, payment options, client emails and your review link."},
    es:{title:"Configuración",text:"Edita datos de la compañía, reglas de reserva, pagos, correos al cliente y enlace de reseñas."}
  },
  admin:{
    en:{title:"Owner Admin",text:"Sensitive owner controls live here: access, permissions, integrations and account-level settings."},
    es:{title:"Admin del dueño",text:"Aquí están los controles sensibles del dueño: accesos, permisos, integraciones y ajustes de la cuenta."}
  },
  help:{
    en:{title:"Help & FAQ",text:"Find setup help, access instructions and common answers. You can restart this guided tour here anytime."},
    es:{title:"Ayuda y preguntas",text:"Encuentra ayuda de configuración, instrucciones de acceso y respuestas comunes. Aquí puedes reiniciar este recorrido cuando quieras."}
  },
  "platform-admin":{
    en:{title:"Platform Admin",text:"Internal Launch Era controls for app customers, subscriptions and product activity."},
    es:{title:"Platform Admin",text:"Controles internos de The Launch Era para clientes de la app, suscripciones y actividad del producto."}
  }
};

const ONBOARDING_EXTRA={
  pt:{
    welcome:{kicker:"BEM-VINDO",title:"Obrigado por usar o The Launch Era Cleaning App.",text:"Sua conta está pronta. Vamos acompanhar seus primeiros passos para você entender onde fica cada coisa sem precisar descobrir tudo sozinho."},
    today:{title:"Hoje",text:"Seu resumo do dia: trabalhos, pedidos de reserva, orçamentos, faturas e ações rápidas."},
    booking:{title:"Reservas",text:"Gerencie pedidos de reserva, disponibilidade e o link público usado pelos clientes."},
    leads:{title:"Leads",text:"Guarde clientes potenciais aqui antes de virarem clientes ativos ou trabalhos agendados."},
    clients:{title:"Clientes",text:"Guarde contatos, endereços de serviço e informações necessárias para trabalhos futuros."},
    calendar:{title:"Calendário + trabalhos",text:"Veja próximos trabalhos e horários livres para organizar a agenda sem reservas duplicadas."},
    quotes:{title:"Orçamentos",text:"Revise pedidos, crie orçamentos, envie aos clientes e acompanhe se foram aceitos ou recusados."},
    invoices:{title:"Faturas",text:"Crie e envie faturas e registre a forma de pagamento aceita pela sua empresa."},
    route:{title:"Rota de hoje",text:"Veja as paradas do dia em ordem para saber para onde ir em seguida."},
    mileage:{title:"Quilometragem",text:"Registre distâncias de trabalho ligadas aos serviços para manter os deslocamentos organizados."},
    time:{title:"Controle de tempo",text:"Inicie e finalize cronômetros para acompanhar o tempo trabalhado em cada serviço."},
    reports:{title:"Relatórios",text:"Veja atividade, totais e desempenho operacional do negócio."},
    services:{title:"Serviços + extras",text:"Crie serviços, preços e extras usados em reservas, orçamentos e faturas."},
    supplies:{title:"Materiais",text:"Organize os produtos de limpeza para saber o que precisa ser reposto."},
    team:{title:"Equipe",text:"Adicione funcionários, atribua trabalhos, compartilhe acesso de convidado e envie mensagens sem expor controles do proprietário."},
    settings:{title:"Configurações",text:"Edite dados da empresa, regras de reserva, pagamentos, e-mails aos clientes e links."},
    admin:{title:"Admin do proprietário",text:"Controles sensíveis ficam aqui: acessos, permissões, integrações e configurações da conta."},
    help:{title:"Ajuda e FAQ",text:"Encontre ajuda de configuração, instruções de acesso e respostas comuns. Você pode reiniciar este tour quando quiser."}
  },
  fr:{
    welcome:{kicker:"BIENVENUE",title:"Merci d’utiliser The Launch Era Cleaning App.",text:"Votre compte est prêt. Nous allons vous accompagner dans les premières étapes pour que vous sachiez où tout se trouve sans devoir tout découvrir seul."},
    today:{title:"Aujourd’hui",text:"Votre résumé du jour : travaux, demandes de réservation, devis, factures et actions rapides."},
    booking:{title:"Réservations",text:"Gérez les demandes de réservation, les disponibilités et le lien public utilisé par vos clients."},
    leads:{title:"Prospects",text:"Gardez les clients potentiels ici avant qu’ils deviennent des clients actifs ou des travaux réservés."},
    clients:{title:"Clients",text:"Conservez les coordonnées, adresses de service et informations nécessaires pour les prochains travaux."},
    calendar:{title:"Calendrier + travaux",text:"Consultez les travaux à venir et les créneaux libres pour éviter les doubles réservations."},
    quotes:{title:"Devis",text:"Examinez les demandes, créez des devis, envoyez-les et suivez leur acceptation ou leur refus."},
    invoices:{title:"Factures",text:"Créez et envoyez des factures puis enregistrez le mode de paiement accepté par votre entreprise."},
    route:{title:"Itinéraire du jour",text:"Voyez les arrêts du jour dans l’ordre pour savoir où aller ensuite."},
    mileage:{title:"Kilométrage",text:"Enregistrez les déplacements professionnels liés aux travaux pour garder vos trajets organisés."},
    time:{title:"Suivi du temps",text:"Démarrez et arrêtez les chronomètres pour suivre le temps travaillé sur chaque intervention."},
    reports:{title:"Rapports",text:"Consultez l’activité, les totaux et les performances opérationnelles de l’entreprise."},
    services:{title:"Services + options",text:"Créez les services, prix et options utilisés dans les réservations, devis et factures."},
    supplies:{title:"Fournitures",text:"Organisez les produits de nettoyage pour savoir ce qui doit être réapprovisionné."},
    team:{title:"Équipe",text:"Ajoutez des employés, attribuez des travaux, partagez un accès invité et échangez des messages sans exposer les contrôles du propriétaire."},
    settings:{title:"Paramètres",text:"Modifiez les informations de l’entreprise, les règles de réservation, paiements, e-mails clients et liens."},
    admin:{title:"Administration propriétaire",text:"Les contrôles sensibles sont ici : accès, permissions, intégrations et paramètres du compte."},
    help:{title:"Aide et FAQ",text:"Trouvez l’aide de configuration, les instructions d’accès et les réponses fréquentes. Vous pouvez relancer ce guide à tout moment."}
  }
};

function onboardingLanguage(){
  const language=String(window.TLE_I18N?.language||localStorage.getItem("tle_language")||"en").toLowerCase();
  return ["en","es","pt","fr"].includes(language)?language:"en";
}
function signupWelcomeKey(email=""){
  return "tle_signup_welcome_pending:"+String(email||"").trim().toLowerCase();
}
function markSignupWelcomePending(email=""){
  const normalized=String(email||"").trim().toLowerCase();
  if(!normalized) return;
  try{localStorage.setItem(signupWelcomeKey(normalized),"1");}catch{}
}
function hasLocalSignupWelcomePending(){
  const email=String(state.session?.user?.email||"").trim().toLowerCase();
  if(!email) return false;
  try{return localStorage.getItem(signupWelcomeKey(email))==="1";}catch{return false;}
}
function clearLocalSignupWelcomePending(){
  const email=String(state.session?.user?.email||"").trim().toLowerCase();
  if(!email) return;
  try{localStorage.removeItem(signupWelcomeKey(email));}catch{}
}
function hasAccountSignupWelcomePending(){
  const meta=state.session?.user?.user_metadata||{};
  return meta.tle_new_signup===true && meta.tle_signup_welcome_seen!==true;
}
async function clearSignupWelcomeMarker(){
  clearLocalSignupWelcomePending();
  try{
    if(!state.session?.user) return;
    const {data,error}=await supabase.auth.updateUser({
      data:{tle_new_signup:false,tle_signup_welcome_seen:true}
    });
    if(error) throw error;
    if(data?.user && state.session) state.session.user=data.user;
  }catch(err){
    console.warn("[TLE] signup welcome marker",err);
  }
}
function onboardingStorageKey(){
  const business=state.business?.id||"business";
  const user=state.session?.user?.id||state.business?.team_member_id||"device";
  return `tle_guided_onboarding_v${ONBOARDING_VERSION}:${business}:${user}`;
}
function getOnboardingState(){
  try{
    return JSON.parse(localStorage.getItem(onboardingStorageKey())||"{}");
  }catch{
    return {};
  }
}
function saveOnboardingState(value){
  localStorage.setItem(onboardingStorageKey(),JSON.stringify(value||{}));
}
function ensureOnboardingUi(){
  let layer=$("#tleOnboardingLayer");
  if(layer) return layer;
  layer=document.createElement("div");
  layer.id="tleOnboardingLayer";
  layer.className="onboarding-layer";
  layer.hidden=true;
  layer.innerHTML=`
    <div class="onboarding-card" role="dialog" aria-modal="false" aria-live="polite">
      <div class="onboarding-topline">
        <span class="pill yellow" id="onboardingKicker">FIRST TIME TIP</span>
        <button class="onboarding-close" id="onboardingCloseBtn" type="button" aria-label="Close">×</button>
      </div>
      <h3 id="onboardingTitle"></h3>
      <p id="onboardingText"></p>
      <small id="onboardingOnceNote"></small>
      <div class="onboarding-actions">
        <button class="text-btn" id="onboardingSkipBtn" type="button"></button>
        <button class="primary-btn" id="onboardingDoneBtn" type="button"></button>
      </div>
    </div>`;
  document.body.appendChild(layer);

  $("#onboardingCloseBtn",layer).addEventListener("click",()=>{
    const current=window.__tleOnboardingCurrent;
    if(current?.key==="welcome") completeCurrentOnboardingTip();
    else hideOnboardingTip();
  });
  $("#onboardingDoneBtn",layer).addEventListener("click",()=>completeCurrentOnboardingTip());
  $("#onboardingSkipBtn",layer).addEventListener("click",()=>disableOnboardingTips());
  return layer;
}
function hideOnboardingTip(){
  const layer=$("#tleOnboardingLayer");
  if(layer) layer.hidden=true;
  window.__tleOnboardingCurrent=null;
}
function disableOnboardingTips(){
  const progress=getOnboardingState();
  progress.disabled=true;
  progress.welcome=true;
  saveOnboardingState(progress);
  hideOnboardingTip();
}
function completeCurrentOnboardingTip(){
  const current=window.__tleOnboardingCurrent;
  if(!current) return hideOnboardingTip();
  const progress=getOnboardingState();

  if(current.key==="welcome"){
    progress.welcome=true;
    progress.disabled=false;
    saveOnboardingState(progress);
    hideOnboardingTip();
    clearSignupWelcomeMarker().catch(()=>{});
    setTimeout(()=>maybeShowFeatureIntro($(".view.active")?.dataset.page||"today",true),180);
    return;
  }

  progress.seen={...(progress.seen||{}),[current.key]:true};
  saveOnboardingState(progress);
  hideOnboardingTip();
}
function renderOnboardingTip(key,kind="feature"){
  const copy=ONBOARDING_COPY[key];
  if(!copy) return;
  const lang=onboardingLanguage();
  const words=copy[lang]||ONBOARDING_EXTRA?.[lang]?.[key]||copy.en;
  const layer=ensureOnboardingUi();
  const isWelcome=key==="welcome";
  window.__tleOnboardingCurrent={key,kind};

  $("#onboardingKicker",layer).textContent=isWelcome
    ? words.kicker
    : (lang==="es"?"PRIMERA VEZ":"FIRST TIME TIP");
  $("#onboardingTitle",layer).textContent=words.title;
  $("#onboardingText",layer).textContent=words.text;
  $("#onboardingOnceNote",layer).textContent=isWelcome
    ? ({es:"Cierra este mensaje y te mostramos lo esencial paso a paso.",pt:"Feche esta mensagem e mostraremos o essencial passo a passo.",fr:"Fermez ce message et nous vous montrerons l’essentiel étape par étape.",en:"Close this message and we’ll show you the essentials step by step."}[lang]||"Close this message and we’ll show you the essentials step by step.")
    : ({es:"Este tip solo aparece una vez.",pt:"Esta dica aparece apenas uma vez.",fr:"Cette astuce n’apparaît qu’une seule fois.",en:"You’ll only see this tip once."}[lang]||"You’ll only see this tip once.");
  $("#onboardingDoneBtn",layer).textContent=isWelcome
    ? ({es:"Empezar recorrido",pt:"Iniciar tour",fr:"Commencer le guide",en:"Start tour"}[lang]||"Start tour")
    : ({es:"Entendido",pt:"Entendi",fr:"Compris",en:"Got it"}[lang]||"Got it");
  $("#onboardingSkipBtn",layer).hidden=isWelcome;
  if(!isWelcome) $("#onboardingSkipBtn",layer).textContent=({es:"No mostrar más tips",pt:"Não mostrar mais dicas",fr:"Ne plus afficher les astuces",en:"Hide tips"}[lang]||"Hide tips");
  $("#onboardingCloseBtn",layer).setAttribute("aria-label",({es:"Cerrar",pt:"Fechar",fr:"Fermer",en:"Close"}[lang]||"Close"));
  layer.classList.toggle("welcome",isWelcome);
  if(!isWelcome) $("#onboardingSkipBtn",layer).hidden=false;
  layer.hidden=false;
}
function maybeShowOnboardingWelcome(){
  if(!state.business || !state.session) return;
  const progress=getOnboardingState();
  if(progress.disabled || progress.welcome) return;
  if(!appShell || appShell.hidden) return;
  if(!window.__tleShowSignupWelcome) return;
  window.__tleShowSignupWelcome=false;
  renderOnboardingTip("welcome","welcome");
}
function maybeShowFeatureIntro(id,force=false){
  if(!state.business || !ONBOARDING_COPY[id]) return;
  const progress=getOnboardingState();
  if(progress.disabled || !progress.welcome) return;
  if(progress.seen?.[id] && !force) return;
  if($("#tleOnboardingLayer") && !$("#tleOnboardingLayer").hidden) return;
  renderOnboardingTip(id,"feature");
}
function scheduleOnboardingWelcome(){
  clearTimeout(window.__tleOnboardingWelcomeTimer);
  window.__tleOnboardingWelcomeTimer=setTimeout(maybeShowOnboardingWelcome,650);
}
function restartGuidedOnboarding(){
  saveOnboardingState({welcome:false,seen:{},disabled:false});
  hideOnboardingTip();
  openView("today");
  setTimeout(()=>renderOnboardingTip("welcome","welcome"),180);
}

window.addEventListener("tle:languagechange",()=>{
  const current=window.__tleOnboardingCurrent;
  if(current && !$("#tleOnboardingLayer")?.hidden){
    renderOnboardingTip(current.key,current.kind);
  }
});

function syncLegalLinks(){
  const isEs=window.TLE_I18N?.language==="es";
  const base="https://thelaunchera.com/";
  $$(".legal-privacy-link").forEach(a=>a.href=base+(isEs?"es/privacy.html":"privacy.html"));
  $$(".legal-terms-link").forEach(a=>a.href=base+(isEs?"es/terms.html":"terms.html"));
}
window.addEventListener("tle:languagechange",syncLegalLinks);
setTimeout(syncLegalLinks,0);

function appLanguage(){
  return String(window.TLE_I18N?.language||state.business?.default_language||"en").toLowerCase();
}
function appIsSpanish(){
  return appLanguage()==="es";
}
function langPick(en,es,pt,fr){
  const map={en,en:en,es,pt,fr};
  return map[appLanguage()] ?? en;
}
function appLocale(){
  return state.business?.locale_code
    || ({en:"en-US",es:"es-ES",pt:"pt-BR",fr:"fr-FR"}[appLanguage()])
    || navigator.language
    || "en-US";
}
function businessCurrency(){
  return String(state.business?.currency_code||state.publicLinks?.currency_code||"USD").toUpperCase();
}
function businessDistanceUnit(){
  return state.business?.distance_unit==="km"?"km":"mi";
}
function businessTemperatureUnit(){
  return state.business?.temperature_unit==="celsius"?"celsius":"fahrenheit";
}
function temperatureSuffix(){
  return businessTemperatureUnit()==="celsius"?"°C":"°F";
}
function distanceFromStoredMiles(value){
  const miles=Number(value||0);
  return businessDistanceUnit()==="km"?miles*1.609344:miles;
}
function distanceToStoredMiles(value){
  const amount=Number(value||0);
  return businessDistanceUnit()==="km"?amount/1.609344:amount;
}
function distanceText(value){
  return Number(distanceFromStoredMiles(value)||0).toFixed(1)+" "+businessDistanceUnit();
}
function tr(value){
  return window.TLE_I18N?.t ? window.TLE_I18N.t(value) : value;
}
function translatedStatus(value=""){
  const raw=String(value||"").replaceAll("_"," ");
  const map={
    requested:"Requested",draft:"Draft",sent:"Sent",accepted:"Accepted",declined:"Declined",
    completed:"Completed",in_progress:"In progress",scheduled:"Scheduled",canceled:"Canceled",
    paid:"Paid",void:"Void",new:"New",contacted:"Contacted",qualified:"Qualified",
    quoted:"Quoted",booked:"Booked",lost:"Lost",confirmed:"Confirmed",pending:"Pending"
  };
  return tr(map[String(value||"").toLowerCase()]||raw);
}
function weatherCodeMeta(code){
  const n=Number(code);
  if(n===0) return {icon:"☀️",en:"Clear",es:"Despejado",pt:"Limpo",fr:"Dégagé"};
  if([1,2].includes(n)) return {icon:"🌤️",en:"Partly cloudy",es:"Parcialmente nublado",pt:"Parcialmente nublado",fr:"Partiellement nuageux"};
  if(n===3) return {icon:"☁️",en:"Cloudy",es:"Nublado",pt:"Nublado",fr:"Nuageux"};
  if([45,48].includes(n)) return {icon:"🌫️",en:"Foggy",es:"Neblina",pt:"Neblina",fr:"Brume"};
  if([51,53,55,56,57].includes(n)) return {icon:"🌦️",en:"Drizzle",es:"Llovizna",pt:"Garoa",fr:"Bruine"};
  if([61,63,65,66,67,80,81,82].includes(n)) return {icon:"🌧️",en:"Rain",es:"Lluvia",pt:"Chuva",fr:"Pluie"};
  if([71,73,75,77,85,86].includes(n)) return {icon:"🌨️",en:"Snow",es:"Nieve",pt:"Neve",fr:"Neige"};
  if([95,96,99].includes(n)) return {icon:"⛈️",en:"Thunderstorms",es:"Tormentas",pt:"Tempestades",fr:"Orages"};
  return {icon:"🌤️",en:"Weather",es:"Clima",pt:"Clima",fr:"Météo"};
}
function weatherClockLabel(hour){
  const h=Number(hour);
  if(!Number.isFinite(h)) return "";
  const d=new Date(Date.UTC(2026,0,1,h,0,0));
  return new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit",timeZone:"UTC"}).format(d);
}
function weatherDayLabel(dateString,currentDateString){
  if(!dateString) return "";
  const d=new Date(dateString+"T12:00:00Z");
  const today=new Date(currentDateString+"T12:00:00Z");
  const tomorrow=new Date(today); tomorrow.setUTCDate(tomorrow.getUTCDate()+1);
  if(dateString===currentDateString) return langPick("Today","Hoy","Hoje","Aujourd’hui");
  if(dateString===tomorrow.toISOString().slice(0,10)) return langPick("Tomorrow","Mañana","Amanhã","Demain");
  return new Intl.DateTimeFormat(appLocale(),{weekday:"short",timeZone:"UTC"}).format(d);
}
function nextRainWindow(weather){
  const times=weather&&weather.hourly&&weather.hourly.time||[];
  const probs=weather&&weather.hourly&&weather.hourly.precipitation_probability||[];
  if(!times.length) return null;
  const current=String(weather&&weather.current&&weather.current.time||"").slice(0,13);
  let start=Math.max(0,times.findIndex(function(t){return String(t).slice(0,13)>=current;}));
  if(start<0) start=0;
  const end=Math.min(times.length,start+72);
  for(let i=start;i<end;i++){
    const probability=Number(probs[i]||0);
    if(probability>=55){
      const stamp=String(times[i]);
      return {
        time:stamp,
        date:stamp.slice(0,10),
        hour:Number(stamp.slice(11,13)),
        probability:probability,
        hoursAhead:i-start
      };
    }
  }
  return null;
}
function weatherCacheKey(area){
  return "tle_weather_v2:"+businessTemperatureUnit()+":"+String(area||"").trim().toLowerCase().replace(/\s+/g," ").slice(0,120);
}
async function fetchJsonWithTimeout(url,ms=5500){
  const controller=new AbortController();
  const timer=setTimeout(function(){controller.abort();},ms);
  try{
    const response=await fetch(url,{signal:controller.signal,headers:{"Accept":"application/json"}});
    if(!response.ok) throw new Error("Weather request failed");
    return await response.json();
  }finally{
    clearTimeout(timer);
  }
}
async function geocodeBusinessArea(area){
  const clean=String(area||"").trim();
  if(!clean) return null;
  const geoKey="tle_weather_geo_v2:"+clean.toLowerCase();
  try{
    const cached=JSON.parse(localStorage.getItem(geoKey)||"null");
    if(cached&&cached.latitude!=null&&cached.longitude!=null) return cached;
  }catch(e){}

  const browserRegion=String(navigator.language||"").split("-")[1]?.toUpperCase()||"";
  const preferredCountry=String(state.business?.country_code||browserRegion||"").toUpperCase();
  const candidates=[clean,clean.split(",")[0].trim()].filter((v,i,a)=>v&&a.indexOf(v)===i);
  for(const query of candidates){
    try{
      const url="https://geocoding-api.open-meteo.com/v1/search?count=8&language=en&format=json&name="+encodeURIComponent(query);
      const data=await fetchJsonWithTimeout(url);
      const results=Array.isArray(data&&data.results)?data.results:[];
      const place=results.find(x=>preferredCountry&&String(x.country_code||"").toUpperCase()===preferredCountry)||results[0];
      if(place){
        const geo={
          latitude:Number(place.latitude),
          longitude:Number(place.longitude),
          name:place.name||clean,
          admin1:place.admin1||"",
          country:place.country||"",
          country_code:String(place.country_code||"").toUpperCase(),
          timezone:place.timezone||(state.business&&state.business.timezone)||"auto"
        };
        localStorage.setItem(geoKey,JSON.stringify(geo));
        return geo;
      }
    }catch(e){}
  }
  return null;
}
function paymentMethodsForCountry(code){
  const country=String(code||"").toUpperCase();
  if(country==="US") return ["cash","check","zelle","other"];
  if(country==="CA") return ["cash","check","etransfer","other"];
  return ["cash","bank_transfer","other"];
}
function paymentMethodLabel(method){
  return {
    cash:"Cash",
    check:"Check",
    zelle:"Zelle",
    etransfer:"E-transfer",
    bank_transfer:"Bank transfer",
    other:"Other"
  }[String(method||"").toLowerCase()]||String(method||"").replace(/_/g," ");
}
function currencyForCountry(code){
  const map={
    US:"USD",CA:"CAD",GB:"GBP",IE:"EUR",FR:"EUR",DE:"EUR",ES:"EUR",PT:"EUR",IT:"EUR",NL:"EUR",BE:"EUR",AT:"EUR",FI:"EUR",GR:"EUR",
    LU:"EUR",CY:"EUR",MT:"EUR",SI:"EUR",SK:"EUR",EE:"EUR",LV:"EUR",LT:"EUR",HR:"EUR",CH:"CHF",SE:"SEK",NO:"NOK",DK:"DKK",
    PL:"PLN",CZ:"CZK",HU:"HUF",RO:"RON",BG:"BGN",IS:"ISK",RS:"RSD",AL:"ALL",BA:"BAM",MK:"MKD",MD:"MDL",GE:"GEL",
    BR:"BRL",CL:"CLP",MX:"MXN",CO:"COP",AR:"ARS",PE:"PEN",UY:"UYU",PY:"PYG",BO:"BOB",CR:"CRC",DO:"DOP",GT:"GTQ",
    HN:"HNL",NI:"NIO",PA:"PAB",EC:"USD",SV:"USD",VE:"VES",JM:"JMD",TT:"TTD",BS:"BSD",BB:"BBD",BZ:"BZD",GY:"GYD",
    HT:"HTG",CU:"CUP",AW:"AWG",CW:"ANG",KY:"KYD",BM:"BMD",
    AU:"AUD",NZ:"NZD",JP:"JPY",CN:"CNY",HK:"HKD",SG:"SGD",KR:"KRW",IN:"INR",PK:"PKR",BD:"BDT",LK:"LKR",NP:"NPR",
    PH:"PHP",ID:"IDR",MY:"MYR",TH:"THB",VN:"VND",KH:"KHR",LA:"LAK",MM:"MMK",TW:"TWD",MN:"MNT",
    AE:"AED",SA:"SAR",IL:"ILS",TR:"TRY",QA:"QAR",KW:"KWD",BH:"BHD",OM:"OMR",JO:"JOD",LB:"LBP",IQ:"IQD",EG:"EGP",
    MA:"MAD",DZ:"DZD",TN:"TND",ZA:"ZAR",NG:"NGN",GH:"GHS",KE:"KES",TZ:"TZS",UG:"UGX",RW:"RWF",ET:"ETB",ZM:"ZMW",
    BW:"BWP",NA:"NAD",MZ:"MZN",AO:"AOA",CV:"CVE",SN:"XOF",CI:"XOF",CM:"XAF",GA:"XAF",CD:"CDF",MU:"MUR",
    SC:"SCR",MG:"MGA",ZW:"ZWG",BY:"BYN",UA:"UAH",KZ:"KZT",UZ:"UZS",AM:"AMD",AZ:"AZN"
  };
  return map[String(code||"").toUpperCase()]||"USD";
}
function languageForCountry(code){
  const country=String(code||"").toUpperCase();
  if(["ES","MX","CL","CO","AR","PE","UY","PY","BO","CR","DO","GT","HN","NI","PA","EC","SV","VE"].includes(country)) return "es";
  if(["BR","PT","AO","MZ","CV","GW","ST","TL"].includes(country)) return "pt";
  if(["FR","BE","LU","MC","SN","CI","CM","HT","GA","CD","CG","BJ","TG","ML","NE","BF","GN","DJ","MG"].includes(country)) return "fr";
  const browser=String(navigator.language||"en").slice(0,2).toLowerCase();
  return ["en","es","pt","fr"].includes(browser)?browser:"en";
}
function localeForCountry(code,language){
  const region=String(code||"").toUpperCase();
  const lang=["en","es","pt","fr"].includes(language)?language:"en";
  const candidate=region?lang+"-"+region:"";
  if(candidate){
    try{new Intl.NumberFormat(candidate).format(1);return candidate;}catch{}
  }
  return {en:"en-US",es:"es-ES",pt:"pt-BR",fr:"fr-FR"}[lang];
}
function globalDefaultsFromGeo(geo){
  const country=String(geo?.country_code||String(navigator.language||"").split("-")[1]||"US").toUpperCase();
  const language=languageForCountry(country);
  return {
    country_code:country,
    default_language:language,
    locale_code:localeForCountry(country,language),
    currency_code:currencyForCountry(country),
    distance_unit:["US","GB"].includes(country)?"mi":"km",
    temperature_unit:country==="US"?"fahrenheit":"celsius"
  };
}
async function resolveBusinessLocale(area){
  const geo=await geocodeBusinessArea(area).catch(()=>null);
  let timezone=String(geo?.timezone||"").trim();
  if(!timezone||timezone==="auto") timezone=String(Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC");
  try{new Intl.DateTimeFormat("en-US",{timeZone:timezone}).format(new Date());}catch{timezone="UTC";}
  return {...globalDefaultsFromGeo(geo),timezone,geo};
}
async function resolveSignupTimeZone(area){
  return (await resolveBusinessLocale(area)).timezone;
}

async function loadBusinessWeather(force=false){
  const area=String(state.business&&state.business.service_area||"").trim();
  const card=$("#weatherBrief");
  if(!area){
    state.weather=null;
    if(card) card.hidden=true;
    return;
  }

  const now=Date.now();
  const cacheKey=weatherCacheKey(area);
  if(!force){
    try{
      const cached=JSON.parse(localStorage.getItem(cacheKey)||"null");
      if(cached&&cached.weather&&cached.fetchedAt&&now-cached.fetchedAt<15*60*1000){
        state.weather=cached.weather;
        state.weatherArea=area;
        state.weatherFetchedAt=cached.fetchedAt;
        renderWeatherBrief();
        renderTodaySummary();
        return;
      }
    }catch(e){}
  }

  const geo=await geocodeBusinessArea(area);
  if(!geo){
    if(card) card.hidden=true;
    return;
  }

  try{
    const params=new URLSearchParams({
      latitude:String(geo.latitude),
      longitude:String(geo.longitude),
      current:"temperature_2m,apparent_temperature,weather_code,precipitation",
      hourly:"temperature_2m,precipitation_probability,weather_code",
      daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      temperature_unit:businessTemperatureUnit(),
      precipitation_unit:businessTemperatureUnit()==="celsius"?"mm":"inch",
      forecast_days:"4",
      timezone:"auto"
    });
    const weather=await fetchJsonWithTimeout("https://api.open-meteo.com/v1/forecast?"+params.toString());
    weather.location=geo;
    weather.nextRain=nextRainWindow(weather);
    state.weather=weather;
    state.weatherArea=area;
    state.weatherFetchedAt=Date.now();
    try{localStorage.setItem(cacheKey,JSON.stringify({weather:weather,fetchedAt:state.weatherFetchedAt}));}catch(e){}
    renderWeatherBrief();
    renderTodaySummary();
  }catch(err){
    console.warn("[TLE] weather",err);
    if(card&&!state.weather) card.hidden=true;
  }
}
function currentWeatherVisual(weather){
  const code=Number(weather?.current?.weather_code);
  const precipitation=Number(weather?.current?.precipitation||0);

  if([71,73,75,77,85,86].includes(code)) return {kind:"snow",intensity:code===75||code===86?"heavy":"normal"};
  if([95,96,99].includes(code)) return {kind:"rain",intensity:"heavy"};
  if([61,63,65,66,67,80,81,82].includes(code)) return {kind:"rain",intensity:[65,67,82].includes(code)?"heavy":"normal"};
  if([51,53,55,56,57].includes(code)) return {kind:"rain",intensity:"light"};
  if(precipitation>0){
    const heavyThreshold=businessTemperatureUnit()==="celsius"?4:0.15;
    return {kind:"rain",intensity:precipitation>=heavyThreshold?"heavy":"light"};
  }
  return {kind:"none",intensity:"none"};
}

function currentWeatherSeason(weather){
  const latitude=Number(weather?.location?.latitude);
  const dateStamp=String(weather?.current?.time||"");
  const month=Number(dateStamp.slice(5,7)) || (new Date().getMonth()+1);
  let season;
  if(month>=3&&month<=5) season="spring";
  else if(month>=6&&month<=8) season="summer";
  else if(month>=9&&month<=11) season="fall";
  else season="winter";

  if(Number.isFinite(latitude) && latitude<0){
    season={spring:"fall",summer:"winter",fall:"spring",winter:"summer"}[season]||season;
  }
  return season;
}

function particleMarkup(count,className){
  return Array.from({length:count},(_,i)=>{
    const left=(7+(i*17)%91);
    const delay=-((i*0.83)%7).toFixed(2);
    const duration=(5.6+(i%6)*0.65).toFixed(2);
    const drift=(-14+(i*11)%29);
    const scale=(0.72+(i%5)*0.10).toFixed(2);
    return `<span class="${className}" style="--x:${left}%;--delay:${delay}s;--dur:${duration}s;--drift:${drift}px;--scale:${scale}"></span>`;
  }).join("");
}

function renderHeroWeatherEffects(){
  const hero=$("#todayHeroCard");
  const seasonLayer=$("#heroSeasonLayer");
  const precipLayer=$("#heroPrecipLayer");
  if(!hero||!seasonLayer||!precipLayer) return;

  const weather=state.weather;
  const season=currentWeatherSeason(weather);
  const visual=currentWeatherVisual(weather);

  hero.dataset.season=season;
  hero.dataset.weather=visual.kind;
  hero.dataset.weatherIntensity=visual.intensity;

  const seasonCounts={spring:9,summer:6,fall:9,winter:7};
  seasonLayer.innerHTML=particleMarkup(seasonCounts[season]||7,"season-particle");
  seasonLayer.className="hero-season-layer season-"+season;

  if(visual.kind==="rain"){
    const count=visual.intensity==="heavy"?28:visual.intensity==="light"?12:20;
    precipLayer.innerHTML=particleMarkup(count,"rain-drop");
  }else if(visual.kind==="snow"){
    const count=visual.intensity==="heavy"?24:16;
    precipLayer.innerHTML=particleMarkup(count,"snow-flake");
  }else{
    precipLayer.innerHTML="";
  }
  precipLayer.className="hero-precip-layer weather-"+visual.kind+" intensity-"+visual.intensity;
}

function renderWeatherBrief(){
  const card=$("#weatherBrief");
  const weather=state.weather;
  if(!card||!weather||!weather.current) return;
  card.hidden=false;

  const meta=weatherCodeMeta(weather.current.weather_code);
  const temp=Math.round(Number(weather.current.temperature_2m));
  const feels=Math.round(Number(weather.current.apparent_temperature));
  const rain=weather.nextRain;
  const currentDate=String(weather.current.time||"").slice(0,10);
  const location=weather.location||{};
  const lang=appLanguage();

  $("#weatherIcon").textContent=meta.icon;
  $("#weatherTemp").textContent=Number.isFinite(temp)?temp+temperatureSuffix():"—";
  $("#weatherCondition").textContent=meta[lang]||meta.en;
  $("#weatherFeels").textContent=Number.isFinite(feels)
    ? langPick("Feels like ","Se siente como ","Sensação de ","Ressenti ")+feels+"°"
    : "";
  $("#weatherLocation").textContent=langPick("OUTSIDE · ","AFUERA · ","LÁ FORA · ","DEHORS · ")+(location.name||state.weatherArea||"");

  const note=$("#weatherBusinessNote");
  if(note){
    if(rain){
      const day=weatherDayLabel(rain.date,currentDate).toLowerCase();
      const time=weatherClockLabel(rain.hour);
      note.classList.add("rain");
      const heading=langPick(
        "🌧️ Rain likely "+day+" around "+time+" · "+rain.probability+"%",
        "🌧️ Lluvia probable "+day+" cerca de las "+time+" · "+rain.probability+"%",
        "🌧️ Chuva provável "+day+" por volta de "+time+" · "+rain.probability+"%",
        "🌧️ Pluie probable "+day+" vers "+time+" · "+rain.probability+"%"
      );
      const detail=langPick(
        "Leave a little room between stops and double-check access before heading out.",
        "Deja un poco de margen entre paradas y revisa el acceso antes de salir.",
        "Deixe um pouco mais de tempo entre as paradas e confirme o acesso antes de sair.",
        "Prévoyez un peu de marge entre les arrêts et vérifiez l’accès avant de partir."
      );
      note.innerHTML="<strong>"+escapeHtml(heading)+"</strong><span>"+escapeHtml(detail)+"</span>";
    }else if(temp>=(businessTemperatureUnit()==="celsius"?31:88)){
      note.classList.remove("rain");
      const heading=langPick("💧 It’s hot outside.","💧 Hace calor afuera.","💧 Está quente lá fora.","💧 Il fait chaud dehors.");
      const detail=langPick(
        "Keep water close and give yourself a few minutes between stops.",
        "Ten agua cerca y deja unos minutos para respirar entre paradas.",
        "Mantenha água por perto e reserve alguns minutos entre as paradas.",
        "Gardez de l’eau à portée de main et prévoyez quelques minutes entre les arrêts."
      );
      note.innerHTML="<strong>"+escapeHtml(heading)+"</strong><span>"+escapeHtml(detail)+"</span>";
    }else{
      note.classList.remove("rain");
      const heading=langPick("Weather looks steady for now.","Todo tranquilo con el clima por ahora.","O clima está estável por enquanto.","La météo est stable pour le moment.");
      const detail=langPick(
        "No major rain alert is affecting your route yet.",
        "Tu ruta puede seguir sin alertas de lluvia importantes.",
        "Nenhum alerta importante de chuva está afetando sua rota agora.",
        "Aucune alerte de pluie importante n’affecte votre itinéraire pour le moment."
      );
      note.innerHTML="<strong>"+escapeHtml(heading)+"</strong><span>"+escapeHtml(detail)+"</span>";
    }
  }

  const forecast=$("#weatherForecast");
  if(forecast){
    const dates=weather.daily&&weather.daily.time||[];
    const highs=weather.daily&&weather.daily.temperature_2m_max||[];
    const lows=weather.daily&&weather.daily.temperature_2m_min||[];
    const probs=weather.daily&&weather.daily.precipitation_probability_max||[];
    const codes=weather.daily&&weather.daily.weather_code||[];
    forecast.innerHTML=dates.slice(0,3).map(function(date,i){
      const day=weatherDayLabel(String(date),currentDate);
      const m=weatherCodeMeta(codes[i]);
      const hi=Math.round(Number(highs[i]));
      const lo=Math.round(Number(lows[i]));
      const prob=Math.round(Number(probs[i]||0));
      return '<div class="weather-day"><span>'+escapeHtml(day)+'</span><b>'+m.icon+' '+hi+'°</b><small>'+lo+'° · '+prob+'% '+escapeHtml(langPick("rain","lluvia","chuva","pluie"))+'</small></div>';
    }).join("");
  }

  const updated=$("#weatherUpdated");
  if(updated){
    const t=new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit"}).format(new Date(state.weatherFetchedAt||Date.now()));
    updated.textContent=langPick("Updated ","Actualizado ","Atualizado ","Mis à jour ")+t;
  }
  renderHeroWeatherEffects();
}
function installLiveDashboardUpdates(){
  if(window.__tleLiveDashboardInstalled) return;
  window.__tleLiveDashboardInstalled=true;

  window.setInterval(function(){
    if(state.session&&state.business) renderTodaySummary();
  },60*1000);

  window.setInterval(function(){
    if(state.session&&state.business&&document.visibilityState==="visible"){
      loadBusinessWeather(true).catch(function(){});
    }
  },5*60*1000);

  document.addEventListener("visibilitychange",function(){
    if(document.visibilityState!=="visible"||!state.session||!state.business) return;
    renderTodaySummary(true);
    if(Date.now()-(state.weatherFetchedAt||0)>5*60*1000){
      loadBusinessWeather(true).catch(function(){});
    }
  });
}

function refreshDynamicLanguageContent(){
  if(!state.business || !state.session) return;
  try{ renderTodaySummary(); }catch{}
  try{ renderWeatherBrief(); }catch{}
  try{ renderOperations(); }catch{}
  try{ renderSettings(); }catch{}
  try{ renderPublicLinks(); }catch{}
  try{ if(state.business.role==="owner") loadOwnerAdmin().catch(()=>{}); }catch{}
}
window.addEventListener("tle:languagechange",()=>{
  if(state.workerPortal && workerShell && !workerShell.hidden){
    try{renderWorkerPortal();}catch{}
    try{renderMessageList($("#workerMessageThread"),state.workerMessages,"worker");}catch{}
  }
  setTimeout(refreshDynamicLanguageContent,0);
});

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[ch]);
}
function money(value){
  if(value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat(appLocale(),{style:"currency",currency:businessCurrency(),maximumFractionDigits:2}).format(Number(value));
}
function formatDateTime(value){
  if(!value) return "—";
  return new Intl.DateTimeFormat(appLocale(),{
    month:"short",day:"numeric",hour:"numeric",minute:"2-digit",
    timeZone:activeBusinessTimeZone()
  }).format(new Date(value));
}
function zonedDateTimeParts(value,timeZone=activeBusinessTimeZone()){
  const d=value instanceof Date?value:new Date(value);
  if(!Number.isFinite(d.getTime())) return {date:"",time:""};
  try{
    const parts=new Intl.DateTimeFormat("en-CA",{
      timeZone,
      year:"numeric",month:"2-digit",day:"2-digit",
      hour:"2-digit",minute:"2-digit",hourCycle:"h23"
    }).formatToParts(d);
    const map=Object.fromEntries(parts.map(p=>[p.type,p.value]));
    return {date:[map.year,map.month,map.day].join("-"),time:[map.hour,map.minute].join(":")};
  }catch{
    return {
      date:[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-"),
      time:[String(d.getHours()).padStart(2,"0"),String(d.getMinutes()).padStart(2,"0")].join(":")
    };
  }
}
function zoneOffsetMs(date,timeZone){
  const parts=new Intl.DateTimeFormat("en-US",{
    timeZone,
    year:"numeric",month:"2-digit",day:"2-digit",
    hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"
  }).formatToParts(date);
  const map=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  const asUtc=Date.UTC(
    Number(map.year),Number(map.month)-1,Number(map.day),
    Number(map.hour),Number(map.minute),Number(map.second)
  );
  return asUtc-date.getTime();
}
function businessLocalDateTimeToIso(dateValue,timeValue,timeZone=activeBusinessTimeZone()){
  const date=String(dateValue||"");
  const time=String(timeValue||"");
  const dm=date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const tm=time.match(/^(\d{2}):(\d{2})$/);
  if(!dm||!tm) throw new Error("Choose a valid date and time.");
  const naive=Date.UTC(+dm[1],+dm[2]-1,+dm[3],+tm[1],+tm[2],0);
  let candidate=new Date(naive);
  try{
    candidate=new Date(naive-zoneOffsetMs(candidate,timeZone));
    candidate=new Date(naive-zoneOffsetMs(candidate,timeZone));
    const roundTrip=zonedDateTimeParts(candidate,timeZone);
    if(roundTrip.date!==date||roundTrip.time!==time){
      throw new Error("That local time does not exist in the business time zone. Choose another time.");
    }
  }catch(err){
    if(err?.message?.includes("does not exist")) throw err;
    throw new Error("Could not apply the business time zone. Check the service area and try again.");
  }
  return candidate.toISOString();
}
function setAuthStatus(message="",type=""){
  const raw=String(message||"");
  if(/supabase\.|track_app_login|\.catch is not a function|is undefined|stack|TypeError/i.test(raw)){
    message=type==="error"?"We couldn’t open the app. Please try again.":"";
  }
  const el=$("#authStatus");
  if(!el) return;
  el.textContent=message;
  el.dataset.type=type||"";
}


function isUserCorrectableAuthError(err){
  const raw=String(err?.message||err||"").toLowerCase();
  return /invalid login credentials|email not confirmed|user already registered|already been registered|password should be|password.*characters|invalid email|email address.*invalid|signup is disabled|rate limit|too many requests/.test(raw);
}
function authRequiredFieldMessage(){
  return langPick(
    "Check the required fields above and try again.",
    "Revisa los campos requeridos arriba y vuelve a intentarlo.",
    "Confira os campos obrigatórios acima e tente novamente.",
    "Vérifiez les champs obligatoires ci-dessus et réessayez."
  );
}
function authIssueAttemptKey(mode,email,err){
  const fingerprint=String(err?.code||err?.message||"unknown").toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,80);
  return "tle_auth_issue_attempt:"+String(mode||"unknown")+":"+String(email||"").toLowerCase()+":"+fingerprint;
}
function recordAuthIssueAttempt(mode,email,err){
  const key=authIssueAttemptKey(mode,email,err);
  const now=Date.now();
  let item={count:0,firstAt:now,lastAt:0,reported:false};
  try{
    const saved=JSON.parse(sessionStorage.getItem(key)||"null");
    if(saved&&now-Number(saved.firstAt||0)<10*60*1000) item={...item,...saved};
  }catch{}
  item.count=Number(item.count||0)+1;
  item.lastAt=now;
  try{sessionStorage.setItem(key,JSON.stringify(item));}catch{}
  return {key,item};
}
async function reportPersistentAuthIssue(mode,email,err,attemptCount,key){
  if(!email || isUserCorrectableAuthError(err)) return false;
  try{
    const response=await fetch(SUPABASE_URL+"/functions/v1/report-auth-issue",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":SUPABASE_PUBLISHABLE_KEY
      },
      body:JSON.stringify({
        email:String(email||"").trim().toLowerCase(),
        auth_mode:["signin","signup","recovery"].includes(mode)?mode:"unknown",
        error_code:String(err?.code||err?.status||"").slice(0,120),
        error_message:String(err?.message||err||"Unknown authentication error").slice(0,700),
        attempt_count:Number(attemptCount||2),
        page:window.location.pathname+window.location.search,
        user_agent:navigator.userAgent
      })
    });
    if(response.ok){
      let result=null;
      try{ result=await response.json(); }catch{}
      try{
        const saved=JSON.parse(sessionStorage.getItem(key)||"{}");
        saved.reported=true;
        sessionStorage.setItem(key,JSON.stringify(saved));
      }catch{}
      return result?.alerted===true;
    }
  }catch(reportErr){
    console.warn("[TLE] auth issue report",reportErr);
  }
  return false;
}
function showAuthFailure(err,mode,email){
  const retry=$("#authRetryButton");
  const correctable=isUserCorrectableAuthError(err);
  const raw=String(err?.message||"").toLowerCase();
  let message=authRequiredFieldMessage();

  if(/invalid login credentials/.test(raw)){
    message=langPick(
      "The email or password doesn’t match. Check them and try again.",
      "El correo o la contraseña no coinciden. Revísalos y vuelve a intentarlo.",
      "O e-mail ou a senha não conferem. Revise e tente novamente.",
      "L’e-mail ou le mot de passe ne correspond pas. Vérifiez-les et réessayez."
    );
  }else if(/email not confirmed/.test(raw)){
    message=langPick(
      "Confirm your email first, then sign in.",
      "Primero confirma tu correo y después inicia sesión.",
      "Confirme seu e-mail primeiro e depois entre.",
      "Confirmez d’abord votre e-mail, puis connectez-vous."
    );
  }else if(/already registered|already been registered/.test(raw)){
    message=langPick(
      "That email already has an account. Sign in instead of creating another one.",
      "Ese correo ya tiene una cuenta. Inicia sesión en vez de crear otra.",
      "Esse e-mail já tem uma conta. Entre em vez de criar outra.",
      "Cet e-mail possède déjà un compte. Connectez-vous au lieu d’en créer un autre."
    );
  }else if(!correctable){
    message=langPick(
      "We couldn’t complete this. Check the required fields and tap “Try again”.",
      "No pudimos completar esto. Revisa los campos requeridos y toca “Intentar otra vez”.",
      "Não foi possível concluir. Confira os campos obrigatórios e toque em “Tentar novamente”.",
      "Impossible de terminer. Vérifiez les champs obligatoires et touchez « Réessayer »."
    );
  }

  setAuthStatus(message,"error");
  if(retry){
    retry.hidden=false;
    retry.textContent=langPick("Try again","Intentar otra vez","Tentar novamente","Réessayer");
  }

  const attempt=recordAuthIssueAttempt(mode,email,err);
  if(!correctable && attempt.item.count>=2 && !attempt.item.reported){
    reportPersistentAuthIssue(mode,email,err,attempt.item.count,attempt.key).then(alerted=>{
      if(alerted){
        setAuthStatus(
          langPick(
            "The error is still happening. Support has been alerted. Check the required fields and try again.",
            "El error continúa. Ya se envió una alerta a soporte. Revisa los campos requeridos y vuelve a intentarlo.",
            "O erro continua. O suporte foi avisado. Confira os campos obrigatórios e tente novamente.",
            "L’erreur continue. Le support a été prévenu. Vérifiez les champs obligatoires et réessayez."
          ),
          "error"
        );
      }
    });
  }
}
function showToast(message){
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(window.__tleToast);
  window.__tleToast = setTimeout(()=>toastEl.classList.remove("show"),1900);
}
function setBusy(button,busy,label="Working…"){
  if(!button) return;
  if(busy){
    button.dataset.oldText = button.textContent;
    button.disabled = true;
    button.textContent = label;
  }else{
    button.disabled = false;
    button.textContent = button.dataset.oldText || button.textContent;
  }
}
function setShellState(mode){
  document.body.classList.remove("shell-auth","shell-app","shell-worker","shell-public");
  document.body.classList.add("shell-"+mode);
}

function showAuth(){
  setShellState("auth");
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = false;
  appShell.hidden = true;
  authPanel.hidden = false;
  businessSetup.hidden = true;
}
function showSetup(){
  setShellState("auth");
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = false;
  appShell.hidden = true;
  authPanel.hidden = true;
  businessSetup.hidden = false;
}
function applyQuarterHourCardColors(){
  const now=new Date();
  const quarter=Math.floor(now.getMinutes()/15)%4;
  const classes=["quarter-color-0","quarter-color-1","quarter-color-2","quarter-color-3"];
  [$("#todayHeroCard"),$(".trial-card"),appShell].filter(Boolean).forEach(el=>{
    el.classList.remove(...classes);
    el.classList.add("quarter-color-"+quarter);
    el.dataset.colorQuarter=String(quarter);
  });
}

function scheduleQuarterHourCardColors(){
  applyQuarterHourCardColors();
  if(window.__tleQuarterColorTimer) clearTimeout(window.__tleQuarterColorTimer);
  const now=new Date();
  const minutesToBoundary=15-(now.getMinutes()%15);
  const ms=(minutesToBoundary*60*1000)-(now.getSeconds()*1000)-now.getMilliseconds()+120;
  window.__tleQuarterColorTimer=setTimeout(scheduleQuarterHourCardColors,Math.max(1000,ms));
}

function showApp(){
  setShellState("app");
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = true;
  appShell.hidden = false;
  scheduleQuarterHourCardColors();

  // Safari/iOS may restore the previous page scroll position before the hidden
  // app shell becomes visible. Force the authenticated dashboard to start at
  // the real document top instead of leaving a blank viewport above Today.
  try{
    if("scrollRestoration" in history) history.scrollRestoration="manual";
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
    window.scrollTo(0,0);
    requestAnimationFrame(()=>{
      document.documentElement.scrollTop=0;
      document.body.scrollTop=0;
      window.scrollTo(0,0);
    });
    setTimeout(()=>window.scrollTo(0,0),80);
  }catch{}

  // iOS can restore an older Home Screen HTML snapshot. Remove retired
  // top-bar controls at runtime so the visible UI always matches the live app.
  $("#topHelpBtn")?.remove();
  $("#topFeedbackBtn")?.remove();
  document.body.classList.toggle("platform-owner-no-billing",isPrimaryPlatformAdminAccount() || state.isPlatformAdmin);
  applyRolePermissions();
  $$("[data-account-billing]").forEach(el=>{
    el.hidden=isPrimaryPlatformAdminAccount();
  });
  renderTrialStatus();
  if(state.business?.role==="owner" && state.session?.user?.email){
    localStorage.setItem(OWNER_EMAIL_KEY,String(state.session.user.email).trim().toLowerCase());
    markOwnerActivity();
    installOwnerActivityTracker();
  }
  const chip = $(".workspace-chip");
  if(chip && state.business){
    const roleLabel = state.business.role==="owner"
      ? tr("Owner")
      : state.business.role==="admin"
        ? tr("Admin")
        : tr("Guest employee");
    chip.innerHTML = `
      <span class="workspace-avatar">${escapeHtml(initials(state.business.name))}</span>
      <span><strong>${escapeHtml(state.business.name)}</strong><small>${roleLabel}</small></span>
    `;
  }
  scheduleOnboardingWelcome();
  installLiveDashboardUpdates();
  installTeamMessagePolling();
}
function initials(name=""){
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase() || "TL";
}
function subscriptionNeedsPayment(){
  if(!state.business) return false;
  const status=String(state.business.subscription_status||"").toLowerCase();
  if(status==="active") return false;
  if(["past_due","canceled","expired"].includes(status)) return true;

  const end=state.business.trial_ends_at ? new Date(state.business.trial_ends_at) : null;
  return !!(end && !Number.isNaN(end.getTime()) && end.getTime()<=Date.now());
}

async function startSubscriptionCheckout(button){
  setBusy(button,true,"Opening secure checkout…");
  try{
    const {data,error}=await supabase.functions.invoke("create-stripe-checkout",{body:{}});
    if(error) throw error;
    if(data?.active){
      state.business.subscription_status="active";
      renderTrialStatus();
      if(state.modalType==="subscriptionGate"){
        modal.hidden=true;
        modalClose.hidden=false;
      }
      showToast("Your subscription is active");
      return;
    }
    if(!data?.url) throw new Error(data?.error||"Checkout is not available yet");
    window.location.assign(data.url);
  }catch(err){
    console.error("[TLE] Stripe checkout",err);
    showToast(err?.message||"Could not open checkout");
  }finally{
    setBusy(button,false);
  }
}

async function handleBillingReturn(params){
  const billing=params.get("billing");
  if(!billing) return;

  const cleanBillingParams=()=>{
    const clean=new URL(window.location.href);
    clean.searchParams.delete("billing");
    clean.searchParams.delete("session_id");
    history.replaceState({}, "", clean.pathname + (clean.search ? clean.search : "") + clean.hash);
  };

  if(billing==="cancel"){
    cleanBillingParams();
    showToast("Checkout canceled. No charge was made.");
    return;
  }

  if(billing!=="success") return;

  const sessionId=params.get("session_id");
  if(!sessionId){
    cleanBillingParams();
    showToast("Payment return could not be verified");
    return;
  }

  try{
    showToast("Confirming your subscription…");
    const {data,error}=await supabase.functions.invoke("confirm-stripe-checkout",{
      body:{session_id:sessionId}
    });
    if(error) throw error;
    if(!data?.active) throw new Error(data?.error||"Payment is not verified");

    state.business.subscription_status="active";
    cleanBillingParams();
    renderTrialStatus();
    if(state.modalType==="subscriptionGate"){
      modal.hidden=true;
      modalClose.hidden=false;
    }
    showToast("Subscription active");
  }catch(err){
    console.error("[TLE] billing confirmation",err);
    showToast(err?.message||"Could not confirm payment yet");
  }
}

function showSubscriptionGate(){
  if(isPrimaryPlatformAdminAccount() || state.isPlatformAdmin){
    if(state.modalType==="subscriptionGate"){
      modal.hidden=true;
      modalClose.hidden=false;
    }
    return;
  }
  if(!state.business || !subscriptionNeedsPayment()){
    if(state.modalType==="subscriptionGate"){
      modal.hidden=true;
      modalClose.hidden=false;
    }
    return;
  }

  state.modalType="subscriptionGate";
  state.modalId=null;
  modalClose.hidden=true;

  const owner=state.business.role==="owner";
  const billingStatus=String(state.business.subscription_status||"").toLowerCase();
  const returningCustomer=["canceled","past_due"].includes(billingStatus);

  modalHeader(
    "PLAN + BILLING",
    owner
      ? (returningCustomer ? "Your subscription is paused." : "Your free access has ended.")
      : "This workspace needs an active subscription.",
    owner
      ? (returningCustomer
          ? "Reactivate for $5.99/month and pick up where you left off."
          : "Continue your full access for $5.99/month. You can cancel anytime.")
      : "Ask the business owner to renew the $5.99/month subscription."
  );

  entityForm.innerHTML=owner
    ? `<div class="empty-inline"><strong>Your business data stays saved.</strong><span>We keep your clients, contacts, jobs, quotes, invoices and settings for 3 months after your subscription ends. Reactivate during that window and continue where you left off.</span></div><div class="form-footer"><button class="ghost-btn" type="button" id="billingGateLogout">Log out</button><button class="primary-btn" type="button" id="billingContinueBtn">Continue for $5.99/month</button></div>`
    : `<div class="empty-inline"><strong>Owner action required.</strong><span>Business data is kept for 3 months while the subscription is paused.</span></div><div class="form-footer"><button class="primary-btn" type="button" id="billingGateLogout">Log out</button></div>`;

  modal.hidden=false;

  const continueBtn=$("#billingContinueBtn");
  if(continueBtn) continueBtn.onclick=()=>startSubscriptionCheckout(continueBtn);

  const logoutBtn=$("#billingGateLogout");
  if(logoutBtn) logoutBtn.onclick=async ()=>{
    await supabase.auth.signOut({scope:"local"});
    window.location.reload();
  };
}

function trialWarningDismissKey(){
  const id=state.business?.id||"business";
  const end=state.business?.trial_ends_at||"trial";
  return "tle_trial_warning_dismissed_"+id+"_"+end;
}
function isTrialWarningDismissed(){
  try{return localStorage.getItem(trialWarningDismissKey())==="1";}catch{return false;}
}
function dismissTrialWarning(){
  try{localStorage.setItem(trialWarningDismissKey(),"1");}catch{}
  const warning=$("#trialExpiryBanner");
  if(warning) warning.hidden=true;
}

function renderTrialStatus(){
  const pill=$("#trialDaysPill");
  const trialCard=pill?.closest(".trial-card");
  const warning=$("#trialExpiryBanner");
  if(isPrimaryPlatformAdminAccount() || state.isPlatformAdmin){
    if(trialCard) trialCard.hidden=true;
    if(warning) warning.hidden=true;
    $("#trialSubscribeBtn")?.remove();
    if(state.modalType==="subscriptionGate"){
      modal.hidden=true;
      modalClose.hidden=false;
    }
    return;
  }
  if(trialCard) trialCard.hidden=false;
  if(!pill || !state.business) return;

  const status=String(state.business.subscription_status||"").toLowerCase();
  
  const warningTitle=$("#trialExpiryTitle");
  const warningCopy=$("#trialExpiryCopy");
  let payBtn=$("#trialSubscribeBtn");

  const hideWarning=()=>{
    if(warning) warning.hidden=true;
  };

  if(status==="active"){
    pill.textContent="Active plan";
    if(payBtn) payBtn.remove();
    hideWarning();
    showSubscriptionGate();
    return;
  }

  const end=state.business.trial_ends_at ? new Date(state.business.trial_ends_at) : null;
  if(!end || Number.isNaN(end.getTime())){
    pill.textContent="30-day trial";
    hideWarning();
    showSubscriptionGate();
    return;
  }

  const ms=end.getTime()-Date.now();
  const days=Math.max(0,Math.ceil(ms/86400000));

  if(subscriptionNeedsPayment()){
    pill.textContent=status==="past_due" ? "Payment needed" : "Trial ended";
    hideWarning();
    if(state.business.role==="owner" && trialCard && !payBtn){
      payBtn=document.createElement("button");
      payBtn.id="trialSubscribeBtn";
      payBtn.type="button";
      payBtn.className="primary-btn";
      payBtn.textContent="Continue for $5.99/month";
      payBtn.addEventListener("click",()=>startSubscriptionCheckout(payBtn));
      trialCard.appendChild(payBtn);
    }
  }else{
    pill.textContent=days===1 ? "1 day left" : days+" days left";
    if(payBtn) payBtn.remove();

    const withinFinal72Hours=ms>0 && ms<=72*60*60*1000;
    if(warning && state.business.role==="owner" && withinFinal72Hours && !isTrialWarningDismissed()){
      warning.hidden=false;
      if(warningTitle){
        warningTitle.textContent=days===1
          ? "Your free access ends tomorrow"
          : `Your free access ends in ${days} days`;
      }
      if(warningCopy){
        warningCopy.textContent="You still have full access. When your free period ends, you can continue for $5.99/month.";
      }
    }else{
      hideWarning();
    }
  }

  showSubscriptionGate();
}

$("#trialExpiryClose")?.addEventListener("click",dismissTrialWarning);

function applyRolePermissions(){
  const role=state.business?.role||"coworker";
  $$("[data-owner-only]").forEach(el=>el.hidden=role!=="owner");
  $$("[data-admin-only]").forEach(el=>el.hidden=!["owner","admin"].includes(role));
  $$("[data-platform-admin-only]").forEach(el=>el.hidden=!state.isPlatformAdmin);
  if(role==="coworker"){
    const active=$(".nav-item.active");
    if(active && active.hidden) openView("today");
  }
}

function openView(id,options={}){
  const current=$(".view.active")?.dataset.page;
  if(!options.fromBack && current && current!==id){
    if(navHistory[navHistory.length-1]!==current) navHistory.push(current);
  }
  $$(".view").forEach(v=>{
    const active=v.dataset.page===id;
    v.classList.toggle("active",active);
    if(active){
      v.classList.remove("view-enter");
      requestAnimationFrame(()=>v.classList.add("view-enter"));
      setTimeout(()=>v.classList.remove("view-enter"),380);
    }
  });
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===id));
  pageTitle.textContent=pageTitles[id]||"The Launch Era Cleaning App";
  if(backBtn) backBtn.hidden=id==="today";
  if(typeof setSidebarOpen==="function") setSidebarOpen(false); else sidebar.classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
  trackVisit("/app/"+id).catch(()=>{});
  if(id==="team"){
    loadTeamMessageThreads().then(()=>{
      if(state.activeTeamMessageMemberId) return loadTeamMessageThread(state.activeTeamMessageMemberId,{markRead:true});
    }).catch(err=>console.warn("[TLE] team messages",err));
  }
  setTimeout(()=>maybeShowFeatureIntro(id),220);
}
// Delegated navigation keeps dashboard links working even when cards/lists
// are re-rendered after data loads or iOS restores an older DOM snapshot.
document.addEventListener("click",e=>{
  const nav=e.target.closest(".nav-item[data-view]");
  if(nav && !nav.hidden){
    e.preventDefault();
    openView(nav.dataset.view);
    return;
  }
  const jump=e.target.closest("[data-jump]");
  if(jump && !jump.disabled && !jump.hidden){
    e.preventDefault();
    openView(jump.dataset.jump);
  }
});
document.addEventListener("keydown",e=>{
  if(!["Enter"," "].includes(e.key)) return;
  const jump=e.target.closest?.('[data-jump][role="button"]');
  if(!jump || jump.disabled || jump.hidden) return;
  e.preventDefault();
  openView(jump.dataset.jump);
});
const sidebarScrim=$("#sidebarScrim");
function setSidebarOpen(open){
  const shouldOpen=!!open && window.matchMedia("(max-width: 860px)").matches;
  sidebar.classList.toggle("open",shouldOpen);
  if(sidebarScrim) sidebarScrim.hidden=!shouldOpen;
  document.body.classList.toggle("sidebar-is-open",shouldOpen);
  $("#menuToggle")?.setAttribute("aria-expanded",shouldOpen?"true":"false");
}
$("#menuToggle").addEventListener("click",()=>setSidebarOpen(!sidebar.classList.contains("open")));
sidebarScrim?.addEventListener("click",()=>setSidebarOpen(false));
window.addEventListener("resize",()=>{
  if(window.innerWidth>860 && sidebar.classList.contains("open")) setSidebarOpen(false);
});

if(backBtn) backBtn.addEventListener("click",()=>{
  let previous=navHistory.pop();
  while(previous && previous===$(".view.active")?.dataset.page) previous=navHistory.pop();
  openView(previous||"today",{fromBack:true});
});

function getVisitorId(){
  let id=localStorage.getItem("tle_visitor_id");
  if(!id){
    id=(crypto.randomUUID ? crypto.randomUUID() : "v-"+Date.now()+"-"+Math.random().toString(36).slice(2));
    localStorage.setItem("tle_visitor_id",id);
  }
  return id;
}

function googleVisitorClass(){
  return (state.isPlatformAdmin || localStorage.getItem("tle_internal_admin_device")==="1")
    ? "internal"
    : "external";
}

function googleAnalyticsBase(){
  return {
    app_surface:"cleaning_app",
    visitor_class:googleVisitorClass(),
    business_role:state.business?.role||"unknown",
    language:appLanguage()
  };
}

function trackGoogleEvent(name,params={}){
  try{
    if(typeof window.gtag!=="function") return;
    window.gtag("event",name,{...googleAnalyticsBase(),...params});
  }catch{}
}

function trackGooglePage(page){
  try{
    if(typeof window.gtag!=="function") return;
    const raw=String(page||"/").replace(/^https?:\/\/[^/]+/,"");
    const clean=raw.startsWith("/app/")
      ? "/cleaning-app/"+raw.slice(5)
      : raw.startsWith("/public/")
        ? "/cleaning-app"+raw
        : raw==="/login"
          ? "/cleaning-app/login"
          : "/cleaning-app"+(raw.startsWith("/")?raw:"/"+raw);
    const pageLocation=window.location.origin+window.location.pathname+"#"+clean.replace(/^\//,"");
    const leaf=clean.split("/").filter(Boolean).slice(-1)[0]||"home";
    window.gtag("event","page_view",{
      ...googleAnalyticsBase(),
      page_path:clean,
      page_location:pageLocation,
      page_title:"Cleaning App · "+leaf
    });
  }catch{}
}

function isAutomationTestSession(){
  const host=String(window.location.hostname||"").toLowerCase();
  const params=new URLSearchParams(window.location.search);
  return host==="127.0.0.1"
    || host==="localhost"
    || host==="::1"
    || params.has("browser-smoke")
    || params.has("cross-browser-smoke")
    || params.has("ci-smoke");
}
async function trackVisit(page=window.location.pathname+window.location.search){
  if(isAutomationTestSession()) return;
  trackGooglePage(page);
  try{
    if(localStorage.getItem("tle_internal_admin_device")==="1" || state.isPlatformAdmin) return;
    await supabase.functions.invoke("track-app-visit",{
      body:{
        visitor_id:getVisitorId(),
        page,
        referrer:document.referrer||null,
        user_agent:navigator.userAgent||null
      }
    });
  }catch{}
}

async function identifyPlatformAdmin(){
  const {data,error}=await supabase.rpc("get_platform_admin_status");
  if(error){ state.isPlatformAdmin=false; return false; }
  state.isPlatformAdmin=Boolean(data);
  if(state.isPlatformAdmin){
    await supabase.rpc("mark_platform_admin_device",{p_visitor_id:getVisitorId()});
    localStorage.setItem("tle_internal_admin_device","1");
    const email=state.session?.user?.email;
    if(email){
      const remembered=JSON.parse(localStorage.getItem("tle_admin_emails")||"[]");
      if(!remembered.includes(email)) remembered.push(email);
      localStorage.setItem("tle_admin_emails",JSON.stringify(remembered.slice(-4)));
      localStorage.setItem("tle_last_admin_email",email);
    }
  }
  return state.isPlatformAdmin;
}

function rememberedAdminEmails(){
  try{return JSON.parse(localStorage.getItem("tle_admin_emails")||"[]").filter(Boolean);}
  catch{return [];}
}
function rememberedOwnerEmail(){
  const owner=String(localStorage.getItem(OWNER_EMAIL_KEY)||"").trim().toLowerCase();
  if(owner) return owner;
  const platformAdmin=String(localStorage.getItem("tle_last_admin_email")||"").trim().toLowerCase();
  return platformAdmin===PRIMARY_PLATFORM_ADMIN_EMAIL ? platformAdmin : "";
}
function maskEmail(email=""){
  const clean=String(email).trim();
  const parts=clean.split("@");
  if(parts.length!==2) return clean;
  const name=parts[0];
  const shown=name.length<=2 ? name[0]+"*" : name.slice(0,2)+"***";
  return shown+"@"+parts[1];
}

function saveOwnerSessionBackup(session){
  try{
    const email=String(session?.user?.email||"").trim().toLowerCase();
    const accessToken=String(session?.access_token||"");
    const refreshToken=String(session?.refresh_token||"");
    if(!email || !accessToken || !refreshToken) return;
    localStorage.setItem(OWNER_SESSION_BACKUP_KEY,JSON.stringify({
      email,
      access_token:accessToken,
      refresh_token:refreshToken,
      saved_at:Date.now()
    }));
  }catch(err){
    console.warn("[TLE] session backup save",err);
  }
}
function clearOwnerSessionBackup(){
  try{localStorage.removeItem(OWNER_SESSION_BACKUP_KEY);}catch{}
}
function readOwnerSessionBackup(){
  try{
    const raw=JSON.parse(localStorage.getItem(OWNER_SESSION_BACKUP_KEY)||"null");
    if(!raw?.email || !raw?.access_token || !raw?.refresh_token) return null;
    // Supabase access tokens are JWTs. Never send a damaged legacy token back
    // to Auth because it can cause repeated 403 /user requests on app boot.
    if(String(raw.access_token).split(".").length!==3){
      clearOwnerSessionBackup();
      return null;
    }
    const savedAt=Number(raw.saved_at||0);
    if(!Number.isFinite(savedAt) || Date.now()-savedAt>OWNER_IDLE_MS){
      clearOwnerSessionBackup();
      return null;
    }
    return raw;
  }catch{
    clearOwnerSessionBackup();
    return null;
  }
}
async function restoreOwnerSessionFromBackup(){
  const backup=readOwnerSessionBackup();
  if(!backup) return null;
  const remembered=rememberedOwnerEmail();
  if(remembered && backup.email!==remembered) return null;

  try{
    const {data,error}=await supabase.auth.setSession({
      access_token:backup.access_token,
      refresh_token:backup.refresh_token
    });
    if(error || !data?.session){
      clearOwnerSessionBackup();
      return null;
    }
    saveOwnerSessionBackup(data.session);
    localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
    return data.session;
  }catch(err){
    clearOwnerSessionBackup();
    console.warn("[TLE] session backup restore",err);
    return null;
  }
}
function markOwnerActivity(){
  if(state.business?.role!=="owner") return;
  localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));
}
function ownerIdleExpired(){
  return false;
}
async function expireOwnerSession(){
  // Legacy compatibility only. Owner access no longer uses email codes.
  // Supabase's persisted session/refresh token determines whether the user stays signed in.
  localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
  markOwnerActivity();
}
window.addEventListener("tle:languagechange",()=>{
  if(state.session && state.business?.role==="owner"){
    markOwnerActivity();
  }
});

function installOwnerActivityTracker(){
  if(window.__tleOwnerActivityInstalled) return;
  window.__tleOwnerActivityInstalled=true;
  let lastWrite=0;
  const onActivity=()=>{
    if(!state.session || state.business?.role!=="owner") return;
    const now=Date.now();
    if(now-lastWrite>60000){
      lastWrite=now;
      markOwnerActivity();
    }
  };
  ["pointerdown","keydown","touchstart","scroll"].forEach(evt=>{
    window.addEventListener(evt,onActivity,{passive:true});
  });
  document.addEventListener("visibilitychange",()=>{
    if(state.session && state.business?.role==="owner") markOwnerActivity();
  });
  window.addEventListener("pagehide",()=>{
    if(state.session && state.business?.role==="owner") markOwnerActivity();
  },{passive:true});
}
function prepareAdminShortcut(){
  const remembered=rememberedOwnerEmail();
  if(state.authMode==="signin" && remembered && !$("#authEmail").value) $("#authEmail").value=remembered;
}

function syncAuthPasswordToggle(){
  const input=$("#authPassword");
  const toggle=$("#authPasswordToggle");
  if(!input||!toggle) return;
  const visible=input.type==="text";
  toggle.setAttribute("aria-pressed",visible?"true":"false");
  toggle.setAttribute("aria-label",visible?langPick("Hide password","Ocultar contraseña","Ocultar senha","Masquer le mot de passe"):langPick("Show password","Mostrar contraseña","Mostrar senha","Afficher le mot de passe"));
  toggle.classList.toggle("is-visible",visible);
}
function toggleAuthPasswordVisibility(){
  const input=$("#authPassword");
  if(!input) return;
  let start=null,end=null;
  try{start=input.selectionStart;end=input.selectionEnd;}catch{}
  input.type=input.type==="password"?"text":"password";
  syncAuthPasswordToggle();
  try{input.focus({preventScroll:true});}catch{try{input.focus();}catch{}}
  if(start!=null&&end!=null){try{input.setSelectionRange(start,end);}catch{}}
}
function setAuthMode(mode){
  state.authMode=mode;
  const ownerPanel=$("#ownerCodePanel");
  const links=$(".auth-links");
  if(ownerPanel) ownerPanel.hidden=true;
  if(authForm) authForm.hidden=false;
  if(links) links.hidden=false;
  const title=$("#authTitle");
  const copy=$("#authCopy");
  const submit=$("#authSubmit");
  const switchBtn=$("#authSwitch");
  const password=$("#authPassword");
  const passwordField=$("#passwordField");
  const emailField=$("#emailField")||$("#authEmail").closest("label");
  const forgot=$("#forgotPassword");
  const signupLegalNote=$("#signupLegalNote");
  if(password){password.type="password";}
  syncAuthPasswordToggle();

  if(mode==="signup"){
    title.textContent="Create account";
    copy.textContent="Create your cleaning business account.";
    submit.textContent="Create account";
    submit.hidden=false;
    switchBtn.textContent="Already have an account? Sign in";
    switchBtn.hidden=false;
    passwordField.hidden=false;
    password.required=true;
    password.autocomplete="new-password";
    emailField.hidden=false;
    forgot.hidden=true;
    if(signupLegalNote) signupLegalNote.hidden=false;
  }else if(mode==="recovery"){
    title.textContent="Choose a new password";
    copy.textContent="Enter the new password you want to use.";
    submit.textContent="Update password";
    submit.hidden=false;
    switchBtn.hidden=true;
    passwordField.hidden=false;
    password.required=true;
    password.autocomplete="new-password";
    emailField.hidden=true;
    forgot.hidden=true;
    if(signupLegalNote) signupLegalNote.hidden=true;
  }else{
    title.textContent="Sign in";
    copy.textContent="Open your cleaning business workspace.";
    submit.textContent="Sign in";
    submit.hidden=false;
    switchBtn.textContent="Create account";
    switchBtn.hidden=false;
    passwordField.hidden=false;
    password.required=true;
    password.autocomplete="current-password";
    emailField.hidden=false;
    forgot.hidden=false;
    if(signupLegalNote) signupLegalNote.hidden=true;
  }

  prepareAdminShortcut();
}

$("#authRetryButton")?.addEventListener("click",()=>{
  setAuthStatus("");
  const retry=$("#authRetryButton"); if(retry) retry.hidden=true;
  authForm?.requestSubmit();
});

$("#authSwitch").addEventListener("click",()=>{
  window.__tleAuthModeTouched=true;
  const enteringSignup=state.authMode!=="signup";
  setAuthStatus("");
  const retry=$("#authRetryButton"); if(retry) retry.hidden=true;
  setAuthMode(enteringSignup?"signup":"signin");
  if(enteringSignup){
    const email=$("#authEmail");
    const password=$("#authPassword");
    const emailField=$("#emailField")||email?.closest("label");
    if(emailField) emailField.hidden=false;
    if(email){
      email.required=true;
      email.disabled=false;
      email.removeAttribute("aria-hidden");
    }
    if(password){
      password.required=true;
      password.disabled=false;
      password.value="";
    }
    requestAnimationFrame(()=>{
      try{ email?.scrollIntoView({block:"center",behavior:"smooth"}); }catch{}
      setTimeout(()=>email?.focus(),120);
    });
  }
});

authForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const button = $("#authSubmit");
  setBusy(button,true);
  try{
    const email = $("#authEmail").value.trim().toLowerCase();
    const password = $("#authPassword").value;
    if(state.authMode!=="recovery" && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))){
      setAuthStatus(authRequiredFieldMessage(),"error");
      const retry=$("#authRetryButton"); if(retry){retry.hidden=false;retry.textContent=langPick("Try again","Intentar otra vez","Tentar novamente","Réessayer");}
      $("#authEmail").focus();
      return;
    }
    if(!password || password.length<8){
      setAuthStatus(authRequiredFieldMessage(),"error");
      const retry=$("#authRetryButton"); if(retry){retry.hidden=false;retry.textContent=langPick("Try again","Intentar otra vez","Tentar novamente","Réessayer");}
      $("#authPassword").focus();
      return;
    }
    const retry=$("#authRetryButton"); if(retry) retry.hidden=true;
    setAuthStatus(state.authMode==="signup"?"Creating your account…":"Signing you in…","loading");
    if(state.authMode === "recovery"){
      const { error } = await supabase.auth.updateUser({password});
      if(error) throw error;
      setAuthMode("signin");
      showToast("Password updated");
      await initialize();
      return;
    }
    if(state.authMode === "signup"){
      const { data, error } = await supabase.auth.signUp({
        email,password,
        options:{
          emailRedirectTo: window.location.href.split("#")[0].split("?")[0],
          data:{tle_new_signup:true,tle_signup_welcome_seen:false}
        }
      });
      if(error) throw error;
      if(data.session){
        try{ await supabase.auth.signOut({scope:"local"}); }catch{}
        state.session=null;
      }
      const createdEmail=email;
      markSignupWelcomePending(createdEmail);
      setAuthMode("signin");
      const emailInput=$("#authEmail");
      if(emailInput) emailInput.value=createdEmail;
      $("#authPassword").value="";
      const needsVerification=!data.session;
      const message=needsVerification
        ? "Account created. Check your email to verify it, then sign in."
        : "Account created. Sign in to continue.";
      setAuthStatus(message,"success");
      showToast(message);
      setTimeout(()=>$("#authPassword")?.focus(),120);
    }else{
      const { data, error } = await supabase.auth.signInWithPassword({email,password});
      if(error) throw error;
      state.session=data.session||null;
      localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
      if(state.session) saveOwnerSessionBackup(state.session);
      setAuthStatus("Signed in.","success");
      window.__tleShowSignupWelcome=hasLocalSignupWelcomePending() || hasAccountSignupWelcomePending();
      trackGoogleEvent("login",{method:"password"});
      await enterAuthenticatedApp();
    }
  }catch(err){
    const email=$("#authEmail")?.value?.trim()?.toLowerCase()||"";
    showAuthFailure(err,state.authMode,email);
  }finally{
    setBusy(button,false);
  }
});

$("#forgotPassword").addEventListener("click", async ()=>{
  const email = $("#authEmail").value.trim();
  if(!email){ showToast("Enter your email first"); return; }
  const { error } = await supabase.auth.resetPasswordForEmail(email,{
    redirectTo: window.location.href.split("#")[0].split("?")[0]
  });
  showToast(error ? error.message : "Password reset email sent");
});

async function signOutCurrentUser(event){
  if(window.__tleSigningOut) return;
  window.__tleSigningOut=true;

  const clicked=event?.currentTarget||null;
  const buttons=[$("#signOutBtn"),$("#sidebarSignOutBtn")].filter(Boolean);
  buttons.forEach(btn=>{
    btn.disabled=true;
    btn.dataset.logoutText=btn.textContent;
  });
  if(clicked) clicked.textContent=window.TLE_I18N?.t("Signing out…")||"Signing out…";

  $("#sidebar")?.classList.remove("open");
  document.body.classList.add("tle-signing-out");

  if(window.__tleInvoiceRealtime){
    try{await supabase.removeChannel(window.__tleInvoiceRealtime);}catch{}
    window.__tleInvoiceRealtime=null;
  }

  const wasOwner=state.business?.role==="owner";
  const ownerEmail=String(state.session?.user?.email||rememberedOwnerEmail()).trim().toLowerCase();
  try{
    const {error}=await supabase.auth.signOut({scope:"local"});
    if(error) throw error;

    state.session=null;
    state.business=null;
    clearOwnerSessionBackup();
    if(wasOwner && ownerEmail){
      localStorage.setItem(OWNER_EMAIL_KEY,ownerEmail);
    }
    localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
    localStorage.removeItem(OWNER_ACTIVITY_KEY);
    showAuth();
    setAuthMode("signin");
    const signInEmail=$("#authEmail");
    if(signInEmail && ownerEmail) signInEmail.value=ownerEmail;
    prepareAdminShortcut();
    setAuthStatus("");

    if(ownerEmail===PRIMARY_PLATFORM_ADMIN_EMAIL){
      localStorage.setItem("tle_last_admin_email",PRIMARY_PLATFORM_ADMIN_EMAIL);
      localStorage.setItem("tle_admin_emails",JSON.stringify([PRIMARY_PLATFORM_ADMIN_EMAIL]));
    }
  }catch(err){
    showToast(err?.message||"Could not sign out");
    if(state.session) showApp();
  }finally{
    window.__tleSigningOut=false;
    document.body.classList.remove("tle-signing-out");
    buttons.forEach(btn=>{
      btn.disabled=false;
      btn.textContent=btn.dataset.logoutText||btn.textContent;
    });
  }
}

$("#signOutBtn")?.addEventListener("click",signOutCurrentUser);
$("#sidebarSignOutBtn")?.addEventListener("click",signOutCurrentUser);

function setBusinessSetupStatus(message="",type=""){
  const el=$("#businessSetupStatus");
  if(!el) return;
  el.textContent=message;
  el.className="auth-status"+(type?" "+type:"");
}
$("#businessSetupRetryButton")?.addEventListener("click",()=>{
  setBusinessSetupStatus("");
  const retry=$("#businessSetupRetryButton");
  if(retry) retry.hidden=true;
  businessForm?.requestSubmit();
});

businessForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const button = e.submitter;
  const setupRetry=$("#businessSetupRetryButton");
  if(setupRetry) setupRetry.hidden=true;
  setBusinessSetupStatus("");
  setBusy(button,true,"Creating…");
  try{
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate()+30);
    const signupServiceArea=$("#businessArea").value.trim();
    const globalSetup=await resolveBusinessLocale(signupServiceArea);
    const payload = {
      owner_user_id: state.session.user.id,
      name: $("#businessName").value.trim(),
      email: state.session.user.email,
      phone: $("#businessPhone").value.trim() || null,
      service_area: signupServiceArea || null,
      timezone: globalSetup.timezone,
      country_code: globalSetup.country_code,
      locale_code: globalSetup.locale_code,
      currency_code: globalSetup.currency_code,
      distance_unit: globalSetup.distance_unit,
      temperature_unit: globalSetup.temperature_unit,
      default_language: globalSetup.default_language,
      payment_methods:paymentMethodsForCountry(globalSetup.country_code),
      trial_started_at: start.toISOString(),
      trial_ends_at: end.toISOString(),
      trial_days:30,
      trial_promotion:"standard",
      subscription_status:"trial"
    };
    const { data, error } = await supabase.from("businesses").insert(payload).select().single();
    if(error) throw error;
    state.business={
      id:data.id,name:data.name,email:data.email,phone:data.phone,role:"owner",team_member_id:null,
      timezone:data.timezone,default_language:data.default_language,
      country_code:data.country_code,locale_code:data.locale_code,currency_code:data.currency_code,
      distance_unit:data.distance_unit,temperature_unit:data.temperature_unit,payment_methods:data.payment_methods,
      service_area:data.service_area,default_travel_buffer_minutes:data.default_travel_buffer_minutes,
      trial_ends_at:data.trial_ends_at,trial_days:data.trial_days,trial_promotion:data.trial_promotion,
      subscription_status:data.subscription_status
    };
    await identifyPlatformAdmin();
    const {data:linkSettings}=await supabase.rpc("get_my_public_link_settings");
    state.publicLinks=linkSettings||null;
    localStorage.setItem(OWNER_EMAIL_KEY,String(state.session?.user?.email||"").trim().toLowerCase());
    localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));
    window.__tleShowSignupWelcome=
      window.__tleShowSignupWelcome===true ||
      hasLocalSignupWelcomePending() ||
      hasAccountSignupWelcomePending();
    showApp();
    try{ renderTodaySummary(true); }catch(err){ console.warn("[TLE] first dashboard render",err); }
    loadBusinessWeather(false).catch(err=>console.warn("[TLE] first weather load",err));
    setupInvoiceRealtime();
    loadCoreData().catch(err=>console.warn("[TLE] workspace load",err));
    if(state.isPlatformAdmin) loadPlatformAdmin().catch(err=>console.warn("[TLE] platform admin",err));
    try{
      const {data:notifyData,error:notifyError}=await supabase.functions.invoke("notify-trial-start",{body:{business_id:data.id},headers:{Authorization:`Bearer ${state.session?.access_token||""}`}});
      if(notifyError) console.warn("[TLE] trial welcome automation",notifyError);
      else if(notifyData?.welcome_sent) state.business.trial_welcome_sent_at=new Date().toISOString();
    }catch(err){
      console.warn("[TLE] trial welcome automation",err);
    }
    showToast("Workspace created");
  }catch(err){
    const businessName=$("#businessName")?.value?.trim()||"";
    const area=$("#businessArea")?.value?.trim()||"";
    if(!businessName || !area){
      setBusinessSetupStatus(
        langPick("Check the required fields and try again.","Revisa los campos requeridos y vuelve a intentarlo.","Confira os campos obrigatórios e tente novamente.","Vérifiez les champs obligatoires et réessayez."),
        "error"
      );
      if(setupRetry){
        setupRetry.hidden=false;
        setupRetry.textContent=langPick("Try again","Intentar otra vez","Tentar novamente","Réessayer");
      }
      if(!businessName) $("#businessName")?.focus();
      else $("#businessArea")?.focus();
    }else{
      setBusinessSetupStatus(
        langPick("We couldn’t create your workspace. Try again.","No pudimos crear tu espacio. Intenta otra vez.","Não foi possível criar seu espaço. Tente novamente.","Impossible de créer votre espace. Réessayez."),
        "error"
      );
      if(setupRetry){
        setupRetry.hidden=false;
        setupRetry.textContent=langPick("Try again","Intentar otra vez","Tentar novamente","Réessayer");
      }
      const email=String(state.session?.user?.email||"").trim().toLowerCase();
      const attempt=recordAuthIssueAttempt("signup",email,err);
      if(attempt.item.count>=2 && !attempt.item.reported){
        reportPersistentAuthIssue("signup",email,err,attempt.item.count,attempt.key).then(reported=>{
          if(reported){
            setBusinessSetupStatus(
              langPick(
                "The error is still happening. Support has been alerted. Check the fields and try again.",
                "El error continúa. Soporte ya recibió una alerta. Revisa los campos y vuelve a intentarlo.",
                "O erro continua. O suporte foi avisado. Confira os campos e tente novamente.",
                "L’erreur continue. Le support a été prévenu. Vérifiez les champs et réessayez."
              ),
              "error"
            );
          }
        });
      }
    }
  }finally{
    setBusy(button,false);
  }
});

async function initializeWorkerPortal(activationToken=null){
  setShellState("worker");
  authShell.hidden=true;
  appShell.hidden=true;
  if(publicShell) publicShell.hidden=true;
  workerShell.hidden=false;

  let deviceToken=localStorage.getItem("tle_worker_device_token");

  if(activationToken){
    const {data:activation,error:activationError}=await supabase.rpc("activate_worker_device",{p_token:activationToken});
    if(activationError){
      workerShell.hidden=true;
      showAuth();
      showToast(activationError.message||"Worker activation link is invalid or already used");
      return;
    }
    deviceToken=activation?.device_token||null;
    if(!deviceToken){
      workerShell.hidden=true;
      showAuth();
      showToast("Could not activate this device");
      return;
    }
    localStorage.setItem("tle_worker_device_token",deviceToken);
    localStorage.removeItem("tle_worker_token");

    const clean=new URL(window.location.href);
    clean.searchParams.delete("worker");
    history.replaceState({}, "", clean.pathname + (clean.search ? clean.search : "") + clean.hash);
    showToast("This device is now activated");
  }

  if(!deviceToken){
    workerShell.hidden=true;
    showAuth();
    return;
  }

  const {data,error}=await supabase.rpc("worker_portal_context",{p_token:deviceToken});
  if(error){
    localStorage.removeItem("tle_worker_device_token");
    localStorage.removeItem("tle_worker_token");
    workerShell.hidden=true;
    showAuth();
    showToast(error.message||"Worker access is no longer active");
    return;
  }

  state.workerPortal=data;
  const workerLanguage=String(data?.business?.default_language||"en").toLowerCase();
  if(window.TLE_I18N?.setLanguage && ["en","es","pt","fr"].includes(workerLanguage)){
    window.TLE_I18N.setLanguage(workerLanguage);
  }
  renderWorkerPortal();
  await loadWorkerMessages(true).catch(err=>console.warn("[TLE] worker messages",err));
  installWorkerMessagePolling();
}

function renderWorkerPortal(){
  const data=state.workerPortal||{};
  const worker=data.worker||{};
  const business=data.business||{};
  const jobs=(data.jobs||[]).slice().sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const active=data.active_time||null;
  const today=new Date();

  const bn=$("#workerBusinessName"),ww=$("#workerWelcome"),wc=$("#workerCopy");
  if(bn) bn.textContent=business.name||"Cleaning business";
  const workerLang=String(window.TLE_I18N?.language||business.default_language||"en").toLowerCase();
  const workerCopy={
    en:{access:"Guest Employee Access",pill:"GUEST EMPLOYEE ACCESS",welcome:"Welcome, ",guest:"guest",copy:"This is your limited employee view. You can only use the tools your admin shared with you."},
    es:{access:"Acceso de empleado invitado",pill:"ACCESO LIMITADO · EMPLEADO",welcome:"Bienvenido, ",guest:"invitado",copy:"Esta es tu vista limitada de empleado. Solo puedes usar las funciones que tu administrador compartió contigo."},
    pt:{access:"Acesso de funcionário convidado",pill:"ACESSO DE FUNCIONÁRIO CONVIDADO",welcome:"Bem-vindo, ",guest:"convidado",copy:"Esta é sua área limitada de funcionário. Você só pode usar as funções que o administrador compartilhou com você."},
    fr:{access:"Accès employé invité",pill:"ACCÈS EMPLOYÉ INVITÉ",welcome:"Bienvenue, ",guest:"invité",copy:"Ceci est votre espace employé limité. Vous pouvez uniquement utiliser les fonctions partagées par votre administrateur."}
  }[workerLang]||null;
  const copySet=workerCopy||{access:"Guest Employee Access",pill:"GUEST EMPLOYEE ACCESS",welcome:"Welcome, ",guest:"guest",copy:"This is your limited employee view. You can only use the tools your admin shared with you."};
  if($("#workerAccessLabel")) $("#workerAccessLabel").textContent=copySet.access;
  if($("#workerGuestPill")) $("#workerGuestPill").textContent=copySet.pill;
  if(ww) ww.textContent=copySet.welcome+(worker.name||copySet.guest)+" 👋";
  if(wc) wc.textContent=copySet.copy;

  const jc=$("#workerJobCount"),tc=$("#workerTodayCount"),ts=$("#workerTimerState");
  if(jc) jc.textContent=jobs.length;
  if(tc) tc.textContent=jobs.filter(j=>sameLocalDay(j.starts_at,today)).length;
  if(ts) ts.textContent=active?tr("Running"):tr("Off");

  const list=$("#workerJobsList");
  if(!list) return;
  if(!jobs.length){
    list.innerHTML=`<div class="empty-inline"><strong>${escapeHtml(tr("No assigned jobs."))}</strong><span>${escapeHtml(tr("Your owner or admin will assign jobs when they are ready."))}</span></div>`;
    return;
  }

  list.innerHTML=jobs.map(j=>`
    <article class="worker-job-card">
      <div class="worker-job-top">
        <span><strong>${escapeHtml(j.client_name||tr("Cleaning job"))}</strong><small>${escapeHtml(j.service_name||tr("Cleaning"))} · ${formatDateTime(j.starts_at)}</small></span>
        <span class="status ${j.status==="completed"?"success":j.status==="in_progress"?"warning":"neutral"}">${escapeHtml(translatedStatus(j.status))}</span>
      </div>
      <div class="worker-job-address">${escapeHtml(j.service_address||tr("Address not added"))}</div>
      ${j.client_phone?`<a class="worker-phone" href="tel:${escapeHtml(j.client_phone)}">${escapeHtml(tr("Call client"))}</a>`:""}
      ${j.notes?`<p class="worker-job-notes">${escapeHtml(j.notes)}</p>`:""}
      <div class="worker-job-actions">
        ${j.status!=="completed"?`<button data-worker-status-link="${j.id}" data-status="on_the_way">${escapeHtml(tr("On my way"))}</button><button data-worker-status-link="${j.id}" data-status="in_progress">${escapeHtml(tr("Start job"))}</button><button data-worker-status-link="${j.id}" data-status="completed">${escapeHtml(tr("Complete"))}</button>`:""}
        ${active?.job_id===j.id?`<button class="primary-btn" data-worker-time-stop="${active.id}">${escapeHtml(tr("Finish timer"))}</button>`:`<button class="ghost-btn" data-worker-time-start="${j.id}" ${active?"disabled":""}>${escapeHtml(tr("Start timer"))}</button>`}
        <button class="ghost-btn" data-worker-mileage="${j.id}">${escapeHtml(tr("Log mileage"))}</button>
      </div>
    </article>
  `).join("");
}


function formatTeamMessageTime(value){
  try{
    return new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(value));
  }catch{return "";}
}
function renderMessageList(target,messages,viewer){
  if(!target) return;
  const rows=Array.isArray(messages)?messages:[];
  if(!rows.length){
    target.innerHTML=`<div class="empty-inline"><strong>${viewer==="worker"
      ? escapeHtml(langPick("No messages yet.","Sin mensajes todavía.","Ainda não há mensagens.","Aucun message pour le moment."))
      : escapeHtml(langPick("No conversation yet.","Sin conversación todavía.","Ainda não há conversa.","Aucune conversation pour le moment."))}</strong><span>${viewer==="worker"
      ? escapeHtml(langPick("Messages from your admin will appear here.","Los mensajes de tu administrador aparecerán aquí.","As mensagens do administrador aparecerão aqui.","Les messages de votre administrateur apparaîtront ici."))
      : escapeHtml(langPick("Write the first message below.","Escribe el primer mensaje abajo.","Escreva a primeira mensagem abaixo.","Écrivez le premier message ci-dessous."))}</span></div>`;
    return;
  }
  target.innerHTML=rows.map(m=>{
    const mine=viewer==="worker"?m.sender_type==="worker":m.sender_type==="admin";
    return `<div class="message-row ${mine?"mine":"theirs"}">
      <div class="message-bubble">
        <small>${escapeHtml(m.sender_name||(m.sender_type==="worker"?"Employee":"Admin"))} · ${escapeHtml(formatTeamMessageTime(m.created_at))}</small>
        <p>${escapeHtml(m.body||"")}</p>
      </div>
    </div>`;
  }).join("");
  target.scrollTop=target.scrollHeight;
}
async function loadWorkerMessages(markRead=false){
  const token=localStorage.getItem("tle_worker_device_token");
  if(!token) return [];
  const {data,error}=await supabase.rpc("worker_portal_messages",{p_token:token});
  if(error) throw error;
  state.workerMessages=Array.isArray(data)?data:[];
  const unread=state.workerMessages.filter(m=>m.sender_type==="admin"&&!m.worker_read_at).length;
  const badge=$("#workerMessageUnread");
  if(badge){
    badge.hidden=unread===0;
    badge.textContent=unread+" "+(unread===1?"new":"new");
  }
  renderMessageList($("#workerMessageThread"),state.workerMessages,"worker");
  if(markRead && unread){
    const {error:readError}=await supabase.rpc("worker_portal_mark_messages_read",{p_token:token});
    if(readError) console.warn("[TLE] worker message read",readError);
    else{
      state.workerMessages=state.workerMessages.map(m=>m.sender_type==="admin"?{...m,worker_read_at:m.worker_read_at||new Date().toISOString()}:m);
      if(badge) badge.hidden=true;
    }
  }
  return state.workerMessages;
}
async function sendWorkerMessage(body){
  const token=localStorage.getItem("tle_worker_device_token");
  if(!token) throw new Error("Worker access expired");
  const clean=String(body||"").trim();
  if(!clean) return;
  const {error}=await supabase.rpc("worker_portal_send_message",{p_token:token,p_body:clean});
  if(error) throw error;
  await loadWorkerMessages(true);
}
function installWorkerMessagePolling(){
  clearInterval(window.__tleWorkerMessageTimer);
  window.__tleWorkerMessageTimer=setInterval(()=>{
    if(!workerShell?.hidden) loadWorkerMessages(false).catch(()=>{});
  },12000);
}

async function refreshWorkerPortal(){
  const token=localStorage.getItem("tle_worker_device_token");
  if(!token) return;
  const {data,error}=await supabase.rpc("worker_portal_context",{p_token:token});
  if(error){ localStorage.removeItem("tle_worker_device_token");
  localStorage.removeItem("tle_worker_token"); showAuth(); showToast(error.message); return; }
  state.workerPortal=data;
  renderWorkerPortal();
  await loadWorkerMessages(true).catch(err=>console.warn("[TLE] worker messages",err));
}

async function createWorkerLink(teamMemberId){
  const {data,error}=await supabase.rpc("create_worker_access_link",{p_team_member_id:teamMemberId});
  if(error) throw error;
  const token=data?.token;
  if(!token) throw new Error("Could not create worker link");
  const base=window.location.origin+window.location.pathname;
  const link=`${base}?worker=${encodeURIComponent(token)}`;
  state.currentWorkerLink=link;
  state.modalType="workerLink";
  state.modalId=teamMemberId;
  modalHeader("WORKER ACCESS","Activate worker device",`Send this one-time link to ${data.worker_name||"the worker"}. It expires in 48 hours and no password is required.`);
  entityForm.innerHTML=`
    <div class="worker-link-box"><input id="workerLinkValue" readonly value="${escapeHtml(link)}"><button type="button" class="primary-btn" data-copy-worker-link>Copy link</button></div>
    <div class="permission-note">This activation link works once. After activation, only that device keeps access to assigned jobs, route details, job status, time tracking and mileage. It does not expose client lists, leads, quotes, invoices, pricing, reports, billing or settings.</div>
    <div class="form-footer"><button type="button" class="ghost-btn" data-native-share-worker-link>Share</button><button type="button" class="primary-btn" data-modal-cancel>Done</button></div>`;
  modal.hidden=false;
}

async function ensureTrialWelcomeEmail(){
  if(!state.session?.user || !state.business?.id) return;
  if(state.business.role!=="owner") return;
  if(state.business.trial_welcome_sent_at) return;

  try{
    const {data,error}=await supabase.functions.invoke("notify-trial-start",{body:{business_id:state.business.id},headers:{Authorization:`Bearer ${state.session?.access_token||""}`}});
    if(error) throw error;
    if(data?.welcome_sent){
      state.business.trial_welcome_sent_at=new Date().toISOString();
    }
  }catch(err){
    console.warn("[TLE] trial welcome retry",err);
  }
}

async function enterAuthenticatedApp(){
  if(window.__tleEnterAppPromise) return window.__tleEnterAppPromise;
  window.__tleEnterAppPromise=(async()=>{
    try{
      await initialize();
    }finally{
      window.__tleEnterAppPromise=null;
    }
  })();
  return window.__tleEnterAppPromise;
}

async function initialize(){
  const params=new URLSearchParams(window.location.search);
  const publicMode=params.get("public");
  const publicSlug=params.get("slug");
  const workerActivation=params.get("worker");
  const workerDevice=localStorage.getItem("tle_worker_device_token");

  // public.js owns all customer-facing public routes (booking, quote,
  // quote review and invoice view). Never let Auth overwrite that shell.
  if(window.__tlePublicHandled) return;

  if(workerActivation || workerDevice){
    await initializeWorkerPortal(workerActivation);
    return;
  }

  if((publicMode==="book"||publicMode==="quote") && publicSlug){
    if(window.__tlePublicHandled) return;
    await trackVisit("/public/"+publicMode);
    await initializePublicRequest(publicMode,publicSlug);
    return;
  }

  trackVisit("/login").catch(()=>{});

  const { data:{session:storedSession} } = await supabase.auth.getSession();
  let session=storedSession||null;

  // iOS Home Screen can occasionally fail to surface Supabase's own stored
  // session even while our app storage remains intact. Restore the same
  // access/refresh tokens Supabase already persists, but only inside the
  // user's 12-hour activity window.
  if(!session){
    session=await restoreOwnerSessionFromBackup();
  }

  state.session=session;
  if(!session){
    localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
    const ownerEmail=rememberedOwnerEmail();
    showAuth();
    if(!window.__tleAuthModeTouched){
      if(ownerEmail){
        setAuthMode("signin");
        const emailInput=$("#authEmail");
        if(emailInput) emailInput.value=ownerEmail;
      }else{
        setAuthMode("signup");
      }
    }else if(ownerEmail){
      const emailInput=$("#authEmail");
      if(emailInput && !emailInput.value) emailInput.value=ownerEmail;
    }
    setAuthStatus("");
    return;
  }

  saveOwnerSessionBackup(session);
  const signedInEmail=String(session.user?.email||"").trim().toLowerCase();
  localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
  localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));

  if(signedInEmail===LEGACY_PLATFORM_ADMIN_EMAIL){
    try{ await supabase.auth.signOut({scope:"local"}); }catch{}
    clearOwnerSessionBackup();
    state.session=null;
    localStorage.setItem("tle_last_admin_email",PRIMARY_PLATFORM_ADMIN_EMAIL);
    localStorage.setItem("tle_admin_emails",JSON.stringify([PRIMARY_PLATFORM_ADMIN_EMAIL]));
    showAuth();
    setAuthMode("signin");
    const emailInput=$("#authEmail");
    if(emailInput) emailInput.value=PRIMARY_PLATFORM_ADMIN_EMAIL;
    prepareAdminShortcut();
    setAuthStatus(window.TLE_I18N?.t("Use your current admin email to continue.")||"Use your current admin email to continue.","success");
    return;
  }

  await identifyPlatformAdmin();

  const inviteToken=params.get("invite");
  if(inviteToken){
    const {error:claimError}=await supabase.rpc("claim_business_invite",{p_token:inviteToken});
    if(claimError){
      showToast(claimError.message);
    }else{
      const clean=new URL(window.location.href);
      clean.searchParams.delete("invite");
      history.replaceState({}, "", clean.pathname + clean.hash);
      showToast("Workspace access accepted");
    }
  }

  const {data:contexts,error}=await supabase.rpc("get_my_business_context");
  if(error){ showToast(error.message); showAuth(); return; }
  let context=contexts?.[0];

  if(!context && signedInEmail===PRIMARY_PLATFORM_ADMIN_EMAIL){
    const {data:b,error:businessError}=await supabase
      .from("businesses")
      .select("id,name,timezone,default_language,service_area,default_travel_buffer_minutes,trial_ends_at,subscription_status,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods")
      .eq("owner_user_id",session.user.id)
      .order("created_at",{ascending:true})
      .limit(1)
      .maybeSingle();

    if(!businessError && b){
      context={
        business_id:b.id,
        business_name:b.name,
        role:"owner",
        team_member_id:null,
        timezone:b.timezone,
        default_language:b.default_language,
        country_code:b.country_code,
        locale_code:b.locale_code,
        currency_code:b.currency_code,
        distance_unit:b.distance_unit,
        temperature_unit:b.temperature_unit,
        payment_methods:b.payment_methods,
        service_area:b.service_area,
        default_travel_buffer_minutes:b.default_travel_buffer_minutes,
        trial_ends_at:b.trial_ends_at,
        subscription_status:b.subscription_status
      };
    }
  }

  if(!context){
    showSetup();
    return;
  }

  window.__tleShowSignupWelcome=
    window.__tleShowSignupWelcome===true ||
    hasLocalSignupWelcomePending() ||
    hasAccountSignupWelcomePending();

  state.business={
    id:context.business_id,
    name:context.business_name,
    email:context.business_email||state.session?.user?.email||null,
    phone:context.business_phone||null,
    role:context.role,
    team_member_id:context.team_member_id,
    timezone:context.timezone,
    default_language:context.default_language,
    country_code:context.country_code,
    locale_code:context.locale_code,
    currency_code:context.currency_code,
    distance_unit:context.distance_unit,
    temperature_unit:context.temperature_unit,
    payment_methods:context.payment_methods,
    service_area:context.service_area,
    default_travel_buffer_minutes:context.default_travel_buffer_minutes,
    trial_ends_at:context.trial_ends_at,
    subscription_status:context.subscription_status
  };

  try{
    const {data:companyProfile,error:companyProfileError}=await supabase
      .from("businesses")
      .select("email,phone,instagram_url,facebook_url,trial_started_at,trial_ends_at,trial_days,trial_promotion,subscription_status,trial_welcome_sent_at,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods")
      .eq("id",state.business.id)
      .single();
    if(companyProfileError) throw companyProfileError;
    if(companyProfile) state.business={...state.business,...companyProfile};
  }catch(err){
    console.warn("[TLE] company profile hydrate",err);
  }

  if(state.business?.role==="owner"){
    localStorage.setItem(OWNER_EMAIL_KEY,signedInEmail);
    localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
    markOwnerActivity();
  }

  // Analytics must never block app access.
  setTimeout(async()=>{
    try{
      const {error:loginTrackError}=await supabase.rpc("track_app_login",{p_visitor_id:getVisitorId()});
      if(loginTrackError) console.warn("[TLE] login tracking",loginTrackError);
    }catch(err){
      console.warn("[TLE] login tracking",err);
    }
  },0);

  await handleBillingReturn(params);

  const {data:linkSettings}=await supabase.rpc("get_my_public_link_settings");
  state.publicLinks=linkSettings||null;

  showApp();

  // Welcome email is retried safely until the backend confirms delivery.
  ensureTrialWelcomeEmail().catch(err=>console.warn("[TLE] trial welcome retry",err));

  // Never leave the static HTML placeholder visible on launch.
  try{ renderTodaySummary(); }catch(err){ console.warn("[TLE] first dashboard render",err); }
  loadBusinessWeather(false).catch(err=>console.warn("[TLE] first weather load",err));

  setupInvoiceRealtime();
  showToast("Loading your workspace…");
  loadCoreData().catch(err=>console.warn("[TLE] workspace load",err));
  if(state.isPlatformAdmin) loadPlatformAdmin().catch(err=>console.warn("[TLE] platform admin",err));
  await trackVisit("/app/today");
}
window.addEventListener("pageshow",event=>{
  if(!appShell?.hidden){
    setShellState("app");
    try{
      if("scrollRestoration" in history) history.scrollRestoration="manual";
      document.documentElement.scrollTop=0;
      document.body.scrollTop=0;
      window.scrollTo(0,0);
    }catch{}
  }else if(!publicShell?.hidden){
    setShellState("public");
  }else if(!workerShell?.hidden){
    setShellState("worker");
  }else{
    setShellState("auth");
  }
});

supabase.auth.onAuthStateChange((event, session)=>{
  // IMPORTANT: keep this callback synchronous.
  // Awaiting Supabase calls from onAuthStateChange can deadlock supabase-js.
  if(event === "PASSWORD_RECOVERY"){
    state.session=session;
    setTimeout(()=>{
      showAuth();
      setAuthMode("recovery");
    },0);
    return;
  }
  if(event === "SIGNED_IN" && session){
    state.session=session;
    saveOwnerSessionBackup(session);
    if(window.__tleEnterAppPromise) return;
    setTimeout(()=>{
      if(appShell.hidden && !window.__tleEnterAppPromise){
        enterAuthenticatedApp().catch(err=>{
          console.error("[TLE] post-auth initialize failed",err);
          showAuth();
          setAuthStatus(err?.message||"Could not open workspace","error");
        });
      }
    },0);
    return;
  }
  if(event === "TOKEN_REFRESHED" && session){
    state.session=session;
    saveOwnerSessionBackup(session);
    return;
  }
  if(event === "SIGNED_OUT"){
    state.session=null;
    state.business=null;
    if(window.__tleSigningOut || window.__tleOwnerLocking) return;
    setTimeout(()=>{
      showAuth();
      setAuthMode("signin");
      prepareAdminShortcut();
    },0);
  }
});

async function withTimeout(promise,label,ms=9000){
  let timer;
  try{
    return await Promise.race([
      promise,
      new Promise((_,reject)=>{
        timer=setTimeout(()=>reject(new Error(label+" timed out")),ms);
      })
    ]);
  }finally{
    clearTimeout(timer);
  }
}

const INQUIRY_NOTIFICATION_TTL_MS=24*60*60*1000;
const BOOKING_REVIEW_VISIBILITY_MS=12*60*60*1000;

function bookingRequestVisibleInQueue(booking){
  if(!booking?.reviewed_at) return true;
  const reviewedAt=new Date(booking.reviewed_at).getTime();
  if(!Number.isFinite(reviewedAt)) return true;
  return Date.now()-reviewedAt<BOOKING_REVIEW_VISIBILITY_MS;
}

function visibleBookingRequests(){
  return state.bookingRequests.filter(bookingRequestVisibleInQueue);
}

async function markBookingReviewed(id){
  if(!id) return null;
  const booking=state.bookingRequests.find(b=>b.id===id);
  if(booking?.reviewed_at) return booking.reviewed_at;

  const {data,error}=await supabase.rpc("mark_booking_request_reviewed",{p_request_id:id});
  if(error) throw error;

  const reviewedAt=data||new Date().toISOString();
  if(booking) booking.reviewed_at=reviewedAt;
  renderBookingRequests();
  renderTodaySummary();
  return reviewedAt;
}

function inquirySeenKey(){
  return "tle_inquiry_seen_at_"+(state.business?.id||"business")+"_"+(state.session?.user?.id||"user");
}
function currentInquirySeenAt(){
  const local=Number(localStorage.getItem(inquirySeenKey())||0);
  return Math.max(Number(state.inquirySeenAt||0),Number.isFinite(local)?local:0);
}
async function loadInquirySeenState(){
  const userId=state.session?.user?.id;
  const businessId=state.business?.id;
  if(!userId||!businessId) return currentInquirySeenAt();
  const scope=userId+":"+businessId;
  if(state.inquirySeenLoadedFor===scope) return currentInquirySeenAt();

  let persisted=0;
  try{
    const {data,error}=await supabase
      .from("app_notification_state")
      .select("last_seen_at")
      .eq("user_id",userId)
      .eq("business_id",businessId)
      .maybeSingle();
    if(error) throw error;
    persisted=data?.last_seen_at?new Date(data.last_seen_at).getTime():0;
  }catch(err){
    console.warn("[TLE] notification state read",err);
  }

  const localSeen=currentInquirySeenAt();
  const seen=Math.max(localSeen,Number.isFinite(persisted)?persisted:0);
  state.inquirySeenAt=seen;
  state.inquirySeenLoadedFor=scope;
  try{localStorage.setItem(inquirySeenKey(),String(seen));}catch{}

  // Migrate an already-seen notification state from this device to the account
  // so it stays read after closing the app or signing in on another device.
  if(seen>persisted){
    supabase.from("app_notification_state").upsert({
      user_id:userId,
      business_id:businessId,
      last_seen_at:new Date(seen).toISOString(),
      updated_at:new Date().toISOString()
    },{onConflict:"user_id,business_id"}).then(({error})=>{
      if(error) console.warn("[TLE] notification state migration",error);
    }).catch(err=>console.warn("[TLE] notification state migration",err));
  }
  return seen;
}
function persistInquirySeenState(seen){
  const value=Number(seen||0);
  if(!Number.isFinite(value)||value<=0) return;
  state.inquirySeenAt=Math.max(Number(state.inquirySeenAt||0),value);
  try{localStorage.setItem(inquirySeenKey(),String(state.inquirySeenAt));}catch{}

  const userId=state.session?.user?.id;
  const businessId=state.business?.id;
  if(!userId||!businessId) return;
  supabase.from("app_notification_state").upsert({
    user_id:userId,
    business_id:businessId,
    last_seen_at:new Date(state.inquirySeenAt).toISOString(),
    updated_at:new Date().toISOString()
  },{onConflict:"user_id,business_id"}).then(({error})=>{
    if(error) console.warn("[TLE] notification state write",error);
  }).catch(err=>console.warn("[TLE] notification state write",err));
}

async function loadInquiryReadIds(){
  const userId=state.session?.user?.id;
  const businessId=state.business?.id;
  if(!userId||!businessId){
    state.inquiryReadIds=new Set();
    return state.inquiryReadIds;
  }
  try{
    const {data,error}=await supabase
      .from("app_notification_reads")
      .select("notification_id")
      .eq("user_id",userId)
      .eq("business_id",businessId);
    if(error) throw error;
    state.inquiryReadIds=new Set((data||[]).map(row=>String(row.notification_id||"")).filter(Boolean));
  }catch(err){
    console.warn("[TLE] notification reads load",err);
    state.inquiryReadIds=new Set();
  }
  return state.inquiryReadIds;
}
function isInquiryNotificationRead(item){
  if(!item) return true;
  if(state.inquiryReadIds?.has(item.id)) return true;
  const seen=currentInquirySeenAt();
  const created=new Date(item.createdAt).getTime();
  return Number.isFinite(created)&&created<=seen;
}
async function markInquiryNotificationRead(notificationId){
  if(!notificationId) return;
  if(!(state.inquiryReadIds instanceof Set)) state.inquiryReadIds=new Set();
  state.inquiryReadIds.add(notificationId);
  renderInquiryNotifications();

  const userId=state.session?.user?.id;
  const businessId=state.business?.id;
  if(!userId||!businessId) return;
  try{
    const {error}=await supabase.from("app_notification_reads").upsert({
      user_id:userId,
      business_id:businessId,
      notification_id:notificationId,
      read_at:new Date().toISOString()
    },{onConflict:"user_id,business_id,notification_id"});
    if(error) throw error;
  }catch(err){
    console.warn("[TLE] notification read write",err);
  }
}

function findMatchingClient({email,phone,name}={}){
  const cleanEmail=String(email||"").trim().toLowerCase();
  const cleanPhone=String(phone||"").replace(/\D/g,"");
  const cleanName=String(name||"").trim().toLowerCase();

  return state.clients.find(c=>{
    const clientEmail=String(c.email||"").trim().toLowerCase();
    const clientPhone=String(c.phone||"").replace(/\D/g,"");
    const clientName=String(c.name||"").trim().toLowerCase();
    return (cleanEmail && clientEmail===cleanEmail)
      || (cleanPhone && clientPhone===cleanPhone)
      || (cleanName && clientName===cleanName);
  })||null;
}

function getInquiryNotifications(){
  const bookingLeadIds=new Set(
    state.bookingRequests.map(b=>b.lead_id).filter(Boolean)
  );
  const items=[];

  state.bookingRequests.forEach(b=>{
    const lead=b.lead_id?state.leads.find(l=>l.id===b.lead_id):null;
    const client=findMatchingClient({
      email:b.customer_email,
      phone:b.customer_phone,
      name:b.customer_name
    });
    items.push({
      id:"booking:"+b.id,
      recordId:b.id,
      type:"booking",
      createdAt:b.created_at,
      name:b.customer_name||"New customer",
      email:b.customer_email||"",
      phone:b.customer_phone||"",
      address:b.service_address||"",
      service:b.services?.name||lead?.service_interest||"Cleaning request",
      serviceId:b.service_id||"",
      requestedAt:b.requested_start_at||"",
      notes:b.notes||lead?.notes||"",
      preferredContact:b.preferred_contact||lead?.preferred_contact||"",
      status:b.status||"requested",
      clientId:client?.id||""
    });
  });

  state.leads.forEach(l=>{
    if(bookingLeadIds.has(l.id)) return;
    const client=findMatchingClient({
      email:l.email,
      phone:l.phone,
      name:l.name
    });
    items.push({
      id:"lead:"+l.id,
      recordId:l.id,
      type:"lead",
      createdAt:l.created_at,
      name:l.name||"New lead",
      email:l.email||"",
      phone:l.phone||"",
      address:l.address||"",
      service:l.service_interest||"New inquiry",
      serviceId:"",
      requestedAt:"",
      notes:l.notes||"",
      preferredContact:l.preferred_contact||"",
      status:l.status||"new",
      clientId:client?.id||""
    });
  });

  const cutoff=Date.now()-INQUIRY_NOTIFICATION_TTL_MS;
  return items
    .filter(x=>x.createdAt && new Date(x.createdAt).getTime()>=cutoff)
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
    .slice(0,20);
}

function openInquiryNotificationDetail(notificationId){
  const item=getInquiryNotifications().find(x=>x.id===notificationId);
  if(!item) return;

  markInquiryNotificationRead(notificationId).catch(err=>console.warn("[TLE] notification read",err));

  if(item.type==="booking"){
    markBookingReviewed(item.recordId).catch(err=>console.warn("[TLE] mark booking reviewed",err));
  }

  state.modalType="inquiryDetail";
  state.modalId=item.recordId;

  const typeLabel=item.type==="booking"
    ? langPick("BOOKING REQUEST","SOLICITUD DE RESERVA","SOLICITAÇÃO DE RESERVA","DEMANDE DE RÉSERVATION")
    : langPick("INQUIRY","INQUIRY","CONTATO","DEMANDE");

  const statusLabel=String(item.status||"").replaceAll("_"," ");
  const requested=item.requestedAt?formatDateTime(item.requestedAt):"";
  const contactMethod=item.preferredContact
    ? item.preferredContact.charAt(0).toUpperCase()+item.preferredContact.slice(1)
    : "";

  modalHeader(
    typeLabel,
    item.name,
    item.service
  );

  entityForm.innerHTML=`
    <div class="inquiry-detail-card">
      <div class="inquiry-detail-service">
        <span>${escapeHtml(langPick("SERVICE","SERVICIO","SERVIÇO","SERVICE"))}</span>
        <strong>${escapeHtml(item.service)}</strong>
        ${statusLabel?`<small>${escapeHtml(statusLabel)}</small>`:""}
      </div>

      <div class="inquiry-detail-grid">
        ${item.phone?`<div><small>${escapeHtml(langPick("Phone","Teléfono","Telefone","Téléphone"))}</small><strong>${escapeHtml(item.phone)}</strong></div>`:""}
        ${item.email?`<div><small>Email</small><strong>${escapeHtml(item.email)}</strong></div>`:""}
        ${item.address?`<div class="full"><small>${escapeHtml(langPick("Address","Dirección","Endereço","Adresse"))}</small><strong>${escapeHtml(item.address)}</strong></div>`:""}
        ${requested?`<div class="full"><small>${escapeHtml(langPick("Requested date & time","Fecha y hora solicitada","Data e hora solicitadas","Date et heure demandées"))}</small><strong>${escapeHtml(requested)}</strong></div>`:""}
        ${contactMethod?`<div><small>${escapeHtml(langPick("Preferred contact","Contacto preferido","Contato preferido","Contact préféré"))}</small><strong>${escapeHtml(contactMethod)}</strong></div>`:""}
        ${item.notes?`<div class="full"><small>${escapeHtml(langPick("Notes","Notas","Observações","Notes"))}</small><p>${escapeHtml(item.notes)}</p></div>`:""}
      </div>

      <div class="form-footer inquiry-detail-actions">
        <button type="button" class="ghost-btn" data-modal-cancel>${escapeHtml(langPick("Close","Cerrar","Fechar","Fermer"))}</button>
        ${item.clientId?`<button type="button" class="primary-btn" data-inquiry-open-client="${escapeHtml(item.clientId)}">${escapeHtml(langPick("Open client","Abrir cliente","Abrir cliente","Ouvrir le client"))}</button>`:""}
        ${item.type==="lead"?`<button type="button" class="primary-btn" data-inquiry-open-lead="${escapeHtml(item.recordId)}">${escapeHtml(langPick("Open lead","Abrir lead","Abrir lead","Ouvrir le prospect"))}</button>`:""}
      </div>
    </div>`;
  modal.hidden=false;
}

function getInquiryUnreadCount(){
  return getInquiryNotifications().filter(item=>!isInquiryNotificationRead(item)).length;
}

function renderInquiryNotifications(){
  const button=$("#notificationBellBtn");
  const badge=$("#notificationBadge");
  const list=$("#notificationList");
  if(!button||!badge||!list||!state.business) return;

  const items=getInquiryNotifications();
  const unreadItems=items.filter(item=>!isInquiryNotificationRead(item));
  const unread=unreadItems.length;

  badge.textContent=unread>99?"99+":String(unread);
  badge.hidden=unread===0;
  button.classList.toggle("has-notifications",unread>0);
  button.setAttribute("aria-label",unread
    ? langPick(unread+" new inquiries",unread+" inquiries nuevos",unread+" novos contatos",unread+" nouvelles demandes")
    : langPick("Inquiries","Inquiries","Contatos","Demandes"));

  if(!unreadItems.length){
    list.innerHTML=`<div class="notification-empty"><strong>${escapeHtml(langPick("You’re all caught up","Todo al día","Tudo em dia","Tout est à jour"))}</strong><span>${escapeHtml(langPick("Only new notifications will appear here.","Solo las notificaciones nuevas aparecerán aquí.","Somente novas notificações aparecerão aqui.","Seules les nouvelles notifications apparaîtront ici."))}</span></div>`;
    return;
  }

  list.innerHTML=unreadItems.slice(0,8).map(item=>{
    const isNew=true;
    const typeLabel=item.type==="booking"
      ? langPick("Booking request","Solicitud de reserva","Solicitação de reserva","Demande de réservation")
      : langPick("Lead","Lead","Lead","Prospect");
    return `
      <button class="notification-item ${isNew?"is-new":""}" type="button" data-notification-id="${escapeHtml(item.id)}">
        <span class="notification-dot" aria-hidden="true"></span>
        <span class="notification-copy">
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.service)}</small>
          <em>${[item.phone,item.email].filter(Boolean).map(escapeHtml).join(" · ")}${item.phone||item.email?" · ":""}${formatDateTime(item.createdAt)}</em>
        </span>
        <span class="notification-arrow" aria-hidden="true">→</span>
      </button>`;
  }).join("");
}

function markInquiryNotificationsSeen(){
  const items=getInquiryNotifications();
  if(!items.length) return;
  const newest=Math.max(...items.map(x=>new Date(x.createdAt).getTime()).filter(Number.isFinite));
  if(Number.isFinite(newest)) persistInquirySeenState(newest);
  renderInquiryNotifications();
}

function openNotificationPopover(){
  const popover=$("#notificationPopover");
  const button=$("#notificationBellBtn");
  if(!popover||!button) return;
  const willOpen=popover.hidden;
  popover.hidden=!willOpen;
  button.setAttribute("aria-expanded",willOpen?"true":"false");
  if(willOpen) renderInquiryNotifications();
}

function closeNotificationPopover(){
  const popover=$("#notificationPopover");
  const button=$("#notificationBellBtn");
  if(popover) popover.hidden=true;
  if(button) button.setAttribute("aria-expanded","false");
}

function setupInvoiceRealtime(){
  if(!state.business?.id) return;

  if(window.__tleInvoiceRealtime){
    try{supabase.removeChannel(window.__tleInvoiceRealtime);}catch{}
    window.__tleInvoiceRealtime=null;
  }

  const refresh=function(){
    clearTimeout(window.__tleOperationalRefresh);
    window.__tleOperationalRefresh=setTimeout(function(){
      loadCoreData().catch(function(err){console.warn("[TLE] realtime workspace refresh",err);});
    },700);
  };

  let channel=supabase.channel("workspace-updates-"+state.business.id);
  ["invoices","jobs","quotes","booking_requests","leads"].forEach(function(table){
    channel=channel.on("postgres_changes",{
      event:"*",
      schema:"public",
      table:table,
      filter:"business_id=eq."+state.business.id
    },refresh);
  });
  window.__tleInvoiceRealtime=channel.subscribe();
}

async function loadCoreData(){
  if(!state.business) return;
  const businessId=state.business.id;

  const loadFailures=[];
  const safe=async(label,promise,fallback=[])=>{
    try{
      const result=await withTimeout(promise,label);
      if(result?.error) throw result.error;
      return result?.data??fallback;
    }catch(err){
      console.warn("[TLE]",label,err);
      loadFailures.push(label);
      return fallback;
    }
  };

  // Load in small batches so mobile/PWA does not overwhelm the API connection pool.
  const [clients,leads,services,addons,availability]=await Promise.all([
    safe("clients",supabase.from("clients").select("*").eq("business_id",businessId).is("archived_at",null).order("created_at",{ascending:false}),state.clients),
    safe("leads",supabase.from("leads").select("*").eq("business_id",businessId).is("archived_at",null).order("created_at",{ascending:false}),state.leads),
    safe("services",supabase.from("services").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),state.services),
    safe("service add-ons",supabase.from("service_addons").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),state.serviceAddons),
    safe("availability",supabase.from("availability_rules").select("*").eq("business_id",businessId).order("weekday").order("start_time"),state.availabilityRules)
  ]);
  state.clients=clients;
  state.leads=leads;
  state.services=services;
  state.serviceAddons=addons;
  state.availabilityRules=availability;
  renderClients();
  renderLeads();
  renderServices();
  renderBookingServices();
  renderAvailabilityEditor();

  const [jobs,quotes,team,supplies,disputes]=await Promise.all([
    safe("jobs",supabase.from("jobs").select("*, clients(name,email), services(name), job_assignments(id,team_member_id,team_members(name))").eq("business_id",businessId).order("starts_at",{ascending:true}),state.jobs),
    safe("quotes",supabase.from("quotes").select("*, quote_items(*)").eq("business_id",businessId).order("created_at",{ascending:false}),state.quotes),
    safe("team",supabase.from("team_members").select("*").eq("business_id",businessId).eq("active",true).order("name"),state.teamMembers),
    safe("supplies",supabase.from("supplies").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),state.supplies),
    safe("customer disputes",supabase.from("customer_disputes").select("*").eq("business_id",businessId).order("created_at",{ascending:false}),state.disputes)
  ]);
  state.jobs=jobs;
  state.quotes=quotes;
  state.teamMembers=team;
  state.supplies=supplies;
  state.disputes=disputes;
  renderJobs();
  renderQuotes();
  renderTeam();
  if(["owner","admin"].includes(String(state.business?.role||""))) await loadTeamMessageThreads().catch(err=>console.warn("[TLE] team messages",err));
  renderSupplies();

  const [invoices,bookingRequests,mileageLogs,timeEntries]=await Promise.all([
    safe("invoices",supabase.from("invoices").select("*, clients(name,email), invoice_items(*), payments(method,amount,status,paid_at)").eq("business_id",businessId).order("created_at",{ascending:false}),state.invoices),
    safe("booking requests",supabase.from("booking_requests").select("*, services(name)").eq("business_id",businessId).order("created_at",{ascending:false}),state.bookingRequests),
    safe("mileage",supabase.from("mileage_logs").select("*, jobs(service_address,clients(name),services(name))").eq("business_id",businessId).order("log_date",{ascending:false}),state.mileageLogs),
    safe("time tracking",supabase.from("job_time_entries").select("*, jobs(starts_at,duration_minutes,status,clients(name),services(name)), team_members(name)").eq("business_id",businessId).order("clocked_in_at",{ascending:false}),state.timeEntries)
  ]);
  state.invoices=invoices;
  state.bookingRequests=bookingRequests;
  state.mileageLogs=mileageLogs;
  state.timeEntries=timeEntries;
  renderInvoices();
  await loadInquirySeenState();
  await loadInquiryReadIds();
  renderInquiryNotifications();
  renderTodaySummary();
  renderOperations();
  renderSettings();
  renderPublicLinks();
  loadBusinessWeather(false).catch(function(err){console.warn("[TLE] weather load",err);});

  if(state.business.role==="owner"){
    loadOwnerAdmin().catch(err=>console.warn("[TLE] owner admin",err));
  }

  if(loadFailures.length){
    const now=Date.now();
    if(now-Number(window.__tleLastLoadWarningAt||0)>45000){
      window.__tleLastLoadWarningAt=now;
      showToast(langPick(
        "Some data couldn’t refresh. Your saved data is safe; tap Refresh to try again.",
        "Algunos datos no pudieron actualizarse. Lo guardado sigue seguro; toca Actualizar para intentar otra vez.",
        "Alguns dados não puderam ser atualizados. Seus dados salvos estão seguros; toque em Atualizar para tentar novamente.",
        "Certaines données n’ont pas pu être actualisées. Vos données enregistrées sont en sécurité ; touchez Actualiser pour réessayer."
      ));
    }
  }
}

async function loadOwnerAdmin(){
  $$("[data-account-billing]").forEach(el=>{
    el.hidden=isPrimaryPlatformAdminAccount();
  });
  const [membersRes,invitesRes]=await Promise.all([
    supabase.from("business_members").select("*").eq("business_id",state.business.id).order("created_at"),
    supabase.from("business_invites").select("*").eq("business_id",state.business.id).is("accepted_at",null).is("revoked_at",null).order("created_at",{ascending:false})
  ]);
  state.members=membersRes.data||[];
  state.invites=invitesRes.data||[];
  renderMembers();
  const status=$("#adminPlanStatus");
  const trial=$("#adminTrialEnds");
  if(status) status.textContent=state.business.subscription_status||"Trial";
  if(trial) trial.textContent=state.business.trial_ends_at?new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",year:"numeric"}).format(new Date(state.business.trial_ends_at)):"—";
}

function renderMembers(){
  const list=$("#membersList");
  if(!list) return;
  const rows=state.members.map(m=>`
    <div class="member-row">
      <div class="member-avatar">${escapeHtml(initials(m.display_name||m.email||m.role))}</div>
      <div><strong>${escapeHtml(m.display_name||m.email||"Team member")}</strong><small>${escapeHtml(m.email||"")} · ${escapeHtml(m.role)}</small></div>
      ${m.role==="owner"
        ? `<span class="status success">Owner</span>`
        : `<select data-member-role="${m.id}"><option value="admin" ${m.role==="admin"?"selected":""}>Admin</option><option value="coworker" ${m.role==="coworker"?"selected":""}>Coworker</option></select><button class="danger-link" data-remove-member="${m.id}">Remove</button>`}
    </div>
  `).join("");
  const pending=state.invites.map(i=>`
    <div class="member-row pending">
      <div class="member-avatar">✉</div>
      <div><strong>${escapeHtml(i.email)}</strong><small>Pending invite · ${escapeHtml(i.role)} · expires ${escapeHtml(formatDateTime(i.expires_at))}</small></div>
      <button data-copy-invite="${i.token}">Copy invite</button>
      <button class="danger-link" data-revoke-invite="${i.id}">Revoke</button>
    </div>
  `).join("");
  list.innerHTML=(rows||'<div class="empty-inline">No members yet.</div>')+pending;
}

function openInviteForm(){
  state.modalType="invite";state.modalId=null;
  modalHeader("OWNER ONLY","Invite Admin","Admins can operate the business. Workers use no-password worker links from Team.");
  entityForm.innerHTML=`
    <div class="form-grid">
      <label class="full">Admin email<input name="email" type="email" required placeholder="admin@email.com"></label>
      <input type="hidden" name="role" value="admin">
    </div>
    <div class="permission-note">Admins can manage day-to-day operations but cannot access owner billing, platform permissions, integrations, migration/security or Owner Reports.</div>
    ${formSubmit("Create Admin invite link")}`;
  modal.hidden=false;
}

async function saveInvite(fd){
  const email=String(fd.get("email")||"").trim().toLowerCase();
  const role=fd.get("role");
  const {data,error}=await supabase.from("business_invites").insert({
    business_id:state.business.id,email,role,invited_by:state.session.user.id
  }).select("token").single();
  if(error) throw error;
  const link=new URL(window.location.href.split("#")[0]);
  link.search="";
  link.searchParams.set("invite",data.token);
  await copyText(link.toString());
  await loadOwnerAdmin();
  showToast("Invite link copied");
}

function renderLeads(){
  const table=$("#leadsTable");
  if(!table) return;
  if(!state.leads.length){
    table.innerHTML=`<div class="empty-table"><strong>No leads yet.</strong><span>Add an inquiry or wait for booking/quote requests.</span><button class="text-btn" data-action="lead">+ Add lead</button></div>`;
    return;
  }
  table.innerHTML=state.leads.map(l=>`
    <div class="table-row mobile-record-card">
      <span class="record-primary"><strong>${escapeHtml(l.name)}</strong><small>${escapeHtml(l.email)}</small></span>
      <span class="record-field" data-label="${escapeHtml(tr("Source"))}">${escapeHtml(l.source||"—")}</span>
      <span class="record-field" data-label="${escapeHtml(tr("Service"))}">${escapeHtml(l.service_interest||"—")}</span>
      <span class="record-field" data-label="${escapeHtml(tr("Status"))}"><i class="status ${l.status==="new"?"blue":l.status==="booked"?"success":l.status==="lost"?"danger":"neutral"}">${escapeHtml(translatedStatus(l.status))}</i></span>
      <span class="record-actions">
        <span class="safe-actions"><button data-edit-lead="${l.id}">${escapeHtml(tr("Edit"))}</button><button data-lead-to-quote="${l.id}">${escapeHtml(tr("Quote"))}</button><button data-archive-lead="${l.id}">${escapeHtml(tr("Archive"))}</button></span>
        <button class="record-delete-btn" data-delete-record="lead" data-id="${l.id}">${escapeHtml(tr("Delete lead"))}</button>
      </span>
    </div>`).join("");
}

function invoicePaidAmount(inv){
  return (inv.payments||[]).filter(p=>p.status==="confirmed").reduce((sum,p)=>sum+Number(p.amount||0),0);
}
function renderInvoices(){
  const table=$("#invoicesTable");
  if(!table) return;
  const outstanding=state.invoices.filter(i=>i.status!=="void").reduce((sum,i)=>sum+Math.max(0,Number(i.total||0)-invoicePaidAmount(i)),0);
  const paidThisMonth=state.invoices.flatMap(i=>i.payments||[]).filter(p=>{
    if(p.status!=="confirmed"||!p.paid_at) return false;
    const d=new Date(p.paid_at), now=new Date();
    return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();
  }).reduce((sum,p)=>sum+Number(p.amount||0),0);
  const open=state.invoices.filter(i=>!["paid","void"].includes(i.status)).length;
  const a=$("#invoiceOutstanding"),b=$("#invoicePaid"),d=$("#invoiceOpen");
  if(a) a.textContent=money(outstanding); if(b) b.textContent=money(paidThisMonth); if(d) d.textContent=open;

  if(!state.invoices.length){
    table.innerHTML=`<div class="empty-table"><strong>No invoices yet.</strong><span>Create one manually or accept a quote to prepare a draft invoice.</span><button class="text-btn" data-action="invoice">+ New invoice</button></div>`;
    return;
  }
  table.innerHTML=state.invoices.map(inv=>{
    const paid=invoicePaidAmount(inv);
    const lastMethod=(inv.payments||[]).filter(p=>p.status==="confirmed").at(-1)?.method;
    const chosenMethod=String(inv.customer_payment_method||"").toLowerCase();
    const methodLabel=paymentMethodLabel(chosenMethod);
    const dispute=state.disputes.find(d=>d.resource_type==="invoice"&&d.invoice_id===inv.id&&d.status==="open");
    const overdue=inv.due_at && new Date(inv.due_at)<new Date() && !["paid","void"].includes(inv.status);
    const statusClass=inv.status==="paid"?"success":overdue?"danger":inv.status==="sent"||inv.status==="partial"?"warning":"neutral";
    return `<div class="table-row mobile-record-card">
      <span class="record-primary"><strong>#${inv.invoice_number||String(inv.id).slice(0,6)}</strong><small>${inv.due_at?langPick("Due ","Vence ","Vence ","Échéance ")+new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(inv.due_at)):tr("No due date")}</small></span>
      <span class="record-field" data-label="${escapeHtml(tr("Client"))}">${escapeHtml(inv.clients?.name||tr("No client"))}</span>
      <span class="record-field" data-label="${escapeHtml(tr("Amount"))}"><strong>${money(inv.total)}</strong><small>${paid?money(paid)+" "+tr("paid"):""}</small></span>
      <span class="record-field" data-label="${escapeHtml(tr("Status"))}"><i class="status ${statusClass}">${overdue?tr("Overdue"):escapeHtml(translatedStatus(inv.status))}</i>${methodLabel?`<small class="payment-choice-note">${escapeHtml(tr("Customer chose"))} ${escapeHtml(methodLabel)}</small>`:""}${dispute?`<small class="dispute-alert">OPEN DISPUTE · ${escapeHtml(dispute.reason)}</small>`:""}</span>
      <span class="record-actions">
        <span class="safe-actions">
          <button data-edit-invoice="${inv.id}">${escapeHtml(tr("Edit"))}</button>
          ${dispute?`<button data-resolve-dispute="${dispute.id}">${escapeHtml(tr("Resolve dispute"))}</button>`:""}
          ${inv.status==="draft"?`<button data-send-invoice="${inv.id}">${escapeHtml(tr("Send invoice"))}</button>`:""}
          ${!["paid","void"].includes(inv.status)?`<button data-record-payment="${inv.id}">${escapeHtml(lastMethod?tr("Add payment"):methodLabel?tr("Confirm payment"):tr("Record payment"))}</button>`:""}
        </span>
        <button class="record-delete-btn" data-delete-record="invoice" data-id="${inv.id}">${escapeHtml(tr("Delete invoice"))}</button>
      </span>
    </div>`;
  }).join("");
}

function renderBookingServices(){
  const list=$("#bookingServicesList");
  if(!list) return;
  const active=state.services.filter(s=>s.active);
  if(!active.length){
    list.innerHTML=`<div class="empty-inline"><strong>No active services yet.</strong><span>Add a service before public booking goes live.</span></div>`;
    return;
  }
  list.innerHTML=active.map(s=>{
    const addons=state.serviceAddons.filter(a=>a.active && (a.service_id===s.id || !a.service_id));
    return `<div class="booking-service-row">
      <span><strong>${escapeHtml(s.name)}</strong><small>${Math.round(s.default_duration_minutes/60*10)/10} hr · ${s.pricing_type==="quote"?"Quote required":money(s.base_price)}</small></span>
      <span class="booking-addon-chips">${addons.map(a=>`<i>+${escapeHtml(a.name)} · ${money(a.price)}</i>`).join("")||"<i>No add-ons</i>"}</span>
    </div>`;
  }).join("");
}

function renderAvailabilityEditor(){
  const wrap=$("#availabilityWeek");
  if(!wrap) return;

  const days=[
    {weekday:1,label:"Monday"},
    {weekday:2,label:"Tuesday"},
    {weekday:3,label:"Wednesday"},
    {weekday:4,label:"Thursday"},
    {weekday:5,label:"Friday"},
    {weekday:6,label:"Saturday"},
    {weekday:0,label:"Sunday"}
  ];

  wrap.innerHTML=days.map(day=>{
    const rule=state.availabilityRules.find(r=>Number(r.weekday)===day.weekday && r.active);
    const on=Boolean(rule);
    const start=(rule?.start_time||"09:00:00").slice(0,5);
    const end=(rule?.end_time||"17:00:00").slice(0,5);
    return '<div class="availability-day '+(on?"":"off")+'" data-weekday="'+day.weekday+'">'+
      '<label class="day-toggle"><input type="checkbox" data-day-enabled '+(on?"checked":"")+'> '+day.label+'</label>'+
      '<input type="time" data-day-start value="'+start+'" '+(on?"":"disabled")+'>'+
      '<input type="time" data-day-end value="'+end+'" '+(on?"":"disabled")+'>'+
    '</div>';
  }).join("");

  const buffer=$("#bookingTravelBuffer");
  const notice=$("#bookingNoticeHours");
  if(buffer) buffer.value=String(state.business?.default_travel_buffer_minutes??state.publicLinks?.travel_buffer_minutes??30);
  if(notice) notice.value=String(state.publicLinks?.minimum_notice_hours??24);
}

async function saveAvailabilitySettings(){
  if(!state.business || !["owner","admin"].includes(state.business.role)){
    throw new Error("Owner or Admin access required.");
  }

  const buffer=Number($("#bookingTravelBuffer")?.value||0);
  const notice=Number($("#bookingNoticeHours")?.value||0);
  const rows=[];

  $$(".availability-day").forEach(day=>{
    const enabled=day.querySelector("[data-day-enabled]")?.checked;
    if(!enabled) return;
    const start=day.querySelector("[data-day-start]")?.value;
    const end=day.querySelector("[data-day-end]")?.value;
    if(!start || !end || start>=end) throw new Error("Each active day needs a valid start and end time.");
    rows.push({
      business_id:state.business.id,
      weekday:Number(day.dataset.weekday),
      start_time:start,
      end_time:end,
      active:true
    });
  });

  const {error:businessError}=await supabase.from("businesses").update({
    default_travel_buffer_minutes:buffer,
    minimum_booking_notice_hours:notice,
    updated_at:new Date().toISOString()
  }).eq("id",state.business.id);
  if(businessError) throw businessError;

  const {error:deleteError}=await supabase.from("availability_rules").delete().eq("business_id",state.business.id);
  if(deleteError) throw deleteError;

  if(rows.length){
    const {error:insertError}=await supabase.from("availability_rules").insert(rows);
    if(insertError) throw insertError;
  }

  state.business.default_travel_buffer_minutes=buffer;
  if(state.publicLinks){
    state.publicLinks.travel_buffer_minutes=buffer;
    state.publicLinks.minimum_notice_hours=notice;
  }
  const {data,error}=await supabase.from("availability_rules").select("*").eq("business_id",state.business.id).order("weekday").order("start_time");
  if(error) throw error;
  state.availabilityRules=data||[];
  renderAvailabilityEditor();
  renderSettings();
}

function renderTeam(){
  const grid=$("#teamGrid");
  if(!grid) return;
  if(!state.teamMembers.length){
    grid.innerHTML=`<article class="empty-card"><strong>No team profiles yet.</strong><span>Add a worker, assign jobs, then share their private worker link.</span><button class="primary-btn" data-team-create>+ Add worker</button></article>`;
    return;
  }
  const isOwner=state.business?.role==="owner";
  const threadMap=new Map((state.teamMessageThreads||[]).map(x=>[x.team_member_id,x]));
  grid.innerHTML=state.teamMembers.map(tm=>{
    const thread=threadMap.get(tm.id)||{};
    const unread=Number(thread.unread_count||0);
    return `
    <article class="client-card">
      <div class="client-avatar">${escapeHtml(initials(tm.name))}</div>
      <strong>${escapeHtml(tm.name)}</strong>
      <span>${escapeHtml(tm.role||"cleaner")}</span>
      <small>${escapeHtml(tm.email||tm.phone||"No contact saved")}</small>
      ${thread.last_message?`<small class="team-message-preview">${escapeHtml(thread.last_message)}</small>`:""}
      ${unread?`<span class="message-unread-badge">${unread} new</span>`:""}
      <div class="card-actions">
        <button data-team-edit="${tm.id}">Edit</button>
        <button data-team-message="${tm.id}">Message${unread?" · "+unread:""}</button>
        ${isOwner?`<button data-worker-link="${tm.id}">Share worker link</button><button class="danger-link" data-worker-revoke="${tm.id}">Revoke link</button>`:""}
      </div>
    </article>`;
  }).join("")+`<article class="client-card add-card" data-team-create><div>＋</div><strong>Add worker</strong><span>Assign jobs and share limited access.</span></article>`;
}


async function loadTeamMessageThreads(){
  if(!state.business?.id || !["owner","admin"].includes(String(state.business.role||""))) return [];
  const {data,error}=await supabase.rpc("admin_team_message_threads",{p_business_id:state.business.id});
  if(error) throw error;
  state.teamMessageThreads=Array.isArray(data)?data:[];
  renderTeam();
  renderTeamMessageCenter();
  return state.teamMessageThreads;
}
async function loadTeamMessageThread(teamMemberId,{markRead=true}={}){
  if(!teamMemberId) return [];
  state.activeTeamMessageMemberId=teamMemberId;
  const {data,error}=await supabase.rpc("admin_team_messages",{p_team_member_id:teamMemberId});
  if(error) throw error;
  state.teamMessages=Array.isArray(data)?data:[];
  if(markRead){
    const {error:readError}=await supabase.rpc("admin_mark_team_messages_read",{p_team_member_id:teamMemberId});
    if(readError) console.warn("[TLE] admin message read",readError);
  }
  renderTeamMessageCenter();
  return state.teamMessages;
}
function renderTeamMessageCenter(){
  const select=$("#teamMessageWorkerSelect");
  const thread=$("#teamMessageThread");
  const form=$("#teamMessageForm");
  if(!select||!thread||!form) return;

  const current=state.activeTeamMessageMemberId || state.teamMembers?.[0]?.id || "";
  if(!state.activeTeamMessageMemberId && current) state.activeTeamMessageMemberId=current;
  select.innerHTML=(state.teamMembers||[]).length
    ? state.teamMembers.map(tm=>`<option value="${tm.id}" ${tm.id===current?"selected":""}>${escapeHtml(tm.name)}</option>`).join("")
    : '<option value="">No employees yet</option>';
  select.disabled=!(state.teamMembers||[]).length;
  $("#teamMessageInput").disabled=!(state.teamMembers||[]).length;
  form.querySelector('button[type="submit"]').disabled=!(state.teamMembers||[]).length;

  if(!current){
    state.teamMessages=[];
    renderMessageList(thread,[],"admin");
    return;
  }
  renderMessageList(thread,state.teamMessages||[],"admin");
}
async function sendAdminTeamMessage(body){
  const teamMemberId=state.activeTeamMessageMemberId;
  const clean=String(body||"").trim();
  if(!teamMemberId||!clean) return;
  const {error}=await supabase.rpc("admin_send_team_message",{p_team_member_id:teamMemberId,p_body:clean});
  if(error) throw error;
  await Promise.all([
    loadTeamMessageThread(teamMemberId,{markRead:true}),
    loadTeamMessageThreads()
  ]);
}
function installTeamMessagePolling(){
  clearInterval(window.__tleTeamMessageTimer);
  window.__tleTeamMessageTimer=setInterval(()=>{
    const active=$(".view.active")?.dataset.page;
    if(active==="team" && !appShell?.hidden){
      loadTeamMessageThreads().then(()=>{
        if(state.activeTeamMessageMemberId) return loadTeamMessageThread(state.activeTeamMessageMemberId,{markRead:false});
      }).catch(()=>{});
    }
  },12000);
}

function openTeamForm(id=null){
  state.modalType="team"; state.modalId=id;
  const record=state.teamMembers.find(x=>x.id===id);
  modalHeader("TEAM",record?"Edit team profile":"Add team profile","This profile is used for job assignment. App access is managed separately in Owner Admin.");
  entityForm.innerHTML=`
    <div class="form-grid">
      <label>Name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(record?.email||"")}"></label>
      <label>Phone<input name="phone" value="${escapeHtml(record?.phone||"")}"></label>
      <label>Role<input name="role" value="${escapeHtml(record?.role||"cleaner")}"></label>
    </div>
    ${formSubmit(record?"Save changes":"Add team profile")}`;
  modal.hidden=false;
}

async function saveTeam(fd){
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    email:String(fd.get("email")||"").trim()||null,
    phone:String(fd.get("phone")||"").trim()||null,
    role:String(fd.get("role")||"cleaner").trim()||"cleaner",
    active:true
  };
  const query=state.modalId
    ? supabase.from("team_members").update(payload).eq("id",state.modalId)
    : supabase.from("team_members").insert(payload);
  const {error}=await query;
  if(error) throw error;
}

function renderClients(){
  const grid=$("#clientsGrid");
  if(!grid) return;
  if(!state.clients.length){
    grid.innerHTML=`<article class="empty-card"><strong>No clients yet.</strong><span>Add the first real client when you're ready.</span><button class="primary-btn" data-create="client">+ Add client</button></article>`;
    return;
  }
  grid.innerHTML=state.clients.map(c=>`
    <article class="client-card">
      <div class="client-avatar">${escapeHtml(initials(c.name))}</div>
      <strong>${escapeHtml(c.name)}</strong>
      <span>${escapeHtml(c.email)}</span>
      <small>${escapeHtml([c.city,c.state].filter(Boolean).join(", ") || c.address_line1 || "No address yet")}</small>
      <div class="card-actions record-card-actions">
        <span class="safe-actions">
          <button data-edit="client" data-id="${c.id}">${escapeHtml(tr("Edit"))}</button>
          <button data-archive-client="${c.id}">${escapeHtml(tr("Archive"))}</button>
        </span>
        <button class="record-delete-btn" data-delete-record="client" data-id="${c.id}">${escapeHtml(tr("Delete client"))}</button>
      </div>
    </article>
  `).join("");
}

function renderServices(){
  const grid=$("#servicesGrid");
  if(!grid) return;
  const cards=state.services.map(s=>{
    const addons=state.serviceAddons.filter(a=>a.service_id===s.id);
    return `
      <article class="service-card ${s.active?"":"inactive-card"}">
        <strong>${escapeHtml(s.name)}</strong>
        <span>${Math.round(s.default_duration_minutes/60*10)/10} hr · ${escapeHtml(s.pricing_type)}</span>
        <b>${s.pricing_type==="quote"?"Quote":money(s.base_price)}</b>
        <div class="addon-list">
          ${addons.length?addons.map(a=>`<div class="addon-row ${a.active?"":"inactive-card"}"><span><strong>${escapeHtml(a.name)}</strong><small>+${money(a.price)} · +${a.extra_duration_minutes} min</small></span><span class="card-actions"><button data-edit-addon="${a.id}">Edit</button><button data-toggle-addon="${a.id}">${a.active?"Off":"On"}</button></span></div>`).join(""):`<small class="muted-line">No add-ons yet</small>`}
        </div>
        <div class="card-actions">
          <button data-edit="service" data-id="${s.id}">Edit service</button>
          <button data-add-addon-for="${s.id}">+ Add-on</button>
          <button data-toggle-service="${s.id}">${s.active?"Deactivate":"Activate"}</button>
        </div>
      </article>`;
  }).join("");

  const unassigned=state.serviceAddons.filter(a=>!a.service_id);
  const globalCard=unassigned.length?`<article class="service-card"><strong>General add-ons</strong><span>Available across services</span><div class="addon-list">${unassigned.map(a=>`<div class="addon-row ${a.active?"":"inactive-card"}"><span><strong>${escapeHtml(a.name)}</strong><small>+${money(a.price)} · +${a.extra_duration_minutes} min</small></span><span class="card-actions"><button data-edit-addon="${a.id}">Edit</button><button data-toggle-addon="${a.id}">${a.active?"Off":"On"}</button></span></div>`).join("")}</div></article>`:"";

  grid.innerHTML=(cards||"")+globalCard+`<article class="add-card" data-create="service"><div>＋</div><strong>Add service</strong><span>Set price, duration and booking basics.</span></article>`;
}

function renderSupplies(){
  const grid=$("#suppliesGrid");
  if(!grid) return;
  const active=state.supplies.filter(s=>s.active);
  const low=active.filter(s=>Number(s.quantity)<=Number(s.reorder_level));
  const value=active.reduce((sum,s)=>sum+(Number(s.quantity||0)*Number(s.cost_per_unit||0)),0);
  const activeEl=$("#suppliesActiveCount"), lowEl=$("#suppliesLowCount"), valueEl=$("#suppliesValue");
  if(activeEl) activeEl.textContent=active.length;
  if(lowEl) lowEl.textContent=low.length;
  if(valueEl) valueEl.textContent=money(value);

  if(!state.supplies.length){
    grid.innerHTML=`<article class="empty-card"><strong>No supplies yet.</strong><span>Add products you want to track and set a reorder level.</span><button class="primary-btn" data-action="supply">+ Add supply</button></article>`;
    return;
  }

  grid.innerHTML=state.supplies.map(s=>{
    const isLow=s.active && Number(s.quantity)<=Number(s.reorder_level);
    return `<article class="supply-card ${s.active?"":"inactive-card"}">
      <div class="supply-head"><span><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.category||"Uncategorized")}</small></span><span class="status ${isLow?"danger":"success"}">${isLow?"Low stock":"In stock"}</span></div>
      <div class="supply-qty"><strong>${Number(s.quantity)}</strong><span>${escapeHtml(s.unit)}</span></div>
      <div class="supply-meta"><span>Reorder at <b>${Number(s.reorder_level)}</b></span><span>Cost <b>${s.cost_per_unit==null?"—":money(s.cost_per_unit)}</b></span></div>
      ${s.preferred_vendor?`<small class="muted-line">Vendor: ${escapeHtml(s.preferred_vendor)}</small>`:""}
      <div class="card-actions">
        <button data-supply-adjust="${s.id}" data-mode="usage">- Used</button>
        <button data-supply-adjust="${s.id}" data-mode="restock">+ Restock</button>
        <button data-edit-supply="${s.id}">Edit</button>
        <button data-toggle-supply="${s.id}">${s.active?"Archive":"Restore"}</button>
      </div>
    </article>`;
  }).join("");
}

function renderJobs(){
  const list=$("#jobsList");
  const visible=state.jobs.filter(j=>j.status!=="canceled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));

  if(list){
    list.innerHTML=visible.length?visible.slice(0,20).map(j=>`
      <div class="job-block">
        <time>${escapeHtml(formatDateTime(j.starts_at))}</time>
        <div>
          <strong>${escapeHtml(j.clients?.name || "Unassigned client")}</strong>
          <span>${escapeHtml(j.services?.name || "Cleaning job")} · ${Math.round(j.duration_minutes/60*10)/10}h${j.job_assignments?.[0]?.team_members?.name?" · "+escapeHtml(j.job_assignments[0].team_members.name):""}</span>
        </div>
        <div class="record-actions">
          <span class="status ${j.status==="completed"?"success":j.status==="in_progress"?"warning":"neutral"}">${escapeHtml(translatedStatus(j.status))}</span>
          ${state.business.role==="coworker"
            ? `<button data-coworker-status="${j.id}" data-status="on_the_way">On my way</button><button data-coworker-status="${j.id}" data-status="in_progress">Start</button><button data-coworker-status="${j.id}" data-status="completed">Complete</button>`
            : `<button data-edit="job" data-id="${j.id}">Edit</button><button class="danger-link" data-cancel-job="${j.id}">Cancel</button>`}
        </div>
      </div>
    `).join(""):`<div class="empty-inline"><strong>No jobs scheduled.</strong><button class="text-btn" data-create="job">Add the first job →</button></div>`;
  }

  const week=$("#calendarWeekRow");
  if(week){
    const now=new Date();
    const start=startOfWeek(now);
    const end=new Date(start);
    end.setDate(start.getDate()+13);

    const range=$("#calendarRangeLabel");
    if(range){
      const sameMonth=start.getMonth()===end.getMonth();
      range.textContent=sameMonth
        ? new Intl.DateTimeFormat(appLocale(),{month:"long"}).format(start)+" "+start.getDate()+"–"+end.getDate()
        : new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(start)+" – "+new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(end);
    }

    week.innerHTML=Array.from({length:14},(_,i)=>{
      const d=new Date(start);
      d.setDate(start.getDate()+i);
      const dayJobs=visible.filter(j=>sameLocalDay(j.starts_at,d));
      const selected=sameLocalDay(d,now)?"selected":"";
      const hasJobs=dayJobs.length?" has-jobs":"";
      const count=dayJobs.length
        ? `<small class="calendar-job-count">${dayJobs.length} ${dayJobs.length===1?"job":"jobs"}</small>`
        : `<small class="calendar-job-count empty">—</small>`;

      return `<span class="${selected}${hasJobs}" title="${dayJobs.length?dayJobs.length+" scheduled job"+(dayJobs.length===1?"":"s"):"No jobs"}">
        <em>${new Intl.DateTimeFormat(appLocale(),{weekday:"short"}).format(d).toUpperCase()}</em>
        <strong>${d.getDate()}</strong>
        ${count}
      </span>`;
    }).join("");
  }

  const recurring=$("#recurringJobsList");
  if(recurring){
    const upcoming=visible.filter(j=>j.recurrence_rule_id&&new Date(j.starts_at)>=new Date()).slice(0,8);
    recurring.innerHTML=upcoming.length?upcoming.map(j=>`
      <div class="recurring-item"><strong>${escapeHtml(j.clients?.name||"Recurring job")}</strong><span>${escapeHtml(j.services?.name||"Cleaning")} · ${formatDateTime(j.starts_at)}</span></div>
    `).join(""):`<div class="empty-inline"><strong>No recurring jobs yet.</strong><span>Recurring appointments will appear here.</span></div>`;
  }
}
function quoteColumn(status,label){
  const items=state.quotes.filter(q=>q.status===status);
  return `<div class="kanban-col"><h3>${label} <span>${items.length}</span></h3>
    ${items.length?items.map(q=>{
      const service=state.services.find(s=>s.id===q.quote_items?.[0]?.service_id);
      const total=Number(q.total||0);
      const dispute=state.disputes.find(d=>d.resource_type==="quote"&&d.quote_id===q.id&&d.status==="open");
      const paymentCopy=q.payment_status==="paid"?" · PAID":q.payment_status==="partial"?" · PARTIAL PAYMENT":"";
      const stateCopy=status==="accepted"
        ? "Client + job + invoice created"+paymentCopy
        : status==="sent"
          ? "Waiting for customer"
          : status==="declined"
            ? "Declined by customer"
            : escapeHtml(status);
      return `<article class="${status==="accepted"?"accepted":""}">
        <strong>${escapeHtml(q.customer_name)}</strong>
        <small>${escapeHtml(service?.name || "Cleaning service")} · ${money(total)}</small>
        <b>${stateCopy}</b>
        ${dispute?`<small class="dispute-alert">OPEN DISPUTE · ${escapeHtml(dispute.reason)}</small>`:""}
        <div class="card-actions record-card-actions">
          <span class="safe-actions">
            ${dispute?`<button data-resolve-dispute="${dispute.id}">${escapeHtml(tr("Resolve dispute"))}</button>`:""}
            ${!["accepted"].includes(status)?`<button data-edit="quote" data-id="${q.id}">${escapeHtml(tr("Edit"))}</button>`:""}
            ${["requested","draft","declined"].includes(status)?`<button class="accept-btn" data-send-customer-quote="${q.id}">${escapeHtml(tr("Send quote"))}</button>`:""}
            ${status==="sent"?`<button data-send-customer-quote="${q.id}">${escapeHtml(tr("Resend quote"))}</button>`:""}
          </span>
          <button class="record-delete-btn" data-delete-record="quote" data-id="${q.id}">${escapeHtml(tr("Delete quote"))}</button>
        </div>
      </article>`;
    }).join(""):`<div class="kanban-empty">Nothing here</div>`}
  </div>`;
}
function renderQuotes(){
  const board=$("#quotesBoard");
  if(!board) return;
  board.innerHTML=[
    quoteColumn("requested","Requested"),
    quoteColumn("draft","Draft"),
    quoteColumn("sent","Sent"),
    quoteColumn("accepted","Accepted"),
    quoteColumn("declined","Declined")
  ].join("");
}

function dateKeyInZone(value,timeZone){
  const d=value instanceof Date?value:new Date(value);
  if(!Number.isFinite(d.getTime())) return "";
  try{
    const parts=new Intl.DateTimeFormat("en-CA",{
      timeZone:timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone,
      year:"numeric",month:"2-digit",day:"2-digit"
    }).formatToParts(d);
    const map=Object.fromEntries(parts.map(p=>[p.type,p.value]));
    return [map.year,map.month,map.day].join("-");
  }catch{
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
  }
}
function activeBusinessTimeZone(){
  return state.weather?.location?.timezone
    || state.business?.timezone
    || Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function sameLocalDay(value,date=new Date()){
  if(!value) return false;
  const zone=activeBusinessTimeZone();
  return dateKeyInZone(value,zone)===dateKeyInZone(date,zone);
}
function startOfWeek(date=new Date()){
  const d=new Date(date); const day=d.getDay();
  d.setHours(0,0,0,0); d.setDate(d.getDate()-day);
  return d;
}
function startOfMonth(date=new Date()){
  return new Date(date.getFullYear(),date.getMonth(),1);
}
function confirmedPaid(inv){
  return (inv.payments||[]).filter(p=>p.status==="confirmed").reduce((sum,p)=>sum+Number(p.amount||0),0);
}


function dashboardDaypart(hour){
  const h=Number(hour);
  if(h>=5&&h<9) return "early";
  if(h>=9&&h<12) return "morning";
  if(h>=12&&h<14) return "midday";
  if(h>=14&&h<17) return "afternoon";
  if(h>=17&&h<19) return "wrap";
  if(h>=19&&h<23) return "evening";
  return "late";
}
function dashboardGreeting(daypart){
  const map={
    early:langPick("Good morning","Buenos días","Bom dia","Bonjour"),
    morning:langPick("Morning check-in","Así va tu mañana","Resumo da manhã","Point du matin"),
    midday:langPick("Midday check-in","Chequeo del mediodía","Resumo do meio-dia","Point de midi"),
    afternoon:langPick("Good afternoon","Buenas tardes","Boa tarde","Bon après-midi"),
    wrap:langPick("End-of-day check","Vamos cerrando el día","Fechando o dia","Fin de journée"),
    evening:langPick("Good evening","Buenas noches","Boa noite","Bonsoir"),
    late:langPick("Tomorrow can wait","Mañana puede esperar","Amanhã pode esperar","Demain peut attendre")
  };
  return map[daypart]||map.morning;
}
function weatherPlaceLabel(){
  const location=state.weather&&state.weather.location||{};
  const place=String(location.name||state.weatherArea||state.business?.service_area||"").trim();
  const region=String(location.admin1||"").trim();
  return place&&region&&!place.toLowerCase().includes(region.toLowerCase())?place+", "+region:place;
}
function shortJobArea(address=""){
  const parts=String(address||"").split(",").map(v=>v.trim()).filter(Boolean);
  if(parts.length>=2) return parts[1];
  return parts[0]||"";
}
function dashboardWeatherContext(now,remainingJobs){
  const weather=state.weather;
  if(!weather||!weather.current) return {text:"",kind:"none",icon:""};
  const place=weatherPlaceLabel();
  const code=Number(weather.current.weather_code);
  const temp=Math.round(Number(weather.current.temperature_2m));
  const rain=weather.nextRain||null;
  const currentRain=[51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code)||Number(weather.current.precipitation||0)>0;
  const storm=[95,96,99].includes(code);
  if(currentRain){
    const base=storm
      ? langPick("Storms are affecting","Hay tormentas","Há tempestades em","Des orages touchent")
      : langPick("Rain is affecting","Está lloviendo en","Está chovendo em","Il pleut à");
    const area=place?" "+place:langPick(" your service area"," tu zona de servicio"," sua área de atendimento"," votre zone de service");
    const advice=remainingJobs.length
      ? langPick(
          " Check the route before the next stop and keep entry supplies dry.",
          " Revisa la ruta antes de la próxima parada y protege los materiales al entrar.",
          " Confira a rota antes da próxima parada e mantenha os materiais secos.",
          " Vérifiez l’itinéraire avant le prochain arrêt et gardez le matériel au sec."
        )
      : langPick(
          " No active route right now, but check conditions before heading out.",
          " No hay una ruta activa ahora, pero revisa el clima antes de salir.",
          " Não há rota ativa agora, mas confira as condições antes de sair.",
          " Aucun itinéraire actif pour le moment, mais vérifiez les conditions avant de partir."
        );
    return {kind:"rain",icon:storm?"⛈️":"🌧️",text:base+area+"."+advice};
  }
  if(rain&&rain.hoursAhead<=8){
    const location=place?langPick(" in "," en "," em "," à ")+place:"";
    const when=weatherClockLabel(rain.hour);
    const first=langPick(
      "Rain is likely"+location+" around "+when+" ("+rain.probability+"%).",
      "Lluvia probable"+location+" cerca de las "+when+" ("+rain.probability+"%).",
      "Chuva provável"+location+" por volta de "+when+" ("+rain.probability+"%).",
      "Pluie probable"+location+" vers "+when+" ("+rain.probability+"%)."
    );
    const advice=remainingJobs.length
      ? langPick(" Leave a little extra time between stops."," Deja un poco más de tiempo entre paradas."," Deixe um pouco mais de tempo entre as paradas."," Prévoyez un peu plus de temps entre les arrêts.")
      : langPick(" Keep it in mind if you add a job today."," Tenlo en cuenta si agregas un trabajo hoy."," Leve isso em conta se adicionar um trabalho hoje."," Gardez cela en tête si vous ajoutez un travail aujourd’hui.");
    return {kind:"rain",icon:"🌧️",text:first+advice};
  }
  const hotThreshold=businessTemperatureUnit()==="celsius"?31:88;
  if(Number.isFinite(temp)&&temp>=hotThreshold){
    return {
      kind:"heat",
      icon:"☀️",
      text:langPick(
        "It’s "+temp+temperatureSuffix()+(place?" in "+place:"")+". If you’re still on the road, leave a few minutes for water between stops.",
        "Hace "+temp+temperatureSuffix()+(place?" en "+place:"")+". Si sigues en ruta, deja unos minutos para agua entre paradas.",
        "Está fazendo "+temp+temperatureSuffix()+(place?" em "+place:"")+". Se ainda estiver na rua, reserve alguns minutos para água entre as paradas.",
        "Il fait "+temp+temperatureSuffix()+(place?" à "+place:"")+". Si vous êtes encore en route, prévoyez quelques minutes pour boire entre les arrêts."
      )
    };
  }
  return {kind:"steady",icon:"🌤️",text:""};
}
function renderTodaySummary(wakeAssistant=false){
  const now=new Date();
  const businessTimeZone=activeBusinessTimeZone();
  const businessHour=Number(new Intl.DateTimeFormat("en-US",{
    hour:"2-digit",
    hour12:false,
    timeZone:businessTimeZone
  }).format(now));
  const todayJobs=state.jobs.filter(j=>sameLocalDay(j.starts_at,now)&&j.status!=="canceled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const openQuotes=state.quotes.filter(q=>["requested","draft","sent"].includes(q.status));
  const outstanding=state.invoices.filter(i=>i.status!=="void").reduce((sum,i)=>sum+Math.max(0,Number(i.total||0)-confirmedPaid(i)),0);
  const pendingBookings=visibleBookingRequests().filter(b=>b.status==="requested");
  const overdueInvoices=state.invoices.filter(i=>i.due_at&&new Date(i.due_at)<now&&!["paid","void"].includes(i.status));

  const cards=$$(".metric-card", $('[data-page="today"]'));
  if(cards[0]){
    cards[0].querySelector("strong").textContent=todayJobs.length;
    const completed=todayJobs.filter(j=>j.status==="completed").length;
    cards[0].querySelector("small").textContent=todayJobs.length
      ? langPick(
          completed+" completed",
          completed+" completado"+(completed===1?"":"s"),
          completed+" concluído"+(completed===1?"":"s"),
          completed+" terminé"+(completed===1?"":"s")
        )
      : tr("Nothing scheduled");
  }
  if(cards[1]){ cards[1].querySelector("strong").textContent=state.clients.length; }
  if(cards[2]){ cards[2].querySelector("strong").textContent=openQuotes.length; }
  const out=$("#todayOutstanding"); if(out) out.textContent=money(outstanding);
  const br=$("#todayBookingRequests"); if(br) br.textContent=pendingBookings.length;

  const datePill=$("#todayDatePill");
  if(datePill){
    const formatted=new Intl.DateTimeFormat(appLocale(),{weekday:"long",month:"short",day:"numeric"}).format(now);
    datePill.textContent=formatted.charAt(0).toUpperCase()+formatted.slice(1);
  }
  const greet=$("#todayGreeting");
  const hero=$("#todayHeroCard");
  if(hero){
    try{renderHeroWeatherEffects();}catch{}
    hero.classList.remove("is-loading");
    if(wakeAssistant){
      hero.classList.remove("assistant-arrival");
      void hero.offsetWidth;
      hero.classList.add("assistant-arrival");
    }
  }
  const momentIcon=$("#todayMomentIcon");
  const momentCopy=$("#todayMomentCopy");
  const heroAction=$("#todayHeroAction");
  if(greet){
    const hour=Number.isFinite(businessHour)?businessHour:now.getHours();
    const daypart=dashboardDaypart(hour);
    const remainingJobs=todayJobs.filter(function(j){
      return j.status!=="completed" && new Date(j.starts_at).getTime()>=now.getTime()-60*60*1000;
    });
    const nextJob=remainingJobs[0]||null;
    const nextJobTime=nextJob
      ? new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit",timeZone:businessTimeZone}).format(new Date(nextJob.starts_at))
      : "";
    const nextJobArea=nextJob?shortJobArea(nextJob.service_address||""):"";
    const tomorrow=new Date(now.getTime()+24*60*60*1000);
    const tomorrowJobs=state.jobs.filter(function(j){
      return sameLocalDay(j.starts_at,tomorrow)&&j.status!=="canceled";
    });
    const rain=state.weather&&state.weather.nextRain||null;
    const rainTomorrow=rain&&rain.hoursAhead>8&&rain.hoursAhead<=32;
    const weatherContext=dashboardWeatherContext(now,remainingJobs);

    hero?.classList.remove("moment-morning","moment-afternoon","moment-night","moment-early","moment-midday","moment-wrap","moment-evening","moment-late");
    hero?.classList.add("moment-"+daypart);

    greet.textContent=dashboardGreeting(daypart);

    let copy="";
    let actionView="calendar";
    let actionText="";
    let messageState=weatherContext.kind==="rain"?"rain":"calm";
    let icon=weatherContext.icon || (["evening","late"].includes(daypart)?"🌙":daypart==="wrap"?"✨":"☀️");

    const nextJobLine=nextJob
      ? langPick(
          "Next stop at "+nextJobTime+(nextJobArea?" in "+nextJobArea:"")+".",
          "Próxima parada a las "+nextJobTime+(nextJobArea?" en "+nextJobArea:"")+".",
          "Próxima parada às "+nextJobTime+(nextJobArea?" em "+nextJobArea:"")+".",
          "Prochain arrêt à "+nextJobTime+(nextJobArea?" à "+nextJobArea:"")+"."
        )
      : "";

    if(weatherContext.kind==="rain"){
      copy=weatherContext.text+(nextJobLine?" "+nextJobLine:"");
      actionView=remainingJobs.length?"route":pendingBookings.length?"booking":"calendar";
      messageState="rain";
    }else if(nextJob){
      messageState="jobs";
      icon="📍";
      if(daypart==="early"){
        copy=langPick(
          "You have "+todayJobs.length+" job"+(todayJobs.length===1?"":"s")+" today. "+nextJobLine+" Check the address before you leave.",
          "Tienes "+todayJobs.length+" trabajo"+(todayJobs.length===1?"":"s")+" hoy. "+nextJobLine+" Revisa la dirección antes de salir.",
          "Você tem "+todayJobs.length+" trabalho"+(todayJobs.length===1?"":"s")+" hoje. "+nextJobLine+" Confira o endereço antes de sair.",
          "Vous avez "+todayJobs.length+" travail"+(todayJobs.length===1?"":"aux")+" aujourd’hui. "+nextJobLine+" Vérifiez l’adresse avant de partir."
        );
      }else if(daypart==="morning"){
        copy=langPick(
          nextJobLine+" You have "+remainingJobs.length+" job"+(remainingJobs.length===1?"":"s")+" still on today’s schedule.",
          nextJobLine+" Te quedan "+remainingJobs.length+" trabajo"+(remainingJobs.length===1?"":"s")+" en la agenda de hoy.",
          nextJobLine+" Você ainda tem "+remainingJobs.length+" trabalho"+(remainingJobs.length===1?"":"s")+" na agenda de hoje.",
          nextJobLine+" Il vous reste "+remainingJobs.length+" travail"+(remainingJobs.length===1?"":"aux")+" au programme aujourd’hui."
        );
      }else if(daypart==="midday"){
        const later=Math.max(0,remainingJobs.length-1);
        copy=langPick(
          nextJobLine+" After that, "+later+" stop"+(later===1?" remains":"s remain")+". "+(weatherContext.text||""),
          nextJobLine+" Después quedan "+later+" parada"+(later===1?"":"s")+". "+(weatherContext.text||""),
          nextJobLine+" Depois disso, restam "+later+" parada"+(later===1?"":"s")+". "+(weatherContext.text||""),
          nextJobLine+" Ensuite, il reste "+later+" arrêt"+(later===1?"":"s")+". "+(weatherContext.text||"")
        );
      }else if(daypart==="afternoon"||daypart==="wrap"){
        copy=langPick(
          "You have "+remainingJobs.length+" job"+(remainingJobs.length===1?"":"s")+" left. "+nextJobLine+" "+(weatherContext.text||""),
          "Te quedan "+remainingJobs.length+" trabajo"+(remainingJobs.length===1?"":"s")+". "+nextJobLine+" "+(weatherContext.text||""),
          "Você ainda tem "+remainingJobs.length+" trabalho"+(remainingJobs.length===1?"":"s")+". "+nextJobLine+" "+(weatherContext.text||""),
          "Il vous reste "+remainingJobs.length+" travail"+(remainingJobs.length===1?"":"aux")+". "+nextJobLine+" "+(weatherContext.text||"")
        );
      }else{
        copy=langPick(
          nextJobLine+" It still shows as pending; check the status before closing the day.",
          nextJobLine+" Todavía aparece pendiente; revisa el estado antes de cerrar el día.",
          nextJobLine+" Ele ainda aparece como pendente; confira o status antes de encerrar o dia.",
          nextJobLine+" Il apparaît encore en attente ; vérifiez le statut avant de terminer la journée."
        );
      }
      actionView="route";
    }else if(pendingBookings.length){
      messageState="booking";
      icon="📥";
      copy=langPick(
        "You have "+pendingBookings.length+" booking request"+(pendingBookings.length===1?"":"s")+" waiting for review"+(openQuotes.length?" and "+openQuotes.length+" open quote"+(openQuotes.length===1?"":"s")+".":"."),
        "Tienes "+pendingBookings.length+" solicitud"+(pendingBookings.length===1?"":"es")+" de reserva esperando revisión"+(openQuotes.length?" y "+openQuotes.length+" cotización"+(openQuotes.length===1?" abierta":"es abiertas")+".":"."),
        "Você tem "+pendingBookings.length+" solicitação"+(pendingBookings.length===1?"":"ões")+" de reserva aguardando revisão"+(openQuotes.length?" e "+openQuotes.length+" orçamento"+(openQuotes.length===1?" aberto":"s abertos")+".":"."),
        "Vous avez "+pendingBookings.length+" demande"+(pendingBookings.length===1?"":"s")+" de réservation à examiner"+(openQuotes.length?" et "+openQuotes.length+" devis ouvert"+(openQuotes.length===1?"":"s")+".":".")
      );
      if(weatherContext.text) copy+=" "+weatherContext.text;
      actionView="booking";
    }else if(openQuotes.length){
      messageState="quotes";
      icon="📝";
      copy=langPick(
        "You have "+openQuotes.length+" open quote"+(openQuotes.length===1?"":"s")+". Check which one needs the next step.",
        "Tienes "+openQuotes.length+" cotización"+(openQuotes.length===1?" abierta":"es abiertas")+". Revisa cuál necesita el próximo paso.",
        "Você tem "+openQuotes.length+" orçamento"+(openQuotes.length===1?" aberto":"s abertos")+". Veja qual precisa do próximo passo.",
        "Vous avez "+openQuotes.length+" devis ouvert"+(openQuotes.length===1?"":"s")+". Vérifiez lequel nécessite la prochaine action."
      )+(weatherContext.text?" "+weatherContext.text:"");
      actionView="quotes";
    }else if(overdueInvoices.length){
      messageState="invoice";
      icon="💳";
      copy=langPick(
        "You have "+overdueInvoices.length+" overdue invoice"+(overdueInvoices.length===1?"":"s")+" that need"+(overdueInvoices.length===1?"s":"")+" attention. Review payment status before you close the day.",
        "Tienes "+overdueInvoices.length+" factura"+(overdueInvoices.length===1?" vencida":"s vencidas")+" que necesita"+(overdueInvoices.length===1?"":"n")+" atención. Revisa el pago antes de cerrar el día.",
        "Você tem "+overdueInvoices.length+" fatura"+(overdueInvoices.length===1?" vencida":"s vencidas")+" que precisa"+(overdueInvoices.length===1?"":"m")+" de atenção. Revise o pagamento antes de encerrar o dia.",
        "Vous avez "+overdueInvoices.length+" facture"+(overdueInvoices.length===1?" impayée":"s impayées")+" à vérifier. Contrôlez le paiement avant de terminer la journée."
      );
      actionView="invoices";
    }else if(["evening","late"].includes(daypart)){
      messageState="night";
      icon="🌙";
      if(rainTomorrow){
        const place=weatherPlaceLabel();
        copy=langPick(
          "You have "+tomorrowJobs.length+" job"+(tomorrowJobs.length===1?"":"s")+" tomorrow. Rain may move into "+(place||"your service area")+"; check the first route before you switch off.",
          "Mañana tienes "+tomorrowJobs.length+" trabajo"+(tomorrowJobs.length===1?"":"s")+". Puede llover"+(place?" en "+place:"")+"; revisa la primera ruta antes de desconectar.",
          "Amanhã você tem "+tomorrowJobs.length+" trabalho"+(tomorrowJobs.length===1?"":"s")+". Pode chover"+(place?" em "+place:"")+"; confira a primeira rota antes de encerrar.",
          "Vous avez "+tomorrowJobs.length+" travail"+(tomorrowJobs.length===1?"":"aux")+" demain. De la pluie est possible"+(place?" à "+place:"")+" ; vérifiez le premier itinéraire avant de terminer."
        );
      }else if(tomorrowJobs.length){
        copy=langPick(
          "You have "+tomorrowJobs.length+" job"+(tomorrowJobs.length===1?"":"s")+" tomorrow. Check the first address, then call it a day.",
          "Mañana tienes "+tomorrowJobs.length+" trabajo"+(tomorrowJobs.length===1?"":"s")+". Deja lista la primera dirección y después descansa.",
          "Amanhã você tem "+tomorrowJobs.length+" trabalho"+(tomorrowJobs.length===1?"":"s")+". Confira o primeiro endereço e depois encerre o dia.",
          "Vous avez "+tomorrowJobs.length+" travail"+(tomorrowJobs.length===1?"":"aux")+" demain. Vérifiez la première adresse, puis terminez la journée."
        );
      }else{
        copy=langPick(
          "Nothing urgent is waiting. Tomorrow is ready for a clean start.",
          "No hay nada urgente pendiente. Mañana está listo para empezar limpio.",
          "Não há nada urgente pendente. Amanhã está pronto para começar bem.",
          "Rien d’urgent n’est en attente. Demain est prêt pour un nouveau départ."
        );
      }
      actionView="calendar";
    }else{
      messageState=weatherContext.kind==="heat"?"hydrate":"calm";
      icon=weatherContext.icon||"✓";
      if(daypart==="midday"){
        copy=langPick(
          "Midday is clear. No urgent jobs or new requests are waiting.",
          "El mediodía está tranquilo. No hay trabajos urgentes ni solicitudes nuevas.",
          "O meio-dia está tranquilo. Não há trabalhos urgentes nem novas solicitações.",
          "Le milieu de journée est calme. Aucun travail urgent ni nouvelle demande en attente."
        )+(weatherContext.text?" "+weatherContext.text:"");
      }else if(daypart==="wrap"){
        copy=langPick(
          "The route is clear and nothing urgent is waiting. Check tomorrow, then wrap up the day.",
          "La ruta está cerrada y no hay nada urgente. Revisa mañana y termina el día con calma.",
          "A rota está livre e não há nada urgente. Confira amanhã e encerre o dia.",
          "L’itinéraire est terminé et rien n’est urgent. Vérifiez demain, puis terminez la journée."
        )+(weatherContext.text?" "+weatherContext.text:"");
      }else{
        copy=langPick(
          "Everything is up to date. Good time to check the calendar and what’s next.",
          "Todo está al día. Buen momento para revisar el calendario y lo próximo.",
          "Tudo está em dia. Bom momento para conferir o calendário e o que vem a seguir.",
          "Tout est à jour. C’est un bon moment pour consulter le calendrier et la suite."
        )+(weatherContext.text?" "+weatherContext.text:"");
      }
      actionView="calendar";
    }

    if(momentIcon) momentIcon.textContent=icon;
    actionText=actionView==="route"
      ? langPick("Open route →","Abrir ruta →","Abrir rota →","Ouvrir l’itinéraire →")
      : actionView==="booking"
      ? langPick("Review requests →","Revisar solicitudes →","Revisar solicitações →","Examiner les demandes →")
      : actionView==="quotes"
      ? langPick("Review quotes →","Revisar cotizaciones →","Revisar orçamentos →","Examiner les devis →")
      : actionView==="invoices"
      ? langPick("Review invoices →","Revisar facturas →","Revisar faturas →","Examiner les factures →")
      : langPick("View calendar →","Ver calendario →","Ver calendário →","Voir le calendrier →");

    if(hero){
      hero.classList.remove("message-rain","message-booking","message-jobs","message-hydrate","message-calm","message-night","message-morning","message-afternoon","message-quotes","message-invoice");
      hero.classList.add("message-"+messageState);
      hero.dataset.daypart=daypart;
      hero.dataset.activity=messageState;
    }
    if(appShell) appShell.dataset.cardMood=messageState;
    if(momentCopy) momentCopy.textContent=copy.replace(/\s+/g," ").trim();
    if(heroAction){
      heroAction.disabled=false;
      heroAction.textContent=actionText;
      heroAction.dataset.jump=actionView;
    }
  }

  const timeline=$("#todayTimeline");
  if(timeline){
    timeline.innerHTML=todayJobs.length?todayJobs.map(j=>`
      <div class="timeline-item ${j.status==="completed"?"done":""}">
        <time>${new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit"}).format(new Date(j.starts_at))}</time>
        <div><strong>${escapeHtml(j.clients?.name||tr("Cleaning job"))}</strong><span>${escapeHtml(j.services?.name||tr("Service"))} · ${Math.round(j.duration_minutes/60*10)/10}h</span></div>
        <span class="status ${j.status==="completed"?"success":j.status==="in_progress"?"warning":"neutral"}">${escapeHtml(translatedStatus(j.status))}</span>
      </div>`).join(""):`<div class="empty-inline"><strong>${escapeHtml(tr("No jobs today."))}</strong><span>${escapeHtml(tr("Your scheduled jobs will appear here."))}</span></div>`;
  }

  const attention=$("#attentionList");
  if(attention){
    const items=[];
    state.invoices.filter(i=>i.due_at&&new Date(i.due_at)<now&&!["paid","void"].includes(i.status)).slice(0,2).forEach(i=>{
      items.push(`<button data-jump="invoices"><span class="dot red"></span><strong>${escapeHtml(tr("Invoice"))} #${i.invoice_number||String(i.id).slice(0,6)}</strong><small>${money(Math.max(0,Number(i.total)-confirmedPaid(i)))} ${escapeHtml(tr("outstanding"))}</small></button>`);
    });
    openQuotes.filter(q=>q.status==="sent").slice(0,2).forEach(q=>{
      items.push(`<button data-jump="quotes"><span class="dot yellow"></span><strong>${escapeHtml(langPick("Quote for","Cotización para","Orçamento para","Devis pour"))} ${escapeHtml(q.customer_name)}</strong><small>${escapeHtml(tr("Waiting for response"))}</small></button>`);
    });
    if(pendingBookings.length) items.push(`<button data-jump="booking"><span class="dot blue"></span><strong>${pendingBookings.length} ${langPick(pendingBookings.length===1?"booking request":"booking requests",pendingBookings.length===1?"solicitud":"solicitudes",pendingBookings.length===1?"solicitação":"solicitações",pendingBookings.length===1?"demande de réservation":"demandes de réservation")}</strong><small>${escapeHtml(tr("Waiting for review"))}</small></button>`);
    attention.innerHTML=items.length?items.join(""):`<div class="empty-inline"><strong>${escapeHtml(tr("Nothing urgent."))}</strong><span>${escapeHtml(tr("No overdue invoices, sent quotes, or new booking requests need attention."))}</span></div>`;
  }

  const weekStart=startOfWeek(now);
  const weekEntries=state.timeEntries.filter(t=>new Date(t.clocked_in_at)>=weekStart);
  const weekMinutes=weekEntries.reduce((sum,t)=>sum+Number(t.minutes_worked||0),0);
  const weekMiles=state.mileageLogs.filter(m=>new Date(m.log_date+"T00:00:00")>=weekStart).reduce((sum,m)=>sum+Number(m.miles||0),0);
  const weekCompleted=state.jobs.filter(j=>j.status==="completed"&&new Date(j.starts_at)>=weekStart).length;
  const wh=$("#weekHours");
  if(wh){
    const hours=(weekMinutes/60).toFixed(1).replace(".0","");
    wh.textContent=langPick(hours+" work hours",hours+" h trabajadas",hours+" h trabalhadas",hours+" h travaillées");
  }
  const ws=$("#weekSummary");
  if(ws){
    ws.textContent=langPick(
      distanceText(weekMiles)+" logged · "+weekCompleted+" completed job"+(weekCompleted===1?"":"s")+".",
      distanceText(weekMiles)+" · "+weekCompleted+" trabajo"+(weekCompleted===1?"":"s")+" completado"+(weekCompleted===1?"":"s"),
      distanceText(weekMiles)+" registrados · "+weekCompleted+" trabalho"+(weekCompleted===1?"":"s")+" concluído"+(weekCompleted===1?"":"s"),
      distanceText(weekMiles)+" enregistrés · "+weekCompleted+" travail"+(weekCompleted===1?" terminé":"aux terminés")
    );
  }
}

function renderOperations(){
  const now=new Date();
  const todayJobs=state.jobs.filter(j=>sameLocalDay(j.starts_at,now)&&j.status!=="canceled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const todayMiles=state.mileageLogs.filter(m=>sameLocalDay(m.log_date+"T12:00:00",now)).reduce((s,m)=>s+Number(m.miles||0),0);
  const weekStart=startOfWeek(now);
  const monthStart=startOfMonth(now);
  const weekMiles=state.mileageLogs.filter(m=>new Date(m.log_date+"T12:00:00")>=weekStart).reduce((s,m)=>s+Number(m.miles||0),0);
  const monthMiles=state.mileageLogs.filter(m=>new Date(m.log_date+"T12:00:00")>=monthStart).reduce((s,m)=>s+Number(m.miles||0),0);

  const routePill=$("#routeMileagePill"); if(routePill) routePill.textContent=distanceText(todayMiles)+langPick(" today"," hoy"," hoje"," aujourd’hui");
  const routeStops=$("#routeStops");
  const routeVisual=$("#routeVisual");
  if(routeStops){
    routeStops.innerHTML=todayJobs.length?todayJobs.map((j,i)=>`
      <div class="route-stop"><b>${i+1}</b><div><strong>${escapeHtml(j.clients?.name||tr("Cleaning job"))}</strong><span>${new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit"}).format(new Date(j.starts_at))} · ${Math.round(j.duration_minutes/60*10)/10}h</span><small>${escapeHtml(j.service_address||tr("Address not added"))}</small></div><em>${escapeHtml(translatedStatus(j.status))}</em></div>
      ${i<todayJobs.length-1?`<div class="route-drive">${escapeHtml(tr("Next stop"))}</div>`:""}
    `).join(""):`<div class="empty-inline"><strong>No route today.</strong><span>Schedule jobs to build today’s stop list.</span></div>`;
  }
  if(routeVisual) routeVisual.textContent=todayJobs.length?`${todayJobs.length} stop${todayJobs.length===1?"":"s"} scheduled today`:"Your route appears here when jobs are scheduled.";

  const mt=$("#mileageToday"),mw=$("#mileageWeek"),mm=$("#mileageMonth");
  if(mt) mt.textContent=distanceText(todayMiles);
  if(mw) mw.textContent=distanceText(weekMiles);
  if(mm) mm.textContent=distanceText(monthMiles);
  const mileageTable=$("#mileageTable");
  if(mileageTable){
    mileageTable.innerHTML=state.mileageLogs.length?state.mileageLogs.map(m=>`
      <div class="table-row mobile-record-card">
        <span class="record-primary"><strong>${new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(m.log_date+"T12:00:00"))}</strong><small>${escapeHtml(m.from_location&&m.to_location?m.from_location+" → "+m.to_location:m.notes||tr("Business drive"))}</small>${m.notes&&m.from_location&&m.to_location?'<em class="record-note">'+escapeHtml(m.notes)+'</em>':""}</span>
        <span class="record-field" data-label="${escapeHtml(businessDistanceUnit()==="km"?"Kilometers":"Miles")}">${distanceFromStoredMiles(m.miles).toFixed(1)}</span>
        <span class="record-field" data-label="${escapeHtml(tr("Job"))}">${escapeHtml(m.jobs?.clients?.name||m.jobs?.services?.name||"—")}</span>
        <span class="record-field" data-label="${escapeHtml(tr("Type"))}">${escapeHtml(
          m.trip_type==="commercial" ? tr("Commercial") :
          m.trip_type==="extra" ? (m.extra_job_type ? tr("Extra job")+" · "+tr(m.extra_job_type) : tr("Extra job")) :
          tr("Residential")
        )}</span>
      </div>`).join(""):`<div class="empty-table"><strong>No mileage logged yet.</strong><span>Use “Log drive” after a business trip.</span></div>`;
  }

  const active=state.timeEntries.find(t=>!t.clocked_out_at);
  const timerWrap=$("#activeTimerWrap");
  if(timerWrap){
    timerWrap.innerHTML=active?`<article class="timer-card"><span>${escapeHtml(tr("Current job"))}</span><h3>${escapeHtml(active.jobs?.clients?.name||active.jobs?.services?.name||tr("Job"))}</h3><strong>${escapeHtml(tr("Running"))}</strong><div><button class="ghost-btn" data-finish-time="${active.id}">${escapeHtml(tr("Finish timer"))}</button></div></article>`:`<div class="empty-inline timer-empty"><strong>${escapeHtml(tr("No timer running."))}</strong><span>${escapeHtml(tr("Start time from an assigned job when work begins."))}</span></div>`;
  }
  const timeTable=$("#timeEntriesTable");
  if(timeTable){
    const visibleTimeEntries=state.timeEntries.filter(t=>!t.hidden_from_time_tracking);
    timeTable.innerHTML=visibleTimeEntries.length?visibleTimeEntries.map(t=>`
      <div class="table-row mobile-record-card">
        <span class="record-primary"><strong>${escapeHtml(t.jobs?.clients?.name||t.jobs?.services?.name||tr("Job"))}</strong><small>${escapeHtml(t.team_members?.name||tr("Owner"))}</small></span>
        <span class="record-field" data-label="${escapeHtml(tr("Planned"))}">${t.jobs?.duration_minutes?Math.round(t.jobs.duration_minutes/60*10)/10+"h":"—"}</span>
        <span class="record-field" data-label="${escapeHtml(tr("Actual"))}">${t.minutes_worked!=null?(Number(t.minutes_worked)/60).toFixed(1).replace(".0","")+"h":t.clocked_out_at?"—":tr("Running")}</span>
        <span class="record-field" data-label="${escapeHtml(tr("Status"))}">
          <i class="status ${t.clocked_out_at?"success":"warning"}">${escapeHtml(t.clocked_out_at?tr("Complete"):tr("Running"))}</i>
          ${t.clocked_out_at?`<button class="text-btn time-hide-btn" data-hide-time-entry="${t.id}">${escapeHtml(tr("Remove from this list"))}</button>`:""}
        </span>
      </div>`).join(""):`<div class="empty-table"><strong>${escapeHtml(tr("No time entries yet."))}</strong><span>${escapeHtml(tr("Time worked will appear here."))}</span></div>`;
  }

  const monthPayments=state.invoices.flatMap(i=>i.payments||[]).filter(p=>p.status==="confirmed"&&p.paid_at&&new Date(p.paid_at)>=monthStart);
  const revenue=monthPayments.reduce((s,p)=>s+Number(p.amount||0),0);
  const monthJobs=state.jobs.filter(j=>j.status==="completed"&&new Date(j.starts_at)>=monthStart);
  const monthEntries=state.timeEntries.filter(t=>new Date(t.clocked_in_at)>=monthStart);
  const monthMinutes=monthEntries.reduce((s,t)=>s+Number(t.minutes_worked||0),0);
  const rr=$("#reportRevenue"),rj=$("#reportJobs"),rm=$("#reportMiles"),rh=$("#reportHours");
  if(rr) rr.textContent=money(revenue);
  if(rj) rj.textContent=monthJobs.length;
  if(rm) rm.textContent=monthMiles.toFixed(1);
  if(rh) rh.textContent=(monthMinutes/60).toFixed(1).replace(".0","")+"h";
  const rjc=$("#reportJobsCopy"); if(rjc) rjc.textContent=monthJobs.length?"Completed this month.":"No completed jobs yet.";
  const rhc=$("#reportHoursCopy"); if(rhc) rhc.textContent=monthMinutes?"Tracked team time this month.":"No tracked time yet.";

  renderBookingRequests();
}

function renderBookingRequests(){
  const list=$("#bookingRequestsList");
  const pill=$("#bookingRequestCountPill");
  const visible=visibleBookingRequests();
  const pending=visible.filter(b=>b.status==="requested");
  if(pill) pill.textContent=pending.length+" new";
  if(!list) return;
  if(!visible.length){
    list.innerHTML=`<div class="empty-inline"><strong>No booking requests waiting.</strong><span>Reviewed requests leave this list automatically after 12 hours.</span></div>`;
    return;
  }
  list.innerHTML=visible.slice(0,20).map(b=>`
    <div class="booking-request-row">
      <div><strong>${escapeHtml(b.customer_name)}</strong><small>${escapeHtml(b.services?.name||"Cleaning")} · ${formatDateTime(b.requested_start_at)} · ${escapeHtml(b.service_address)}</small></div>
      <div class="record-actions">
        <span class="status ${b.status==="requested"?"warning":b.status==="converted"?"success":"neutral"}">${escapeHtml(b.status)}</span>
        <button data-check-booking-client="${b.id}">${b.reviewed_at?"Checked":"Check client"}</button>
        ${b.status==="requested"?`<button data-approve-booking="${b.id}">Approve</button><button class="danger-link" data-decline-booking="${b.id}">Decline</button>`:""}
      </div>
    </div>`).join("");
}


async function openBusinessProfileForm(){
  if(!state.business || state.business.role!=="owner"){
    showToast("Owner access required.");
    return;
  }

  state.modalType="businessProfile";
  state.modalId=state.business.id;

  let record={
    name:state.business.name||"",
    email:state.business.email||state.session?.user?.email||"",
    phone:state.business.phone||"",
    service_area:state.business.service_area||"",
    timezone:state.business.timezone||"UTC",
    default_language:state.business.default_language||"en",
    country_code:state.business.country_code||"US",
    locale_code:state.business.locale_code||"en-US",
    currency_code:state.business.currency_code||"USD",
    distance_unit:state.business.distance_unit||"mi",
    temperature_unit:state.business.temperature_unit||"fahrenheit",
    payment_methods:Array.isArray(state.business.payment_methods)?state.business.payment_methods:paymentMethodsForCountry(state.business?.country_code),
    instagram_url:state.business.instagram_url||"",
    facebook_url:state.business.facebook_url||""
  };

  try{
    const {data,error}=await supabase
      .from("businesses")
      .select("name,email,phone,service_area,timezone,default_language,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods,instagram_url,facebook_url")
      .eq("id",state.business.id)
      .single();
    if(error) throw error;
    if(data) record={...record,...data};
  }catch(err){
    console.warn("[TLE] business profile load",err);
  }

  modalHeader("COMPANY DETAILS","Edit business details","Update the company information used across your workspace and client-facing flows.");
  entityForm.innerHTML=`
    <div class="form-grid">
      <label>Business name<input name="name" required value="${escapeHtml(record.name||"")}"></label>
      <label>Business email<input name="email" type="email" required value="${escapeHtml(record.email||"")}"></label>
      <label>Phone<input name="phone" inputmode="tel" value="${escapeHtml(record.phone||"")}"></label>
      <label>Service area<input name="service_area" required value="${escapeHtml(record.service_area||"")}" placeholder="City, region, country"></label>
      <label>Time zone<input name="timezone_display" value="${escapeHtml(record.timezone||"UTC")}" readonly><small>Detected automatically from your service area.</small></label>
      <label>Default language<select name="default_language" required>
        <option value="en" ${record.default_language==="en"?"selected":""}>English</option>
        <option value="es" ${record.default_language==="es"?"selected":""}>Español</option>
        <option value="pt" ${record.default_language==="pt"?"selected":""}>Português</option>
        <option value="fr" ${record.default_language==="fr"?"selected":""}>Français</option>
      </select></label>
      <label>Currency<input name="currency_code" maxlength="3" required value="${escapeHtml(record.currency_code||"USD")}" placeholder="USD"></label>
      <label>Distance<select name="distance_unit"><option value="mi" ${record.distance_unit==="mi"?"selected":""}>Miles</option><option value="km" ${record.distance_unit==="km"?"selected":""}>Kilometers</option></select></label>
      <label>Temperature<select name="temperature_unit"><option value="fahrenheit" ${record.temperature_unit==="fahrenheit"?"selected":""}>Fahrenheit</option><option value="celsius" ${record.temperature_unit==="celsius"?"selected":""}>Celsius</option></select></label>
      <fieldset class="full"><legend>Client payment methods</legend>
        <div class="choice-grid compact">
          ${[...new Set([...(record.payment_methods||[]),...paymentMethodsForCountry(record.country_code)])].map(method=>`<label class="check-field"><input type="checkbox" name="payment_method" value="${escapeHtml(method)}" ${record.payment_methods?.includes(method)?"checked":""}> ${escapeHtml(paymentMethodLabel(method))}</label>`).join("")}
        </div>
        <small>No bank details are stored in the app. These are payment labels only; the client arranges payment directly with the business.</small>
      </fieldset>
      <label class="full">Instagram<input name="instagram_url" type="url" inputmode="url" value="${escapeHtml(record.instagram_url||"")}" placeholder="https://instagram.com/yourbusiness"></label>
      <label class="full">Facebook<input name="facebook_url" type="url" inputmode="url" value="${escapeHtml(record.facebook_url||"")}" placeholder="https://facebook.com/yourbusiness"></label>
    </div>
    <p class="helper">These links appear on your private Dashboard for one-tap access. They do not post automatically.</p>
    ${formSubmit("Save business details")}`;
  modal.hidden=false;
}

async function saveBusinessProfile(fd){
  if(!state.business || state.business.role!=="owner"){
    throw new Error("Owner access required.");
  }

  const serviceArea=String(fd.get("service_area")||"").trim();
  const detected=await resolveBusinessLocale(serviceArea);
  const paymentMethods=fd.getAll("payment_method").map(v=>String(v));
  if(!paymentMethods.length) throw new Error("Choose at least one client payment method.");
  const language=String(fd.get("default_language")||"en");
  const country=detected.country_code||state.business.country_code||"US";
  const payload={
    name:String(fd.get("name")||"").trim(),
    email:String(fd.get("email")||"").trim().toLowerCase(),
    phone:String(fd.get("phone")||"").trim()||null,
    service_area:serviceArea||null,
    timezone:detected.timezone||state.business.timezone||"UTC",
    country_code:country,
    default_language:language,
    locale_code:localeForCountry(country,language),
    currency_code:String(fd.get("currency_code")||detected.currency_code||"USD").trim().toUpperCase(),
    distance_unit:String(fd.get("distance_unit")||detected.distance_unit||"km"),
    temperature_unit:String(fd.get("temperature_unit")||detected.temperature_unit||"celsius"),
    payment_methods:paymentMethods,
    instagram_url:String(fd.get("instagram_url")||"").trim()||null,
    facebook_url:String(fd.get("facebook_url")||"").trim()||null,
    updated_at:new Date().toISOString()
  };

  if(!payload.name) throw new Error("Business name is required.");
  if(!payload.email) throw new Error("Business email is required.");
  if(!payload.service_area) throw new Error("Service area is required for local weather and business-time updates.");

  const {data,error}=await supabase
    .from("businesses")
    .update(payload)
    .eq("id",state.business.id)
    .select("name,email,phone,service_area,timezone,default_language,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods,instagram_url,facebook_url")
    .single();

  if(error) throw error;

  state.business={...state.business,...data};
  if(window.TLE_I18N?.setLanguage && ["en","es","pt","fr"].includes(data.default_language)){
    window.TLE_I18N.setLanguage(data.default_language);
  }
  renderSettings();
  showApp();
}

function renderSettings(){
  const n=$("#settingsBusinessName"),
        e=$("#settingsBusinessEmail"),
        p=$("#settingsBusinessPhone"),
        a=$("#settingsServiceArea"),
        country=$("#settingsBusinessCountry"),
        tz=$("#settingsBusinessTimezone"),
        lang=$("#settingsBusinessLanguage"),
        currency=$("#settingsBusinessCurrency"),
        distance=$("#settingsBusinessDistance"),
        temperature=$("#settingsBusinessTemperature"),
        paymentMethods=$("#settingsPaymentMethods"),
        bookingPaymentMethods=$("#bookingPaymentMethods"),
        b=$("#settingsTravelBuffer"),
        m=$("#settingsBookingNotice"),
        r=$("#settingsReplyEmail");
  if(n) n.textContent=state.business?.name||"—";
  if(e) e.textContent=state.business?.email||state.session?.user?.email||"—";
  if(p) p.textContent=state.business?.phone||"Not set";
  if(a) a.textContent=state.business?.service_area||"Not set";
  if(country) country.textContent=state.business?.country_code||"—";
  if(tz) tz.textContent=state.business?.timezone||"UTC";
  if(lang) lang.textContent=({en:"English",es:"Español",pt:"Português",fr:"Français"}[state.business?.default_language]||"English");
  if(currency) currency.textContent=state.business?.currency_code||"USD";
  if(distance) distance.textContent=state.business?.distance_unit==="km"?"Kilometers":"Miles";
  if(temperature) temperature.textContent=state.business?.temperature_unit==="celsius"?"Celsius":"Fahrenheit";
  const methodLabel=(state.business?.payment_methods||paymentMethodsForCountry(state.business?.country_code)).map(paymentMethodLabel).join(" · ");
  if(paymentMethods) paymentMethods.textContent=methodLabel;
  if(bookingPaymentMethods) bookingPaymentMethods.textContent=methodLabel;
  if(b) b.textContent=(state.publicLinks?.travel_buffer_minutes??state.business?.default_travel_buffer_minutes??0)+" minutes";
  if(m) m.textContent=(state.publicLinks?.minimum_notice_hours??24)+" hours";
  if(r) r.textContent=state.publicLinks?.reply_email||"Business login email";

  const reviewUrl=String(state.publicLinks?.google_review_url||"");
  const input=$("#googleReviewUrl");
  const status=$("#reviewLinkStatus");
  const test=$("#testGoogleReviewBtn");
  if(input && document.activeElement!==input) input.value=reviewUrl;
  if(status){
    status.textContent=reviewUrl?"Added":"Not added";
    status.className="status "+(reviewUrl?"success":"neutral");
  }
  if(test) test.hidden=!reviewUrl;
  renderBusinessPresence();
}

function renderBusinessPresence(){
  const instagram=$("#presenceInstagramBtn");
  const facebook=$("#presenceFacebookBtn");
  const google=$("#presenceGoogleBtn");
  const booking=$("#presenceBookingBtn");
  const hint=$("#presenceHint");
  if(!instagram || !facebook || !booking) return;

  const ig=String(state.business?.instagram_url||"").trim();
  const fb=String(state.business?.facebook_url||"").trim();
  const googleUrl=String(state.publicLinks?.google_review_url||"").trim();

  instagram.classList.toggle("connected",Boolean(ig));
  facebook.classList.toggle("connected",Boolean(fb));
  if(google) google.classList.toggle("connected",Boolean(googleUrl));
  instagram.dataset.url=ig;
  facebook.dataset.url=fb;
  if(google) google.dataset.url=googleUrl;

  const igState=$("#presenceInstagramState");
  const fbState=$("#presenceFacebookState");
  const googleState=$("#presenceGoogleState");
  if(igState) igState.textContent=ig?tr("Open profile"):tr("Add profile");
  if(fbState) fbState.textContent=fb?tr("Open page"):tr("Add page");
  if(googleState) googleState.textContent=googleUrl?tr("Open reviews"):tr("Add link");

  if(hint){
    hint.textContent=ig||fb||googleUrl
      ? tr("Keep your client-facing links close while you run the day.")
      : tr("Add Instagram, Facebook and your review link in Business Profile.");
  }
}

function renderPublicLinks(){
  const slug=state.publicLinks?.public_slug;
  if(!slug) return;
  const base=window.location.origin+window.location.pathname;
  const booking=`${base}?public=book&slug=${encodeURIComponent(slug)}`;
  const quote=`${base}?public=quote&slug=${encodeURIComponent(slug)}`;
  const be=$("#bookingUrl"),qe=$("#quoteUrl");
  if(be){be.textContent=booking;be.href=booking;}
  if(qe){qe.textContent=quote;qe.href=quote;}
  renderBusinessPresence();
}

async function loadPlatformAdmin(){
  if(!state.isPlatformAdmin) return;
  const [
    {data,error},
    {data:geoData,error:geoError},
    {data:activityData,error:activityError}
  ]=await Promise.all([
    supabase.rpc("get_platform_admin_dashboard"),
    supabase.rpc("get_platform_visit_geo_dashboard"),
    supabase.rpc("get_platform_activity_feed")
  ]);
  if(error){ showToast(error.message); return; }
  if(geoError) console.warn("[TLE] visitor geo",geoError);
  if(activityError) console.warn("[TLE] platform activity",activityError);
  state.platformAdminData={...(data||{}),...(geoData||{}),...(activityData||{})};
  const m=data?.metrics||{};
  const ids=[["#platformCustomers",m.customers],["#platformTrials",m.trials],["#platformActive",m.active_subscribers],["#platformVisits",m.visits_30d],["#platformUnique",m.unique_visitors_30d]];
  ids.forEach(([sel,val])=>{const el=$(sel);if(el)el.textContent=val??0;});

  const table=$("#platformCustomersTable");
  if(table){
    const customers=data?.customers||[];
    table.innerHTML=customers.length?customers.map(x=>`
      <div class="platform-customer-row">
        <div><strong>${escapeHtml(x.business_name||"Cleaning business")}</strong><small>${escapeHtml(x.email||"")} · Joined ${new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",year:"numeric"}).format(new Date(x.created_at))} · ${x.trial_promotion==="booking_page_setup"?"2 months Cleaning App with Booking Page":"30-day standard trial"}</small><button class="ghost-btn" type="button" data-booking-page-promo="${x.business_id}" ${x.trial_promotion==="booking_page_setup"?"disabled":""}>${x.trial_promotion==="booking_page_setup"?"2-month promo active":"Grant Booking Page 2-month promo"}</button></div>
        <div><small>Last sign-in</small><strong>${x.last_sign_in_at?formatDateTime(x.last_sign_in_at):"Never"}</strong></div>
        <div><small>${x.status==="active"?"Purchased":"Trial ends"}</small><strong>${x.status==="active"&&x.subscription_activated_at?new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",year:"numeric"}).format(new Date(x.subscription_activated_at)):x.trial_ends_at?new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(x.trial_ends_at)):"—"}</strong></div>
        <select data-platform-status="${x.business_id}">
          ${["trial","active","past_due","canceled","expired"].map(s=>`<option value="${s}" ${x.status===s?"selected":""}>${s}</option>`).join("")}
        </select>
        <span class="status ${x.status==="active"?"success":x.status==="trial"?"blue":"neutral"}">${escapeHtml(x.status)}</span>
      </div>`).join(""):`<div class="empty-inline"><strong>No outside customers yet.</strong><span>Your internal admin accounts are intentionally excluded.</span></div>`;
  }

  const states=$("#platformTopStates");
  if(states){
    const rows=geoData?.top_states||[];
    states.innerHTML=rows.length?rows.map(x=>`
      <div class="state-row">
        <span><strong>${escapeHtml(x.state_code||x.state||"Unknown")}</strong><small>${escapeHtml(x.state||"Unknown")}${x.country?" · "+escapeHtml(x.country):""}</small></span>
        <span><strong>${Number(x.visits||0)}</strong><small>${Number(x.unique_visitors||0)} unique</small></span>
      </div>`).join(""):`<div class="empty-inline"><strong>No location data yet.</strong><span>New external visits will appear here.</span></div>`;
  }

  const logins=$("#platformRecentLogins");
  if(logins){
    const rows=activityData?.logins||[];
    logins.innerHTML=rows.length?rows.map(v=>`
      <div class="visit-row activity-row">
        <span>
          <strong>${escapeHtml(v.email||"Unknown email")}</strong>
          <small>${escapeHtml(v.business_name||"Cleaning business")} · Login</small>
        </span>
        <span class="activity-row-actions">
          <time>${formatDateTime(v.created_at)}</time>
          <button class="activity-archive-btn" type="button"
            data-archive-activity="logins"
            data-archive-user="${escapeHtml(v.user_id||"")}"
            data-archive-visitor="${escapeHtml(v.visitor_id||"")}">Archive</button>
        </span>
      </div>`).join(""):`<div class="empty-inline"><strong>No customer logins yet.</strong><span>New authenticated app opens will appear here.</span></div>`;
  }

  const visits=$("#platformRecentVisits");
  if(visits){
    const rows=activityData?.visits||geoData?.recent_geo_visits||data?.recent_visits||[];
    const groups=[];
    const byVisitor=new Map();

    rows.forEach(v=>{
      const label=v.email||v.business_name||"Anonymous visitor";
      const anonymousKey=!v.email&&!v.business_name
        ? [label,v.city||"",v.state_code||v.state||"",v.country||""].join("|")
        : label.toLowerCase();
      const subjectKey=v.user_id?"user:"+v.user_id:(v.visitor_id?"visitor:"+v.visitor_id:anonymousKey);
      if(!byVisitor.has(subjectKey)){
        const group={
          label,
          latest:v.created_at,
          city:v.city||"",
          state:v.state_code||v.state||"",
          country:v.country||"",
          pages:[],
          count:0,
          userId:v.user_id||"",
          visitorId:v.visitor_id||""
        };
        byVisitor.set(subjectKey,group);
        groups.push(group);
      }
      const group=byVisitor.get(subjectKey);
      group.count+=1;
      if(new Date(v.created_at)>new Date(group.latest)) group.latest=v.created_at;
      const page=v.page||"/";
      if(!group.pages.some(p=>p.page===page)){
        group.pages.push({page,created_at:v.created_at});
      }
    });

    visits.innerHTML=groups.length?groups.slice(0,10).map(g=>{
      const location=[g.city,g.state].filter(Boolean).join(", ")||(g.country||"");
      const loginOnly=g.pages.length>0&&g.pages.every(p=>p.page==="/login");
      const pageLabel=loginOnly
        ?"Login page only · no sign-in"
        :(g.pages.length===1?"1 page":g.pages.length+" pages");
      const details=g.pages.slice(0,8).map(p=>`
        <div class="visit-detail-row">
          <span>${escapeHtml(p.page)}</span>
          <time>${formatDateTime(p.created_at)}</time>
        </div>`).join("");
      return `
        <div class="visit-group">
          <div class="visit-group-main">
            <span>
              <strong>${escapeHtml(g.label)}</strong>
              <small>${pageLabel}${location?" · "+escapeHtml(location):""}</small>
            </span>
            <time>${formatDateTime(g.latest)}</time>
          </div>
          <div class="visit-group-actions">
            <details class="visit-group-details">
              <summary>View activity</summary>
              <div class="visit-detail-list">${details}</div>
            </details>
            <button class="activity-archive-btn" type="button"
              data-archive-activity="visits"
              data-archive-user="${escapeHtml(g.userId)}"
              data-archive-visitor="${escapeHtml(g.visitorId)}">Archive</button>
          </div>
        </div>`;
    }).join(""):`<div class="empty-inline"><strong>No external visits yet.</strong><span>Your own visits do not count.</span></div>`;
  }

  const suspectedTraffic=$("#platformSuspectedTraffic");
  if(suspectedTraffic){
    const rows=activityData?.suspected_visits||[];
    const groups=[];
    const byKey=new Map();

    rows.forEach(v=>{
      const location=[v.city,v.state_code||v.state,v.country].filter(Boolean).join(", ")||"Unknown";
      const reason=v.reason||"Suspicious traffic pattern";
      const key=reason+"|"+location;
      if(!byKey.has(key)){
        const group={reason,location,count:0,visitors:new Set(),latest:v.created_at,pages:new Set()};
        byKey.set(key,group);
        groups.push(group);
      }
      const group=byKey.get(key);
      group.count+=1;
      if(v.visitor_id) group.visitors.add(v.visitor_id);
      if(v.page) group.pages.add(v.page);
      if(new Date(v.created_at)>new Date(group.latest)) group.latest=v.created_at;
    });

    suspectedTraffic.innerHTML=groups.length?groups.slice(0,12).map(g=>`
      <div class="visit-row activity-row suspected-traffic-row">
        <span>
          <strong>${escapeHtml(g.reason)}</strong>
          <small>${escapeHtml(g.location)} · ${g.count} hit${g.count===1?"":"s"} · ${g.visitors.size} visitor ID${g.visitors.size===1?"":"s"}</small>
        </span>
        <span class="activity-row-actions">
          <span class="status neutral">Filtered</span>
          <time>${formatDateTime(g.latest)}</time>
        </span>
      </div>`).join(""):`<div class="empty-inline"><strong>No suspicious traffic detected.</strong><span>Nothing is currently being filtered from visitor metrics.</span></div>`;
  }

  const internalVisits=$("#platformInternalVisits");
  if(internalVisits){
    const rows=internalActivityData?.visits||[];
    const groups=[];
    const byVisitor=new Map();

    rows.forEach(v=>{
      const label=v.email||v.business_name||"Internal admin";
      const subjectKey=v.user_id
        ?"user:"+v.user_id
        :(v.visitor_id?"visitor:"+v.visitor_id:label.toLowerCase());

      if(!byVisitor.has(subjectKey)){
        const group={
          label,
          latest:v.created_at,
          city:v.city||"",
          state:v.state_code||v.state||"",
          country:v.country||"",
          pages:[],
          userId:v.user_id||"",
          visitorId:v.visitor_id||""
        };
        byVisitor.set(subjectKey,group);
        groups.push(group);
      }

      const group=byVisitor.get(subjectKey);
      if(new Date(v.created_at)>new Date(group.latest)) group.latest=v.created_at;
      const page=v.page||"/";
      if(!group.pages.some(p=>p.page===page)){
        group.pages.push({page,created_at:v.created_at});
      }
    });

    internalVisits.innerHTML=groups.length?groups.slice(0,12).map(g=>{
      const location=[g.city,g.state].filter(Boolean).join(", ")||(g.country||"");
      const pageLabel=g.pages.length===1?"1 page":g.pages.length+" pages";
      const details=g.pages.slice(0,10).map(p=>`
        <div class="visit-detail-row">
          <span>${escapeHtml(p.page)}</span>
          <time>${formatDateTime(p.created_at)}</time>
        </div>`).join("");

      return `
        <div class="visit-group internal-visit-group">
          <div class="visit-group-main">
            <span>
              <strong>${escapeHtml(g.label)}</strong>
              <small>Internal · ${pageLabel}${location?" · "+escapeHtml(location):""}</small>
            </span>
            <time>${formatDateTime(g.latest)}</time>
          </div>
          <div class="visit-group-actions">
            <details class="visit-group-details">
              <summary>View activity</summary>
              <div class="visit-detail-list">${details}</div>
            </details>
            <button class="activity-archive-btn internal-clear-btn" type="button"
              data-archive-activity="visits"
              data-archive-user="${escapeHtml(g.userId)}"
              data-archive-visitor="${escapeHtml(g.visitorId)}"
              data-archive-label="Clear">Clear</button>
          </div>
        </div>`;
    }).join(""):`<div class="empty-inline"><strong>No internal activity to clear.</strong><span>Your own activity stays separate from real visitor metrics.</span></div>`;
  }

  const purchases=$("#platformPurchases");
  if(purchases){
    const rows=activityData?.purchases||[];
    purchases.innerHTML=rows.length?rows.map(v=>`
      <div class="visit-row activity-row purchase-row">
        <span>
          <strong>${escapeHtml(v.email||"Unknown email")}</strong>
          <small>${escapeHtml(v.business_name||"Cleaning business")} · ${escapeHtml(v.status||"active")}</small>
        </span>
        <span class="activity-value">
          <strong>${money(Number(v.price||5.99))}</strong>
          <time>${formatDateTime(v.activated_at||v.created_at)}</time>
        </span>
      </div>`).join(""):`<div class="empty-inline"><strong>No purchases yet.</strong><span>Paid app activations will appear here with the customer email.</span></div>`;
  }
}

async function initializePublicRequest(mode,slug){
  setShellState("public");
  authShell.hidden=true;
  appShell.hidden=true;
  publicShell.hidden=false;

  const {data,error}=await supabase.rpc("get_public_booking_config",{p_slug:slug});
  if(error){
    $("#publicBusinessName").textContent="Page unavailable";
    $("#publicIntro").textContent=error.message||"This booking page is not available.";
    $("#publicRequestForm").hidden=true;
    return;
  }

  const allServices=data?.services||[];
  const services=allServices.filter(s=>mode==="quote" ? true : (s.pricing_type!=="quote" && Number(s.base_price)>0));
  const addons=data?.addons||[];
  const form=$("#publicRequestForm");
  const serviceSelect=$("#publicService");
  const addonBox=$("#publicAddons");
  const summary=$("#publicSummary");
  const quoteTimeWrap=$("#publicQuoteTimeWrap");
  const slotsWrap=$("#publicSlotsWrap");
  const slotsBox=$("#publicSlots");
  const slotInput=$("#publicSlotStart");
  const submit=$("#publicSubmitBtn");

  $("#publicBusinessName").textContent=data?.business?.name||"Cleaning service";
  $("#publicModeLabel").textContent=mode==="quote"?"REQUEST A QUOTE":"BOOK A CLEANING";
  $("#publicIntro").textContent=mode==="quote"
    ?"Tell us what you need and the business will review your request."
    :"Choose a service, date, and one of the real available times below.";
  submit.textContent=mode==="quote"?"Send quote request":"Send booking request";
  $("#publicAddonsWrap").hidden=mode==="quote";
  if(quoteTimeWrap) quoteTimeWrap.hidden=mode!=="quote";
  if(slotsWrap) slotsWrap.hidden=mode==="quote";

  const quoteTimeInput=form?.querySelector('[name="time"]');
  if(quoteTimeInput) quoteTimeInput.required=mode==="quote";

  if(!services.length){
    serviceSelect.innerHTML='<option value="">'+(mode==="quote"?"No services available yet":"No priced services available for online booking")+'</option>';
    serviceSelect.disabled=true;
    submit.disabled=true;
    summary.innerHTML=mode==="quote"
      ?'<span>No services are available yet. Please contact the cleaning business directly.</span>'
      :'<span>No instant-booking services are available yet. Services without a fixed price require a quote.</span><button type="button" class="primary-btn" id="bookingToQuoteBtn">Request a Quote</button>';
    $("#bookingToQuoteBtn")?.addEventListener("click",()=>{
      window.location.href=window.location.origin+window.location.pathname+"?public=quote&slug="+encodeURIComponent(slug);
    });
  }else{
    serviceSelect.disabled=false;
    serviceSelect.innerHTML='<option value="">Choose a service</option>'+services.map(s=>`<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}${s.pricing_type==="quote"?" · Quote required":s.base_price!=null?" · "+money(s.base_price):""}</option>`).join("");
  }

  const chosenAddonIds=()=>$$('input[name="addon"]:checked',addonBox).map(x=>x.value);

  function updatePublicSummary(){
    const selected=services.find(s=>s.id===serviceSelect.value);
    if(!selected){summary.innerHTML="";return;}
    const chosen=addons.filter(a=>chosenAddonIds().includes(a.id));
    const total=(Number(selected.base_price)||0)+chosen.reduce((sum,a)=>sum+Number(a.price||0),0);
    const duration=Number(selected.duration_minutes||0)+chosen.reduce((sum,a)=>sum+Number(a.extra_duration_minutes||0),0);
    summary.innerHTML=`<strong>${escapeHtml(selected.name)}</strong><span>${duration} min${selected.pricing_type==="quote"?" · Quote will be reviewed":" · Estimated "+money(total)}</span>`;
  }

  function renderPublicAddons(){
    const selected=services.find(s=>s.id===serviceSelect.value);
    const available=addons.filter(a=>!a.service_id||a.service_id===selected?.id);
    addonBox.innerHTML=available.length?available.map(a=>`<label class="addon-choice"><input type="checkbox" name="addon" value="${escapeHtml(a.id)}"><span><strong>${escapeHtml(a.name)}</strong><small>+${money(a.price)} · +${escapeHtml(a.extra_duration_minutes)} min</small></span></label>`).join(""):'<span class="muted-line">No add-ons for this service.</span>';
    updatePublicSummary();
  }

  function formatSlot(iso){
    return new Intl.DateTimeFormat(appLocale(),{
      timeZone:data?.business?.timezone||"UTC",
      hour:"numeric",
      minute:"2-digit"
    }).format(new Date(iso));
  }

  async function refreshPublicSlots(){
    if(mode==="quote" || !slotsBox || !slotInput) return;
    slotInput.value="";
    const serviceId=serviceSelect.value;
    const dateValue=form?.querySelector('[name="date"]')?.value;
    if(!serviceId || !dateValue){
      slotsBox.innerHTML='<span class="muted-line">Choose a service and date first.</span>';
      return;
    }

    slotsBox.innerHTML='<span class="muted-line">Checking availability…</span>';
    const {data:rows,error:slotError}=await supabase.rpc("get_public_available_slots",{
      p_slug:slug,
      p_service_id:serviceId,
      p_date:dateValue,
      p_addon_ids:chosenAddonIds()
    });

    if(slotError){
      slotsBox.innerHTML=`<span class="muted-line">${escapeHtml(slotError.message||"Could not load availability")}</span>`;
      return;
    }

    const slots=Array.isArray(rows)?rows:[];
    if(!slots.length){
      slotsBox.innerHTML='<span class="muted-line">No openings on this date. Try another day.</span>';
      return;
    }

    slotsBox.innerHTML=slots.map(row=>`<button type="button" class="slot-btn" data-slot="${escapeHtml(row.slot_start)}">${escapeHtml(formatSlot(row.slot_start))}</button>`).join("");
  }

  serviceSelect.onchange=()=>{
    renderPublicAddons();
    refreshPublicSlots();
  };
  addonBox.onchange=()=>{
    updatePublicSummary();
    refreshPublicSlots();
  };
  if(slotsBox){
    slotsBox.onclick=e=>{
      const btn=e.target.closest("[data-slot]");
      if(!btn) return;
      slotsBox.querySelectorAll("[data-slot]").forEach(x=>x.classList.toggle("selected",x===btn));
      slotInput.value=btn.dataset.slot;
    };
  }

  renderPublicAddons();

  const dateInput=form?.querySelector('[name="date"]');
  if(dateInput){
    dateInput.min=new Intl.DateTimeFormat("en-CA",{timeZone:data?.business?.timezone||"UTC"}).format(new Date());
    const maxDate=new Date(Date.now()+90*86400000);
    dateInput.max=new Intl.DateTimeFormat("en-CA",{timeZone:data?.business?.timezone||"UTC"}).format(maxDate);
    dateInput.onchange=refreshPublicSlots;
  }

  form.onsubmit=async e=>{
    e.preventDefault();
    if(!services.length) return;
    const fd=new FormData(form);
    const preferred=fd.get("preferred_contact");
    const phone=String(fd.get("phone")||"").trim();
    setBusy(submit,true,"Sending…");
    try{
      if((preferred==="text"||preferred==="whatsapp")&&!phone) throw new Error("Phone is required for Text or WhatsApp.");

      if(mode==="quote"){
        const {error:submitError}=await supabase.rpc("submit_public_quote_request",{
          p_slug:slug,
          p_service_id:fd.get("service_id"),
          p_customer_name:String(fd.get("name")).trim(),
          p_customer_email:String(fd.get("email")).trim(),
          p_customer_phone:phone||null,
          p_preferred_contact:preferred,
          p_service_address:String(fd.get("address")).trim(),
          p_preferred_date:fd.get("date"),
          p_preferred_time:fd.get("time"),
          p_notes:String(fd.get("notes")||"").trim()||null
        });
        if(submitError) throw submitError;
      }else{
        const selectedSlot=String(fd.get("slot_start")||"").trim();
        if(!selectedSlot) throw new Error("Choose one of the available times.");
        const {error:submitError}=await supabase.rpc("submit_public_booking_request",{
          p_slug:slug,
          p_service_id:fd.get("service_id"),
          p_addon_ids:fd.getAll("addon"),
          p_customer_name:String(fd.get("name")).trim(),
          p_customer_email:String(fd.get("email")).trim(),
          p_customer_phone:phone||null,
          p_preferred_contact:preferred,
          p_service_address:String(fd.get("address")).trim(),
          p_requested_start_at:selectedSlot,
          p_notes:String(fd.get("notes")||"").trim()||null
        });
        if(submitError) throw submitError;
      }

      form.hidden=true;
      $("#publicSuccess").hidden=false;
      $("#publicSuccessCopy").textContent=mode==="quote"
        ?"Your quote request was sent. The business will review it and contact you."
        :"Your booking request was sent. The business will review it and confirm the appointment.";
    }catch(err){
      showToast(err.message||"Could not send request");
    }finally{
      setBusy(submit,false);
    }
  };

  $("#publicBackBtn").onclick=()=>{
    if(history.length>1) history.back();
    else window.location.href=window.location.origin+window.location.pathname;
  };
}

function optionList(items,valueKey,labelKey,selected){
  return items.map(item=>`<option value="${escapeHtml(item[valueKey])}" ${item[valueKey]===selected?"selected":""}>${escapeHtml(item[labelKey])}</option>`).join("");
}
function modalHeader(eyebrow,title,copy){
  $("#modalEyebrow").textContent=eyebrow;
  $("#modalTitle").textContent=title;
  $("#modalCopy").textContent=copy;
}
function openEntityForm(type,id=null){
  state.modalType=type; state.modalId=id;
  let record=null;
  if(type==="client") record=state.clients.find(x=>x.id===id);
  if(type==="lead") record=state.leads.find(x=>x.id===id);
  if(type==="invoice") record=state.invoices.find(x=>x.id===id);
  if(type==="service") record=state.services.find(x=>x.id===id);
  if(type==="addon") record=state.serviceAddons.find(x=>x.id===id);
  if(type==="supply") record=state.supplies.find(x=>x.id===id);
  if(type==="job") record=state.jobs.find(x=>x.id===id);
  if(type==="quote") record=state.quotes.find(x=>x.id===id);

  if(type==="lead"){
    modalHeader("LEAD",record?"Edit lead":"Add lead","Capture the inquiry and the next step without losing it in texts or DMs.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>Email<input name="email" type="email" required value="${escapeHtml(record?.email||"")}"></label>
        <label>Phone<input name="phone" value="${escapeHtml(record?.phone||"")}"></label>
        <label>Preferred contact<select name="preferred_contact">
          <option value="email" ${record?.preferred_contact==="email"?"selected":""}>Email</option>
          <option value="text" ${record?.preferred_contact==="text"?"selected":""}>Text</option>
          <option value="whatsapp" ${record?.preferred_contact==="whatsapp"?"selected":""}>WhatsApp</option>
        </select></label>
        <label>Source<input name="source" value="${escapeHtml(record?.source||"")}" placeholder="Instagram, referral, website…"></label>
        <label>Status<select name="status">${["new","contacted","qualified","quoted","booked","lost"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v}</option>`).join("")}</select></label>
        <label class="full">Service interest<input name="service_interest" value="${escapeHtml(record?.service_interest||"")}"></label>
        <label class="full">Address<input name="address" value="${escapeHtml(record?.address||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Add lead")}`;
  }

  if(type==="invoice"){
    const item=record?.invoice_items?.[0];
    const due=record?.due_at?new Date(record.due_at).toLocaleDateString("en-CA"):"";
    modalHeader("INVOICE",record?"Edit invoice":"New invoice","Track payment manually with Cash, Check or Other.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Client<select name="client_id" required><option value="">Choose client</option>${optionList(state.clients,"id","name",record?.client_id)}</select></label>
        <label>Status<select name="status">${["draft","sent","void"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v}</option>`).join("")}</select></label>
        <label class="full">Description<input name="description" required value="${escapeHtml(item?.description||"Cleaning service")}"></label>
        <label>Amount<input name="amount" type="number" min="0" step="0.01" required value="${item?.line_total??record?.total??""}"></label>
        <label>Due date<input name="due_date" type="date" value="${due}"></label>
      </div>${formSubmit(record?"Save changes":"Create invoice")}`;
  }

  if(type==="client"){
    modalHeader("CLIENT",record?"Edit client":"Add client","Keep contact, service address and preferences in one place.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>Email<input name="email" type="email" required value="${escapeHtml(record?.email||"")}"></label>
        <label>Phone<input name="phone" value="${escapeHtml(record?.phone||"")}"></label>
        <label>Preferred contact<select name="preferred_contact">
          <option value="email" ${record?.preferred_contact==="email"?"selected":""}>Email</option>
          <option value="text" ${record?.preferred_contact==="text"?"selected":""}>Text</option>
          <option value="whatsapp" ${record?.preferred_contact==="whatsapp"?"selected":""}>WhatsApp</option>
        </select></label>
        <label class="full">Street address<input name="address_line1" value="${escapeHtml(record?.address_line1||"")}"></label>
        <label>City<input name="city" value="${escapeHtml(record?.city||"")}"></label>
        <label>Region / State<input name="state" value="${escapeHtml(record?.state||"")}"></label>
        <label>Postal code<input name="postal_code" value="${escapeHtml(record?.postal_code||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Add client")}`;
  }

  if(type==="service"){
    modalHeader("SERVICE",record?"Edit service":"Add service","Set the price and expected time once so scheduling stays consistent.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label class="full">Service name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>Pricing type<select name="pricing_type">
          ${["flat","hourly","sqft","quote"].map(v=>`<option value="${v}" ${record?.pricing_type===v?"selected":""}>${v==="quote"?"Quote required":v}</option>`).join("")}
        </select></label>
        <label>Base price<input name="base_price" type="number" min="0" step="0.01" value="${record?.base_price??""}"></label>
        <label>Duration (minutes)<input name="default_duration_minutes" type="number" min="15" step="15" required value="${record?.default_duration_minutes||120}"></label>
        <label class="full">Description<textarea name="description">${escapeHtml(record?.description||"")}</textarea></label>
        <label class="check-field"><input name="active" type="checkbox" ${record?.active!==false?"checked":""}> Active service</label>
      </div>${formSubmit(record?"Save changes":"Add service")}`;
  }

  if(type==="addon"){
    modalHeader("ADD-ON",record?"Edit add-on":"Add add-on","Set the extra price and extra time this option adds to a cleaning.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Service<select name="service_id"><option value="">General / all services</option>${optionList(state.services.filter(s=>s.active),"id","name",record?.service_id)}</select></label>
        <label>Name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>Extra price<input name="price" type="number" min="0" step="0.01" required value="${record?.price??0}"></label>
        <label>Extra time (minutes)<input name="extra_duration_minutes" type="number" min="0" step="5" required value="${record?.extra_duration_minutes??0}"></label>
        <label class="check-field"><input name="active" type="checkbox" ${record?.active!==false?"checked":""}> Active add-on</label>
      </div>${formSubmit(record?"Save changes":"Add add-on")}`;
  }

  if(type==="supply"){
    modalHeader("SUPPLY",record?"Edit supply":"Add supply","Track quantity, reorder level and cost without turning this into a heavy inventory system.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>Category<input name="category" value="${escapeHtml(record?.category||"")}" placeholder="Chemicals, cloths, bags…"></label>
        <label>Quantity<input name="quantity" type="number" min="0" step="0.01" required value="${record?.quantity??0}"></label>
        <label>Unit<input name="unit" required value="${escapeHtml(record?.unit||"item")}" placeholder="bottles, boxes, rolls"></label>
        <label>Reorder level<input name="reorder_level" type="number" min="0" step="0.01" required value="${record?.reorder_level??0}"></label>
        <label>Cost per unit<input name="cost_per_unit" type="number" min="0" step="0.01" value="${record?.cost_per_unit??""}"></label>
        <label class="full">Preferred vendor<input name="preferred_vendor" value="${escapeHtml(record?.preferred_vendor||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
        <label class="check-field"><input name="active" type="checkbox" ${record?.active!==false?"checked":""}> Active supply</label>
      </div>${formSubmit(record?"Save changes":"Add supply")}`;
  }

  if(type==="mileage"){
    const mileageJobs=state.jobs.filter(j=>j.status!=="canceled");
    modalHeader(tr("MILEAGE"),record?langPick("Edit drive","Editar viaje","Editar trajeto","Modifier le trajet"):langPick("Log drive","Registrar viaje","Registrar trajeto","Enregistrer le trajet"),langPick("Keep business distance simple with separate From and To fields.","Guarda la distancia del negocio con origen y destino separados.","Mantenha a distância do negócio simples com origem e destino separados.","Gardez les déplacements professionnels simples avec un départ et une destination séparés."));
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>${tr("Date")}<input name="log_date" type="date" required value="${escapeHtml(record?.log_date||new Date().toLocaleDateString("en-CA"))}"></label>
        <label>${tr(businessDistanceUnit()==="km"?"Kilometers":"Miles")}<input name="distance" type="number" min="0.1" step="0.1" required value="${record?distanceFromStoredMiles(record.miles).toFixed(1):""}" placeholder="12.4"></label>
        <label class="full">${tr("Job (optional)")}<select name="job_id" data-mileage-job>
          <option value="">${tr("No specific job")}</option>
          ${mileageJobs.map(j=>`<option value="${j.id}" data-address="${escapeHtml(j.service_address||"")}" ${record?.job_id===j.id?"selected":""}>${escapeHtml(j.clients?.name||j.service_address||tr("Cleaning job"))}</option>`).join("")}
        </select></label>
        <label class="full">${tr("Type")}<select name="trip_type" data-mileage-type required>
          <option value="residential" ${record?.trip_type==="residential"||!record?.trip_type?"selected":""}>${tr("Residential")}</option>
          <option value="commercial" ${record?.trip_type==="commercial"?"selected":""}>${tr("Commercial")}</option>
          <option value="extra" ${record?.trip_type==="extra"?"selected":""}>${tr("Extra job")}</option>
        </select></label>
        <label class="full" data-mileage-extra-wrap ${record?.trip_type==="extra"?"":"hidden"}>${tr("Extra job type")}<select name="extra_job_type">
          <option value="">${tr("Choose type")}</option>
          <option value="Store" ${record?.extra_job_type==="Store"?"selected":""}>${tr("Store")}</option>
          <option value="School" ${record?.extra_job_type==="School"?"selected":""}>${tr("School")}</option>
          <option value="Office" ${record?.extra_job_type==="Office"?"selected":""}>${tr("Office")}</option>
          <option value="Supply run" ${record?.extra_job_type==="Supply run"?"selected":""}>${tr("Supply run")}</option>
          <option value="Other" ${record?.extra_job_type==="Other"?"selected":""}>${tr("Other")}</option>
        </select></label>
        <label>${tr("From")}<input name="from_location" required value="${escapeHtml(record?.from_location||"")}" placeholder="${tr("Office / home / previous stop")}"></label>
        <label>${tr("To")}<input name="to_location" required value="${escapeHtml(record?.to_location||"")}" placeholder="${tr("Client / supply store")}"></label>
        <label class="full">${tr("Note (optional)")}<input name="notes" value="${escapeHtml(record?.notes||"")}" placeholder="${tr("e.g. pick up supplies")}"></label>
      </div>${formSubmit(langPick("Save mileage","Guardar millaje","Salvar quilometragem","Enregistrer le kilométrage"))}`;
  }

  if(type==="job"){
    const localParts=record?.starts_at?zonedDateTimeParts(record.starts_at):{date:"",time:""};
    const date=localParts.date;
    const time=localParts.time;
    modalHeader("JOB",record?"Edit job":"Add job","Schedule a cleaning with duration and travel buffer.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Client<select name="client_id"><option value="">No client</option>${optionList(state.clients,"id","name",record?.client_id)}</select></label>
        <label>Service<select name="service_id"><option value="">No service</option>${optionList(state.services.filter(s=>s.active),"id","name",record?.service_id)}</select></label>
        <label>Assigned teammate<select name="team_member_id"><option value="">Unassigned</option>${optionList(state.teamMembers,"id","name",record?.job_assignments?.[0]?.team_member_id)}</select></label>
        <label>Date<input name="date" type="date" required value="${date}"></label>
        <label>Time<input name="time" type="time" required value="${time}"></label>
        <label>Duration (minutes)<input name="duration_minutes" type="number" min="15" step="15" required value="${record?.duration_minutes||120}"></label>
        <label>Travel buffer (minutes)<input name="travel_buffer" type="number" min="0" step="5" value="${record?.travel_buffer_before_minutes??state.business.default_travel_buffer_minutes??30}"></label>
        <label class="full">Service address<input name="service_address" required value="${escapeHtml(record?.service_address||"")}"></label>
        <label>Status<select name="status">
          ${["scheduled","on_the_way","in_progress","completed","canceled","no_show"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v.replaceAll("_"," ")}</option>`).join("")}
        </select></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Add job")}`;
  }

  if(type==="quote"){
    const item=record?.quote_items?.[0];
    modalHeader("QUOTE",record?"Edit quote":"Create quote","A quote stays here until it is accepted. Acceptance creates the client, job and invoice.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Name<input name="customer_name" required value="${escapeHtml(record?.customer_name||"")}"></label>
        <label>Email<input name="customer_email" type="email" required value="${escapeHtml(record?.customer_email||"")}"></label>
        <label>Phone<input name="customer_phone" value="${escapeHtml(record?.customer_phone||"")}"></label>
        <label>Service<select name="service_id" required><option value="">Choose service</option>${optionList(state.services.filter(s=>s.active),"id","name",item?.service_id)}</select></label>
        <label>Price<input name="price" type="number" min="0" step="0.01" required value="${item?.unit_price??record?.total??""}"></label>
        <label>Status<select name="status">
          ${["requested","draft","sent","declined","expired"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v}</option>`).join("")}
        </select></label>
        <label>Date<input name="preferred_date" type="date" required value="${record?.preferred_date||""}"></label>
        <label>Time<input name="preferred_time" type="time" required value="${record?.preferred_time?.slice(0,5)||""}"></label>
        <label class="full">Service address<input name="service_address" required value="${escapeHtml(record?.service_address||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Create quote")}`;
  }

  modal.hidden=false;
}
function formSubmit(label){ return `<div class="form-footer"><button type="button" class="ghost-btn" data-modal-cancel>Cancel</button><button class="primary-btn" type="submit">${label}</button></div>`; }


function openFeedbackForm(){
  if(!state.session || !state.business){
    showToast("Sign in to send feedback");
    return;
  }
  state.modalType="feedback";
  state.modalId=null;
  modalHeader(
    "FEEDBACK",
    "Help us improve the Cleaning App",
    "Send a quick bug report, idea or question. Your business email is included so we can follow up if needed."
  );
  entityForm.innerHTML=`
    <div class="form-grid">
      <label class="full">Feedback type
        <select name="category" required>
          <option value="bug">Something is not working</option>
          <option value="idea">I have an idea</option>
          <option value="question">I have a question</option>
          <option value="other">Something else</option>
        </select>
      </label>
      <label class="full">Tell us what happened or what you need
        <textarea name="message" rows="6" maxlength="3000" required placeholder="A short description is enough."></textarea>
      </label>
    </div>
    ${formSubmit("Send feedback")}`;
  modal.hidden=false;
  setTimeout(()=>entityForm.querySelector('textarea[name="message"]')?.focus(),50);
}

async function saveFeedback(fd){
  const category=String(fd.get("category")||"other");
  const message=String(fd.get("message")||"").trim();
  if(message.length<2) throw new Error("Tell us a little more before sending.");

  const page=$(".view.active")?.dataset.page||"unknown";
  const {data,error}=await supabase.functions.invoke("submit-app-feedback",{
    body:{
      category,
      message,
      page,
      language:window.TLE_I18N?.language||"en",
      app_version:APP_VERSION
    }
  });
  if(error) throw error;
  if(!data?.submitted) throw new Error(data?.error||"Could not send feedback.");
  return data;
}

entityForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const button=e.submitter;
  setBusy(button,true,"Saving…");
  try{
    const fd=new FormData(entityForm);
    if(state.modalType==="feedback"){
      await saveFeedback(fd);
      modal.hidden=true;
      showToast(langPick("Feedback sent. Thank you!","Comentarios enviados. ¡Gracias!","Feedback enviado. Obrigado!","Commentaire envoyé. Merci !"));
      return;
    }
    if(state.modalType==="workerMileage"){
      const workerUnit=state.workerPortal?.business?.distance_unit==="km"?"km":"mi";
      const entered=Number(fd.get("distance")||0);
      if(!Number.isFinite(entered)||entered<=0){
        throw new Error(langPick("Enter a valid distance.","Ingresa una distancia válida.","Digite uma distância válida.","Saisissez une distance valide."));
      }
      const miles=workerUnit==="km"?entered/1.609344:entered;
      const token=localStorage.getItem("tle_worker_device_token");
      const {error}=await supabase.rpc("worker_portal_log_mileage",{
        p_token:token,
        p_job_id:state.modalId,
        p_miles:miles,
        p_notes:String(fd.get("notes")||"").trim()||null
      });
      if(error) throw error;
      modal.hidden=true;
      await refreshWorkerPortal();
      showToast(langPick("Mileage saved","Millaje guardado","Quilometragem salva","Kilométrage enregistré"));
      return;
    }
    if(state.modalType==="lead") await saveLead(fd);
    let invoiceResult=null;
    let quoteResult=null;
    let paymentResult=null;
    if(state.modalType==="invoice") invoiceResult=await saveInvoice(fd);
    if(state.modalType==="quote") quoteResult=await saveQuote(fd);
    if(state.modalType==="payment") paymentResult=await savePayment(fd);
    if(state.modalType==="client") await saveClient(fd);
    if(state.modalType==="service") await saveService(fd);
    if(state.modalType==="addon") await saveAddon(fd);
    if(state.modalType==="supply") await saveSupply(fd);
    if(state.modalType==="supplyAdjust") await saveSupplyAdjust(fd);
    if(state.modalType==="mileage") await saveMileage(fd);
    if(state.modalType==="job") await saveJob(fd);
    if(state.modalType==="team") await saveTeam(fd);
    if(state.modalType==="businessProfile") await saveBusinessProfile(fd);
    if(state.modalType==="invite") await saveInvite(fd);
    if(state.modalType==="startTimer") await saveStartTimer(fd);
    modal.hidden=true;
    await loadCoreData();
    showToast(
      invoiceResult?.sent
        ? "Invoice emailed to client"
        : quoteResult?.sent
          ? "Quote emailed to customer"
          : paymentResult?.status==="paid" && paymentResult?.confirmation_queued
          ? "Payment confirmed · confirmation email queued"
          : paymentResult
            ? "Payment recorded"
            : "Saved"
    );
  }catch(err){
    showToast(err.message || "Could not save");
  }finally{
    setBusy(button,false);
  }
});

async function saveLead(fd){
  const preferred=fd.get("preferred_contact");
  const phone=String(fd.get("phone")||"").trim();
  if((preferred==="text"||preferred==="whatsapp")&&!phone) throw new Error("Phone is required for Text or WhatsApp.");
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    email:String(fd.get("email")).trim(),
    phone:phone||null,
    preferred_contact:preferred,
    source:String(fd.get("source")||"").trim()||null,
    status:fd.get("status"),
    service_interest:String(fd.get("service_interest")||"").trim()||null,
    address:String(fd.get("address")||"").trim()||null,
    notes:String(fd.get("notes")||"").trim()||null,
    updated_at:new Date().toISOString()
  };
  const query=state.modalId
    ? supabase.from("leads").update(payload).eq("id",state.modalId)
    : supabase.from("leads").insert(payload);
  const {error}=await query; if(error) throw error;
}

async function saveInvoice(fd){
  const amount=Number(fd.get("amount")||0);
  if(!Number.isFinite(amount) || amount<=0) throw new Error("Invoice amount must be greater than $0.");

  const requestedStatus=String(fd.get("status")||"draft");
  const existing=state.modalId ? state.invoices.find(i=>i.id===state.modalId) : null;
  const shouldSend=requestedStatus==="sent" && existing?.status!=="sent";

  // Never mark a new invoice as sent until the email workflow succeeds.
  const payload={
    business_id:state.business.id,
    client_id:fd.get("client_id"),
    status:shouldSend?"draft":requestedStatus,
    subtotal:amount,total:amount,
    due_at:fd.get("due_date")?new Date(fd.get("due_date")+"T23:59:59").toISOString():null,
    updated_at:new Date().toISOString()
  };

  let invoiceId=state.modalId;
  if(invoiceId){
    const {error}=await supabase.from("invoices").update(payload).eq("id",invoiceId);
    if(error) throw error;
    const item=state.invoices.find(i=>i.id===invoiceId)?.invoice_items?.[0];
    const itemPayload={description:String(fd.get("description")).trim(),quantity:1,unit_price:amount,line_total:amount};
    if(item){
      const {error:itemErr}=await supabase.from("invoice_items").update(itemPayload).eq("id",item.id);
      if(itemErr) throw itemErr;
    }else{
      const {error:itemErr}=await supabase.from("invoice_items").insert({invoice_id:invoiceId,...itemPayload});
      if(itemErr) throw itemErr;
    }
  }else{
    const {data,error}=await supabase.from("invoices").insert(payload).select("id").single();
    if(error) throw error;
    invoiceId=data.id;
    const {error:itemErr}=await supabase.from("invoice_items").insert({
      invoice_id:invoiceId,
      description:String(fd.get("description")).trim(),
      quantity:1,
      unit_price:amount,
      line_total:amount
    });
    if(itemErr) throw itemErr;
  }

  if(shouldSend){
    const base=window.location.origin+window.location.pathname;
    const {data,error}=await supabase.rpc("send_invoice_to_client",{
      p_invoice_id:invoiceId,
      p_public_base_url:base
    });
    if(error) throw error;
    return {sent:true,url:data?.url||null};
  }

  return {sent:false};
}

function openPaymentForm(invoiceId){
  const inv=state.invoices.find(i=>i.id===invoiceId);
  if(!inv) return;
  const remaining=Math.max(0,Number(inv.total||0)-invoicePaidAmount(inv));
  const chosen=String(inv.customer_payment_method||"").toLowerCase();
  const methodLabel=paymentMethodLabel(chosen);
  state.modalType="payment";state.modalId=invoiceId;
  modalHeader("PAYMENT","Record payment",`Invoice #${inv.invoice_number||String(inv.id).slice(0,6)} · ${money(remaining)} remaining`);
  entityForm.innerHTML=`
    ${methodLabel?`<p class="helper"><strong>Customer chose: ${escapeHtml(methodLabel)}</strong></p>`:""}
    <div class="form-grid">
      <label>Amount<input name="amount" type="number" min="0.01" step="0.01" max="${remaining}" required value="${remaining}"></label>
      <label>Method<select name="method">
        ${(state.business.payment_methods||paymentMethodsForCountry(state.business?.country_code)).map(method=>`<option value="${escapeHtml(method)}" ${chosen===method?"selected":""}>${escapeHtml(paymentMethodLabel(method))}</option>`).join("")}
      </select></label>
      <label class="full">Note / reference<textarea name="note" placeholder="Optional reference or payment note"></textarea></label>
    </div>${formSubmit("Confirm payment")}`;
  modal.hidden=false;
}
async function savePayment(fd){
  const {data,error}=await supabase.rpc("record_invoice_payment",{
    p_invoice_id:state.modalId,
    p_amount:Number(fd.get("amount")),
    p_method:fd.get("method"),
    p_note:String(fd.get("note")||"").trim()||null
  });
  if(error) throw error;
  return data||null;
}

async function saveClient(fd){
  const preferred=fd.get("preferred_contact");
  const phone=String(fd.get("phone")||"").trim();
  if((preferred==="text"||preferred==="whatsapp")&&!phone) throw new Error("Phone is required for Text or WhatsApp.");
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    email:String(fd.get("email")).trim(),
    phone:phone||null,
    preferred_contact:preferred,
    address_line1:String(fd.get("address_line1")||"").trim()||null,
    city:String(fd.get("city")||"").trim()||null,
    state:String(fd.get("state")||"").trim()||null,
    postal_code:String(fd.get("postal_code")||"").trim()||null,
    notes:String(fd.get("notes")||"").trim()||null
  };
  const query=state.modalId
    ? supabase.from("clients").update(payload).eq("id",state.modalId)
    : supabase.from("clients").insert(payload);
  const {error}=await query; if(error) throw error;
}

async function saveService(fd){
  let pricing=fd.get("pricing_type");
  const priceRaw=String(fd.get("base_price")||"").trim();
  const numericPrice=priceRaw===""?null:Number(priceRaw);
  if(pricing!=="quote" && (!Number.isFinite(numericPrice) || numericPrice<=0)){
    pricing="quote";
    showToast("No price entered — service saved as Quote Required");
  }
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    description:String(fd.get("description")||"").trim()||null,
    pricing_type:pricing,
    base_price:pricing==="quote"?null:numericPrice,
    default_duration_minutes:Number(fd.get("default_duration_minutes")),
    active:fd.get("active")==="on"
  };
  const query=state.modalId
    ? supabase.from("services").update(payload).eq("id",state.modalId)
    : supabase.from("services").insert(payload);
  const {error}=await query; if(error) throw error;
}

async function saveAddon(fd){
  const payload={
    business_id:state.business.id,
    service_id:fd.get("service_id")||null,
    name:String(fd.get("name")).trim(),
    price:Number(fd.get("price")||0),
    extra_duration_minutes:Number(fd.get("extra_duration_minutes")||0),
    active:fd.get("active")==="on",
    updated_at:new Date().toISOString()
  };
  const query=state.modalId
    ? supabase.from("service_addons").update(payload).eq("id",state.modalId)
    : supabase.from("service_addons").insert(payload);
  const {error}=await query;
  if(error) throw error;
}

async function saveSupply(fd){
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    category:String(fd.get("category")||"").trim()||null,
    unit:String(fd.get("unit")||"item").trim()||"item",
    quantity:Number(fd.get("quantity")||0),
    reorder_level:Number(fd.get("reorder_level")||0),
    cost_per_unit:String(fd.get("cost_per_unit")||"").trim()===""?null:Number(fd.get("cost_per_unit")),
    preferred_vendor:String(fd.get("preferred_vendor")||"").trim()||null,
    notes:String(fd.get("notes")||"").trim()||null,
    active:fd.get("active")==="on",
    updated_at:new Date().toISOString()
  };
  const query=state.modalId
    ? supabase.from("supplies").update(payload).eq("id",state.modalId)
    : supabase.from("supplies").insert(payload);
  const {error}=await query;
  if(error) throw error;
}

function openSupplyAdjustForm(id,mode){
  const record=state.supplies.find(x=>x.id===id);
  if(!record) return;
  state.modalType="supplyAdjust";
  state.modalId=id;
  const restock=mode==="restock";
  modalHeader("SUPPLIES",restock?"Restock supply":"Record supply used",`${record.name} · current quantity: ${record.quantity} ${record.unit}`);
  entityForm.innerHTML=`
    <div class="form-grid">
      <label>Amount<input name="amount" type="number" min="0.01" step="0.01" required></label>
      <input type="hidden" name="mode" value="${restock?"restock":"usage"}">
      <label class="full">Note<textarea name="note" placeholder="${restock?"Purchased / restocked":"Optional job or usage note"}"></textarea></label>
    </div>${formSubmit(restock?"Add stock":"Record usage")}`;
  modal.hidden=false;
}

async function saveSupplyAdjust(fd){
  const amount=Math.abs(Number(fd.get("amount")||0));
  if(!amount) throw new Error("Enter an amount greater than 0.");
  const mode=fd.get("mode");
  const {error}=await supabase.rpc("adjust_supply_quantity",{
    p_supply_id:state.modalId,
    p_change:mode==="restock"?amount:-amount,
    p_reason:mode,
    p_note:String(fd.get("note")||"").trim()||null,
    p_job_id:null
  });
  if(error) throw error;
}

async function saveMileage(fd){
  const payload={
    business_id:state.business.id,
    job_id:fd.get("job_id")||null,
    log_date:fd.get("log_date"),
    miles:distanceToStoredMiles(fd.get("distance")),
    trip_type:String(fd.get("trip_type")||"residential"),
    extra_job_type:String(fd.get("extra_job_type")||"").trim()||null,
    from_location:String(fd.get("from_location")||"").trim()||null,
    to_location:String(fd.get("to_location")||"").trim()||null,
    notes:String(fd.get("notes")||"").trim()||null
  };
  if(payload.miles<=0) throw new Error(tr("Enter a distance greater than 0."));
  if(!payload.from_location || !payload.to_location) throw new Error(tr("Complete From and To."));
  if(payload.trip_type==="extra" && !payload.extra_job_type) throw new Error(tr("Choose the extra job type."));
  const {error}=await supabase.from("mileage_logs").insert(payload);
  if(error) throw error;
}

async function saveJob(fd){
  const startsIso=businessLocalDateTimeToIso(fd.get("date"),fd.get("time"));
  const payload={
    business_id:state.business.id,
    client_id:fd.get("client_id")||null,
    service_id:fd.get("service_id")||null,
    status:fd.get("status"),
    service_address:String(fd.get("service_address")).trim(),
    starts_at:startsIso,
    duration_minutes:Number(fd.get("duration_minutes")),
    travel_buffer_before_minutes:Number(fd.get("travel_buffer")||0),
    travel_buffer_after_minutes:Number(fd.get("travel_buffer")||0),
    notes:String(fd.get("notes")||"").trim()||null
  };

  let result;
  if(state.modalId){
    result=await supabase.from("jobs").update(payload).eq("id",state.modalId).select("id").single();
  }else{
    result=await supabase.from("jobs").insert(payload).select("id").single();
  }
  if(result.error) throw result.error;

  const {error:assignmentError}=await supabase.rpc("set_primary_job_assignment",{
    p_job_id:result.data.id,
    p_team_member_id:fd.get("team_member_id")||null
  });
  if(assignmentError) throw assignmentError;
}

async function saveQuote(fd){
  const price=Number(fd.get("price")||0);
  if(!Number.isFinite(price) || price<=0) throw new Error("Quote price must be greater than 0.");

  const requestedStatus=String(fd.get("status")||"draft");
  const current=state.modalId ? state.quotes.find(q=>q.id===state.modalId) : null;
  const shouldSend=requestedStatus==="sent" && current?.status!=="sent";

  // Do not label a quote as sent until its customer email workflow succeeds.
  const payload={
    business_id:state.business.id,
    customer_name:String(fd.get("customer_name")).trim(),
    customer_email:String(fd.get("customer_email")).trim(),
    customer_phone:String(fd.get("customer_phone")||"").trim()||null,
    service_address:String(fd.get("service_address")).trim(),
    preferred_date:fd.get("preferred_date"),
    preferred_time:fd.get("preferred_time"),
    subtotal:price,
    total:price,
    status:shouldSend?"draft":requestedStatus,
    notes:String(fd.get("notes")||"").trim()||null
  };

  let quoteId=state.modalId;
  if(quoteId){
    const {error}=await supabase.from("quotes").update(payload).eq("id",quoteId);
    if(error) throw error;
    const existingItem=state.quotes.find(q=>q.id===quoteId)?.quote_items?.[0];
    const itemPayload={
      service_id:fd.get("service_id"),
      description:state.services.find(s=>s.id===fd.get("service_id"))?.name||"Cleaning service",
      quantity:1,
      unit_price:price,
      line_total:price
    };
    if(existingItem){
      const {error:itemErr}=await supabase.from("quote_items").update(itemPayload).eq("id",existingItem.id);
      if(itemErr) throw itemErr;
    }else{
      const {error:itemErr}=await supabase.from("quote_items").insert({quote_id:quoteId,...itemPayload});
      if(itemErr) throw itemErr;
    }
  }else{
    const {data,error}=await supabase.from("quotes").insert(payload).select("id").single();
    if(error) throw error;
    quoteId=data.id;
    const service=state.services.find(s=>s.id===fd.get("service_id"));
    const {error:itemErr}=await supabase.from("quote_items").insert({
      quote_id:quoteId,
      service_id:fd.get("service_id"),
      description:service?.name||"Cleaning service",
      quantity:1,
      unit_price:price,
      line_total:price
    });
    if(itemErr) throw itemErr;
  }

  if(shouldSend){
    const base=window.location.origin+window.location.pathname;
    const {data,error}=await supabase.rpc("create_quote_customer_link",{
      p_quote_id:quoteId,
      p_public_base_url:base
    });
    if(error) throw error;
    return {sent:true,url:data?.url||null};
  }

  return {sent:false};
}

async function startTimeEntry(){
  if(state.timeEntries.some(t=>!t.clocked_out_at)){ showToast("A timer is already running"); return; }
  const eligible=state.jobs.filter(j=>!["completed","canceled","no_show"].includes(j.status));
  if(!eligible.length){ showToast("Schedule a job first"); return; }

  state.modalType="startTimer";state.modalId=null;
  modalHeader("TIME TRACKING","Start timer","Choose the job you are starting now.");
  entityForm.innerHTML=`
    <div class="form-grid">
      <label class="full">Job<select name="job_id" required><option value="">Choose a job</option>${eligible.map(j=>`<option value="${j.id}">${escapeHtml(j.clients?.name||j.service_address||"Cleaning job")} · ${escapeHtml(formatDateTime(j.starts_at))}</option>`).join("")}</select></label>
    </div>${formSubmit("Start timer")}`;
  modal.hidden=false;
}
async function saveStartTimer(fd){
  const jobId=fd.get("job_id");
  const {error}=await supabase.from("job_time_entries").insert({
    business_id:state.business.id,
    job_id:jobId,
    team_member_id:state.business.team_member_id||null,
    clocked_in_at:new Date().toISOString()
  });
  if(error) throw error;
  if(state.business.role==="coworker"){
    await supabase.rpc("coworker_set_job_status",{p_job_id:jobId,p_status:"in_progress"});
  }else{
    await supabase.from("jobs").update({status:"in_progress"}).eq("id",jobId);
  }
}
async function finishTimeEntry(id){
  if(!id) throw new Error(langPick("Active timer not found.","No encontramos ese temporizador activo.","Temporizador ativo não encontrado.","Minuteur actif introuvable."));
  const entry=state.timeEntries.find(t=>t.id===id);
  if(entry?.clocked_out_at) return entry;

  const result=await withTimeout(
    supabase.rpc("finish_job_time_entry",{p_entry_id:id}),
    langPick("Finishing timer","Finalizando temporizador","Finalizando cronômetro","Arrêt du minuteur"),
    10000
  );
  const {data,error}=result||{};
  if(error) throw error;

  let finished=data||null;
  if(!finished?.clocked_out_at){
    const {data:verified,error:verifyError}=await supabase
      .from("job_time_entries")
      .select("id,clocked_out_at,minutes_worked")
      .eq("id",id)
      .eq("business_id",state.business.id)
      .maybeSingle();
    if(verifyError) throw verifyError;
    finished=verified||finished;
  }

  if(!finished?.clocked_out_at){
    throw new Error(langPick("Could not confirm that the timer stopped.","No se pudo confirmar el cierre del temporizador.","Não foi possível confirmar o encerramento do cronômetro.","Impossible de confirmer l’arrêt du minuteur."));
  }

  if(entry){
    entry.clocked_out_at=finished.clocked_out_at;
    entry.minutes_worked=finished.minutes_worked;
  }
  await loadCoreData();
  renderOperations();
  return finished;
}

async function deleteBusinessRecord(type,id){
  if(!state.business || !["owner","admin"].includes(state.business.role)){
    throw new Error(langPick(
      "Only Owner or Admin can delete records.",
      "Solo Owner o Admin puede borrar registros.",
      "Somente Owner ou Admin pode excluir registros.",
      "Seul le propriétaire ou un administrateur peut supprimer des données."
    ));
  }

  const names={
    client:langPick("client","cliente","cliente","client"),
    lead:langPick("lead","lead","lead","prospect"),
    quote:langPick("quote","cotización","orçamento","devis"),
    invoice:langPick("invoice","factura","fatura","facture")
  };

  let message=langPick(
    "Permanently delete this "+names[type]+"? This cannot be undone.",
    "¿Borrar permanentemente este "+names[type]+"? Esta acción no se puede deshacer.",
    "Excluir permanentemente este "+names[type]+"? Esta ação não pode ser desfeita.",
    "Supprimer définitivement ce "+names[type]+" ? Cette action est irréversible."
  );

  if(type==="client"){
    message=langPick(
      "Permanently delete this client? Related jobs and invoices will also be deleted. This cannot be undone.",
      "¿Borrar permanentemente este cliente? También se borrarán sus trabajos y facturas relacionadas. Esta acción no se puede deshacer.",
      "Excluir permanentemente este cliente? Os trabalhos e faturas relacionados também serão excluídos. Esta ação não pode ser desfeita.",
      "Supprimer définitivement ce client ? Les travaux et factures associés seront également supprimés. Cette action est irréversible."
    );
  }else if(type==="invoice"){
    message=langPick(
      "Permanently delete this invoice? Its payments, items, public link and related disputes will also be deleted.",
      "¿Borrar permanentemente esta factura? También se borrarán sus pagos, items, link público y disputas relacionadas.",
      "Excluir permanentemente esta fatura? Pagamentos, itens, link público e contestações relacionadas também serão excluídos.",
      "Supprimer définitivement cette facture ? Ses paiements, éléments, lien public et litiges associés seront également supprimés."
    );
  }else if(type==="quote"){
    message=langPick(
      "Permanently delete this quote? Its items, public link and related disputes will also be deleted.",
      "¿Borrar permanentemente esta cotización? Sus items, link público y disputas relacionadas también se borrarán.",
      "Excluir permanentemente este orçamento? Itens, link público e contestações relacionadas também serão excluídos.",
      "Supprimer définitivement ce devis ? Ses éléments, lien public et litiges associés seront également supprimés."
    );
  }

  if(!window.confirm(message)) return false;

  const {data,error}=await supabase.rpc("delete_business_record",{
    p_record_type:type,
    p_record_id:id
  });
  if(error) throw error;

  await loadCoreData();
  showToast(langPick("Deleted","Borrado","Excluído","Supprimé"));
  return data||true;
}

document.addEventListener("click",async e=>{
  const inquiryClientBtn=e.target.closest("[data-inquiry-open-client]");
  if(inquiryClientBtn){
    modal.hidden=true;
    openView("clients");
    setTimeout(()=>openEntityForm("client",inquiryClientBtn.dataset.inquiryOpenClient),80);
    return;
  }

  const inquiryLeadBtn=e.target.closest("[data-inquiry-open-lead]");
  if(inquiryLeadBtn){
    modal.hidden=true;
    openView("leads");
    setTimeout(()=>openEntityForm("lead",inquiryLeadBtn.dataset.inquiryOpenLead),80);
    return;
  }

  const refreshActivityBtn=e.target.closest("[data-refresh-platform-activity]");
  if(refreshActivityBtn){
    const original=refreshActivityBtn.textContent;
    refreshActivityBtn.disabled=true;
    refreshActivityBtn.textContent="Refreshing…";
    try{
      await loadPlatformAdmin();
      showToast("Activity refreshed");
    }catch(err){
      showToast(err?.message||"Could not refresh activity");
    }finally{
      refreshActivityBtn.disabled=false;
      refreshActivityBtn.textContent=original;
    }
    return;
  }

  const archiveActivityBtn=e.target.closest("[data-archive-activity]");
  if(archiveActivityBtn){
    const kind=archiveActivityBtn.dataset.archiveActivity;
    const userId=archiveActivityBtn.dataset.archiveUser||null;
    const visitorId=archiveActivityBtn.dataset.archiveVisitor||null;
    const archiveLabel=archiveActivityBtn.dataset.archiveLabel||"Archive";
    archiveActivityBtn.disabled=true;
    archiveActivityBtn.textContent=archiveLabel==="Clear"?"Clearing…":"Archiving…";
    try{
      const {error}=await supabase.rpc("platform_archive_activity",{
        p_kind:kind,
        p_user_id:userId||null,
        p_visitor_id:visitorId||null
      });
      if(error) throw error;
      await loadPlatformAdmin();
      showToast(archiveLabel==="Clear"?"Internal activity cleared":"Activity archived");
    }catch(err){
      archiveActivityBtn.disabled=false;
      archiveActivityBtn.textContent=archiveLabel;
      showToast(err?.message||(archiveLabel==="Clear"?"Could not clear activity":"Could not archive activity"));
    }
    return;
  }

  const presenceBtn=e.target.closest("#presenceInstagramBtn,#presenceFacebookBtn,#presenceGoogleBtn,#presenceBookingBtn");
  if(presenceBtn){
    if(presenceBtn.id==="presenceBookingBtn"){
      const url=$("#bookingUrl")?.href;
      if(url && url!=="#") window.open(url,"_blank","noopener");
      else openView("booking");
      return;
    }
    if(presenceBtn.id==="presenceGoogleBtn"){
      const url=String(presenceBtn.dataset.url||"").trim();
      if(url) window.open(url,"_blank","noopener");
      else openView("settings");
      return;
    }
    const url=String(presenceBtn.dataset.url||"").trim();
    if(url){
      window.open(url,"_blank","noopener");
    }else{
      await openBusinessProfileForm();
    }
    return;
  }

  const create=e.target.closest("[data-create]");
  const action=e.target.closest("[data-action]");
  const edit=e.target.closest("[data-edit]");
  const teamCreate=e.target.closest("[data-team-create]");
  const teamEdit=e.target.closest("[data-team-edit]");
  if(teamCreate){ openTeamForm(); return; }
  if(teamEdit){ openTeamForm(teamEdit.dataset.teamEdit); return; }
  const teamMessage=e.target.closest("[data-team-message]");
  if(teamMessage){
    state.activeTeamMessageMemberId=teamMessage.dataset.teamMessage;
    const select=$("#teamMessageWorkerSelect"); if(select) select.value=state.activeTeamMessageMemberId;
    await loadTeamMessageThread(state.activeTeamMessageMemberId,{markRead:true}).catch(err=>showToast(err.message||"Could not load messages"));
    $("#teamMessageCenter")?.scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }

  const deleteRecordBtn=e.target.closest("[data-delete-record]");
  if(deleteRecordBtn){
    const type=deleteRecordBtn.dataset.deleteRecord;
    const id=deleteRecordBtn.dataset.id;
    setBusy(deleteRecordBtn,true,langPick("Deleting…","Borrando…","Excluindo…","Suppression…"));
    try{
      await deleteBusinessRecord(type,id);
    }catch(err){
      showToast(err?.message||langPick("Could not delete","No se pudo borrar","Não foi possível excluir","Impossible de supprimer"));
    }finally{
      if(document.body.contains(deleteRecordBtn)) setBusy(deleteRecordBtn,false);
    }
    return;
  }

  const bookingPagePromo=e.target.closest("[data-booking-page-promo]");
  if(bookingPagePromo){
    setBusy(bookingPagePromo,true,"Applying…");
    try{
      const businessId=bookingPagePromo.dataset.bookingPagePromo;
      const {error}=await supabase.rpc("platform_apply_booking_page_trial_promo",{p_business_id:businessId});
      if(error) throw error;

      const {error:notifyError}=await supabase.functions.invoke("notify-trial-start",{body:{business_id:businessId},headers:{Authorization:`Bearer ${state.session?.access_token||""}`}});
      if(notifyError) throw notifyError;

      await loadPlatformAdmin();
      showToast("Booking Page promo applied · 2 months free");
    }catch(err){
      showToast(err?.message||"Could not apply the Booking Page 2-month promo");
    }finally{
      setBusy(bookingPagePromo,false);
    }
    return;
  }
  const workerLinkBtn=e.target.closest("[data-worker-link]");
  if(workerLinkBtn){
    try{await createWorkerLink(workerLinkBtn.dataset.workerLink);}
    catch(err){showToast(err.message||"Could not create worker link");}
    return;
  }

  const workerRevoke=e.target.closest("[data-worker-revoke]");
  if(workerRevoke){
    const {error}=await supabase.rpc("revoke_worker_access_link",{p_team_member_id:workerRevoke.dataset.workerRevoke});
    if(error) showToast(error.message); else showToast("Worker link revoked");
    return;
  }

  const workerStatus=e.target.closest("[data-worker-status-link]");
  if(workerStatus){
    const token=localStorage.getItem("tle_worker_device_token");
    const {error}=await supabase.rpc("worker_portal_set_job_status",{p_token:token,p_job_id:workerStatus.dataset.workerStatusLink,p_status:workerStatus.dataset.status});
    if(error) showToast(error.message); else {await refreshWorkerPortal();showToast("Job updated");}
    return;
  }

  const workerTimeStart=e.target.closest("[data-worker-time-start]");
  if(workerTimeStart){
    const token=localStorage.getItem("tle_worker_device_token");
    const {error}=await supabase.rpc("worker_portal_start_time",{p_token:token,p_job_id:workerTimeStart.dataset.workerTimeStart});
    if(error) showToast(error.message); else {await refreshWorkerPortal();showToast("Timer started");}
    return;
  }

  const workerTimeStop=e.target.closest("[data-worker-time-stop]");
  if(workerTimeStop){
    const token=localStorage.getItem("tle_worker_device_token");
    setBusy(workerTimeStop,true,langPick("Finishing…","Finalizando…","Finalizando…","Arrêt…"));
    try{
      const result=await withTimeout(
        supabase.rpc("worker_portal_stop_time",{p_token:token,p_entry_id:workerTimeStop.dataset.workerTimeStop}),
        langPick("Finishing timer","Finalizando temporizador","Finalizando cronômetro","Arrêt du minuteur"),
        10000
      );
      if(result?.error) throw result.error;
      await refreshWorkerPortal();
      showToast(langPick("Timer finished","Temporizador finalizado","Cronômetro encerrado","Minuteur arrêté"));
    }catch(err){
      showToast(err?.message||langPick("Could not finish timer","No se pudo finalizar el temporizador","Não foi possível encerrar o cronômetro","Impossible d’arrêter le minuteur"));
    }finally{
      if(document.body.contains(workerTimeStop)) setBusy(workerTimeStop,false);
    }
    return;
  }

  const finishTimeBtn=e.target.closest("[data-finish-time]");
  if(finishTimeBtn){
    const id=finishTimeBtn.dataset.finishTime;
    setBusy(finishTimeBtn,true,langPick("Finishing…","Finalizando…","Finalizando…","Arrêt…"));
    try{
      await finishTimeEntry(id);
      showToast(langPick("Timer finished","Temporizador finalizado","Cronômetro encerrado","Minuteur arrêté"));
    }catch(err){
      showToast(err?.message||langPick("Could not finish timer","No se pudo finalizar el temporizador","Não foi possível encerrar o cronômetro","Impossible d’arrêter le minuteur"));
    }finally{
      if(document.body.contains(finishTimeBtn)) setBusy(finishTimeBtn,false);
    }
    return;
  }

  const hideTimeEntry=e.target.closest("[data-hide-time-entry]");
  if(hideTimeEntry){
    const id=hideTimeEntry.dataset.hideTimeEntry;
    setBusy(hideTimeEntry,true,tr("Removing…"));
    try{
      const {error}=await supabase.from("job_time_entries")
        .update({hidden_from_time_tracking:true})
        .eq("id",id)
        .eq("business_id",state.business.id);
      if(error) throw error;
      const entry=state.timeEntries.find(t=>t.id===id);
      if(entry) entry.hidden_from_time_tracking=true;
      renderOperations();
      showToast(tr("Removed from Time Tracking only."));
    }catch(err){
      showToast(err?.message||tr("Could not remove it from this list."));
    }
    return;
  }

  const workerMileage=e.target.closest("[data-worker-mileage]");
  if(workerMileage){
    const workerUnit=state.workerPortal?.business?.distance_unit==="km"?"km":"mi";
    state.modalType="workerMileage";
    state.modalId=workerMileage.dataset.workerMileage;
    modalHeader(
      langPick("MILEAGE","MILLAJE","QUILOMETRAGEM","KILOMÉTRAGE"),
      langPick("Log drive","Registrar viaje","Registrar trajeto","Enregistrer le trajet"),
      langPick(
        "Add the distance driven for this assigned job.",
        "Agrega la distancia recorrida para este trabajo asignado.",
        "Adicione a distância percorrida para este trabalho atribuído.",
        "Ajoutez la distance parcourue pour ce travail attribué."
      )
    );
    entityForm.innerHTML=`
      <div class="form-grid">
        <label class="full">${workerUnit==="km"
          ? langPick("Kilometers","Kilómetros","Quilômetros","Kilomètres")
          : langPick("Miles","Millas","Milhas","Miles")}
          <input name="distance" type="number" min="0.1" step="0.1" inputmode="decimal" required placeholder="0.0">
        </label>
        <label class="full">${langPick("Note (optional)","Nota (opcional)","Nota (opcional)","Note (facultative)")}
          <input name="notes" maxlength="240" placeholder="${langPick("Example: supply stop","Ej. parada de suministros","Ex.: parada para materiais","Ex. : arrêt fournitures")}">
        </label>
      </div>
      ${formSubmit(langPick("Save mileage","Guardar millaje","Salvar quilometragem","Enregistrer"))}`;
    modal.hidden=false;
    requestAnimationFrame(()=>entityForm.querySelector('[name="distance"]')?.focus());
    return;
  }

  const copyWorker=e.target.closest("[data-copy-worker-link]");
  if(copyWorker && state.currentWorkerLink){
    await copyText(state.currentWorkerLink);
    return;
  }

  const nativeShare=e.target.closest("[data-native-share-worker-link]");
  if(nativeShare && state.currentWorkerLink){
    if(navigator.share){
      try{await navigator.share({title:"Worker access",text:"Open your assigned cleaning jobs here.",url:state.currentWorkerLink});}catch{}
    }else{
      await copyText(state.currentWorkerLink);
    }
    return;
  }
  if(create){ openEntityForm(create.dataset.create); return; }
  if(action){
    const type=action.dataset.action;
    if(state.business.role==="coworker"){ showToast("This action is owner/admin only"); return; }
    if(["lead","client","service","addon","supply","mileage","job","quote","invoice"].includes(type)) openEntityForm(type);
    else openGeneric(type);
    return;
  }
  if(edit){ openEntityForm(edit.dataset.edit,edit.dataset.id); return; }

  const editLead=e.target.closest("[data-edit-lead]");
  if(editLead){ openEntityForm("lead",editLead.dataset.editLead); return; }
  const archiveLead=e.target.closest("[data-archive-lead]");
  if(archiveLead){
    const {error}=await supabase.from("leads").update({archived_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",archiveLead.dataset.archiveLead);
    if(error) showToast(error.message); else {await loadCoreData();showToast("Lead archived");}
    return;
  }
  const leadQuote=e.target.closest("[data-lead-to-quote]");
  if(leadQuote){
    const lead=state.leads.find(l=>l.id===leadQuote.dataset.leadToQuote);
    openEntityForm("quote");
    setTimeout(()=>{
      [["customer_name",lead?.name],["customer_email",lead?.email],["customer_phone",lead?.phone],["service_address",lead?.address]].forEach(([n,v])=>{const el=entityForm.querySelector(`[name="${n}"]`);if(el&&v)el.value=v;});
    },0);
    return;
  }

  const resolveDispute=e.target.closest("[data-resolve-dispute]");
  if(resolveDispute){
    const {error}=await supabase.from("customer_disputes")
      .update({status:"resolved",resolved_at:new Date().toISOString(),updated_at:new Date().toISOString()})
      .eq("id",resolveDispute.dataset.resolveDispute);
    if(error) showToast(error.message);
    else {await loadCoreData();showToast("Dispute resolved");}
    return;
  }

  const editInvoice=e.target.closest("[data-edit-invoice]");
  if(editInvoice){ openEntityForm("invoice",editInvoice.dataset.editInvoice); return; }
  const sendInvoice=e.target.closest("[data-send-invoice]");
  if(sendInvoice){
    sendInvoice.disabled=true;
    const original=sendInvoice.textContent;
    sendInvoice.textContent="Sending…";
    const base=window.location.origin+window.location.pathname;
    const {data,error}=await supabase.rpc("send_invoice_to_client",{
      p_invoice_id:sendInvoice.dataset.sendInvoice,
      p_public_base_url:base
    });
    if(error){
      showToast(error.message);
      sendInvoice.disabled=false;
      sendInvoice.textContent=original;
    }else{
      if(data?.url) await copyText(data.url);
      await loadCoreData();
      showToast("Invoice emailed to client · view link copied");
    }
    return;
  }
  const recordPayment=e.target.closest("[data-record-payment]");
  if(recordPayment){ openPaymentForm(recordPayment.dataset.recordPayment); return; }

  const addAddon=e.target.closest("[data-add-addon-for]");
  if(addAddon){
    openEntityForm("addon");
    setTimeout(()=>{
      const select=entityForm.querySelector('[name="service_id"]');
      if(select) select.value=addAddon.dataset.addAddonFor;
    },0);
    return;
  }

  const editAddon=e.target.closest("[data-edit-addon]");
  if(editAddon){ openEntityForm("addon",editAddon.dataset.editAddon); return; }

  const toggleAddon=e.target.closest("[data-toggle-addon]");
  if(toggleAddon){
    const addon=state.serviceAddons.find(a=>a.id===toggleAddon.dataset.toggleAddon);
    const {error}=await supabase.from("service_addons").update({active:!addon.active,updated_at:new Date().toISOString()}).eq("id",addon.id);
    if(error) showToast(error.message); else {await loadCoreData();showToast(addon.active?"Add-on turned off":"Add-on turned on");}
    return;
  }

  const editSupply=e.target.closest("[data-edit-supply]");
  if(editSupply){ openEntityForm("supply",editSupply.dataset.editSupply); return; }

  const adjustSupply=e.target.closest("[data-supply-adjust]");
  if(adjustSupply){ openSupplyAdjustForm(adjustSupply.dataset.supplyAdjust,adjustSupply.dataset.mode); return; }

  const toggleSupply=e.target.closest("[data-toggle-supply]");
  if(toggleSupply){
    const supply=state.supplies.find(s=>s.id===toggleSupply.dataset.toggleSupply);
    const {error}=await supabase.from("supplies").update({active:!supply.active,updated_at:new Date().toISOString()}).eq("id",supply.id);
    if(error) showToast(error.message); else {await loadCoreData();showToast(supply.active?"Supply archived":"Supply restored");}
    return;
  }
  if(e.target.closest("[data-modal-cancel]")){ modal.hidden=true; return; }

  const archive=e.target.closest("[data-archive-client]");
  if(archive){
    if(!confirm("Archive this client? Their record will be hidden, not permanently deleted.")) return;
    const {error}=await supabase.from("clients").update({archived_at:new Date().toISOString()}).eq("id",archive.dataset.archiveClient);
    if(error) showToast(error.message); else {await loadCoreData();showToast("Client archived");}
    return;
  }
  const toggle=e.target.closest("[data-toggle-service]");
  if(toggle){
    const service=state.services.find(s=>s.id===toggle.dataset.toggleService);
    const {error}=await supabase.from("services").update({active:!service.active}).eq("id",service.id);
    if(error) showToast(error.message); else {await loadCoreData();showToast(service.active?"Service deactivated":"Service activated");}
    return;
  }
  const cancel=e.target.closest("[data-cancel-job]");
  if(cancel){
    if(!confirm("Cancel this job?")) return;
    const {error}=await supabase.from("jobs").update({status:"canceled"}).eq("id",cancel.dataset.cancelJob);
    if(error) showToast(error.message); else {await loadCoreData();showToast("Job canceled");}
    return;
  }
  const sendCustomerQuote=e.target.closest("[data-send-customer-quote]");
  if(sendCustomerQuote){
    sendCustomerQuote.disabled=true;
    const original=sendCustomerQuote.textContent;
    sendCustomerQuote.textContent="Sending…";
    const base=window.location.origin+window.location.pathname;
    const {data,error}=await supabase.rpc("create_quote_customer_link",{
      p_quote_id:sendCustomerQuote.dataset.sendCustomerQuote,
      p_public_base_url:base
    });
    if(error){
      showToast(error.message);
      sendCustomerQuote.disabled=false;
      sendCustomerQuote.textContent=original;
    }else{
      if(data?.url) await copyText(data.url);
      await loadCoreData();
      showToast("Quote emailed to customer · approval link copied");
    }
    return;
  }
  const coworkerStatus=e.target.closest("[data-coworker-status]");
  if(coworkerStatus){
    const {error}=await supabase.rpc("coworker_set_job_status",{p_job_id:coworkerStatus.dataset.coworkerStatus,p_status:coworkerStatus.dataset.status});
    if(error) showToast(error.message); else {await loadCoreData();showToast("Job status updated");}
    return;
  }

  const removeMember=e.target.closest("[data-remove-member]");
  if(removeMember){
    if(!confirm("Remove this person's app access? Their operational records will remain.")) return;
    const {error}=await supabase.from("business_members").delete().eq("id",removeMember.dataset.removeMember);
    if(error) showToast(error.message); else {await loadOwnerAdmin();showToast("Access removed");}
    return;
  }

  const copyInvite=e.target.closest("[data-copy-invite]");
  if(copyInvite){
    const link=new URL(window.location.href.split("#")[0]);link.search="";link.searchParams.set("invite",copyInvite.dataset.copyInvite);
    await copyText(link.toString());return;
  }

  const revokeInvite=e.target.closest("[data-revoke-invite]");
  if(revokeInvite){
    const {error}=await supabase.from("business_invites").update({revoked_at:new Date().toISOString()}).eq("id",revokeInvite.dataset.revokeInvite);
    if(error) showToast(error.message); else {await loadOwnerAdmin();showToast("Invite revoked");}
    return;
  }

  const checkBookingClient=e.target.closest("[data-check-booking-client]");
  if(checkBookingClient){
    const id=checkBookingClient.dataset.checkBookingClient;
    try{
      await markBookingReviewed(id);
      openInquiryNotificationDetail("booking:"+id);
    }catch(err){
      showToast(err?.message||"Could not open booking request");
    }
    return;
  }

  const approveBooking=e.target.closest("[data-approve-booking]");
  if(approveBooking){
    approveBooking.disabled=true;
    const {error}=await supabase.rpc("approve_booking_request",{p_request_id:approveBooking.dataset.approveBooking});
    approveBooking.disabled=false;
    if(error) showToast(error.message); else {
      try{await markBookingReviewed(approveBooking.dataset.approveBooking);}catch{}
      await loadCoreData();
      showToast("Booking approved · client, job and invoice created");
      trackGoogleEvent("booking_approved",{source:"booking_request"});
    }
    return;
  }

  const declineBooking=e.target.closest("[data-decline-booking]");
  if(declineBooking){
    const {error}=await supabase.rpc("decline_booking_request",{p_request_id:declineBooking.dataset.declineBooking});
    if(error) showToast(error.message); else {
      try{await markBookingReviewed(declineBooking.dataset.declineBooking);}catch{}
      await loadCoreData();
      showToast("Booking request declined");
      trackGoogleEvent("booking_declined",{source:"booking_request"});
    }
    return;
  }

  const legacyAccept=e.target.closest("[data-accept-quote]");
  if(legacyAccept){
    showToast("Customer approval is required. Send the quote instead.");
    return;
  }
});

function openQuickAdd(){
  state.modalType="quick"; state.modalId=null;
  modalHeader("ADD NEW","What do you want to add?","Choose an item and open the right form.");
  entityForm.innerHTML=`
    <div class="quick-add-menu">
      <button type="button" data-action="lead"><span>◎</span><strong>Lead</strong><small>Capture a new inquiry</small></button>
      <button type="button" data-action="client"><span>◌</span><strong>Client</strong><small>Add contact + address</small></button>
      <button type="button" data-action="job"><span>□</span><strong>Job</strong><small>Schedule a cleaning</small></button>
      <button type="button" data-action="quote"><span>◫</span><strong>Quote</strong><small>Create a quote</small></button>
      <button type="button" data-action="invoice"><span>$</span><strong>Invoice</strong><small>Create + track payment</small></button>
      <button type="button" data-action="service"><span>＋</span><strong>Service</strong><small>Add price + duration</small></button>
      <button type="button" data-action="addon"><span>＋</span><strong>Add-on</strong><small>Extra price + time</small></button>
      <button type="button" data-action="supply"><span>▣</span><strong>Supply</strong><small>Track stock + reorder level</small></button>
      <button type="button" data-team-create><span>◉</span><strong>Team Profile</strong><small>Add a cleaner for assignments</small></button>
    </div>
    <div class="form-footer"><button type="button" class="ghost-btn" data-modal-cancel>Cancel</button></div>`;
  modal.hidden=false;
}

function openGeneric(type){
  state.modalType=type; state.modalId=null;
  modalHeader("ADD NEW","Coming next","This action is not available from this screen yet.");
  entityForm.innerHTML=`<div class="empty-inline"><strong>Use the matching section for this action.</strong><span>Your existing data is safe.</span></div><div class="form-footer"><button type="button" class="primary-btn" data-modal-cancel>Close</button></div>`;
  modal.hidden=false;
}

document.addEventListener("change",async e=>{
  const mileageJob=e.target.closest("[data-mileage-job]");
  if(mileageJob){
    const selected=mileageJob.selectedOptions?.[0];
    const toField=entityForm?.querySelector('input[name="to_location"]');
    const address=selected?.dataset?.address||"";
    if(toField && address) toField.value=address;
    return;
  }

  const mileageType=e.target.closest("[data-mileage-type]");
  if(mileageType){
    const extraWrap=entityForm?.querySelector("[data-mileage-extra-wrap]");
    if(extraWrap) extraWrap.hidden=mileageType.value!=="extra";
    return;
  }

  const platformStatus=e.target.closest("[data-platform-status]");
  if(platformStatus){
    const {error}=await supabase.rpc("platform_set_subscription_status",{
      p_business_id:platformStatus.dataset.platformStatus,
      p_status:platformStatus.value
    });
    if(error) showToast(error.message);
    else {await loadPlatformAdmin();showToast("Subscription status updated");}
    return;
  }

  const memberRole=e.target.closest("[data-member-role]");
  if(!memberRole) return;
  const {error}=await supabase.from("business_members")
    .update({role:memberRole.value,updated_at:new Date().toISOString()})
    .eq("id",memberRole.dataset.memberRole);
  if(error) showToast(error.message);
  else {await loadOwnerAdmin();showToast("Access updated");}
});


const workerMessageForm=$("#workerMessageForm");
if(workerMessageForm) workerMessageForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const input=$("#workerMessageInput");
  const body=String(input?.value||"").trim();
  if(!body) return;
  const button=workerMessageForm.querySelector('button[type="submit"]');
  setBusy(button,true,"Sending…");
  try{
    await sendWorkerMessage(body);
    input.value="";
  }catch(err){
    showToast(err.message||"Could not send message");
  }finally{
    setBusy(button,false);
  }
});

const teamMessageWorkerSelect=$("#teamMessageWorkerSelect");
if(teamMessageWorkerSelect) teamMessageWorkerSelect.addEventListener("change",async e=>{
  state.activeTeamMessageMemberId=e.target.value||null;
  if(state.activeTeamMessageMemberId){
    await loadTeamMessageThread(state.activeTeamMessageMemberId,{markRead:true}).catch(err=>showToast(err.message||"Could not load messages"));
  }else{
    state.teamMessages=[];
    renderTeamMessageCenter();
  }
});

const teamMessageForm=$("#teamMessageForm");
if(teamMessageForm) teamMessageForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const input=$("#teamMessageInput");
  const body=String(input?.value||"").trim();
  if(!body) return;
  const button=teamMessageForm.querySelector('button[type="submit"]');
  setBusy(button,true,"Sending…");
  try{
    await sendAdminTeamMessage(body);
    input.value="";
  }catch(err){
    showToast(err.message||"Could not send message");
  }finally{
    setBusy(button,false);
  }
});

$("#refreshTeamMessagesBtn")?.addEventListener("click",async ()=>{
  try{
    await loadTeamMessageThreads();
    if(state.activeTeamMessageMemberId) await loadTeamMessageThread(state.activeTeamMessageMemberId,{markRead:true});
    showToast("Messages refreshed");
  }catch(err){showToast(err.message||"Could not refresh messages");}
});

const editBusinessProfileBtn=$("#editBusinessProfileBtn");
if(editBusinessProfileBtn) editBusinessProfileBtn.addEventListener("click",openBusinessProfileForm);

const saveGoogleReviewBtn=$("#saveGoogleReviewBtn");
if(saveGoogleReviewBtn) saveGoogleReviewBtn.addEventListener("click",async ()=>{
  const input=$("#googleReviewUrl");
  const raw=String(input?.value||"").trim();
  if(raw && !/^https:\/\/\S+$/i.test(raw)){
    showToast("Enter a valid HTTPS Google review link");
    input?.focus();
    return;
  }

  try{
    saveGoogleReviewBtn.disabled=true;
    saveGoogleReviewBtn.textContent="Saving…";
    const {error}=await supabase.rpc("set_google_review_url",{p_url:raw||null});
    if(error) throw error;

    const {data:linkSettings,error:refreshError}=await supabase.rpc("get_my_public_link_settings");
    if(refreshError) throw refreshError;
    state.publicLinks=linkSettings||null;
    renderSettings();
    showToast(raw?"Google review link saved":"Review link removed");
  }catch(err){
    showToast(err.message||"Could not save review link");
  }finally{
    saveGoogleReviewBtn.disabled=false;
    saveGoogleReviewBtn.textContent="Save review link";
  }
});

const testGoogleReviewBtn=$("#testGoogleReviewBtn");
if(testGoogleReviewBtn) testGoogleReviewBtn.addEventListener("click",()=>{
  const url=String(state.publicLinks?.google_review_url||"").trim();
  if(url) window.open(url,"_blank","noopener");
});

const saveAvailabilityBtn=$("#saveAvailabilityBtn");
if(saveAvailabilityBtn) saveAvailabilityBtn.addEventListener("click",async ()=>{
  try{
    saveAvailabilityBtn.disabled=true;
    saveAvailabilityBtn.textContent="Saving…";
    await saveAvailabilitySettings();
    showToast("Availability saved");
  }catch(err){
    showToast(err.message||"Could not save availability");
  }finally{
    saveAvailabilityBtn.disabled=false;
    saveAvailabilityBtn.textContent="Save";
  }
});

const availabilityWeek=$("#availabilityWeek");
if(availabilityWeek) availabilityWeek.addEventListener("change",e=>{
  const toggle=e.target.closest("[data-day-enabled]");
  if(!toggle) return;
  const row=toggle.closest(".availability-day");
  row.classList.toggle("off",!toggle.checked);
  row.querySelectorAll('input[type="time"]').forEach(input=>input.disabled=!toggle.checked);
});

const restartOnboardingBtn=$("#restartOnboardingBtn");
if(restartOnboardingBtn) restartOnboardingBtn.addEventListener("click",restartGuidedOnboarding);

const helpButtons=["#sidebarHelpBtn","#footerHelpBtn","#topHelpBtn"];
helpButtons.forEach(selector=>{
  const button=$(selector);
  if(button) button.addEventListener("click",()=>openView("help"));
});

const feedbackButtons=["#sidebarFeedbackBtn","#footerFeedbackBtn","#helpFeedbackBtn","#topFeedbackBtn"];
feedbackButtons.forEach(selector=>{
  const button=$(selector);
  if(button) button.addEventListener("click",openFeedbackForm);
});

$("#footerShareAppBtn")?.addEventListener("click",shareCleaningApp);

const quickAddBtn=$("#quickAddBtn");
if(quickAddBtn) quickAddBtn.addEventListener("click",()=>{
  if(!state.business || !["owner","admin"].includes(state.business.role)){
    showToast("Add New is owner/admin only");
    return;
  }
  openQuickAdd();
});

["#shareAppAccessBtn","#shareAccessCardBtn","#helpInviteBtn"].forEach(selector=>{
  const button=$(selector);
  if(button) button.addEventListener("click",()=>{
    if(state.business?.role!=="owner"){
      showToast("Only the owner can share app access");
      return;
    }
    openInviteForm();
  });
});

const exitWorkerBtn=$("#exitWorkerBtn");
if(exitWorkerBtn) exitWorkerBtn.addEventListener("click",()=>{
  localStorage.removeItem("tle_worker_device_token");
  localStorage.removeItem("tle_worker_token");
  state.workerPortal=null;
  window.location.href=window.location.origin+window.location.pathname;
});

const startTimerBtn=$("#startTimerBtn");
if(startTimerBtn) startTimerBtn.addEventListener("click",startTimeEntry);

const inviteMemberBtn=$("#inviteMemberBtn");
if(inviteMemberBtn) inviteMemberBtn.addEventListener("click",openInviteForm);
const addTeamProfileBtn=$("#addTeamProfileBtn");
if(addTeamProfileBtn) addTeamProfileBtn.addEventListener("click",()=>openTeamForm());

$("#modalClose").addEventListener("click",()=>modal.hidden=true);
modal.addEventListener("click",e=>{if(e.target===modal) modal.hidden=true});

function customerShareAppUrl(){
  const url=new URL(window.location.origin+window.location.pathname);
  url.searchParams.set("utm_source","cleaning_app");
  url.searchParams.set("utm_medium","share");
  url.searchParams.set("utm_campaign","customer_share");
  return url.toString();
}

async function shareCleaningApp(){
  const url=customerShareAppUrl();
  const title="The Launch Era Cleaning App";
  const text=langPick(
    "Keep bookings, clients, jobs, quotes and invoices organized in one place.",
    "Organiza reservas, clientes, trabajos, cotizaciones y facturas en un solo lugar.",
    "Organize reservas, clientes, trabalhos, orçamentos e faturas em um só lugar.",
    "Gardez réservations, clients, travaux, devis et factures organisés au même endroit."
  );

  if(navigator.share){
    try{
      await navigator.share({title,text,url});
      trackGoogleEvent("share_app",{share_method:"native",share_location:"footer"});
      showToast(langPick("App shared","App compartida","App compartilhado","Application partagée"));
      return;
    }catch(err){
      if(err?.name==="AbortError") return;
    }
  }

  try{
    await navigator.clipboard.writeText(url);
    trackGoogleEvent("share_app",{share_method:"copy",share_location:"footer"});
    showToast(langPick("App link copied","Link de la app copiado","Link do app copiado","Lien de l’application copié"));
  }catch{
    await copyText(url);
    trackGoogleEvent("share_app",{share_method:"copy_fallback",share_location:"footer"});
  }
}

async function copyText(text){
  try{await navigator.clipboard.writeText(text);showToast("Link copied");}
  catch{showToast("Copy unavailable here");}
}
async function getLatestAppShellVersion(){
  try{
    const response=await fetch("./index.html?tle_check="+Date.now(),{
      cache:"no-store",
      credentials:"same-origin",
      headers:{"Cache-Control":"no-cache"}
    });
    if(!response.ok) return null;
    const markup=await response.text();
    const appMatch=markup.match(/app\.js\?v=([^"'&<\s]+)/i);
    const cssMatch=markup.match(/styles\.css\?v=([^"'&<\s]+)/i);
    return {
      app:appMatch?.[1]||null,
      css:cssMatch?.[1]||null
    };
  }catch(err){
    console.warn("[TLE] version check",err);
    return null;
  }
}

function currentCssVersion(){
  try{
    const href=document.querySelector('link[rel="stylesheet"][href*="styles.css"]')?.getAttribute("href")||"";
    return new URL(href,window.location.href).searchParams.get("v")||"";
  }catch{return "";}
}

async function hardRefreshInstalledApp(version){
  try{
    if("serviceWorker" in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }
  }catch{}
  try{
    if("caches" in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
  }catch{}

  const url=new URL(window.location.href);
  url.searchParams.set("app",version||String(Date.now()));
  url.searchParams.set("refresh",String(Date.now()));
  window.location.replace(url.toString());
}

async function refreshInstalledApp(){
  const unreadBefore=getInquiryUnreadCount();
  const button=$("#appRefreshBtn");
  if(!button || button.disabled) return;

  button.disabled=true;
  button.classList.add("is-refreshing");
  const label=button.querySelector(".top-label");
  const previousLabel=label?.textContent||"Refresh";
  if(label) label.textContent=langPick("Refreshing…","Actualizando…","Atualizando…","Actualisation…");

  try{
    const latest=await getLatestAppShellVersion();
    const shellChanged=!!(
      latest && (
        (latest.app && latest.app!==APP_VERSION) ||
        (latest.css && latest.css!==currentCssVersion())
      )
    );

    if(shellChanged){
      showToast(langPick("Updating app…","Actualizando la app…","Atualizando o app…","Mise à jour de l’application…"));
      await hardRefreshInstalledApp(latest.app||latest.css);
      return;
    }

    if(state.business?.id){
      try{
        const {data:companyProfile,error:companyProfileError}=await supabase
          .from("businesses")
          .select("name,email,phone,timezone,default_language,service_area,default_travel_buffer_minutes,instagram_url,facebook_url,trial_started_at,trial_ends_at,trial_days,trial_promotion,subscription_status,trial_welcome_sent_at,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods")
          .eq("id",state.business.id)
          .single();
        if(companyProfileError) throw companyProfileError;
        if(companyProfile) state.business={...state.business,...companyProfile};
      }catch(err){
        console.warn("[TLE] manual business refresh",err);
      }

      const [linkResult]=await Promise.all([
        supabase.rpc("get_my_public_link_settings"),
        loadCoreData(),
        loadBusinessWeather(true)
      ]);

      if(!linkResult?.error) state.publicLinks=linkResult?.data||null;
      renderTrialStatus();
      renderTodaySummary(true);
      renderBusinessPresence();
      if(state.isPlatformAdmin) await loadPlatformAdmin();
    }

    renderInquiryNotifications();
    const unreadAfter=getInquiryUnreadCount();
    if(unreadAfter>unreadBefore){
      const newest=getInquiryNotifications()[0];
      const summary=[newest?.name,newest?.service].filter(Boolean).join(" · ");
      showToast(langPick("New inquiry","Nuevo inquiry","Novo contato","Nouvelle demande")+(summary?" · "+summary:""));
    }else{
      showToast(langPick("Everything is up to date","Todo actualizado","Tudo atualizado","Tout est à jour"));
    }
  }catch(err){
    console.warn("[TLE] manual refresh",err);
    showToast(langPick("Could not refresh. Try again.","No se pudo actualizar. Intenta otra vez.","Não foi possível atualizar. Tente novamente.","Impossible d’actualiser. Réessayez."));
  }finally{
    button.disabled=false;
    button.classList.remove("is-refreshing");
    if(label) label.textContent=previousLabel;
  }
}

$$("[data-copy-target]").forEach(btn=>btn.addEventListener("click",()=>copyText($("#"+btn.dataset.copyTarget).textContent.trim())));
$("#copyBooking").addEventListener("click",()=>copyText($("#bookingUrl").textContent.trim()));

document.addEventListener("click",e=>{
  const publicOpen=e.target.closest("[data-open-public]");
  if(!publicOpen) return;
  const link=publicOpen.dataset.openPublic==="book" ? $("#bookingUrl")?.href : $("#quoteUrl")?.href;
  if(link) window.open(link,"_blank","noopener");
});

function weatherFallbackUrl(){
  const location=state.weather?.location||{};
  const place=[
    location.name||state.weatherArea||"",
    location.admin1||"",
    location.country||""
  ].filter(Boolean).join(", ");
  return "https://www.google.com/search?q="+encodeURIComponent("weather "+place);
}

function openDeviceWeather(){
  const ua=navigator.userAgent||"";
  const isIOS=/iPad|iPhone|iPod/i.test(ua)
    || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);

  if(isIOS){
    const fallback=weatherFallbackUrl();
    let switched=false;
    const markHidden=()=>{ if(document.hidden) switched=true; };
    document.addEventListener("visibilitychange",markHidden,{once:true});
    window.location.href="weather://";
    setTimeout(()=>{
      if(!switched && !document.hidden){
        window.open(fallback,"_blank","noopener");
      }
    },900);
    return;
  }

  window.open(weatherFallbackUrl(),"_blank","noopener");
}

document.addEventListener("click",e=>{
  const weatherTarget=e.target.closest("[data-open-device-weather]");
  if(!weatherTarget) return;
  if(e.target.closest("button,a")) return;
  openDeviceWeather();
});

document.addEventListener("keydown",e=>{
  const weatherTarget=e.target.closest?.("[data-open-device-weather]");
  if(!weatherTarget || !["Enter"," "].includes(e.key)) return;
  e.preventDefault();
  openDeviceWeather();
});

$("#notificationBellBtn")?.addEventListener("click",e=>{
  e.stopPropagation();
  openNotificationPopover();
});
$("#notificationCloseBtn")?.addEventListener("click",e=>{
  e.stopPropagation();
  closeNotificationPopover();
});
$("#notificationPopover")?.addEventListener("click",e=>{
  const item=e.target.closest("[data-notification-id]");
  if(!item){
    e.stopPropagation();
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  if(typeof e.stopImmediatePropagation==="function") e.stopImmediatePropagation();
  const id=item.dataset.notificationId;
  closeNotificationPopover();
  openInquiryNotificationDetail(id);
});
document.addEventListener("click",e=>{
  if(!e.target.closest(".notification-shell")) closeNotificationPopover();
});
$("#appRefreshBtn")?.addEventListener("click",refreshInstalledApp);
$("#languageBtn").addEventListener("click",()=>{ window.TLE_I18N?.toggle(); });
document.addEventListener("keydown",e=>{if(e.key==="Escape"){modal.hidden=true;if(typeof setSidebarOpen==="function") setSidebarOpen(false);else sidebar.classList.remove("open")}});

if("serviceWorker" in navigator){
  window.addEventListener("load",async ()=>{
    try{
      const registration=await navigator.serviceWorker.register(
        "./service-worker.js?v="+encodeURIComponent(APP_VERSION),
        {updateViaCache:"none"}
      );
      registration.update().catch(()=>{});
    }catch(err){
      console.warn("[TLE] service worker",err);
    }
  });
}

window.__tleAppReady=true;
setAuthMode("signin");
// Route every authenticated boot through the same promise so iPhone/PWA
// startup and Supabase SIGNED_IN cannot initialize the app twice.
enterAuthenticatedApp().catch(err=>{
  console.error("[TLE] initialize failed",err);
  showAuth();
  setAuthStatus(err?.message||"The app could not finish loading. Please refresh.","error");
});
})();

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
const OWNER_CODE_REQUEST_KEY = "tle_owner_code_requested_at";
const APP_VERSION = "20260927-legal-feedback-1";

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
    if(ownerEmail===PRIMARY_PLATFORM_ADMIN_EMAIL){
      localStorage.setItem("tle_last_admin_email",PRIMARY_PLATFORM_ADMIN_EMAIL);
      localStorage.setItem("tle_admin_emails",JSON.stringify([PRIMARY_PLATFORM_ADMIN_EMAIL]));
    }
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
  workerPortal: null,
  currentWorkerLink: null,
  authMode: "signin",
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
const toastEl = $("#toast");
const sidebar = $("#sidebar");
const pageTitle = $("#pageTitle");
const backBtn = $("#backBtn");
const navHistory=["today"];

const pageTitles = {
  today:"Today", booking:"Booking Center", leads:"Leads", clients:"Clients",
  calendar:"Calendar + Jobs", quotes:"Quotes", invoices:"Invoices",
  route:"Today's Route", mileage:"Mileage", time:"Time Tracking",
  reports:"Owner Reports", services:"Services + Add-ons", supplies:"Supplies", team:"Team", settings:"Settings", admin:"Owner Admin", "platform-admin":"Platform Admin", help:"Help & FAQ"
};


const ONBOARDING_VERSION=1;
const ONBOARDING_COPY={
  welcome:{
    en:{kicker:"WELCOME",title:"Your Cleaning App, explained as you use it.",text:"The first time you open a section, a small tip will tell you what it does. Each tip appears only once."},
    es:{kicker:"BIENVENIDA",title:"Tu Cleaning App, explicada mientras la usas.",text:"La primera vez que abras una sección, verás un cartelito corto que te explica para qué sirve. Cada tip aparece una sola vez."}
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
    en:{title:"Invoices",text:"Create and send invoices, then record Cash, Check or Zelle when the client pays."},
    es:{title:"Facturas",text:"Crea y envía facturas, y registra Efectivo, Cheque o Zelle cuando el cliente pague."}
  },
  route:{
    en:{title:"Today’s Route",text:"See today’s stops in order so you and your team know where to go next."},
    es:{title:"Ruta de hoy",text:"Mira las paradas de hoy en orden para que tú y tu equipo sepan cuál sigue."}
  },
  mileage:{
    en:{title:"Mileage",text:"Log business miles connected to jobs so your driving records stay organized."},
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
    en:{title:"Team",text:"Add workers, assign jobs and share limited worker access without giving them owner controls."},
    es:{title:"Equipo",text:"Añade trabajadores, asigna trabajos y comparte acceso limitado sin darles controles del dueño."}
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

function onboardingLanguage(){
  return window.TLE_I18N?.language==="es" || (!window.TLE_I18N && localStorage.getItem("tle_language")==="es") ? "es" : "en";
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

  $("#onboardingCloseBtn",layer).addEventListener("click",()=>hideOnboardingTip());
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
  const words=copy[lang]||copy.en;
  const layer=ensureOnboardingUi();
  const isWelcome=key==="welcome";
  window.__tleOnboardingCurrent={key,kind};

  $("#onboardingKicker",layer).textContent=isWelcome
    ? words.kicker
    : (lang==="es"?"PRIMERA VEZ":"FIRST TIME TIP");
  $("#onboardingTitle",layer).textContent=words.title;
  $("#onboardingText",layer).textContent=words.text;
  $("#onboardingOnceNote",layer).textContent=isWelcome
    ? (lang==="es"?"Puedes saltarlo cuando quieras.":"You can skip it anytime.")
    : (lang==="es"?"Este tip solo aparece una vez.":"You’ll only see this tip once.");
  $("#onboardingDoneBtn",layer).textContent=isWelcome
    ? (lang==="es"?"Empezar":"Start tour")
    : (lang==="es"?"Entendido":"Got it");
  $("#onboardingSkipBtn",layer).textContent=isWelcome
    ? (lang==="es"?"Saltar":"Skip")
    : (lang==="es"?"No mostrar más tips":"Hide tips");
  $("#onboardingCloseBtn",layer).setAttribute("aria-label",lang==="es"?"Cerrar":"Close");
  layer.classList.toggle("welcome",isWelcome);
  layer.hidden=false;
}
function maybeShowOnboardingWelcome(){
  if(!state.business || !state.session) return;
  const progress=getOnboardingState();
  if(progress.disabled || progress.welcome) return;
  if(!appShell || appShell.hidden) return;
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
  const base="https://thelaunchera.github.io/The-launch-era-Website-/";
  $(".legal-privacy-link").forEach(a=>a.href=base+(isEs?"es/privacy.html":"privacy.html"));
  $(".legal-terms-link").forEach(a=>a.href=base+(isEs?"es/terms.html":"terms.html"));
}
window.addEventListener("tle:languagechange",syncLegalLinks);
setTimeout(syncLegalLinks,0);

function appIsSpanish(){
  return window.TLE_I18N?.language==="es";
}
function appLocale(){
  return appIsSpanish() ? "es-US" : "en-US";
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
  if(n===0) return {icon:"☀️",en:"Clear",es:"Despejado"};
  if([1,2].includes(n)) return {icon:"🌤️",en:"Partly cloudy",es:"Parcialmente nublado"};
  if(n===3) return {icon:"☁️",en:"Cloudy",es:"Nublado"};
  if([45,48].includes(n)) return {icon:"🌫️",en:"Foggy",es:"Neblina"};
  if([51,53,55,56,57].includes(n)) return {icon:"🌦️",en:"Drizzle",es:"Llovizna"};
  if([61,63,65,66,67,80,81,82].includes(n)) return {icon:"🌧️",en:"Rain",es:"Lluvia"};
  if([71,73,75,77,85,86].includes(n)) return {icon:"🌨️",en:"Snow",es:"Nieve"};
  if([95,96,99].includes(n)) return {icon:"⛈️",en:"Thunderstorms",es:"Tormentas"};
  return {icon:"🌤️",en:"Weather",es:"Clima"};
}
function weatherClockLabel(hour){
  const h=Number(hour);
  if(appIsSpanish()){
    if(h===0) return "12 a. m.";
    if(h<12) return h+" a. m.";
    if(h===12) return "12 p. m.";
    return (h-12)+" p. m.";
  }
  if(h===0) return "12 AM";
  if(h<12) return h+" AM";
  if(h===12) return "12 PM";
  return (h-12)+" PM";
}
function weatherDayLabel(dateString,currentDateString){
  if(!dateString) return "";
  const d=new Date(dateString+"T12:00:00Z");
  const today=new Date(currentDateString+"T12:00:00Z");
  const tomorrow=new Date(today); tomorrow.setUTCDate(tomorrow.getUTCDate()+1);
  if(dateString===currentDateString) return appIsSpanish()?"Hoy":"Today";
  if(dateString===tomorrow.toISOString().slice(0,10)) return appIsSpanish()?"Mañana":"Tomorrow";
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
  return "tle_weather_v1:"+String(area||"").trim().toLowerCase().replace(/\s+/g," ").slice(0,120);
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
  const geoKey="tle_weather_geo:"+clean.toLowerCase();
  try{
    const cached=JSON.parse(localStorage.getItem(geoKey)||"null");
    if(cached&&cached.latitude!=null&&cached.longitude!=null) return cached;
  }catch(e){}

  const candidates=[clean,clean.split(",")[0].trim()].filter(function(v,i,a){return v&&a.indexOf(v)===i;});
  for(const query of candidates){
    try{
      const url="https://geocoding-api.open-meteo.com/v1/search?count=5&language=en&format=json&name="+encodeURIComponent(query);
      const data=await fetchJsonWithTimeout(url);
      const results=Array.isArray(data&&data.results)?data.results:[];
      const us=results.find(function(x){return String(x.country_code||"").toUpperCase()==="US";})||results[0];
      if(us){
        const geo={
          latitude:Number(us.latitude),
          longitude:Number(us.longitude),
          name:us.name||clean,
          admin1:us.admin1||"",
          country:us.country||"",
          timezone:us.timezone||(state.business&&state.business.timezone)||"auto"
        };
        localStorage.setItem(geoKey,JSON.stringify(geo));
        return geo;
      }
    }catch(e){}
  }
  return null;
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
      temperature_unit:"fahrenheit",
      precipitation_unit:"inch",
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

  $("#weatherIcon").textContent=meta.icon;
  $("#weatherTemp").textContent=Number.isFinite(temp)?temp+"°F":"—";
  $("#weatherCondition").textContent=appIsSpanish()?meta.es:meta.en;
  $("#weatherFeels").textContent=Number.isFinite(feels)?(appIsSpanish()?"Se siente como "+feels+"°":"Feels like "+feels+"°"):"";
  $("#weatherLocation").textContent=(appIsSpanish()?"AFUERA · ":"OUTSIDE · ")+(location.name||state.weatherArea||"");

  const note=$("#weatherBusinessNote");
  if(note){
    if(rain){
      const day=weatherDayLabel(rain.date,currentDate).toLowerCase();
      const time=weatherClockLabel(rain.hour);
      note.classList.add("rain");
      note.innerHTML=appIsSpanish()
        ? "<strong>🌧️ Lluvia probable "+escapeHtml(day)+" cerca de las "+escapeHtml(time)+" · "+rain.probability+"%</strong><span>Deja un poco de margen entre paradas y revisa el acceso antes de salir.</span>"
        : "<strong>🌧️ Rain likely "+escapeHtml(day)+" around "+escapeHtml(time)+" · "+rain.probability+"%</strong><span>Leave a little room between stops and double-check access before heading out.</span>";
    }else if(temp>=88){
      note.classList.remove("rain");
      note.innerHTML=appIsSpanish()
        ? "<strong>💧 Hace calor afuera.</strong><span>Ten agua cerca y deja unos minutos para respirar entre paradas.</span>"
        : "<strong>💧 It’s hot outside.</strong><span>Keep water close and give yourself a few minutes between stops.</span>";
    }else{
      note.classList.remove("rain");
      note.innerHTML=appIsSpanish()
        ? "<strong>Todo tranquilo con el clima por ahora.</strong><span>Tu ruta puede seguir sin alertas de lluvia importantes.</span>"
        : "<strong>Weather looks steady for now.</strong><span>No major rain alert is affecting your route yet.</span>";
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
      return '<div class="weather-day"><span>'+escapeHtml(day)+'</span><b>'+m.icon+' '+hi+'°</b><small>'+lo+'° · '+prob+'% '+(appIsSpanish()?"lluvia":"rain")+'</small></div>';
    }).join("");
  }

  const updated=$("#weatherUpdated");
  if(updated){
    const t=new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit"}).format(new Date(state.weatherFetchedAt||Date.now()));
    updated.textContent=appIsSpanish()?"Actualizado "+t:"Updated "+t;
  }
}
function installLiveDashboardUpdates(){
  if(window.__tleLiveDashboardInstalled) return;
  window.__tleLiveDashboardInstalled=true;

  window.setInterval(function(){
    if(state.session&&state.business) renderTodaySummary();
  },60*1000);

  window.setInterval(function(){
    if(state.session&&state.business) loadBusinessWeather(true).catch(function(){});
  },15*60*1000);

  document.addEventListener("visibilitychange",function(){
    if(document.visibilityState!=="visible"||!state.session||!state.business) return;
    renderTodaySummary();
    if(Date.now()-(state.weatherFetchedAt||0)>15*60*1000){
      loadBusinessWeather(true).catch(function(){});
    }
  });
}

function refreshDynamicLanguageContent(){
  if(!state.business || !state.session) return;
  try{ renderTodaySummary(); }catch{}
  try{ renderOperations(); }catch{}
  try{ renderSettings(); }catch{}
  try{ renderPublicLinks(); }catch{}
  try{ if(state.business.role==="owner") loadOwnerAdmin().catch(()=>{}); }catch{}
}
window.addEventListener("tle:languagechange",()=>{
  setTimeout(refreshDynamicLanguageContent,0);
});

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[ch]);
}
function money(value){
  if(value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(Number(value));
}
function formatDateTime(value){
  if(!value) return "—";
  return new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(value));
}
function setAuthStatus(message="",type=""){
  const el=$("#authStatus");
  if(!el) return;
  el.textContent=message;
  el.dataset.type=type||"";
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
function showAuth(){
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = false;
  appShell.hidden = true;
  authPanel.hidden = false;
  businessSetup.hidden = true;
}
function showSetup(){
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = false;
  appShell.hidden = true;
  authPanel.hidden = true;
  businessSetup.hidden = false;
}
function showApp(){
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = true;
  appShell.hidden = false;
  document.body.classList.toggle("platform-owner-no-billing",isPrimaryPlatformAdminAccount() || state.isPlatformAdmin);
  applyRolePermissions();
  $("[data-account-billing]").forEach(el=>{
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
    const roleLabel = state.business.role==="owner" ? "Admin" : state.business.role==="admin" ? "Admin access" : "Worker access";
    chip.innerHTML = `
      <span class="workspace-avatar">${escapeHtml(initials(state.business.name))}</span>
      <span><strong>${escapeHtml(state.business.name)}</strong><small>${roleLabel}</small></span>
    `;
  }
  scheduleOnboardingWelcome();
  installLiveDashboardUpdates();
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

    if(warning && state.business.role==="owner" && days>0 && days<=3){
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
  $$(".view").forEach(v=>v.classList.toggle("active",v.dataset.page===id));
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===id));
  pageTitle.textContent=pageTitles[id]||"The Launch Era Cleaning App";
  if(backBtn) backBtn.hidden=id==="today";
  sidebar.classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
  trackVisit("/app/"+id).catch(()=>{});
  setTimeout(()=>maybeShowFeatureIntro(id),220);
}
$$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>openView(btn.dataset.view)));
$$("[data-jump]").forEach(btn=>btn.addEventListener("click",()=>openView(btn.dataset.jump)));
$("#menuToggle").addEventListener("click",()=>sidebar.classList.toggle("open"));
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

async function trackVisit(page=window.location.pathname+window.location.search){
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
function markOwnerActivity(){
  if(state.business?.role!=="owner") return;
  localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));
}
function ownerIdleExpired(){
  const last=Number(localStorage.getItem(OWNER_ACTIVITY_KEY)||0);
  return last>0 && (Date.now()-last)>=OWNER_IDLE_MS;
}
async function expireOwnerSession(){
  if(window.__tleOwnerLocking) return;
  window.__tleOwnerLocking=true;
  const email=String(state.session?.user?.email||rememberedOwnerEmail()).trim().toLowerCase();

  // Soft-lock only. Keep the authenticated Supabase session alive so a UI
  // refresh, language change or PWA resume can never accidentally sign the
  // owner out. The email code unlocks the existing session after inactivity.
  localStorage.removeItem(OWNER_ACTIVITY_KEY);
  await showOwnerAccess(email,true);
  window.__tleOwnerLocking=false;
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
    if(ownerIdleExpired()){
      expireOwnerSession().catch(()=>{});
      return;
    }
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
    if(document.visibilityState!=="visible") return;
    if(state.session && state.business?.role==="owner" && ownerIdleExpired()){
      expireOwnerSession().catch(()=>{});
    }else{
      onActivity();
    }
  });
  window.setInterval(()=>{
    if(state.session && state.business?.role==="owner" && ownerIdleExpired()){
      expireOwnerSession().catch(()=>{});
    }
  },60000);
}
function prepareAdminShortcut(){
  const shortcut=$("#rememberedAdminBtn");
  if(!shortcut) return;
  const remembered=rememberedOwnerEmail();
  shortcut.hidden=state.authMode!=="signin";
  shortcut.textContent="Continue as Admin";
  if(remembered && !$("#authEmail").value) $("#authEmail").value=remembered;
}
async function requestOwnerAccessCode(email){
  const clean=String(email||"").trim().toLowerCase();
  if(!clean || !clean.includes("@")) throw new Error("Enter a valid email.");
  const {data,error}=await supabase.functions.invoke("request-owner-access-code",{body:{email:clean}});
  if(error) throw error;
  if(!data?.sent) throw new Error(data?.error||"Could not send the access code.");
  localStorage.setItem(OWNER_EMAIL_KEY,clean);
  localStorage.setItem(OWNER_CODE_REQUEST_KEY,String(Date.now()));
  return data;
}
async function verifyOwnerAccessCode(email,code){
  const clean=String(email||"").trim().toLowerCase();
  const token=String(code||"").replace(/\D/g,"").slice(0,6);
  if(token.length!==6) throw new Error("Enter the 6-digit code.");
  const {data,error}=await supabase.functions.invoke("verify-owner-access-code",{body:{email:clean,code:token}});
  if(error) throw error;
  if(!data?.verified || !data?.access_token || !data?.refresh_token){
    throw new Error(data?.error||"That code could not be verified.");
  }
  window.__tleOwnerCodeLogin=true;
  try{
    const {data:{session:existingSession}}=await supabase.auth.getSession();
    const existingEmail=String(existingSession?.user?.email||"").trim().toLowerCase();

    if(existingSession && existingEmail===clean){
      state.session=existingSession;
    }else{
      const {data:sessionData,error:sessionError}=await supabase.auth.setSession({
        access_token:data.access_token,
        refresh_token:data.refresh_token
      });
      if(sessionError) throw sessionError;
      state.session=sessionData.session||null;
    }

    localStorage.setItem(OWNER_EMAIL_KEY,clean);
    localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));
    localStorage.removeItem(OWNER_CODE_REQUEST_KEY);
    await enterAuthenticatedApp();
  }finally{
    window.__tleOwnerCodeLogin=false;
  }
}
async function showOwnerAccess(email,autoSend=false){
  const clean=String(email||rememberedOwnerEmail()).trim().toLowerCase();
  showAuth();
  state.authMode="ownerCode";
  const form=$("#authForm");
  const shortcut=$("#rememberedAdminBtn");
  const panel=$("#ownerCodePanel");
  const links=$(".auth-links");
  if(form) form.hidden=true;
  if(shortcut) shortcut.hidden=true;
  if(links) links.hidden=true;
  if(panel) panel.hidden=false;
  $("#authTitle").textContent="Admin";
  $("#authCopy").textContent="Secure owner access. No password needed.";
  $("#ownerCodeCopy").textContent=clean
    ? "Enter the 6-digit code sent to "+maskEmail(clean)+"."
    : "Enter the 6-digit code sent to your email.";
  $("#ownerAccessCode").value="";
  if(autoSend && clean){
    const requestedAt=Number(localStorage.getItem(OWNER_CODE_REQUEST_KEY)||0);
    const codeStillFresh=requestedAt>0 && (Date.now()-requestedAt)<9*60*1000;
    if(codeStillFresh){
      setAuthStatus("A code was already sent. Check your email.","success");
      setTimeout(()=>$("#ownerAccessCode")?.focus(),50);
    }else{
      setAuthStatus("Sending your access code…","loading");
      try{
        const result=await requestOwnerAccessCode(clean);
        setAuthStatus(result?.cooldown?"A code was already sent. Check your email.":"Code sent. Check your email.","success");
        setTimeout(()=>$("#ownerAccessCode")?.focus(),50);
      }catch(err){
        setAuthStatus(err?.message||"Could not send the access code.","error");
      }
    }
  }else{
    setAuthStatus("");
  }
}
async function continueAsAdmin(){
  const email=String($("#authEmail").value||rememberedOwnerEmail()).trim().toLowerCase();
  if(!email){
    setAuthStatus("Enter your email first.","error");
    $("#authEmail").focus();
    return;
  }
  const button=$("#rememberedAdminBtn");
  setBusy(button,true,"Sending code…");
  try{
    await showOwnerAccess(email,false);
    const result=await requestOwnerAccessCode(email);
    setAuthStatus(result?.cooldown?"A code was already sent. Check your email.":"Code sent. Check your email.","success");
    setTimeout(()=>$("#ownerAccessCode")?.focus(),50);
  }catch(err){
    showAuth();
    setAuthMode("signin");
    setAuthStatus(err?.message||"Could not send the access code.","error");
  }finally{
    setBusy(button,false);
  }
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
  const emailField=$("#authEmail").closest("label");
  const forgot=$("#forgotPassword");
  const signupLegalNote=$("#signupLegalNote");

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

$("#authSwitch").addEventListener("click",()=>setAuthMode(state.authMode==="signup"?"signin":"signup"));
$("#rememberedAdminBtn").addEventListener("click",continueAsAdmin);

$("#ownerCodeForm")?.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const button=$("#ownerCodeVerifyBtn");
  const email=rememberedOwnerEmail();
  setBusy(button,true,"Checking…");
  setAuthStatus("Checking your code…","loading");
  try{
    await verifyOwnerAccessCode(email,$("#ownerAccessCode").value);
    setAuthStatus("");
  }catch(err){
    setAuthStatus(err?.message||"That code could not be verified.","error");
  }finally{
    setBusy(button,false);
  }
});
$("#ownerCodeResendBtn")?.addEventListener("click",async()=>{
  const button=$("#ownerCodeResendBtn");
  const email=rememberedOwnerEmail();
  setBusy(button,true,"Sending…");
  try{
    const result=await requestOwnerAccessCode(email);
    setAuthStatus(result?.cooldown?"A code was already sent. Check your email.":"New code sent. Check your email.","success");
  }catch(err){
    setAuthStatus(err?.message||"Could not send a new code.","error");
  }finally{
    setBusy(button,false);
  }
});
$("#ownerCodeDifferentBtn")?.addEventListener("click",()=>{
  localStorage.removeItem(OWNER_EMAIL_KEY);
  setAuthMode("signin");
  showAuth();
  $("#authEmail").value="";
  $("#authEmail").focus();
  setAuthStatus("");
});

authForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const button = $("#authSubmit");
  setBusy(button,true);
  try{
    const email = $("#authEmail").value.trim();
    const password = $("#authPassword").value;
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
        options:{ emailRedirectTo: window.location.href.split("#")[0].split("?")[0] }
      });
      if(error) throw error;
      if(data.session){
        state.session=data.session;
        setAuthStatus("Account created.","success");
        await enterAuthenticatedApp();
      }else{
        setAuthMode("signin");
        setAuthStatus("Account created. Check your email to verify it, then sign in.","success");
        showToast("Account created. Check your email to verify it, then sign in.");
      }
    }else{
      const { data, error } = await supabase.auth.signInWithPassword({email,password});
      if(error) throw error;
      state.session=data.session||null;
      setAuthStatus("Signed in.","success");
      await enterAuthenticatedApp();
    }
  }catch(err){
    setAuthStatus(err.message || "Could not continue","error");
    showToast(err.message || "Could not continue");
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
    if(wasOwner && ownerEmail){
      localStorage.setItem(OWNER_EMAIL_KEY,ownerEmail);
      localStorage.removeItem(OWNER_ACTIVITY_KEY);
      localStorage.removeItem(OWNER_CODE_REQUEST_KEY);
      await showOwnerAccess(ownerEmail,false);
    }else{
      showAuth();
      setAuthMode("signin");
      prepareAdminShortcut();
      setAuthStatus("");
    }

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

businessForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const button = e.submitter;
  setBusy(button,true,"Creating…");
  try{
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate()+30);
    const payload = {
      owner_user_id: state.session.user.id,
      name: $("#businessName").value.trim(),
      email: state.session.user.email,
      phone: $("#businessPhone").value.trim() || null,
      service_area: $("#businessArea").value.trim() || null,
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
      service_area:data.service_area,default_travel_buffer_minutes:data.default_travel_buffer_minutes,
      trial_ends_at:data.trial_ends_at,trial_days:data.trial_days,trial_promotion:data.trial_promotion,
      subscription_status:data.subscription_status
    };
    await identifyPlatformAdmin();
    const {data:linkSettings}=await supabase.rpc("get_my_public_link_settings");
    state.publicLinks=linkSettings||null;
    localStorage.setItem(OWNER_EMAIL_KEY,String(state.session?.user?.email||"").trim().toLowerCase());
    localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));
    showApp();
    setupInvoiceRealtime();
    loadCoreData().catch(err=>console.warn("[TLE] workspace load",err));
    if(state.isPlatformAdmin) loadPlatformAdmin().catch(err=>console.warn("[TLE] platform admin",err));
    try{
      const {error:notifyError}=await supabase.functions.invoke("notify-trial-start",{body:{business_id:data.id}});
      if(notifyError) console.warn("[TLE] trial welcome automation",notifyError);
    }catch(err){
      console.warn("[TLE] trial welcome automation",err);
    }
    showToast("Workspace created");
  }catch(err){
    showToast(err.message || "Could not create workspace");
  }finally{
    setBusy(button,false);
  }
});

async function initializeWorkerPortal(activationToken=null){
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
    localStorage.removeItem("tle_worker_device_token");
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
    localStorage.removeItem("tle_worker_device_token");
  localStorage.removeItem("tle_worker_token");
    workerShell.hidden=true;
    showAuth();
    showToast(error.message||"Worker access is no longer active");
    return;
  }

  state.workerPortal=data;
  renderWorkerPortal();
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
  if(ww) ww.textContent="Hi "+(worker.name||"there")+" 👋";
  if(wc) wc.textContent="Only your assigned jobs are visible here.";

  const jc=$("#workerJobCount"),tc=$("#workerTodayCount"),ts=$("#workerTimerState");
  if(jc) jc.textContent=jobs.length;
  if(tc) tc.textContent=jobs.filter(j=>sameLocalDay(j.starts_at,today)).length;
  if(ts) ts.textContent=active?"Running":"Off";

  const list=$("#workerJobsList");
  if(!list) return;
  if(!jobs.length){
    list.innerHTML=`<div class="empty-inline"><strong>No assigned jobs.</strong><span>Your owner or admin will assign jobs when they are ready.</span></div>`;
    return;
  }

  list.innerHTML=jobs.map(j=>`
    <article class="worker-job-card">
      <div class="worker-job-top">
        <span><strong>${escapeHtml(j.client_name||"Cleaning job")}</strong><small>${escapeHtml(j.service_name||"Cleaning")} · ${formatDateTime(j.starts_at)}</small></span>
        <span class="status ${j.status==="completed"?"success":j.status==="in_progress"?"warning":"neutral"}">${escapeHtml(translatedStatus(j.status))}</span>
      </div>
      <div class="worker-job-address">${escapeHtml(j.service_address||tr("Address not added"))}</div>
      ${j.client_phone?`<a class="worker-phone" href="tel:${escapeHtml(j.client_phone)}">Call client</a>`:""}
      ${j.notes?`<p class="worker-job-notes">${escapeHtml(j.notes)}</p>`:""}
      <div class="worker-job-actions">
        ${j.status!=="completed"?`<button data-worker-status-link="${j.id}" data-status="on_the_way">On my way</button><button data-worker-status-link="${j.id}" data-status="in_progress">Start job</button><button data-worker-status-link="${j.id}" data-status="completed">Complete</button>`:""}
        ${active?.job_id===j.id?`<button class="primary-btn" data-worker-time-stop="${active.id}">Finish timer</button>`:`<button class="ghost-btn" data-worker-time-start="${j.id}" ${active?"disabled":""}>Start timer</button>`}
        <button class="ghost-btn" data-worker-mileage="${j.id}">Log mileage</button>
      </div>
    </article>
  `).join("");
}

async function refreshWorkerPortal(){
  const token=localStorage.getItem("tle_worker_device_token");
  if(!token) return;
  const {data,error}=await supabase.rpc("worker_portal_context",{p_token:token});
  if(error){ localStorage.removeItem("tle_worker_device_token");
  localStorage.removeItem("tle_worker_token"); showAuth(); showToast(error.message); return; }
  state.workerPortal=data;
  renderWorkerPortal();
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

  const { data:{session} } = await supabase.auth.getSession();
  state.session = session;
  if(!session){
    const ownerEmail=rememberedOwnerEmail();
    if(ownerEmail){
      await showOwnerAccess(ownerEmail,true);
      return;
    }
    showAuth();
    setAuthMode("signin");
    setAuthStatus("");
    prepareAdminShortcut();
    return;
  }

  const signedInEmail=String(session.user?.email||"").trim().toLowerCase();

  if(rememberedOwnerEmail()===signedInEmail && ownerIdleExpired()){
    await expireOwnerSession();
    return;
  }

  if(signedInEmail===LEGACY_PLATFORM_ADMIN_EMAIL){
    try{ await supabase.auth.signOut({scope:"local"}); }catch{}
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

  try{
    await supabase.functions.invoke("sync-stripe-subscription-status",{body:{}});
  }catch(err){
    console.warn("[TLE] subscription status sync",err);
  }

  const {data:contexts,error}=await supabase.rpc("get_my_business_context");
  if(error){ showToast(error.message); showAuth(); return; }
  let context=contexts?.[0];

  if(!context && signedInEmail===PRIMARY_PLATFORM_ADMIN_EMAIL){
    const {data:b,error:businessError}=await supabase
      .from("businesses")
      .select("id,name,timezone,default_language,service_area,default_travel_buffer_minutes,trial_ends_at,subscription_status")
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

  state.business={
    id:context.business_id,
    name:context.business_name,
    email:context.business_email||state.session?.user?.email||null,
    phone:context.business_phone||null,
    role:context.role,
    team_member_id:context.team_member_id,
    timezone:context.timezone,
    default_language:context.default_language,
    service_area:context.service_area,
    default_travel_buffer_minutes:context.default_travel_buffer_minutes,
    trial_ends_at:context.trial_ends_at,
    subscription_status:context.subscription_status
  };

  if(!state.business.email || state.business.phone===null){
    try{
      const {data:companyProfile,error:companyProfileError}=await supabase
        .from("businesses")
        .select("email,phone")
        .eq("id",state.business.id)
        .single();
      if(companyProfileError) throw companyProfileError;
      if(companyProfile) state.business={...state.business,...companyProfile};
    }catch(err){
      console.warn("[TLE] company profile hydrate",err);
    }
  }

  if(state.business?.role==="owner"){
    localStorage.setItem(OWNER_EMAIL_KEY,signedInEmail);
    if(ownerIdleExpired()){
      await expireOwnerSession();
      return;
    }
    markOwnerActivity();
  }

  await handleBillingReturn(params);

  const {data:linkSettings}=await supabase.rpc("get_my_public_link_settings");
  state.publicLinks=linkSettings||null;

  showApp();
  setupInvoiceRealtime();
  showToast("Loading your workspace…");
  loadCoreData().catch(err=>console.warn("[TLE] workspace load",err));
  if(state.isPlatformAdmin) loadPlatformAdmin().catch(err=>console.warn("[TLE] platform admin",err));
  await trackVisit("/app/today");
}
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
    if(window.__tleOwnerCodeLogin) return;
    setTimeout(()=>{
      if(appShell.hidden){
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
  ["invoices","jobs","quotes","booking_requests"].forEach(function(table){
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

  const safe=async(label,promise)=>{
    try{
      const result=await withTimeout(promise,label);
      if(result?.error) throw result.error;
      return result?.data||[];
    }catch(err){
      console.warn("[TLE]",label,err);
      return [];
    }
  };

  // Load in small batches so mobile/PWA does not overwhelm the API connection pool.
  const [clients,leads,services,addons,availability]=await Promise.all([
    safe("clients",supabase.from("clients").select("*").eq("business_id",businessId).is("archived_at",null).order("created_at",{ascending:false})),
    safe("leads",supabase.from("leads").select("*").eq("business_id",businessId).is("archived_at",null).order("created_at",{ascending:false})),
    safe("services",supabase.from("services").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name")),
    safe("service add-ons",supabase.from("service_addons").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name")),
    safe("availability",supabase.from("availability_rules").select("*").eq("business_id",businessId).order("weekday").order("start_time"))
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
    safe("jobs",supabase.from("jobs").select("*, clients(name,email), services(name), job_assignments(id,team_member_id,team_members(name))").eq("business_id",businessId).order("starts_at",{ascending:true})),
    safe("quotes",supabase.from("quotes").select("*, quote_items(*)").eq("business_id",businessId).order("created_at",{ascending:false})),
    safe("team",supabase.from("team_members").select("*").eq("business_id",businessId).eq("active",true).order("name")),
    safe("supplies",supabase.from("supplies").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name")),
    safe("customer disputes",supabase.from("customer_disputes").select("*").eq("business_id",businessId).order("created_at",{ascending:false}))
  ]);
  state.jobs=jobs;
  state.quotes=quotes;
  state.teamMembers=team;
  state.supplies=supplies;
  state.disputes=disputes;
  renderJobs();
  renderQuotes();
  renderTeam();
  renderSupplies();

  const [invoices,bookingRequests,mileageLogs,timeEntries]=await Promise.all([
    safe("invoices",supabase.from("invoices").select("*, clients(name,email), invoice_items(*), payments(method,amount,status,paid_at)").eq("business_id",businessId).order("created_at",{ascending:false})),
    safe("booking requests",supabase.from("booking_requests").select("*, services(name)").eq("business_id",businessId).order("created_at",{ascending:false})),
    safe("mileage",supabase.from("mileage_logs").select("*, jobs(service_address,clients(name),services(name))").eq("business_id",businessId).order("log_date",{ascending:false})),
    safe("time tracking",supabase.from("job_time_entries").select("*, jobs(starts_at,duration_minutes,status,clients(name),services(name)), team_members(name)").eq("business_id",businessId).order("clocked_in_at",{ascending:false}))
  ]);
  state.invoices=invoices;
  state.bookingRequests=bookingRequests;
  state.mileageLogs=mileageLogs;
  state.timeEntries=timeEntries;
  renderInvoices();
  renderTodaySummary();
  renderOperations();
  renderSettings();
  renderPublicLinks();
  loadBusinessWeather(false).catch(function(err){console.warn("[TLE] weather load",err);});

  if(state.business.role==="owner"){
    loadOwnerAdmin().catch(err=>console.warn("[TLE] owner admin",err));
  }
}

async function loadOwnerAdmin(){
  $("[data-account-billing]").forEach(el=>{
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
    <div class="table-row">
      <span><strong>${escapeHtml(l.name)}</strong><small>${escapeHtml(l.email)}</small></span>
      <span>${escapeHtml(l.source||"—")}</span>
      <span>${escapeHtml(l.service_interest||"—")}</span>
      <span><i class="status ${l.status==="new"?"blue":l.status==="booked"?"success":l.status==="lost"?"danger":"neutral"}">${escapeHtml(l.status)}</i></span>
      <span class="record-actions"><button data-edit-lead="${l.id}">Edit</button><button data-lead-to-quote="${l.id}">Quote</button><button class="danger-link" data-archive-lead="${l.id}">Archive</button></span>
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
    const methodLabel={cash:"Cash",check:"Check",zelle:"Zelle"}[chosenMethod]||"";
    const dispute=state.disputes.find(d=>d.resource_type==="invoice"&&d.invoice_id===inv.id&&d.status==="open");
    const overdue=inv.due_at && new Date(inv.due_at)<new Date() && !["paid","void"].includes(inv.status);
    const statusClass=inv.status==="paid"?"success":overdue?"danger":inv.status==="sent"||inv.status==="partial"?"warning":"neutral";
    return `<div class="table-row">
      <span><strong>#${inv.invoice_number||String(inv.id).slice(0,6)}</strong><small>${inv.due_at?"Due "+new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(inv.due_at)):"No due date"}</small></span>
      <span>${escapeHtml(inv.clients?.name||"No client")}</span>
      <span><strong>${money(inv.total)}</strong><small>${paid?money(paid)+" paid":""}</small></span>
      <span><i class="status ${statusClass}">${overdue?"overdue":escapeHtml(inv.status)}</i>${methodLabel?`<small class="payment-choice-note">Customer chose ${escapeHtml(methodLabel)}</small>`:""}${dispute?`<small class="dispute-alert">OPEN DISPUTE · ${escapeHtml(dispute.reason)}</small>`:""}</span>
      <span class="record-actions">
        <button data-edit-invoice="${inv.id}">Edit</button>
        ${dispute?`<button data-resolve-dispute="${dispute.id}">Resolve dispute</button>`:""}
        ${inv.status==="draft"?`<button data-send-invoice="${inv.id}">Send invoice</button>`:""}
        ${!["paid","void"].includes(inv.status)?`<button data-record-payment="${inv.id}">${lastMethod?"Add payment":methodLabel?"Confirm payment":"Record payment"}</button>`:""}
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
  grid.innerHTML=state.teamMembers.map(tm=>`
    <article class="client-card">
      <div class="client-avatar">${escapeHtml(initials(tm.name))}</div>
      <strong>${escapeHtml(tm.name)}</strong>
      <span>${escapeHtml(tm.role||"cleaner")}</span>
      <small>${escapeHtml(tm.email||tm.phone||"No contact saved")}</small>
      <div class="card-actions">
        <button data-team-edit="${tm.id}">Edit</button>
        ${isOwner?`<button data-worker-link="${tm.id}">Share worker link</button><button class="danger-link" data-worker-revoke="${tm.id}">Revoke link</button>`:""}
      </div>
    </article>
  `).join("")+`<article class="client-card add-card" data-team-create><div>＋</div><strong>Add worker</strong><span>Assign jobs and share limited access.</span></article>`;
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
      <div class="card-actions">
        <button data-edit="client" data-id="${c.id}">Edit</button>
        <button class="danger-link" data-archive-client="${c.id}">Archive</button>
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
      const stateCopy=status==="accepted"
        ? "Client + job + invoice created"
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
        <div class="card-actions">
          ${dispute?`<button data-resolve-dispute="${dispute.id}">Resolve dispute</button>`:""}
          ${!["accepted"].includes(status)?`<button data-edit="quote" data-id="${q.id}">Edit</button>`:""}
          ${["requested","draft","declined"].includes(status)?`<button class="accept-btn" data-send-customer-quote="${q.id}">Send quote</button>`:""}
          ${status==="sent"?`<button data-send-customer-quote="${q.id}">Resend quote</button>`:""}
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

function sameLocalDay(value,date=new Date()){
  if(!value) return false;
  const d=new Date(value);
  return d.getFullYear()===date.getFullYear() && d.getMonth()===date.getMonth() && d.getDate()===date.getDate();
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

function renderTodaySummary(){
  const now=new Date();
  const todayJobs=state.jobs.filter(j=>sameLocalDay(j.starts_at,now)&&j.status!=="canceled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const openQuotes=state.quotes.filter(q=>["requested","draft","sent"].includes(q.status));
  const outstanding=state.invoices.filter(i=>i.status!=="void").reduce((sum,i)=>sum+Math.max(0,Number(i.total||0)-confirmedPaid(i)),0);
  const pendingBookings=state.bookingRequests.filter(b=>b.status==="requested");

  const cards=$$(".metric-card", $('[data-page="today"]'));
  if(cards[0]){
    cards[0].querySelector("strong").textContent=todayJobs.length;
    const completed=todayJobs.filter(j=>j.status==="completed").length;
    cards[0].querySelector("small").textContent=todayJobs.length
      ? (appIsSpanish() ? `${completed} completados` : `${completed} completed`)
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
  const momentIcon=$("#todayMomentIcon");
  const momentCopy=$("#todayMomentCopy");
  const heroAction=$("#todayHeroAction");
  if(greet){
    const hour=now.getHours();
    const isMorning=hour<12;
    const isAfternoon=hour>=12 && hour<18;
    const moment=isMorning?"morning":isAfternoon?"afternoon":"night";
    const remainingJobs=todayJobs.filter(function(j){
      return j.status!=="completed" && new Date(j.starts_at).getTime()>=now.getTime()-60*60*1000;
    });
    const tomorrow=new Date(now);
    tomorrow.setDate(tomorrow.getDate()+1);
    const tomorrowJobs=state.jobs.filter(function(j){
      return sameLocalDay(j.starts_at,tomorrow)&&j.status!=="canceled";
    });
    const rain=state.weather&&state.weather.nextRain||null;
    const rainSoon=rain&&rain.hoursAhead<=12;
    const rainTomorrow=rain&&rain.hoursAhead>12&&rain.hoursAhead<=36;
    const temp=Math.round(Number(state.weather&&state.weather.current&&state.weather.current.temperature_2m));

    hero?.classList.remove("moment-morning","moment-afternoon","moment-night");
    hero?.classList.add("moment-"+moment);

    let copy="";
    let actionView="calendar";
    let actionText="";

    if(isMorning){
      greet.textContent=appIsSpanish()?"Buenos días":"Good morning";
      if(momentIcon) momentIcon.textContent="☀️";

      if(rainSoon){
        copy=appIsSpanish()
          ? "Tienes "+todayJobs.length+" trabajo"+(todayJobs.length===1?"":"s")+" hoy. Lluvia cerca de las "+weatherClockLabel(rain.hour)+"; deja un poco más de tiempo entre paradas."
          : "You have "+todayJobs.length+" job"+(todayJobs.length===1?"":"s")+" today. Rain is likely around "+weatherClockLabel(rain.hour)+"; leave a little extra time between stops.";
        actionView="route";
      }else if(todayJobs.length){
        const first=todayJobs[0];
        const firstTime=new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit"}).format(new Date(first.starts_at));
        copy=appIsSpanish()
          ? "Tienes "+todayJobs.length+" trabajo"+(todayJobs.length===1?"":"s")+" hoy. Tu primera parada es a las "+firstTime+"."
          : "You have "+todayJobs.length+" job"+(todayJobs.length===1?"":"s")+" today. Your first stop is at "+firstTime+".";
        actionView="route";
      }else if(pendingBookings.length){
        copy=appIsSpanish()
          ? "Hoy está tranquilo. Tienes "+pendingBookings.length+" solicitud"+(pendingBookings.length===1?"":"es")+" esperando."
          : "Today is light. You have "+pendingBookings.length+" booking request"+(pendingBookings.length===1?"":"s")+" waiting.";
        actionView="booking";
      }else{
        copy=appIsSpanish()
          ? "Hoy está ligero. Buen momento para organizar reservas y preparar el día."
          : "Today looks light. A good moment to organize bookings and set up the day.";
        actionView="booking";
      }
      actionText=appIsSpanish()?(actionView==="route"?"Ver ruta de hoy →":"Ver reservas →"):(actionView==="route"?"View today’s route →":"View bookings →");
    }else if(isAfternoon){
      greet.textContent=appIsSpanish()?"Buenas tardes":"Good afternoon";
      if(momentIcon) momentIcon.textContent="💧";

      if(rainSoon){
        copy=appIsSpanish()
          ? "Te quedan "+remainingJobs.length+" trabajo"+(remainingJobs.length===1?"":"s")+". Lluvia probable cerca de las "+weatherClockLabel(rain.hour)+"; revisa la próxima ruta antes de salir."
          : "You have "+remainingJobs.length+" job"+(remainingJobs.length===1?"":"s")+" left. Rain is likely around "+weatherClockLabel(rain.hour)+"; check the next route before heading out.";
        actionView="route";
      }else if(remainingJobs.length){
        copy=appIsSpanish()
          ? "Te quedan "+remainingJobs.length+" trabajo"+(remainingJobs.length===1?"":"s")+" hoy. Hidrátate y revisa la próxima parada."
          : "You have "+remainingJobs.length+" job"+(remainingJobs.length===1?"":"s")+" left today. Grab some water and check the next stop.";
        actionView="route";
      }else if(pendingBookings.length){
        copy=appIsSpanish()
          ? "Terminaste la ruta. Tienes "+pendingBookings.length+" solicitud"+(pendingBookings.length===1?"":"es")+" por revisar."
          : "The route is clear. You have "+pendingBookings.length+" booking request"+(pendingBookings.length===1?"":"s")+" to review.";
        actionView="booking";
      }else if(Number.isFinite(temp)&&temp>=88){
        copy=appIsSpanish()
          ? "La ruta está tranquila y hace "+temp+"°F afuera. Toma agua y cierra lo pendiente con calma."
          : "The route is quiet and it’s "+temp+"°F outside. Grab some water and wrap up what’s left.";
        actionView="today";
      }else{
        copy=appIsSpanish()
          ? "Vas al día. Revisa lo pendiente y deja mañana un poco más fácil."
          : "You’re caught up. Check what’s left and make tomorrow a little easier.";
        actionView="today";
      }
      actionText=appIsSpanish()?(actionView==="route"?"Ver próxima ruta →":actionView==="booking"?"Revisar solicitudes →":"Ver pendientes →"):(actionView==="route"?"View next route →":actionView==="booking"?"Review requests →":"View priorities →");
    }else{
      greet.textContent=appIsSpanish()?"Buenas noches":"Good evening";
      if(momentIcon) momentIcon.textContent="🌙";

      if(rainTomorrow){
        copy=appIsSpanish()
          ? "Mañana tienes "+tomorrowJobs.length+" trabajo"+(tomorrowJobs.length===1?"":"s")+" y puede llover. Deja la primera ruta lista y luego descansa."
          : "You have "+tomorrowJobs.length+" job"+(tomorrowJobs.length===1?"":"s")+" tomorrow and rain may be coming. Set up the first route, then rest.";
      }else if(tomorrowJobs.length){
        copy=appIsSpanish()
          ? "Mañana tienes "+tomorrowJobs.length+" trabajo"+(tomorrowJobs.length===1?"":"s")+". Revisa la primera dirección y luego desconecta."
          : "You have "+tomorrowJobs.length+" job"+(tomorrowJobs.length===1?"":"s")+" tomorrow. Check the first address, then switch off.";
      }else if(pendingBookings.length||openQuotes.length){
        const count=pendingBookings.length+openQuotes.length;
        copy=appIsSpanish()
          ? "Tienes "+count+" pendiente"+(count===1?"":"s")+" para mañana. Organízalo ahora y luego descansa."
          : "You have "+count+" item"+(count===1?"":"s")+" waiting for tomorrow. Organize them now, then rest.";
      }else{
        copy=appIsSpanish()
          ? "Todo está tranquilo. Organiza mañana, cierra la app y descansa."
          : "Everything looks quiet. Set up tomorrow, close the app and get some rest.";
      }
      actionView="calendar";
      actionText=appIsSpanish()?"Planear mañana →":"Plan tomorrow →";
    }

    if(momentCopy) momentCopy.textContent=copy;
    if(heroAction){
      heroAction.textContent=actionText;
      heroAction.dataset.jump=actionView==="today"?"calendar":actionView;
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
      items.push(`<button data-jump="quotes"><span class="dot yellow"></span><strong>${escapeHtml(appIsSpanish()?"Cotización para":"Quote for")} ${escapeHtml(q.customer_name)}</strong><small>${escapeHtml(tr("Waiting for response"))}</small></button>`);
    });
    if(pendingBookings.length) items.push(`<button data-jump="booking"><span class="dot blue"></span><strong>${pendingBookings.length} ${appIsSpanish()?(pendingBookings.length===1?"solicitud":"solicitudes"):(pendingBookings.length===1?"booking request":"booking requests")}</strong><small>${escapeHtml(tr("Waiting for review"))}</small></button>`);
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
    wh.textContent=appIsSpanish()?`${hours} h trabajadas`:`${hours} work hours`;
  }
  const ws=$("#weekSummary");
  if(ws){
    ws.textContent=appIsSpanish()
      ? `${weekMiles.toFixed(1)} mi · ${weekCompleted} trabajo${weekCompleted===1?"":"s"} completado${weekCompleted===1?"":"s"}`
      : `${weekMiles.toFixed(1)} business miles logged · ${weekCompleted} completed job${weekCompleted===1?"":"s"}.`;
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

  const routePill=$("#routeMileagePill"); if(routePill) routePill.textContent=appIsSpanish()?todayMiles.toFixed(1)+" mi hoy":todayMiles.toFixed(1)+" mi today";
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
  if(mt) mt.textContent=todayMiles.toFixed(1)+" mi";
  if(mw) mw.textContent=weekMiles.toFixed(1)+" mi";
  if(mm) mm.textContent=monthMiles.toFixed(1)+" mi";
  const mileageTable=$("#mileageTable");
  if(mileageTable){
    mileageTable.innerHTML=state.mileageLogs.length?state.mileageLogs.map(m=>`
      <div class="table-row">
        <span>${new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(m.log_date+"T12:00:00"))}</span>
        <span>${escapeHtml(m.notes||tr("Business drive"))}</span>
        <span>${Number(m.miles||0).toFixed(1)}</span>
        <span>${escapeHtml(m.jobs?.clients?.name||m.jobs?.services?.name||"—")}</span>
        <span>Business</span>
      </div>`).join(""):`<div class="empty-table"><strong>No mileage logged yet.</strong><span>Use “Log drive” after a business trip.</span></div>`;
  }

  const active=state.timeEntries.find(t=>!t.clocked_out_at);
  const timerWrap=$("#activeTimerWrap");
  if(timerWrap){
    timerWrap.innerHTML=active?`<article class="timer-card"><span>Current job</span><h3>${escapeHtml(active.jobs?.clients?.name||active.jobs?.services?.name||"Job")}</h3><strong>Running</strong><div><button class="ghost-btn" data-finish-time="${active.id}">Finish timer</button></div></article>`:`<div class="empty-inline timer-empty"><strong>No timer running.</strong><span>Start time from an assigned job when work begins.</span></div>`;
  }
  const timeTable=$("#timeEntriesTable");
  if(timeTable){
    timeTable.innerHTML=state.timeEntries.length?state.timeEntries.map(t=>`
      <div class="table-row">
        <span>${escapeHtml(t.jobs?.clients?.name||t.jobs?.services?.name||"Job")}</span>
        <span>${escapeHtml(t.team_members?.name||"Owner")}</span>
        <span>${t.jobs?.duration_minutes?Math.round(t.jobs.duration_minutes/60*10)/10+"h":"—"}</span>
        <span>${t.minutes_worked!=null?(Number(t.minutes_worked)/60).toFixed(1).replace(".0","")+"h":t.clocked_out_at?"—":"Running"}</span>
        <span><i class="status ${t.clocked_out_at?"success":"warning"}">${t.clocked_out_at?"Complete":"Running"}</i></span>
      </div>`).join(""):`<div class="empty-table"><strong>No time entries yet.</strong><span>Time worked will appear here.</span></div>`;
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
  const pending=state.bookingRequests.filter(b=>b.status==="requested");
  if(pill) pill.textContent=pending.length+" new";
  if(!list) return;
  if(!state.bookingRequests.length){
    list.innerHTML=`<div class="empty-inline"><strong>No booking requests yet.</strong><span>Share your booking link to receive requests here.</span></div>`;
    return;
  }
  list.innerHTML=state.bookingRequests.slice(0,20).map(b=>`
    <div class="booking-request-row">
      <div><strong>${escapeHtml(b.customer_name)}</strong><small>${escapeHtml(b.services?.name||"Cleaning")} · ${formatDateTime(b.requested_start_at)} · ${escapeHtml(b.service_address)}</small></div>
      <div class="record-actions">
        <span class="status ${b.status==="requested"?"warning":b.status==="converted"?"success":"neutral"}">${escapeHtml(b.status)}</span>
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
    timezone:state.business.timezone||"America/New_York",
    default_language:state.business.default_language||"en"
  };

  try{
    const {data,error}=await supabase
      .from("businesses")
      .select("name,email,phone,service_area,timezone,default_language")
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
      <label>Service area<input name="service_area" value="${escapeHtml(record.service_area||"")}" placeholder="City, county or service radius"></label>
      <label>Time zone<select name="timezone" required>
        <option value="America/New_York" ${record.timezone==="America/New_York"?"selected":""}>Eastern Time</option>
        <option value="America/Chicago" ${record.timezone==="America/Chicago"?"selected":""}>Central Time</option>
        <option value="America/Denver" ${record.timezone==="America/Denver"?"selected":""}>Mountain Time</option>
        <option value="America/Los_Angeles" ${record.timezone==="America/Los_Angeles"?"selected":""}>Pacific Time</option>
        <option value="America/Phoenix" ${record.timezone==="America/Phoenix"?"selected":""}>Arizona Time</option>
        <option value="America/Anchorage" ${record.timezone==="America/Anchorage"?"selected":""}>Alaska Time</option>
        <option value="Pacific/Honolulu" ${record.timezone==="Pacific/Honolulu"?"selected":""}>Hawaii Time</option>
      </select></label>
      <label>Default language<select name="default_language" required>
        <option value="en" ${record.default_language==="en"?"selected":""}>English</option>
        <option value="es" ${record.default_language==="es"?"selected":""}>Español</option>
      </select></label>
    </div>
    ${formSubmit("Save business details")}`;
  modal.hidden=false;
}

async function saveBusinessProfile(fd){
  if(!state.business || state.business.role!=="owner"){
    throw new Error("Owner access required.");
  }

  const payload={
    name:String(fd.get("name")||"").trim(),
    email:String(fd.get("email")||"").trim().toLowerCase(),
    phone:String(fd.get("phone")||"").trim()||null,
    service_area:String(fd.get("service_area")||"").trim()||null,
    timezone:String(fd.get("timezone")||"America/New_York"),
    default_language:String(fd.get("default_language")||"en"),
    updated_at:new Date().toISOString()
  };

  if(!payload.name) throw new Error("Business name is required.");
  if(!payload.email) throw new Error("Business email is required.");

  const {data,error}=await supabase
    .from("businesses")
    .update(payload)
    .eq("id",state.business.id)
    .select("name,email,phone,service_area,timezone,default_language")
    .single();

  if(error) throw error;

  state.business={...state.business,...data};
  if(window.TLE_I18N?.setLanguage && ["en","es"].includes(data.default_language)){
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
        tz=$("#settingsBusinessTimezone"),
        lang=$("#settingsBusinessLanguage"),
        b=$("#settingsTravelBuffer"),
        m=$("#settingsBookingNotice"),
        r=$("#settingsReplyEmail");
  if(n) n.textContent=state.business?.name||"—";
  if(e) e.textContent=state.business?.email||state.session?.user?.email||"—";
  if(p) p.textContent=state.business?.phone||"Not set";
  if(a) a.textContent=state.business?.service_area||"Not set";
  if(tz) tz.textContent=state.business?.timezone||"America/New_York";
  if(lang) lang.textContent=(state.business?.default_language||"en")==="es"?"Español":"English";
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
}

async function loadPlatformAdmin(){
  if(!state.isPlatformAdmin) return;
  const [{data,error},{data:geoData,error:geoError}]=await Promise.all([
    supabase.rpc("get_platform_admin_dashboard"),
    supabase.rpc("get_platform_visit_geo_dashboard")
  ]);
  if(error){ showToast(error.message); return; }
  if(geoError) console.warn("[TLE] visitor geo",geoError);
  state.platformAdminData={...(data||{}),...(geoData||{})};
  const m=data?.metrics||{};
  const ids=[["#platformCustomers",m.customers],["#platformTrials",m.trials],["#platformActive",m.active_subscribers],["#platformVisits",m.visits_30d],["#platformUnique",m.unique_visitors_30d]];
  ids.forEach(([sel,val])=>{const el=$(sel);if(el)el.textContent=val??0;});

  const table=$("#platformCustomersTable");
  if(table){
    const customers=data?.customers||[];
    table.innerHTML=customers.length?customers.map(x=>`
      <div class="platform-customer-row">
        <div><strong>${escapeHtml(x.business_name||"Cleaning business")}</strong><small>${escapeHtml(x.email||"")} · Joined ${new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",year:"numeric"}).format(new Date(x.created_at))} · ${x.trial_promotion==="landing_setup"?"60-day Landing promo":"30-day standard trial"}</small><button class="ghost-btn" type="button" data-landing-promo="${x.business_id}" ${x.trial_promotion==="landing_setup"?"disabled":""}>${x.trial_promotion==="landing_setup"?"60-day promo active":"Grant 60-day Landing promo"}</button></div>
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

  const visits=$("#platformRecentVisits");
  if(visits){
    const rows=geoData?.recent_geo_visits||data?.recent_visits||[];
    visits.innerHTML=rows.length?rows.map(v=>`
      <div class="visit-row">
        <span>
          <strong>${escapeHtml(v.business_name||"Visitor")}</strong>
          <small>${escapeHtml(v.page||"/")}${v.state?" · "+escapeHtml(v.state_code||v.state):""}${v.city?" · "+escapeHtml(v.city):""}</small>
        </span>
        <time>${formatDateTime(v.created_at)}</time>
      </div>`).join(""):`<div class="empty-inline"><strong>No external visits yet.</strong><span>Your own visits do not count.</span></div>`;
  }
}

async function initializePublicRequest(mode,slug){
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
      timeZone:data?.business?.timezone||"America/New_York",
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
    dateInput.min=new Intl.DateTimeFormat("en-CA",{timeZone:data?.business?.timezone||"America/New_York"}).format(new Date());
    const maxDate=new Date(Date.now()+90*86400000);
    dateInput.max=new Intl.DateTimeFormat("en-CA",{timeZone:data?.business?.timezone||"America/New_York"}).format(maxDate);
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
    modalHeader("INVOICE",record?"Edit invoice":"New invoice","Track payment manually with Cash, Check or Zelle.");
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
        <label>State<input name="state" value="${escapeHtml(record?.state||"")}"></label>
        <label>ZIP<input name="postal_code" value="${escapeHtml(record?.postal_code||"")}"></label>
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
    modalHeader("MILEAGE",record?"Edit drive":"Log drive","Record business miles for a job or business trip.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Date<input name="log_date" type="date" required value="${new Date().toLocaleDateString("en-CA")}"></label>
        <label>Miles<input name="miles" type="number" min="0.1" step="0.1" required></label>
        <label class="full">Job<select name="job_id"><option value="">No specific job</option>${optionList(state.jobs.filter(j=>j.status!=="canceled"),"id","service_address",null)}</select></label>
        <label class="full">From → To / note<input name="notes" placeholder="Office → client, supply store trip…"></label>
      </div>${formSubmit("Save mileage")}`;
  }

  if(type==="job"){
    const local=record?.starts_at?new Date(record.starts_at):null;
    const date=local?local.toLocaleDateString("en-CA"):"";
    const time=local?local.toTimeString().slice(0,5):"";
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
      showToast("Feedback sent. Thank you!");
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
  const methodLabel={cash:"Cash",check:"Check",zelle:"Zelle"}[chosen]||"";
  state.modalType="payment";state.modalId=invoiceId;
  modalHeader("PAYMENT","Record payment",`Invoice #${inv.invoice_number||String(inv.id).slice(0,6)} · ${money(remaining)} remaining`);
  entityForm.innerHTML=`
    ${methodLabel?`<p class="helper"><strong>Customer chose: ${escapeHtml(methodLabel)}</strong></p>`:""}
    <div class="form-grid">
      <label>Amount<input name="amount" type="number" min="0.01" step="0.01" max="${remaining}" required value="${remaining}"></label>
      <label>Method<select name="method">
        <option value="cash" ${chosen==="cash"?"selected":""}>Cash</option>
        <option value="check" ${chosen==="check"?"selected":""}>Check</option>
        <option value="zelle" ${chosen==="zelle"?"selected":""}>Zelle</option>
      </select></label>
      <label class="full">Note / reference<textarea name="note" placeholder="Check number, Zelle note, or cash note"></textarea></label>
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
    miles:Number(fd.get("miles")||0),
    notes:String(fd.get("notes")||"").trim()||null
  };
  if(payload.miles<=0) throw new Error("Enter miles greater than 0.");
  const {error}=await supabase.from("mileage_logs").insert(payload);
  if(error) throw error;
}

async function saveJob(fd){
  const starts=new Date(`${fd.get("date")}T${fd.get("time")}:00`);
  if(Number.isNaN(starts.getTime())) throw new Error("Choose a valid date and time.");
  const payload={
    business_id:state.business.id,
    client_id:fd.get("client_id")||null,
    service_id:fd.get("service_id")||null,
    status:fd.get("status"),
    service_address:String(fd.get("service_address")).trim(),
    starts_at:starts.toISOString(),
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
  if(!Number.isFinite(price) || price<=0) throw new Error("Quote price must be greater than $0.");

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
  const entry=state.timeEntries.find(t=>t.id===id);
  if(!entry) return;
  const end=new Date();
  const start=new Date(entry.clocked_in_at);
  const minutes=Math.max(1,Math.round((end-start)/60000));
  const {error}=await supabase.from("job_time_entries").update({
    clocked_out_at:end.toISOString(),
    minutes_worked:minutes
  }).eq("id",id);
  if(error) throw error;
}

document.addEventListener("click",async e=>{
  const create=e.target.closest("[data-create]");
  const action=e.target.closest("[data-action]");
  const edit=e.target.closest("[data-edit]");
  const teamCreate=e.target.closest("[data-team-create]");
  const teamEdit=e.target.closest("[data-team-edit]");
  if(teamCreate){ openTeamForm(); return; }
  if(teamEdit){ openTeamForm(teamEdit.dataset.teamEdit); return; }

  const landingPromo=e.target.closest("[data-landing-promo]");
  if(landingPromo){
    setBusy(landingPromo,true,"Applying…");
    try{
      const businessId=landingPromo.dataset.landingPromo;
      const {error}=await supabase.rpc("platform_apply_landing_trial_promo",{p_business_id:businessId});
      if(error) throw error;

      const {error:notifyError}=await supabase.functions.invoke("notify-trial-start",{body:{business_id:businessId}});
      if(notifyError) throw notifyError;

      await loadPlatformAdmin();
      showToast("60-day Landing promo applied");
    }catch(err){
      showToast(err?.message||"Could not apply the 60-day promo");
    }finally{
      setBusy(landingPromo,false);
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
    const {error}=await supabase.rpc("worker_portal_stop_time",{p_token:token,p_entry_id:workerTimeStop.dataset.workerTimeStop});
    if(error) showToast(error.message); else {await refreshWorkerPortal();showToast("Timer finished");}
    return;
  }

  const workerMileage=e.target.closest("[data-worker-mileage]");
  if(workerMileage){
    const raw=window.prompt("Miles driven for this job:");
    if(raw===null) return;
    const miles=Number(raw);
    if(!Number.isFinite(miles)||miles<=0){showToast("Enter valid miles");return;}
    const token=localStorage.getItem("tle_worker_device_token");
    const {error}=await supabase.rpc("worker_portal_log_mileage",{p_token:token,p_job_id:workerMileage.dataset.workerMileage,p_miles:miles,p_notes:null});
    if(error) showToast(error.message); else showToast("Mileage saved");
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

  const approveBooking=e.target.closest("[data-approve-booking]");
  if(approveBooking){
    approveBooking.disabled=true;
    const {error}=await supabase.rpc("approve_booking_request",{p_request_id:approveBooking.dataset.approveBooking});
    approveBooking.disabled=false;
    if(error) showToast(error.message); else {await loadCoreData();showToast("Booking approved · client, job and invoice created");}
    return;
  }

  const declineBooking=e.target.closest("[data-decline-booking]");
  if(declineBooking){
    const {error}=await supabase.rpc("decline_booking_request",{p_request_id:declineBooking.dataset.declineBooking});
    if(error) showToast(error.message); else {await loadCoreData();showToast("Booking request declined");}
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

async function copyText(text){
  try{await navigator.clipboard.writeText(text);showToast("Link copied");}
  catch{showToast("Copy unavailable here");}
}
$$("[data-copy-target]").forEach(btn=>btn.addEventListener("click",()=>copyText($("#"+btn.dataset.copyTarget).textContent.trim())));
$("#copyBooking").addEventListener("click",()=>copyText($("#bookingUrl").textContent.trim()));

document.addEventListener("click",e=>{
  const publicOpen=e.target.closest("[data-open-public]");
  if(!publicOpen) return;
  const link=publicOpen.dataset.openPublic==="book" ? $("#bookingUrl")?.href : $("#quoteUrl")?.href;
  if(link) window.open(link,"_blank","noopener");
});

$("#languageBtn").addEventListener("click",()=>{ window.TLE_I18N?.toggle(); });
document.addEventListener("keydown",e=>{if(e.key==="Escape"){modal.hidden=true;sidebar.classList.remove("open")}});

if("serviceWorker" in navigator){
  window.addEventListener("load",async ()=>{
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }catch{}
  });
}
if("caches" in window){
  caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
}

window.__tleAppReady=true;
setAuthMode("signin");
initialize().catch(err=>{
  console.error("[TLE] initialize failed",err);
  showAuth();
  setAuthStatus(err?.message||"The app could not finish loading. Please refresh.","error");
});

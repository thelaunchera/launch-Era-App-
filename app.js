(()=>{
if(!window.supabase){
  document.documentElement.dataset.appError="supabase-load-failed";
  throw new Error("Supabase browser library failed to load");
}
const { createClient } = window.supabase;

const SUPABASE_URL = "https://bowacxhmjvrqixtwaikv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0TueitFYiRF3rAEMLMT8-w_FvbvY0rB";
const OWNER_IDLE_MS = 12 * 60 * 60 * 1000;
const OWNER_HOME_IDLE_MS = 2 * 60 * 1000;
const OWNER_ACTIVITY_KEY = "tle_owner_last_activity";
const OWNER_HOME_ACTIVITY_KEY = "tle_owner_home_last_activity";
const OWNER_EMAIL_KEY = "tle_owner_email";
const REMEMBER_USERNAME_KEY = "tle_remember_username_v1";
const OWNER_REAUTH_REQUIRED_KEY = "tle_owner_reauth_required";
const OWNER_SESSION_BACKUP_KEY = "tle_owner_session_backup_v1";
const APP_VERSION = "20260930-owner-risk-227";
const OWNER_VAPID_PUBLIC_KEY = "BB9XfHdmXh6AvKzGhjUEDjDWZQwoTmrYedFcQHNpQWxqGsmiuat_5p3IEGrhpWN-nvTHd2ti_tYVPPZxq9fPIuM";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY,{
  auth:{
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:true,
    storage:window.localStorage
  }
});

const state = {
  session: null,
  business: null,
  clients: [],
  leads: [],
  invoices: [],
  bookingRequests: [],
  emailDeliveryIssues: [],
  mileageLogs: [],
  timeEntries: [],
  services: [],
  serviceAddons: [],
  availabilityRules: [],
  recurrenceRules: [],
  supplies: [],
  jobs: [],
  quotes: [],
  followUpTasks: [],
  followUpPreferences: null,
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
  modalId: null,
  coreDataLoadedFor: null
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const authShell = $("#authShell");
const workerShell = $("#workerShell");
const publicShell = $("#publicShell");
const appShell = $("#appShell");
const authPanel = $("#authPanel");
const authWelcome = $("#authWelcome");
const businessSetup = $("#businessSetup");
const authForm = $("#authForm");
const businessForm = $("#businessForm");
const entityForm = $("#entityForm");
const modal = $("#modalBackdrop");
const sessionSplash=$("#sessionSplash");
function dismissSessionSplash(){
  if(!sessionSplash || sessionSplash.hidden) return;
  sessionSplash.classList.add("is-leaving");
  setTimeout(()=>{
    sessionSplash.hidden=true;
    sessionSplash.classList.remove("is-leaving");
  },180);
}

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
  const start=e.target.closest?.("#authWelcomeStart");
  if(start){ e.preventDefault(); openAuthFromWelcome("signup"); return; }
  const signIn=e.target.closest?.("#authWelcomeSignIn");
  if(signIn){ e.preventDefault(); openAuthFromWelcome("signin"); return; }
  const back=e.target.closest?.("#authBackWelcome");
  if(back){
    e.preventDefault();
    if(!window.__tleAuthWelcomeSessionActive){ prepareDirectAuth(); return; }
    authPanel.hidden=true;
    authShell?.classList.remove("auth-form-open");
    if(authWelcome) authWelcome.hidden=false;
    setAuthStatus("");
    requestAnimationFrame(()=>{try{authWelcome?.focus?.({preventScroll:true});}catch{}});
    return;
  }
  const toggle=e.target.closest?.("#authPasswordToggle");
  if(!toggle) return;
  e.preventDefault();
  toggleAuthPasswordVisibility();
},true);
window.__tleAuthUiReady=true;

const pageTitles = {
  today:"Today", booking:"Booking Center", leads:"Leads", clients:"Clients",
  calendar:"Calendar + Jobs", quotes:"Quotes", invoices:"Invoices", followups:"Follow-ups",
  route:"Today's Route", mileage:"Mileage", time:"Time Tracking",
  reports:"Owner Reports", services:"Services + Add-ons", supplies:"Supplies", team:"Team", settings:"Settings", admin:"Owner Admin", "platform-admin":"Owner View", help:"Help & FAQ"
};


const ONBOARDING_VERSION=1;
const ONBOARDING_COPY=window.TLE_ONBOARDING_COPY||{};
const ONBOARDING_EXTRA=window.TLE_ONBOARDING_EXTRA||{};

function onboardingLanguage(){
  const language=String(window.TLE_I18N?.language||localStorage.getItem("tle_language")||"en").toLowerCase();
  return ["en","es","fr","ht"].includes(language)?language:"en";
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
    // Feature tips appear only when the user actually opens a section.
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
    ? ({es:"Te daremos ayuda corta cuando abras una sección por primera vez.",ht:"W ap wè yon ti konsèy lè ou louvri yon seksyon pou premye fwa.",fr:"Une courte astuce apparaîtra lors de votre première visite dans une section.",en:"You’ll get one short tip when you open a section for the first time."}[lang]||"You’ll get one short tip when you open a section for the first time.")
    : ({es:"Solo la primera vez.",ht:"Sèlman premye fwa.",fr:"Seulement la première fois.",en:"First visit only."}[lang]||"First visit only.");
  $("#onboardingDoneBtn",layer).textContent=isWelcome
    ? ({es:"Empezar recorrido",ht:"Kòmanse gid",fr:"Commencer le guide",en:"Start tour"}[lang]||"Start tour")
    : ({es:"Entendido",ht:"Mwen konprann",fr:"Compris",en:"Got it"}[lang]||"Got it");
  $("#onboardingSkipBtn",layer).hidden=isWelcome;
  if(!isWelcome) $("#onboardingSkipBtn",layer).textContent=({es:"No mostrar más tips",ht:"Pa montre konsèy ankò",fr:"Ne plus afficher les astuces",en:"Hide tips"}[lang]||"Hide tips");
  $("#onboardingCloseBtn",layer).setAttribute("aria-label",({es:"Cerrar",ht:"Fèmen",fr:"Fermer",en:"Close"}[lang]||"Close"));
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
  // New owners should land directly on Today and get one clear first action.
  // Mark the welcome step complete so contextual first-visit tips still work
  // when they intentionally open a section such as Booking.
  progress.welcome=true;
  progress.disabled=false;
  saveOnboardingState(progress);
  clearSignupWelcomeMarker().catch(()=>{});
  renderFirstWin();
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

function authPreferredLanguage(){
  const lang=String(
    window.TLE_I18N?.language ||
    state.business?.default_language ||
    state.session?.user?.user_metadata?.preferred_language ||
    "en"
  ).trim().toLowerCase();
  return ["en","es","fr","ht"].includes(lang)?lang:"en";
}

function authEmailRedirectUrl(){
  try{
    const url=new URL(window.location.href.split("#")[0]);
    url.search="";
    url.searchParams.set("lang",authPreferredLanguage());
    return url.toString();
  }catch{
    return window.location.href.split("#")[0].split("?")[0];
  }
}

async function syncAuthPreferredLanguage(language){
  const lang=String(language||authPreferredLanguage()).trim().toLowerCase();
  if(!state.session?.user || !["en","es","fr","ht"].includes(lang)) return;
  const current=String(state.session.user.user_metadata?.preferred_language||"").toLowerCase();
  if(current===lang) return;
  try{
    const {data,error}=await supabase.auth.updateUser({
      data:{
        ...(state.session.user.user_metadata||{}),
        preferred_language:lang
      }
    });
    if(error) throw error;
    if(data?.user && state.session) state.session.user=data.user;
  }catch(err){
    console.warn("[TLE] auth preferred language sync",err);
  }
}
function appIsSpanish(){
  return appLanguage()==="es";
}
function langPick(en,es,fr){
  const lang=appLanguage();
  if(lang==="es") return es;
  if(lang==="fr") return fr;
  if(lang==="ht") return window.TLE_I18N?.t?.(en)||en;
  return en;
}
function customerEmailLanguageLabel(code){
  return ({en:"English",es:"Español",fr:"Français",ht:"Kreyòl Ayisyen"})[String(code||"").toLowerCase()]||"English";
}
function customerEmailLanguageOptions(selected="",allowDefault=true){
  const value=String(selected||"").toLowerCase();
  const options=[
    ["en","English"],["es","Español"],["fr","Français"],["ht","Kreyòl Ayisyen"]
  ];
  const fallback=allowDefault
    ? `<option value="" ${!value?"selected":""}>${escapeHtml(langPick("Business default","Predeterminado del negocio","Valeur par défaut"))}</option>`
    : "";
  return fallback+options.map(([code,label])=>`<option value="${code}" ${value===code?"selected":""}>${escapeHtml(label)}</option>`).join("");
}
function normalizedCustomerEmailLanguage(value){
  const code=String(value||"").trim().toLowerCase();
  return ["en","es","fr","ht"].includes(code)?code:null;
}
function customerTextTranslationTarget(){
  const code=appLanguage();
  return ["en","es","fr","ht"].includes(code)?code:"en";
}
function customerTranslateLabel(){
  return ({
    en:"Translate to English",
    es:"Traducir al español",
    fr:"Traduire en français",
    ht:"Tradui an kreyòl"
  })[customerTextTranslationTarget()]||"Translate";
}
function customerTranslateLink(text,sourceLanguage=""){
  const clean=String(text||"").trim();
  if(!clean) return "";
  const target=customerTextTranslationTarget();
  const source=String(sourceLanguage||"").trim().toLowerCase();
  if(source && source===target) return "";
  const supportedSource=["en","es","fr","ht"].includes(source)?source:"auto";
  const url="https://translate.google.com/?sl="+encodeURIComponent(supportedSource)+
    "&tl="+encodeURIComponent(target)+
    "&text="+encodeURIComponent(clean.slice(0,5000))+
    "&op=translate";
  return `<a class="customer-translate-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(customerTranslateLabel())} ↗</a>`;
}
function appLocale(){
  return state.business?.locale_code
    || ({en:"en-US",es:"es-ES",fr:"fr-FR",ht:"ht-HT"}[appLanguage()])
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
  if(n===0) return {icon:"☀️",en:"Clear",es:"Despejado",fr:"Dégagé"};
  if([1,2].includes(n)) return {icon:"🌤️",en:"Partly cloudy",es:"Parcialmente nublado",fr:"Partiellement nuageux"};
  if(n===3) return {icon:"☁️",en:"Cloudy",es:"Nublado",fr:"Nuageux"};
  if([45,48].includes(n)) return {icon:"🌫️",en:"Foggy",es:"Neblina",fr:"Brume"};
  if([51,53,55,56,57].includes(n)) return {icon:"🌦️",en:"Drizzle",es:"Llovizna",fr:"Bruine"};
  if([61,63,65,66,67,80,81,82].includes(n)) return {icon:"🌧️",en:"Rain",es:"Lluvia",fr:"Pluie"};
  if([71,73,75,77,85,86].includes(n)) return {icon:"🌨️",en:"Snow",es:"Nieve",fr:"Neige"};
  if([95,96,99].includes(n)) return {icon:"⛈️",en:"Thunderstorms",es:"Tormentas",fr:"Orages"};
  return {icon:"🌤️",en:"Weather",es:"Clima",fr:"Météo"};
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
  if(dateString===currentDateString) return langPick("Today","Hoy","Aujourd’hui");
  if(dateString===tomorrow.toISOString().slice(0,10)) return langPick("Tomorrow","Mañana","Demain");
  return new Intl.DateTimeFormat(appLocale(),{weekday:"short",timeZone:"UTC"}).format(d);
}
function precipitationKindForCode(code){
  const n=Number(code);
  if([71,73,75,77,85,86].includes(n)) return "snow";
  if([95,96,99].includes(n)) return "storm";
  if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(n)) return "rain";
  return "";
}
function nextPrecipitationWindow(weather){
  const times=weather&&weather.hourly&&weather.hourly.time||[];
  const probs=weather&&weather.hourly&&weather.hourly.precipitation_probability||[];
  const codes=weather&&weather.hourly&&weather.hourly.weather_code||[];
  if(!times.length) return null;
  const current=String(weather&&weather.current&&weather.current.time||"").slice(0,13);
  let start=times.findIndex(function(t){return String(t).slice(0,13)>=current;});
  if(start<0) start=0;
  const end=Math.min(times.length,start+72);
  for(let i=start;i<end;i++){
    const probability=Number(probs[i]||0);
    let kind=precipitationKindForCode(codes[i]);
    if(!kind && probability>=55) kind="rain";
    if(kind && probability>=35){
      const stamp=String(times[i]);
      return {
        kind,
        icon:kind==="snow"?"🌨️":kind==="storm"?"⛈️":"🌧️",
        time:stamp,
        date:stamp.slice(0,10),
        hour:Number(stamp.slice(11,13)),
        probability,
        hoursAhead:i-start
      };
    }
  }
  return null;
}
function nextRainWindow(weather){
  const event=nextPrecipitationWindow(weather);
  return event&&event.kind==="rain"?event:null;
}
function weatherCacheKey(area){
  return "tle_weather_v4:"+businessTemperatureUnit()+":"+String(area||"").trim().toLowerCase().replace(/\s+/g," ").slice(0,120);
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

function getDeviceWeatherGeo(timeoutMs=4200){
  return new Promise(resolve=>{
    if(!navigator.geolocation||!window.isSecureContext||window.__tleWeatherGeoDenied){
      resolve(null);
      return;
    }
    let settled=false;
    const finish=value=>{
      if(settled) return;
      settled=true;
      resolve(value);
    };
    try{
      navigator.geolocation.getCurrentPosition(position=>{
        const latitude=Number(position?.coords?.latitude);
        const longitude=Number(position?.coords?.longitude);
        if(!Number.isFinite(latitude)||!Number.isFinite(longitude)){
          finish(null);
          return;
        }
        finish({
          latitude,
          longitude,
          name:String(state.business?.service_area||"").trim()||langPick("Current location","Ubicación actual","Position actuelle"),
          admin1:"",
          country:"",
          country_code:String(state.business?.country_code||"").toUpperCase(),
          timezone:String(Intl.DateTimeFormat().resolvedOptions().timeZone||state.business?.timezone||"auto"),
          source:"device"
        });
      },error=>{
        if(Number(error?.code)===1) window.__tleWeatherGeoDenied=true;
        finish(null);
      },{
        enableHighAccuracy:true,
        maximumAge:90*1000,
        timeout:timeoutMs
      });
    }catch{
      finish(null);
    }
  });
}
async function resolveWeatherGeo(area,force=false){
  const deviceGeo=await getDeviceWeatherGeo(force?4500:3000).catch(()=>null);
  if(deviceGeo) return deviceGeo;
  return geocodeBusinessArea(area);
}
function syncCurrentWeatherFromMinutely(weather){
  const series=weather?.minutely_15;
  const times=series?.time||[];
  if(!weather?.current||!times.length) return weather;

  // Keep the nearest 15-minute sample only as secondary context.
  // Never overwrite Open-Meteo's true current condition with the previous
  // 15-minute bucket; otherwise "Rain now" can linger after rain has stopped.
  const currentMs=Date.parse(String(weather.current.time||""));
  let index=0;
  let bestDistance=Infinity;
  times.forEach((stamp,i)=>{
    const sampleMs=Date.parse(String(stamp||""));
    if(!Number.isFinite(sampleMs)||!Number.isFinite(currentMs)) return;
    const distance=Math.abs(sampleMs-currentMs);
    if(distance<bestDistance){
      bestDistance=distance;
      index=i;
    }
  });

  weather.current_15m={
    time:times[index]||weather.current.time,
    precipitation:Number(series.precipitation?.[index]||0),
    rain:Number(series.rain?.[index]||0),
    showers:Number(series.showers?.[index]||0),
    snowfall:Number(series.snowfall?.[index]||0),
    weather_code:Number.isFinite(Number(series.weather_code?.[index]))?Number(series.weather_code[index]):null
  };
  return weather;
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
function customerPaymentMethodLabel(invoice){
  const method=String(invoice?.customer_payment_method||"").toLowerCase();
  if(!method) return "";
  const detail=String(invoice?.customer_payment_method_detail||"").trim();
  if(method==="other" && detail){
    return langPick("Other","Otro","Autre")+" — "+detail;
  }
  return paymentMethodLabel(method);
}
function customerOpenStatus(record){
  const count=Number(record?.customer_open_count||0);
  const last=record?.customer_last_opened_at||record?.customer_first_opened_at||"";
  if(!count || !last){
    return {opened:false,text:langPick("Not viewed yet","Aún no lo ha abierto","Pas encore consulté")};
  }
  return {opened:true,text:langPick("Viewed","Visto","Consulté")+" · "+formatDateTime(last)+(count>1?" · "+count+"×":"")};
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
  if(country==="HT") return "ht";
  if(["FR","BE","LU","MC","SN","CI","CM","GA","CD","CG","BJ","TG","ML","NE","BF","GN","DJ","MG"].includes(country)) return "fr";
  const browser=String(navigator.language||"en").slice(0,2).toLowerCase();
  return ["en","es","fr","ht"].includes(browser)?browser:"en";
}
function localeForCountry(code,language){
  const region=String(code||"").toUpperCase();
  const lang=["en","es","fr","ht"].includes(language)?language:"en";
  const candidate=region?lang+"-"+region:"";
  if(candidate){
    try{new Intl.NumberFormat(candidate).format(1);return candidate;}catch{}
  }
  return {en:"en-US",es:"es-ES",fr:"fr-FR",ht:"ht-HT"}[lang];
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
      if(cached&&cached.weather&&cached.fetchedAt&&now-cached.fetchedAt<2*60*1000){
        state.weather=cached.weather;
        state.weather.nextPrecip=nextPrecipitationWindow(state.weather);
        state.weather.nextRain=state.weather.nextPrecip?.kind==="rain"?state.weather.nextPrecip:null;
        state.weatherArea=area;
        state.weatherFetchedAt=cached.fetchedAt;
        renderWeatherCoreSnapshot(state.weather);
        try{ renderWeatherBrief(); }catch(err){ console.warn("[TLE] cached weather render",err); }
        try{ renderTodaySummary(); }catch(err){ console.warn("[TLE] cached dashboard weather render",err); }
        window.__tleWeatherRetryCount=0;
        return;
      }
    }catch(e){}
  }

  const geo=await resolveWeatherGeo(area,force);
  if(!geo){
    window.__tleWeatherRetryCount=Number(window.__tleWeatherRetryCount||0)+1;
    renderWeatherPending(window.__tleWeatherRetryCount>2);
    if(window.__tleWeatherRetryCount<=2) scheduleWeatherRetry();
    return;
  }

  try{
    const params=new URLSearchParams({
      latitude:String(geo.latitude),
      longitude:String(geo.longitude),
      current:"temperature_2m,apparent_temperature,weather_code,precipitation,rain,showers,snowfall,wind_speed_10m",
      minutely_15:"precipitation,rain,showers,snowfall,weather_code",
      past_minutely_15:"4",
      forecast_minutely_15:"12",
      hourly:"temperature_2m,precipitation_probability,weather_code",
      daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      temperature_unit:businessTemperatureUnit(),
      precipitation_unit:businessTemperatureUnit()==="celsius"?"mm":"inch",
      forecast_days:"4",
      timezone:"auto"
    });
    const weather=await fetchJsonWithTimeout("https://api.open-meteo.com/v1/forecast?"+params.toString());
    syncCurrentWeatherFromMinutely(weather);
    weather.location=geo;
    weather.nextPrecip=nextPrecipitationWindow(weather);
    weather.nextRain=weather.nextPrecip?.kind==="rain"?weather.nextPrecip:null;
    state.weather=weather;
    state.weatherArea=area;
    state.weatherFetchedAt=Date.now();
    window.__tleWeatherRetryCount=0;
    if(window.__tleWeatherRetryTimer){
      clearTimeout(window.__tleWeatherRetryTimer);
      window.__tleWeatherRetryTimer=null;
    }
    try{localStorage.setItem(cacheKey,JSON.stringify({weather:weather,fetchedAt:state.weatherFetchedAt}));}catch(e){}
    renderWeatherCoreSnapshot(weather);
    try{ renderWeatherBrief(); }catch(err){ console.warn("[TLE] weather detail render",err); }
    try{ renderTodaySummary(); }catch(err){ console.warn("[TLE] dashboard weather render",err); }
  }catch(err){
    console.warn("[TLE] weather",err);
    window.__tleWeatherRetryCount=Number(window.__tleWeatherRetryCount||0)+1;
    const age=Date.now()-(state.weatherFetchedAt||0);
    if(state.weather && age<=4*60*1000){
      renderWeatherCoreSnapshot(state.weather);
      try{renderWeatherBrief();}catch{}
    }else{
      // Never keep an old active-rain state indefinitely when the refresh fails.
      renderWeatherPending(window.__tleWeatherRetryCount>2);
      const hero=$("#todayHeroCard");
      if(hero){
        hero.dataset.weather="none";
        hero.dataset.weatherIntensity="none";
      }
      const shell=$("#appShell");
      if(shell){
        shell.dataset.weatherMood="none";
        shell.dataset.weatherIntensity="none";
      }
      const precipLayer=$("#heroPrecipLayer");
      if(precipLayer){
        precipLayer.innerHTML="";
        precipLayer.className="hero-precip-layer weather-none intensity-none";
      }
      const note=$("#weatherBusinessNote");
      if(note){
        note.hidden=true;
        note.innerHTML="";
        note.classList.remove("rain");
      }
    }
    if(window.__tleWeatherRetryCount<=2) scheduleWeatherRetry();
  }
}
function currentWeatherVisual(weather){
  const code=Number(weather?.current?.weather_code);
  // "Now" must come only from the provider's current observation.
  // The 15-minute series is useful for nearby timing, not for overriding now.
  const precipitation=Math.max(
    Number(weather?.current?.precipitation||0),
    Number(weather?.current?.rain||0),
    Number(weather?.current?.showers||0)
  );
  const snowfall=Number(weather?.current?.snowfall||0);
  const windSpeed=Number(weather?.current?.wind_speed_10m||0);

  if([95,96,99].includes(code)) return {kind:"storm",intensity:[96,99].includes(code)?"heavy":"normal"};
  if(snowfall>0 || [71,73,75,77,85,86].includes(code)) return {kind:"snow",intensity:(snowfall>=1||code===75||code===86)?"heavy":"normal"};
  if([51,53,55,56,57].includes(code)) return {kind:"drizzle",intensity:[55,57].includes(code)?"normal":"light"};
  if([61,63,65,66,67,80,81,82].includes(code)) return {kind:"rain",intensity:[65,67,82].includes(code)?"heavy":"normal"};
  if(precipitation>0){
    const heavyThreshold=businessTemperatureUnit()==="celsius"?4:0.15;
    return {kind:"rain",intensity:precipitation>=heavyThreshold?"heavy":"light"};
  }
  if([45,48].includes(code)) return {kind:"fog",intensity:"normal"};
  if(code===3) return {kind:"cloudy",intensity:"normal"};
  if([1,2].includes(code)) return {kind:"partly",intensity:"light"};
  if(code===0) return {kind:"clear",intensity:"light"};
  if(Number.isFinite(windSpeed)&&windSpeed>=28) return {kind:"wind",intensity:windSpeed>=45?"heavy":"normal"};
  return {kind:"none",intensity:"none"};
}

function currentWeatherMeta(weather){
  const code=Number(weather?.current?.weather_code);
  const rawKind=precipitationKindForCode(code);
  const visual=currentWeatherVisual(weather);
  if(visual.kind==="storm") return {icon:"⛈️",en:"Thunderstorms",es:"Tormentas",fr:"Orages"};
  if(visual.kind==="drizzle") return {icon:"🌦️",en:"Drizzle",es:"Llovizna",fr:"Bruine"};
  if(!rawKind&&visual.kind==="rain") return {icon:"🌧️",en:"Rain",es:"Lluvia",fr:"Pluie"};
  if(!rawKind&&visual.kind==="snow") return {icon:"🌨️",en:"Snow",es:"Nieve",fr:"Neige"};
  if(visual.kind==="wind") return {icon:"💨",en:"Windy",es:"Ventoso",fr:"Venteux"};
  return weatherCodeMeta(code);
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
  let businessHour=null;
  try{
    businessHour=Number(new Intl.DateTimeFormat("en-US",{
      hour:"2-digit",
      hour12:false,
      timeZone:activeBusinessTimeZone()
    }).format(new Date()));
  }catch{}
  const isNight=Number.isFinite(businessHour) && (businessHour>=19 || businessHour<6);

  hero.dataset.season=season;
  hero.dataset.weather=visual.kind;
  hero.dataset.weatherIntensity=visual.intensity;
  const shell=$("#appShell");
  if(shell){
    shell.dataset.weatherMood=visual.kind;
    shell.dataset.weatherIntensity=visual.intensity;
  }

  const activeWeather=["storm","rain","drizzle","snow","fog","wind"].includes(visual.kind);
  const seasonCounts={spring:9,summer:6,fall:9,winter:7};
  seasonLayer.innerHTML=activeWeather?"":particleMarkup(seasonCounts[season]||7,"season-particle");
  seasonLayer.className="hero-season-layer season-"+season;

  if(visual.kind==="storm"){
    const count=visual.intensity==="heavy"?30:22;
    precipLayer.innerHTML=particleMarkup(count,"rain-drop")+'<span class="lightning-flash"></span>';
  }else if(visual.kind==="rain"){
    const count=visual.intensity==="heavy"?28:visual.intensity==="light"?12:20;
    precipLayer.innerHTML=particleMarkup(count,"rain-drop");
  }else if(visual.kind==="drizzle"){
    precipLayer.innerHTML=particleMarkup(12,"drizzle-drop");
  }else if(visual.kind==="snow"){
    const count=visual.intensity==="heavy"?24:16;
    precipLayer.innerHTML=particleMarkup(count,"snow-flake");
  }else if(visual.kind==="fog"){
    precipLayer.innerHTML=particleMarkup(5,"mist-band");
  }else if(visual.kind==="cloudy"||visual.kind==="partly"){
    precipLayer.innerHTML=particleMarkup(visual.kind==="cloudy"?5:3,"cloud-puff");
  }else if(visual.kind==="clear"){
    precipLayer.innerHTML=isNight?'<span class="moon-glow"></span>':'<span class="sun-glow"></span>';
  }else if(visual.kind==="wind"){
    precipLayer.innerHTML=particleMarkup(visual.intensity==="heavy"?11:7,"wind-streak");
  }else{
    precipLayer.innerHTML="";
  }
  precipLayer.className="hero-precip-layer weather-"+visual.kind+" intensity-"+visual.intensity;
}

function weatherConditionFamily(code){
  const n=Number(code);
  if(n===0) return "clear";
  if([1,2].includes(n)) return "partly";
  if(n===3) return "cloudy";
  if([45,48].includes(n)) return "fog";
  return precipitationKindForCode(n)||"other";
}
function nextWeatherConditionShift(weather){
  const times=weather?.hourly?.time||[];
  const codes=weather?.hourly?.weather_code||[];
  if(!times.length||!codes.length) return null;
  const currentStamp=String(weather?.current?.time||"").slice(0,13);
  let start=times.findIndex(t=>String(t).slice(0,13)>=currentStamp);
  if(start<0) start=0;
  const currentFamily=weatherConditionFamily(weather?.current?.weather_code);
  const end=Math.min(times.length,start+13);
  for(let i=start+1;i<end;i++){
    const family=weatherConditionFamily(codes[i]);
    if(family!==currentFamily && family!=="other"){
      const stamp=String(times[i]);
      return {
        family,
        code:Number(codes[i]),
        hour:Number(stamp.slice(11,13)),
        date:stamp.slice(0,10),
        hoursAhead:i-start
      };
    }
  }
  return null;
}

function renderWeatherCoreSnapshot(weather=state.weather){
  const card=$("#weatherBrief");
  if(!card||!weather||!weather.current) return false;
  card.hidden=false;
  const meta=currentWeatherMeta(weather);
  const temp=Math.round(Number(weather.current.temperature_2m));
  const highs=weather.daily?.temperature_2m_max||[];
  const lows=weather.daily?.temperature_2m_min||[];
  const high=Math.round(Number(highs[0]));
  const low=Math.round(Number(lows[0]));
  const lang=appLanguage();
  const tempEl=$("#weatherTemp");
  const condition=$("#weatherCondition");
  const highLow=$("#weatherHighLow");
  const location=$("#weatherLocation");
  if(tempEl) tempEl.textContent=Number.isFinite(temp)?temp+"°":"—";
  if(condition) condition.textContent=lang==="ht"?(window.TLE_I18N?.t?.(meta.en)||meta.en):(meta[lang]||meta.en);
  if(highLow) highLow.textContent=(Number.isFinite(high)?"H:"+high+"°":"H:—")+"  "+(Number.isFinite(low)?"L:"+low+"°":"L:—");
  if(location) location.textContent=langPick("LOCAL WEATHER","CLIMA LOCAL","MÉTÉO LOCALE");
  return true;
}
function renderWeatherPending(finalFailure=false){
  const card=$("#weatherBrief");
  if(!card) return;
  card.hidden=false;
  const condition=$("#weatherCondition");
  const highLow=$("#weatherHighLow");
  const tempEl=$("#weatherTemp");
  if(tempEl && !state.weather) tempEl.textContent="—";
  if(condition) condition.textContent=finalFailure
    ? langPick("Weather unavailable","Clima no disponible","Météo indisponible")
    : langPick("Updating weather…","Actualizando clima…","Mise à jour météo…");
  if(highLow && !state.weather) highLow.textContent="H:—  L:—";
}
function scheduleWeatherRetry(){
  if(window.__tleWeatherRetryTimer || !state.session || !state.business) return;
  window.__tleWeatherRetryTimer=setTimeout(()=>{
    window.__tleWeatherRetryTimer=null;
    loadBusinessWeather(true).catch(err=>console.warn("[TLE] weather retry",err));
  },2600);
}

function renderWeatherBrief(){
  const card=$("#weatherBrief");
  const weather=state.weather;
  if(!card||!weather||!weather.current) return;
  renderWeatherCoreSnapshot(weather);

  const meta=currentWeatherMeta(weather);
  const temp=Math.round(Number(weather.current.temperature_2m));
  const currentDate=String(weather.current.time||"").slice(0,10);
  const lang=appLanguage();
  const highs=weather.daily?.temperature_2m_max||[];
  const lows=weather.daily?.temperature_2m_min||[];
  const high=Math.round(Number(highs[0]));
  const low=Math.round(Number(lows[0]));
  const event=weather.nextPrecip||weather.nextRain||null;
  const shift=nextWeatherConditionShift(weather);

  const icon=$("#weatherIcon");
  const tempEl=$("#weatherTemp");
  const condition=$("#weatherCondition");
  const highLow=$("#weatherHighLow");
  const location=$("#weatherLocation");

  if(icon){
    const localHour=Number(new Intl.DateTimeFormat("en-US",{
      hour:"2-digit",
      hour12:false,
      timeZone:activeBusinessTimeZone()
    }).format(new Date()));
    const isNight=Number.isFinite(localHour)&&(localHour>=19||localHour<6);
    const family=weatherConditionFamily(weather.current.weather_code);
    let visualIcon=meta.icon;
    let hideIcon=false;

    if(isNight){
      if(family==="clear"||family==="partly"){
        hideIcon=true;
      }else if(family==="cloudy"){
        visualIcon="☁️";
      }else if(family==="fog"){
        visualIcon="🌫️";
      }else if(family==="rain"){
        visualIcon="🌧️";
      }else if(family==="snow"){
        visualIcon="🌨️";
      }else if(family==="storm"){
        visualIcon="⛈️";
      }
    }

    icon.hidden=hideIcon;
    icon.textContent=hideIcon?"":visualIcon;
    card.classList.toggle("weather-no-icon",hideIcon);
  }
  if(tempEl) tempEl.textContent=Number.isFinite(temp)?temp+"°":"—";
  if(condition) condition.textContent=lang==="ht"?(window.TLE_I18N?.t?.(meta.en)||meta.en):(meta[lang]||meta.en);
  if(highLow){
    highLow.textContent=(Number.isFinite(high)?"H:"+high+"°":"H:—")+"  "+(Number.isFinite(low)?"L:"+low+"°":"L:—");
  }
  if(location){
    location.textContent=langPick("LOCAL WEATHER","CLIMA LOCAL","MÉTÉO LOCALE");
  }

  const note=$("#weatherBusinessNote");
  if(note){
    note.classList.remove("rain");
    let text="";

    const currentVisual=currentWeatherVisual(weather);
    const currentKind=precipitationKindForCode(Number(weather.current.weather_code))||(currentVisual.kind==="snow"?"snow":currentVisual.kind==="storm"?"storm":(["rain","drizzle"].includes(currentVisual.kind)?"rain":""));
    if(currentKind){
      text=currentKind==="snow"
        ? langPick("Snow now in your area.","Está nevando ahora en tu zona.","Il neige maintenant dans votre zone.")
        : currentKind==="storm"
        ? langPick("Storms are active now in your area.","Hay tormentas ahora en tu zona.","Des orages sont actifs maintenant dans votre zone.")
        : langPick("Rain now in your area.","Está lloviendo ahora en tu zona.","Il pleut maintenant dans votre zone.");
      note.classList.add("rain");
    }else if(event&&event.hoursAhead<=48){
      const day=weatherDayLabel(event.date,currentDate);
      const when=weatherClockLabel(event.hour);
      const label=event.kind==="snow"
        ? langPick("Snow expected","Nieve probable","Neige prévue")
        : event.kind==="storm"
        ? langPick("Storms expected","Tormentas probables","Orages prévus")
        : langPick("Rain expected","Lluvia probable","Pluie prévue");
      const dayPart=event.date===currentDate?"":(" "+day);
      const chance=Number.isFinite(Number(event.probability))?" · "+Math.round(Number(event.probability))+"%":"";
      text=label+dayPart+" "+langPick("around","cerca de las","vers")+" "+when+chance+".";
      note.classList.add("rain");
    }else if(shift){
      const m=weatherCodeMeta(shift.code);
      const label=lang==="ht"?(window.TLE_I18N?.t?.(m.en)||m.en):(m[lang]||m.en);
      const when=weatherClockLabel(shift.hour);
      text=langPick(label+" conditions expected around "+when+".","Se espera "+label.toLowerCase()+" cerca de las "+when+".",label+" prévu vers "+when+".");
    }

    if(text){
      note.hidden=false;
      note.innerHTML="<span>"+escapeHtml(text)+"</span>";
    }else{
      note.hidden=true;
      note.innerHTML="";
    }
  }

  const feels=$("#weatherFeels");
  if(feels) feels.textContent="";
  const forecast=$("#weatherForecast");
  if(forecast) forecast.innerHTML="";
  const updated=$("#weatherUpdated");
  if(updated) updated.textContent="";
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
  },60*1000);

  document.addEventListener("visibilitychange",function(){
    if(document.visibilityState!=="visible"||!state.session||!state.business) return;
    renderTodaySummary(true);
    if(Date.now()-(state.weatherFetchedAt||0)>30*1000){
      loadBusinessWeather(true).catch(function(){});
    }
  });

  window.addEventListener("focus",function(){
    if(!state.session||!state.business) return;
    if(Date.now()-(state.weatherFetchedAt||0)>30*1000){
      loadBusinessWeather(true).catch(function(){});
    }
  });
}

function refreshDynamicLanguageContent(){
  if(!state.business || !state.session) return;
  try{ renderTodaySummary(); }catch{}
  try{ renderWeatherBrief(); }catch{}
  try{ renderOperations(); }catch{}
  try{ renderClients(); }catch{}
  try{ renderServices(); }catch{}
  try{ renderQuotes(); }catch{}
  try{ renderInvoices(); }catch{}
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
  return langPick("Check the required fields above and try again.","Revisa los campos requeridos arriba y vuelve a intentarlo.","Vérifiez les champs obligatoires ci-dessus et réessayez.");
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
    message=langPick("The email or password doesn’t match. Check them and try again.","El correo o la contraseña no coinciden. Revísalos y vuelve a intentarlo.","L’e-mail ou le mot de passe ne correspond pas. Vérifiez-les et réessayez.");
  }else if(/email not confirmed/.test(raw)){
    message=langPick("Confirm your email first, then sign in.","Primero confirma tu correo y después inicia sesión.","Confirmez d’abord votre e-mail, puis connectez-vous.");
  }else if(/already registered|already been registered/.test(raw)){
    message=langPick("That email already has an account. Sign in instead of creating another one.","Ese correo ya tiene una cuenta. Inicia sesión en vez de crear otra.","Cet e-mail possède déjà un compte. Connectez-vous au lieu d’en créer un autre.");
  }else if(!correctable){
    message=langPick("We couldn’t complete this. Check the required fields and tap “Try again”.","No pudimos completar esto. Revisa los campos requeridos y toca “Intentar otra vez”.","Impossible de terminer. Vérifiez les champs obligatoires et touchez « Réessayer ».");
  }

  setAuthStatus(message,"error");
  if(retry){
    retry.hidden=false;
    retry.textContent=langPick("Try again","Intentar otra vez","Réessayer");
  }

  const attempt=recordAuthIssueAttempt(mode,email,err);
  if(!correctable && attempt.item.count>=2 && !attempt.item.reported){
    reportPersistentAuthIssue(mode,email,err,attempt.item.count,attempt.key).then(alerted=>{
      if(alerted){
        setAuthStatus(
          langPick("The error is still happening. Support has been alerted. Check the required fields and try again.","El error continúa. Ya se envió una alerta a soporte. Revisa los campos requeridos y vuelve a intentarlo.","L’erreur continue. Le support a été prévenu. Vérifiez les champs obligatoires et réessayez."),
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

const AUTH_WELCOME_SEEN_KEY="tle_auth_welcome_seen_v1";
function hasSeenAuthWelcome(){
  try{return localStorage.getItem(AUTH_WELCOME_SEEN_KEY)==="1";}catch{return false;}
}
function markAuthWelcomeSeen(){
  try{localStorage.setItem(AUTH_WELCOME_SEEN_KEY,"1");}catch{}
}
function prepareDirectAuth(){
  dismissSessionSplash();
  trackFunnelStep("/funnel/signin-viewed");
  setShellState("auth");
  if(workerShell) workerShell.hidden=true;
  if(publicShell) publicShell.hidden=true;
  authShell.hidden=false;
  appShell.hidden=true;
  businessSetup.hidden=true;
  if(authWelcome) authWelcome.hidden=true;
  if(authPanel) authPanel.hidden=false;
  authShell?.classList.remove("auth-form-open");
  const back=$("#authBackWelcome");
  if(back) back.hidden=true;
  const remembered=rememberedOwnerEmail();
  const email=$("#authEmail");
  if(remembered && email && !email.value) email.value=remembered;
  setAuthMode(remembered?"signin":"signup");
  setAuthStatus("");
}

function syncAuthWelcomeCopy(){
  const copy={
    badge:langPick("CLEANING APP","CLEANING APP","CLEANING APP"),
    title:langPick("Your cleaning business shouldn’t live in DMs, notes and memory.","Tu negocio de limpieza no debería vivir entre DMs, notas y tu memoria.","Votre entreprise de nettoyage ne devrait pas vivre entre les DMs, les notes et votre mémoire."),
    text:langPick("Keep clients, quotes, bookings, jobs and invoices in one organized place.","Mantén clientes, cotizaciones, reservas, trabajos y facturas organizados en un solo lugar.","Gardez clients, devis, réservations, interventions et factures organisés au même endroit."),
    trial:langPick("Simple setup","Configuración simple","Configuration simple"),
    noCard:langPick("No card required","Sin tarjeta","Sans carte"),
    after:langPick("","",""),
    start:langPick("Get 30 days free","Obtén 30 días gratis","Obtenez 30 jours gratuits"),
    signin:langPick("Sign in","Iniciar sesión","Se connecter"),
    existing:langPick("Already have an account?","¿Ya tienes una cuenta?","Vous avez déjà un compte ?"),
    note:langPick("No card required · Then $5.99/month","Sin tarjeta · Después $5.99/mes","Sans carte · Puis 5,99 $/mois"),
    back:langPick("← Back","← Volver","← Retour")
  };
  $("#authWelcomeBadge") && ($("#authWelcomeBadge").textContent=copy.badge);
  $("#authWelcomeTitle") && ($("#authWelcomeTitle").textContent=copy.title);
  $("#authWelcomeCopy") && ($("#authWelcomeCopy").textContent=copy.text);
  $("#authWelcomeTrial") && ($("#authWelcomeTrial").textContent=copy.trial);
  $("#authWelcomeNoCard") && ($("#authWelcomeNoCard").textContent=copy.noCard);
  $("#authWelcomeCancel") && ($("#authWelcomeCancel").textContent=copy.after);
  $("#authWelcomeStart") && ($("#authWelcomeStart").textContent=copy.start);
  $("#authWelcomeSignIn") && ($("#authWelcomeSignIn").textContent=copy.signin);
  $("#authWelcomeExistingText") && ($("#authWelcomeExistingText").textContent=copy.existing);
  $("#authWelcomeNote") && ($("#authWelcomeNote").textContent=copy.note);
  $("#authBackWelcome") && ($("#authBackWelcome").textContent=copy.back);
}
function showAuthWelcome(){
  dismissSessionSplash();
  const remembered=rememberedOwnerEmail();
  // Returning owners can go straight to Sign in. Everyone else always sees
  // the product page before Create account.
  if(remembered){
    prepareDirectAuth();
    return;
  }
  setShellState("auth");
  if(workerShell) workerShell.hidden=true;
  if(publicShell) publicShell.hidden=true;
  authShell.hidden=false;
  appShell.hidden=true;
  authPanel.hidden=true;
  authShell?.classList.remove("auth-form-open");
  businessSetup.hidden=true;
  if(authWelcome){
    authWelcome.hidden=false;
    authWelcome.classList.remove("is-entering");
    void authWelcome.offsetWidth;
    authWelcome.classList.add("is-entering");
    setTimeout(()=>authWelcome.classList.remove("is-entering"),320);
  }
  const back=$("#authBackWelcome");
  if(back) back.hidden=false;
  window.__tleAuthWelcomeSessionActive=true;
  setAuthStatus("");
  syncAuthWelcomeCopy();
  trackFunnelStep("/funnel/welcome");
}
function openAuthFromWelcome(mode){
  window.__tleAuthModeTouched=true;
  markAuthWelcomeSeen();
  if(mode==="signup"){
    trackFunnelStep("/funnel/trial-cta-clicked");
    trackFunnelStep("/funnel/signup-viewed");
  }else{
    trackFunnelStep("/funnel/signin-clicked");
    trackFunnelStep("/funnel/signin-viewed");
  }
  const email=$("#authEmail");
  if(mode==="signin"){
    const remembered=rememberedOwnerEmail();
    if(remembered && email) email.value=remembered;
  }

  businessSetup.hidden=true;
  setAuthStatus("");
  if(authWelcome) authWelcome.hidden=true;
  authPanel.hidden=false;
  authPanel.classList.remove("is-entering");
  setAuthMode(mode);
  authShell?.classList.add("auth-form-open");
  const back=$("#authBackWelcome");
  if(back) back.hidden=false;

  requestAnimationFrame(()=>{
    // iOS zooms/repositions the viewport when a form field is focused by code.
    // Let touch users tap the field themselves; desktop users keep the shortcut.
    const isTouchDevice=window.matchMedia?.("(pointer: coarse)")?.matches;
    if(isTouchDevice) return;
    const target=mode==="signup"?$("#authEmail"):($("#authEmail")?.value?$("#authPassword"):$("#authEmail"));
    setTimeout(()=>{
      try{target?.focus({preventScroll:true});}catch{try{target?.focus();}catch{}}
    },40);
  });
}

window.addEventListener("tle:languagechange",syncAuthWelcomeCopy);
setTimeout(syncAuthWelcomeCopy,0);

function showAuth(){ showAuthWelcome(); }
function showSetup(){
  dismissSessionSplash();
  trackFunnelStep("/funnel/business-setup-viewed");
  setShellState("auth");
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = false;
  appShell.hidden = true;
  if(authWelcome) authWelcome.hidden = true;
  authPanel.hidden = true;
  businessSetup.hidden = false;
}
function applyQuarterHourCardColors(){
  const now=new Date();
  const quarter=Math.floor(now.getMinutes()/15)%4;
  const hour=Number(new Intl.DateTimeFormat("en-US",{hour:"2-digit",hour12:false,timeZone:activeBusinessTimeZone()}).format(now));
  const paletteMode=(hour>=19 || hour<6)?"night":"day";
  const classes=["quarter-color-0","quarter-color-1","quarter-color-2","quarter-color-3"];
  [$("#todayHeroCard"),$(".trial-card"),appShell].filter(Boolean).forEach(el=>{
    el.classList.remove(...classes);
    el.classList.add("quarter-color-"+quarter);
    el.dataset.colorQuarter=String(quarter);
    el.dataset.paletteMode=paletteMode;
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

function ensureDashboardBootResolved(){
  if(!state.session||!state.business) return;
  const greet=$("#todayGreeting");
  const action=$("#todayHeroAction");
  const pending=Boolean(
    action?.disabled ||
    /getting your day ready/i.test(String(greet?.textContent||""))
  );
  if(!pending) return;
  try{ renderTodaySummary(true); }catch(err){ console.warn("[TLE] dashboard boot retry",err); }
  const stillPending=Boolean(
    action?.disabled ||
    /getting your day ready/i.test(String(greet?.textContent||""))
  );
  if(!stillPending) return;
  const hero=$("#todayHeroCard");
  const copy=$("#todayMomentCopy");
  try{hero?.classList.remove("is-loading");}catch{}
  if(greet){
    const hour=new Date().getHours();
    greet.textContent=dashboardGreeting(dashboardDaypart(hour));
  }
  if(copy){
    copy.textContent=langPick("Your workspace is ready. Check the calendar and what’s next.","Tu espacio está listo. Revisa el calendario y lo próximo.","Votre espace est prêt. Consultez le calendrier et la suite.");
  }
  if(action){
    action.disabled=false;
    action.dataset.jump="calendar";
    action.textContent=langPick("View calendar →","Ver calendario →","Voir le calendrier →");
  }
}

function showApp(){
  dismissSessionSplash();
  setShellState("app");
  if(workerShell) workerShell.hidden = true;
  if(publicShell) publicShell.hidden = true;
  authShell.hidden = true;
  appShell.hidden = false;
  scheduleQuarterHourCardColors();
  installTodayClock();

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
  document.body.classList.toggle("platform-owner-no-billing",state.isPlatformAdmin);
  applyRolePermissions();
  // A fresh app entry always starts on Today/Home. A true browser refresh
  // keeps the current workspace section so Refresh does not interrupt work.
  let isTrueReload=false;
  try{
    isTrueReload=performance.getEntriesByType?.("navigation")?.[0]?.type==="reload";
  }catch{}
  if(isTrueReload && !ownerHomeIdleExpired()){
    restoreWorkspaceView();
  }else{
    navHistory.length=1;
    navHistory[0]="today";
    openView("today",{fromRestore:true,skipTrack:true,skipIntro:true});
  }
  $$("[data-account-billing]").forEach(el=>{
    el.hidden=state.isPlatformAdmin;
  });
  renderTrialStatus();
  if(state.business?.role==="owner" && state.session?.user?.email){
    if(rememberUsernameEnabled()){
      localStorage.setItem(OWNER_EMAIL_KEY,String(state.session.user.email).trim().toLowerCase());
    }
    markOwnerActivity();
    markOwnerHomeActivity();
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
  trackFunnelStep("/funnel/dashboard-reached");
  scheduleOnboardingWelcome();
  installLiveDashboardUpdates();
  installTeamMessagePolling();
  clearTimeout(window.__tleDashboardBootTimer);
  window.__tleDashboardBootTimer=setTimeout(ensureDashboardBootResolved,1400);
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
  if(state.isPlatformAdmin){
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
  if(state.isPlatformAdmin){
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

function workspaceViewStorageKey(){
  const businessId=String(state.business?.id||"workspace");
  const userId=String(state.session?.user?.id||state.session?.user?.email||"user");
  return "tle_last_workspace_view_v1:"+businessId+":"+userId;
}
function canRestoreWorkspaceView(id){
  if(!id) return false;
  const view=$$(".view").find(v=>v.dataset.page===id);
  if(!view) return false;
  const nav=$$(".nav-item[data-view]").find(n=>n.dataset.view===id);
  return !nav || !nav.hidden;
}
function saveWorkspaceView(id){
  if(!canRestoreWorkspaceView(id)) return;
  try{ localStorage.setItem(workspaceViewStorageKey(),id); }catch{}
}
function restoreWorkspaceView(){
  let id="";
  try{ id=String(localStorage.getItem(workspaceViewStorageKey())||""); }catch{}
  if(!canRestoreWorkspaceView(id)){
    id="today";
    try{ localStorage.removeItem(workspaceViewStorageKey()); }catch{}
  }
  openView(id,{fromRestore:true,skipTrack:true,skipIntro:true});
  return id;
}

const workspaceScrollPositions={};
function workspaceScrollOwner(){
  const main=$("#appShell>.main");
  return (window.innerWidth<=860 && main)?main:window;
}
function workspaceScrollTop(){
  const owner=workspaceScrollOwner();
  return owner===window ? (window.scrollY||0) : (owner.scrollTop||0);
}
function setWorkspaceScrollTop(value=0){
  const top=Math.max(0,Number(value)||0);
  const owner=workspaceScrollOwner();
  if(owner===window){
    window.scrollTo({top,behavior:"auto"});
  }else{
    owner.scrollTo({top,behavior:"auto"});
  }
}
const viewRefreshInFlight=new Map();
async function refreshViewData(id){
  if(!state.business?.id) return;
  if(viewRefreshInFlight.has(id)) return viewRefreshInFlight.get(id);

  const task=(async()=>{
    try{
      const businessId=state.business.id;

      if(id==="calendar"){
        // Render immediately from cached state so the calendar never opens blank.
        renderJobs();
        const {data,error}=await supabase
          .from("jobs")
          .select("*, clients(name,email), services(name), job_assignments(id,team_member_id,team_members(name))")
          .eq("business_id",businessId)
          .order("starts_at",{ascending:true});
        if(error) throw error;
        state.jobs=data||[];
        renderJobs();
        return;
      }

      if(id==="services" || id==="booking"){
        let [{data:services,error:servicesError},{data:addons,error:addonsError}]=await Promise.all([
          supabase.from("services").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),
          supabase.from("service_addons").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name")
        ]);
        if(servicesError) throw servicesError;
        if(addonsError) throw addonsError;

        // New workspaces get editable starter services. The RPC is idempotent,
        // so a temporary empty screen cannot create duplicates.
        if((services||[]).length===0 && ["owner","admin"].includes(String(state.business.role||""))){
          const {error:seedError}=await supabase.rpc("seed_default_services",{p_business_id:businessId});
          if(!seedError){
            const {data:seeded,error:seedFetchError}=await supabase
              .from("services").select("*").eq("business_id",businessId)
              .order("active",{ascending:false}).order("name");
            if(!seedFetchError) services=seeded||[];
          }
        }

        // Prepare safe, editable starter add-ons for every workspace.
        // They are created inactive with $0 until the owner sets pricing and turns them on.
        if(["owner","admin"].includes(String(state.business.role||""))){
          const {data:seededAddonCount,error:seedAddonError}=await supabase.rpc("seed_default_service_addons",{p_business_id:businessId});
          if(!seedAddonError && Number(seededAddonCount||0)>0){
            const {data:seededAddons,error:seededAddonsError}=await supabase
              .from("service_addons").select("*").eq("business_id",businessId)
              .order("active",{ascending:false}).order("name");
            if(!seededAddonsError) addons=seededAddons||[];
          }
        }

        state.services=services||[];
        state.serviceAddons=addons||[];
        renderServices();
        renderBookingServices();

        if(id==="booking"){
          const {data:links,error:linksError}=await supabase.rpc("get_my_public_link_settings");
          if(!linksError){
            state.publicLinks=links||null;
            renderPublicLinks();
          }
        }
        return;
      }

      if(id==="settings"){
        const record=await loadBusinessSettingsRecord();
        state.business={...state.business,...record};
        const {data:links,error:linksError}=await supabase.rpc("get_my_public_link_settings");
        if(!linksError) state.publicLinks=links||null;
        renderSettings();
        return;
      }
    }catch(err){
      console.warn("[TLE] view refresh",id,err);
    }
  })().finally(()=>viewRefreshInFlight.delete(id));

  viewRefreshInFlight.set(id,task);
  return task;
}

function openView(id,options={}){
  const current=$(".view.active")?.dataset.page;
  if(current && current!==id) workspaceScrollPositions[current]=workspaceScrollTop();
  if(!options.fromBack && !options.fromRestore && current && current!==id){
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
  let activeNav=null;
  $$(".nav-item").forEach(n=>{
    const active=n.dataset.view===id;
    n.classList.toggle("active",active);
    if(active) activeNav=n;
  });
  if(activeNav){
    const group=activeNav.closest("details.nav-group");
    if(group) group.open=true;
  }
  pageTitle.textContent=pageTitles[id]||"The Launch Era Cleaning App";
  if(backBtn) backBtn.hidden=id==="today";
  if(typeof setSidebarOpen==="function") setSidebarOpen(false); else sidebar.classList.remove("open");
  saveWorkspaceView(id);
  const targetTop=(options.fromRestore||options.fromBack) ? Number(workspaceScrollPositions[id]||0) : 0;
  requestAnimationFrame(()=>setWorkspaceScrollTop(targetTop));
  if(!options.skipTrack) trackVisit("/app/"+id).catch(()=>{});
  if(id==="calendar"){
    renderJobs();
    requestAnimationFrame(()=>renderJobs());
  }
  if(id==="services") renderServices();
  if(id==="booking") renderPublicLinks();
  if(id==="settings") renderSettings();

  refreshViewData(id).catch(()=>{});

  if(id==="team"){
    loadTeamMessageThreads().then(()=>{
      if(state.activeTeamMessageMemberId) return loadTeamMessageThread(state.activeTeamMessageMemberId,{markRead:true});
    }).catch(err=>console.warn("[TLE] team messages",err));
  }
  if(!options.skipIntro) setTimeout(()=>maybeShowFeatureIntro(id),220);
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
  const calendarDay=e.target.closest?.('[data-calendar-day][role="button"]');
  if(calendarDay){
    e.preventDefault();
    renderCalendarDayDetails(calendarDay.dataset.calendarDay);
    return;
  }
  const calendarJob=e.target.closest?.('[data-calendar-job][role="button"]');
  if(calendarJob && !e.target.closest("button,a,input,select,textarea")){
    e.preventDefault();
    const job=state.jobs.find(j=>j.id===calendarJob.dataset.calendarJob);
    if(job) renderCalendarDayDetails(tleCalendarDateKey(job.starts_at),{jobId:job.id});
    return;
  }
  const jump=e.target.closest?.('[data-jump][role="button"]');
  if(!jump || jump.disabled || jump.hidden) return;
  e.preventDefault();
  openView(jump.dataset.jump);
});
const sidebarScrim=$("#sidebarScrim");
function syncMobileNavGroups(){
  if(window.innerWidth>860) return;
  const groups=$$("details.nav-group");
  const active=$(".nav-item.active");
  const activeGroup=active?.closest("details.nav-group")||null;
  groups.forEach(group=>{ group.open=group===activeGroup; });
}
$$("details.nav-group").forEach(group=>{
  group.addEventListener("toggle",()=>{
    if(window.innerWidth>860 || !group.open) return;
    $$("details.nav-group").forEach(other=>{ if(other!==group) other.open=false; });
  });
});
function setSidebarOpen(open){
  const isMobileNav=window.innerWidth<=860 || window.matchMedia("(max-width: 860px)").matches;
  const shouldOpen=!!open && isMobileNav;
  if(!sidebar) return;
  sidebar.classList.toggle("open",shouldOpen);

  if(isMobileNav){
    sidebar.style.setProperty("left","0px","important");
    sidebar.style.setProperty("right","auto","important");
    sidebar.style.setProperty("transform","none","important");
    sidebar.style.setProperty("-webkit-transform","none","important");
    sidebar.style.setProperty("visibility",shouldOpen?"visible":"hidden","important");
    sidebar.style.setProperty("opacity",shouldOpen?"1":"0","important");
    sidebar.style.setProperty("pointer-events",shouldOpen?"auto":"none","important");
  }else{
    sidebar.style.removeProperty("left");
    sidebar.style.removeProperty("right");
    sidebar.style.removeProperty("transform");
    sidebar.style.removeProperty("-webkit-transform");
    sidebar.style.removeProperty("visibility");
    sidebar.style.removeProperty("opacity");
    sidebar.style.removeProperty("pointer-events");
  }

  if(shouldOpen) syncMobileNavGroups();
  if(sidebarScrim) sidebarScrim.hidden=!shouldOpen;
  document.body.classList.toggle("sidebar-is-open",shouldOpen);
  $("#menuToggle")?.setAttribute("aria-expanded",shouldOpen?"true":"false");
}
$("#menuToggle").addEventListener("click",()=>setSidebarOpen(!sidebar.classList.contains("open")));
sidebarScrim?.addEventListener("click",()=>setSidebarOpen(false));
let tleCalendarWideMode=window.innerWidth>=721;
window.addEventListener("resize",()=>{
  if(window.innerWidth>860 && sidebar.classList.contains("open")) setSidebarOpen(false);
  const nextCalendarWideMode=window.innerWidth>=721;
  if(nextCalendarWideMode!==tleCalendarWideMode){
    tleCalendarWideMode=nextCalendarWideMode;
    if(state.business) renderJobs();
  }
});

if(backBtn) backBtn.addEventListener("click",()=>{
  if(modal && !modal.hidden){
    closeEntityModal();
    return;
  }
  const current=$(".view.active")?.dataset.page||"today";
  if(current==="today") return;

  // Move back one workspace level instead of jumping straight Home.
  // Example: Today → Settings → Booking gives:
  // Back → Settings, then Back → Today.
  let previous=navHistory.pop()||"today";
  while(previous===current && navHistory.length){
    previous=navHistory.pop()||"today";
  }
  if(!canRestoreWorkspaceView(previous)) previous="today";
  openView(previous,{fromBack:true,skipIntro:true});
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
  const ua=String(navigator.userAgent||"");
  return host==="127.0.0.1"
    || host==="localhost"
    || host==="::1"
    || host!=="app.thelaunchera.com"
    || navigator.webdriver===true
    || /HeadlessChrome|PhantomJS|Google-InspectionTool|Lighthouse|PageSpeed/i.test(ua)
    || params.has("browser-smoke")
    || params.has("cross-browser-smoke")
    || params.has("ci-smoke");
}

let authLandingVisitTracked=false;
function trackAuthLandingOnHumanInteraction(){
  if(authLandingVisitTracked) return;
  const fire=()=>{
    if(authLandingVisitTracked) return;
    authLandingVisitTracked=true;
    ["pointerdown","touchstart","keydown"].forEach(type=>window.removeEventListener(type,fire,true));
    trackVisit("/login").catch(()=>{});
  };
  ["pointerdown","touchstart","keydown"].forEach(type=>window.addEventListener(type,fire,{capture:true,passive:true}));
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
function trackFunnelStep(step,{repeat=false}={}){
  const page=String(step||"").trim();
  if(!page) return Promise.resolve();
  try{
    const key="tle_funnel_seen:"+page;
    if(!repeat && sessionStorage.getItem(key)==="1") return Promise.resolve();
    if(!repeat) sessionStorage.setItem(key,"1");
  }catch{}
  return trackVisit(page);
}
function funnelStepLabel(page=""){
  const labels={
    "/funnel/welcome":"Welcome viewed",
    "/funnel/trial-cta-clicked":"Free trial CTA clicked",
    "/funnel/signup-viewed":"Signup form viewed",
    "/funnel/signup-attempted":"Signup submitted",
    "/funnel/account-created":"Account created",
    "/funnel/signup-error":"Signup error",
    "/funnel/signin-clicked":"Sign in clicked",
    "/funnel/signin-viewed":"Sign-in form viewed",
    "/funnel/signin-attempted":"Sign-in submitted",
    "/funnel/signin-success":"Sign-in successful",
    "/funnel/signin-error":"Sign-in error",
    "/funnel/business-setup-viewed":"Business setup viewed",
    "/funnel/business-setup-submitted":"Business setup submitted",
    "/funnel/workspace-created":"Workspace created",
    "/funnel/dashboard-reached":"Dashboard reached",
    "/login":"Legacy login/welcome event"
  };
  if(labels[page]) return labels[page];
  if(page.startsWith("/app/")){
    const leaf=page.slice(5).replaceAll("-"," ");
    return "App · "+leaf.replace(/\b\w/g,c=>c.toUpperCase());
  }
  if(page.startsWith("/public/")){
    const leaf=page.slice(8).replaceAll("-"," ");
    return "Public · "+leaf.replace(/\b\w/g,c=>c.toUpperCase());
  }
  return page;
}
function funnelProgressLabel(pages=[]){
  const set=new Set(pages.map(p=>p.page));
  if(set.has("/funnel/dashboard-reached") || [...set].some(p=>p.startsWith("/app/"))) return "Reached dashboard";
  if(set.has("/funnel/workspace-created")) return "Workspace created";
  if(set.has("/funnel/business-setup-submitted")) return "Business setup submitted";
  if(set.has("/funnel/business-setup-viewed")) return "Business setup started";
  if(set.has("/funnel/account-created")) return "Account created · not through setup yet";
  if(set.has("/funnel/signup-error")) return "Signup error";
  if(set.has("/funnel/signup-attempted")) return "Signup submitted · not completed";
  if(set.has("/funnel/signup-viewed")) return "Signup form viewed · not submitted";
  if(set.has("/funnel/trial-cta-clicked")) return "Free trial clicked · signup not reached";
  if(set.has("/funnel/signin-error")) return "Sign-in error";
  if(set.has("/funnel/signin-attempted")) return "Sign-in submitted · not successful";
  if(set.has("/funnel/signin-viewed")) return "Sign-in form viewed";
  if(set.has("/funnel/welcome")) return "Welcome viewed · no CTA click";
  if(set.size===1 && set.has("/login")) return "Legacy visit · old tracking";
  return pages.length===1?"1 page":pages.length+" pages";
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
function rememberUsernameEnabled(){
  try{
    const explicit=localStorage.getItem(REMEMBER_USERNAME_KEY);
    if(explicit!==null) return explicit==="1";
    // Preserve the convenient behavior existing users already had, then let
    // the new checkbox become the explicit preference from now on.
    return Boolean(
      String(localStorage.getItem(OWNER_EMAIL_KEY)||"").trim() ||
      String(localStorage.getItem("tle_last_admin_email")||"").trim()
    );
  }catch{
    return false;
  }
}
function rememberedOwnerEmail(){
  if(!rememberUsernameEnabled()) return "";
  const owner=String(localStorage.getItem(OWNER_EMAIL_KEY)||"").trim().toLowerCase();
  if(owner) return owner;
  const platformAdmin=String(localStorage.getItem("tle_last_admin_email")||"").trim().toLowerCase();
  return platformAdmin;
}
function syncRememberUsernameControl(){
  const row=$("#rememberUsernameRow");
  const checkbox=$("#rememberUsername");
  const label=$("#rememberUsernameLabel");
  if(!row||!checkbox) return;
  const signingIn=state.authMode==="signin";
  row.hidden=!signingIn;
  if(signingIn) checkbox.checked=rememberUsernameEnabled();
  if(label){
    label.textContent=langPick("Remember username","Recordar usuario","Mémoriser l’identifiant");
  }
}
function persistRememberUsername(email){
  const checkbox=$("#rememberUsername");
  const keep=state.authMode==="signin" && Boolean(checkbox?.checked);
  try{
    localStorage.setItem(REMEMBER_USERNAME_KEY,keep?"1":"0");
    if(keep && email) localStorage.setItem(OWNER_EMAIL_KEY,String(email).trim().toLowerCase());
    else localStorage.removeItem(OWNER_EMAIL_KEY);
  }catch{}
}
function maskEmail(email=""){
  const clean=String(email).trim();
  const parts=clean.split("@");
  if(parts.length!==2) return clean;
  const name=parts[0];
  const shown=name.length<=2 ? name[0]+"*" : name.slice(0,2)+"***";
  return shown+"@"+parts[1];
}

function saveOwnerSessionBackup(){
  // Supabase already persists the browser session. Never keep a second copy
  // of access/refresh tokens in our own localStorage key.
  clearOwnerSessionBackup();
}
function clearOwnerSessionBackup(){
  try{localStorage.removeItem(OWNER_SESSION_BACKUP_KEY);}catch{}
}
function readOwnerSessionBackup(){
  // One-time cleanup for devices that may still have the legacy token backup.
  clearOwnerSessionBackup();
  return null;
}
async function restoreOwnerSessionFromBackup(){
  // Normal session recovery is handled by supabase.auth.getSession().
  // The legacy duplicate-token fallback is intentionally disabled.
  clearOwnerSessionBackup();
  return null;
}
function markOwnerActivity(){
  if(state.business?.role!=="owner") return;
  localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));
}
function ownerIdleExpired(){
  const lastActivity=Number(localStorage.getItem(OWNER_ACTIVITY_KEY)||0);
  return Number.isFinite(lastActivity) && lastActivity>0 && Date.now()-lastActivity>=OWNER_IDLE_MS;
}
function ownerHomeIdleExpired(){
  const lastActivity=Number(localStorage.getItem(OWNER_HOME_ACTIVITY_KEY)||0);
  return Number.isFinite(lastActivity) && lastActivity>0 && Date.now()-lastActivity>=OWNER_HOME_IDLE_MS;
}
function scheduleOwnerHomeIdleReturn(){
  clearTimeout(window.__tleOwnerHomeIdleTimer);
  if(!state.session || state.business?.role!=="owner") return;
  const lastActivity=Number(localStorage.getItem(OWNER_HOME_ACTIVITY_KEY)||Date.now());
  const elapsed=Math.max(0,Date.now()-lastActivity);
  const wait=Math.max(250,OWNER_HOME_IDLE_MS-elapsed+100);
  window.__tleOwnerHomeIdleTimer=setTimeout(()=>{
    if(document.visibilityState!=="visible") return;
    returnOwnerToHomeAfterIdle();
  },wait);
}
function markOwnerHomeActivity(){
  if(state.business?.role!=="owner") return;
  localStorage.setItem(OWNER_HOME_ACTIVITY_KEY,String(Date.now()));
  scheduleOwnerHomeIdleReturn();
}
function returnOwnerToHomeAfterIdle(){
  if(!state.session || state.business?.role!=="owner" || !ownerHomeIdleExpired()) return false;
  // Do not discard an unfinished modal form. The next normal activity will
  // restart the two-minute clock, while regular workspace screens return Home.
  if(typeof modal!=="undefined" && modal && !modal.hidden){
    markOwnerHomeActivity();
    return false;
  }
  try{
    if(typeof closeNotificationPopover==="function") closeNotificationPopover();
  }catch{}
  try{
    if(typeof setSidebarOpen==="function") setSidebarOpen(false);
  }catch{}
  const current=$(".view.active")?.dataset.page;
  if(current!=="today"){
    openView("today",{fromRestore:true,skipTrack:true,skipIntro:true});
  }else{
    try{ window.scrollTo({top:0,behavior:"auto"}); }catch{}
  }
  localStorage.setItem(OWNER_HOME_ACTIVITY_KEY,String(Date.now()));
  scheduleOwnerHomeIdleReturn();
  return true;
}
function returnOwnerToHomeOnResume(){
  if(!state.session || state.business?.role!=="owner") return false;
  if(!ownerHomeIdleExpired()) return false;
  // Do not discard an unfinished form/modal when iOS briefly backgrounds the app.
  if(typeof modal!=="undefined" && modal && !modal.hidden) return false;
  try{ if(typeof closeNotificationPopover==="function") closeNotificationPopover(); }catch{}
  try{ if(typeof setSidebarOpen==="function") setSidebarOpen(false); }catch{}
  navHistory.length=1;
  navHistory[0]="today";
  const current=$(".view.active")?.dataset.page;
  if(current!=="today"){
    openView("today",{fromRestore:true,skipTrack:true,skipIntro:true});
  }else{
    const main=$("#appShell>.main");
    if(main) main.scrollTo({top:0,behavior:"auto"});
    try{ window.scrollTo({top:0,behavior:"auto"}); }catch{}
  }
  try{ localStorage.setItem(workspaceViewStorageKey(),"today"); }catch{}
  return true;
}

async function expireOwnerSession(){
  if(window.__tleOwnerLocking) return;
  window.__tleOwnerLocking=true;
  const ownerEmail=String(state.session?.user?.email||rememberedOwnerEmail()).trim().toLowerCase();
  try{
    try{ await supabase.auth.signOut({scope:"local"}); }catch(err){ console.warn("[TLE] idle sign out",err); }
    state.session=null;
    state.business=null;
    clearOwnerSessionBackup();
    localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
    localStorage.removeItem(OWNER_ACTIVITY_KEY);
    if(ownerEmail && rememberUsernameEnabled()) localStorage.setItem(OWNER_EMAIL_KEY,ownerEmail);
    showAuth();
    setAuthMode("signin");
    const emailInput=$("#authEmail");
    if(emailInput && ownerEmail) emailInput.value=ownerEmail;
    prepareAdminShortcut();
    setAuthStatus("For your security, please sign in again after 12 hours of inactivity.");
  }finally{
    window.__tleOwnerLocking=false;
  }
}
window.addEventListener("tle:languagechange",()=>{
  if(state.session && state.business?.role==="owner"){
    markOwnerActivity();
  }
});
window.addEventListener("pagehide",()=>{
  if(state.session){
    saveOwnerSessionBackup(state.session);
    if(state.business?.role==="owner") markOwnerActivity();
  }
});
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="hidden" && state.session){
    saveOwnerSessionBackup(state.session);
    if(state.business?.role==="owner") markOwnerActivity();
  }
});

function installOwnerActivityTracker(){
  if(window.__tleOwnerActivityInstalled) return;
  window.__tleOwnerActivityInstalled=true;
  let lastWrite=0;
  let lastHomeWrite=0;
  const onActivity=()=>{
    if(!state.session || state.business?.role!=="owner") return;
    if(ownerIdleExpired()){
      expireOwnerSession().catch(err=>console.warn("[TLE] idle lock",err));
      return;
    }
    const now=Date.now();
    if(now-lastWrite>60000){
      lastWrite=now;
      markOwnerActivity();
    }
    if(now-lastHomeWrite>15000){
      lastHomeWrite=now;
      markOwnerHomeActivity();
    }
  };
  ["pointerdown","keydown","touchstart","scroll"].forEach(evt=>{
    window.addEventListener(evt,onActivity,{passive:true});
  });
  document.addEventListener("visibilitychange",()=>{
    if(!state.session || state.business?.role!=="owner") return;
    if(document.visibilityState==="visible"){
      if(ownerIdleExpired()){
        expireOwnerSession().catch(err=>console.warn("[TLE] idle lock",err));
        return;
      }
      returnOwnerToHomeOnResume();
      markOwnerActivity();
      markOwnerHomeActivity();
      return;
    }
    // Leaving the PWA starts the two-minute return-to-Home window without
    // shortening the separate 12-hour authenticated session.
    markOwnerActivity();
    markOwnerHomeActivity();
  });
  window.addEventListener("pageshow",()=>{
    if(!state.session || state.business?.role!=="owner") return;
    if(ownerIdleExpired()){
      expireOwnerSession().catch(err=>console.warn("[TLE] idle lock",err));
      return;
    }
    returnOwnerToHomeOnResume();
    markOwnerActivity();
    markOwnerHomeActivity();
  },{passive:true});
  window.addEventListener("pagehide",()=>{
    if(state.session && state.business?.role==="owner"){
      markOwnerActivity();
      markOwnerHomeActivity();
    }
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
  toggle.setAttribute("aria-label",visible?langPick("Hide password","Ocultar contraseña","Masquer le mot de passe"):langPick("Show password","Mostrar contraseña","Afficher le mot de passe"));
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
function setAuthMode(mode,options={}){
  state.authMode=mode;
  if(authWelcome && !options.keepWelcome) authWelcome.hidden=true;
  if(authPanel) authPanel.hidden=false;
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
  const email=$("#authEmail");
  const emailField=$("#emailField")||email?.closest("label");
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
    if(email) email.autocomplete="email";
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
    if(email) email.autocomplete="username";
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
    if(email) email.autocomplete="username";
    emailField.hidden=false;
    forgot.hidden=false;
    if(signupLegalNote) signupLegalNote.hidden=true;
  }

  syncRememberUsernameControl();
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

  // Mobile Safari can preserve the old scroll position when the auth mode
  // changes. Re-anchor the visible form so the primary submit button remains
  // reachable without the user hunting for it off-screen.
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      const isTouchDevice=window.matchMedia?.("(pointer: coarse)")?.matches;
      if(isTouchDevice){
        try{authPanel?.scrollIntoView({block:"start",inline:"nearest",behavior:"auto"});}catch{}
      }
    },60);
  });

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
      setTimeout(()=>{
        try{email?.focus({preventScroll:true});}catch{try{email?.focus();}catch{}}
      },40);
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
      const retry=$("#authRetryButton"); if(retry){retry.hidden=false;retry.textContent=langPick("Try again","Intentar otra vez","Réessayer");}
      $("#authEmail").focus();
      return;
    }
    if(!password || password.length<8){
      setAuthStatus(authRequiredFieldMessage(),"error");
      const retry=$("#authRetryButton"); if(retry){retry.hidden=false;retry.textContent=langPick("Try again","Intentar otra vez","Réessayer");}
      $("#authPassword").focus();
      return;
    }
    const retry=$("#authRetryButton"); if(retry) retry.hidden=true;
    if(state.authMode==="signup") trackFunnelStep("/funnel/signup-attempted",{repeat:true});
    else if(state.authMode==="signin") trackFunnelStep("/funnel/signin-attempted",{repeat:true});
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
          emailRedirectTo: authEmailRedirectUrl(),
          data:{
            tle_new_signup:true,
            tle_signup_welcome_seen:false,
            preferred_language:authPreferredLanguage()
          }
        }
      });
      if(error) throw error;
      if(data.session){
        try{ await supabase.auth.signOut({scope:"local"}); }catch{}
        state.session=null;
      }
      const createdEmail=email;
      trackFunnelStep("/funnel/account-created");
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
      persistRememberUsername(email);
      localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
      if(state.session) saveOwnerSessionBackup(state.session);
      setAuthStatus("Signed in.","success");
      trackFunnelStep("/funnel/signin-success");
      window.__tleShowSignupWelcome=hasLocalSignupWelcomePending() || hasAccountSignupWelcomePending();
      trackGoogleEvent("login",{method:"password"});
      await enterAuthenticatedApp();
    }
  }catch(err){
    const email=$("#authEmail")?.value?.trim()?.toLowerCase()||"";
    if(state.authMode==="signup") trackFunnelStep("/funnel/signup-error",{repeat:true});
    else if(state.authMode==="signin") trackFunnelStep("/funnel/signin-error",{repeat:true});
    showAuthFailure(err,state.authMode,email);
  }finally{
    setBusy(button,false);
  }
});

$("#forgotPassword").addEventListener("click", async ()=>{
  const email = $("#authEmail").value.trim();
  if(!email){ showToast("Enter your email first"); return; }
  const { error } = await supabase.auth.resetPasswordForEmail(email,{
    redirectTo: authEmailRedirectUrl()
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
  if(window.__tleRealtimeFallbackTimer){
    clearInterval(window.__tleRealtimeFallbackTimer);
    window.__tleRealtimeFallbackTimer=null;
  }

  const wasOwner=state.business?.role==="owner";
  const ownerEmail=String(state.session?.user?.email||rememberedOwnerEmail()).trim().toLowerCase();
  try{
    const {error}=await supabase.auth.signOut({scope:"local"});
    if(error) throw error;

    state.session=null;
    state.business=null;
    clearOwnerSessionBackup();
    if(wasOwner && ownerEmail && rememberUsernameEnabled()){
      localStorage.setItem(OWNER_EMAIL_KEY,ownerEmail);
    }else if(!rememberUsernameEnabled()){
      localStorage.removeItem(OWNER_EMAIL_KEY);
    }
    localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
    localStorage.removeItem(OWNER_ACTIVITY_KEY);
    localStorage.removeItem(OWNER_HOME_ACTIVITY_KEY);
    clearTimeout(window.__tleOwnerHomeIdleTimer);
    showAuth();
    setAuthMode("signin");
    const signInEmail=$("#authEmail");
    if(signInEmail && ownerEmail) signInEmail.value=ownerEmail;
    prepareAdminShortcut();
    setAuthStatus("");

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
  trackFunnelStep("/funnel/business-setup-submitted",{repeat:true});
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
      customer_email_language:["en","es","fr","ht"].includes(globalSetup.default_language)?globalSetup.default_language:"en",
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
      customer_email_language:data.customer_email_language||"en",
      country_code:data.country_code,locale_code:data.locale_code,currency_code:data.currency_code,
      distance_unit:data.distance_unit,temperature_unit:data.temperature_unit,payment_methods:data.payment_methods,
      service_area:data.service_area,default_travel_buffer_minutes:data.default_travel_buffer_minutes,
      trial_ends_at:data.trial_ends_at,trial_days:data.trial_days,trial_promotion:data.trial_promotion,
      subscription_status:data.subscription_status
    };
    try{
      const {error:seedError}=await supabase.rpc("seed_default_services",{p_business_id:data.id});
      if(seedError) console.warn("[TLE] starter services on signup",seedError);
    }catch(seedErr){
      console.warn("[TLE] starter services on signup",seedErr);
    }
    await identifyPlatformAdmin();
    const {data:linkSettings}=await supabase.rpc("get_my_public_link_settings");
    state.publicLinks=linkSettings||null;
    if(rememberUsernameEnabled()){
      localStorage.setItem(OWNER_EMAIL_KEY,String(state.session?.user?.email||"").trim().toLowerCase());
    }
    localStorage.setItem(OWNER_ACTIVITY_KEY,String(Date.now()));
    localStorage.setItem(OWNER_HOME_ACTIVITY_KEY,String(Date.now()));
    window.__tleShowSignupWelcome=
      window.__tleShowSignupWelcome===true ||
      hasLocalSignupWelcomePending() ||
      hasAccountSignupWelcomePending();
    trackFunnelStep("/funnel/workspace-created");
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
        langPick("Check the required fields and try again.","Revisa los campos requeridos y vuelve a intentarlo.","Vérifiez les champs obligatoires et réessayez."),
        "error"
      );
      if(setupRetry){
        setupRetry.hidden=false;
        setupRetry.textContent=langPick("Try again","Intentar otra vez","Réessayer");
      }
      if(!businessName) $("#businessName")?.focus();
      else $("#businessArea")?.focus();
    }else{
      setBusinessSetupStatus(
        langPick("We couldn’t create your workspace. Try again.","No pudimos crear tu espacio. Intenta otra vez.","Impossible de créer votre espace. Réessayez."),
        "error"
      );
      if(setupRetry){
        setupRetry.hidden=false;
        setupRetry.textContent=langPick("Try again","Intentar otra vez","Réessayer");
      }
      const email=String(state.session?.user?.email||"").trim().toLowerCase();
      const attempt=recordAuthIssueAttempt("signup",email,err);
      if(attempt.item.count>=2 && !attempt.item.reported){
        reportPersistentAuthIssue("signup",email,err,attempt.item.count,attempt.key).then(reported=>{
          if(reported){
            setBusinessSetupStatus(
              langPick("The error is still happening. Support has been alerted. Check the fields and try again.","El error continúa. Soporte ya recibió una alerta. Revisa los campos y vuelve a intentarlo.","L’erreur continue. Le support a été prévenu. Vérifiez les champs et réessayez."),
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
  if(window.TLE_I18N?.setLanguage && ["en","es","fr","ht"].includes(workerLanguage)){
    window.TLE_I18N.setLanguage(workerLanguage);
  }
  renderWorkerPortal();
  dismissSessionSplash();
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
    ht:{access:"Aksè anplwaye envite",pill:"AKSÈ ANPLWAYE ENVITE",welcome:"Byenveni, ",guest:"envite",copy:"Sa a se espas limite anplwaye ou. Ou ka itilize sèlman zouti admin ou pataje avè w."},
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
      ? escapeHtml(langPick("No messages yet.","Sin mensajes todavía.","Aucun message pour le moment."))
      : escapeHtml(langPick("No conversation yet.","Sin conversación todavía.","Aucune conversation pour le moment."))}</strong><span>${viewer==="worker"
      ? escapeHtml(langPick("Messages from your admin will appear here.","Los mensajes de tu administrador aparecerán aquí.","Les messages de votre administrateur apparaîtront ici."))
      : escapeHtml(langPick("Write the first message below.","Escribe el primer mensaje abajo.","Écrivez le premier message ci-dessous."))}</span></div>`;
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
  window.__tleBootInProgress=true;
  window.__tleBootResolved=false;
  window.__tleEnterAppPromise=(async()=>{
    try{
      await initialize();
    }finally{
      window.__tleBootInProgress=false;
      window.__tleBootResolved=true;
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

  let storedSession=null;
  for(let attempt=0;attempt<3;attempt++){
    try{
      const result=await supabase.auth.getSession();
      storedSession=result?.data?.session||null;
      if(storedSession) break;
    }catch(err){
      console.warn("[TLE] persisted session read",err);
    }
    if(attempt<2) await new Promise(resolve=>setTimeout(resolve,180));
  }
  let session=storedSession||null;

  // iOS Home Screen can occasionally fail to surface Supabase's own stored
  // session even while our app storage remains intact. Restore the same
  // access/refresh tokens Supabase already persists, but only inside the
  // user's 12-hour inactivity window.
  if(!session){
    session=await restoreOwnerSessionFromBackup();
  }

  state.session=session;
  if(!session){
    localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);
    const ownerEmail=rememberedOwnerEmail();
    const emailInput=$("#authEmail");
    if(ownerEmail && emailInput && !emailInput.value) emailInput.value=ownerEmail;

    // New/prospective customers always see the product intro before Create account.
    // Returning owners with a remembered email may go straight to Sign in.
    if(ownerEmail) prepareDirectAuth();
    else showAuthWelcome();
    return;
  }

  saveOwnerSessionBackup(session);
  const signedInEmail=String(session.user?.email||"").trim().toLowerCase();
  localStorage.removeItem(OWNER_REAUTH_REQUIRED_KEY);

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

  if(!context && state.isPlatformAdmin){
    const {data:b,error:businessError}=await supabase
      .from("businesses")
      .select("id,name,timezone,default_language,customer_email_language,service_area,default_travel_buffer_minutes,trial_ends_at,subscription_status,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods")
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
        customer_email_language:b.customer_email_language||"en",
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
    customer_email_language:context.customer_email_language||"en",
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

  if(state.business?.role==="owner"){
    await syncAuthPreferredLanguage(state.business.default_language||"en");
  }

  if(state.business?.role==="owner" && ownerIdleExpired()){
    await expireOwnerSession();
    return;
  }

  try{
    const {data:companyProfile,error:companyProfileError}=await supabase
      .from("businesses")
      .select("email,phone,timezone,default_language,customer_email_language,service_area,default_travel_buffer_minutes,instagram_url,facebook_url,trial_started_at,trial_ends_at,trial_days,trial_promotion,subscription_status,trial_welcome_sent_at,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods,owner_notify_email,owner_notify_push,owner_notify_sms,owner_notification_email,owner_notification_phone")
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
  await trackVisit("/app/"+($(".view.active")?.dataset.page||"today"));
}
window.addEventListener("pageshow",()=>{
  // iOS fires pageshow before persisted Auth is fully resolved on a cold PWA
  // launch. Never choose the auth shell while boot is still deciding whether
  // a valid saved session exists.
  if(window.__tleBootInProgress || window.__tleBootResolved!==true) return;
  if(!appShell?.hidden){
    setShellState("app");
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
    // Supabase can briefly emit SIGNED_OUT while iOS is still restoring its
    // persisted session. During boot, initialize() is the single source of
    // truth and will show Auth itself only if restoration truly fails.
    if(window.__tleBootInProgress && !window.__tleSigningOut && !window.__tleOwnerLocking) return;
    state.session=null;
    state.business=null;
    if(window.__tleSigningOut || window.__tleOwnerLocking) return;
    setTimeout(()=>{
      showAuthWelcome();
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

  // Email is the primary identity key. If an email is present, never let a
  // shared phone number or similar name override a different email.
  if(cleanEmail){
    return state.clients.find(c=>String(c.email||"").trim().toLowerCase()===cleanEmail)||null;
  }
  if(cleanPhone){
    return state.clients.find(c=>String(c.phone||"").replace(/\D/g,"")===cleanPhone)||null;
  }
  if(cleanName){
    return state.clients.find(c=>String(c.name||"").trim().toLowerCase()===cleanName)||null;
  }
  return null;
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
      preferredLanguage:b.preferred_language||lead?.preferred_language||client?.preferred_language||"",
      recurrencePattern:b.recurrence_pattern||"one_time",
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
      preferredLanguage:l.preferred_language||client?.preferred_language||"",
      status:l.status||"new",
      clientId:client?.id||""
    });
  });

  state.quotes.forEach(q=>{
    const status=String(q.status||"").toLowerCase();
    if(!["accepted","declined"].includes(status)) return;
    const eventAt=status==="accepted"?(q.accepted_at||q.updated_at):q.updated_at;
    if(!eventAt) return;
    items.push({
      id:"quote-"+status+":"+q.id,
      recordId:q.id,
      type:"quote-"+status,
      createdAt:eventAt,
      name:q.customer_name||langPick("Customer","Cliente","Client"),
      email:q.customer_email||"",
      phone:q.customer_phone||"",
      address:q.service_address||"",
      service:status==="accepted"
        ? langPick("Quote accepted","Cotización aceptada","Devis accepté")+" · "+money(Number(q.total||0))
        : langPick("Quote declined","Cotización rechazada","Devis refusé")+" · "+money(Number(q.total||0)),
      serviceId:"",
      requestedAt:q.preferred_date&&q.preferred_time?q.preferred_date+"T"+q.preferred_time:"",
      notes:q.notes||"",
      preferredContact:"",
      preferredLanguage:q.preferred_language||state.clients.find(c=>c.id===q.client_id)?.preferred_language||"",
      status,
      clientId:q.client_id||""
    });
  });

  state.quotes.forEach(q=>{
    const status=String(q.status||"").toLowerCase();
    if(!["requested","submitted","new"].includes(status)) return;
    items.push({
      id:"quote-request:"+q.id,
      recordId:q.id,
      type:"quote-request",
      createdAt:q.created_at,
      name:q.customer_name||langPick("New quote request","Nueva solicitud de cotización","Nouvelle demande de devis"),
      email:q.customer_email||"",
      phone:q.customer_phone||"",
      address:q.service_address||"",
      service:langPick("Quote request","Solicitud de cotización","Demande de devis"),
      notes:q.notes||"",
      preferredLanguage:q.preferred_language||state.clients.find(c=>c.id===q.client_id)?.preferred_language||"",
      status,
      clientId:q.client_id||""
    });
  });

  state.invoices.forEach(inv=>{
    const customerName=inv.clients?.name||langPick("Customer","Cliente","Client");
    if(inv.customer_payment_selected_at && inv.customer_payment_method){
      items.push({
        id:"invoice-payment-choice:"+inv.id+":"+inv.customer_payment_selected_at,
        recordId:inv.id,
        type:"invoice-payment-choice",
        createdAt:inv.customer_payment_selected_at,
        name:customerName,
        service:langPick("Payment method selected","Método de pago seleccionado","Mode de paiement sélectionné")+" · "+customerPaymentMethodLabel(inv),
        status:inv.status||""
      });
    }
    (inv.payments||[]).forEach(p=>{
      const status=String(p.status||"").toLowerCase();
      if(!["paid","completed","succeeded"].includes(status)) return;
      items.push({
        id:"payment:"+p.id,
        recordId:inv.id,
        type:"payment",
        createdAt:p.paid_at||p.created_at,
        name:customerName,
        service:langPick("Payment received","Pago recibido","Paiement reçu")+" · "+money(Number(p.amount||0)),
        status
      });
    });
  });

  state.disputes.forEach(d=>{
    if(!d.created_at) return;
    items.push({
      id:"dispute:"+d.id,
      recordId:d.id,
      type:"dispute",
      resourceType:d.resource_type||"",
      createdAt:d.created_at,
      name:d.customer_name||langPick("Customer","Cliente","Client"),
      email:d.customer_email||"",
      service:langPick("New dispute","Nueva disputa","Nouvelle contestation")+" · "+String(d.resource_type||"").replaceAll("_"," "),
      notes:d.reason||"",
      status:d.status||"open"
    });
  });

  state.jobs.forEach(j=>{
    const status=String(j.status||"").toLowerCase();
    if(!["on_the_way","in_progress","completed"].includes(status)) return;
    const eventAt=j.updated_at||j.created_at;
    if(!eventAt) return;
    const statusText=status==="on_the_way"
      ? langPick("On the way","En camino","En route")
      : status==="in_progress"
      ? langPick("Job started","Trabajo iniciado","Travail commencé")
      : langPick("Job completed","Trabajo completado","Travail terminé");
    items.push({
      id:"job-status:"+status+":"+j.id+":"+eventAt,
      recordId:j.id,
      type:"job-status",
      createdAt:eventAt,
      name:j.clients?.name||j.services?.name||langPick("Cleaning job","Trabajo de limpieza","Prestation de nettoyage"),
      address:j.service_address||"",
      service:statusText,
      status
    });
  });

  (state.teamMessageThreads||[]).forEach(thread=>{
    const unread=Number(thread.unread_count||0);
    if(unread<=0 || !thread.last_message_at) return;
    items.push({
      id:"team-message:"+thread.team_member_id+":"+thread.last_message_at,
      recordId:thread.team_member_id,
      type:"team-message",
      createdAt:thread.last_message_at,
      name:thread.name||langPick("Employee","Empleado","Employé"),
      service:thread.last_message||langPick("New team message","Nuevo mensaje del equipo","Nouveau message d’équipe"),
      status:"unread"
    });
  });

  const latestEmailIssueByRecipient=new Map();
  (state.emailDeliveryIssues||[]).forEach(issue=>{
    if(issue.resolved_at) return;
    const email=String(issue.customer_email||"").trim().toLowerCase();
    if(!email || latestEmailIssueByRecipient.has(email)) return;
    latestEmailIssueByRecipient.set(email,issue);
  });
  latestEmailIssueByRecipient.forEach(issue=>{
    const client=findMatchingClient({email:issue.customer_email,name:issue.customer_name});
    const issueLabel=String(issue.delivery_status||"").toLowerCase()==="complained"
      ? langPick("Customer marked this email as spam","El cliente marcó este correo como spam","Le client a marqué cet e-mail comme indésirable")
      : langPick("Email needs verification","El email necesita verificación","L’e-mail doit être vérifié");
    items.push({
      id:"email-delivery:"+issue.id,
      recordId:issue.id,
      type:"email-delivery",
      createdAt:issue.occurred_at||issue.created_at,
      name:client?.name||issue.customer_name||langPick("Customer email","Email del cliente","E-mail du client"),
      email:issue.customer_email||"",
      phone:client?.phone||"",
      address:clientServiceAddress(client)||"",
      service:issueLabel+(issue.email_subject?" · "+issue.email_subject:""),
      notes:issue.reason||"",
      preferredLanguage:client?.preferred_language||"",
      status:issue.delivery_status||"",
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

  if(item.type==="email-delivery"){
    closeNotificationPopover();
    if(item.clientId){
      openClientInfo(item.clientId);
      return;
    }
    state.modalType="emailDeliveryIssue";
    state.modalId=item.recordId;
    modalHeader(
      langPick("EMAIL DELIVERY ISSUE","PROBLEMA DE ENTREGA DEL EMAIL","PROBLÈME DE LIVRAISON DE L’E-MAIL"),
      item.email||langPick("Customer email","Email del cliente","E-mail du client"),
      langPick("Verify the email address before sending again.","Verifica la dirección antes de volver a enviar.","Vérifiez l’adresse avant de renvoyer.")
    );
    entityForm.innerHTML=`
      <div class="inquiry-detail-card email-delivery-detail">
        <div class="email-delivery-warning">
          <strong>${escapeHtml(langPick("Email not delivered","Email no entregado","E-mail non livré"))}</strong>
          <span>${escapeHtml(item.notes||langPick("The email provider could not deliver this message.","El proveedor de correo no pudo entregar este mensaje.","Le fournisseur de messagerie n’a pas pu livrer ce message."))}</span>
        </div>
        <div class="inquiry-detail-grid">
          <div class="full"><small>Email</small><strong>${escapeHtml(item.email||"—")}</strong></div>
          <div><small>${escapeHtml(langPick("Status","Estado","Statut"))}</small><strong>${escapeHtml(String(item.status||"").replaceAll("_"," "))}</strong></div>
          <div><small>${escapeHtml(langPick("Detected","Detectado","Détecté"))}</small><strong>${escapeHtml(formatDateTime(item.createdAt))}</strong></div>
        </div>
        <div class="form-footer inquiry-detail-actions">
          <button type="button" class="ghost-btn" data-modal-cancel>${escapeHtml(langPick("Close","Cerrar","Fermer"))}</button>
          <button type="button" class="primary-btn" data-open-view="clients">${escapeHtml(langPick("Check clients","Revisar clientes","Voir les clients"))}</button>
        </div>
      </div>`;
    modal.hidden=false;
    return;
  }

  if(item.type==="quote-accepted" || item.type==="quote-declined" || item.type==="quote-request"){
    closeNotificationPopover();
    openView("quotes");
    setTimeout(()=>{
      const target=document.querySelector('[data-id="'+CSS.escape(item.recordId)+'"]');
      target?.scrollIntoView({behavior:"smooth",block:"center"});
    },180);
    return;
  }

  if(item.type==="payment" || item.type==="invoice-payment-choice"){
    closeNotificationPopover();
    openView("invoices");
    return;
  }

  if(item.type==="dispute"){
    closeNotificationPopover();
    openView(item.resourceType==="quote"?"quotes":"invoices");
    return;
  }

  if(item.type==="job-status"){
    closeNotificationPopover();
    const job=state.jobs.find(j=>j.id===item.recordId);
    openView("calendar");
    if(job){
      const dateKey=tleCalendarDateKey(job.starts_at);
      state.calendarSelectedDate=dateKey;
      requestAnimationFrame(()=>{
        renderCalendarDayDetails(dateKey,{jobId:job.id});
      });
    }else{
      showToast(langPick("Job details are no longer available.","Los detalles del trabajo ya no están disponibles.","Les détails du travail ne sont plus disponibles."));
    }
    return;
  }

  if(item.type==="team-message"){
    closeNotificationPopover();
    state.activeTeamMessageMemberId=item.recordId;
    openView("team");
    loadTeamMessageThread(item.recordId,{markRead:true})
      .then(()=>loadTeamMessageThreads())
      .then(()=>renderInquiryNotifications())
      .catch(err=>console.warn("[TLE] open team message",err));
    return;
  }

  state.modalType="inquiryDetail";
  state.modalId=item.recordId;

  const typeLabel=item.type==="booking"
    ? langPick("BOOKING REQUEST","SOLICITUD DE RESERVA","DEMANDE DE RÉSERVATION")
    : langPick("INQUIRY","INQUIRY","DEMANDE");

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
        <span>${escapeHtml(langPick("SERVICE","SERVICIO","SERVICE"))}</span>
        <strong>${escapeHtml(item.service)}</strong>
        ${statusLabel?`<small>${escapeHtml(statusLabel)}</small>`:""}
      </div>

      <div class="inquiry-detail-grid">
        ${item.phone?`<div><small>${escapeHtml(langPick("Phone","Teléfono","Téléphone"))}</small><strong>${escapeHtml(item.phone)}</strong></div>`:""}
        ${item.email?`<div><small>Email</small><strong>${escapeHtml(item.email)}</strong></div>`:""}
        ${item.address?`<div class="full"><small>${escapeHtml(langPick("Address","Dirección","Adresse"))}</small><strong>${escapeHtml(item.address)}</strong></div>`:""}
        ${requested?`<div class="full"><small>${escapeHtml(langPick("Requested date & time","Fecha y hora solicitada","Date et heure demandées"))}</small><strong>${escapeHtml(requested)}</strong></div>`:""}
        ${item.type==="booking"?`<div><small>${escapeHtml(langPick("Frequency","Frecuencia","Fréquence"))}</small><strong>${escapeHtml(bookingRecurrenceLabel(item.recurrencePattern))}</strong></div>`:""}
        ${contactMethod?`<div><small>${escapeHtml(langPick("Preferred contact","Contacto preferido","Contact préféré"))}</small><strong>${escapeHtml(contactMethod)}</strong></div>`:""}
        ${item.preferredLanguage?`<div><small>${escapeHtml(langPick("Email language","Idioma de emails","Langue des e-mails"))}</small><strong>${escapeHtml(customerEmailLanguageLabel(item.preferredLanguage))}</strong></div>`:""}
        ${item.notes?`<div class="full customer-authored-text"><small>${escapeHtml(langPick("Notes","Notas","Notes"))}</small><p>${escapeHtml(item.notes)}</p>${customerTranslateLink(item.notes,item.preferredLanguage)}</div>`:""}
      </div>

      <div class="form-footer inquiry-detail-actions">
        <button type="button" class="ghost-btn" data-modal-cancel>${escapeHtml(langPick("Close","Cerrar","Fermer"))}</button>
        ${item.clientId?`<button type="button" class="primary-btn" data-inquiry-open-client="${escapeHtml(item.clientId)}">${escapeHtml(langPick("Open client","Abrir cliente","Ouvrir le client"))}</button>`:""}
        ${item.type==="lead"?`<button type="button" class="primary-btn" data-inquiry-open-lead="${escapeHtml(item.recordId)}">${escapeHtml(langPick("Open lead","Abrir lead","Ouvrir le prospect"))}</button>`:""}
      </div>
    </div>`;
  modal.hidden=false;
}

function getInquiryUnreadCount(){
  return getInquiryNotifications().filter(item=>!isInquiryNotificationRead(item)).length;
}

function notificationTypeLabel(item){
  if(!item) return "";
  const labels={
    booking:langPick("Booking request","Solicitud de reserva","Demande de réservation"),
    lead:langPick("Lead","Lead","Prospect"),
    "quote-request":langPick("Quote request","Solicitud de cotización","Demande de devis"),
    "quote-accepted":langPick("Quote accepted","Cotización aceptada","Devis accepté"),
    "quote-declined":langPick("Quote declined","Cotización rechazada","Devis refusé"),
    payment:langPick("Payment","Pago","Paiement"),
    "invoice-payment-choice":langPick("Payment choice","Método de pago","Choix de paiement"),
    dispute:langPick("Dispute","Disputa","Contestation"),
    "job-status":langPick("Job update","Actualización del trabajo","Mise à jour du travail"),
    "team-message":langPick("Team message","Mensaje del equipo","Message d’équipe"),
    "email-delivery":langPick("Email delivery issue","Problema de entrega del email","Problème de livraison de l’e-mail")
  };
  return labels[item.type]||langPick("Notification","Notificación","Notification");
}

function renderInquiryNotifications(){
  const button=$("#notificationBellBtn");
  const badge=$("#notificationBadge");
  const list=$("#notificationList");
  if(!button||!badge||!list||!state.business) return;

  const items=getInquiryNotifications();
  const unreadItems=items.filter(item=>!isInquiryNotificationRead(item));
  const unread=unreadItems.length;

  const previousUnread=Number(button.dataset.unreadCount||0);
  badge.textContent=unread>99?"99+":String(unread);
  badge.hidden=unread===0;
  button.classList.toggle("has-notifications",unread>0);
  button.dataset.unreadCount=String(unread);
  if(unread>previousUnread){
    button.classList.remove("notification-arrived");
    void button.offsetWidth;
    button.classList.add("notification-arrived");
    clearTimeout(window.__tleNotificationMotionTimer);
    window.__tleNotificationMotionTimer=setTimeout(()=>button.classList.remove("notification-arrived"),1700);
  }
  button.setAttribute("aria-label",unread
    ? langPick(unread+" new notifications",unread+" notificaciones nuevas",unread+" nouvelles notifications")
    : langPick("Notifications","Notificaciones","Notifications"));

  if(!unreadItems.length){
    list.innerHTML=`<div class="notification-empty"><strong>${escapeHtml(langPick("You’re all caught up","Todo al día","Tout est à jour"))}</strong><span>${escapeHtml(langPick("Only new notifications will appear here.","Solo las notificaciones nuevas aparecerán aquí.","Seules les nouvelles notifications apparaîtront ici."))}</span></div>`;
    return;
  }

  list.innerHTML=unreadItems.slice(0,8).map(item=>{
    const isNew=true;
    const typeLabel=notificationTypeLabel(item);
    return `
      <button class="notification-item ${isNew?"is-new":""} ${item.type==="email-delivery"?"is-email-issue":""}" type="button" data-notification-id="${escapeHtml(item.id)}">
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
  if(window.__tleRealtimeFallbackTimer){
    clearInterval(window.__tleRealtimeFallbackTimer);
    window.__tleRealtimeFallbackTimer=null;
  }

  const refresh=function(){
    clearTimeout(window.__tleOperationalRefresh);
    const unreadBefore=getInquiryUnreadCount();
    window.__tleOperationalRefresh=setTimeout(async function(){
      try{
        await loadCoreData();
        const unreadAfter=getInquiryUnreadCount();
        if(unreadAfter>unreadBefore){
          const newest=getInquiryNotifications()[0];
          if(newest?.type==="quote-accepted"){
            showToast(langPick("Quote accepted","Cotización aceptada","Devis accepté")+" · "+(newest.name||""));
          }else if(newest?.type==="quote-declined"){
            showToast(langPick("Quote declined","Cotización rechazada","Devis refusé")+" · "+(newest.name||""));
          }else if(newest?.type==="email-delivery"){
            showToast(langPick("Email delivery issue","Problema de entrega del email","Problème de livraison de l’e-mail")+" · "+(newest.email||newest.name||""));
          }else{
            const summary=[newest?.name,newest?.service].filter(Boolean).join(" · ");
            showToast(langPick("New notification","Nueva notificación","Nouvelle notification")+(summary?" · "+summary:""));
          }
        }
      }catch(err){
        console.warn("[TLE] realtime workspace refresh",err);
      }
    },500);
  };

  const startFallbackPolling=function(){
    if(window.__tleRealtimeFallbackTimer || !state.session || !state.business) return;
    window.__tleRealtimeFallbackTimer=setInterval(()=>{
      if(!state.session || !state.business || document.visibilityState!=="visible" || !appShell || appShell.hidden) return;
      loadCoreData().catch(err=>console.warn("[TLE] realtime fallback refresh",err));
    },30000);
  };

  // team_messages is intentionally excluded here. That table is accessed only
  // through protected RPCs and does not grant authenticated SELECT on
  // business_id, so adding a Postgres Changes filter for it causes Realtime to
  // reject the whole subscription. Team messaging already has its own polling.
  let channel=supabase.channel("workspace-updates-"+state.business.id);
  ["invoices","jobs","quotes","booking_requests","leads","payments","customer_disputes","job_time_entries","email_delivery_issues"].forEach(function(table){
    channel=channel.on("postgres_changes",{
      event:"*",
      schema:"public",
      table:table,
      filter:"business_id=eq."+state.business.id
    },refresh);
  });
  window.__tleInvoiceRealtime=channel.subscribe((status,err)=>{
    if(status==="SUBSCRIBED"){
      if(window.__tleRealtimeFallbackTimer){
        clearInterval(window.__tleRealtimeFallbackTimer);
        window.__tleRealtimeFallbackTimer=null;
      }
      return;
    }
    if(status==="CHANNEL_ERROR" || status==="TIMED_OUT"){
      console.warn("[TLE] realtime unavailable; using safe polling fallback",err||status);
      startFallbackPolling();
    }
  });
}

async function loadCoreData(){
  if(!state.business) return;
  const businessId=state.business.id;
  if(state.coreDataLoadedFor && state.coreDataLoadedFor!==businessId) state.coreDataLoadedFor=null;

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
  let [clients,leads,services,addons,availability]=await Promise.all([
    safe("clients",supabase.from("clients").select("*").eq("business_id",businessId).is("archived_at",null).order("created_at",{ascending:false}),state.clients),
    safe("leads",supabase.from("leads").select("*").eq("business_id",businessId).is("archived_at",null).order("created_at",{ascending:false}),state.leads),
    safe("services",supabase.from("services").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),state.services),
    safe("service add-ons",supabase.from("service_addons").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),state.serviceAddons),
    safe("availability",supabase.from("availability_rules").select("*").eq("business_id",businessId).order("weekday").order("start_time"),state.availabilityRules)
  ]);

  if((services||[]).length===0 && ["owner","admin"].includes(String(state.business?.role||""))){
    try{
      const {error:seedError}=await supabase.rpc("seed_default_services",{p_business_id:businessId});
      if(seedError) throw seedError;
      const {data:seededServices,error:seedFetchError}=await supabase
        .from("services").select("*").eq("business_id",businessId)
        .order("active",{ascending:false}).order("name");
      if(seedFetchError) throw seedFetchError;
      services=seededServices||[];
    }catch(err){
      console.warn("[TLE] starter services",err);
    }
  }

  state.clients=clients;
  state.leads=leads;
  state.services=services||[];
  state.serviceAddons=addons;
  state.availabilityRules=availability;
  renderClients();
  renderLeads();
  renderServices();
  renderBookingServices();
  renderAvailabilityEditor();

  const [jobs,quotes,team,supplies,disputes,recurrences]=await Promise.all([
    safe("jobs",supabase.from("jobs").select("*, clients(name,email), services(name), job_assignments(id,team_member_id,team_members(name))").eq("business_id",businessId).order("starts_at",{ascending:true}),state.jobs),
    safe("quotes",supabase.from("quotes").select("*, quote_items(*)").eq("business_id",businessId).order("created_at",{ascending:false}),state.quotes),
    safe("team",supabase.from("team_members").select("*").eq("business_id",businessId).eq("active",true).order("name"),state.teamMembers),
    safe("supplies",supabase.from("supplies").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),state.supplies),
    safe("customer disputes",supabase.from("customer_disputes").select("*").eq("business_id",businessId).order("created_at",{ascending:false}),state.disputes),
    safe("recurring schedules",supabase.from("recurrence_rules").select("*").eq("business_id",businessId).order("starts_on",{ascending:true}),state.recurrenceRules)
  ]);
  state.jobs=jobs;
  state.quotes=quotes;
  state.teamMembers=team;
  state.supplies=supplies;
  state.disputes=disputes;
  state.recurrenceRules=recurrences;

  if(["owner","admin"].includes(String(state.business?.role||"")) && state.recurrenceRules.some(r=>r.active)){
    try{
      const added=await ensureRecurringJobHorizon();
      if(added>0){
        const refreshed=await safe(
          "recurring jobs refresh",
          supabase.from("jobs").select("*, clients(name,email), services(name), job_assignments(id,team_member_id,team_members(name))").eq("business_id",businessId).order("starts_at",{ascending:true}),
          state.jobs
        );
        state.jobs=refreshed;
      }
    }catch(err){
      console.warn("[TLE] recurring schedule refresh",err);
    }
  }

  renderJobs();
  renderQuotes();
  renderTeam();
  if(["owner","admin"].includes(String(state.business?.role||""))) await loadTeamMessageThreads().catch(err=>console.warn("[TLE] team messages",err));
  renderSupplies();

  const [invoices,bookingRequests,mileageLogs,timeEntries,emailDeliveryIssues]=await Promise.all([
    safe("invoices",supabase.from("invoices").select("*, clients(name,email), invoice_items(*), payments(id,method,amount,status,paid_at,created_at)").eq("business_id",businessId).order("created_at",{ascending:false}),state.invoices),
    safe("booking requests",supabase.from("booking_requests").select("*, services(name)").eq("business_id",businessId).order("created_at",{ascending:false}),state.bookingRequests),
    safe("mileage",supabase.from("mileage_logs").select("*, jobs(service_address,clients(name),services(name))").eq("business_id",businessId).order("log_date",{ascending:false}),state.mileageLogs),
    safe("time tracking",supabase.from("job_time_entries").select("*, jobs(starts_at,duration_minutes,status,clients(name),services(name)), team_members(name)").eq("business_id",businessId).order("clocked_in_at",{ascending:false}),state.timeEntries),
    safe("email delivery issues",supabase.from("email_delivery_issues").select("*").eq("business_id",businessId).is("resolved_at",null).order("occurred_at",{ascending:false}).limit(25),state.emailDeliveryIssues)
  ]);
  state.invoices=invoices;
  state.bookingRequests=bookingRequests;
  state.mileageLogs=mileageLogs;
  state.timeEntries=timeEntries;
  state.emailDeliveryIssues=emailDeliveryIssues||[];
  // Client cards depend on jobs + invoices for next cleaning and balance,
  // so render them again only after those datasets are available.
  renderClients();
  renderInvoices();
  await loadInquirySeenState();
  await loadInquiryReadIds();
  renderInquiryNotifications();
  state.coreDataLoadedFor=businessId;
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
      showToast(langPick("Some data couldn’t refresh. Your saved data is safe; tap Refresh to try again.","Algunos datos no pudieron actualizarse. Lo guardado sigue seguro; toca Actualizar para intentar otra vez.","Certaines données n’ont pas pu être actualisées. Vos données enregistrées sont en sécurité ; touchez Actualiser pour réessayer."));
    }
  }
}

async function loadOwnerAdmin(){
  $$("[data-account-billing]").forEach(el=>{
    el.hidden=state.isPlatformAdmin;
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

function enhanceMobileRecordActions(){
  if(!window.matchMedia("(max-width: 680px)").matches) return;
  $$(".mobile-record-card .record-actions").forEach(actions=>{
    if(actions.dataset.compactReady==="1" || actions.classList.contains("invoice-actions-stable")) return;
    const safe=actions.querySelector(".safe-actions");
    if(!safe) return;
    const buttons=[...safe.querySelectorAll("button")];
    if(buttons.length<2) return;
    actions.dataset.compactReady="1";
    const primary=buttons.find(b=>b.matches("[data-send-invoice],[data-record-payment],[data-lead-to-quote]"))||buttons[0];
    primary.classList.add("mobile-primary-action");
    const more=document.createElement("button");
    more.type="button"; more.className="mobile-more-actions"; more.textContent="•••";
    more.setAttribute("aria-label",langPick("More actions","Más acciones","Plus d’actions"));
    actions.insertBefore(more,actions.querySelector(".record-delete-btn"));
    more.addEventListener("click",e=>{e.stopPropagation();actions.classList.toggle("mobile-actions-open");});
  });
}
document.addEventListener("click",e=>{
  if(!e.target.closest(".record-actions")) $$(".record-actions.mobile-actions-open").forEach(x=>x.classList.remove("mobile-actions-open"));
});

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
    table.innerHTML=`<div class="empty-table"><strong>${escapeHtml(langPick("No invoices yet.","Aún no hay facturas.","Aucune facture pour le moment."))}</strong><span>${escapeHtml(langPick("Create one manually or accept a quote to prepare a draft invoice.","Crea una manualmente o acepta una cotización para preparar una factura.","Créez-en une manuellement ou acceptez un devis pour préparer une facture."))}</span><button class="text-btn" data-action="invoice">+ ${escapeHtml(langPick("New invoice","Nueva factura","Nouvelle facture"))}</button></div>`;
    return;
  }
  table.innerHTML=state.invoices.map(inv=>{
    const paid=invoicePaidAmount(inv);
    const remaining=Math.max(0,Number(inv.total||0)-paid);
    const lastMethod=(inv.payments||[]).filter(p=>p.status==="confirmed").at(-1)?.method;
    const chosenMethod=String(inv.customer_payment_method||"").toLowerCase();
    const methodLabel=customerPaymentMethodLabel(inv);
    const linkedClient=(state.clients||[]).find(client=>String(client.id)===String(inv.client_id))||null;
    const invoiceClientName=linkedClient?.name||inv.clients?.name||tr("No client");
    const invoicePhone=String(linkedClient?.phone||"").trim();
    const invoiceEmail=String(linkedClient?.email||inv.clients?.email||"").trim();
    const invoiceAddress=String(clientServiceAddress(linkedClient)||"").trim();
    const invoiceContactHtml=[
      invoicePhone?`<a class="invoice-contact-row is-phone" href="tel:${escapeHtml(invoicePhone)}"><span class="invoice-contact-icon" aria-hidden="true">TEL</span><span>${escapeHtml(invoicePhone)}</span></a>`:"",
      invoiceEmail?`<a class="invoice-contact-row is-email" href="mailto:${escapeHtml(invoiceEmail)}"><span class="invoice-contact-icon" aria-hidden="true">@</span><span>${escapeHtml(invoiceEmail)}</span></a>`:"",
      invoiceAddress?`<span class="invoice-contact-row is-address"><span class="invoice-contact-icon" aria-hidden="true">LOC</span><span>${escapeHtml(invoiceAddress)}</span></span>`:""
    ].filter(Boolean).join("");
    const openStatus=customerOpenStatus(inv);
    const dispute=state.disputes.find(d=>d.resource_type==="invoice"&&d.invoice_id===inv.id&&d.status==="open");
    const overdue=inv.due_at && new Date(inv.due_at)<new Date() && !["paid","void"].includes(inv.status);
    const statusClass=inv.status==="paid"?"success":overdue?"danger":inv.status==="sent"||inv.status==="partial"?"warning":"neutral";
    const actionHint=inv.status==="paid"
      ? langPick("Paid in full","Pagada completa","Payée intégralement")
      : overdue
        ? langPick("Collect now","Cobrar ahora","Encaisser maintenant")
        : inv.status==="draft"
          ? langPick("Ready to send","Lista para enviar","Prête à envoyer")
          : inv.status==="partial"
            ? langPick("Balance left","Saldo pendiente","Solde restant")
            : langPick("Awaiting payment","Esperando pago","En attente de paiement");
    const amountLabel=paid>0
      ? `${remaining>0?langPick("remaining","pendiente","restant"):langPick("total","total","total")} · ${money(paid)} ${tr("paid")}`
      : (remaining>0?langPick("remaining","pendiente","restant"):langPick("total","total","total"));
    return `<div class="table-row mobile-record-card invoice-growth-row">
      <span class="record-primary invoice-growth-primary">
        <small class="invoice-number">${escapeHtml(langPick("Invoice","Factura","Facture").toUpperCase())} #${inv.invoice_number||String(inv.id).slice(0,6)}</small>
        <strong class="invoice-growth-amount">${money(remaining||Number(inv.total||0))}</strong>
        <small class="invoice-growth-balance-label">${escapeHtml(amountLabel)}</small>
      </span>
      <span class="invoice-status-badge"><i class="status ${statusClass}">${overdue?tr("Overdue"):escapeHtml(translatedStatus(inv.status))}</i></span>
      <span class="invoice-status-meta">
        <b class="invoice-next-action">${escapeHtml(actionHint)}</b>
        <small class="customer-open-status ${openStatus.opened?"is-viewed":"is-unviewed"}">${escapeHtml(openStatus.text)}</small>
        ${methodLabel?`<small class="payment-choice-note">${escapeHtml(tr("Customer chose"))} ${escapeHtml(methodLabel)}</small>`:""}
        ${dispute?`<small class="dispute-alert">OPEN DISPUTE · ${escapeHtml(dispute.reason)}</small>`:""}
      </span>
      <span class="record-field invoice-client-field" data-label="${escapeHtml(tr("Client"))}"><strong>${escapeHtml(invoiceClientName)}</strong>${inv.due_at?`<small class="invoice-due-date">${escapeHtml(langPick("Due ","Vence ","Échéance ")+new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(inv.due_at)))}</small>`:""}${invoiceContactHtml?`<span class="invoice-contact-list">${invoiceContactHtml}</span>`:""}</span>
      <span class="record-actions invoice-actions-stable">
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
  enhanceMobileRecordActions();
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
    const isUpfront=s.pricing_type==="flat" && Number(s.base_price)>0;
    return `<div class="booking-service-row">
      <span><strong>${escapeHtml(s.name)}</strong><small>${Math.round(s.default_duration_minutes/60*10)/10} hr · ${isUpfront?money(s.base_price):langPick("Custom quote","Cotización personalizada","Devis personnalisé")} · ${isUpfront?langPick("Book a Cleaning","Reservar una limpieza","Réserver un nettoyage"):langPick("Request a Quote","Pedir una cotización","Demander un devis")}</small></span>
      <span class="booking-addon-chips">${isUpfront?(addons.map(a=>`<i>+${escapeHtml(a.name)} · ${money(a.price)}</i>`).join("")||`<i>${escapeHtml(langPick("No add-ons","Sin add-ons","Aucune option"))}</i>`):`<i>${escapeHtml(langPick("Quote path","Flujo de cotización","Parcours devis"))}</i>`}</span>
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
    grid.innerHTML=`<article class="empty-card"><strong>${escapeHtml(langPick("No clients yet.","Aún no hay clientes.","Aucun client pour le moment."))}</strong><span>${escapeHtml(langPick("Confirmed bookings add clients automatically. You can also add one manually.","Las reservas confirmadas agregan clientes automáticamente. También puedes añadir uno manualmente.","Les réservations confirmées ajoutent automatiquement les clients. Vous pouvez aussi en ajouter un manuellement."))}</span><button class="primary-btn" data-create="client">+ ${escapeHtml(langPick("Add client","Añadir cliente","Ajouter un client"))}</button></article>`;
    return;
  }
  const now=new Date();
  grid.innerHTML=state.clients.map(c=>{
    const jobs=state.jobs.filter(j=>j.client_id===c.id&&j.status!=="canceled").sort((x,y)=>new Date(x.starts_at)-new Date(y.starts_at));
    const next=jobs.find(j=>new Date(j.starts_at)>=now&&!["completed","no_show"].includes(j.status));
    const last=[...jobs].reverse().find(j=>new Date(j.starts_at)<now||j.status==="completed");
    const balance=state.invoices.filter(inv=>inv.client_id===c.id&&inv.status!=="void").reduce((sum,inv)=>sum+Math.max(0,Number(inv.total||0)-invoicePaidAmount(inv)),0);
    return `
    <article class="client-card client-card-compact growth-client-card mobile-record-card">
      <div class="client-card-head">
        <div class="client-avatar">${escapeHtml(initials(c.name))}</div>
        <div class="client-card-identity">
          <strong>${escapeHtml(c.name)}</strong>
          <span>${escapeHtml(c.email||tr("No email"))}</span>
        </div>
        <span class="client-balance ${balance>0?"has-balance":""}">${balance>0?money(balance):langPick("Paid up","Al día","À jour")}</span>
      </div>
      <div class="client-business-snapshot">
        <span><small>${escapeHtml(langPick("Next cleaning","Próxima limpieza","Prochain nettoyage"))}</small><b>${next?escapeHtml(formatDateTime(next.starts_at)):escapeHtml(langPick("Not scheduled","Sin agendar","Non planifié"))}</b></span>
        <span><small>${escapeHtml(langPick("Last cleaning","Última limpieza","Dernier nettoyage"))}</small><b>${last?escapeHtml(new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(new Date(last.starts_at))):"—"}</b></span>
      </div>
      <small class="client-location">${escapeHtml([c.city,c.state].filter(Boolean).join(", ") || c.address_line1 || tr("No address yet"))}</small>
      <div class="card-actions record-card-actions client-card-actions">
        <span class="safe-actions">
          <button data-client-info="${c.id}">${escapeHtml(langPick("Info","Info","Info"))}</button>
          <button data-edit="client" data-id="${c.id}">${escapeHtml(tr("Edit"))}</button>
          <button data-client-to-quote="${c.id}">${escapeHtml(tr("Quote"))}</button>
          <button data-archive-client="${c.id}">${escapeHtml(tr("Archive"))}</button>
        </span>
        <button class="record-delete-btn" data-delete-record="client" data-id="${c.id}">${escapeHtml(tr("Delete client"))}</button>
      </div>
    </article>`;
  }).join("");
  enhanceMobileRecordActions();
}
function openClientInfo(clientId){
  const client=state.clients.find(c=>c.id===clientId);
  if(!client){
    showToast(langPick("Client not found","Cliente no encontrado","Client introuvable"));
    return;
  }

  state.modalType="clientInfo";
  state.modalId=clientId;

  const jobs=state.jobs.filter(j=>j.client_id===clientId);
  const quotes=state.quotes.filter(q=>q.client_id===clientId || (!q.client_id && String(q.customer_email||"").toLowerCase()===String(client.email||"").toLowerCase()));
  const invoices=state.invoices.filter(inv=>inv.client_id===clientId);
  const bookings=state.bookingRequests.filter(b=>String(b.customer_email||"").toLowerCase()===String(client.email||"").toLowerCase());
  const leads=state.leads.filter(l=>String(l.email||"").toLowerCase()===String(client.email||"").toLowerCase());
  const emailIssue=(state.emailDeliveryIssues||[]).find(issue=>
    !issue.resolved_at &&
    String(issue.customer_email||"").trim().toLowerCase()===String(client.email||"").trim().toLowerCase()
  );

  const recurringIds=[...new Set(jobs.map(j=>j.recurrence_rule_id).filter(Boolean))];
  const upcoming=jobs.filter(j=>!["completed","canceled","no_show"].includes(j.status) && new Date(j.starts_at)>=new Date()).length;
  const completed=jobs.filter(j=>j.status==="completed").length;
  const invoiced=invoices.reduce((sum,inv)=>sum+Number(inv.total||0),0);
  const paid=invoices.reduce((sum,inv)=>sum+invoicePaidAmount(inv),0);

  const history=[
    ...jobs.map(j=>({
      at:j.starts_at,
      icon:"🧹",
      title:j.services?.name||langPick("Cleaning job","Trabajo de limpieza","Prestation de nettoyage"),
      meta:formatDateTime(j.starts_at)+" · "+translatedStatus(j.status)+(j.recurrence_rule_id?" · "+langPick("Recurring","Recurrente","Récurrent"):"")
    })),
    ...quotes.map(q=>({
      at:q.updated_at||q.created_at,
      icon:"📝",
      title:langPick("Quote","Cotización","Devis")+" · "+money(Number(q.total||0)),
      meta:formatDateTime(q.updated_at||q.created_at)+" · "+String(q.status||"").replaceAll("_"," ")
    })),
    ...invoices.map(inv=>({
      at:inv.updated_at||inv.created_at,
      icon:"🧾",
      title:langPick("Invoice","Factura","Facture")+" · "+money(Number(inv.total||0)),
      meta:formatDateTime(inv.updated_at||inv.created_at)+" · "+String(inv.status||"").replaceAll("_"," ")
    })),
    ...invoices.flatMap(inv=>(inv.payments||[])
      .filter(payment=>["paid","completed","succeeded"].includes(String(payment.status||"").toLowerCase()))
      .map(payment=>({
        at:payment.paid_at||payment.created_at,
        icon:"💵",
        title:langPick("Payment","Pago","Paiement")+" · "+money(Number(payment.amount||0)),
        meta:formatDateTime(payment.paid_at||payment.created_at)+" · "+paymentMethodLabel(payment.method||"")
      }))
    ),
    ...leads.map(l=>({
      at:l.updated_at||l.created_at,
      icon:"◎",
      title:langPick("Lead / inquiry","Lead / consulta","Prospect / demande"),
      meta:formatDateTime(l.updated_at||l.created_at)+" · "+String(l.status||"new").replaceAll("_"," ")+(l.source?" · "+l.source:"")
    })),
    ...bookings.map(b=>({
      at:b.created_at||b.requested_start_at,
      icon:"📅",
      title:langPick("Booking request","Solicitud de reserva","Demande de réservation"),
      meta:formatDateTime(b.requested_start_at)+" · "+bookingRecurrenceLabel(b.recurrence_pattern)+" · "+String(b.status||"")
    }))
  ].filter(item=>item.at).sort((a,b)=>new Date(b.at)-new Date(a.at));

  const recurringSummary=recurringIds.map(id=>{
    const rule=state.recurrenceRules.find(r=>r.id===id);
    return rule?bookingRecurrenceLabel(recurrencePatternFromRule(rule)):"";
  }).filter(Boolean);

  modalHeader(
    langPick("CLIENT INFO","INFO DEL CLIENTE","INFO CLIENT"),
    client.name,
    langPick("Contact details and full activity history in one place.","Datos de contacto e historial completo en un solo lugar.","Coordonnées et historique complet au même endroit.")
  );

  entityForm.innerHTML=`
    <div class="client-history-profile">
      ${emailIssue?`<div class="client-email-warning">
        <strong>${escapeHtml(langPick("⚠ Email needs verification","⚠ Verifica el email","⚠ Vérifiez l’e-mail"))}</strong>
        <span>${escapeHtml(emailIssue.reason||langPick("A recent email could not be delivered. Confirm or correct this address before sending again.","Un correo reciente no pudo entregarse. Confirma o corrige esta dirección antes de volver a enviar.","Un e-mail récent n’a pas pu être livré. Confirmez ou corrigez cette adresse avant de renvoyer."))}</span>
      </div>`:""}
      <div class="client-history-contact">
        <div><small>${escapeHtml(langPick("Email","Email","E-mail"))}</small><strong>${escapeHtml(client.email||"—")}</strong></div>
        <div><small>${escapeHtml(langPick("Phone","Teléfono","Téléphone"))}</small><strong>${escapeHtml(client.phone||"—")}</strong></div>
        <div class="full"><small>${escapeHtml(langPick("Address","Dirección","Adresse"))}</small><strong>${escapeHtml(clientServiceAddress(client)||"—")}</strong></div>
        <div><small>${escapeHtml(langPick("Preferred contact","Contacto preferido","Contact préféré"))}</small><strong>${escapeHtml(client.preferred_contact||"email")}</strong></div>
        <div><small>${escapeHtml(langPick("Recurring","Recurrente","Récurrent"))}</small><strong>${escapeHtml(recurringSummary.join(", ")||langPick("No","No","Non"))}</strong></div>
        ${client.notes?`<div class="full customer-authored-text"><small>${escapeHtml(langPick("Client notes","Notas del cliente","Notes client"))}</small><strong>${escapeHtml(client.notes)}</strong>${customerTranslateLink(client.notes,client.preferred_language)}</div>`:""}
      </div>
      <div class="client-history-stats">
        <span><small>${escapeHtml(langPick("Completed","Completados","Terminés"))}</small><b>${completed}</b></span>
        <span><small>${escapeHtml(langPick("Upcoming","Próximos","À venir"))}</small><b>${upcoming}</b></span>
        <span><small>${escapeHtml(langPick("Invoiced","Facturado","Facturé"))}</small><b>${escapeHtml(money(invoiced))}</b></span>
        <span><small>${escapeHtml(langPick("Paid","Pagado","Payé"))}</small><b>${escapeHtml(money(paid))}</b></span>
      </div>
      <div class="client-history-section">
        <div class="client-history-title"><strong>${escapeHtml(langPick("History","Historial","Historique"))}</strong><span>${history.length}</span></div>
        <div class="client-history-list">
          ${history.length?history.map(item=>`
            <div class="client-history-item">
              <span class="client-history-icon">${item.icon}</span>
              <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.meta)}</small></div>
            </div>`).join(""):`<div class="empty-inline"><strong>${escapeHtml(langPick("No history yet.","Todavía no hay historial.","Aucun historique pour le moment."))}</strong></div>`}
        </div>
      </div>
      <div class="form-footer client-history-footer">
        <button type="button" class="ghost-btn" data-modal-cancel>${escapeHtml(langPick("Close","Cerrar","Fermer"))}</button>
        <button type="button" class="primary-btn" data-edit="client" data-id="${client.id}">${escapeHtml(langPick("Edit client","Editar cliente","Modifier le client"))}</button>
      </div>
    </div>`;
  modal.hidden=false;
}

function renderServices(){
  const grid=$("#servicesGrid");
  if(!grid) return;
  const cards=state.services.map(s=>{
    const addons=state.serviceAddons.filter(a=>a.service_id===s.id);
    const isQuote=!(s.pricing_type==="flat" && Number(s.base_price)>0);
    const statusLabel=!s.active
      ? langPick("Inactive","Inactivo","Inactif")
      : isQuote
        ? langPick("Quote required","Requiere cotización","Devis requis")
        : langPick("Bookable","Reservable","Réservable");
    return `
      <article class="service-card service-catalog-card ${s.active?"":"inactive-card"}">
        <div class="service-catalog-top">
          <div><span class="service-status-pill ${!s.active?"off":isQuote?"quote":"bookable"}">${escapeHtml(statusLabel)}</span><strong>${escapeHtml(s.name)}</strong></div>
          <b class="service-price">${isQuote?langPick("Custom","Personalizado","Sur devis"):money(s.base_price)}</b>
        </div>
        <div class="service-catalog-meta">
          <span><small>${escapeHtml(langPick("Duration","Duración","Durée"))}</small><b>${Math.round(s.default_duration_minutes/60*10)/10} hr</b></span>
          <span><small>${escapeHtml(langPick("Pricing","Precio","Tarification"))}</small><b>${escapeHtml(isQuote?langPick("Quote","Cotización","Devis"):langPick("Upfront","Inmediato","Immédiat"))}</b></span>
          <span><small>${escapeHtml(langPick("Add-ons","Add-ons","Options"))}</small><b>${addons.filter(a=>a.active).length}</b></span>
        </div>
        ${s.description?`<p class="service-description">${escapeHtml(s.description)}</p>`:""}
        <div class="addon-list">
          ${addons.length?addons.map(a=>`<div class="addon-row ${a.active?"":"inactive-card"}"><span><strong>${escapeHtml(a.name)}</strong><small>${escapeHtml(langPick("Included by default","Incluido por defecto","Inclus par défaut"))} · +${money(a.price)} · +${a.extra_duration_minutes} min</small></span><span class="card-actions"><button data-edit-addon="${a.id}">Edit</button><button data-toggle-addon="${a.id}">${a.active?"Off":"On"}</button></span></div>`).join(""):`<small class="muted-line">${escapeHtml(langPick("No add-ons yet","Sin add-ons todavía","Aucune option pour le moment"))}</small>`}
        </div>
        <div class="card-actions service-card-actions">
          <button data-edit="service" data-id="${s.id}">${escapeHtml(langPick("Edit service","Editar servicio","Modifier"))}</button>
          <button data-add-addon-for="${s.id}">+ ${escapeHtml(langPick("Add-on","Add-on","Option"))}</button>
          <button data-toggle-service="${s.id}">${escapeHtml(s.active?langPick("Deactivate","Desactivar","Désactiver"):langPick("Activate","Activar","Activer"))}</button>
        </div>
      </article>`;
  }).join("");

  const unassigned=state.serviceAddons.filter(a=>!a.service_id);
  const globalCard=unassigned.length?`<article class="service-card service-catalog-card"><div class="service-catalog-top"><div><span class="service-status-pill bookable">${escapeHtml(langPick("GENERAL","GENERAL","GÉNÉRAL"))}</span><strong>${escapeHtml(langPick("General add-ons","Add-ons generales","Options générales"))}</strong></div></div><span>${escapeHtml(langPick("Available across services","Disponibles en varios servicios","Disponibles sur plusieurs services"))}</span><div class="addon-list">${unassigned.map(a=>`<div class="addon-row ${a.active?"":"inactive-card"}"><span><strong>${escapeHtml(a.name)}</strong><small>+${money(a.price)} · +${a.extra_duration_minutes} min</small></span><span class="card-actions"><button data-edit-addon="${a.id}">Edit</button><button data-toggle-addon="${a.id}">${a.active?"Off":"On"}</button></span></div>`).join("")}</div></article>`:"";

  grid.innerHTML=(cards||"")+globalCard+`<article class="add-card" data-create="service"><div>＋</div><strong>${escapeHtml(langPick("Add service","Añadir servicio","Ajouter un service"))}</strong><span>${escapeHtml(langPick("Set price, duration and booking basics.","Define precio, duración y reserva.","Définissez le prix, la durée et la réservation."))}</span></article>`;
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
  const sourceJobs=Array.isArray(state.jobs)?state.jobs:[];
  const visible=sourceJobs.filter(j=>j && j.status!=="canceled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const nowMs=Date.now();
  const incomingEndMs=nowMs+(72*60*60*1000);
  // Incoming contains real job occurrences for the next 72 hours, including
  // recurring occurrences. The Recurring section below still summarizes each
  // series once, so the full future series never floods Incoming.
  const incomingJobs=visible.filter(j=>{
    const startsAt=new Date(j.starts_at).getTime();
    if(!Number.isFinite(startsAt)) return false;
    if(String(j.status||"").toLowerCase()==="completed") return false;
    return startsAt>=nowMs && startsAt<=incomingEndMs;
  });

  if(list){
    list.innerHTML=incomingJobs.length?incomingJobs.slice(0,30).map(j=>`
      <div class="job-block" data-calendar-job="${j.id}" role="button" tabindex="0" aria-label="${escapeHtml((j.clients?.name||"Cleaning job")+" · "+formatDateTime(j.starts_at))}">
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
    `).join(""):`<div class="empty-inline"><strong>${escapeHtml(langPick("No incoming jobs in the next 3 days.","No hay trabajos próximos en los siguientes 3 días.","Aucun travail prévu dans les 3 prochains jours."))}</strong><span>${escapeHtml(langPick("One-time and recurring jobs will appear here when they fall inside the 72-hour window.","Los trabajos únicos y recurrentes aparecerán aquí cuando estén dentro de la ventana de 72 horas.","Les travaux ponctuels et récurrents apparaîtront ici lorsqu’ils entreront dans la fenêtre de 72 heures."))}</span><button class="text-btn" data-create="job">${escapeHtml(langPick("Add a job →","Añadir trabajo →","Ajouter un travail →"))}</button></div>`;
  }

  const week=$("#calendarWeekRow");
  if(week){
    const now=new Date();
    const fullMonth=window.matchMedia("(min-width: 721px)").matches;
    const range=$("#calendarRangeLabel");
    const rangePill=document.querySelector(".calendar-range-pill");
    const rangeEyebrow=document.querySelector(".calendar-range-head .eyebrow");
    const monthActions=document.querySelector(".calendar-month-actions");

    if(fullMonth){
      const offset=Number(state.calendarMonthOffset||0);
      const monthDate=new Date(now.getFullYear(),now.getMonth()+offset,1);
      const monthStart=new Date(monthDate.getFullYear(),monthDate.getMonth(),1);
      const gridStart=new Date(monthStart);
      gridStart.setDate(monthStart.getDate()-monthStart.getDay());

      if(range){
        range.textContent=new Intl.DateTimeFormat(appLocale(),{month:"long",year:"numeric"}).format(monthDate);
      }
      if(rangePill) rangePill.textContent=langPick("Month","Mes","Mois");
      if(rangeEyebrow) rangeEyebrow.textContent=langPick("MONTH VIEW","VISTA MENSUAL","VUE MENSUELLE");
      if(monthActions) monthActions.hidden=false;

      week.classList.add("month-calendar");
      week.innerHTML=Array.from({length:42},(_,i)=>{
        const d=new Date(gridStart);
        d.setDate(gridStart.getDate()+i);
        const dayJobs=visible.filter(j=>sameLocalDay(j.starts_at,d));
        const dateKey=tleCalendarDateKey(d);
        const selected=sameLocalDay(d,now)?"selected":"";
        const hasJobs=dayJobs.length?" has-jobs":"";
        const active=state.calendarSelectedDate===dateKey?" calendar-active":"";
        const outside=d.getMonth()!==monthDate.getMonth()?" calendar-outside":"";
        const count=dayJobs.length
          ? `<small class="calendar-job-count">${dayJobs.length} ${dayJobs.length===1?"job":"jobs"}</small>`
          : `<small class="calendar-job-count empty">—</small>`;

        return `<span class="${selected}${hasJobs}${active}${outside}" data-calendar-day="${dateKey}" role="button" tabindex="0" aria-pressed="${state.calendarSelectedDate===dateKey?"true":"false"}" title="${dayJobs.length?dayJobs.length+" scheduled job"+(dayJobs.length===1?"":"s"):"No jobs"}">
          <em>${new Intl.DateTimeFormat(appLocale(),{weekday:"short"}).format(d).toUpperCase()}</em>
          <strong>${d.getDate()}</strong>
          ${count}
        </span>`;
      }).join("");
    }else{
      const start=startOfWeek(now);
      const end=new Date(start);
      end.setDate(start.getDate()+13);

      if(range){
        const sameMonth=start.getMonth()===end.getMonth();
        range.textContent=sameMonth
          ? new Intl.DateTimeFormat(appLocale(),{month:"long"}).format(start)+" "+start.getDate()+"–"+end.getDate()
          : new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(start)+" – "+new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric"}).format(end);
      }
      if(rangePill) rangePill.textContent=langPick("14 days","14 días","14 jours");
      if(rangeEyebrow) rangeEyebrow.textContent=langPick("NEXT 2 WEEKS","PRÓXIMAS 2 SEMANAS","2 PROCHAINES SEMAINES");
      if(monthActions) monthActions.hidden=true;

      week.classList.remove("month-calendar");
      week.innerHTML=Array.from({length:14},(_,i)=>{
        const d=new Date(start);
        d.setDate(start.getDate()+i);
        const dayJobs=visible.filter(j=>sameLocalDay(j.starts_at,d));
        const dateKey=tleCalendarDateKey(d);
        const selected=sameLocalDay(d,now)?"selected":"";
        const hasJobs=dayJobs.length?" has-jobs":"";
        const active=state.calendarSelectedDate===dateKey?" calendar-active":"";
        const count=dayJobs.length
          ? `<small class="calendar-job-count">${dayJobs.length} ${dayJobs.length===1?"job":"jobs"}</small>`
          : `<small class="calendar-job-count empty">—</small>`;

        return `<span class="${selected}${hasJobs}${active}" data-calendar-day="${dateKey}" role="button" tabindex="0" aria-pressed="${state.calendarSelectedDate===dateKey?"true":"false"}" title="${dayJobs.length?dayJobs.length+" scheduled job"+(dayJobs.length===1?"":"s"):"No jobs"}">
          <em>${new Intl.DateTimeFormat(appLocale(),{weekday:"short"}).format(d).toUpperCase()}</em>
          <strong>${d.getDate()}</strong>
          ${count}
        </span>`;
      }).join("");
    }
    if(state.calendarSelectedDate) renderCalendarDayDetails(state.calendarSelectedDate,{scroll:false});
  }

  const recurring=$("#recurringJobsList");
  if(recurring){
    const now=Date.now();
    const recurringSeries=[...new Set(visible.map(j=>j.recurrence_rule_id).filter(Boolean))]
      .map(ruleId=>{
        const series=visible
          .filter(j=>j.recurrence_rule_id===ruleId)
          .sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
        const next=series.find(j=>new Date(j.starts_at).getTime()>=now) || series[series.length-1];
        const rule=state.recurrenceRules.find(r=>r.id===ruleId);
        return next?{job:next,rule}:null;
      })
      .filter(Boolean)
      .sort((a,b)=>new Date(a.job.starts_at)-new Date(b.job.starts_at))
      .slice(0,8);

    recurring.innerHTML=recurringSeries.length?recurringSeries.map(({job:j,rule})=>`
      <div class="recurring-item" data-calendar-job="${j.id}" role="button" tabindex="0">
        <strong>${escapeHtml(j.clients?.name||"Recurring job")}</strong>
        <span>${escapeHtml(j.services?.name||"Cleaning")} · ${escapeHtml(bookingRecurrenceLabel(recurrencePatternFromRule(rule)))} · ${formatDateTime(j.starts_at)}</span>
      </div>
    `).join(""):`<div class="empty-inline"><strong>No recurring jobs yet.</strong><span>Recurring appointments will appear here.</span></div>`;
  }
}

function tleCalendarDateKey(date){
  const d=date instanceof Date?date:new Date(date);
  if(Number.isNaN(d.getTime())) return "";
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
}

function renderCalendarDayDetails(dateKey,options={}){
  const week=$("#calendarWeekRow");
  if(!week) return;
  let panel=$("#calendarDayDetails");
  if(!panel){
    panel=document.createElement("section");
    panel.id="calendarDayDetails";
    panel.className="calendar-day-details";
    panel.hidden=true;
    week.insertAdjacentElement("afterend",panel);
  }

  if(!dateKey){
    panel.hidden=true;
    panel.innerHTML="";
    return;
  }

  const parts=String(dateKey).split("-").map(Number);
  const selectedDate=new Date(parts[0],(parts[1]||1)-1,parts[2]||1);
  if(Number.isNaN(selectedDate.getTime())){
    panel.hidden=true;
    return;
  }

  state.calendarSelectedDate=dateKey;
  const jobs=state.jobs
    .filter(j=>j.status!=="canceled"&&sameLocalDay(j.starts_at,selectedDate))
    .sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));

  const title=new Intl.DateTimeFormat(appLocale(),{weekday:"long",month:"long",day:"numeric"}).format(selectedDate);
  const emptyCopy=langPick("No jobs are scheduled for this day.","No hay trabajos programados para este día.","Aucun travail n’est prévu ce jour-là.");
  const headingCopy=jobs.length===1
    ? (appLanguage()==="ht" ? "1 travay pwograme" : langPick("1 scheduled job","1 trabajo programado","1 travail prévu"))
    : (appLanguage()==="ht" ? `${jobs.length} travay pwograme` : langPick(`${jobs.length} scheduled jobs`,`${jobs.length} trabajos programados`,`${jobs.length} travaux prévus`));

  panel.innerHTML=`
    <div class="calendar-day-details-head">
      <div>
        <p class="eyebrow">${escapeHtml(langPick("DAY DETAILS","DETALLES DEL DÍA","DÉTAILS DU JOUR"))}</p>
        <h3>${escapeHtml(title)}</h3>
        <span>${escapeHtml(jobs.length?headingCopy:emptyCopy)}</span>
      </div>
      <button type="button" class="calendar-day-close" data-calendar-close aria-label="${escapeHtml(langPick("Close day details","Cerrar detalles del día","Fermer les détails du jour"))}">×</button>
    </div>
    <div class="calendar-day-job-list">
      ${jobs.map(j=>{
        const start=new Date(j.starts_at);
        const time=Number.isNaN(start.getTime())?"—":new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit"}).format(start);
        const duration=Number(j.duration_minutes||0)>0?Math.round(Number(j.duration_minutes)/60*10)/10+"h":"—";
        const assignee=j.job_assignments?.[0]?.team_members?.name||langPick("Not assigned","Sin asignar","Non attribué");
        const address=j.service_address||langPick("Address not added","Dirección no añadida","Adresse non ajoutée");
        const notes=String(j.notes||"").trim();
        const canEdit=state.business?.role!=="coworker";
        return `
          <article class="calendar-day-job ${options.jobId===j.id?"is-focus":""}">
            <div class="calendar-day-job-top">
              <div>
                <strong>${escapeHtml(time)} · ${escapeHtml(j.clients?.name||langPick("Unassigned client","Cliente sin asignar","Client non attribué"))}</strong>
                <span>${escapeHtml(j.services?.name||langPick("Cleaning job","Trabajo de limpieza","Prestation de nettoyage"))}</span>
              </div>
              <span class="status ${j.status==="completed"?"success":j.status==="in_progress"?"warning":"neutral"}">${escapeHtml(translatedStatus(j.status))}</span>
            </div>
            <div class="calendar-day-job-grid">
              <span><small>${escapeHtml(langPick("Duration","Duración","Durée"))}</small><b>${escapeHtml(duration)}</b></span>
              <span><small>${escapeHtml(langPick("Assigned to","Asignado a","Assigné à"))}</small><b>${escapeHtml(assignee)}</b></span>
              <span class="calendar-day-address"><small>${escapeHtml(langPick("Address","Dirección","Adresse"))}</small><b>${escapeHtml(address)}</b></span>
            </div>
            ${notes?`<p class="calendar-day-notes"><small>${escapeHtml(langPick("Notes","Notas","Notes"))}</small>${escapeHtml(notes)}</p>`:""}
            ${canEdit?`<div class="calendar-day-actions"><button type="button" data-edit="job" data-id="${j.id}">${escapeHtml(langPick("Edit job","Editar trabajo","Modifier le travail"))}</button></div>`:""}
          </article>`;
      }).join("")}
    </div>`;

  panel.hidden=false;
  $$("#calendarWeekRow [data-calendar-day]").forEach(el=>{
    const active=el.dataset.calendarDay===dateKey;
    el.classList.toggle("calendar-active",active);
    el.setAttribute("aria-pressed",active?"true":"false");
  });

  if(options.scroll!==false){
    requestAnimationFrame(()=>panel.scrollIntoView({behavior:"smooth",block:"nearest"}));
  }
}

function clearCalendarDayDetails(){
  state.calendarSelectedDate="";
  const panel=$("#calendarDayDetails");
  if(panel){
    panel.hidden=true;
    panel.innerHTML="";
  }
  $$("#calendarWeekRow [data-calendar-day]").forEach(el=>{
    el.classList.remove("calendar-active");
    el.setAttribute("aria-pressed","false");
  });
}

function quoteColumn(status,label){
  const items=state.quotes.filter(q=>q.status===status);
  return `<div class="kanban-col quote-growth-col"><h3>${escapeHtml(label)} <span>${items.length}</span></h3>
    ${items.length?items.map(q=>{
      const service=state.services.find(s=>s.id===q.quote_items?.[0]?.service_id);
      const total=Number(q.total||0);
      const openStatus=customerOpenStatus(q);
      const dispute=state.disputes.find(d=>d.resource_type==="quote"&&d.quote_id===q.id&&d.status==="open");
      const paymentCopy=q.payment_status==="paid"?langPick("Paid","Pagado","Payé"):q.payment_status==="partial"?langPick("Partial payment","Pago parcial","Paiement partiel"):"";
      const stateCopy=status==="accepted"
        ? langPick("Booked + invoice created","Reservado + factura creada","Réservé + facture créée")+(paymentCopy?" · "+paymentCopy:"")
        : status==="sent"
          ? langPick("Waiting for customer","Esperando al cliente","En attente du client")
          : status==="declined"
            ? langPick("Declined by customer","Rechazada por el cliente","Refusé par le client")
            : status==="requested"
              ? langPick("Needs your price","Necesita tu precio","Prix à définir")
              : langPick("Ready to finish","Lista para terminar","Prêt à finaliser");
      const nextCopy=status==="sent"
        ? langPick("Next: follow up","Siguiente: dar seguimiento","Suite : relancer")
        : status==="requested"
          ? langPick("Next: build quote","Siguiente: preparar cotización","Suite : préparer le devis")
          : status==="draft"
            ? langPick("Next: send to client","Siguiente: enviar al cliente","Suite : envoyer au client")
            : status==="accepted"
              ? langPick("Converted to work","Convertida en trabajo","Converti en prestation")
              : langPick("Review when useful","Revisar cuando convenga","Revoir si nécessaire");
      return `<article class="quote-growth-card ${status==="accepted"?"accepted":""}">
        <div class="quote-growth-top">
          <span class="quote-status-pill quote-status-${escapeHtml(status)}">${escapeHtml(translatedStatus(status))}</span>
          <strong class="quote-amount">${money(total)}</strong>
        </div>
        <div class="quote-growth-customer">
          <strong>${escapeHtml(q.customer_name)}</strong>
          <small>${escapeHtml(service?.name || langPick("Cleaning service","Servicio de limpieza","Service de nettoyage"))}</small>
          ${bookingPropertySnapshot(q)?`<small class="quote-property-summary">${escapeHtml(bookingPropertySnapshot(q))}</small>`:""}
        </div>
        <div class="quote-next-step"><span>${escapeHtml(stateCopy)}</span><b>${escapeHtml(nextCopy)}</b></div>
        <small class="customer-open-status ${openStatus.opened?"is-viewed":"is-unviewed"}">${escapeHtml(openStatus.text)}</small>
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
    }).join(""):`<div class="kanban-empty">${escapeHtml(langPick("Nothing needs attention here.","Nada necesita atención aquí.","Rien ne nécessite votre attention ici."))}</div>`}
  </div>`;
}
function renderQuotes(){
  const board=$("#quotesBoard");
  if(!board) return;
  board.innerHTML=[
    quoteColumn("requested",langPick("Requested","Solicitadas","Demandés")),
    quoteColumn("draft",langPick("Draft","Borrador","Brouillon")),
    quoteColumn("sent",langPick("Sent","Enviadas","Envoyés")),
    quoteColumn("accepted",langPick("Accepted","Aceptadas","Acceptés")),
    quoteColumn("declined",langPick("Declined","Rechazadas","Refusés"))
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
function validIanaTimeZone(value){
  const zone=String(value||"").trim();
  if(!zone) return "";
  try{
    new Intl.DateTimeFormat("en-US",{timeZone:zone}).format(new Date());
    return zone;
  }catch{
    return "";
  }
}
function activeBusinessTimeZone(){
  // Scheduling must always follow the business timezone. Weather/location
  // data is display context only and must never move jobs on the calendar.
  const candidates=[
    state.business?.timezone,
    state.weather?.location?.timezone,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    "UTC"
  ];
  for(const candidate of candidates){
    const valid=validIanaTimeZone(candidate);
    if(valid) return valid;
  }
  return "UTC";
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
  const period=["early","morning"].includes(daypart)
    ? "morning"
    : ["midday","afternoon","wrap"].includes(daypart)
      ? "afternoon"
      : "night";

  const variants={
    morning:[
      langPick("Good morning · your day is ready","Buenos días · tu día está listo","Bonjour · votre journée est prête"),
      langPick("Good morning · let’s see what’s ahead","Buenos días · veamos qué viene hoy","Bonjour · voyons ce qui vous attend"),
      langPick("Good morning · one clear step at a time","Buenos días · un paso claro a la vez","Bonjour · une étape claire à la fois"),
      langPick("Good morning · here’s your day at a glance","Buenos días · así se ve tu día","Bonjour · votre journée en un coup d’œil"),
      langPick("Good morning · let’s get organized","Buenos días · vamos a organizarnos","Bonjour · organisons la journée"),
      langPick("Good morning · your workspace is ready","Buenos días · tu espacio está listo","Bonjour · votre espace est prêt")
    ],
    afternoon:[
      langPick("Good afternoon · here’s where things stand","Buenas tardes · así va tu día","Bon après-midi · voici où en est votre journée"),
      langPick("Good afternoon · let’s check what’s next","Buenas tardes · veamos qué sigue","Bon après-midi · voyons la suite"),
      langPick("Good afternoon · keep the day moving","Buenas tardes · seguimos con el día","Bon après-midi · continuons la journée"),
      langPick("Good afternoon · your next steps are here","Buenas tardes · aquí están tus próximos pasos","Bon après-midi · vos prochaines étapes sont ici"),
      langPick("Good afternoon · quick check-in","Buenas tardes · chequeo rápido","Bon après-midi · petit point rapide"),
      langPick("Good afternoon · let’s finish strong","Buenas tardes · terminemos bien el día","Bon après-midi · finissons bien la journée")
    ],
    night:[
      langPick("Good evening · here’s how the day landed","Buenas noches · así cerró tu día","Bonsoir · voici comment votre journée s’est terminée"),
      langPick("Good evening · tomorrow can wait a minute","Buenas noches · mañana puede esperar un momento","Bonsoir · demain peut attendre un instant"),
      langPick("Good evening · one last look before you sign off","Buenas noches · una última mirada antes de cerrar","Bonsoir · un dernier regard avant de terminer"),
      langPick("Good evening · your workspace is caught up","Buenas noches · tu espacio está al día","Bonsoir · votre espace est à jour"),
      langPick("Good evening · let’s wrap things up","Buenas noches · vamos cerrando por hoy","Bonsoir · terminons pour aujourd’hui"),
      langPick("Good evening · the day is almost done","Buenas noches · el día ya casi termina","Bonsoir · la journée touche à sa fin")
    ]
  };

  const choices=variants[period]||variants.morning;
  const cacheKey="__tleGreeting_"+period;
  if(Number.isInteger(window[cacheKey]) && choices[window[cacheKey]]){
    return choices[window[cacheKey]];
  }

  const storageKey="tle_last_greeting_"+period;
  let last=-1;
  try{ last=Number(localStorage.getItem(storageKey)); }catch{}
  const next=Number.isFinite(last) && last>=0 ? (last+1)%choices.length : 0;
  window[cacheKey]=next;
  try{ localStorage.setItem(storageKey,String(next)); }catch{}
  return choices[next];
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
  const visual=currentWeatherVisual(weather);
  const currentKind=precipitationKindForCode(code)||(visual.kind==="snow"?"snow":visual.kind==="storm"?"storm":(["rain","drizzle"].includes(visual.kind)?"rain":""));
  const event=weather.nextPrecip||nextPrecipitationWindow(weather);
  const currentDate=String(weather.current.time||"").slice(0,10);

  if(currentKind){
    const base=currentKind==="snow"
      ? langPick("It’s snowing now.","Está nevando ahora.","Il neige maintenant.")
      : currentKind==="storm"
      ? langPick("Storms are active now.","Hay tormentas ahora.","Des orages sont actifs maintenant.")
      : langPick("It’s raining now.","Está lloviendo ahora.","Il pleut maintenant.");
    const advice=remainingJobs.length
      ? " "+tr("Check GPS before the next stop and allow extra travel time.")
      : "";
    return {kind:currentKind,icon:currentKind==="snow"?"🌨️":currentKind==="storm"?"⛈️":"🌧️",text:base+advice};
  }

  if(event&&event.hoursAhead<=48){
    const when=weatherClockLabel(event.hour);
    const day=weatherDayLabel(event.date,currentDate);
    const phenomenon=event.kind==="snow"
      ? langPick("Snow","Nieve","Neige")
      : event.kind==="storm"
      ? langPick("Storms","Tormentas","Orages")
      : langPick("Rain","Lluvia","Pluie");
    const probability=Number.isFinite(event.probability)?" · "+event.probability+"%":"";
    const first=langPick(phenomenon+" expected "+day.toLowerCase()+" around "+when+probability+".",phenomenon+" probable "+day.toLowerCase()+" cerca de las "+when+probability+".",phenomenon+" probable "+day.toLowerCase()+" vers "+when+probability+".");
    const advice=remainingJobs.length
      ? " "+tr("Check your best route before leaving.")
      : "";
    return {kind:event.kind,icon:event.icon,text:first+advice};
  }

  const hotThreshold=businessTemperatureUnit()==="celsius"?31:88;
  if(Number.isFinite(temp)&&temp>=hotThreshold){
    return {
      kind:"heat",
      icon:"☀️",
      text:langPick("It’s "+temp+temperatureSuffix()+". If you’re still on the road, leave a few minutes for water between stops.","Hace "+temp+temperatureSuffix()+". Si sigues en ruta, deja unos minutos para agua entre paradas.","Il fait "+temp+temperatureSuffix()+". Si vous êtes encore en route, prévoyez quelques minutes pour boire entre les arrêts.")
    };
  }
  return {kind:"steady",icon:"🌤️",text:""};
}
function renderTodayClock(){
  const now=new Date();
  const businessTimeZone=activeBusinessTimeZone();
  const datePill=$("#todayDatePill");
  const clockTime=$("#todayClockTime");
  if(datePill){
    const formatted=new Intl.DateTimeFormat(appLocale(),{
      weekday:"short",
      month:"short",
      day:"numeric",
      timeZone:businessTimeZone
    }).format(now);
    datePill.textContent=formatted.charAt(0).toUpperCase()+formatted.slice(1);
  }
  if(clockTime){
    clockTime.textContent=new Intl.DateTimeFormat(appLocale(),{
      hour:"numeric",
      minute:"2-digit",
      timeZone:businessTimeZone
    }).format(now);
  }
}
function scheduleTodayClockTick(){
  if(window.__tleTodayClockTimer){
    clearTimeout(window.__tleTodayClockTimer);
    window.__tleTodayClockTimer=null;
  }
  const now=Date.now();
  const delay=(60*1000-(now%(60*1000)))+120;
  window.__tleTodayClockTimer=setTimeout(function tick(){
    renderTodayClock();
    if(state.session&&state.business){
      try{renderTodaySummary();}catch{}
    }
    scheduleTodayClockTick();
  },delay);
}
function wakeTodayClock(){
  renderTodayClock();
  scheduleTodayClockTick();
}
function installTodayClock(){
  wakeTodayClock();
  if(window.__tleTodayClockWakeListenersInstalled) return;
  window.__tleTodayClockWakeListenersInstalled=true;

  document.addEventListener("visibilitychange",function(){
    if(document.visibilityState==="visible") wakeTodayClock();
  });
  window.addEventListener("focus",wakeTodayClock);
  window.addEventListener("pageshow",wakeTodayClock);
}



function workspaceSearchText(value){return String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function globalWorkspaceResults(query){
  const q=workspaceSearchText(query).trim(); if(q.length<2) return [];
  const rows=[];
  (state.clients||[]).forEach(x=>rows.push({view:"clients",type:langPick("Client","Cliente","Client"),title:x.name||"",meta:[x.email,x.phone,x.city,x.state].filter(Boolean).join(" · ")}));
  (state.jobs||[]).forEach(x=>rows.push({view:"calendar",type:langPick("Job","Trabajo","Travail"),title:x.clients?.name||tr("Cleaning job"),meta:[x.services?.name,x.service_address,formatDateTime(x.starts_at)].filter(Boolean).join(" · ")}));
  (state.quotes||[]).forEach(x=>rows.push({view:"quotes",type:langPick("Quote","Cotización","Devis"),title:x.customer_name||"",meta:[x.customer_email,money(Number(x.total||0)),x.status].filter(Boolean).join(" · ")}));
  (state.invoices||[]).forEach(x=>{const cl=(state.clients||[]).find(c=>c.id===x.client_id);rows.push({view:"invoices",type:langPick("Invoice","Factura","Facture"),title:cl?.name||("#"+(x.invoice_number||"")),meta:["#"+(x.invoice_number||""),money(Number(x.total||0)),x.status].filter(Boolean).join(" · ")});});
  return rows.filter(r=>workspaceSearchText(r.type+" "+r.title+" "+r.meta).includes(q)).slice(0,12);
}
function renderGlobalWorkspaceSearch(){
  const input=$("#globalSearchInput"), box=$("#globalSearchResults"); if(!input||!box)return;
  const rows=globalWorkspaceResults(input.value);
  if(String(input.value||"").trim().length<2){box.innerHTML='<div class="empty-inline"><strong>'+escapeHtml(langPick("Find anything fast.","Encuentra todo rápido.","Trouvez tout rapidement."))+'</strong><span>'+escapeHtml(langPick("Search clients, jobs, quotes and invoices.","Busca clientes, trabajos, cotizaciones y facturas.","Recherchez clients, travaux, devis et factures."))+'</span></div>';return;}
  box.innerHTML=rows.length?rows.map((r,i)=>'<button type="button" class="global-search-result" data-search-view="'+r.view+'" data-search-index="'+i+'"><small>'+escapeHtml(r.type)+'</small><strong>'+escapeHtml(r.title)+'</strong><span>'+escapeHtml(r.meta)+'</span></button>').join(""):'<div class="empty-inline"><strong>'+escapeHtml(langPick("No matches.","Sin resultados.","Aucun résultat."))+'</strong><span>'+escapeHtml(langPick("Try a name, email, address or number.","Prueba un nombre, email, dirección o número.","Essayez un nom, e-mail, adresse ou numéro."))+'</span></div>';
}
function installGlobalWorkspaceSearch(){
  const toggle=$("#globalSearchToggle"), pop=$("#globalSearchPopover"), input=$("#globalSearchInput"); if(!toggle||!pop||toggle.dataset.ready)return;
  toggle.dataset.ready="1";
  toggle.addEventListener("click",e=>{e.stopPropagation();pop.hidden=!pop.hidden;if(!pop.hidden)setTimeout(()=>input?.focus(),20);});
  input?.addEventListener("input",renderGlobalWorkspaceSearch);
  $("#globalSearchResults")?.addEventListener("click",e=>{const b=e.target.closest("[data-search-view]");if(!b)return;pop.hidden=true;openView(b.dataset.searchView);});
  document.addEventListener("click",e=>{if(!e.target.closest("#globalSearchShell"))pop.hidden=true;});
}
function setBookingStep(){
  document.querySelectorAll("[data-booking-panel]").forEach(panel=>{panel.hidden=false;});
  try{localStorage.removeItem("tle_booking_step");}catch{}
}
function installProgressiveBooking(){
  setBookingStep();
}
function installSettingsAccordion(){
  $$(".settings-accordion>.settings-section").forEach((panel,i)=>{
    if(panel.dataset.accordionReady)return; panel.dataset.accordionReady="1";
    const head=panel.querySelector(".panel-head")||panel.querySelector("h3"); if(!head)return;
    panel.classList.toggle("settings-open",i===0);
    head.classList.add("settings-accordion-trigger"); head.setAttribute("role","button"); head.setAttribute("tabindex","0");
    const toggle=()=>panel.classList.toggle("settings-open");
    head.addEventListener("click",e=>{if(e.target.closest("button,input,a"))return;toggle();});
    head.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle();}});
  });
}
function firstWinStorageKey(){
  return "tle_first_win_done:"+String(state.business?.id||"workspace");
}
function bookingSetupIsComplete(){
  const hasBookableService=(state.services||[]).some(service=>service.active!==false);
  const hasAvailability=(state.availabilityRules||[]).some(rule=>rule.active!==false);
  const hasPublicLink=Boolean(state.publicLinks?.public_slug);
  return hasBookableService && hasAvailability && hasPublicLink;
}
function renderFirstWin(){
  const card=$("#firstWinCard"); if(!card)return;

  // Never decide from the empty startup arrays. On iPhone/PWA those arrays
  // exist before Supabase has returned, which caused the setup card to flash
  // for returning owners and then disappear a moment later.
  if(!state.business?.id || state.coreDataLoadedFor!==state.business.id){
    card.hidden=true;
    return;
  }

  const setupComplete=bookingSetupIsComplete();
  const noOperationalData=!(state.clients?.length||state.jobs?.length||state.bookingRequests?.length||state.quotes?.length||state.invoices?.length);
  let dismissed=false;
  try{
    dismissed=localStorage.getItem(firstWinStorageKey())==="1";
    if(setupComplete){
      localStorage.setItem(firstWinStorageKey(),"1");
      dismissed=true;
    }
  }catch{}

  card.hidden=setupComplete || !noOperationalData || dismissed;
  if(card.hidden) return;

  const title=$("#firstWinTitle"),copy=$("#firstWinCopy"),action=$("#firstWinAction"),eyebrow=$("#firstWinEyebrow");
  if(eyebrow)eyebrow.textContent=langPick("YOUR WORKSPACE IS READY","TU ESPACIO ESTÁ LISTO","VOTRE ESPACE EST PRÊT");
  if(title)title.textContent=langPick("Get ready for your first booking.","Prepárate para tu primera reserva.","Préparez votre première réservation.");
  if(copy)copy.textContent=langPick("Set up what clients can book, when they can book, then share your link.","Configura qué pueden reservar tus clientes, cuándo pueden reservar y después comparte tu enlace.","Configurez ce que vos clients peuvent réserver, quand ils peuvent réserver, puis partagez votre lien.");
  if(action)action.textContent=langPick("Set up booking →","Configurar reservas →","Configurer les réservations →");
}

function dashboardEstimatedJobValue(job){
  const service=(state.services||[]).find(s=>s.id===job?.service_id);
  if(!service || service.pricing_type==="quote") return 0;
  const value=Number(service.base_price||0);
  return Number.isFinite(value)&&value>0?value:0;
}
function dashboardScheduledValue(start,end){
  return (state.jobs||[])
    .filter(j=>j.status!=="canceled"&&new Date(j.starts_at)>=start&&new Date(j.starts_at)<end)
    .reduce((sum,j)=>sum+dashboardEstimatedJobValue(j),0);
}
function dashboardCollectedValue(start,end){
  return (state.invoices||[]).flatMap(inv=>inv.payments||[])
    .filter(p=>p.status==="confirmed"&&(p.paid_at||p.created_at))
    .filter(p=>{const d=new Date(p.paid_at||p.created_at);return d>=start&&d<end;})
    .reduce((sum,p)=>sum+Number(p.amount||0),0);
}
function dashboardTrendText(current,previous){
  const cur=Number(current||0),prev=Number(previous||0);
  if(prev<=0){
    return cur>0
      ? langPick("New this week","Nuevo esta semana","Nouveau cette semaine")
      : langPick("Ready to grow","Listo para crecer","Prêt à grandir");
  }
  const pct=Math.round(((cur-prev)/prev)*100);
  if(Math.abs(pct)<3) return langPick("About the same as last week","Similar a la semana pasada","Presque comme la semaine dernière");
  return (pct>0?"↑ ":"↓ ")+Math.abs(pct)+"% "+langPick("vs last week","vs semana pasada","vs semaine dernière");
}
function minutesBetweenTimes(start,end){
  const parse=v=>{const p=String(v||"").slice(0,5).split(":").map(Number);return Number.isFinite(p[0])&&Number.isFinite(p[1])?p[0]*60+p[1]:0;};
  return Math.max(0,parse(end)-parse(start));
}
function dashboardWeeklyCapacity(weekJobs){
  const available=(state.availabilityRules||[])
    .filter(r=>r.active!==false)
    .reduce((sum,r)=>sum+minutesBetweenTimes(r.start_time,r.end_time),0);
  const scheduled=(weekJobs||[]).reduce((sum,j)=>sum+Math.max(0,Number(j.duration_minutes||0)),0);
  const percent=available>0?Math.min(100,Math.round((scheduled/available)*100)):0;
  return {available,scheduled,percent,open:Math.max(0,available-scheduled)};
}

function renderTodaySummary(wakeAssistant=false){
  renderFirstWin();
  const now=new Date();
  const businessTimeZone=activeBusinessTimeZone();
  const businessHour=Number(new Intl.DateTimeFormat("en-US",{
    hour:"2-digit",
    hour12:false,
    timeZone:businessTimeZone
  }).format(now));
  const todayJobs=state.jobs.filter(j=>sameLocalDay(j.starts_at,now)&&j.status!=="canceled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  renderTodayRouteChip(todayJobs);
  const openQuotes=state.quotes.filter(q=>["requested","draft","sent"].includes(q.status));
  const outstanding=state.invoices.filter(i=>i.status!=="void").reduce((sum,i)=>sum+Math.max(0,Number(i.total||0)-confirmedPaid(i)),0);
  const pendingBookings=visibleBookingRequests().filter(b=>b.status==="requested");
  const overdueInvoices=state.invoices.filter(i=>i.due_at&&new Date(i.due_at)<now&&!["paid","void"].includes(i.status));

  const weekStart=startOfWeek(now);
  const weekEnd=new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+7);
  const prevWeekStart=new Date(weekStart); prevWeekStart.setDate(prevWeekStart.getDate()-7);
  const weekJobs=state.jobs.filter(j=>j.status!=="canceled"&&new Date(j.starts_at)>=weekStart&&new Date(j.starts_at)<weekEnd);
  const prevWeekJobs=state.jobs.filter(j=>j.status!=="canceled"&&new Date(j.starts_at)>=prevWeekStart&&new Date(j.starts_at)<weekStart);
  const scheduledValue=dashboardScheduledValue(weekStart,weekEnd);
  const prevScheduledValue=dashboardScheduledValue(prevWeekStart,weekStart);
  const collectedValue=dashboardCollectedValue(weekStart,weekEnd);
  const prevCollectedValue=dashboardCollectedValue(prevWeekStart,weekStart);
  const newClients=state.clients.filter(c=>c.created_at&&new Date(c.created_at)>=weekStart&&new Date(c.created_at)<weekEnd).length;
  const prevNewClients=state.clients.filter(c=>c.created_at&&new Date(c.created_at)>=prevWeekStart&&new Date(c.created_at)<weekStart).length;

  const pulseBooked=$("#pulseBooked"), pulseCollected=$("#pulseCollected"), pulseJobs=$("#pulseJobs"), pulseNewClients=$("#pulseNewClients");
  if(pulseBooked) pulseBooked.textContent=money(scheduledValue);
  if(pulseCollected) pulseCollected.textContent=money(collectedValue);
  if(pulseJobs) pulseJobs.textContent=weekJobs.length;
  if(pulseNewClients) pulseNewClients.textContent=newClients;
  const pbt=$("#pulseBookedTrend"); if(pbt) pbt.textContent=dashboardTrendText(scheduledValue,prevScheduledValue);
  const pct=$("#pulseCollectedTrend"); if(pct) pct.textContent=dashboardTrendText(collectedValue,prevCollectedValue);
  const pjt=$("#pulseJobsTrend"); if(pjt) pjt.textContent=dashboardTrendText(weekJobs.length,prevWeekJobs.length);
  const pnt=$("#pulseClientsTrend"); if(pnt) pnt.textContent=dashboardTrendText(newClients,prevNewClients);

  const labels={
    pulseBookedLabel:langPick("Est. scheduled this week","Estimado agendado esta semana","Estimation planifiée cette semaine"),
    pulseCollectedLabel:langPick("Collected this week","Cobrado esta semana","Encaissé cette semaine"),
    pulseJobsLabel:langPick("Jobs this week","Trabajos esta semana","Travaux cette semaine"),
    pulseClientsLabel:langPick("New clients","Clientes nuevos","Nouveaux clients"),
    capacityEyebrow:langPick("CAPACITY","CAPACIDAD","CAPACITÉ"),
    capacityTitle:langPick("This week","Esta semana","Cette semaine"),
    nextMoveEyebrow:langPick("YOUR NEXT MOVE","TU PRÓXIMO PASO","VOTRE PROCHAINE ACTION"),
    attentionEyebrow:langPick("FOLLOW THROUGH","SEGUIMIENTO","SUIVI"),
    attentionTitle:langPick("Open items","Pendientes","Éléments ouverts"),
    weekGrowthEyebrow:langPick("THIS WEEK","ESTA SEMANA","CETTE SEMAINE"),
    weekCompletedLabel:langPick("Completed","Completados","Terminés"),
    weekHoursLabel:langPick("Work hours","Horas","Heures"),
    weekDistanceLabel:langPick("Distance","Distancia","Distance"),
    presenceEyebrow:langPick("CLIENT-FACING LINKS","ENLACES PARA CLIENTES","LIENS CLIENTS"),
    presenceTitle:langPick("Your business online","Tu negocio online","Votre entreprise en ligne")
  };
  Object.entries(labels).forEach(([id,value])=>{const el=$("#"+id);if(el)el.textContent=value;});

  const capacity=dashboardWeeklyCapacity(weekJobs);
  const capPct=$("#capacityPercent"); if(capPct) capPct.textContent=capacity.available?capacity.percent+"%":"—";
  const capBar=$("#capacityBar"); if(capBar) capBar.style.width=(capacity.available?capacity.percent:0)+"%";
  const capMessage=$("#capacityMessage");
  if(capMessage){
    const openHours=(capacity.open/60).toFixed(1).replace(".0","");
    capMessage.textContent=capacity.available
      ? langPick(capacity.percent+"% booked · "+openHours+" hrs still open",capacity.percent+"% ocupado · "+openHours+" h todavía disponibles",capacity.percent+"% réservé · "+openHours+" h encore disponibles")
      : langPick("Add availability to see how full your week is.","Añade disponibilidad para ver qué tan llena está tu semana.","Ajoutez vos disponibilités pour voir le remplissage de la semaine.");
  }
  const capAction=$("#capacityAction"); if(capAction) capAction.textContent=langPick("See open time →","Ver espacios →","Voir les créneaux →");

  const datePill=$("#todayDatePill");
  const clockTime=$("#todayClockTime");
  if(datePill){
    const formatted=new Intl.DateTimeFormat(appLocale(),{
      weekday:"short",
      month:"short",
      day:"numeric",
      timeZone:businessTimeZone
    }).format(now);
    datePill.textContent=formatted.charAt(0).toUpperCase()+formatted.slice(1);
  }
  if(clockTime){
    clockTime.textContent=new Intl.DateTimeFormat(appLocale(),{
      hour:"numeric",
      minute:"2-digit",
      timeZone:businessTimeZone
    }).format(now);
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
    const nextPrecip=state.weather&&(state.weather.nextPrecip||state.weather.nextRain)||null;
    const precipTomorrow=nextPrecip&&nextPrecip.hoursAhead>8&&nextPrecip.hoursAhead<=32;
    const weatherContext=dashboardWeatherContext(now,remainingJobs);

    hero?.classList.remove("moment-morning","moment-afternoon","moment-night","moment-early","moment-midday","moment-wrap","moment-evening","moment-late");
    hero?.classList.add("moment-"+daypart);
    if(hero) hero.dataset.celestial=["evening","late"].includes(daypart)?"night":"day";

    greet.textContent=dashboardGreeting(daypart);

    let copy="";
    let actionView="calendar";
    let actionText="";
    let messageState="calm";
    let icon=["evening","late"].includes(daypart)?"✦":"✓";

    const nextJobLine=nextJob
      ? langPick("Next stop at "+nextJobTime+(nextJobArea?" in "+nextJobArea:"")+".","Próxima parada a las "+nextJobTime+(nextJobArea?" en "+nextJobArea:"")+".","Prochain arrêt à "+nextJobTime+(nextJobArea?" à "+nextJobArea:"")+".")
      : "";

    if(nextJob){
      messageState="jobs";
      icon="📍";
      if(daypart==="early"){
        copy=langPick("You have "+todayJobs.length+" job"+(todayJobs.length===1?"":"s")+" today. "+nextJobLine+" Check the address before you leave.","Tienes "+todayJobs.length+" trabajo"+(todayJobs.length===1?"":"s")+" hoy. "+nextJobLine+" Revisa la dirección antes de salir.","Vous avez "+todayJobs.length+" travail"+(todayJobs.length===1?"":"aux")+" aujourd’hui. "+nextJobLine+" Vérifiez l’adresse avant de partir.");
      }else if(daypart==="morning"){
        copy=langPick(nextJobLine+" You have "+remainingJobs.length+" job"+(remainingJobs.length===1?"":"s")+" still on today’s schedule.",nextJobLine+" Te quedan "+remainingJobs.length+" trabajo"+(remainingJobs.length===1?"":"s")+" en la agenda de hoy.",nextJobLine+" Il vous reste "+remainingJobs.length+" travail"+(remainingJobs.length===1?"":"aux")+" au programme aujourd’hui.");
      }else if(daypart==="midday"){
        const later=Math.max(0,remainingJobs.length-1);
        copy=langPick(nextJobLine+" After that, "+later+" stop"+(later===1?" remains":"s remain")+".",nextJobLine+" Después quedan "+later+" parada"+(later===1?"":"s")+".",nextJobLine+" Ensuite, il reste "+later+" arrêt"+(later===1?"":"s")+".");
      }else if(daypart==="afternoon"||daypart==="wrap"){
        copy=langPick("You have "+remainingJobs.length+" job"+(remainingJobs.length===1?"":"s")+" left. "+nextJobLine,"Te quedan "+remainingJobs.length+" trabajo"+(remainingJobs.length===1?"":"s")+". "+nextJobLine,"Il vous reste "+remainingJobs.length+" travail"+(remainingJobs.length===1?"":"aux")+". "+nextJobLine);
      }else{
        copy=langPick(nextJobLine+" It still shows as pending; check the status before closing the day.",nextJobLine+" Todavía aparece pendiente; revisa el estado antes de cerrar el día.",nextJobLine+" Il apparaît encore en attente ; vérifiez le statut avant de terminer la journée.");
      }
      actionView="route";
    }else if(pendingBookings.length){
      messageState="booking";
      icon="📥";
      copy=langPick("You have "+pendingBookings.length+" booking request"+(pendingBookings.length===1?"":"s")+" waiting for review"+(openQuotes.length?" and "+openQuotes.length+" open quote"+(openQuotes.length===1?"":"s")+".":"."),"Tienes "+pendingBookings.length+" solicitud"+(pendingBookings.length===1?"":"es")+" de reserva esperando revisión"+(openQuotes.length?" y "+openQuotes.length+" cotización"+(openQuotes.length===1?" abierta":"es abiertas")+".":"."),"Vous avez "+pendingBookings.length+" demande"+(pendingBookings.length===1?"":"s")+" de réservation à examiner"+(openQuotes.length?" et "+openQuotes.length+" devis ouvert"+(openQuotes.length===1?"":"s")+".":"."));
      actionView="booking";
    }else if(openQuotes.length){
      messageState="quotes";
      icon="📝";
      copy=langPick("You have "+openQuotes.length+" open quote"+(openQuotes.length===1?"":"s")+". Check which one needs the next step.","Tienes "+openQuotes.length+" cotización"+(openQuotes.length===1?" abierta":"es abiertas")+". Revisa cuál necesita el próximo paso.","Vous avez "+openQuotes.length+" devis ouvert"+(openQuotes.length===1?"":"s")+". Vérifiez lequel nécessite la prochaine action.");
      actionView="quotes";
    }else if(overdueInvoices.length){
      messageState="invoice";
      icon="💳";
      copy=langPick("You have "+overdueInvoices.length+" overdue invoice"+(overdueInvoices.length===1?"":"s")+" that need"+(overdueInvoices.length===1?"s":"")+" attention. Review payment status before you close the day.","Tienes "+overdueInvoices.length+" factura"+(overdueInvoices.length===1?" vencida":"s vencidas")+" que necesita"+(overdueInvoices.length===1?"":"n")+" atención. Revisa el pago antes de cerrar el día.","Vous avez "+overdueInvoices.length+" facture"+(overdueInvoices.length===1?" impayée":"s impayées")+" à vérifier. Contrôlez le paiement avant de terminer la journée.");
      actionView="invoices";
    }else if(["evening","late"].includes(daypart)){
      messageState="night";
      icon="✦";
      if(tomorrowJobs.length){
        copy=langPick("You have "+tomorrowJobs.length+" job"+(tomorrowJobs.length===1?"":"s")+" tomorrow. Check the first address, then call it a day.","Mañana tienes "+tomorrowJobs.length+" trabajo"+(tomorrowJobs.length===1?"":"s")+". Deja lista la primera dirección y después descansa.","Vous avez "+tomorrowJobs.length+" travail"+(tomorrowJobs.length===1?"":"aux")+" demain. Vérifiez la première adresse, puis terminez la journée.");
      }else{
        copy=langPick("Nothing urgent is waiting. Tomorrow is ready for a clean start.","No hay nada urgente pendiente. Mañana está listo para empezar limpio.","Rien d’urgent n’est en attente. Demain est prêt pour un nouveau départ.");
      }
      actionView="calendar";
    }else{
      messageState="calm";
      icon="✓";
      const liveWeather=currentWeatherVisual(state.weather);
      if(liveWeather.kind==="storm"){
        copy=langPick("Storms are active in your area. Your workspace is calm with no urgent jobs or new requests waiting.","Hay tormentas en tu zona. Tu operación está tranquila, sin trabajos urgentes ni solicitudes nuevas.","Des orages sont actifs dans votre zone. Votre activité est calme, sans tâche urgente ni nouvelle demande.");
      }else if(liveWeather.kind==="rain"||liveWeather.kind==="drizzle"){
        copy=langPick("Rain is moving through your area. No urgent jobs or new requests are waiting.","Está lloviendo en tu zona. No hay trabajos urgentes ni solicitudes nuevas esperando.","Il pleut dans votre zone. Aucun travail urgent ni nouvelle demande n’attend.");
      }else if(liveWeather.kind==="snow"){
        copy=langPick("Snow is active in your area. No urgent jobs or new requests are waiting.","Está nevando en tu zona. No hay trabajos urgentes ni solicitudes nuevas esperando.","Il neige dans votre zone. Aucun travail urgent ni nouvelle demande n’attend.");
      }else if(liveWeather.kind==="cloudy"||liveWeather.kind==="fog"){
        copy=langPick("Cloudy outside, calm inside. No urgent jobs or new requests are waiting.","Nublado afuera, tranquilo por aquí. No hay trabajos urgentes ni solicitudes nuevas.","Nuageux dehors, calme ici. Aucun travail urgent ni nouvelle demande n’attend.");
      }else if(daypart==="midday"){
        copy=langPick("Midday is clear. No urgent jobs or new requests are waiting.","El mediodía está tranquilo. No hay trabajos urgentes ni solicitudes nuevas.","Le milieu de journée est calme. Aucun travail urgent ni nouvelle demande en attente.");
      }else if(daypart==="wrap"){
        copy=langPick("The route is clear. Nothing urgent is waiting.","La ruta está libre. No hay nada urgente pendiente.","L’itinéraire est libre. Rien d’urgent n’est en attente.");
      }else{
        copy=langPick("Everything is up to date. Good time to check the calendar and what’s next.","Todo está al día. Buen momento para revisar el calendario y lo próximo.","Tout est à jour. C’est un bon moment pour consulter le calendrier et la suite.");
      }
      actionView="calendar";
    }

    if(momentIcon) momentIcon.textContent=icon;
    actionText=actionView==="route"
      ? langPick("Open route →","Abrir ruta →","Ouvrir l’itinéraire →")
      : actionView==="booking"
      ? langPick("Review requests →","Revisar solicitudes →","Examiner les demandes →")
      : actionView==="quotes"
      ? langPick("Review quotes →","Revisar cotizaciones →","Examiner les devis →")
      : actionView==="invoices"
      ? langPick("Review invoices →","Revisar facturas →","Examiner les factures →")
      : langPick("View calendar →","Ver calendario →","Voir le calendrier →");

    if(hero){
      const hasPending=Boolean(remainingJobs.length||pendingBookings.length||openQuotes.length||overdueInvoices.length);
      hero.classList.remove("message-rain","message-booking","message-jobs","message-hydrate","message-calm","message-night","message-morning","message-afternoon","message-quotes","message-invoice");
      hero.classList.add("message-"+messageState);
      hero.classList.toggle("has-pending",hasPending);
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

  const sentQuotes=openQuotes.filter(q=>q.status==="sent");
  const sentQuoteValue=sentQuotes.reduce((sum,q)=>sum+Number(q.total||0),0);
  const overdueAmount=overdueInvoices.reduce((sum,inv)=>sum+Math.max(0,Number(inv.total||0)-confirmedPaid(inv)),0);
  const nextTitle=$("#nextMoveTitle"),nextCopy=$("#nextMoveCopy"),nextAction=$("#nextMoveAction");
  let nextView="calendar",nextLabel=langPick("View calendar →","Ver calendario →","Voir le calendrier →");
  if(overdueInvoices.length){
    if(nextTitle) nextTitle.textContent=langPick(money(overdueAmount)+" is still waiting to be collected.","Hay "+money(overdueAmount)+" pendientes de cobro.",money(overdueAmount)+" restent à encaisser.");
    if(nextCopy) nextCopy.textContent=langPick(overdueInvoices.length+" overdue invoice"+(overdueInvoices.length===1?" needs":"s need")+" attention.",overdueInvoices.length+" factura"+(overdueInvoices.length===1?" vencida necesita":"s vencidas necesitan")+" atención.",overdueInvoices.length+" facture"+(overdueInvoices.length===1?" en retard nécessite":"s en retard nécessitent")+" votre attention.");
    nextView="invoices"; nextLabel=langPick("Collect payment →","Revisar cobros →","Voir les paiements →");
  }else if(sentQuotes.length){
    if(nextTitle) nextTitle.textContent=langPick(money(sentQuoteValue)+" in quotes could turn into booked work.",money(sentQuoteValue)+" en cotizaciones pueden convertirse en trabajos.",money(sentQuoteValue)+" de devis peuvent devenir des prestations.");
    if(nextCopy) nextCopy.textContent=langPick(sentQuotes.length+" sent quote"+(sentQuotes.length===1?" is":"s are")+" waiting for a client response.",sentQuotes.length+" cotización"+(sentQuotes.length===1?" enviada espera":"es enviadas esperan")+" respuesta.",sentQuotes.length+" devis envoyé"+(sentQuotes.length===1?" attend":"s attendent")+" une réponse.");
    nextView="quotes"; nextLabel=langPick("Follow up →","Dar seguimiento →","Relancer →");
  }else if(pendingBookings.length){
    if(nextTitle) nextTitle.textContent=langPick(pendingBookings.length+" new booking request"+(pendingBookings.length===1?" is":"s are")+" ready for you.",pendingBookings.length+" solicitud"+(pendingBookings.length===1?" nueva está":"es nuevas están")+" lista"+(pendingBookings.length===1?"":"s")+" para ti.",pendingBookings.length+" nouvelle"+(pendingBookings.length===1?" demande est":"s demandes sont")+" prête"+(pendingBookings.length===1?"":"s")+" pour vous.");
    if(nextCopy) nextCopy.textContent=langPick("Review it before the customer keeps looking.","Revísala antes de que el cliente siga buscando.","Examinez-la avant que le client continue ses recherches.");
    nextView="booking"; nextLabel=langPick("Review bookings →","Revisar reservas →","Voir les réservations →");
  }else{
    if(nextTitle) nextTitle.textContent=langPick("Everything important is caught up.","Todo lo importante está al día.","Tout l’essentiel est à jour.");
    if(nextCopy) nextCopy.textContent=langPick("Use the open time this week to fill the calendar or follow up with past clients.","Usa los espacios disponibles para llenar la agenda o dar seguimiento a clientes anteriores.","Utilisez les créneaux libres pour remplir l’agenda ou relancer d’anciens clients.");
  }
  if(nextAction){nextAction.dataset.jump=nextView;nextAction.textContent=nextLabel;}

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
      items.push(`<button class="attention-pending" data-jump="invoices"><span class="dot red"></span><strong>${escapeHtml(tr("Invoice"))} #${i.invoice_number||String(i.id).slice(0,6)}</strong><small>${money(Math.max(0,Number(i.total)-confirmedPaid(i)))} ${escapeHtml(tr("outstanding"))}</small></button>`);
    });
    openQuotes.filter(q=>q.status==="sent").slice(0,2).forEach(q=>{
      items.push(`<button class="attention-pending" data-jump="quotes"><span class="dot yellow"></span><strong>${escapeHtml(langPick("Quote for","Cotización para","Devis pour"))} ${escapeHtml(q.customer_name)}</strong><small>${escapeHtml(tr("Waiting for response"))}</small></button>`);
    });
    if(pendingBookings.length) items.push(`<button class="attention-pending" data-jump="booking"><span class="dot blue"></span><strong>${pendingBookings.length} ${langPick(pendingBookings.length===1?"booking request":"booking requests",pendingBookings.length===1?"solicitud":"solicitudes",pendingBookings.length===1?"demande de réservation":"demandes de réservation")}</strong><small>${escapeHtml(tr("Waiting for review"))}</small></button>`);
    attention.innerHTML=items.length?items.join(""):`<div class="empty-inline"><strong>${escapeHtml(tr("Nothing urgent."))}</strong><span>${escapeHtml(tr("No overdue invoices, sent quotes, or new booking requests need attention."))}</span></div>`;
  }

  const weekEntries=state.timeEntries.filter(t=>new Date(t.clocked_in_at)>=weekStart&&new Date(t.clocked_in_at)<weekEnd);
  const weekMinutes=weekEntries.reduce((sum,t)=>sum+Number(t.minutes_worked||0),0);
  const weekMiles=state.mileageLogs.filter(m=>{const d=new Date(m.log_date+"T00:00:00");return d>=weekStart&&d<weekEnd;}).reduce((sum,m)=>sum+Number(m.miles||0),0);
  const weekCompleted=weekJobs.filter(j=>j.status==="completed").length;
  const hours=(weekMinutes/60).toFixed(1).replace(".0","");
  const weekRevenue=$("#weekRevenue"); if(weekRevenue) weekRevenue.textContent=money(scheduledValue)+" "+langPick("scheduled","agendado","planifié");
  const wh=$("#weekHours"); if(wh) wh.textContent=hours;
  const wc=$("#weekCompleted"); if(wc) wc.textContent=weekCompleted;
  const wd=$("#weekDistance"); if(wd) wd.textContent=distanceText(weekMiles);
  const ws=$("#weekSummary");
  if(ws){
    ws.textContent=langPick(weekJobs.length+" scheduled job"+(weekJobs.length===1?"":"s")+" · "+newClients+" new client"+(newClients===1?"":"s")+" · "+money(collectedValue)+" collected.",weekJobs.length+" trabajo"+(weekJobs.length===1?"":"s")+" agendado"+(weekJobs.length===1?"":"s")+" · "+newClients+" cliente"+(newClients===1?" nuevo":"s nuevos")+" · "+money(collectedValue)+" cobrado.",weekJobs.length+" prestation"+(weekJobs.length===1?"":"s")+" planifiée"+(weekJobs.length===1?"":"s")+" · "+newClients+" nouveau"+(newClients===1?" client":"x clients")+" · "+money(collectedValue)+" encaissé.");
  }
  const reportsBtn=$("#weekReportsBtn"); if(reportsBtn) reportsBtn.textContent=langPick("See reports →","Ver reportes →","Voir les rapports →");
}

function googleMapsDirectionsUrl(addresses){
  const clean=(addresses||[]).map(v=>String(v||"").trim()).filter(Boolean);
  if(!clean.length) return "";
  const params=new URLSearchParams({api:"1",destination:clean[clean.length-1],travelmode:"driving",dir_action:"navigate"});
  if(clean.length>1) params.set("waypoints",clean.slice(0,-1).join("|"));
  return "https://www.google.com/maps/dir/?"+params.toString();
}
function openGpsRoute(addresses){
  const url=googleMapsDirectionsUrl(addresses);
  if(!url){
    showToast(langPick("Add a service address first.","Añade una dirección primero.","Ajoutez d’abord une adresse."));
    return;
  }
  window.open(url,"_blank","noopener");
}
function todaysRouteJobs(){
  const now=new Date();
  return state.jobs
    .filter(j=>sameLocalDay(j.starts_at,now)&&j.status!=="canceled"&&String(j.service_address||"").trim())
    .sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
}
function renderTodayRouteChip(todayJobs){
  const chip=$("#todayRouteChip");
  const label=$("#todayRouteChipText");
  if(!chip||!label) return;
  const routable=(todayJobs||[]).filter(j=>String(j.service_address||"").trim());
  chip.hidden=!routable.length;
  if(!routable.length) return;
  const count=routable.length;
  label.textContent=langPick("Best route · "+count+" stop"+(count===1?"":"s"),"Mejor ruta · "+count+" parada"+(count===1?"":"s"),"Meilleur itinéraire · "+count+" arrêt"+(count===1?"":"s"));
  chip.title=langPick("Starts from your current location. Google Maps uses live traffic and keeps your scheduled stop order.","Empieza desde tu ubicación actual. Google Maps usa tráfico en vivo y mantiene el orden programado.","Démarre depuis votre position actuelle. Google Maps utilise le trafic en direct et conserve l’ordre prévu.");
}

function renderOperations(){
  const now=new Date();
  const todayJobs=state.jobs.filter(j=>sameLocalDay(j.starts_at,now)&&j.status!=="canceled").sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
  const todayMiles=state.mileageLogs.filter(m=>sameLocalDay(m.log_date+"T12:00:00",now)).reduce((s,m)=>s+Number(m.miles||0),0);
  const weekStart=startOfWeek(now);
  const monthStart=startOfMonth(now);
  const weekMiles=state.mileageLogs.filter(m=>new Date(m.log_date+"T12:00:00")>=weekStart).reduce((s,m)=>s+Number(m.miles||0),0);
  const monthMiles=state.mileageLogs.filter(m=>new Date(m.log_date+"T12:00:00")>=monthStart).reduce((s,m)=>s+Number(m.miles||0),0);

  const routePill=$("#routeMileagePill"); if(routePill) routePill.textContent=distanceText(todayMiles)+langPick(" today"," hoy"," aujourd’hui");
  const routeStops=$("#routeStops");
  const routeVisual=$("#routeVisual");
  if(routeStops){
    routeStops.innerHTML=todayJobs.length?todayJobs.map((j,i)=>`
      <div class="route-stop">
        <b>${i+1}</b>
        <div>
          <strong>${escapeHtml(j.clients?.name||tr("Cleaning job"))}</strong>
          <span>${new Intl.DateTimeFormat(appLocale(),{hour:"numeric",minute:"2-digit"}).format(new Date(j.starts_at))} · ${Math.round(j.duration_minutes/60*10)/10}h</span>
          <small>${escapeHtml(j.service_address||tr("Address not added"))}</small>
          ${j.service_address?`<button type="button" class="route-gps-btn" data-route-gps-job="${j.id}">↗ ${escapeHtml(langPick("Open in Maps","Abrir en Maps","Ouvrir dans Maps"))}</button>`:""}
        </div>
        <em>${escapeHtml(translatedStatus(j.status))}</em>
      </div>
      ${i<todayJobs.length-1?`<div class="route-drive">${escapeHtml(tr("Next stop"))}</div>`:""}
    `).join(""):`<div class="empty-inline"><strong>No route today.</strong><span>Schedule jobs to build today’s stop list.</span></div>`;
  }
  if(routeVisual){
    const routable=todayJobs.filter(j=>String(j.service_address||"").trim());
    const count=routable.length;
    const gpsLabel=langPick(count===1?"GPS stop ready":"GPS stops ready",count===1?"parada lista para GPS":"paradas listas para GPS",count===1?"arrêt GPS prêt":"arrêts GPS prêts");
    const gpsStart=langPick("Starts from your current location · live traffic in Google Maps.","Empieza desde tu ubicación actual · tráfico en vivo en Google Maps.","Démarre depuis votre position actuelle · trafic en direct dans Google Maps.");
    const gpsOrder=langPick("Stops stay in scheduled order so appointment times are protected.","Las paradas mantienen el orden programado para proteger las horas de las citas.","Les arrêts restent dans l’ordre prévu afin de respecter les horaires.");
    const gpsButton=langPick("Open GPS route","Abrir ruta GPS","Ouvrir l’itinéraire GPS");
    routeVisual.innerHTML=todayJobs.length
      ? `<div class="route-command-summary"><strong>${count} ${escapeHtml(gpsLabel)}</strong><span>${escapeHtml(gpsStart)}</span><span>${escapeHtml(gpsOrder)}</span>${count?`<button type="button" class="route-best-btn" data-best-route>↗ ${escapeHtml(gpsButton)}</button>`:""}</div>`
      : "Your route appears here when jobs are scheduled.";
  }
  renderTodayRouteChip(todayJobs);

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

function bookingRecurrenceLabel(pattern){
  const value=String(pattern||"one_time");
  if(value==="weekly") return langPick("Every week","Cada semana","Chaque semaine");
  if(value==="biweekly") return langPick("Every 2 weeks","Cada 2 semanas","Toutes les 2 semaines");
  if(value==="monthly") return langPick("Monthly","Mensual","Mensuel");
  return langPick("One time","Una vez","Une fois");
}

function bookingPropertySnapshot(record={}){
  const source=record && typeof record==="object" ? record : {notes:String(record||"")};
  const rows={};
  String(source.notes||"").split(/\r?\n/).forEach(line=>{
    const idx=line.indexOf(":");
    if(idx<=0) return;
    rows[line.slice(0,idx).trim().toLowerCase()]=line.slice(idx+1).trim();
  });

  const type=String(source.property_type||rows["property type"]||"");
  const size=source.property_size
    ? Number(source.property_size).toLocaleString(appLocale(),{maximumFractionDigits:1})+" "+(source.property_size_unit==="sqm"?"m²":"sq ft")
    : rows["approx. size"];
  const bedrooms=source.bedrooms ?? rows["bedrooms"];
  const bathrooms=source.bathrooms ?? rows["bathrooms"];
  const floors=source.floors ?? rows["floors / levels"];
  const spaceType=source.commercial_space_type||rows["space type"];
  const restrooms=source.restrooms ?? rows["restrooms"];
  const condition=String(source.cleaning_condition||rows["current condition"]||"");
  const conditionLabel=({
    regular:langPick("Regular upkeep","Mantenimiento regular","Entretien régulier"),
    extra_attention:langPick("Needs extra attention","Necesita atención extra","Nécessite plus d’attention"),
    heavy_buildup:langPick("Heavy buildup","Acumulación fuerte","Accumulation importante"),
    move:langPick("Move-in / move-out","Mudanza entrada / salida","Entrée / sortie"),
    unsure:langPick("Not sure","No sabe","Pas sûr")
  })[condition]||condition;

  const parts=[];
  if(type) parts.push(type==="commercial"?langPick("Commercial","Comercial","Commercial"):langPick("Residential","Residencial","Résidentiel"));
  if(size) parts.push(size);
  if(bedrooms!==null&&bedrooms!==undefined&&bedrooms!=="") parts.push(bedrooms+" "+langPick("bed","hab.","ch."));
  if(bathrooms!==null&&bathrooms!==undefined&&bathrooms!=="") parts.push(bathrooms+" "+langPick("bath","baño","sdb"));
  if(spaceType) parts.push(String(spaceType).replaceAll("_"," "));
  if(restrooms!==null&&restrooms!==undefined&&restrooms!=="") parts.push(restrooms+" "+langPick("restroom","baño","sanitaire"));
  if(floors!==null&&floors!==undefined&&floors!=="") parts.push(floors+" "+langPick("level","nivel","niveau"));
  if(conditionLabel) parts.push(conditionLabel);
  return parts.filter(Boolean).join(" · ");
}

function renderBookingRequests(){
  const list=$("#bookingRequestsList");
  const pill=$("#bookingRequestCountPill");
  const visible=visibleBookingRequests();
  const pending=visible.filter(b=>b.status==="requested");
  if(pill) pill.textContent=pending.length+" "+langPick("new","nueva","nouvelle");
  if(!list) return;
  if(!visible.length){
    list.innerHTML=`<div class="empty-inline"><strong>${escapeHtml(langPick("No booking requests waiting.","No hay solicitudes de reserva pendientes.","Aucune demande de réservation en attente."))}</strong><span>${escapeHtml(langPick("Reviewed requests leave this list automatically after 12 hours.","Las solicitudes revisadas salen de esta lista automáticamente después de 12 horas.","Les demandes examinées quittent automatiquement cette liste après 12 heures."))}</span></div>`;
    return;
  }
  list.innerHTML=visible.slice(0,20).map(b=>{
    const linkedClient=findMatchingClient({
      email:b.customer_email,
      phone:b.customer_phone,
      name:b.customer_name
    });
    const linkedCopy=b.status==="converted" && linkedClient
      ? `<small class="booking-linked-client">${escapeHtml(langPick("Linked to existing client:","Vinculado al cliente existente:","Lié au client existant :"))} <strong>${escapeHtml(linkedClient.name)}</strong></small>`
      : "";
    const propertySnapshot=bookingPropertySnapshot(b);
    return `
    <div class="booking-request-row">
      <div class="booking-request-copy">
        <strong>${escapeHtml(b.customer_name)}</strong>
        <small>${escapeHtml(b.services?.name||"Cleaning")} · ${formatDateTime(b.requested_start_at)} · ${escapeHtml(bookingRecurrenceLabel(b.recurrence_pattern))} · ${escapeHtml(b.service_address)}</small>
        ${propertySnapshot?`<small class="booking-property-summary">${escapeHtml(propertySnapshot)}</small>`:""}
        ${linkedCopy}
      </div>
      <div class="record-actions booking-request-actions">
        <span class="status ${b.status==="requested"?"warning":b.status==="converted"?"success":"neutral"}">${escapeHtml(b.status)}</span>
        ${linkedClient?`<button class="booking-action booking-action-client" data-client-info="${linkedClient.id}">${escapeHtml(langPick("Open client","Abrir cliente","Ouvrir le client"))}</button>`:""}
        <button class="booking-action" data-check-booking-client="${b.id}">${escapeHtml(b.reviewed_at?langPick("Checked","Revisado","Vérifié"):langPick("Check client","Revisar cliente","Vérifier le client"))}</button>
        ${b.status==="requested"?`<button class="booking-action booking-action-primary" data-approve-booking="${b.id}">${escapeHtml(langPick("Approve booking","Aprobar reserva","Approuver la réservation"))}</button><button class="booking-action danger-link" data-decline-booking="${b.id}">${escapeHtml(langPick("Decline","Rechazar","Refuser"))}</button>`:""}
      </div>
    </div>`;
  }).join("");
}


async function loadBusinessSettingsRecord(){
  let record={
    name:state.business?.name||"",
    email:state.business?.email||state.session?.user?.email||"",
    phone:state.business?.phone||"",
    service_area:state.business?.service_area||"",
    timezone:state.business?.timezone||"UTC",
    default_language:state.business?.default_language||"en",
    customer_email_language:state.business?.customer_email_language||"en",
    country_code:state.business?.country_code||"US",
    locale_code:state.business?.locale_code||"en-US",
    currency_code:state.business?.currency_code||"USD",
    distance_unit:state.business?.distance_unit||"mi",
    temperature_unit:state.business?.temperature_unit||"fahrenheit",
    payment_methods:Array.isArray(state.business?.payment_methods)?state.business.payment_methods:paymentMethodsForCountry(state.business?.country_code),
    instagram_url:state.business?.instagram_url||"",
    facebook_url:state.business?.facebook_url||"",
    owner_notify_email:state.business?.owner_notify_email!==false,
    owner_notify_push:state.business?.owner_notify_push===true,
    owner_notify_sms:state.business?.owner_notify_sms===true,
    owner_notification_email:state.business?.owner_notification_email||"",
    owner_notification_phone:state.business?.owner_notification_phone||""
  };
  try{
    const {data,error}=await supabase
      .from("businesses")
      .select("name,email,phone,service_area,timezone,default_language,customer_email_language,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods,instagram_url,facebook_url,owner_notify_email,owner_notify_push,owner_notify_sms,owner_notification_email,owner_notification_phone")
      .eq("id",state.business.id)
      .single();
    if(error) throw error;
    if(data) record={...record,...data};
  }catch(err){
    console.warn("[TLE] business settings load",err);
  }
  return record;
}

async function openBusinessProfileForm(){
  if(!state.business || state.business.role!=="owner"){
    showToast(langPick("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis."));
    return;
  }

  state.modalType="businessProfile";
  state.modalId=state.business.id;
  const record=await loadBusinessSettingsRecord();

  modalHeader(
    langPick("BUSINESS","NEGOCIO","ENTREPRISE"),
    langPick("Edit business basics","Editar datos del negocio","Modifier les informations de l’entreprise"),
    langPick("Update your company details. Time zone and country are detected from your service area.","Actualiza los datos del negocio. La zona horaria y el país se detectan desde tu área de servicio.","Mettez à jour les informations de l’entreprise. Le fuseau horaire et le pays sont détectés depuis votre zone de service.")
  );
  entityForm.innerHTML=`
    <div class="form-grid">
      <label>${escapeHtml(langPick("Business name","Nombre del negocio","Nom de l’entreprise"))}<input name="name" required value="${escapeHtml(record.name||"")}"></label>
      <label>${escapeHtml(langPick("Business email","Email del negocio","E-mail de l’entreprise"))}<input name="email" type="email" required value="${escapeHtml(record.email||"")}"></label>
      <label>${escapeHtml(langPick("Phone","Teléfono","Téléphone"))}<input name="phone" inputmode="tel" value="${escapeHtml(record.phone||"")}"></label>
      <label>${escapeHtml(langPick("Service area","Área de servicio","Zone de service"))}<input name="service_area" required value="${escapeHtml(record.service_area||"")}" placeholder="${escapeHtml(langPick("City, region, country","Ciudad, región, país","Ville, région, pays"))}"></label>
      <label class="full">${escapeHtml(langPick("Time zone","Zona horaria","Fuseau horaire"))}<input name="timezone_display" value="${escapeHtml(record.timezone||"UTC")}" readonly><small>${escapeHtml(langPick("Detected automatically from your service area.","Se detecta automáticamente desde tu área de servicio.","Détecté automatiquement depuis votre zone de service."))}</small></label>
      <label class="full">Instagram<input name="instagram_url" type="url" inputmode="url" value="${escapeHtml(record.instagram_url||"")}" placeholder="https://instagram.com/yourbusiness"></label>
      <label class="full">Facebook<input name="facebook_url" type="url" inputmode="url" value="${escapeHtml(record.facebook_url||"")}" placeholder="https://facebook.com/yourbusiness"></label>
    </div>
    ${formSubmit(langPick("Save business details","Guardar datos","Enregistrer"))}`;
  modal.hidden=false;
}

async function openAppPreferencesForm(){
  if(!state.business || state.business.role!=="owner"){
    showToast(langPick("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis."));
    return;
  }
  state.modalType="appPreferences";
  state.modalId=state.business.id;
  const record=await loadBusinessSettingsRecord();

  modalHeader(
    langPick("YOUR APP","TU APP","VOTRE APP"),
    langPick("App preferences","Preferencias de la app","Préférences de l’application"),
    langPick("These settings change your workspace, not the language your customers receive by email.","Estos ajustes cambian tu espacio de trabajo, no el idioma de los emails de tus clientes.","Ces réglages modifient votre espace de travail, pas la langue des e-mails envoyés aux clients.")
  );
  entityForm.innerHTML=`
    <div class="form-grid">
      <label>${escapeHtml(langPick("App language","Idioma de la app","Langue de l’application"))}<select name="default_language" required>
        <option value="en" ${record.default_language==="en"?"selected":""}>English</option>
        <option value="es" ${record.default_language==="es"?"selected":""}>Español</option>
        <option value="fr" ${record.default_language==="fr"?"selected":""}>Français</option>
        <option value="ht" ${record.default_language==="ht"?"selected":""}>Kreyòl Ayisyen</option>
      </select></label>
      <label>${escapeHtml(langPick("Currency","Moneda","Devise"))}<input name="currency_code" maxlength="3" required value="${escapeHtml(record.currency_code||"USD")}" placeholder="USD"></label>
      <label>${escapeHtml(langPick("Distance","Distancia","Distance"))}<select name="distance_unit">
        <option value="mi" ${record.distance_unit==="mi"?"selected":""}>${escapeHtml(langPick("Miles","Millas","Miles"))}</option>
        <option value="km" ${record.distance_unit==="km"?"selected":""}>${escapeHtml(langPick("Kilometers","Kilómetros","Kilomètres"))}</option>
      </select></label>
      <label>${escapeHtml(langPick("Temperature","Temperatura","Température"))}<select name="temperature_unit">
        <option value="fahrenheit" ${record.temperature_unit==="fahrenheit"?"selected":""}>Fahrenheit</option>
        <option value="celsius" ${record.temperature_unit==="celsius"?"selected":""}>Celsius</option>
      </select></label>
      <label>${escapeHtml(langPick("Country","País","Pays"))}<input value="${escapeHtml(record.country_code||"—")}" readonly></label>
      <label>${escapeHtml(langPick("Time zone","Zona horaria","Fuseau horaire"))}<input value="${escapeHtml(record.timezone||"UTC")}" readonly></label>
    </div>
    <p class="helper">${escapeHtml(langPick("Customer email language is controlled separately in Client Communication.","El idioma de los emails de clientes se controla por separado en Comunicación con clientes.","La langue des e-mails clients se règle séparément dans Communication client."))}</p>
    ${formSubmit(langPick("Save app preferences","Guardar preferencias","Enregistrer les préférences"))}`;
  modal.hidden=false;
}


function ownerAlertLang(en,es,fr,ht){
  const lang=appLanguage();
  if(lang==="es") return es;
  if(lang==="fr") return fr;
  if(lang==="ht") return ht;
  return en;
}

function ownerPushKeyBytes(value){
  const padding="=".repeat((4-value.length%4)%4);
  const base64=(value+padding).replace(/-/g,"+").replace(/_/g,"/");
  const raw=atob(base64);
  return Uint8Array.from([...raw].map(char=>char.charCodeAt(0)));
}

async function ensureOwnerPushSubscription(){
  if(!state.business || state.business.role!=="owner"){
    throw new Error(ownerAlertLang("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis.","Aksè pwopriyetè obligatwa."));
  }
  if(!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)){
    throw new Error(ownerAlertLang(
      "Push notifications are not supported on this device or browser.",
      "Las notificaciones push no son compatibles con este dispositivo o navegador.",
      "Les notifications push ne sont pas prises en charge sur cet appareil ou navigateur.",
      "Aparèy oswa navigatè sa a pa sipòte notifikasyon push."
    ));
  }

  let permission=Notification.permission;
  if(permission!=="granted") permission=await Notification.requestPermission();
  if(permission!=="granted"){
    throw new Error(ownerAlertLang(
      "Allow notifications on this device to turn on Push.",
      "Permite las notificaciones en este dispositivo para activar Push.",
      "Autorisez les notifications sur cet appareil pour activer Push.",
      "Pèmèt notifikasyon sou aparèy sa a pou aktive Push."
    ));
  }

  const registration=await navigator.serviceWorker.ready;
  let subscription=await registration.pushManager.getSubscription();
  if(!subscription){
    subscription=await registration.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey:ownerPushKeyBytes(OWNER_VAPID_PUBLIC_KEY)
    });
  }

  const json=subscription.toJSON();
  if(!json?.endpoint || !json?.keys?.p256dh || !json?.keys?.auth){
    throw new Error(ownerAlertLang(
      "Could not finish push setup on this device.",
      "No se pudo terminar la configuración push en este dispositivo.",
      "Impossible de terminer la configuration push sur cet appareil.",
      "Nou pa t ka fini konfigirasyon push sou aparèy sa a."
    ));
  }

  const {error}=await supabase.from("owner_push_subscriptions").upsert({
    business_id:state.business.id,
    user_id:state.session.user.id,
    endpoint:json.endpoint,
    p256dh:json.keys.p256dh,
    auth:json.keys.auth,
    user_agent:String(navigator.userAgent||"").slice(0,500),
    active:true,
    updated_at:new Date().toISOString()
  },{onConflict:"endpoint"});
  if(error) throw error;
  return true;
}

async function openNotificationPreferencesForm(){
  if(!state.business || state.business.role!=="owner"){
    showToast(ownerAlertLang("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis.","Aksè pwopriyetè obligatwa."));
    return;
  }
  state.modalType="notificationPreferences";
  state.modalId=state.business.id;
  const record=await loadBusinessSettingsRecord();
  const pushSupported=("serviceWorker" in navigator)&&("PushManager" in window)&&("Notification" in window);
  const pushNote=pushSupported
    ? ownerAlertLang(
        "Push can appear even when the app is closed. Your browser will ask for permission the first time.",
        "Push puede aparecer aunque la app esté cerrada. Tu navegador pedirá permiso la primera vez.",
        "Les notifications push peuvent apparaître même lorsque l’application est fermée. Le navigateur demandera l’autorisation la première fois.",
        "Push ka parèt menm lè app la fèmen. Navigatè a ap mande pèmisyon premye fwa a."
      )
    : ownerAlertLang(
        "Push is not available in this browser. On iPhone, install the app on the Home Screen and open it there.",
        "Push no está disponible en este navegador. En iPhone, instala la app en la pantalla de inicio y ábrela desde allí.",
        "Push n’est pas disponible dans ce navigateur. Sur iPhone, installez l’application sur l’écran d’accueil et ouvrez-la depuis celui-ci.",
        "Push pa disponib nan navigatè sa a. Sou iPhone, enstale app la sou ekran dakèy la epi ouvri li depi la."
      );

  modalHeader(
    ownerAlertLang("NOTIFICATIONS","NOTIFICACIONES","NOTIFICATIONS","NOTIFIKASYON"),
    ownerAlertLang("Owner alerts","Alertas para la dueña","Alertes propriétaire","Alèt pou pwopriyetè"),
    ownerAlertLang(
      "Choose where you want important Cleaning App alerts to reach you.",
      "Elige dónde quieres recibir las alertas importantes de Cleaning App.",
      "Choisissez où recevoir les alertes importantes de Cleaning App.",
      "Chwazi kote ou vle resevwa alèt enpòtan Cleaning App yo."
    )
  );

  entityForm.innerHTML=`
    <fieldset class="full"><legend>${escapeHtml(ownerAlertLang("Alert channels","Canales de alerta","Canaux d’alerte","Chanèl alèt"))}</legend>
      <div class="choice-grid compact">
        <label class="check-field"><input type="checkbox" name="notify_email" ${record.owner_notify_email!==false?"checked":""}> ${escapeHtml(ownerAlertLang("Email","Correo","E-mail","Imèl"))}</label>
        <label class="check-field"><input type="checkbox" name="notify_push" ${record.owner_notify_push?"checked":""} ${pushSupported?"":"disabled"}> ${escapeHtml(ownerAlertLang("Push notification","Notificación push","Notification push","Notifikasyon push"))}</label>
        <label class="check-field"><input type="checkbox" name="notify_sms" disabled> ${escapeHtml(ownerAlertLang("SMS text message","Mensaje SMS","Message SMS","Mesaj SMS"))}</label>
      </div>
      <small>${escapeHtml(pushNote)}</small>
    </fieldset>
    <div class="form-grid">
      <label>${escapeHtml(ownerAlertLang("Alert email","Correo para alertas","E-mail d’alerte","Imèl pou alèt"))}
        <input name="notification_email" type="email" value="${escapeHtml(record.owner_notification_email||record.email||state.session?.user?.email||"")}" placeholder="owner@company.com">
      </label>
      <label>${escapeHtml(ownerAlertLang("Alert phone number","Número para alertas","Numéro pour les alertes","Nimewo telefòn pou alèt"))}
        <input name="notification_phone" inputmode="tel" autocomplete="tel" value="${escapeHtml(record.owner_notification_phone||record.phone||"")}" placeholder="+1 561 555 0123">
      </label>
    </div>
    <p class="helper">${escapeHtml(ownerAlertLang(
      "SMS is prepared, but text delivery stays off until an SMS provider is connected. Your phone number can be saved now.",
      "SMS ya está preparado, pero el envío por texto queda apagado hasta conectar un proveedor de SMS. Puedes guardar el número ahora.",
      "Le SMS est prêt, mais l’envoi reste désactivé jusqu’à la connexion d’un fournisseur SMS. Vous pouvez enregistrer le numéro maintenant.",
      "SMS la pare, men voye mesaj tèks rete fèmen jiskaske nou konekte yon founisè SMS. Ou ka sove nimewo a kounye a."
    ))}</p>
    ${formSubmit(ownerAlertLang("Save notification preferences","Guardar preferencias","Enregistrer les préférences","Sove preferans notifikasyon"))}`;
  modal.hidden=false;
}

async function saveNotificationPreferences(fd){
  if(!state.business || state.business.role!=="owner"){
    throw new Error(ownerAlertLang("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis.","Aksè pwopriyetè obligatwa."));
  }
  const notifyEmail=fd.get("notify_email")==="on";
  const notifyPush=fd.get("notify_push")==="on";
  const notificationEmail=String(fd.get("notification_email")||"").trim().toLowerCase();
  const notificationPhone=String(fd.get("notification_phone")||"").trim();

  if(notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail)){
    throw new Error(ownerAlertLang("Enter a valid alert email.","Ingresa un correo válido para alertas.","Saisissez un e-mail d’alerte valide.","Antre yon imèl alèt ki valab."));
  }

  if(notifyPush) await ensureOwnerPushSubscription();
  if(!notifyPush && state.session?.user?.id){
    const {error:pushOffError}=await supabase.from("owner_push_subscriptions")
      .update({active:false,updated_at:new Date().toISOString()})
      .eq("business_id",state.business.id)
      .eq("user_id",state.session.user.id);
    if(pushOffError) throw pushOffError;
  }

  const payload={
    owner_notify_email:notifyEmail,
    owner_notify_push:notifyPush,
    owner_notify_sms:false,
    owner_notification_email:notificationEmail||null,
    owner_notification_phone:notificationPhone||null,
    updated_at:new Date().toISOString()
  };
  const {data,error}=await supabase.from("businesses")
    .update(payload)
    .eq("id",state.business.id)
    .select("owner_notify_email,owner_notify_push,owner_notify_sms,owner_notification_email,owner_notification_phone")
    .single();
  if(error) throw error;
  state.business={...state.business,...data};
  renderSettings();
}

async function openPaymentPreferencesForm(){
  if(!state.business || state.business.role!=="owner"){
    showToast(langPick("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis."));
    return;
  }
  state.modalType="paymentPreferences";
  state.modalId=state.business.id;
  const record=await loadBusinessSettingsRecord();
  const methods=[...new Set([...(record.payment_methods||[]),...paymentMethodsForCountry(record.country_code)])];

  modalHeader(
    langPick("PAYMENTS","PAGOS","PAIEMENTS"),
    langPick("Client payment options","Opciones de pago del cliente","Options de paiement client"),
    langPick("Choose the payment methods clients can select on invoices.","Elige las formas de pago que los clientes pueden seleccionar en las facturas.","Choisissez les modes de paiement proposés aux clients sur les factures.")
  );
  entityForm.innerHTML=`
    <fieldset class="full"><legend>${escapeHtml(langPick("Enabled methods","Métodos activados","Modes activés"))}</legend>
      <div class="choice-grid compact">
        ${methods.map(method=>`<label class="check-field"><input type="checkbox" name="payment_method" value="${escapeHtml(method)}" ${record.payment_methods?.includes(method)?"checked":""}> ${escapeHtml(paymentMethodLabel(method))}</label>`).join("")}
      </div>
      <label class="custom-payment-method">
        <span>${escapeHtml(langPick("Add another payment method","Añadir otra forma de pago","Ajouter un autre mode de paiement"))}</span>
        <input name="custom_payment_method" maxlength="40" placeholder="${escapeHtml(langPick("e.g. Venmo, Cash App","ej. Venmo, Cash App","ex. PayPal, Lydia"))}">
      </label>
      <small>${escapeHtml(langPick("The app stores the payment choice, not bank credentials.","La app guarda la forma de pago elegida, no credenciales bancarias.","L’application enregistre le mode de paiement choisi, pas les identifiants bancaires."))}</small>
    </fieldset>
    ${formSubmit(langPick("Save payment options","Guardar opciones de pago","Enregistrer les options de paiement"))}`;
  modal.hidden=false;
}
async function saveBusinessProfile(fd){
  if(!state.business || state.business.role!=="owner"){
    throw new Error(langPick("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis."));
  }

  const serviceArea=String(fd.get("service_area")||"").trim();
  if(!serviceArea) throw new Error(langPick("Service area is required.","El área de servicio es obligatoria.","La zone de service est obligatoire."));
  const detected=await resolveBusinessLocale(serviceArea);
  const country=detected.country_code||state.business.country_code||"US";
  const language=state.business.default_language||"en";
  const payload={
    name:String(fd.get("name")||"").trim(),
    email:String(fd.get("email")||"").trim().toLowerCase(),
    phone:String(fd.get("phone")||"").trim()||null,
    service_area:serviceArea,
    timezone:detected.timezone||state.business.timezone||"UTC",
    country_code:country,
    locale_code:localeForCountry(country,language),
    instagram_url:String(fd.get("instagram_url")||"").trim()||null,
    facebook_url:String(fd.get("facebook_url")||"").trim()||null,
    updated_at:new Date().toISOString()
  };

  if(!payload.name) throw new Error(langPick("Business name is required.","El nombre del negocio es obligatorio.","Le nom de l’entreprise est obligatoire."));
  if(!payload.email) throw new Error(langPick("Business email is required.","El email del negocio es obligatorio.","L’e-mail de l’entreprise est obligatoire."));

  const {data,error}=await supabase.from("businesses")
    .update(payload)
    .eq("id",state.business.id)
    .select("name,email,phone,service_area,timezone,country_code,locale_code,instagram_url,facebook_url")
    .single();
  if(error) throw error;
  state.business={...state.business,...data};
  renderSettings();
}

async function saveAppPreferences(fd){
  if(!state.business || state.business.role!=="owner"){
    throw new Error(langPick("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis."));
  }
  const language=String(fd.get("default_language")||"en").toLowerCase();
  if(!["en","es","fr","ht"].includes(language)) throw new Error("Invalid app language.");
  const currency=String(fd.get("currency_code")||"USD").trim().toUpperCase();
  if(!/^[A-Z]{3}$/.test(currency)) throw new Error(langPick("Use a 3-letter currency code.","Usa un código de moneda de 3 letras.","Utilisez un code devise de 3 lettres."));
  const distance=String(fd.get("distance_unit")||"mi");
  const temperature=String(fd.get("temperature_unit")||"fahrenheit");
  const country=state.business.country_code||"US";
  const payload={
    default_language:language,
    locale_code:localeForCountry(country,language),
    currency_code:currency,
    distance_unit:distance==="km"?"km":"mi",
    temperature_unit:temperature==="celsius"?"celsius":"fahrenheit",
    updated_at:new Date().toISOString()
  };
  const {data,error}=await supabase.from("businesses")
    .update(payload)
    .eq("id",state.business.id)
    .select("default_language,locale_code,currency_code,distance_unit,temperature_unit")
    .single();
  if(error) throw error;
  state.business={...state.business,...data};
  await syncAuthPreferredLanguage(data.default_language);
  if(window.TLE_I18N?.setLanguage) window.TLE_I18N.setLanguage(data.default_language);
  renderSettings();
}

async function savePaymentPreferences(fd){
  if(!state.business || state.business.role!=="owner"){
    throw new Error(langPick("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis."));
  }
  const paymentMethods=fd.getAll("payment_method").map(v=>String(v));
  const custom=String(fd.get("custom_payment_method")||"").trim();
  if(custom){
    const normalized=custom.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,40);
    if(normalized && !paymentMethods.includes(normalized)) paymentMethods.push(normalized);
  }
  if(!paymentMethods.length){
    throw new Error(langPick("Choose at least one payment method.","Elige al menos una forma de pago.","Choisissez au moins un mode de paiement."));
  }
  const {data,error}=await supabase.from("businesses")
    .update({payment_methods:paymentMethods,updated_at:new Date().toISOString()})
    .eq("id",state.business.id)
    .select("payment_methods")
    .single();
  if(error) throw error;
  state.business={...state.business,...data};
  renderSettings();
}

function renderSettings(){
  const n=$("#settingsBusinessName"),
        e=$("#settingsBusinessEmail"),
        p=$("#settingsBusinessPhone"),
        a=$("#settingsServiceArea"),
        country=$("#settingsBusinessCountry"),
        tz=$("#settingsBusinessTimezone"),
        lang=$("#settingsBusinessLanguage"),
        emailLang=$("#settingsCustomerEmailLanguage"),
        customerEmailSelect=$("#customerEmailLanguageSelect"),
        currency=$("#settingsBusinessCurrency"),
        distance=$("#settingsBusinessDistance"),
        temperature=$("#settingsBusinessTemperature"),
        paymentMethods=$("#settingsPaymentMethods"),
        bookingPaymentMethods=$("#bookingPaymentMethods"),
        b=$("#settingsTravelBuffer"),
        m=$("#settingsBookingNotice"),
        r=$("#settingsReplyEmail"),
        notificationChannels=$("#settingsNotificationChannels"),
        notificationDestination=$("#settingsNotificationDestination");
  if(n) n.textContent=state.business?.name||"—";
  if(e) e.textContent=state.business?.email||state.session?.user?.email||"—";
  if(p) p.textContent=state.business?.phone||"Not set";
  if(a) a.textContent=state.business?.service_area||"Not set";
  if(country) country.textContent=state.business?.country_code||"—";
  if(tz) tz.textContent=state.business?.timezone||"UTC";
  if(lang) lang.textContent=({en:"English",es:"Español",fr:"Français",ht:"Kreyòl Ayisyen"}[state.business?.default_language]||"English");
  if(emailLang) emailLang.textContent=customerEmailLanguageLabel(state.business?.customer_email_language||"en");
  if(customerEmailSelect && document.activeElement!==customerEmailSelect) customerEmailSelect.value=normalizedCustomerEmailLanguage(state.business?.customer_email_language)||"en";
  if(currency) currency.textContent=state.business?.currency_code||"USD";
  if(distance) distance.textContent=state.business?.distance_unit==="km"?"Kilometers":"Miles";
  if(temperature) temperature.textContent=state.business?.temperature_unit==="celsius"?"Celsius":"Fahrenheit";
  const methodLabel=(state.business?.payment_methods||paymentMethodsForCountry(state.business?.country_code)).map(paymentMethodLabel).join(" · ");
  if(paymentMethods) paymentMethods.textContent=methodLabel;
  if(bookingPaymentMethods) bookingPaymentMethods.textContent=methodLabel;
  if(b) b.textContent=(state.publicLinks?.travel_buffer_minutes??state.business?.default_travel_buffer_minutes??0)+" minutes";
  if(m) m.textContent=(state.publicLinks?.minimum_notice_hours??24)+" hours";
  if(r) r.textContent=state.publicLinks?.reply_email||"Business login email";
  const notificationsEyebrow=$("#settingsNotificationsEyebrow");
  const notificationsTitle=$("#settingsNotificationsTitle");
  const notificationsNote=$("#settingsNotificationsNote");
  const notificationsEdit=$("#editNotificationPreferencesBtn");
  const notificationsChannelsLabel=$("#settingsNotificationsChannelsLabel");
  const notificationsDestinationLabel=$("#settingsNotificationsDestinationLabel");
  if(notificationsEyebrow) notificationsEyebrow.textContent=ownerAlertLang("OWNER ALERTS","ALERTAS DE LA DUEÑA","ALERTES PROPRIÉTAIRE","ALÈT PWOPRIYETÈ");
  if(notificationsTitle) notificationsTitle.textContent=ownerAlertLang("Notifications","Notificaciones","Notifications","Notifikasyon");
  if(notificationsNote) notificationsNote.textContent=ownerAlertLang(
    "Choose how important booking, quote, payment and dispute alerts reach you.",
    "Elige cómo recibir alertas importantes de reservas, cotizaciones, pagos y disputas.",
    "Choisissez comment recevoir les alertes importantes de réservations, devis, paiements et contestations.",
    "Chwazi kijan pou resevwa alèt enpòtan pou rezèvasyon, devis, peman ak diskisyon."
  );
  if(notificationsEdit) notificationsEdit.textContent=ownerAlertLang("Edit notifications →","Editar notificaciones →","Modifier les notifications →","Modifye notifikasyon →");
  if(notificationsChannelsLabel) notificationsChannelsLabel.textContent=ownerAlertLang("Channels","Canales","Canaux","Chanèl");
  if(notificationsDestinationLabel) notificationsDestinationLabel.textContent=ownerAlertLang("Send alerts to","Enviar alertas a","Envoyer les alertes à","Voye alèt bay");

  if(notificationChannels){
    const channels=[];
    if(state.business?.owner_notify_email!==false) channels.push(ownerAlertLang("Email","Correo","E-mail","Imèl"));
    if(state.business?.owner_notify_push===true) channels.push("Push");
    if(state.business?.owner_notify_sms===true) channels.push("SMS");
    notificationChannels.textContent=channels.length?channels.join(" · "):ownerAlertLang("In-app only","Solo dentro de la app","Dans l’application uniquement","Nan app la sèlman");
  }
  if(notificationDestination){
    const parts=[];
    const mail=state.business?.owner_notification_email||state.business?.email||state.session?.user?.email||"";
    const phone=state.business?.owner_notification_phone||state.business?.phone||"";
    if(state.business?.owner_notify_email!==false && mail) parts.push(mail);
    if(phone) parts.push(phone);
    notificationDestination.textContent=parts.length?parts.join(" · "):ownerAlertLang("Not set","No configurado","Non configuré","Pa konfigire");
  }

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
  const connectedLabel=langPick("Connected","Conectado","Connecté");
  if(igState) igState.textContent=ig?connectedLabel:tr("Add profile");
  if(fbState) fbState.textContent=fb?connectedLabel:tr("Add page");
  if(googleState) googleState.textContent=googleUrl?connectedLabel:tr("Add link");

  if(hint){
    hint.textContent=ig||fb||googleUrl
      ? tr("Keep your client-facing links close while you run the day.")
      : tr("Add Instagram, Facebook and your review link in Business Profile.");
  }
}

function renderPublicLinks(){
  const slug=String(state.publicLinks?.public_slug||"").trim();
  const base=window.location.origin+window.location.pathname;
  const be=$("#bookingUrl"),qe=$("#quoteUrl");

  if(!slug){
    if(be){be.textContent=langPick("Loading booking link…","Cargando enlace de reserva…","Chargement du lien de réservation…");be.removeAttribute("href");}
    if(qe){qe.textContent=langPick("Loading quote link…","Cargando enlace de cotización…","Chargement du lien de devis…");qe.removeAttribute("href");}
    return;
  }

  const booking=`${base}?public=book&slug=${encodeURIComponent(slug)}`;
  const quote=`${base}?public=quote&slug=${encodeURIComponent(slug)}`;
  if(be){be.textContent=booking;be.href=booking;be.setAttribute("aria-label",langPick("Open booking link","Abrir enlace de reserva","Ouvrir le lien de réservation"));}
  if(qe){qe.textContent=quote;qe.href=quote;qe.setAttribute("aria-label",langPick("Open quote request link","Abrir enlace de cotización","Ouvrir le lien de devis"));}
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
        <div><strong>${escapeHtml(x.business_name||"Cleaning business")}</strong><small>${escapeHtml(x.email||"")} · Joined ${new Intl.DateTimeFormat(appLocale(),{month:"short",day:"numeric",year:"numeric"}).format(new Date(x.created_at))} · ${x.trial_promotion==="booking_page_setup"?"2 months Cleaning App with Booking Page":"30-day standard trial"}</small>${x.trial_promotion==="booking_page_setup"
          ? `<button class="ghost-btn" type="button" data-booking-page-promo-revoke="${x.business_id}">Revoke 2-month promo</button>`
          : `<button class="ghost-btn" type="button" data-booking-page-promo="${x.business_id}">Grant Booking Page 2-month promo</button>`
        }</div>
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
      const pageLabel=funnelProgressLabel(g.pages);
      const details=g.pages.slice(0,12).map(p=>`
        <div class="visit-detail-row">
          <span>${escapeHtml(funnelStepLabel(p.page))}</span>
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
    $("#publicBusinessName").textContent=tr("Page unavailable");
    $("#publicIntro").textContent=error.message||tr("This booking page is not available.");
    $("#publicRequestForm").hidden=true;
    return;
  }

  const allServices=data?.services||[];
  const services=allServices.filter(s=>mode==="quote" ? !(s.pricing_type==="flat" && Number(s.base_price)>0) : (s.pricing_type==="flat" && Number(s.base_price)>0));
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

  $("#publicBusinessName").textContent=data?.business?.name||tr("Cleaning service");
  $("#publicModeLabel").textContent=mode==="quote"?tr("REQUEST A QUOTE"):tr("BOOK A CLEANING");
  $("#publicIntro").textContent=mode==="quote"
    ?tr("Tell us what you need and the business will review your request.")
    :tr("Choose a service, date, and one of the real available times below.");
  submit.textContent=mode==="quote"?tr("Send quote request"):tr("Send booking request");
  $("#publicAddonsWrap").hidden=mode==="quote";
  if(quoteTimeWrap) quoteTimeWrap.hidden=mode!=="quote";
  if(slotsWrap) slotsWrap.hidden=mode==="quote";

  const quoteTimeInput=form?.querySelector('[name="time"]');
  if(quoteTimeInput) quoteTimeInput.required=false;

  if(!services.length){
    serviceSelect.innerHTML='<option value="">'+(mode==="quote"?tr("No services available yet"):tr("No priced services available for online booking"))+'</option>';
    serviceSelect.disabled=true;
    submit.disabled=true;
    summary.innerHTML=mode==="quote"
      ?'<span>'+escapeHtml(tr("No services are available yet. Please contact the cleaning business directly."))+'</span>'
      :'<span>'+escapeHtml(tr("No instant-booking services are available yet. Services without a fixed price require a quote."))+'</span><button type="button" class="primary-btn" id="bookingToQuoteBtn">'+escapeHtml(tr("Request a Quote"))+'</button>';
    $("#bookingToQuoteBtn")?.addEventListener("click",()=>{
      window.location.href=window.location.origin+window.location.pathname+"?public=quote&slug="+encodeURIComponent(slug);
    });
  }else{
    serviceSelect.disabled=false;
    serviceSelect.innerHTML='<option value="">'+escapeHtml(tr("Choose a service"))+'</option>'+services.map(s=>`<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}${mode==="quote"?" · "+tr("Quote required"):s.base_price!=null?" · "+money(s.base_price):""}</option>`).join("");
  }

  const chosenAddonIds=()=>$$('input[name="addon"]:checked',addonBox).map(x=>x.value);

  function updatePublicSummary(){
    const selected=services.find(s=>s.id===serviceSelect.value);
    if(!selected){summary.innerHTML="";return;}
    const chosen=addons.filter(a=>chosenAddonIds().includes(a.id));
    const total=(Number(selected.base_price)||0)+chosen.reduce((sum,a)=>sum+Number(a.price||0),0);
    const duration=Number(selected.duration_minutes||0)+chosen.reduce((sum,a)=>sum+Number(a.extra_duration_minutes||0),0);
    summary.innerHTML=`<strong>${escapeHtml(selected.name)}</strong><span>${duration} min${mode==="quote"?" · "+tr("Quote will be reviewed"):" · "+tr("Total")+": "+money(total)}</span>`;
  }

  function renderPublicAddons(){
    const selected=services.find(s=>s.id===serviceSelect.value);
    const available=addons.filter(a=>!a.service_id||a.service_id===selected?.id);
    addonBox.innerHTML=available.length
      ? `<div class="public-addon-note"><strong>${escapeHtml(langPick("Included with this service","Incluido con este servicio","Inclus avec ce service"))}</strong><span>${escapeHtml(langPick("Service add-ons are selected automatically. Uncheck anything this job does not need.","Los add-ons del servicio se seleccionan automáticamente. Desmarca lo que este trabajo no necesite.","Les options du service sont sélectionnées automatiquement. Décochez ce dont ce travail n’a pas besoin."))}</span></div>`+
        available.map(a=>{
          const includedByDefault=Boolean(selected && a.service_id===selected.id);
          return `<label class="addon-choice ${includedByDefault?"addon-default":""}">
            <input type="checkbox" name="addon" value="${escapeHtml(a.id)}" ${includedByDefault?"checked":""}>
            <span>
              <strong>${escapeHtml(a.name)}</strong>
              <small>${escapeHtml(includedByDefault?langPick("Included by default · ","Incluido por defecto · ","Inclus par défaut · "):langPick("Optional · ","Opcional · ","Optionnel · "))}+${money(a.price)} · +${escapeHtml(a.extra_duration_minutes)} min</small>
            </span>
          </label>`;
        }).join("")
      : '<span class="muted-line">'+escapeHtml(langPick("No add-ons for this service.","No hay add-ons para este servicio.","Aucune option pour ce service."))+'</span>';
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
      slotsBox.innerHTML='<span class="muted-line">'+escapeHtml(tr("Choose a service and date first."))+'</span>';
      return;
    }

    slotsBox.innerHTML='<span class="muted-line">'+escapeHtml(tr("Checking availability…"))+'</span>';
    const {data:rows,error:slotError}=await supabase.rpc("get_public_available_slots",{
      p_slug:slug,
      p_service_id:serviceId,
      p_date:dateValue,
      p_addon_ids:chosenAddonIds()
    });

    if(slotError){
      slotsBox.innerHTML=`<span class="muted-line">${escapeHtml(tr("Could not load availability"))}</span>`;
      return;
    }

    const slots=Array.isArray(rows)?rows:[];
    if(!slots.length){
      slotsBox.innerHTML='<span class="muted-line">'+escapeHtml(tr("No openings on this date. Try another day."))+'</span>';
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
    const propertyType=String(fd.get("property_type")||"").trim().toLowerCase();
    const squareFeet=String(fd.get("square_feet")||"").trim();
    const customerNotes=String(fd.get("notes")||"").trim();
    setBusy(submit,true,tr("Sending…"));
    try{
      if((preferred==="text"||preferred==="whatsapp")&&!phone) throw new Error(tr("Phone is required for Text or WhatsApp."));
      if(!["residential","commercial"].includes(propertyType)) throw new Error(tr("Choose Residential or Commercial."));
      if(squareFeet && (!/^\d+$/.test(squareFeet) || Number(squareFeet)<1)) throw new Error(tr("Square feet must be a positive number."));
      const requestNotes=[
        "Property type: "+(propertyType==="commercial"?"Commercial":"Residential"),
        squareFeet ? "Approx. square feet: "+squareFeet : "",
        customerNotes ? "Notes: "+customerNotes : ""
      ].filter(Boolean).join("\n");

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
          p_preferred_time:String(fd.get("time")||"").trim()||null,
          p_notes:requestNotes||null
        });
        if(submitError) throw submitError;
      }else{
        const selectedSlot=String(fd.get("slot_start")||"").trim();
        if(!selectedSlot) throw new Error(tr("Choose one of the available times."));
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
          p_notes:requestNotes||null
        });
        if(submitError) throw submitError;
      }

      form.hidden=true;
      $("#publicSuccess").hidden=false;
      $("#publicSuccessCopy").textContent=mode==="quote"
        ?tr("Your quote request was sent. The business will review it and contact you.")
        :tr("Your booking request was sent. The business will review it and confirm the appointment.");
    }catch(err){
      showToast(err.message||tr("Could not send request"));
    }finally{
      setBusy(submit,false);
    }
  };

  $("#publicBackBtn").onclick=()=>{
    if(history.length>1) history.back();
    else window.location.href=window.location.origin+window.location.pathname;
  };
}


function clientServiceAddress(client){
  if(!client) return "";
  return [client.address_line1,client.address_line2,client.city,client.state,client.postal_code].filter(Boolean).join(", ");
}

function recurrencePatternConfig(pattern){
  if(pattern==="weekly") return {frequency:"weekly",interval_count:1};
  if(pattern==="biweekly") return {frequency:"biweekly",interval_count:1};
  if(pattern==="every_4_weeks") return {frequency:"weekly",interval_count:4};
  if(pattern==="monthly") return {frequency:"monthly",interval_count:1};
  return null;
}

function recurrencePatternFromRule(rule){
  if(!rule) return "one_time";
  if(rule.frequency==="monthly") return "monthly";
  if(rule.frequency==="biweekly") return "biweekly";
  if(rule.frequency==="weekly" && Number(rule.interval_count||1)===4) return "every_4_weeks";
  if(rule.frequency==="weekly") return "weekly";
  return "one_time";
}

function recurrenceDateForIndex(startsOn,rule,index){
  const parts=String(startsOn||"").split("-").map(Number);
  if(parts.length!==3 || parts.some(Number.isNaN)) return "";
  const [year,month,day]=parts;
  const interval=Math.max(1,Number(rule?.interval_count||1));
  if(rule?.frequency==="monthly"){
    const monthIndex=(month-1)+(index*interval);
    const targetYear=year+Math.floor(monthIndex/12);
    const targetMonth=((monthIndex%12)+12)%12;
    const lastDay=new Date(targetYear,targetMonth+1,0).getDate();
    const d=new Date(targetYear,targetMonth,Math.min(day,lastDay));
    return tleCalendarDateKey(d);
  }
  const stepDays=rule?.frequency==="biweekly" ? 14*interval : 7*interval;
  const d=new Date(year,month-1,day+(index*stepDays));
  return tleCalendarDateKey(d);
}

async function ensureRecurringJobHorizon(){
  if(!state.business || !["owner","admin"].includes(String(state.business.role||""))) return 0;
  const now=new Date();
  const horizon=new Date(now);
  horizon.setDate(horizon.getDate()+180);
  const todayKey=tleCalendarDateKey(now);
  const occupiedJobs=state.jobs.filter(j=>!["canceled","no_show"].includes(String(j.status||"")));
  let added=0;

  const overlapsExisting=payload=>{
    const start=new Date(payload.starts_at).getTime();
    const from=start-(Number(payload.travel_buffer_before_minutes||0)*60000);
    const to=start+((Number(payload.duration_minutes||0)+Number(payload.travel_buffer_after_minutes||0))*60000);
    return occupiedJobs.some(job=>{
      const jobStart=new Date(job.starts_at).getTime();
      const jobFrom=jobStart-(Number(job.travel_buffer_before_minutes||0)*60000);
      const jobTo=jobStart+((Number(job.duration_minutes||0)+Number(job.travel_buffer_after_minutes||0))*60000);
      return from<jobTo && to>jobFrom;
    });
  };

  for(const rule of state.recurrenceRules.filter(r=>r.active)){
    const series=occupiedJobs
      .filter(j=>j.recurrence_rule_id===rule.id)
      .sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at));
    if(!series.length) continue;

    const template=series[0];
    const local=zonedDateTimeParts(template.starts_at);
    const teamId=template.job_assignments?.[0]?.team_member_id||null;
    const existingSlots=new Set(series.map(j=>String(j.recurrence_occurrence_date||"")).filter(Boolean));
    const seriesLimit=rule.ends_on && rule.ends_on<tleCalendarDateKey(horizon) ? rule.ends_on : tleCalendarDateKey(horizon);

    for(let index=0; index<160; index++){
      const dateKey=recurrenceDateForIndex(rule.starts_on,rule,index);
      if(!dateKey || dateKey>seriesLimit) break;
      if(dateKey<todayKey || existingSlots.has(dateKey)) continue;

      const startsIso=businessLocalDateTimeToIso(dateKey,local.time);
      const payload={
        business_id:state.business.id,
        client_id:template.client_id||null,
        service_id:template.service_id||null,
        recurrence_rule_id:rule.id,
        recurrence_occurrence_date:dateKey,
        status:"scheduled",
        service_address:template.service_address,
        starts_at:startsIso,
        duration_minutes:Number(template.duration_minutes),
        travel_buffer_before_minutes:Number(template.travel_buffer_before_minutes||0),
        travel_buffer_after_minutes:Number(template.travel_buffer_after_minutes||0),
        notes:template.notes||null
      };

      if(overlapsExisting(payload)){
        console.warn("[TLE] recurring occurrence skipped because the time is already occupied",dateKey);
        existingSlots.add(dateKey);
        continue;
      }

      const {data,error}=await supabase.from("jobs").insert(payload).select("id").single();
      if(error){
        if(error.code==="23505"){
          existingSlots.add(dateKey);
          continue;
        }
        throw error;
      }

      const created={...payload,id:data.id,job_assignments:teamId?[{team_member_id:teamId}]:[]};
      occupiedJobs.push(created);
      existingSlots.add(dateKey);
      added++;
      if(teamId){
        const {error:assignmentError}=await supabase.rpc("set_primary_job_assignment",{
          p_job_id:data.id,
          p_team_member_id:teamId
        });
        if(assignmentError) console.warn("[TLE] recurring assignment",assignmentError);
      }
    }
  }
  return added;
}

function syncRecurrenceControls(){
  const select=entityForm?.querySelector('[name="recurrence_pattern"]');
  const options=entityForm?.querySelector("[data-recurrence-options]");
  if(!select || !options) return;
  options.hidden=select.value==="one_time";
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
        <label>${escapeHtml(langPick("Email language","Idioma de emails","Langue des e-mails"))}<select name="preferred_language">${customerEmailLanguageOptions(record?.preferred_language||"",true)}</select></label>
        <label>Source<input name="source" value="${escapeHtml(record?.source||"")}" placeholder="Instagram, referral, website…"></label>
        <label>Status<select name="status">${["new","contacted","qualified","quoted","booked","lost"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v}</option>`).join("")}</select></label>
        <label class="full">Service interest<input name="service_interest" value="${escapeHtml(record?.service_interest||"")}"></label>
        <label class="full">Address<input name="address" value="${escapeHtml(record?.address||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea>${record?.notes?customerTranslateLink(record.notes,record?.preferred_language):""}</label>
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
        <label>${escapeHtml(langPick("Email language","Idioma de emails","Langue des e-mails"))}<select name="preferred_language">${customerEmailLanguageOptions(record?.preferred_language||"",true)}</select></label>
        <label class="full">Street address<input name="address_line1" value="${escapeHtml(record?.address_line1||"")}"></label>
        <label>City<input name="city" value="${escapeHtml(record?.city||"")}"></label>
        <label>Region / State<input name="state" value="${escapeHtml(record?.state||"")}"></label>
        <label>Postal code<input name="postal_code" value="${escapeHtml(record?.postal_code||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea>${record?.notes?customerTranslateLink(record.notes,record?.preferred_language):""}</label>
      </div>${formSubmit(record?"Save changes":"Add client")}`;
  }

  if(type==="service"){
    const pricingChoice=record?.pricing_type==="flat" && Number(record?.base_price)>0 ? "flat" : "quote";
    modalHeader(
      langPick("SERVICE","SERVICIO","SERVICE"),
      record?langPick("Edit service","Editar servicio","Modifier le service"):langPick("Add service","Añadir servicio","Ajouter un service"),
      langPick("Choose whether customers see a price now or request a custom quote.","Elige si el cliente ve el precio al momento o solicita una cotización personalizada.","Choisissez si le client voit le prix immédiatement ou demande un devis personnalisé.")
    );
    entityForm.innerHTML=`
      <div class="form-grid">
        <label class="full">${escapeHtml(langPick("Service name","Nombre del servicio","Nom du service"))}<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>${escapeHtml(langPick("Customer pricing","Precio para el cliente","Tarification client"))}<select name="pricing_type">
          <option value="flat" ${pricingChoice==="flat"?"selected":""}>${escapeHtml(langPick("Upfront price","Precio inmediato","Prix immédiat"))}</option>
          <option value="quote" ${pricingChoice==="quote"?"selected":""}>${escapeHtml(langPick("Custom quote","Cotización personalizada","Devis personnalisé"))}</option>
        </select></label>
        <label>${escapeHtml(langPick("Upfront price","Precio inmediato","Prix immédiat"))}<input name="base_price" type="number" min="0" step="0.01" value="${pricingChoice==="flat"?(record?.base_price??""):""}" placeholder="${pricingChoice==="quote"?langPick("Not needed","No hace falta","Non requis"):""}"></label>
        <label>${escapeHtml(langPick("Duration (minutes)","Duración (minutos)","Durée (minutes)"))}<input name="default_duration_minutes" type="number" min="15" step="15" required value="${record?.default_duration_minutes||120}"></label>
        <label class="full">${escapeHtml(langPick("Description","Descripción","Description"))}<textarea name="description">${escapeHtml(record?.description||"")}</textarea></label>
        <label class="check-field"><input name="active" type="checkbox" ${record?.active!==false?"checked":""}> ${escapeHtml(langPick("Active service","Servicio activo","Service actif"))}</label>
      </div>${formSubmit(record?langPick("Save changes","Guardar cambios","Enregistrer"):langPick("Add service","Añadir servicio","Ajouter le service"))}`;
    const pricingSelect=entityForm.querySelector('[name="pricing_type"]');
    const basePriceInput=entityForm.querySelector('[name="base_price"]');
    const syncServicePriceField=()=>{
      if(!pricingSelect||!basePriceInput) return;
      const upfront=pricingSelect.value==="flat";
      basePriceInput.disabled=!upfront;
      basePriceInput.required=upfront;
      if(!upfront){
        basePriceInput.value="";
        basePriceInput.placeholder=langPick("Not needed","No hace falta","Non requis");
      }else{
        basePriceInput.placeholder="0.00";
      }
    };
    pricingSelect?.addEventListener("change",syncServicePriceField);
    syncServicePriceField();
  }

  if(type==="addon"){
    modalHeader(
      langPick("ADD-ON","ADD-ON","OPTION"),
      record?langPick("Edit add-on","Editar add-on","Modifier l’option"):langPick("Add add-on","Añadir add-on","Ajouter une option"),
      langPick("Assign it to a service to include it automatically. It can still be removed for any individual booking.","Asígnalo a un servicio para incluirlo automáticamente. Aun así se puede quitar en una reserva individual.","Associez-le à un service pour l’inclure automatiquement. Il peut toujours être retiré d’une réservation individuelle.")
    );
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
    modalHeader(tr("MILEAGE"),record?langPick("Edit drive","Editar viaje","Modifier le trajet"):langPick("Log drive","Registrar viaje","Enregistrer le trajet"),langPick("Keep business distance simple with separate From and To fields.","Guarda la distancia del negocio con origen y destino separados.","Gardez les déplacements professionnels simples avec un départ et une destination séparés."));
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
      </div>${formSubmit(langPick("Save mileage","Guardar millaje","Enregistrer le kilométrage"))}`;
  }

  if(type==="job"){
    const localParts=record?.starts_at?zonedDateTimeParts(record.starts_at):{date:"",time:""};
    const date=localParts.date;
    const time=localParts.time;
    const recurrenceRule=record?.recurrence_rule_id?state.recurrenceRules.find(r=>r.id===record.recurrence_rule_id):null;
    modalHeader("JOB",record?"Edit job":"Add job","Schedule a cleaning with duration, travel buffer and an optional recurring schedule.");
    entityForm.innerHTML=`
      <div class="form-grid job-form-grid">
        <label>Client<select name="client_id" data-job-client-picker><option value="">No client</option>${optionList(state.clients,"id","name",record?.client_id)}</select></label>
        <label>Service<select name="service_id"><option value="">No service</option>${optionList(state.services.filter(s=>s.active),"id","name",record?.service_id)}</select></label>
        <label>Assigned teammate<select name="team_member_id"><option value="">Unassigned</option>${optionList(state.teamMembers,"id","name",record?.job_assignments?.[0]?.team_member_id)}</select></label>
        <label>Date<input name="date" type="date" required value="${date}"></label>
        <label>Time<input name="time" type="time" required value="${time}"></label>
        <label>Duration (minutes)<input name="duration_minutes" type="number" min="15" step="15" required value="${record?.duration_minutes||120}"></label>
        <label>Travel buffer (minutes)<input name="travel_buffer" type="number" min="0" step="5" value="${record?.travel_buffer_before_minutes??state.business.default_travel_buffer_minutes??30}"></label>
        <label class="full">Service address<input name="service_address" required value="${escapeHtml(record?.service_address||"")}"></label>
        ${!record?`
          <label class="full">Repeat
            <select name="recurrence_pattern" data-recurrence-pattern>
              <option value="one_time">One time</option>
              <option value="weekly">Every week</option>
              <option value="biweekly">Every 2 weeks</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <div class="recurrence-options full" data-recurrence-options hidden>
            <label>End date <span class="field-optional">optional</span><input name="recurrence_ends_on" type="date"></label>
            <p>Leave the end date blank to keep the schedule ongoing. Future visits are kept generated automatically.</p>
          </div>
        `:recurrenceRule?`
          <div class="recurrence-existing-note full">
            <strong>Recurring job · ${escapeHtml(recurrencePatternFromRule(recurrenceRule).replaceAll("_"," "))}</strong>
            <span>You are editing this visit only. The recurring schedule stays active.</span>
          </div>
        `:""}
        <label>Status<select name="status">
          ${["scheduled","on_the_way","in_progress","completed","canceled","no_show"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v.replaceAll("_"," ")}</option>`).join("")}
        </select></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Add job")}`;
    syncRecurrenceControls();
  }

  if(type==="quote"){
    const item=record?.quote_items?.[0];
    modalHeader("QUOTE",record?"Edit quote":"Create quote","Use an existing client or enter a new customer. The quote stays here until it is accepted.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label class="full">Existing client
          <select name="client_id" data-quote-client-picker>
            <option value="">New customer / enter manually</option>
            ${optionList(state.clients,"id","name",record?.client_id)}
          </select>
        </label>
        <label>Name<input name="customer_name" required value="${escapeHtml(record?.customer_name||"")}"></label>
        <label>Email<input name="customer_email" type="email" required value="${escapeHtml(record?.customer_email||"")}"></label>
        <label>Phone<input name="customer_phone" value="${escapeHtml(record?.customer_phone||"")}"></label>
        <label>${escapeHtml(langPick("Email language","Idioma de emails","Langue des e-mails"))}<select name="preferred_language">${customerEmailLanguageOptions(record?.preferred_language||"",true)}</select></label>
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

entityForm.addEventListener("change",e=>{
  const quoteClient=e.target.closest?.("[data-quote-client-picker]");
  if(quoteClient){
    const client=state.clients.find(c=>c.id===quoteClient.value);
    if(client){
      const fields={
        customer_name:client.name||"",
        customer_email:client.email||"",
        customer_phone:client.phone||"",
        preferred_language:client.preferred_language||"",
        service_address:clientServiceAddress(client)
      };
      Object.entries(fields).forEach(([name,value])=>{
        const input=entityForm.querySelector(`[name="${name}"]`);
        if(input) input.value=value;
      });
    }
    return;
  }

  const jobClient=e.target.closest?.("[data-job-client-picker]");
  if(jobClient){
    const client=state.clients.find(c=>c.id===jobClient.value);
    const address=entityForm.querySelector('[name="service_address"]');
    if(client && address && !String(address.value||"").trim()) address.value=clientServiceAddress(client);
    return;
  }

  if(e.target.closest?.("[data-recurrence-pattern]")){
    syncRecurrenceControls();
  }
});

entityForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const button=e.submitter;
  setBusy(button,true,"Saving…");
  try{
    const fd=new FormData(entityForm);
    if(state.modalType==="feedback"){
      await saveFeedback(fd);
      modal.hidden=true;
      showToast(langPick("Feedback sent. Thank you!","Comentarios enviados. ¡Gracias!","Commentaire envoyé. Merci !"));
      return;
    }
    if(state.modalType==="workerMileage"){
      const workerUnit=state.workerPortal?.business?.distance_unit==="km"?"km":"mi";
      const entered=Number(fd.get("distance")||0);
      if(!Number.isFinite(entered)||entered<=0){
        throw new Error(langPick("Enter a valid distance.","Ingresa una distancia válida.","Saisissez une distance valide."));
      }
      const miles=workerUnit==="km"?entered/1.609344:entered;
      const token=localStorage.getItem("tle_worker_device_token");
      const {error}=await supabase.rpc("worker_portal_log_mileage",{
        p_token:token,
        p_job_id:state.modalId,
        p_miles:miles,
        p_notes:requestNotes||null
      });
      if(error) throw error;
      modal.hidden=true;
      await refreshWorkerPortal();
      showToast(langPick("Mileage saved","Millaje guardado","Kilométrage enregistré"));
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
    if(state.modalType==="appPreferences") await saveAppPreferences(fd);
    if(state.modalType==="notificationPreferences") await saveNotificationPreferences(fd);
    if(state.modalType==="paymentPreferences") await savePaymentPreferences(fd);
    if(state.modalType==="invite") await saveInvite(fd);
    if(state.modalType==="startTimer") await saveStartTimer(fd);
    // Sending a quote from Edit Quote is a deliberate review moment:
    // keep the modal exactly where the owner left it, confirm success inline,
    // refresh the Quotes board behind it, and let the owner close the modal.
    if(state.modalType==="quote" && quoteResult?.sent){
      await loadCoreData();
      const statusField=entityForm.querySelector('[name="status"]');
      if(statusField) statusField.value="sent";
      let confirmation=entityForm.querySelector("[data-quote-send-confirmation]");
      if(!confirmation){
        confirmation=document.createElement("div");
        confirmation.className="permission-note";
        confirmation.dataset.quoteSendConfirmation="true";
        const footer=entityForm.querySelector(".form-footer");
        if(footer) footer.before(confirmation);
        else entityForm.prepend(confirmation);
      }
      confirmation.innerHTML="<strong>"+escapeHtml(langPick("Quote sent.","Cotización enviada.","Devis envoyé."))+"</strong><br>"+escapeHtml(langPick("Waiting for the customer to accept. This window will stay open until you close it.","Esperando que el cliente acepte. Esta ventana permanecerá abierta hasta que la cierres.","En attente de l’acceptation du client. Cette fenêtre restera ouverte jusqu’à ce que vous la fermiez."));
      showToast(langPick("Quote emailed to customer","Cotización enviada por email al cliente","Devis envoyé au client par e-mail"));
      return;
    }

    modal.hidden=true;
    await loadCoreData();
    showToast(
      invoiceResult?.sent
        ? "Invoice emailed to client"
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
    preferred_language:normalizedCustomerEmailLanguage(fd.get("preferred_language")),
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
  const methodLabel=customerPaymentMethodLabel(inv);
  const paymentOptions=[...new Set([...(state.business.payment_methods||paymentMethodsForCountry(state.business?.country_code)),...(chosen?[chosen]:[])])];
  state.modalType="payment";state.modalId=invoiceId;
  modalHeader("PAYMENT","Record payment",`Invoice #${inv.invoice_number||String(inv.id).slice(0,6)} · ${money(remaining)} remaining`);
  entityForm.innerHTML=`
    ${methodLabel?`<p class="helper"><strong>Customer chose: ${escapeHtml(methodLabel)}</strong></p>`:""}
    <div class="form-grid">
      <label>Amount<input name="amount" type="number" min="0.01" step="0.01" max="${remaining}" required value="${remaining}"></label>
      <label>Method<select name="method">
        ${paymentOptions.map(method=>`<option value="${escapeHtml(method)}" ${chosen===method?"selected":""}>${escapeHtml(method==="other"&&inv.customer_payment_method_detail?customerPaymentMethodLabel(inv):paymentMethodLabel(method))}</option>`).join("")}
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
  const email=String(fd.get("email")||"").trim().toLowerCase();
  if((preferred==="text"||preferred==="whatsapp")&&!phone) throw new Error("Phone is required for Text or WhatsApp.");
  if(!email) throw new Error("Email is required.");
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    email,
    phone:phone||null,
    preferred_contact:preferred,
    preferred_language:normalizedCustomerEmailLanguage(fd.get("preferred_language")),
    address_line1:String(fd.get("address_line1")||"").trim()||null,
    city:String(fd.get("city")||"").trim()||null,
    state:String(fd.get("state")||"").trim()||null,
    postal_code:String(fd.get("postal_code")||"").trim()||null,
    notes:String(fd.get("notes")||"").trim()||null
  };

  if(state.modalId){
    const {error}=await supabase.from("clients").update(payload).eq("id",state.modalId);
    if(error) throw error;
    return;
  }

  const {data:existing,error:lookupError}=await supabase
    .from("clients")
    .select("id")
    .eq("business_id",state.business.id)
    .is("archived_at",null)
    .eq("email",email)
    .limit(1)
    .maybeSingle();
  if(lookupError) throw lookupError;

  const query=existing?.id
    ? supabase.from("clients").update(payload).eq("id",existing.id)
    : supabase.from("clients").insert(payload);
  const {error}=await query;
  if(error) throw error;
}
async function saveService(fd){
  let pricing=fd.get("pricing_type")==="flat"?"flat":"quote";
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
    ? supabase.from("services").update(payload).eq("id",state.modalId).select("*").single()
    : supabase.from("services").insert(payload).select("*").single();

  const {data:savedService,error}=await query;
  if(error) throw error;

  // Reflect the server-confirmed service immediately so price changes do not
  // wait for the full workspace refresh before appearing on screen.
  if(savedService){
    const existingIndex=state.services.findIndex(service=>service.id===savedService.id);
    if(existingIndex>=0) state.services[existingIndex]=savedService;
    else state.services.unshift(savedService);

    state.services.sort((a,b)=>{
      if(Boolean(a.active)!==Boolean(b.active)) return a.active?-1:1;
      return String(a.name||"").localeCompare(String(b.name||""),undefined,{sensitivity:"base"});
    });

    renderServices();
    renderBookingServices();
  }

  return savedService||null;
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
  const date=String(fd.get("date")||"");
  const time=String(fd.get("time")||"");
  const startsIso=businessLocalDateTimeToIso(date,time);
  const recurrencePattern=String(fd.get("recurrence_pattern")||"one_time");
  const recurrenceConfig=!state.modalId?recurrencePatternConfig(recurrencePattern):null;
  const recurrenceEndsOn=String(fd.get("recurrence_ends_on")||"").trim()||null;

  if(recurrenceConfig && recurrenceEndsOn && recurrenceEndsOn<date){
    throw new Error("Recurring end date cannot be before the first job.");
  }

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

  let recurrenceRuleId=null;
  if(recurrenceConfig){
    const {data:rule,error:ruleError}=await supabase.from("recurrence_rules").insert({
      business_id:state.business.id,
      frequency:recurrenceConfig.frequency,
      interval_count:recurrenceConfig.interval_count,
      starts_on:date,
      ends_on:recurrenceEndsOn,
      active:true
    }).select("id").single();
    if(ruleError) throw ruleError;
    recurrenceRuleId=rule.id;
    payload.recurrence_rule_id=recurrenceRuleId;
    payload.recurrence_occurrence_date=date;
  }

  let result;
  try{
    if(state.modalId){
      result=await supabase.from("jobs").update(payload).eq("id",state.modalId).select("id").single();
    }else{
      result=await supabase.from("jobs").insert(payload).select("id").single();
    }
    if(result.error) throw result.error;
  }catch(err){
    if(recurrenceRuleId){
      await supabase.from("recurrence_rules").delete().eq("id",recurrenceRuleId);
    }
    throw err;
  }

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
    client_id:fd.get("client_id")||current?.client_id||null,
    customer_name:String(fd.get("customer_name")).trim(),
    customer_email:String(fd.get("customer_email")).trim(),
    customer_phone:String(fd.get("customer_phone")||"").trim()||null,
    preferred_language:normalizedCustomerEmailLanguage(fd.get("preferred_language")),
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
  if(!id) throw new Error(langPick("Active timer not found.","No encontramos ese temporizador activo.","Minuteur actif introuvable."));
  const entry=state.timeEntries.find(t=>t.id===id);
  if(entry?.clocked_out_at) return entry;

  const result=await withTimeout(
    supabase.rpc("finish_job_time_entry",{p_entry_id:id}),
    langPick("Finishing timer","Finalizando temporizador","Arrêt du minuteur"),
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
    throw new Error(langPick("Could not confirm that the timer stopped.","No se pudo confirmar el cierre del temporizador.","Impossible de confirmer l’arrêt du minuteur."));
  }

  if(entry){
    entry.clocked_out_at=finished.clocked_out_at;
    entry.minutes_worked=finished.minutes_worked;
  }

  // Stopping a work timer means the assigned job is finished, even when
  // the actual tracked time is shorter than the planned duration. The RPC
  // commits the job status atomically; mirror it locally so Calendar/Today
  // update immediately while the full workspace refresh is loading.
  const finishedJobId=finished?.job_id||entry?.job_id||null;
  if(finishedJobId){
    const job=state.jobs.find(j=>j.id===finishedJobId);
    if(job) job.status="completed";
    if(entry?.jobs) entry.jobs.status="completed";
    renderJobs();
    renderTodaySummary();
    renderOperations();
  }

  await loadCoreData();
  renderOperations();
  return finished;
}

async function deleteBusinessRecord(type,id){
  if(!state.business || !["owner","admin"].includes(state.business.role)){
    throw new Error(langPick("Only Owner or Admin can delete records.","Solo Owner o Admin puede borrar registros.","Seul le propriétaire ou un administrateur peut supprimer des données."));
  }

  const names={
    client:langPick("client","cliente","client"),
    lead:langPick("lead","lead","prospect"),
    quote:langPick("quote","cotización","devis"),
    invoice:langPick("invoice","factura","facture")
  };

  let message=langPick("Permanently delete this "+names[type]+"? This cannot be undone.","¿Borrar permanentemente este "+names[type]+"? Esta acción no se puede deshacer.","Supprimer définitivement ce "+names[type]+" ? Cette action est irréversible.");

  if(type==="client"){
    message=langPick("Permanently delete this client? Related jobs and invoices will also be deleted. This cannot be undone.","¿Borrar permanentemente este cliente? También se borrarán sus trabajos y facturas relacionadas. Esta acción no se puede deshacer.","Supprimer définitivement ce client ? Les travaux et factures associés seront également supprimés. Cette action est irréversible.");
  }else if(type==="invoice"){
    message=langPick("Permanently delete this invoice? Its payments, items, public link and related disputes will also be deleted.","¿Borrar permanentemente esta factura? También se borrarán sus pagos, items, link público y disputas relacionadas.","Supprimer définitivement cette facture ? Ses paiements, éléments, lien public et litiges associés seront également supprimés.");
  }else if(type==="quote"){
    message=langPick("Permanently delete this quote? Its items, public link and related disputes will also be deleted.","¿Borrar permanentemente esta cotización? Sus items, link público y disputas relacionadas también se borrarán.","Supprimer définitivement ce devis ? Ses éléments, lien public et litiges associés seront également supprimés.");
  }

  if(!window.confirm(message)) return false;

  const {data,error}=await supabase.rpc("delete_business_record",{
    p_record_type:type,
    p_record_id:id
  });
  if(error) throw error;

  await loadCoreData();
  showToast(langPick("Deleted","Borrado","Supprimé"));
  return data||true;
}

function normalizedExternalHttpUrl(raw){
  const value=String(raw||"").trim();
  if(!value) return "";
  try{
    const url=new URL(value);
    if(!["http:","https:"].includes(url.protocol)) return "";
    return url.href;
  }catch{
    return "";
  }
}
function openExternalWebLink(raw){
  const url=normalizedExternalHttpUrl(raw);
  if(!url) return false;
  const launcher=document.createElement("a");
  launcher.href=url;
  launcher.target="_blank";
  launcher.rel="noopener noreferrer external";
  launcher.setAttribute("aria-hidden","true");
  launcher.tabIndex=-1;
  launcher.style.position="fixed";
  launcher.style.width="1px";
  launcher.style.height="1px";
  launcher.style.opacity="0";
  launcher.style.pointerEvents="none";
  document.body.appendChild(launcher);
  launcher.click();
  setTimeout(()=>launcher.remove(),1200);
  return true;
}
function instagramUsernameFromUrl(raw){
  const url=normalizedExternalHttpUrl(raw);
  if(!url) return "";
  try{
    const parsed=new URL(url);
    const host=parsed.hostname.toLowerCase().replace(/^www\./,"");
    if(host!=="instagram.com") return "";
    const part=parsed.pathname.split("/").filter(Boolean)[0]||"";
    if(!part || ["p","reel","reels","stories","explore","accounts"].includes(part.toLowerCase())) return "";
    return part.replace(/^@/,"");
  }catch{
    return "";
  }
}
function openInstagramProfileSafely(raw){
  const url=normalizedExternalHttpUrl(raw);
  if(!url) return false;
  const username=instagramUsernameFromUrl(url);
  const ua=navigator.userAgent||"";
  const isIOS=/iPad|iPhone|iPod/i.test(ua)
    || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
  const standalone=window.matchMedia?.("(display-mode: standalone)")?.matches
    || navigator.standalone===true;

  // iOS Home Screen + window.open(Instagram) can leave behind the blank
  // Safari controller shown by the user. Prefer Instagram's native scheme
  // from the existing PWA context, and only fall back to the web profile if
  // no app switch happens.
  if(isIOS && standalone && username){
    let switched=false;
    const onVisibility=()=>{
      if(document.hidden) switched=true;
    };
    document.addEventListener("visibilitychange",onVisibility);
    const launcher=document.createElement("a");
    launcher.href="instagram://user?username="+encodeURIComponent(username);
    launcher.setAttribute("aria-hidden","true");
    launcher.tabIndex=-1;
    launcher.style.position="fixed";
    launcher.style.width="1px";
    launcher.style.height="1px";
    launcher.style.opacity="0";
    launcher.style.pointerEvents="none";
    document.body.appendChild(launcher);
    launcher.click();
    setTimeout(()=>launcher.remove(),500);
    setTimeout(()=>{
      document.removeEventListener("visibilitychange",onVisibility);
      if(!switched && !document.hidden) openExternalWebLink(url);
    },900);
    return true;
  }

  return openExternalWebLink(url);
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

  const routeGpsJob=e.target.closest("[data-route-gps-job]");
  if(routeGpsJob){
    const job=state.jobs.find(j=>j.id===routeGpsJob.dataset.routeGpsJob);
    if(job) openGpsRoute([job.service_address]);
    return;
  }

  const bestRoute=e.target.closest("[data-best-route]");
  if(bestRoute){
    openGpsRoute(todaysRouteJobs().map(j=>j.service_address));
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
      if(url) openExternalWebLink(url);
      else openView("settings");
      return;
    }
    const url=String(presenceBtn.dataset.url||"").trim();
    if(url){
      if(presenceBtn.id==="presenceInstagramBtn") openInstagramProfileSafely(url);
      else openExternalWebLink(url);
    }else{
      await openBusinessProfileForm();
    }
    return;
  }

  const create=e.target.closest("[data-create]");
  const action=e.target.closest("[data-action]");
  const edit=e.target.closest("[data-edit]");
  const calendarDay=e.target.closest("[data-calendar-day]");
  const calendarJob=e.target.closest("[data-calendar-job]");
  const calendarClose=e.target.closest("[data-calendar-close]");
  if(calendarClose){
    clearCalendarDayDetails();
    return;
  }
  const calendarMonth=e.target.closest("[data-calendar-month]");
  if(calendarMonth){
    state.calendarMonthOffset=Number(state.calendarMonthOffset||0)+Number(calendarMonth.dataset.calendarMonth||0);
    clearCalendarDayDetails();
    renderJobs();
    return;
  }
  if(calendarDay){
    renderCalendarDayDetails(calendarDay.dataset.calendarDay);
    return;
  }
  if(calendarJob && !e.target.closest("button,a,input,select,textarea")){
    const job=state.jobs.find(j=>j.id===calendarJob.dataset.calendarJob);
    if(job){
      renderCalendarDayDetails(tleCalendarDateKey(job.starts_at),{jobId:job.id});
    }
    return;
  }

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
    setBusy(deleteRecordBtn,true,langPick("Deleting…","Borrando…","Suppression…"));
    try{
      await deleteBusinessRecord(type,id);
    }catch(err){
      showToast(err?.message||langPick("Could not delete","No se pudo borrar","Impossible de supprimer"));
    }finally{
      if(document.body.contains(deleteRecordBtn)) setBusy(deleteRecordBtn,false);
    }
    return;
  }

  const bookingPagePromo=e.target.closest("[data-booking-page-promo]");
  if(bookingPagePromo){
    const businessId=bookingPagePromo.dataset.bookingPagePromo;
    if(!window.confirm("Grant this customer the 2-month Booking Page promo?")) return;
    setBusy(bookingPagePromo,true,"Applying…");
    try{
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

  const bookingPagePromoRevoke=e.target.closest("[data-booking-page-promo-revoke]");
  if(bookingPagePromoRevoke){
    const businessId=bookingPagePromoRevoke.dataset.bookingPagePromoRevoke;
    if(!window.confirm("Revoke the 2-month promo and restore the standard 30-day trial?")) return;
    setBusy(bookingPagePromoRevoke,true,"Revoking…");
    try{
      const {error}=await supabase.rpc("platform_revoke_booking_page_trial_promo",{p_business_id:businessId});
      if(error) throw error;
      await loadPlatformAdmin();
      showToast("2-month promo revoked · standard 30-day trial restored");
    }catch(err){
      showToast(err?.message||"Could not revoke the 2-month promo");
    }finally{
      setBusy(bookingPagePromoRevoke,false);
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
    setBusy(workerTimeStop,true,langPick("Finishing…","Finalizando…","Arrêt…"));
    try{
      const result=await withTimeout(
        supabase.rpc("worker_portal_stop_time",{p_token:token,p_entry_id:workerTimeStop.dataset.workerTimeStop}),
        langPick("Finishing timer","Finalizando temporizador","Arrêt du minuteur"),
        10000
      );
      if(result?.error) throw result.error;
      await refreshWorkerPortal();
      showToast(langPick("Timer finished","Temporizador finalizado","Minuteur arrêté"));
    }catch(err){
      showToast(err?.message||langPick("Could not finish timer","No se pudo finalizar el temporizador","Impossible d’arrêter le minuteur"));
    }finally{
      if(document.body.contains(workerTimeStop)) setBusy(workerTimeStop,false);
    }
    return;
  }

  const finishTimeBtn=e.target.closest("[data-finish-time]");
  if(finishTimeBtn){
    const id=finishTimeBtn.dataset.finishTime;
    setBusy(finishTimeBtn,true,langPick("Finishing…","Finalizando…","Arrêt…"));
    try{
      await finishTimeEntry(id);
      showToast(langPick("Timer finished","Temporizador finalizado","Minuteur arrêté"));
    }catch(err){
      showToast(err?.message||langPick("Could not finish timer","No se pudo finalizar el temporizador","Impossible d’arrêter le minuteur"));
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
      langPick("MILEAGE","MILLAJE","KILOMÉTRAGE"),
      langPick("Log drive","Registrar viaje","Enregistrer le trajet"),
      langPick("Add the distance driven for this assigned job.","Agrega la distancia recorrida para este trabajo asignado.","Ajoutez la distance parcourue pour ce travail attribué.")
    );
    entityForm.innerHTML=`
      <div class="form-grid">
        <label class="full">${workerUnit==="km"
          ? langPick("Kilometers","Kilómetros","Kilomètres")
          : langPick("Miles","Millas","Miles")}
          <input name="distance" type="number" min="0.1" step="0.1" inputmode="decimal" required placeholder="0.0">
        </label>
        <label class="full">${langPick("Note (optional)","Nota (opcional)","Note (facultative)")}
          <input name="notes" maxlength="240" placeholder="${langPick("Example: supply stop","Ej. parada de suministros","Ex. : arrêt fournitures")}">
        </label>
      </div>
      ${formSubmit(langPick("Save mileage","Guardar millaje","Enregistrer"))}`;
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

  const clientInfo=e.target.closest("[data-client-info]");
  if(clientInfo){
    openClientInfo(clientInfo.dataset.clientInfo);
    return;
  }

  const clientQuote=e.target.closest("[data-client-to-quote]");
  if(clientQuote){
    const client=state.clients.find(c=>c.id===clientQuote.dataset.clientToQuote);
    if(!client){ showToast(langPick("Client not found","Cliente no encontrado","Client introuvable")); return; }
    openEntityForm("quote");
    setTimeout(()=>{
      const address=[client.address_line1,client.city,client.state,client.postal_code].filter(Boolean).join(", ");
      [["client_id",client.id],["customer_name",client.name],["customer_email",client.email],["customer_phone",client.phone],["service_address",address]].forEach(([n,v])=>{
        const el=entityForm.querySelector(`[name="${n}"]`);
        if(el&&v) el.value=v;
      });
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
  if(e.target.closest("[data-modal-cancel]")){ closeEntityModal(); return; }

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
$$("[data-edit-app-preferences]").forEach(btn=>btn.addEventListener("click",openAppPreferencesForm));
$$("[data-edit-notification-preferences]").forEach(btn=>btn.addEventListener("click",openNotificationPreferencesForm));
$$("[data-edit-payment-preferences]").forEach(btn=>btn.addEventListener("click",openPaymentPreferencesForm));

const saveCustomerEmailLanguageBtn=$("#saveCustomerEmailLanguageBtn");
if(saveCustomerEmailLanguageBtn) saveCustomerEmailLanguageBtn.addEventListener("click",async()=>{
  if(!state.business || state.business.role!=="owner"){
    showToast(langPick("Owner access required.","Se requiere acceso del dueño.","Accès propriétaire requis."));
    return;
  }
  const select=$("#customerEmailLanguageSelect");
  const language=normalizedCustomerEmailLanguage(select?.value)||"en";
  try{
    saveCustomerEmailLanguageBtn.disabled=true;
    const original=saveCustomerEmailLanguageBtn.textContent;
    saveCustomerEmailLanguageBtn.dataset.originalText=original;
    saveCustomerEmailLanguageBtn.textContent=langPick("Saving…","Guardando…","Enregistrement…");
    const {data,error}=await supabase.from("businesses")
      .update({customer_email_language:language,updated_at:new Date().toISOString()})
      .eq("id",state.business.id)
      .select("customer_email_language")
      .single();
    if(error) throw error;
    state.business.customer_email_language=data?.customer_email_language||language;
    renderSettings();
    showToast(langPick("Client email language saved","Idioma de emails guardado","Langue des e-mails enregistrée"));
  }catch(err){
    showToast(err.message||langPick("Could not save language","No se pudo guardar el idioma","Impossible d’enregistrer la langue"));
  }finally{
    saveCustomerEmailLanguageBtn.disabled=false;
    saveCustomerEmailLanguageBtn.textContent=saveCustomerEmailLanguageBtn.dataset.originalText||langPick("Save language","Guardar idioma","Enregistrer");
  }
});

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

function closeEntityModal(){
  if(!modal) return;
  modal.hidden=true;
  state.modalType=null;
  state.modalId=null;
}
document.addEventListener("click",e=>{
  const closer=e.target.closest?.("#modalClose,[data-modal-cancel]");
  if(!closer || !modal || modal.hidden) return;
  e.preventDefault();
  e.stopPropagation();
  closeEntityModal();
},true);
$("#modalBackdrop")?.addEventListener("click",e=>{
  if(e.target?.id==="modalBackdrop") closeEntityModal();
});

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
  const text=langPick("Keep bookings, clients, jobs, quotes and invoices organized in one place.","Organiza reservas, clientes, trabajos, cotizaciones y facturas en un solo lugar.","Gardez réservations, clients, travaux, devis et factures organisés au même endroit.");

  if(navigator.share){
    try{
      await navigator.share({title,text,url});
      trackGoogleEvent("share_app",{share_method:"native",share_location:"footer"});
      showToast(langPick("App shared","App compartida","Application partagée"));
      return;
    }catch(err){
      if(err?.name==="AbortError") return;
    }
  }

  try{
    await navigator.clipboard.writeText(url);
    trackGoogleEvent("share_app",{share_method:"copy",share_location:"footer"});
    showToast(langPick("App link copied","Link de la app copiado","Lien de l’application copié"));
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
  // Refresh the shell without destroying the installed app state.
  // Keep the Supabase session backup intact so iOS refresh does not ask
  // a returning owner to sign in again.
  if(state.session){
    saveOwnerSessionBackup(state.session);
    markOwnerActivity();
  }
  try{
    if("serviceWorker" in navigator){
      const reg=await navigator.serviceWorker.getRegistration();
      if(reg) await reg.update().catch(()=>{});
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
  if(label) label.textContent=langPick("Refreshing…","Actualizando…","Actualisation…");

  try{
    const latest=await getLatestAppShellVersion();
    const shellChanged=!!(
      latest && (
        (latest.app && latest.app!==APP_VERSION) ||
        (latest.css && latest.css!==currentCssVersion())
      )
    );

    if(shellChanged){
      showToast(langPick("App update ready. Loading the newest version without signing you out.","Actualización lista. Cargando la versión más reciente sin cerrar tu sesión.","Mise à jour prête. Chargement de la version la plus récente sans déconnexion."));
      await hardRefreshInstalledApp(latest?.app||latest?.css||String(Date.now()));
      return;
    }

    if(state.business?.id){
      try{
        const {data:companyProfile,error:companyProfileError}=await supabase
          .from("businesses")
          .select("name,email,phone,timezone,default_language,customer_email_language,service_area,default_travel_buffer_minutes,instagram_url,facebook_url,trial_started_at,trial_ends_at,trial_days,trial_promotion,subscription_status,trial_welcome_sent_at,country_code,locale_code,currency_code,distance_unit,temperature_unit,payment_methods")
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
      showToast(langPick("New inquiry","Nuevo inquiry","Nouvelle demande")+(summary?" · "+summary:""));
    }else{
      showToast(langPick("Everything is up to date","Todo actualizado","Tout est à jour"));
    }
  }catch(err){
    console.warn("[TLE] manual refresh",err);
    showToast(langPick("Could not refresh. Try again.","No se pudo actualizar. Intenta otra vez.","Impossible d’actualiser. Réessayez."));
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

    // Never replace the PWA's own document with weather://. Doing that leaves
    // iOS with a blank/stale webview when the user comes back from Weather.
    const launcher=document.createElement("a");
    launcher.href="weather://";
    launcher.target="_blank";
    launcher.rel="noopener noreferrer";
    launcher.setAttribute("aria-hidden","true");
    launcher.tabIndex=-1;
    launcher.style.position="fixed";
    launcher.style.width="1px";
    launcher.style.height="1px";
    launcher.style.opacity="0";
    launcher.style.pointerEvents="none";
    document.body.appendChild(launcher);
    launcher.click();
    setTimeout(()=>launcher.remove(),1200);

    setTimeout(()=>{
      if(!switched && !document.hidden){
        window.open(fallback,"_blank","noopener");
      }
    },1000);
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
$("#languageBtn").addEventListener("click",()=>{
  window.TLE_I18N?.toggle();
  setTimeout(()=>{
    const code=$("#languageBtn .top-icon")?.textContent||String(appLanguage()||"en").toUpperCase();
    const sidebarCode=$("#sidebarLanguageCode");
    if(sidebarCode) sidebarCode.textContent=code;
  },0);
});
$("#sidebarLanguageBtn")?.addEventListener("click",()=>{
  $("#languageBtn")?.click();
  setTimeout(()=>{
    const code=$("#languageBtn .top-icon")?.textContent||String(appLanguage()||"en").toUpperCase();
    const sidebarCode=$("#sidebarLanguageCode");
    if(sidebarCode) sidebarCode.textContent=code;
  },0);
});
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

window.TLE_FOLLOWUPS_BRIDGE={
  getState:()=>state,
  supabase,
  openView,
  showToast,
  langPick,
  escapeHtml,
  appLocale,
  openClientInfo
};

window.__tleAppReady=true;
// Keep the static auth shell stable until initialize() decides whether this is
// a returning session, a remembered username, or a first visit.
// Route every authenticated boot through the same promise so iPhone/PWA
// startup and Supabase SIGNED_IN cannot initialize the app twice.
enterAuthenticatedApp().catch(err=>{
  console.error("[TLE] initialize failed",err);
  showAuth();
  setAuthStatus(err?.message||"The app could not finish loading. Please refresh.","error");
});
})();

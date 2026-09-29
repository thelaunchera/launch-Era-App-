import fs from "node:fs";
import { JSDOM } from "jsdom";

const html=fs.readFileSync("index.html","utf8");
const app=fs.readFileSync("app.js","utf8");
const publicJs=fs.readFileSync("public.js","utf8");
const followups=fs.readFileSync("followups.js","utf8");
const i18n=fs.readFileSync("i18n.js","utf8");
const serviceWorker=fs.readFileSync("service-worker.js","utf8");
const manifest=fs.readFileSync("manifest.webmanifest","utf8");
const styles=fs.readFileSync("styles.css","utf8");

const dom=new JSDOM(html,{
  // Run the auth smoke test on the canonical production origin. The app
  // intentionally redirects legacy GitHub Pages traffic before auth UI setup.
  url:"https://app.thelaunchera.com/",
  runScripts:"outside-only",
  pretendToBeVisual:true
});
const {window}=dom;

window.scrollTo=()=>{};
window.confirm=()=>true;
window.prompt=()=>null;
window.navigator.clipboard={writeText:async()=>{}};

let signInCalls=0;
let signUpCalls=0;
let currentSession=null;
const auth={
  getSession:async()=>({data:{session:currentSession},error:null}),
  refreshSession:async()=>({data:{session:currentSession},error:null}),
  onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
  signInWithOtp:async()=>({data:{},error:null}),
  signInWithPassword:async()=>{signInCalls++; return {data:{session:null},error:{message:"Invalid login credentials"}};},
  signUp:async()=>{signUpCalls++; return {data:{session:null},error:null};},
  resetPasswordForEmail:async()=>({data:{},error:null}),
  updateUser:async()=>({data:{},error:null}),
  signOut:async()=>({error:null})
};
window.supabase={createClient:()=>({auth})};

window.eval(app);
await new Promise(r=>setTimeout(r,20));

const $=s=>window.document.querySelector(s);
const click=s=>$(s).dispatchEvent(new window.MouseEvent("click",{bubbles:true,cancelable:true}));

if($("#authWelcome")?.hidden) throw new Error("Initial welcome screen is hidden");
if(!$("#authPanel")?.hidden) throw new Error("Auth form should be hidden before welcome CTA");
if($("#authWelcomeStart")?.textContent!=="Get 30 days free") throw new Error("Welcome CTA label is wrong");
if($("#trialExpiryTitle")?.textContent==="Your free access ends in 3 days") throw new Error("Static 3-day trial warning leaked into HTML");
if(!$("#trialExpiryClose")) throw new Error("Trial warning dismiss button is missing");

click("#authWelcomeStart");
await new Promise(r=>setTimeout(r,240));
if($("#authTitle")?.textContent!=="Create account") throw new Error("Welcome CTA did not open create-account screen");
if($("#emailField")?.hidden) throw new Error("Create account email field is hidden");
if($("#passwordField")?.hidden) throw new Error("Create account password field is hidden");
if($("#authSubmit")?.hidden) throw new Error("Create account submit is hidden");
if($("#authSubmit")?.textContent!=="Create account") throw new Error("Create account submit label is wrong");

click("#authSwitch");
await new Promise(r=>setTimeout(r,240));
if($("#authTitle")?.textContent!=="Sign in") throw new Error("Existing-user sign-in switch failed");
if($("#passwordField")?.hidden) throw new Error("Sign in password field is hidden");
if($("#authSubmit")?.hidden) throw new Error("Sign in submit is hidden");
if($("#authSubmit")?.textContent!=="Sign in") throw new Error("Sign in submit label is wrong");
if($("#rememberedAdminBtn") || $("#ownerCodePanel") || $("#ownerCodeForm")) throw new Error("Legacy access-code UI is still present");
if(app.includes("request-owner-access-code") || app.includes("verify-owner-access-code")) throw new Error("Legacy OTP endpoints are still referenced by the app");

$("#authEmail").value="nobody@example.invalid";
$("#authPassword").value="NotARealPassword123!";
$("#authForm").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));
await new Promise(r=>setTimeout(r,20));
if(signInCalls!==1) throw new Error("Sign in submit handler did not call auth");
console.log("SIGNIN_SUBMIT_OK");

click("#authSwitch");
if($("#authTitle")?.textContent!=="Create account") throw new Error("Return to create-account failed");
$("#authEmail").value="new@example.invalid";
$("#authPassword").value="CreateAccount123!";
$("#authForm").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));
await new Promise(r=>setTimeout(r,20));
if(signUpCalls!==1) throw new Error("Create account submit handler did not call auth");
console.log("SIGNUP_SUBMIT_OK");


if(!app.includes('name="from_location"') || !app.includes('name="to_location"') || !app.includes("data-mileage-job")){
  throw new Error("Mileage regression: separate From/To workflow is missing");
}
if(app.includes("From → To / note")){
  throw new Error("Mileage regression: legacy combined route field returned");
}
if(!app.includes("tle_new_signup:true") || !app.includes("hasAccountSignupWelcomePending")){
  throw new Error("Onboarding regression: account-level signup welcome marker is missing");
}
if(!app.includes('from("app_notification_reads")') || !app.includes('from("app_notification_state")')){
  throw new Error("Notification regression: persistent read state is missing");
}
if(!app.includes("const OWNER_IDLE_MS = 12 * 60 * 60 * 1000;") || !app.includes("Date.now()-lastActivity>=OWNER_IDLE_MS") || !app.includes("await expireOwnerSession();")){
  throw new Error("Session regression: 12-hour owner inactivity lock is not enforced");
}
if(!app.includes("isPermanentSessionRestoreError") || !app.includes("invalid refresh token") || !app.includes("clearOwnerSessionBackup();")){
  throw new Error("Session regression: permanently invalid Supabase refresh tokens must still be discarded");
}
if(!app.includes("persistSession:true") || !app.includes("autoRefreshToken:true") || !app.includes("storage:window.localStorage")){
  throw new Error("Session regression: stable Supabase localStorage persistence is missing");
}
if(app.includes("resilientAuthStorage") || app.includes("indexedDB.open(TLE_AUTH_DB")){
  throw new Error("Session regression: experimental IndexedDB auth fallback returned");
}
if(!app.includes("restoreWorkspaceView();") || !app.includes("saveWorkspaceView(id)")){
  throw new Error("Workspace regression: active page restore is missing");
}
if(!html.includes('data-view="followups"') || !html.includes('data-page="followups"') || !html.includes('followups.js?v=')){
  throw new Error("Follow-ups regression: isolated workspace shell is missing");
}
if(!app.includes("window.TLE_FOLLOWUPS_BRIDGE") || app.includes('supabase.rpc("refresh_follow_up_tasks"')){
  throw new Error("Follow-ups regression: module bridge is missing or follow-up backend logic leaked into app.js");
}
if(
  !followups.includes('get_follow_up_candidates') ||
  !followups.includes('send_follow_up_now') ||
  !followups.includes('update_follow_up_state') ||
  !followups.includes('follow_up_settings') ||
  !followups.includes('data-followup-mode')
){
  throw new Error("Follow-ups regression: queue, send, state, or preference controls are missing");
}
const billingCollectionLines=app.split("\n").filter(line=>line.includes("[data-account-billing]")&&line.includes(".forEach"));
if(billingCollectionLines.length<2 || billingCollectionLines.some(line=>!line.includes('$$("[data-account-billing]").forEach'))){
  throw new Error("App boot regression: account billing collections must use the querySelectorAll helper");
}
// stable-92: inactivity is checked before activity can refresh the owner timestamp.
if(!app.includes('if(ownerIdleExpired()){') || !app.includes('expireOwnerSession().catch(err=>console.warn("[TLE] idle lock",err))')){
  throw new Error("Session regression: first activity after 12 hours must lock before refreshing activity");
}
if(!app.includes("dashboardWeatherContext") || !app.includes("weatherPlaceLabel")){
  throw new Error("Dashboard regression: contextual service-area weather is missing");
}
if(!app.includes("window.__tleShowSignupWelcome=") || !app.includes("hasLocalSignupWelcomePending() ||") || !app.includes("hasAccountSignupWelcomePending()")){
  throw new Error("Business setup welcome regression: new signup welcome is not preserved through workspace creation");
}
if(!app.includes("resolveBusinessLocale(signupServiceArea)") || !app.includes("timezone: globalSetup.timezone") || !app.includes("country_code: globalSetup.country_code") || !app.includes("currency_code: globalSetup.currency_code")){
  throw new Error("Global setup regression: signup must derive timezone, country and currency from service area");
}
if(!publicJs.includes("dateInBusinessZone") || !publicJs.includes("business?.timezone")){
  throw new Error("Booking regression: public booking date bounds must use business timezone");
}
if(!app.includes("businessLocalDateTimeToIso") || !app.includes("zonedDateTimeParts") || !app.includes("starts_at:startsIso")){
  throw new Error("Manual job timezone regression: jobs must save and render in business timezone");
}
if(!app.includes("admin_team_message_threads") || !app.includes("worker_portal_messages") || !app.includes("worker_portal_send_message")){
  throw new Error("Team messaging regression: admin/worker messaging hooks are missing");
}
if(!$("#teamMessageCenter") || !$("#workerMessageThread") || !$("#workerMessageForm")){
  throw new Error("Team messaging regression: message center UI is missing");
}
if(!$("#workerGuestPill") || !$("#workerAccessLabel")){
  throw new Error("Worker access regression: guest employee access labels are missing");
}
if(!app.includes('data-finish-time="') || !app.includes('e.target.closest("[data-finish-time]")') || !app.includes("await finishTimeEntry(id)")){
  throw new Error("Time tracking regression: Finish timer is rendered without a working handler");
}
if(!app.includes('data-worker-time-stop="') || !app.includes('e.target.closest("[data-worker-time-stop]")') || !app.includes("worker_portal_stop_time")){
  throw new Error("Worker time tracking regression: guest Finish timer handler is missing");
}
if(!app.includes('select("id,clocked_out_at,minutes_worked")') || !app.includes("await loadCoreData();")){
  throw new Error("Time tracking regression: Finish timer must verify the persisted stop and refresh workspace data");
}
const workerShell=$("#workerShell");
if(!workerShell?.querySelector("[data-language-toggle]")){
  throw new Error("Worker localization regression: Guest Employee Access is missing its language selector");
}
if(!$("#workerGuestPill")?.textContent.includes("GUEST EMPLOYEE ACCESS")){
  throw new Error("Worker access regression: guest access identity is not clear");
}
const spanishOnlyBranches=(app.match(/appIsSpanish\(\)/g)||[]).length;
if(spanishOnlyBranches!==1){
  throw new Error("Localization regression: dynamic UI reintroduced EN/ES-only branches");
}
if(!app.includes("function langPick(en,es,_pt,fr)") || !i18n.includes('const SUPPORTED=["en","es","fr","ht"]')){
  throw new Error("Localization regression: EN/ES/FR/HT runtime support is incomplete");
}
for(const phrase of ["Today’s jobs","Current client records","Still to collect","Waiting for review","Your scheduled jobs will appear here."]){
  if(!i18n.includes(JSON.stringify(phrase))){
    throw new Error("Localization regression: dashboard phrase missing from dictionaries: "+phrase);
  }
}
if(
  !publicJs.includes('tt(mode==="quote"?"REQUEST A QUOTE":"BOOK A CLEANING")') ||
  !publicJs.includes('tt("Could not submit invoice.")') ||
  !publicJs.includes('tt("Could not submit quote.")')
){
  throw new Error("Public localization regression: booking/quote/invoice states bypass translation");
}
const appVersion=(app.match(/const APP_VERSION = "([^"]+)"/)||[])[1];
const releaseVersionPattern=/20260928-(?:unified|stable)-\\d+/g;
const releaseVersions=[
  appVersion,
  ...[...html.matchAll(releaseVersionPattern)].map(m=>m[0]),
  ...[...serviceWorker.matchAll(releaseVersionPattern)].map(m=>m[0]),
  ...[...manifest.matchAll(releaseVersionPattern)].map(m=>m[0])
].filter(Boolean);
if(!appVersion || releaseVersions.some(v=>v!==appVersion)){
  throw new Error("Release version mismatch across app shell/runtime/service worker");
}
if(!serviceWorker.includes('sensitiveParams=["token","session_id","invite","worker","billing","slug","public"]')){
  throw new Error("PWA regression: sensitive navigation URLs can be cached");
}
if(!publicJs.includes('functions/v1/track-app-visit')){
  throw new Error("Analytics regression: public pages must use hardened edge tracking");
}
if(!app.includes('["invoices","jobs","quotes","booking_requests","leads","payments","customer_disputes","job_time_entries","email_delivery_issues"]')){
  throw new Error("Realtime regression: operational table subscriptions changed unexpectedly");
}
if(!app.includes('supabase.from("email_delivery_issues").select("*")') || !app.includes('"email-delivery"')){
  throw new Error("Email alert regression: delivery issues must load into the notification system");
}
if(app.includes('["invoices","jobs","quotes","booking_requests","leads","payments","customer_disputes","team_messages","job_time_entries"]')){
  throw new Error("Realtime regression: team_messages must not use a business_id Postgres Changes filter");
}
if(!app.includes("realtime fallback refresh") || !app.includes("CHANNEL_ERROR") || !app.includes("TIMED_OUT")){
  throw new Error("Realtime regression: polling fallback is missing");
}
if(!$("#rememberUsername") || !app.includes("REMEMBER_USERNAME_KEY") || !app.includes("persistRememberUsername")){
  throw new Error("Auth regression: remember-username flow is missing");
}
if(!$("#sessionSplash") || !html.includes("./app-icon.svg") || !app.includes("function dismissSessionSplash()")){
  throw new Error("Session splash regression: returning users can flash the welcome screen before auth restore");
}
if(!app.includes("function showApp(){\n  dismissSessionSplash();") || !app.includes("function showAuthWelcome(){\n  dismissSessionSplash();")){
  throw new Error("Session splash regression: splash must resolve only after auth/session routing decides the next screen");
}
if(!html.includes('host==="app.thelaunchera.com"&&!automation') || !html.includes("navigator.webdriver")){
  throw new Error("Analytics regression: app must block automated/non-production GA4 traffic");
}
if(!app.includes("function trackAuthLandingOnHumanInteraction()") ||
   !app.includes('trackVisit("/login").catch(()=>{});') ||
   !app.includes("HeadlessChrome|PhantomJS|Google-InspectionTool|Lighthouse|PageSpeed")){
  throw new Error("Analytics regression: human login tracking or automated traffic filtering is missing");
}
if(!publicJs.includes('if(quoteTimeWrap) quoteTimeWrap.hidden=true;') ||
   !publicJs.includes('if(slotsWrap) slotsWrap.hidden=false;') ||
   !publicJs.includes('if(!selectedSlot) throw new Error(tt("Choose one of the available times."));') ||
   !publicJs.includes('p_preferred_time:slotLocalTimeValue(selectedSlot)') ||
   publicJs.includes('if(mode==="quote" || !slotsBox || !slotInput) return;')){
  throw new Error("Quote availability regression: quote requests must use real available slots and reject free-form times");
}
if(!app.includes('launcher.href="weather://"') || app.includes('window.location.href="weather://"')){
  throw new Error("iOS regression: Weather must not replace the PWA document");
}
if(html.includes('document.addEventListener("visibilitychange",function(){\n              if(document.visibilityState==="visible") reg.update()')){
  throw new Error("PWA regression: service worker update must not reload on iOS resume");
}
if(!app.includes('data-client-to-quote="') || !app.includes('const clientQuote=e.target.closest("[data-client-to-quote]")') || !app.includes('client_id:fd.get("client_id")||current?.client_id||null')){
  throw new Error("Client quote regression: saved clients must be able to start a linked quote inside the app");
}
if(!styles.includes("tleHeroCtaFloat") || !styles.includes(".hero-card.message-calm #todayHeroAction") || !styles.includes("tleNotificationRing")){
  throw new Error("Dashboard polish regression: compact adaptive CTA or notification motion is missing");
}
if(!app.includes('button.dataset.unreadCount=String(unread)') || !app.includes('button.classList.add("notification-arrived")')){
  throw new Error("Notification regression: new unread activity must trigger bell motion");
}
// Data-safety guard for the stable v81 auth baseline: startup/session logic
// must never delete operational business records.
const authWindow=app.slice(app.indexOf("async function initialize()"),app.indexOf("async function withTimeout"));
for(const destructive of ['from("clients").delete()','from("jobs").delete()','from("quotes").delete()','from("invoices").delete()','from("leads").delete()','from("businesses").delete()']){
  if(authWindow.includes(destructive)){
    throw new Error("Auth/data regression: destructive operational delete found in auth/session initialization: "+destructive);
  }
}
console.log("REGRESSION_GUARDS_OK");

console.log("LOGIN_SMOKE_OK");

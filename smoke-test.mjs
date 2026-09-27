import fs from "node:fs";
import { JSDOM } from "jsdom";

const html=fs.readFileSync("index.html","utf8");
const app=fs.readFileSync("app.js","utf8");
const publicJs=fs.readFileSync("public.js","utf8");
const i18n=fs.readFileSync("i18n.js","utf8");
const serviceWorker=fs.readFileSync("service-worker.js","utf8");
const manifest=fs.readFileSync("manifest.webmanifest","utf8");

const dom=new JSDOM(html,{
  url:"https://thelaunchera.github.io/launch-Era-App-/",
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
if($("#authWelcomeStart")?.textContent!=="Start 30 days free") throw new Error("Welcome CTA label is wrong");
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
if(!app.includes("Date.now()-savedAt>OWNER_IDLE_MS") || !app.includes("clearOwnerSessionBackup();")){
  throw new Error("Session regression: stale iOS backup protection is missing");
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
if(!app.includes("function langPick(en,es,pt,fr)") || !i18n.includes('const SUPPORTED=["en","es","pt","fr"]')){
  throw new Error("Localization regression: EN/ES/PT/FR runtime support is incomplete");
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
const releaseVersions=[
  appVersion,
  ...[...html.matchAll(/20260927-unified-\\d+/g)].map(m=>m[0]),
  ...[...serviceWorker.matchAll(/20260927-unified-\\d+/g)].map(m=>m[0]),
  ...[...manifest.matchAll(/20260927-unified-\\d+/g)].map(m=>m[0])
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
console.log("REGRESSION_GUARDS_OK");

console.log("LOGIN_SMOKE_OK");

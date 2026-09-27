import fs from "node:fs";
import { JSDOM } from "jsdom";

const html=fs.readFileSync("index.html","utf8");
const app=fs.readFileSync("app.js","utf8");

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

if($("#authTitle")?.textContent!=="Create account") throw new Error("Initial create-account screen did not initialize");
if($("#emailField")?.hidden) throw new Error("Create account email field is hidden");
if($("#passwordField")?.hidden) throw new Error("Create account password field is hidden");
if($("#authSubmit")?.hidden) throw new Error("Create account submit is hidden");
if($("#authSubmit")?.textContent!=="Create account") throw new Error("Create account submit label is wrong");
if($("#trialExpiryTitle")?.textContent==="Your free access ends in 3 days") throw new Error("Static 3-day trial warning leaked into HTML");
if(!$("#trialExpiryClose")) throw new Error("Trial warning dismiss button is missing");

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
console.log("REGRESSION_GUARDS_OK");

console.log("LOGIN_SMOKE_OK");

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

const auth={
  getSession:async()=>({data:{session:null},error:null}),
  onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
  signInWithOtp:async()=>({data:{},error:null}),
  signInWithPassword:async()=>({data:{session:null},error:null}),
  signUp:async()=>({data:{session:null},error:null}),
  resetPasswordForEmail:async()=>({data:{},error:null}),
  updateUser:async()=>({data:{},error:null}),
  signOut:async()=>({error:null})
};
window.supabase={createClient:()=>({auth})};

window.eval(app);
await new Promise(r=>setTimeout(r,20));

const $=s=>window.document.querySelector(s);
const click=s=>$(s).dispatchEvent(new window.MouseEvent("click",{bubbles:true,cancelable:true}));

if($("#authTitle")?.textContent!=="Sign in") throw new Error("Initial sign-in screen did not initialize");

click("#authSwitch");
if($("#authTitle")?.textContent!=="Create account") throw new Error("Create account button is not wired");
if($("#passwordField")?.hidden) throw new Error("Create account did not show password field");

click("#authSwitch");
if($("#authTitle")?.textContent!=="Sign in") throw new Error("Return to sign-in failed");

click("#usePasswordBtn");
if($("#passwordField")?.hidden) throw new Error("Use password instead did not reveal password");
if($("#authSubmit")?.hidden) throw new Error("Password sign-in submit stayed hidden");

window.document.querySelector("#authEmail").value="";
window.document.querySelector("#emailLinkBtn").hidden=false;
click("#emailLinkBtn");
await new Promise(r=>setTimeout(r,10));
if(!$("#toast")?.textContent.includes("Enter your email")) throw new Error("Continue with email handler is not wired");

console.log("LOGIN_SMOKE_OK");

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

if($("#authSubmit")?.hidden) throw new Error("Create account submit is hidden");
if($("#authSubmit")?.textContent!=="Create account") throw new Error("Create account submit label is wrong");

click("#authSwitch");
if($("#authTitle")?.textContent!=="Sign in") throw new Error("Return to sign-in failed");
if($("#passwordField")?.hidden) throw new Error("Sign in password field is hidden");
if($("#authSubmit")?.hidden) throw new Error("Sign in submit is hidden");
if($("#authSubmit")?.textContent!=="Sign in") throw new Error("Sign in submit label is wrong");
if(!$("#rememberedAdminBtn")) throw new Error("Admin passwordless button is missing");

console.log("LOGIN_SMOKE_OK");

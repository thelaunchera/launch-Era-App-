import fs from "node:fs";

const read = file => fs.readFileSync(file,"utf8");
const app = read("app.js");
const boot = read("boot.js");
const html = read("index.html");
const sw = read("service-worker.js");
const i18n = read("i18n.js");
const i18nCompletion = read("i18n-completion.js");
const i18nAll = i18n+"\n"+i18nCompletion;
const publicJs = read("public.js");
const onboardingCopy = read("onboarding-copy.js");
const followups = read("followups.js");
const manifest = JSON.parse(read("manifest.webmanifest"));

const fail = message => {
  console.error("REPO_HEALTH_FAIL · "+message);
  process.exitCode = 1;
};
const pass = message => console.log("REPO_HEALTH_OK · "+message);
const warn = message => console.warn("REPO_HEALTH_WARN · "+message);
function hasLegacyFourArgLangPick(source){
  let pos=0;
  while((pos=source.indexOf("langPick(",pos))>=0){
    let i=pos+"langPick(".length;
    let paren=1, bracket=0, brace=0, quote=null, escaped=false, topLevelCommas=0;
    for(;i<source.length;i++){
      const ch=source[i];
      if(quote){
        if(escaped){ escaped=false; continue; }
        if(ch==="\\"){ escaped=true; continue; }
        if(ch===quote){ quote=null; }
        continue;
      }
      if(ch==="'" || ch==='"' || ch==="\`"){ quote=ch; continue; }
      if(ch==="(") paren++;
      else if(ch===")"){
        paren--;
        if(paren===0) break;
      }else if(ch==="[") bracket++;
      else if(ch==="]") bracket--;
      else if(ch==="{") brace++;
      else if(ch==="}") brace--;
      else if(ch==="," && paren===1 && bracket===0 && brace===0) topLevelCommas++;
    }
    if(paren!==0) return true;
    if(topLevelCommas>=3) return true;
    pos=i+1;
  }
  return false;
}


if(!hasLegacyFourArgLangPick('langPick("A", flag ? "B" : "C", flag ? "P" : "Q", "D")')){
  fail("four-argument language guard does not handle expression arguments");
}else{
  pass("four-argument language guard handles expression arguments");
}

const appVersion=(app.match(/const APP_VERSION = "([^"]+)"/)||[])[1];
const shellVersion=(boot.match(/window.__tleShellVersion="([^"]+)"/)||[])[1];
const swVersion=(sw.match(/CACHE_NAME="tle-cleaning-app-([^"]+)"/)||[])[1];
const htmlVersions=[...html.matchAll(/\?v=(202609\d{2}-[A-Za-z0-9_-]+)/g)].map(m=>m[1]);
const swVersions=[...sw.matchAll(/\?v=(202609\d{2}-[A-Za-z0-9_-]+)/g)].map(m=>m[1]);
const versions=[appVersion,shellVersion,swVersion,...htmlVersions,...swVersions].filter(Boolean);
if(!appVersion || !shellVersion || !swVersion || versions.some(v=>v!==appVersion)){
  fail("runtime, shell, service worker, or asset versions are out of sync");
}else{
  pass("release versions are synchronized at "+appVersion);
}

if(manifest.start_url!=="./") fail("manifest start_url must remain version-agnostic './'");
else pass("manifest start_url is version-agnostic");


const expectedStyleOrder=[
  "styles/boot.css",
  "styles.css",
  "styles/workspace-components.css",
  "styles/workspace-experience.css",
  "styles/workspace-operations.css",
  "styles/release-overrides.css",
  "styles/release-mobile.css",
  "styles/release-latest.css",
  "styles/responsive-shell.css",
  "styles/customer-documents.css"
];
let previousStyleIndex=-1;
for(const file of expectedStyleOrder){
  const currentIndex=html.indexOf("./"+file+"?v="+appVersion);
  if(currentIndex<0){
    fail("missing versioned stylesheet in app shell: "+file);
    continue;
  }
  if(currentIndex<=previousStyleIndex) fail("stylesheet cascade order changed around "+file);
  previousStyleIndex=currentIndex;
  if(!sw.includes("./"+file+"?v="+appVersion)) fail("service worker core is missing stylesheet: "+file);
}
if(!process.exitCode) pass("stylesheet module order and service-worker cache list are synchronized");
if(!html.includes("./boot.js?v="+appVersion)) fail("boot.js is missing from the versioned app shell");
if(!sw.includes("./boot.js?v="+appVersion)) fail("service worker core is missing boot.js");
if(!html.includes("./onboarding-copy.js?v="+appVersion)) fail("onboarding-copy.js is missing from the versioned app shell");
if(!sw.includes("./onboarding-copy.js?v="+appVersion)) fail("service worker core is missing onboarding-copy.js");


const retiredArtifacts=["demo.html","admin-reset.html","docs/PRODUCT_BLUEPRINT.md"];
for(const file of retiredArtifacts){
  if(fs.existsSync(file)) fail("retired repository artifact returned: "+file);
}
if(!retiredArtifacts.some(file=>fs.existsSync(file))){
  pass("retired demo/recovery/duplicate blueprint artifacts are absent");
}

if(/tle_admin_emails|tle_last_admin_email|params\.get\(["']admin["']\)/.test(html)){
  fail("legacy client-side admin bootstrap must not exist in public index.html");
}else{
  pass("public shell contains no client-side admin identity bootstrap");
}

if(/PRIMARY_PLATFORM_ADMIN_EMAIL|LEGACY_PLATFORM_ADMIN_EMAIL|isPrimaryPlatformAdminAccount/.test(app)){
  fail("platform admin identity shortcuts must not be embedded in public app.js");
}else{
  pass("platform admin identity is delegated to backend authorization");
}

if(!i18n.includes('const SUPPORTED=["en","es","fr","ht"]')){
  fail("active language set must be EN/ES/FR/HT");
}else{
  pass("active language set is EN/ES/FR/HT");
}

if(/data-language-choice="pt"/.test(i18nAll) || /data-language-choice="pt"/.test(publicJs)){
  fail("Portuguese is still exposed as an active runtime language choice");
}

if(/extra\.pt|staticCorrections\.pt|uiCorrections\.pt|\bpt\s*:\s*\{|Português|Portuguese/.test(i18n)){
  fail("inactive Portuguese translation code remains in i18n runtime modules");
}else{
  pass("inactive Portuguese translation payload is absent from i18n runtime modules");
}

if(/function langPick\(en,es,_pt,fr\)/.test(app)){
  fail("legacy Portuguese langPick argument returned");
}else if(!app.includes("function langPick(en,es,fr)")){
  fail("langPick must expose EN/ES/FR with Haitian Creole resolved through i18n");
}else{
  pass("dynamic language helper uses the active language signature");
}

if(/\bpt\s*:/.test(app) || /Português|Portuguese/.test(app) || /\bpt\s*:/.test(onboardingCopy) || /Português|Portuguese/.test(onboardingCopy)){
  fail("inactive Portuguese payload remains in app.js or onboarding-copy.js");
}else{
  pass("inactive Portuguese payload is absent from app and onboarding copy");
}

const followupPortuguese=/\bpt\s*:|Português|Portuguese|Orçamento|Orçamentos|Fatura|Faturas|Após a limpeza|Nova reserva|Enviar agora|Abrir origem|MENSAGEM PERSONALIZADA|Escreva o e-mail|Idioma do cliente|Assunto \(opcional\)|Você pode usar|Salvar mensagem|Usar padrão|Atrasado|Vence agora|Para amanhã|Lembrar-me|Precisa de acompanhamento|Adiar 2 dias|Concluído|Editar mensagem|Mensagem personalizada|Usando a mensagem padrão/;
if(followupPortuguese.test(followups) || hasLegacyFourArgLangPick(followups)){
  fail("legacy Portuguese or four-language follow-up copy remains in followups.js");
}else{
  pass("follow-up UI contains only the active EN/ES/FR language arguments; HT resolves through i18n");
}

if(
  !i18n.includes('const savedLanguage=String(localStorage.getItem(STORAGE_KEY)||"").trim().toLowerCase();') ||
  !i18n.includes('if(savedLanguage && !SUPPORTED.includes(savedLanguage)){') ||
  !i18n.includes('localStorage.removeItem(STORAGE_KEY);')
){
  fail("legacy saved language values are not normalized before runtime translation");
}else{
  pass("unsupported saved language values are normalized safely");
}

const sensitiveParams='sensitiveParams=["token","session_id","invite","worker","billing","slug","public"]';
if(!sw.includes(sensitiveParams)) fail("service worker sensitive URL cache guard is missing");
else pass("service worker sensitive URL cache guard is present");

const limits={
  "app.js":525000,
  "onboarding-copy.js":18000,
  "boot.js":6000,
  "styles/boot.css":5000,
  "styles.css":80000,
  "styles/workspace-components.css":65000,
  "styles/workspace-experience.css":110000,
  "styles/workspace-operations.css":45000,
  "styles/release-overrides.css":50000,
  "styles/release-mobile.css":45000,
  "styles/release-latest.css":25000,
  "styles/responsive-shell.css":12000,
  "styles/customer-documents.css":12000,
  "i18n.js":190000,
  "i18n-completion.js":220000,
  "index.html":100000,
  "public.js":65000
};
for(const [file,limit] of Object.entries(limits)){
  const size=fs.statSync(file).size;
  if(size>limit){
    fail(file+" grew beyond guardrail "+limit+" bytes (current "+size+")");
  }else{
    pass(file+" size "+size+" / "+limit);
    if(size>=limit*0.85) warn(file+" is above 85% of its size guardrail; refactor before adding more code");
  }
}

const selectorModules={
  "styles.css":{
    caps:{".topbar":20,"#menuToggle":5,".mobile-record-card":5},
    source:read("styles.css")
  },
  "styles/workspace-components.css":{
    caps:{".topbar":3,"#menuToggle":3,".mobile-record-card":50},
    source:read("styles/workspace-components.css")
  },
  "styles/workspace-experience.css":{
    caps:{".topbar":6,"#menuToggle":6,".mobile-record-card":8},
    source:read("styles/workspace-experience.css")
  },
  "styles/workspace-operations.css":{
    caps:{".topbar":3,"#menuToggle":3,".mobile-record-card":8},
    source:read("styles/workspace-operations.css")
  },
  "styles/release-overrides.css":{
    caps:{".topbar":3,"#menuToggle":3,".mobile-record-card":24},
    source:read("styles/release-overrides.css")
  },
  "styles/release-mobile.css":{
    caps:{".topbar":22,"#menuToggle":6,".mobile-record-card":5},
    source:read("styles/release-mobile.css")
  },
  "styles/release-latest.css":{
    caps:{".topbar":8,"#menuToggle":4,".mobile-record-card":5},
    source:read("styles/release-latest.css")
  },
  "styles/responsive-shell.css":{
    caps:{".topbar":12,"#menuToggle":7},
    source:read("styles/responsive-shell.css")
  },
  "styles/customer-documents.css":{
    caps:{".invoice-status-field":14,".customer-open-status":8},
    source:read("styles/customer-documents.css")
  }
};
for(const [file,config] of Object.entries(selectorModules)){
  for(const [selector,cap] of Object.entries(config.caps)){
    const count=config.source.split(selector).length-1;
    if(count>cap){
      fail(file+" · "+selector+" grew beyond module baseline "+cap+" to "+count);
    }else{
      pass(file+" · "+selector+" count "+count+" / "+cap);
      if(count>=cap*0.85) warn(file+" · "+selector+" is near its duplication cap; consolidate selectors before adding another override");
    }
  }
}


const ciWorkflow=read(".github/workflows/ci.yml");
const vendorWorkflow=read(".github/workflows/vendor-supabase.yml");
for(const [name,workflow] of [["CI",ciWorkflow],["Vendor Supabase",vendorWorkflow]]){
  if(/actions\/(?:checkout|setup-node)@v4/.test(workflow)){
    fail(name+" workflow still uses Node-20-era GitHub Actions v4");
  }else{
    pass(name+" workflow uses current GitHub Actions major versions");
  }
  if(/npm install --no-audit --no-fund/.test(workflow)){
    fail(name+" workflow must use npm ci for deterministic lockfile installs");
  }else{
    pass(name+" workflow uses deterministic npm ci installs");
  }
}

if(process.exitCode) process.exit(process.exitCode);

import fs from "node:fs";

const read = file => fs.readFileSync(file,"utf8");
const app = read("app.js");
const html = read("index.html");
const sw = read("service-worker.js");
const i18n = read("i18n.js");
const publicJs = read("public.js");
const manifest = JSON.parse(read("manifest.webmanifest"));

const fail = message => {
  console.error("REPO_HEALTH_FAIL · "+message);
  process.exitCode = 1;
};
const pass = message => console.log("REPO_HEALTH_OK · "+message);
const warn = message => console.warn("REPO_HEALTH_WARN · "+message);

const appVersion=(app.match(/const APP_VERSION = "([^"]+)"/)||[])[1];
const shellVersion=(html.match(/window.__tleShellVersion="([^"]+)"/)||[])[1];
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

if(fs.existsSync("admin-reset.html")){
  fail("legacy admin-reset.html must not be shipped in the public app");
}else{
  pass("legacy public admin reset page is absent");
}

if(!i18n.includes('const SUPPORTED=["en","es","fr","ht"]')){
  fail("active language set must be EN/ES/FR/HT");
}else{
  pass("active language set is EN/ES/FR/HT");
}
if(/data-language-choice="pt"/.test(i18n) || /data-language-choice="pt"/.test(publicJs)){
  fail("Portuguese is still exposed as an active runtime language choice");
}

const sensitiveParams='sensitiveParams=["token","session_id","invite","worker","billing","slug","public"]';
if(!sw.includes(sensitiveParams)) fail("service worker sensitive URL cache guard is missing");
else pass("service worker sensitive URL cache guard is present");

const limits={
  "app.js":525000,
  "styles.css":315000,
  "styles/responsive-shell.css":12000,
  "styles/customer-documents.css":12000,
  "i18n.js":190000,
  "index.html":100000,
  "public.js":65000
};
for(const [file,limit] of Object.entries(limits)){
  const size=fs.statSync(file).size;
  if(size>limit) fail(file+" grew beyond guardrail "+limit+" bytes (current "+size+")");
  else pass(file+" size "+size+" / "+limit);
}

const css=read("styles.css");
const selectorCounts={
  ".topbar":(css.match(/\.topbar/g)||[]).length,
  "#menuToggle":(css.match(/#menuToggle/g)||[]).length,
  ".mobile-record-card":(css.match(/\.mobile-record-card/g)||[]).length,
  ".invoice-status-field":(css.match(/\.invoice-status-field/g)||[]).length,
  ".customer-open-status":(css.match(/\.customer-open-status/g)||[]).length
};
const selectorCaps={
  ".topbar":40,
  "#menuToggle":9,
  ".mobile-record-card":65,
  ".invoice-status-field":5,
  ".customer-open-status":4
};
for(const [selector,count] of Object.entries(selectorCounts)){
  const cap=selectorCaps[selector];
  if(Number.isFinite(cap) && count>cap){
    fail(selector+" duplicate count grew from its consolidation baseline "+cap+" to "+count);
  }else if(count>20){
    warn(selector+" still appears "+count+" times; consolidate before adding more variants");
  }
}

if(process.exitCode) process.exit(process.exitCode);

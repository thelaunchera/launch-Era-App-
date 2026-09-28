import fs from "node:fs";
import puppeteer from "puppeteer-core";

const url="https://app.thelaunchera.com/";
const stamp=String(Date.now());
const email=`qa.newuser.${stamp}@example.com`;
const password="TestOnly!2026Launch";
const businessName=`Bright Home QA Cleaning ${stamp.slice(-6)}`;
const serviceArea="Boynton Beach, Florida, USA";

const candidates=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium","/usr/bin/chromium-browser"];
const executablePath=candidates.find(fs.existsSync);
if(!executablePath) throw new Error("Chrome/Chromium not found on runner");

const browser=await puppeteer.launch({
  executablePath,
  headless:true,
  args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]
});

const result={
  email,
  businessName,
  landing:false,
  signupForm:false,
  verificationRequired:false,
  signedIn:false,
  setup:false,
  dashboard:false,
  greeting:"",
  weather:"",
  weatherTemp:"",
  sessionPersisted:false,
  relogin:false,
  pages:{},
  tablet:{},
  desktop:{},
  errors:[]
};

const context=await browser.createBrowserContext();
let page=await context.newPage();
await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3});
page.on("pageerror",e=>result.errors.push("pageerror: "+String(e)));
page.on("console",m=>{if(m.type()==="error") result.errors.push("console: "+m.text());});

const waitVisible=async(selector,timeout=15000)=>{
  await page.waitForFunction(sel=>{
    const el=document.querySelector(sel);
    if(!el||el.hidden) return false;
    const s=getComputedStyle(el);
    const r=el.getBoundingClientRect();
    return s.display!=="none"&&s.visibility!=="hidden"&&r.width>0&&r.height>0;
  },{timeout},selector);
};
const click=async selector=>{
  await page.waitForSelector(selector,{timeout:10000});
  await page.evaluate(sel=>document.querySelector(sel)?.click(),selector);
};
const fill=async(selector,value)=>{
  await page.waitForSelector(selector,{timeout:10000});
  await page.evaluate((sel,val)=>{
    const el=document.querySelector(sel);
    if(!el) throw new Error("Missing "+sel);
    el.focus();
    el.value=val;
    el.dispatchEvent(new Event("input",{bubbles:true}));
    el.dispatchEvent(new Event("change",{bubbles:true}));
  },selector,value);
};
const text=async selector=>page.$eval(selector,el=>String(el.textContent||"").trim()).catch(()=> "");
const activePage=async()=>page.$eval(".view.active",el=>el.dataset.page||"").catch(()=> "");

try{
  await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
  await waitVisible("#authWelcomeStart",20000);
  const landing=await page.evaluate(()=>({
    start:document.querySelector("#authWelcomeStart")?.textContent.trim(),
    signin:document.querySelector("#authWelcomeSignIn")?.textContent.trim(),
    body:document.querySelector("#authWelcome")?.textContent||"",
    privacy:Boolean(document.querySelector(".legal-privacy-link")),
    terms:Boolean(document.querySelector(".legal-terms-link")),
    language:Boolean(document.querySelector("[data-language-toggle]"))
  }));
  if(landing.start!=="Get 30 days free" || !/5\.99/.test(landing.body) || !landing.privacy || !landing.terms || !landing.language){
    throw new Error("Landing mismatch: "+JSON.stringify(landing));
  }
  result.landing=true;

  await click("#authWelcomeStart");
  await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Create account",{timeout:10000});
  result.signupForm=true;
  await fill("#authEmail",email);
  await fill("#authPassword",password);
  await page.$eval("#authForm",f=>f.requestSubmit());

  await page.waitForFunction(()=>/Account created\.|already registered|verify/i.test(document.querySelector("#authStatus")?.textContent||""),{timeout:30000});
  const signupStatus=await text("#authStatus");
  result.verificationRequired=/verify/i.test(signupStatus);
  if(result.verificationRequired){
    console.log("PRODUCTION_NEW_USER_RESULT "+JSON.stringify(result));
    process.exitCode=2;
  }else{
    await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Sign in",{timeout:10000});
    await fill("#authPassword",password);
    await page.$eval("#authForm",f=>f.requestSubmit());

    await page.waitForFunction(()=>{
      const setup=document.querySelector("#businessSetup");
      const app=document.querySelector("#appShell");
      return (setup&&!setup.hidden)||(app&&!app.hidden);
    },{timeout:30000});
    result.signedIn=true;

    if(await page.$eval("#businessSetup",el=>!el.hidden).catch(()=>false)){
      await fill("#businessName",businessName);
      await fill("#businessArea",serviceArea);
      await page.$eval("#businessForm",f=>f.requestSubmit());
      await waitVisible("#appShell",30000);
      result.setup=true;
    }else{
      result.setup=true;
    }

    await page.waitForFunction(()=>{
      const g=document.querySelector("#todayGreeting")?.textContent||"";
      const a=document.querySelector("#todayHeroAction");
      return !/Getting your day ready/i.test(g)&&a&&!a.disabled;
    },{timeout:20000}).catch(()=>{});
    await page.waitForFunction(()=>{
      const c=document.querySelector("#weatherCondition")?.textContent||"";
      return c&&!/Loading weather|Updating weather/i.test(c);
    },{timeout:20000}).catch(()=>{});

    result.dashboard=await page.$eval("#appShell",el=>!el.hidden).catch(()=>false);
    result.greeting=await text("#todayGreeting");
    result.weather=await text("#weatherCondition");
    result.weatherTemp=await text("#weatherTemp");

    await page.close();
    page=await context.newPage();
    await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3});
    await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
    await page.waitForFunction(()=>{
      const app=document.querySelector("#appShell");
      const auth=document.querySelector("#authShell");
      return (app&&!app.hidden)||(auth&&!auth.hidden);
    },{timeout:20000});
    await new Promise(r=>setTimeout(r,1800));
    result.sessionPersisted=await page.$eval("#appShell",el=>!el.hidden).catch(()=>false);

    await page.setViewport({width:1440,height:900,isMobile:false,hasTouch:false,deviceScaleFactor:1});
    for(const id of ["clients","calendar","quotes","invoices","settings","help"]){
      await page.evaluate(pageId=>document.querySelector(`.nav-item[data-view="${pageId}"]`)?.click(),id);
      await page.waitForFunction(pageId=>document.querySelector(".view.active")?.dataset.page===pageId,{timeout:8000},id).catch(()=>{});
      result.pages[id]=(await activePage())===id;
    }
    await page.evaluate(()=>document.querySelector('.nav-item[data-view="today"]')?.click());
    await page.waitForFunction(()=>document.querySelector(".view.active")?.dataset.page==="today",{timeout:8000}).catch(()=>{});

    await page.setViewport({width:1024,height:900,isMobile:false,hasTouch:false,deviceScaleFactor:1});
    await new Promise(r=>setTimeout(r,250));
    result.tablet=await page.evaluate(()=>{
      const grid=document.querySelector('[data-page="today"] .metric-grid');
      const n=document.querySelector('[data-page="today"] .metric-card strong');
      return {
        columns:getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length,
        numberFont:parseFloat(getComputedStyle(n).fontSize),
        width:window.innerWidth,
        overflow:document.documentElement.scrollWidth-window.innerWidth
      };
    });

    await page.setViewport({width:1440,height:900,isMobile:false,hasTouch:false,deviceScaleFactor:1});
    await new Promise(r=>setTimeout(r,250));
    result.desktop=await page.evaluate(()=>{
      const grid=document.querySelector('[data-page="today"] .metric-grid');
      const n=document.querySelector('[data-page="today"] .metric-card strong');
      const hero=document.querySelector("#todayHeroCard .hero-greeting-zone");
      return {
        columns:getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length,
        numberFont:parseFloat(getComputedStyle(n).fontSize),
        heroColumns:getComputedStyle(hero).gridTemplateColumns,
        width:window.innerWidth,
        overflow:document.documentElement.scrollWidth-window.innerWidth
      };
    });

    await page.evaluate(()=>document.querySelector("#sidebarSignOutBtn")?.click());
    await page.waitForFunction(()=>document.body.classList.contains("shell-auth"),{timeout:15000});
    if(await page.$eval("#authWelcome",el=>!el.hidden).catch(()=>false)){
      await click("#authWelcomeSignIn");
    }
    await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Sign in",{timeout:10000});
    await fill("#authEmail",email);
    await fill("#authPassword",password);
    await page.$eval("#authForm",f=>f.requestSubmit());
    await waitVisible("#appShell",30000);
    result.relogin=true;

    const requiredPages=Object.values(result.pages).every(Boolean);
    const weatherOk=result.weather && !/Loading weather|Updating weather/i.test(result.weather);
    const dashboardOk=result.dashboard && !/Getting your day ready/i.test(result.greeting);
    const responsiveOk=result.tablet.numberFont>=40 && result.desktop.numberFont>=48 && result.desktop.columns===5 && result.tablet.overflow<=4 && result.desktop.overflow<=4;
    if(!result.sessionPersisted) result.errors.push("Authenticated session did not persist after page close/reopen in same browser context.");
    if(!weatherOk) result.errors.push("Weather did not reach a terminal visible state: "+result.weather);
    if(!dashboardOk) result.errors.push("Dashboard greeting remained in loading state: "+result.greeting);
    if(!requiredPages) result.errors.push("One or more workspace pages failed to open: "+JSON.stringify(result.pages));
    if(!responsiveOk) result.errors.push("Tablet/desktop metric layout assertion failed: "+JSON.stringify({tablet:result.tablet,desktop:result.desktop}));
    if(!result.relogin) result.errors.push("Logout/re-login failed.");

    console.log("PRODUCTION_NEW_USER_RESULT "+JSON.stringify(result));
    if(result.errors.length) process.exitCode=1;
  }
} catch(err){
  result.errors.push(String(err?.stack||err));
  try{
    result.greeting=result.greeting||await text("#todayGreeting");
    result.weather=result.weather||await text("#weatherCondition");
    result.weatherTemp=result.weatherTemp||await text("#weatherTemp");
  }catch{}
  console.log("PRODUCTION_NEW_USER_RESULT "+JSON.stringify(result));
  process.exitCode=1;
} finally {
  await browser.close();
}

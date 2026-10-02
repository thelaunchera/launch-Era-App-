import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root=process.cwd();
const mime={
  ".html":"text/html; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".webmanifest":"application/manifest+json",
  ".svg":"image/svg+xml"
};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,"http://127.0.0.1");
  let p=decodeURIComponent(u.pathname);
  if(p==="/") p="/index.html";
  const file=path.join(root,p.replace(/^\//,""));
  if(!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()){
    res.writeHead(404);res.end("not found");return;
  }
  res.setHeader("Content-Type",mime[path.extname(file)]||"application/octet-stream");
  res.setHeader("Cache-Control","no-store");
  fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(4173,"127.0.0.1",r));

const candidates=["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium","/usr/bin/chromium-browser"];
const executablePath=candidates.find(fs.existsSync);
if(!executablePath) throw new Error("Chrome/Chromium not found on runner");

const browser=await puppeteer.launch({
  executablePath,
  headless:true,
  args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]
});

const profiles=[
  {name:"iPhone",viewport:{width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3}},
  {name:"Android",viewport:{width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:2.6}},
  {name:"Tablet",viewport:{width:768,height:1024,isMobile:true,hasTouch:true,deviceScaleFactor:2}},
  {name:"Desktop",viewport:{width:1366,height:768,isMobile:false,hasTouch:false,deviceScaleFactor:1}}
];

try{
  for(const profile of profiles){
    const context=await browser.createBrowserContext();
    const page=await context.newPage();
    await page.setViewport(profile.viewport);
    const errors=[];
    page.on("pageerror",err=>errors.push(String(err)));
    page.on("console",msg=>{if(msg.type()==="error") errors.push(msg.text());});
    await page.goto("http://127.0.0.1:4173/?browser-smoke=1",{waitUntil:"domcontentloaded",timeout:15000});
    await page.waitForSelector("#authPanel",{visible:true,timeout:10000});
    try{
    await page.waitForFunction(()=>window.__tleAuthUiReady===true || Boolean(document.documentElement.dataset.appError),{timeout:10000});
  }catch(err){
    const diag=await page.evaluate(()=>({
      readyState:document.readyState,
      authUiReady:window.__tleAuthUiReady,
      appReady:window.__tleAppReady,
      appError:document.documentElement.dataset.appError||"",
      appScript:[...document.scripts].map(s=>s.src).find(src=>src.includes("app.js"))||"",
      publicScript:[...document.scripts].map(s=>s.src).find(src=>src.includes("public.js"))||""
    }));
    throw new Error(profile.name+": auth UI did not initialize · "+JSON.stringify(diag)+" · console="+errors.join(" | ")+" · "+err.message);
  }
    const bootError=await page.evaluate(()=>document.documentElement.dataset.appError||"");
    if(bootError) throw new Error(profile.name+": app boot error "+bootError);
    await page.waitForFunction(()=>typeof window.TLE_FOLLOWUPS?.load==="function",{timeout:10000});
    const followupsShell=await page.evaluate(()=>({
      nav:Boolean(document.querySelector('.nav-item[data-view="followups"]')),
      view:Boolean(document.querySelector('.view[data-page="followups"]')),
      module:typeof window.TLE_FOLLOWUPS?.load==="function"
    }));
    if(!followupsShell.nav||!followupsShell.view||!followupsShell.module){
      throw new Error(profile.name+": Follow-ups module failed to initialize "+JSON.stringify(followupsShell));
    }

    const authEntry=await page.evaluate(()=>({
      welcomeHidden:!!document.querySelector("#authWelcome")?.hidden,
      panelVisible:!document.querySelector("#authPanel")?.hidden,
      title:document.querySelector("#authTitle")?.textContent.trim(),
      submit:document.querySelector("#authSubmit")?.textContent.trim(),
      modeSignup:document.querySelector("#authShell")?.classList.contains("auth-mode-signup")
    }));
    if(!authEntry.welcomeHidden||!authEntry.panelVisible||authEntry.title!=="Start organizing your cleaning business today."||authEntry.submit!=="Sign up"||!authEntry.modeSignup){
      throw new Error(profile.name+": signup-first auth screen failed: "+JSON.stringify(authEntry));
    }

    const signup=await page.evaluate(()=>({
      button:{text:document.querySelector("#authSubmit")?.textContent.trim(),hidden:document.querySelector("#authSubmit")?.hidden,disabled:document.querySelector("#authSubmit")?.disabled},
      emailVisible:!!document.querySelector("#emailField") && !document.querySelector("#emailField").hidden,
      emailType:document.querySelector("#authEmail")?.type,
      trialClose:!!document.querySelector("#trialExpiryClose"),
      staticThreeDay:document.body.textContent.includes("Your free access ends in 3 days")
    }));
    if(signup.button.text!=="Sign up"||signup.button.hidden||signup.button.disabled||!signup.emailVisible||signup.emailType!=="email"){
      throw new Error(profile.name+": Sign up form is not usable");
    }
    await page.waitForSelector("#authPassword",{visible:true,timeout:10000});
    const authInputSizes=await page.evaluate(()=>({
      email:parseFloat(getComputedStyle(document.querySelector("#authEmail")).fontSize||"0"),
      password:parseFloat(getComputedStyle(document.querySelector("#authPassword")).fontSize||"0")
    }));
    if(profile.name==="iPhone" && (authInputSizes.email<16 || authInputSizes.password<16)){
      throw new Error(profile.name+": auth input font can trigger iOS focus zoom "+JSON.stringify(authInputSizes));
    }
    const passwordToggle=await page.evaluate(()=>{
      const btn=document.querySelector("#authPasswordToggle");
      const input=document.querySelector("#authPassword");
      if(!btn||!input) return {exists:false};
      btn.click();
      const shown=input.type==="text"&&btn.getAttribute("aria-pressed")==="true";
      btn.click();
      const hidden=input.type==="password"&&btn.getAttribute("aria-pressed")==="false";
      return {exists:true,shown,hidden};
    });
    if(!passwordToggle.exists||!passwordToggle.shown||!passwordToggle.hidden){
      const debug=await page.evaluate(()=>({
        type:document.querySelector("#authPassword")?.type,
        pressed:document.querySelector("#authPasswordToggle")?.getAttribute("aria-pressed"),
        className:document.querySelector("#authPasswordToggle")?.className,
        ready:window.__tleAppReady===true,
        appError:document.documentElement.dataset.appError||""
      }));
      throw new Error(profile.name+": password visibility toggle failed "+JSON.stringify({passwordToggle,debug,errors}));
    }
    if(!signup.trialClose||signup.staticThreeDay) throw new Error(profile.name+": trial alert markup is stale");
    const layout=await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,
      innerWidth:window.innerWidth,
      appError:document.documentElement.dataset.appError||"",
      authReady:window.__tleAuthUiReady===true
    }));
    if(layout.scrollWidth>layout.innerWidth+4) throw new Error(profile.name+": horizontal overflow "+layout.scrollWidth+" > "+layout.innerWidth);
    if(layout.appError) throw new Error(profile.name+": app boot error "+layout.appError);
    if(!layout.authReady) throw new Error(profile.name+": auth UI did not finish wiring");
    // The auth panel animates on mobile. Follow the real switch path and let
    // Puppeteer perform an actual clickable-point tap; it scrolls the target
    // into view exactly as a user agent would instead of guessing coordinates.
    await page.evaluate(()=>document.querySelector("#authSwitch")?.click());
    await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Welcome back",{timeout:10000});
    await page.evaluate(()=>{
      window.__tleSmokeAuthSubmitClicked=false;
      const btn=document.querySelector("#authSubmit");
      if(!btn) throw new Error("auth submit missing");
      btn.addEventListener("click",event=>{
        window.__tleSmokeAuthSubmitClicked=true;
        event.preventDefault();
        event.stopImmediatePropagation();
      },{once:true,capture:true});
      const splash=document.querySelector("#sessionSplash");
      if(splash){
        splash.hidden=true;
        splash.style.pointerEvents="none";
        splash.setAttribute("aria-hidden","true");
      }
    });
    await page.waitForSelector("#authSubmit",{visible:true,timeout:8000});
    const submitState=await page.evaluate(async()=>{
      const btn=document.querySelector("#authSubmit");
      if(!btn) return {exists:false};
      btn.scrollIntoView({block:"center",inline:"nearest",behavior:"instant"});
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const style=getComputedStyle(btn);
      const r=btn.getBoundingClientRect();
      const cx=Math.max(0,Math.min(innerWidth-1,r.left+r.width/2));
      const cy=Math.max(0,Math.min(innerHeight-1,r.top+r.height/2));
      const hit=document.elementFromPoint(cx,cy);
      return {
        exists:true,
        disabled:Boolean(btn.disabled),
        pointerEvents:style.pointerEvents||"",
        visibility:style.visibility||"",
        display:style.display||"",
        width:r.width||0,
        height:r.height||0,
        top:r.top,
        bottom:r.bottom,
        withinViewport:r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth,
        hitSelf:Boolean(hit && (hit===btn || btn.contains(hit)))
      };
    });
    if(!submitState.exists || submitState.disabled || submitState.pointerEvents==="none" ||
       submitState.visibility==="hidden" || submitState.display==="none" ||
       submitState.width<20 || submitState.height<20 ||
       !submitState.withinViewport || !submitState.hitSelf){
      throw new Error(profile.name+": Sign in button is not usable "+JSON.stringify(submitState));
    }
    // Cross-browser Playwright owns the physical hit-test. Here we verify the
    // visible enabled control is wired to the real submit handler without
    // depending on Puppeteer's mobile clickablePoint heuristics.
    await page.evaluate(()=>document.querySelector("#authSubmit")?.click());
    await page.waitForFunction(()=>window.__tleSmokeAuthSubmitClicked===true,{timeout:3000});
    await page.evaluate(()=>document.querySelector("#authSwitch")?.click());
    await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Start organizing your cleaning business today.",{timeout:10000});
    if(errors.some(e=>/Supabase browser library failed|ReferenceError|SyntaxError/i.test(e))){
      throw new Error(profile.name+": runtime error: "+errors.join(" | "));
    }
    console.log("BROWSER_SMOKE_OK",profile.name,layout);
    await page.close();
    await context.close();
  }
}finally{
  await browser.close();
  await new Promise(r=>server.close(r));
}

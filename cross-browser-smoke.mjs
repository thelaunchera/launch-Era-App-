import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";

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
await new Promise(resolve=>server.listen(4174,"127.0.0.1",resolve));

const profiles=[
  {name:"Safari iPhone",engine:"webkit",viewport:{width:390,height:844}},
  {name:"Safari iPad",engine:"webkit",viewport:{width:820,height:1180}},
  {name:"Android Chrome",engine:"chromium",viewport:{width:412,height:915}},
  {name:"Chrome Desktop",engine:"chromium",viewport:{width:1366,height:768}},
  {name:"Firefox Desktop",engine:"firefox",viewport:{width:1366,height:768}}
];
const engines={chromium,firefox,webkit};

async function assertLayout(page,profile){
  const initial=await page.evaluate(()=>({
    bodyClass:document.body.className,
    authDisplay:getComputedStyle(document.querySelector("#authShell")).display,
    appDisplay:getComputedStyle(document.querySelector("#appShell")).display,
    scrollWidth:document.documentElement.scrollWidth,
    innerWidth:innerWidth
  }));
  if(!initial.bodyClass.includes("shell-auth")) throw new Error(profile.name+": initial shell state is not auth");
  if(initial.authDisplay==="none") throw new Error(profile.name+": auth shell is not visible on initial load");
  if(initial.appDisplay!=="none") throw new Error(profile.name+": app shell leaked into auth screen");
  if(initial.scrollWidth>initial.innerWidth+4) throw new Error(profile.name+": auth horizontal overflow");
  try{
    await page.waitForFunction(()=>window.__tleAuthUiReady===true || Boolean(document.documentElement.dataset.appError),null,{timeout:10000});
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

  const authLanguage=page.locator("[data-language-toggle]").first();
  await authLanguage.click();
  await page.waitForSelector("#tleLanguageMenu",{state:"visible",timeout:2000});
  const languageShape=await page.evaluate(()=>({
    featured:[...document.querySelectorAll("#tleLanguageMenu .language-featured-row [data-language-choice]")].map(x=>x.dataset.languageChoice),
    listed:[...document.querySelectorAll("#tleLanguageMenu .language-list [data-language-choice]")].map(x=>x.dataset.languageChoice),
    overflow:document.querySelector("#tleLanguageMenu")?.getBoundingClientRect().right>innerWidth+2
  }));
  if(languageShape.featured.join(",")!=="es,en") throw new Error(profile.name+": primary language order changed");
  if(languageShape.listed.join(",")!=="pt,fr") throw new Error(profile.name+": secondary language list changed");
  if(languageShape.overflow) throw new Error(profile.name+": language picker overflows viewport");

  // Regression guard: switching languages must never keep translated text
  // from the previous language as the new source string.
  await page.locator('#tleLanguageMenu [data-language-choice="fr"]').click();
  await page.waitForFunction(()=>document.documentElement.lang==="fr",null,{timeout:2000});
  const frAdmin=await page.locator('[data-page="admin"]').textContent();
  if(!frAdmin.includes("SÉCURITÉ") || !frAdmin.includes("Sécurité") || !frAdmin.includes("Intégrations") || frAdmin.includes("Security")){
    throw new Error(profile.name+": French owner-admin translation is incomplete");
  }

  await authLanguage.click();
  await page.waitForSelector("#tleLanguageMenu",{state:"visible",timeout:2000});
  await page.locator('#tleLanguageMenu [data-language-choice="pt"]').click();
  await page.waitForFunction(()=>document.documentElement.lang==="pt",null,{timeout:2000});
  const ptAdmin=await page.locator('[data-page="admin"]').textContent();
  if(
    !ptAdmin.includes("SEGURANÇA") ||
    !ptAdmin.includes("Segurança") ||
    !ptAdmin.includes("Integrações") ||
    !ptAdmin.includes("Administrador") ||
    !ptAdmin.includes("Funcionário") ||
    ptAdmin.includes("Administrateur") ||
    ptAdmin.includes("Sécurité") ||
    ptAdmin.includes("Intégrations")
  ){
    throw new Error(profile.name+": Portuguese owner-admin translation is mixed or incomplete");
  }

  await authLanguage.click();
  await page.waitForSelector("#tleLanguageMenu",{state:"visible",timeout:2000});
  await page.locator('#tleLanguageMenu [data-language-choice="en"]').click();
  await page.waitForFunction(()=>document.documentElement.lang==="en",null,{timeout:2000});
  const enAdmin=await page.locator('[data-page="admin"]').textContent();
  if(!enAdmin.includes("SECURITY") || !enAdmin.includes("Security") || !enAdmin.includes("Integrations")){
    throw new Error(profile.name+": returning to English did not restore canonical source text");
  }

  await page.keyboard.press("Escape");
  await page.waitForSelector("#tleLanguageMenu",{state:"hidden",timeout:2000});

  // Welcome-first auth is release-blocking on mobile and in-app browsers.
  const welcome=page.locator("#authWelcome");
  const welcomeStart=page.locator("#authWelcomeStart");
  if(!(await welcome.isVisible())) throw new Error(profile.name+": welcome screen is not visible");
  if(!(await welcomeStart.isVisible()) || !(await welcomeStart.isEnabled())){
    throw new Error(profile.name+": Get 30 days free is not usable");
  }
  await welcomeStart.click();
  await page.waitForSelector("#authPanel",{state:"visible",timeout:3000});
  await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Create account",null,{timeout:3000});

  const back=page.locator("#authBackWelcome");
  if(!(await back.isVisible()) || !(await back.isEnabled())) throw new Error(profile.name+": back-to-welcome is not usable");
  await back.click();
  await page.waitForSelector("#authWelcome",{state:"visible",timeout:3000});

  const welcomeSignIn=page.locator("#authWelcomeSignIn");
  if(!(await welcomeSignIn.isVisible()) || !(await welcomeSignIn.isEnabled())){
    throw new Error(profile.name+": welcome Sign in link is not usable");
  }
  await welcomeSignIn.click();
  await page.waitForSelector("#authPanel",{state:"visible",timeout:3000});
  await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Sign in",null,{timeout:3000});

  // Returning-user regression: remembered username must survive a natural
  // reload without storing a password or bouncing back to the welcome screen.
  await page.evaluate(()=>{
    localStorage.setItem("tle_remember_username_v1","1");
    localStorage.setItem("tle_owner_email","remembered.qa@example.com");
  });
  await page.reload({waitUntil:"domcontentloaded",timeout:20000});
  await page.waitForFunction(()=>window.__tleAuthUiReady===true,null,{timeout:10000});
  await page.waitForSelector("#authPanel",{state:"visible",timeout:3000});
  await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Sign in",null,{timeout:3000});
  const remembered=await page.evaluate(()=>({
    email:document.querySelector("#authEmail")?.value||"",
    checked:Boolean(document.querySelector("#rememberUsername")?.checked),
    visible:!document.querySelector("#rememberUsernameRow")?.hidden,
    password:document.querySelector("#authPassword")?.value||""
  }));
  if(remembered.email!=="remembered.qa@example.com" || !remembered.checked || !remembered.visible){
    throw new Error(profile.name+": remember username did not survive reload "+JSON.stringify(remembered));
  }
  if(remembered.password){
    throw new Error(profile.name+": app stored a password in the sign-in field");
  }
  await page.evaluate(()=>{
    localStorage.removeItem("tle_owner_email");
    localStorage.setItem("tle_remember_username_v1","0");
  });

  const authSubmit=page.locator("#authSubmit");
  if(!(await authSubmit.isVisible()) || !(await authSubmit.isEnabled())){
    throw new Error(profile.name+": sign-in submit is not usable");
  }
  await page.evaluate(()=>{
    window.__tleSmokeAuthSubmitClicked=false;
    const btn=document.querySelector("#authSubmit");
    if(!btn) throw new Error("auth submit missing");
    btn.addEventListener("click",event=>{
      window.__tleSmokeAuthSubmitClicked=true;
      event.preventDefault();
      event.stopImmediatePropagation();
    },{once:true,capture:true});
  });
  await authSubmit.click();
  await page.waitForFunction(()=>window.__tleSmokeAuthSubmitClicked===true,null,{timeout:3000});
  const authSwitch=page.locator("#authSwitch");
  if(!(await authSwitch.isVisible()) || !(await authSwitch.isEnabled())){
    throw new Error(profile.name+": auth mode switch is not usable");
  }
  await authSwitch.click();
  await page.waitForFunction(
    ()=>document.querySelector("#authTitle")?.textContent.trim()==="Create account",
    null,
    {timeout:3000}
  );

  await page.evaluate(()=>{
    document.body.classList.remove("shell-auth","shell-worker","shell-public");
    document.body.classList.add("shell-app");
    const auth=document.querySelector("#authShell");
    const app=document.querySelector("#appShell");
    if(auth) auth.hidden=true;
    if(app) app.hidden=false;
    window.scrollTo(0,0);
  });
  await page.waitForTimeout(80);

  const dashboard=await page.evaluate(()=> {
    const app=document.querySelector("#appShell");
    const auth=document.querySelector("#authShell");
    const main=document.querySelector(".main");
    const topbar=document.querySelector(".topbar");
    const sidebar=document.querySelector(".sidebar");
    const appRect=app.getBoundingClientRect();
    const mainRect=main.getBoundingClientRect();
    const topRect=topbar.getBoundingClientRect();
    return {
      authDisplay:getComputedStyle(auth).display,
      appDisplay:getComputedStyle(app).display,
      appTop:appRect.top,
      appWidth:appRect.width,
      mainTop:mainRect.top,
      mainWidth:mainRect.width,
      topbarTop:topRect.top,
      sidebarWidth:sidebar.getBoundingClientRect().width,
      scrollWidth:document.documentElement.scrollWidth,
      innerWidth:innerWidth,
      innerHeight:innerHeight
    };
  });

  if(dashboard.authDisplay!=="none") throw new Error(profile.name+": auth and dashboard render together");
  if(dashboard.appDisplay==="none") throw new Error(profile.name+": dashboard is hidden in app state");
  if(Math.abs(dashboard.appTop)>4 || Math.abs(dashboard.mainTop)>4 || Math.abs(dashboard.topbarTop)>6){
    throw new Error(profile.name+": dashboard does not start at top "+JSON.stringify(dashboard));
  }
  const expectedMainMin=profile.viewport.width<=860
    ? dashboard.innerWidth-36
    : dashboard.innerWidth-dashboard.sidebarWidth-36;
  if(dashboard.mainWidth<expectedMainMin){
    throw new Error(profile.name+": dashboard is compressed "+JSON.stringify(dashboard));
  }
  if(dashboard.scrollWidth>dashboard.innerWidth+4){
    throw new Error(profile.name+": dashboard horizontal overflow "+JSON.stringify(dashboard));
  }

  // iOS/PWA resume regression: a pageshow event (for example after returning
  // from Weather or a password-manager surface) must not force-scroll to top.
  const resumeScroll=await page.evaluate(async()=>{
    const spacer=document.createElement("div");
    spacer.id="resumeSmokeSpacer";
    spacer.style.height="1800px";
    document.body.appendChild(spacer);
    window.scrollTo(0,Math.min(320,document.documentElement.scrollHeight-innerHeight));
    const before=window.scrollY;
    window.dispatchEvent(new PageTransitionEvent("pageshow",{persisted:true}));
    await new Promise(resolve=>setTimeout(resolve,60));
    const after=window.scrollY;
    spacer.remove();
    return {before,after};
  });
  if(resumeScroll.before>40 && resumeScroll.after<resumeScroll.before-40){
    throw new Error(profile.name+": pageshow resume jumped toward the top "+JSON.stringify(resumeScroll));
  }

  if(profile.viewport.width<=860){
    const menu=page.locator("#menuToggle");
    await menu.click();
    try{
      await page.waitForFunction(()=>{
        const sidebar=document.querySelector(".sidebar");
        if(!sidebar) return false;
        return sidebar.classList.contains("open") && Math.abs(sidebar.getBoundingClientRect().left)<=3;
      },null,{timeout:2000});
    }catch(err){
      const sidebarDiag=await page.evaluate(()=>{
        const sidebar=document.querySelector(".sidebar");
        const menu=document.querySelector("#menuToggle");
        const rect=sidebar?.getBoundingClientRect();
        return {
          bodyClass:document.body.className,
          innerWidth,
          matchMedia:window.matchMedia("(max-width: 860px)").matches,
          sidebarClass:sidebar?.className||"",
          sidebarLeft:rect?.left??null,
          sidebarWidth:rect?.width??null,
          sidebarDisplay:sidebar?getComputedStyle(sidebar).display:null,
          sidebarComputedLeft:sidebar?getComputedStyle(sidebar).left:null,
          sidebarComputedTransform:sidebar?getComputedStyle(sidebar).transform:null,
          sidebarInlineLeft:sidebar?.style.getPropertyValue("left")||"",
          sidebarInlineTransform:sidebar?.style.getPropertyValue("transform")||"",
          sidebarInlineTransformPriority:sidebar?.style.getPropertyPriority("transform")||"",
          appHidden:document.querySelector("#appShell")?.hidden,
          appDisplay:getComputedStyle(document.querySelector("#appShell")).display,
          menuExpanded:menu?.getAttribute("aria-expanded"),
          menuDisplay:menu?getComputedStyle(menu).display:null
        };
      });
      throw new Error(profile.name+": sidebar did not open "+JSON.stringify(sidebarDiag)+" · "+err.message);
    }
    const nav=await page.evaluate(()=>{
      const sidebar=document.querySelector(".sidebar").getBoundingClientRect();
      const main=document.querySelector(".main").getBoundingClientRect();
      return {left:sidebar.left,width:sidebar.width,mainWidth:main.width,innerWidth:innerWidth};
    });
    if(Math.abs(nav.left)>3) throw new Error(profile.name+": open sidebar is off-screen "+JSON.stringify(nav));
    if(nav.width>Math.min(nav.innerWidth*.86,305)) throw new Error(profile.name+": sidebar too wide "+JSON.stringify(nav));
    if(nav.mainWidth<nav.innerWidth-36) throw new Error(profile.name+": sidebar compressed dashboard "+JSON.stringify(nav));
    const scrim=page.locator("#sidebarScrim");
    await scrim.click({position:{x:Math.max(10,profile.viewport.width-20),y:Math.floor(profile.viewport.height/2)}});
    await page.waitForFunction(()=>!document.querySelector(".sidebar")?.classList.contains("open"),null,{timeout:2000});

    // Regression guard: long modals must scroll inside the backdrop without
    // moving the page behind them, and the footer actions must remain reachable.
    await page.evaluate(()=>{
      const backdrop=document.querySelector("#modalBackdrop");
      const form=document.querySelector("#entityForm");
      if(!backdrop||!form) throw new Error("modal elements missing");
      form.innerHTML='<div class="form-grid">'+
        Array.from({length:14},(_,i)=>'<label class="full">Field '+(i+1)+'<input value="test"></label>').join("")+
        '<div class="form-footer"><button type="button" class="ghost-btn">Cancel</button><button type="button" class="primary-btn" id="smokeModalSave">Save</button></div></div>';
      backdrop.hidden=false;
    });
    await page.waitForFunction(()=>document.body.classList.contains("modal-open"),null,{timeout:2000});
    const modalState=await page.evaluate(()=>{
      const backdrop=document.querySelector("#modalBackdrop");
      const footer=document.querySelector("#entityForm .form-footer");
      const bodyStyle=getComputedStyle(document.body);
      const footerStyle=getComputedStyle(footer);
      backdrop.scrollTop=backdrop.scrollHeight;
      const save=document.querySelector("#smokeModalSave").getBoundingClientRect();
      return {
        bodyPosition:bodyStyle.position,
        bodyOverflow:bodyStyle.overflow,
        footerPosition:footerStyle.position,
        canScroll:backdrop.scrollHeight>backdrop.clientHeight,
        saveBottom:save.bottom,
        viewportHeight:innerHeight
      };
    });
    if(modalState.bodyPosition!=="fixed") throw new Error(profile.name+": modal did not lock background "+JSON.stringify(modalState));
    if(modalState.footerPosition==="sticky"||modalState.footerPosition==="fixed") throw new Error(profile.name+": modal footer overlays content "+JSON.stringify(modalState));
    if(!modalState.canScroll) throw new Error(profile.name+": long modal is not scrollable "+JSON.stringify(modalState));
    if(modalState.saveBottom>modalState.viewportHeight+4) throw new Error(profile.name+": modal footer actions are unreachable "+JSON.stringify(modalState));
    await page.evaluate(()=>{document.querySelector("#modalBackdrop").hidden=true;});
    await page.waitForFunction(()=>!document.body.classList.contains("modal-open"),null,{timeout:2000});
  }

  const rotated={width:profile.viewport.height,height:profile.viewport.width};
  if(rotated.width>=320 && rotated.height>=320){
    await page.setViewportSize(rotated);
    await page.waitForTimeout(40);
    const rotatedLayout=await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,
      innerWidth:innerWidth,
      authDisplay:getComputedStyle(document.querySelector("#authShell")).display,
      appDisplay:getComputedStyle(document.querySelector("#appShell")).display
    }));
    if(rotatedLayout.authDisplay!=="none" || rotatedLayout.appDisplay==="none"){
      throw new Error(profile.name+": shell state broke after orientation/resize");
    }
    if(rotatedLayout.scrollWidth>rotatedLayout.innerWidth+4){
      throw new Error(profile.name+": overflow after orientation/resize");
    }
  }
}

try{
  for(const profile of profiles){
    const browser=await engines[profile.engine].launch({headless:true});
    try{
      const context=await browser.newContext({
        viewport:profile.viewport,
        isMobile:profile.viewport.width<=860,
        hasTouch:profile.viewport.width<=860
      });
      const page=await context.newPage();
      const errors=[];
      page.on("pageerror",err=>errors.push(String(err)));
      page.on("console",msg=>{if(msg.type()==="error") errors.push(msg.text());});
      await page.goto("http://127.0.0.1:4174/?cross-browser-smoke=1",{
        waitUntil:"domcontentloaded",
        timeout:20000
      });
      await page.waitForSelector("#authShell",{state:"visible",timeout:10000});
      await assertLayout(page,profile);
      const serious=errors.filter(e=>/ReferenceError|SyntaxError|Supabase browser library failed/i.test(e));
      if(serious.length) throw new Error(profile.name+": runtime error "+serious.join(" | "));
      console.log("CROSS_BROWSER_OK",profile.name);
      await context.close();
    }finally{
      await browser.close();
    }
  }
}finally{
  await new Promise(resolve=>server.close(resolve));
}

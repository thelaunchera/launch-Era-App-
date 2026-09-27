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
  if(dashboard.mainWidth<dashboard.innerWidth-36){
    throw new Error(profile.name+": dashboard is compressed "+JSON.stringify(dashboard));
  }
  if(dashboard.scrollWidth>dashboard.innerWidth+4){
    throw new Error(profile.name+": dashboard horizontal overflow "+JSON.stringify(dashboard));
  }

  if(profile.viewport.width<=860){
    const menu=page.locator("#menuToggle");
    await menu.click();
    await page.waitForFunction(()=>{
      const sidebar=document.querySelector(".sidebar");
      if(!sidebar) return false;
      return sidebar.classList.contains("open") && Math.abs(sidebar.getBoundingClientRect().left)<=3;
    },null,{timeout:2000});
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

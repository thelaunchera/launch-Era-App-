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
    const page=await browser.newPage();
    await page.setViewport(profile.viewport);
    const errors=[];
    page.on("pageerror",err=>errors.push(String(err)));
    page.on("console",msg=>{if(msg.type()==="error") errors.push(msg.text());});
    await page.goto("http://127.0.0.1:4173/?browser-smoke=1",{waitUntil:"domcontentloaded",timeout:15000});
    await page.waitForSelector("#authSwitch",{visible:true,timeout:10000});
    const initial=await page.$eval("#authTitle",el=>el.textContent.trim());
    if(!["Create account","Sign in"].includes(initial)) throw new Error(profile.name+": initial auth screen failed: "+initial);
    if(initial==="Sign in"){
      await page.click("#authSwitch");
      await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Create account",{timeout:5000});
    }
    const signup=await page.evaluate(()=>({
      button:{text:document.querySelector("#authSubmit")?.textContent.trim(),hidden:document.querySelector("#authSubmit")?.hidden,disabled:document.querySelector("#authSubmit")?.disabled},
      emailVisible:!!document.querySelector("#emailField") && !document.querySelector("#emailField").hidden,
      emailType:document.querySelector("#authEmail")?.type,
      trialClose:!!document.querySelector("#trialExpiryClose"),
      staticThreeDay:document.body.textContent.includes("Your free access ends in 3 days")
    }));
    if(signup.button.text!=="Create account"||signup.button.hidden||signup.button.disabled||!signup.emailVisible||signup.emailType!=="email"){
      throw new Error(profile.name+": Create account form is not usable");
    }
    if(!signup.trialClose||signup.staticThreeDay) throw new Error(profile.name+": trial alert markup is stale");
    const layout=await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,
      innerWidth:window.innerWidth,
      appError:document.documentElement.dataset.appError||"",
      ready:window.__tleAppReady===true
    }));
    if(layout.scrollWidth>layout.innerWidth+4) throw new Error(profile.name+": horizontal overflow "+layout.scrollWidth+" > "+layout.innerWidth);
    if(layout.appError) throw new Error(profile.name+": app boot error "+layout.appError);
    if(!layout.ready) throw new Error(profile.name+": app did not finish booting");
    await page.click("#authSwitch");
    await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Sign in",{timeout:5000});
    await page.click("#authSwitch");
    await page.waitForFunction(()=>document.querySelector("#authTitle")?.textContent.trim()==="Create account",{timeout:5000});
    if(errors.some(e=>/Supabase browser library failed|ReferenceError|SyntaxError/i.test(e))){
      throw new Error(profile.name+": runtime error: "+errors.join(" | "));
    }
    console.log("BROWSER_SMOKE_OK",profile.name,layout);
    await page.close();
  }
}finally{
  await browser.close();
  await new Promise(r=>server.close(r));
}

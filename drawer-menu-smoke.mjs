/* r89: cross-device accessible drawer regression, no customer data. */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import assert from "node:assert/strict";
import {chromium,webkit} from "playwright";

const root=process.cwd(),html=fs.readFileSync("index.html","utf8"),
  drawer=fs.readFileSync("drawer-menu-r89.js","utf8"),
  css=fs.readFileSync("styles/drawer-menu-r89.css","utf8"),
  sw=fs.readFileSync("service-worker.js","utf8");
assert.ok(html.includes('id="drawerMenuButton"')&&html.includes('id="drawerCloseButton"'));
assert.ok(html.includes('data-lenis-prevent')&&html.includes('styles/drawer-menu-r89.css?v='));
assert.ok(drawer.includes('lenis@1.3.26/+esm')&&drawer.includes('autoRaf:false')&&drawer.includes('lerp:0.09'));
assert.ok(drawer.includes('lenis?.stop()')&&drawer.includes('lenis?.start()'));
assert.ok(sw.includes('drawer-menu-r89.js?v=')&&sw.includes('styles/drawer-menu-r89.css?v='));
assert.ok(css.includes('prefers-reduced-motion')&&css.includes('translate3d(104%,0,0)'));

const server=http.createServer((req,res)=>{
  const url=new URL(req.url,"http://127.0.0.1");
  const file=path.resolve(root,"."+(url.pathname==="/"?"/index.html":url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  res.setHeader("Content-Type",file.endsWith(".css")?"text/css":file.endsWith(".js")?"text/javascript":"text/html");
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(4205,"127.0.0.1",resolve));
try{
  for(const [engineName,engine] of Object.entries({chromium,webkit})){
    const browser=await engine.launch({headless:true,args:engineName==="chromium"?["--no-sandbox"]:[]});
    try{
      for(const width of [375,414,768,1024,1366]){
        const page=await browser.newPage({viewport:{width,height:812}});
        const errors=[];
        page.on("pageerror",error=>errors.push(error.message));
        await page.goto("http://127.0.0.1:4205/?browser-smoke=1",{waitUntil:"domcontentloaded",timeout:30000});
        await page.waitForFunction(()=>window.__tleAuthUiReady===true,{timeout:15000});
        await page.evaluate(()=>{
          document.getElementById("appShell").hidden=false;
          document.getElementById("authShell").hidden=true;
          // Signed-in test fixture: the unauthenticated loading overlay must not intercept input.
          document.getElementById("sessionSplash")?.remove();
          document.body.classList.add("shell-app");
          // Keep the synthetic owner shell visible while auth bootstrap runs in the background.
          const appShell=document.getElementById("appShell");
          const enforce=()=>{if(appShell.hidden)appShell.hidden=false;const auth=document.getElementById("authShell");if(!auth.hidden)auth.hidden=true;if(!document.body.classList.contains("shell-app"))document.body.classList.add("shell-app");};
          new MutationObserver(enforce).observe(appShell,{attributes:true,attributeFilter:["hidden"]});
          new MutationObserver(enforce).observe(document.body,{attributes:true,attributeFilter:["class"]});
          const spacer=document.createElement("div");
          spacer.style.height="1800px";
          spacer.dataset.testSpacer="true";
          document.querySelector("#appShell>.main").append(spacer);
          document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.dataset.page==="today"));
          document.getElementById("backBtn").hidden=true;
          document.getElementById("menuToggle").hidden=false;
        });
        await page.waitForFunction(()=>Boolean(window.TLEDrawer),{timeout:10000});
        const trigger=width<=860?"#menuToggle":"#drawerMenuButton";
        const initial=await page.evaluate(w=>{
          const main=document.querySelector("#appShell>.main");
          if(w<=860)main.scrollTop=150;
          else window.scrollTo(0,150);
          return w<=860?main.scrollTop:window.scrollY;
        },width);
        if(width>860)await page.evaluate(()=>document.getElementById("drawerMenuButton").click());
        else await page.locator(trigger).click({timeout:5000});
        // Wait for the 600ms spring to finish before measuring final alignment.
        await page.waitForTimeout(800);
        const open=await page.evaluate(()=>{
          const p=document.getElementById("sidebar"),b=document.getElementById("drawerCloseButton");
          const rect=p.getBoundingClientRect();
          return {
            open:p.classList.contains("open"),expanded:document.querySelector("#drawerMenuButton").getAttribute("aria-expanded"),
            ariaHidden:p.getAttribute("aria-hidden"),locked:window.TLEDrawer.isStopped,
            scrim:!document.getElementById("sidebarScrim").hidden,
            focused:document.activeElement===b,
            right:Math.abs(rect.right-innerWidth)<2, rightPx:rect.right, viewport:innerWidth, leftPx:rect.left, transform:getComputedStyle(p).transform, shellHidden:document.getElementById("appShell").hidden, bodyClass:document.body.className, cssDisplay:getComputedStyle(p).display,
            width:rect.width,
            overflow:document.documentElement.style.overflow
          };
        });
        assert.ok(open.open&&open.expanded==="true"&&open.ariaHidden==="false"&&open.locked&&open.scrim,engineName+" "+width+" not open "+JSON.stringify(open));
        assert.ok(open.right&&open.width<=370,engineName+" "+width+" not aligned right: "+JSON.stringify(open));
        assert.equal(open.overflow,"hidden");
        await page.waitForFunction(()=>document.activeElement===document.getElementById("drawerCloseButton"),{timeout:1500});
        await page.keyboard.press("Escape");
        await page.waitForTimeout(85); // Allow focus and scroll restoration across two frames.
        const closed=await page.evaluate(w=>({
          open:window.TLEDrawer.isOpen,
          scroll:w<=860?document.querySelector("#appShell>.main").scrollTop:window.scrollY,
          expanded:document.querySelector("#drawerMenuButton").getAttribute("aria-expanded"),
          hidden:document.getElementById("sidebarScrim").hidden
        }),width);
        assert.ok(!closed.open&&closed.expanded==="false"&&closed.hidden,engineName+" "+width+" not closed");
        assert.equal(closed.scroll,initial,engineName+" "+width+" scroll position not preserved");
        await page.evaluate(()=>{
          document.getElementById("backBtn").hidden=false;
          document.getElementById("menuToggle").hidden=true;
        });
        await page.locator("#drawerMenuButton").click({timeout:5000});
        assert.equal(await page.evaluate(()=>window.TLEDrawer.isOpen),true,engineName+" "+width+" nested view missing menu");
        await page.locator("#drawerCloseButton").click({timeout:5000});
        assert.equal(await page.evaluate(()=>window.TLEDrawer.isOpen),false,engineName+" "+width+" close button failed");
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
        assert.ok(!overflow,engineName+" "+width+" horizontal overflow");
        assert.ok(!errors.some(e=>/SyntaxError|ReferenceError/.test(e)),engineName+" "+width+" "+errors.join("; "));
        await page.close();
        console.log("DRAWER_R89_OK "+engineName+" "+width);
      }
    }finally{await browser.close();}
  }
}finally{server.close();}

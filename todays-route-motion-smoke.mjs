/* Today's Route r85 — isolated UI tests, no real customer data or network writes. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {chromium,webkit} from "playwright";
const root=process.cwd();
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,"http://127.0.0.1");
  const local=path.resolve(root,"."+ (url.pathname==="/"?"/index.html":url.pathname));
  if(!local.startsWith(root+path.sep)||!fs.existsSync(local)){res.writeHead(404);res.end();return;}
  const mime=local.endsWith(".css")?"text/css":local.endsWith(".js")?"application/javascript":"text/html";
  res.setHeader("Content-Type",mime);
  let content=fs.readFileSync(local);
  if(local.endsWith("index.html"))content=content.toString().replace(/<script\b[^>]*src="(?!\.\/todays-route-motion-r85\.js)[^"]*"[^>]*><\/script>/g,"");
  res.end(content);
});
await new Promise(resolve=>server.listen(4192,"127.0.0.1",resolve));
fs.mkdirSync("test-results/route",{recursive:true});
try{
  for(const [engineName,engine] of Object.entries({chromium,webkit})){
    const browser=await engine.launch({headless:true,args:engineName==="chromium"?["--no-sandbox"]:[]});
    try{
      for(const width of [390,768,1024,1366]){
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
        const errors=[];page.on("pageerror",e=>errors.push(String(e.message)));
        await page.goto("http://127.0.0.1:4192/",{waitUntil:"domcontentloaded"});
        await page.evaluate(()=>{
          document.body.className="shell-app";
          document.querySelectorAll("body > :not(#appShell)").forEach(el=>el.hidden=true);
          const app=document.querySelector("#appShell");app.hidden=false;
          document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.dataset.page==="route"));
          const appt=new Date(Date.now()+42*60000).toISOString();
          window.TLE_ROUTE_R85.render([{id:"safe-sample",starts_at:appt,status:"scheduled",service_address:"123 Example St",client_id:"c1",clients:{name:"Test Client",email:"test@example.com"},job_assignments:[{team_members:{name:"Crew A"}}]}],
            {contacts:{c1:{phone:"",email:"test@example.com"}},businessName:"Demo business",todayMiles:4.5});
        });
        await page.locator(".tle-route-screen").waitFor();
        const snapshot=await page.evaluate(()=>{
          const root=document.querySelector("#routeVisual");
          const rect=root.getBoundingClientRect();
          const map=root.querySelector("svg"),path=map.querySelector(".tle-route-path-base");
          const card=root.querySelector(".tle-route-sheet");
          const cardRect=card.getBoundingClientRect();
          const entire=document.documentElement;
          const eta=root.querySelector(".tle-route-eta-value");
          return {rect:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width},
            card:{left:cardRect.left,right:cardRect.right,width:cardRect.width},scrollWidth:entire.scrollWidth,
            viewport:innerWidth,mapHidden:map.getAttribute("aria-hidden"),pathLength:path.getTotalLength(),
            eta:eta.textContent,announces:eta.getAttribute("aria-live"),
            routeLabel:root.querySelector(".tle-route-map-caption").textContent,
            job:root.querySelector(".tle-route-contact-info strong").textContent,
            gps:!!root.querySelector("[data-best-route]"),
            stillExistingStops:!!document.querySelector("#routeStops"),count:root.querySelector(".tle-route-sheet-badge").textContent};
        });
        assert.deepEqual(errors,[],engineName+" "+width+" page script errors");
        assert.ok(snapshot.rect.left>=-1&&snapshot.rect.right<=width+1,engineName+" "+width+" map not in viewport "+JSON.stringify(snapshot));
        assert.ok(snapshot.card.width<=430+1,engineName+" "+width+" bottom sheet too wide");
        assert.equal(snapshot.mapHidden,"true",engineName+" "+width+" map must be decorative");
        assert.ok(snapshot.pathLength>150,engineName+" "+width+" route not drawn");
        assert.equal(snapshot.announces,"polite");
        assert.equal(snapshot.job,"Test Client");
        assert.ok(snapshot.routeLabel.toLowerCase().includes("not live")||snapshot.routeLabel.toLowerCase().includes("no es gps"),engineName+" "+width+" live route misrepresented");
        assert.ok(snapshot.gps&&snapshot.stillExistingStops);
        assert.ok(Number(snapshot.eta)>=40 && Number(snapshot.eta)<=43,engineName+" "+width+" scheduled countdown inaccurate");
        await page.screenshot({path:"test-results/route/"+engineName+"-"+width+".png"});
        await page.locator("[data-tle-route-contact='call']").click();
        await assert.equal(await page.locator(".tle-route-toast").textContent(),"No phone number saved for this client.");
        await page.evaluate(()=>window.TLE_ROUTE_R85.render([],{}));
        assert.equal(await page.locator(".tle-route-is-empty [data-tle-route-share]").isDisabled(),true);
        assert.equal(await page.locator(".tle-route-is-empty [data-best-route]").count(),0);
        await page.close();
        console.log("TODAYS_ROUTE_OK "+engineName+" "+width+" real schedule, map, controls, safety");
      }
    }finally{await browser.close();}
  }
}finally{server.close();}

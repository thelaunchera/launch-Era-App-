/* Regressions for 2026-10-17 navigation asset-cache coherence and sidebar routing.
   No login, network writes, or customer data are required. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const root=process.cwd(), html=fs.readFileSync('index.html','utf8'), sw=fs.readFileSync('service-worker.js','utf8'),app=fs.readFileSync('app.js','utf8'),boot=fs.readFileSync('boot.js','utf8');
const version=(app.match(/const APP_VERSION = "([^"]+)"/)||[])[1];
assert.ok(version && version!=='20261014-app-403-auth-copy-blue-r81','Previous navigation cache must be invalidated');
assert.ok(sw.includes('const CACHE_NAME="tle-cleaning-app-'+version+'"'),'Service worker cache version mismatch');
assert.ok(boot.includes('window.__tleShellVersion="'+version+'"'),'Shell worker registration version mismatch');
assert.ok(html.includes('./app.js?v='+version),'Main JS file must have matching cache-busting URL');
assert.ok(sw.includes('./app.js?v='+version),'Main JS precache must have matching cache-busting URL');
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
 const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html');
 fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(4198,'127.0.0.1',resolve));
try{
  for(const [name,engine] of Object.entries({chromium,webkit})){
    const browser=await engine.launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
    try{
      for(const width of [390,768,1024,1366]){
        const page=await browser.newPage({viewport:{width,height:880}});
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.goto('http://127.0.0.1:4198/?browser-smoke=1',{waitUntil:'domcontentloaded',timeout:30000});
        await page.waitForFunction(()=>window.__tleAuthUiReady===true,{timeout:15000});
        await page.evaluate(()=>{
          const app=document.querySelector('#appShell');app.hidden=false;
          document.querySelector('#authShell').hidden=true;
          document.body.classList.add('shell-app');
          document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.page==='today'));
        });
        if(width<=860){
          const drawer=await page.evaluate(()=>{
            const button=document.querySelector('#menuToggle');button.hidden=false;
            button.click();
            return {open:document.querySelector('#sidebar')?.classList.contains('open'),visible:document.querySelector('#sidebar')?.style.pointerEvents};
          });
          assert.ok(drawer.open,name+' '+width+' sidebar not opening '+JSON.stringify(drawer));
        }
        for(const section of ['calendar','route','settings','today']){
          await page.evaluate(id=>document.querySelector('#sidebar .nav-item[data-view="'+id+'"]')?.click(),section);
          const active=await page.evaluate(()=>document.querySelector('.view.active')?.dataset.page);
          assert.equal(active,section,name+' '+width+' sidebar '+section+' did not navigate; active='+active);
          const selected=await page.evaluate(id=>document.querySelector('#sidebar .nav-item[data-view="'+id+'"]')?.classList.contains('active'),section);
          assert.equal(selected,true,name+' '+width+' missing active nav highlight');
        }
        assert.ok(!errors.some(e=>/SyntaxError|ReferenceError|TypeError/.test(e)),name+' '+width+' JS errors '+JSON.stringify(errors));
        await page.close();
        console.log('SIDEBAR_HOTFIX_OK '+name+' '+width+' nav calendar/route/settings/today');
      }
    }finally{await browser.close();}
  }
}finally{server.close();}
console.log('SIDEBAR_CACHE_VERSION_OK '+version);

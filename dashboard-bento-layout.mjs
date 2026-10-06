import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const root=process.cwd();
// Layout fixture uses the real HTML and CSS without authentication or backend writes.
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':'text/html');
 let content=fs.readFileSync(file);
 if(file.endsWith('index.html')) content=content.toString().replace(/<script\b[^>]*src="(?!\.\/dashboard-home-v2\.js)[^"]*"[^>]*><\/script>/g,'');
 res.end(content);
});
await new Promise(resolve=>server.listen(4176,'127.0.0.1',resolve));
fs.mkdirSync('test-results/bento',{recursive:true});
try{
 for(const [engineName,engine] of Object.entries({chromium,webkit})){
 const browser=await engine.launch({headless:true,args:engineName==='chromium'?['--no-sandbox']:[]});
 try{
  for(const width of [320,390,768,1366]){
   const page=await browser.newPage({viewport:{width,height:900}});
   await page.goto('http://127.0.0.1:4176/?dashboard-preview=bento');
   await page.evaluate(()=>{
    document.body.className='shell-app';
    document.querySelectorAll('body > :not(#appShell)').forEach(el=>el.hidden=true);
    const shell=document.querySelector('#appShell');shell.hidden=false;
    document.querySelector('#todayHeroCard').classList.remove('is-loading');
    document.querySelector('#todayGreeting').textContent='Good morning';
    document.querySelector('#todayMomentCopy').textContent='Your day, all in one place.';
    document.querySelector('#todayHeroAction').disabled=false;
    document.querySelector('#todayHeroAction').textContent='View calendar';
    document.querySelector('#attentionList').classList.add('dashboard-attention-grid');
    for(const [name,count] of [['Bookings',2],['Quotes',1],['Invoices',3]]){
      const card=document.createElement('button');card.className='attention-summary-card';
      card.innerHTML=`<span class="attention-summary-icon">↗</span><strong>${name}</strong><span class="attention-summary-count">${count}</span><small>Waiting for review</small>`;
      document.querySelector('#attentionList').appendChild(card);
    }
   });
   const result=await page.evaluate(()=>({
    preview:document.documentElement.dataset.dashboardPreview,
    overflow:document.documentElement.scrollWidth>innerWidth+2,
    columns:getComputedStyle(document.querySelector('#businessPulse')).gridTemplateColumns.split(' ').length,
    quickColumns:getComputedStyle(document.querySelector('.dashboard-quick-grid')).gridTemplateColumns.split(' ').length,
    pulseCount:[...document.querySelectorAll('.pulse-card')].filter(el=>getComputedStyle(el).display!=='none').length,
    time:document.querySelector('.quick-time')?.dataset.jump,
    ids:[...document.querySelectorAll('[id]')].map(el=>el.id)
   }));
   assert.equal(result.preview,'bento');assert.equal(result.overflow,false,`${engineName} ${width}: overflow`);
   assert.equal(result.columns,width<=860?2:4);assert.equal(result.quickColumns,2);assert.equal(result.pulseCount,4);
   const domOrder=await page.evaluate(()=>[...document.querySelector('.view[data-page="today"]').children].filter(el=>el.matches('#todayHeroCard,.dashboard-quick-access,.money-week-head,#businessPulse,.attention-panel,.growth-grid')).map(el=>el.id||el.classList[0]));
   assert.deepEqual(domOrder,width<=860
     ? ['todayHeroCard','dashboard-section-head','businessPulse','panel','dashboard-grid','dashboard-quick-access']
     : ['todayHeroCard','dashboard-quick-access','dashboard-section-head','businessPulse','panel','dashboard-grid']);
   assert.equal(result.time,'time');assert.equal(new Set(result.ids).size,result.ids.length,'duplicate ids');
   // Permission gates must still win over display:grid/flex declarations.
   await page.evaluate(()=>document.querySelectorAll('[data-admin-only],[data-owner-only]').forEach(el=>el.hidden=true));
   assert.equal(await page.locator('.capacity-card').isVisible(),false);
   assert.equal(await page.locator('.attention-panel').isVisible(),false);
   await page.evaluate(()=>{
    document.querySelectorAll('[data-admin-only],[data-owner-only]').forEach(el=>el.hidden=false);
    const shell=document.querySelector('#appShell');shell.dataset.ownerCardPalette='true';
    shell.style.setProperty('--owner-card-bg','#e7f0ff');shell.style.setProperty('--owner-card-ink','#191919');
    document.querySelector('#todayHeroCard').dataset.celestial='night';
   });
   assert.equal(await page.locator('.pulse-card').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(231, 240, 255)');
   await page.screenshot({path:`test-results/bento/${engineName}-${width}.png`,fullPage:true});
   await page.goto('http://127.0.0.1:4176/');
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.dashboardPreview),undefined);
   assert.equal(await page.locator('.quick-time').count(),0);
   console.log(`BENTO_LAYOUT_OK ${engineName} ${width}: grid, overflow, permissions, owner palette, opt-in isolation`);
   await page.close();
  }
 }finally{await browser.close();}
 }
}finally{server.close();}

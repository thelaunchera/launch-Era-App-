import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const root=process.cwd();
// Visual fixture only: original app HTML/CSS; no login or backend writes.
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':'text/html');
 let content=fs.readFileSync(file);
 if(file.endsWith('index.html'))content=content.toString().replace(/<script\b[^>]*src="(?!\.\/dashboard-(?:home-v2|bento)\.js)[^"]*"[^>]*><\/script>/g,'');
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
    document.querySelector('#appShell').hidden=false;
    document.querySelector('#trialExpiryBanner').hidden=true;
    document.querySelector('#todayHeroCard').classList.remove('is-loading');
    document.querySelector('#todayHeroCard').dataset.celestial='day';
    document.querySelector('#todayGreeting').textContent='Good morning, Alex';
    document.querySelector('#todayMomentCopy').textContent='Your cleaning business, at a glance.';
    document.querySelector('#todayClockTime').textContent='9:41 AM';
    document.querySelector('#todayDatePill').textContent='Tue, Oct 6';
    document.querySelector('#todayHeroAction').disabled=false;
    document.querySelector('#todayHeroAction').textContent='View calendar';
    const counts=[2,4,3,0,3,2,1];const start=new Date('2026-10-05T00:00:00');
    const weekJobs=counts.flatMap((count,index)=>Array.from({length:count},()=>{const d=new Date(start);d.setDate(d.getDate()+index);d.setHours(10);return {starts_at:d.toISOString()};}));
    const activeTimer={clocked_in_at:new Date(Date.now()-5049000).toISOString(),jobs:{clients:{name:'Oakwood Residence'}}};
    window.__bentoFixture={weekJobs,weekStart:start,locale:'en-US',timeZone:'America/New_York',capacity:{available:true,percent:41},activeTimer,copy:{activity:'Weekly activity',jobs:'Scheduled jobs',timer:'Time tracker',manage:'Manage timer',idle:'No timer running.',running:'Running'}};
    window.TLE_BENTO_DASHBOARD.render(window.__bentoFixture);
    document.querySelector('#capacityPercent').textContent='41%';
    document.querySelector('#capacityMessage').textContent='41% booked · 18 hrs still open';
    document.querySelector('#pulseBooked').textContent='$1,850';
    document.querySelector('#pulseCollected').textContent='$1,120';
    document.querySelector('#pulseJobs').textContent='15';
    document.querySelector('#pulseNewClients').textContent='3';
    document.querySelector('#attentionList').classList.add('dashboard-attention-grid');
    for(const [name,count] of [['New requests',2],['Sent quotes',1],['Invoices due',3]]){
      const card=document.createElement('button');card.className='attention-summary-card';card.dataset.jump='booking';
      card.innerHTML=`<strong>${name}</strong><span class="attention-summary-count">${count}</span><small>Waiting for review</small>`;
      document.querySelector('#attentionList').appendChild(card);
    }
    document.querySelector('#todayTimeline').innerHTML='<div class="timeline-item"><time>9:00 AM</time><div><strong>Maple House</strong><span>Standard cleaning · 2h</span></div></div><div class="timeline-item"><time>1:00 PM</time><div><strong>Oakwood Residence</strong><span>Deep cleaning · 3h</span></div></div>';
   });
   const result=await page.evaluate(()=>({
    preview:document.documentElement.dataset.dashboardPreview,
    overflow:document.documentElement.scrollWidth>innerWidth+2||document.querySelector('.main').scrollWidth>document.querySelector('.main').clientWidth+2,
    columns:getComputedStyle(document.querySelector('#businessPulse')).gridTemplateColumns.split(' ').length,
    quickColumns:getComputedStyle(document.querySelector('.dashboard-quick-grid')).gridTemplateColumns.split(' ').length,
    pulseCount:[...document.querySelectorAll('.pulse-card')].filter(el=>getComputedStyle(el).display!=='none').length,
    ids:[...document.querySelectorAll('[id]')].map(el=>el.id),
    chartTotal:[...document.querySelectorAll('.bento-bar-value')].reduce((sum,el)=>sum+Number(el.textContent),0),
    elapsed:document.querySelector('#bentoTimerElapsed').textContent,
    arc:document.querySelector('#bentoCapacityArc').getAttribute('stroke-dasharray'),
    heroHeight:document.querySelector('#todayHeroCard').getBoundingClientRect().height
   }));
   assert.equal(result.preview,'bento');assert.equal(result.overflow,false,`${engineName} ${width}: overflow`);
   assert.equal(result.columns,width<=860?2:4);assert.equal(result.quickColumns,3);assert.equal(result.pulseCount,4);
   assert.equal(new Set(result.ids).size,result.ids.length,'duplicate ids');assert.equal(result.chartTotal,15);
   assert.match(result.elapsed,/^01:24:/);assert.equal(result.arc,'41 100');assert.ok(result.heroHeight<190,`greeting too large: ${result.heroHeight}`);
   const dom=await page.evaluate(()=>[...document.querySelector('.view[data-page="today"]').children].map(el=>el.id||el.classList[0]));
   assert.ok(dom.indexOf('todayHeroCard')<dom.indexOf('businessPulse'));assert.ok(dom.indexOf('businessPulse')<dom.indexOf('bentoActivityCard'));
   // A refresh derives elapsed time from the same persisted entry instead of restarting.
   await page.evaluate(()=>window.TLE_BENTO_DASHBOARD.render(window.__bentoFixture));
   assert.match(await page.locator('#bentoTimerElapsed').textContent(),/^01:24:/);
   await page.screenshot({path:`test-results/bento/${engineName}-${width}.png`,fullPage:true});
   await page.evaluate(()=>document.querySelectorAll('[data-admin-only],[data-owner-only]').forEach(el=>el.hidden=true));
   assert.equal(await page.locator('.capacity-card').isVisible(),false);assert.equal(await page.locator('.attention-panel').isVisible(),false);assert.equal(await page.locator('#bentoActivityCard').isVisible(),false);
   await page.evaluate(()=>{
    document.querySelectorAll('[data-admin-only],[data-owner-only]').forEach(el=>el.hidden=false);
    const shell=document.querySelector('#appShell');shell.dataset.ownerCardPalette='true';
    shell.style.setProperty('--owner-card-bg','#e7f0ff');shell.style.setProperty('--owner-card-ink','#191919');
    document.querySelector('#todayHeroCard').dataset.celestial='night';
    window.TLE_BENTO_DASHBOARD.render({...window.__bentoFixture,weekJobs:[],activeTimer:null,capacity:{available:false}});
   });
   assert.equal(await page.locator('.pulse-collected').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(231, 240, 255)');
   assert.equal(await page.locator('#bentoTimerElapsed').textContent(),'00:00:00');
   assert.equal(await page.locator('#bentoActivityTotal').textContent(),'0');
   await page.goto('http://127.0.0.1:4176/');
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.dashboardPreview),undefined);
   assert.equal(await page.locator('#bentoActivityCard').count(),0);assert.equal(await page.locator('#bentoTimerCard').count(),0);
   console.log(`BENTO_REFERENCE_OK ${engineName} ${width}: density, chart data, persisted timer, permissions, palette, opt-in isolation`);
   await page.close();
  }
 }finally{await browser.close();}
 }
}finally{server.close();}

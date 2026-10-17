/* Settings r84 fixture — no live authentication or backend writes. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const root=process.cwd();
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  const mime=file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':'text/html';
  res.setHeader('Content-Type',mime);
  let content=fs.readFileSync(file);
  if(file.endsWith('index.html'))content=content.toString().replace(/<script\b[^>]*src="(?!\.\/settings-screen-r84\.js)[^"]*"[^>]*><\/script>/g,'');
  res.end(content);
});
await new Promise(resolve=>server.listen(4191,'127.0.0.1',resolve));
fs.mkdirSync('test-results/settings',{recursive:true});
try{
  for(const [engineName,engine] of Object.entries({chromium,webkit})){
    const browser=await engine.launch({headless:true,args:engineName==='chromium'?['--no-sandbox']:[]});
    try{
      for(const width of [390,768,1024,1366]){
        const page=await browser.newPage({viewport:{width,height:900}});
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.goto('http://127.0.0.1:4191/');
        await page.evaluate(()=>{
          document.body.className='shell-app';
          document.querySelectorAll('body > :not(#appShell)').forEach(el=>el.hidden=true);
          const app=document.querySelector('#appShell');app.hidden=false;
          document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.dataset.page==='settings'));
        });
        await page.waitForTimeout(150);
        const diag=await page.evaluate(()=>({view:!!document.querySelector('#appShell .view[data-page="settings"]'),active:document.querySelector('#appShell .view[data-page="settings"]')?.classList.contains('active'),panels:document.querySelector('#appShell .view[data-page="settings"] .settings-grid')?.children.length,ready:document.querySelector('#appShell .view[data-page="settings"]')?.dataset.tleGroupedSettings,source:[...document.scripts].filter(s=>s.src.includes('settings-screen-r84')).map(s=>s.src),frame:!!document.querySelector('.tle-settings-frame')}));
        assert.ok(diag.frame,engineName+' '+width+' settings did not mount '+JSON.stringify(diag)+' errors='+JSON.stringify(errors));
        await page.screenshot({path:'test-results/settings/'+engineName+'-'+width+'.png'});
        assert.deepEqual(errors,[],engineName+' '+width+' JS errors');
        const shape=await page.evaluate(()=>{
          const frame=document.querySelector('.tle-settings-frame');
          const list=document.querySelector('.tle-settings-list');
          const groups=[...document.querySelectorAll('.tle-settings-group')];
          const grid=document.querySelector('.settings-grid.settings-simple-grid');
          return {frameRight:frame.getBoundingClientRect().right,frameLeft:frame.getBoundingClientRect().left,
            width:innerWidth,groupCount:groups.length,rowCount:document.querySelectorAll('[data-setting]').length,
            panelCount:grid.children.length,bodyOverflow:document.documentElement.scrollWidth>innerWidth+2,
            profileHeight:document.querySelector('.tle-settings-profile').getBoundingClientRect().height,
            searchHeight:document.querySelector('.tle-settings-search').getBoundingClientRect().height,
            listScroll:list.scrollHeight>=list.clientHeight};
        });
        assert.ok(shape.frameRight<=shape.width+1 && shape.frameLeft>=-1,engineName+' '+width+' settings offscreen');
        assert.equal(shape.bodyOverflow,false,engineName+' '+width+' body horizontal overflow');
        assert.equal(shape.panelCount,9,engineName+' '+width+' existing panels not preserved');
        assert.equal(shape.groupCount,4,engineName+' '+width+' grouped sections missing');
        assert.ok(shape.profileHeight>=80 && shape.searchHeight>=40,engineName+' '+width+' inputs too compact');
        await page.locator('.tle-settings-row[data-setting="notifications"]').click();
        assert.equal(await page.locator('#tleSettingsDetail').getAttribute('aria-hidden'),'false');
        assert.equal(await page.locator('.settings-notification-card.tle-current-panel').count(),1);
        assert.ok(await page.locator('#editNotificationPreferencesBtn').count()===1);
        assert.ok(await page.locator('.tle-settings-aux-group').count()===1);
        await page.locator('#tleSettingsBack').click();
        assert.equal(await page.locator('#tleSettingsDetail').getAttribute('aria-hidden'),'true');
        await page.locator('.tle-settings-row[data-setting="payments"]').click();
        assert.ok(await page.locator('.tle-current-panel [data-edit-payment-preferences]').count()===1);
        await page.locator('#tleSettingsBack').click();
        await page.locator('#tleSettingsSearch').fill('notific');
        assert.ok(await page.locator('.tle-settings-row[data-setting="notifications"]').isVisible());
        assert.equal(await page.locator('.tle-settings-row[data-setting="booking"]').isVisible(),false);
        await page.locator('#tleSettingsSearch').fill('');
        assert.ok(await page.locator('.tle-settings-row[data-setting="booking"]').isVisible());
        await page.close();
        console.log('SETTINGS_R84_OK '+engineName+' '+width+' grouped, accessible, preserved settings, no overflow');
      }
    }finally{await browser.close();}
  }
}finally{server.close();}

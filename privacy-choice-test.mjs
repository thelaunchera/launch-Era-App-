import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';

const source=fs.readFileSync('privacy-controls.js','utf8');
const dom=new JSDOM('<html lang="en"><head></head><body><div id="appShell" hidden><button data-privacy-settings>Hidden settings</button></div><script data-site="cleaning">'+source+'</script></body></html>',{url:'https://app.thelaunchera.com/',runScripts:'dangerously'});
dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
const w=dom.window;
w.document.querySelector('[data-reject]').click();
const opener=w.document.querySelector('.privacy-settings-float');
assert(opener&&!opener.closest('[hidden]'),'Signed-out and public users need a reachable settings opener');
opener.click();assert.equal(w.document.querySelector('.privacy-notice').hidden,false);
w.document.querySelector('[data-accept]').click();assert.equal(w.TLEPrivacy.allowed(),true);
opener.click();w.document.querySelector('[data-reject]').click();assert.equal(w.TLEPrivacy.allowed(),false);
dom.window.close();

for(const file of ['public.js','public-welcome.js']){
 const text=fs.readFileSync(file,'utf8');
 const start=text.indexOf('  async function track(){');
 const end=text.indexOf('  window.addEventListener("tle:privacy-change"',start);
 assert(start>=0&&end>start);
 let allowed=false,ids=0;const calls=[];
 const context={window:{TLEPrivacy:{allowed:()=>allowed},URL},URL:file==='public.js'?'https://example.invalid':URL,SUPABASE_URL:'https://example.invalid',KEY:'test',mode:'book',
  visitorId:()=>{ids++;return 'fixture';},localStorage:{getItem(){ids++;return null;}},crypto:{randomUUID:()=> 'fixture'},
  document:{referrer:'https://referrer.invalid/?email=private#token'},navigator:{userAgent:'fixture'},fetch:async(...args)=>{calls.push(args);return {ok:true};}};
 const track=vm.runInNewContext(text.slice(start,end)+'\ntrack;',context);
 await track();assert.equal(calls.length,0,file+' must not send statistics before consent');assert.equal(ids,0,file+' must not create/read visitor IDs before consent');
 allowed=true;await track();assert.equal(calls.length,1,file+' allows current-page measurement after consent');
 assert.equal(JSON.parse(calls[0][1].body).referrer,'https://referrer.invalid','Referrer must exclude private query/hash');
 allowed=false;await track();assert.equal(calls.length,1,file+' stops on withdrawal');
}
{
 const text=fs.readFileSync('app.js','utf8');
 const start=text.indexOf('function trackFunnelStep('),end=text.indexOf('window.addEventListener("tle:privacy-change"',start);
 let allowed=false;const store=new Map(),visits=[];
 const context={window:{TLEPrivacy:{allowed:()=>allowed}},sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},trackVisit:async path=>visits.push(path)};
 const track=vm.runInNewContext(text.slice(start,end)+'\ntrackFunnelStep;',context);
 await track('/funnel/signup-viewed');assert.equal(store.size,0,'Denied events must not mark deduplication state');
 allowed=true;await track('/funnel/signup-viewed');await track('/funnel/signup-viewed');
 assert.deepEqual(visits,['/funnel/signup-viewed'],'A consenting current form view is measured once');
 const listener=text.slice(end,text.indexOf('function funnelStepLabel',end));let callback;
 context.window.addEventListener=(_,fn)=>callback=fn;context.window.__tlePublicHandled=false;
 context.appShell={hidden:true};context.authPanel={hidden:false};context.state={authMode:'signup'};
 context.trackFunnelStep=path=>visits.push(path);
 vm.runInNewContext(listener,context);callback();assert.equal(visits.at(-1),'/funnel/signup-viewed','Opt-in measures the current form without replaying past interactions');
}
console.log('PRIVACY_CHOICE_OK: public trackers, no denied IDs/events, withdrawal, reachable signed-out settings and current-view funnel.');

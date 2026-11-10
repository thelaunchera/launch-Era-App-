import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('./app.js', import.meta.url),'utf8');
const html=readFileSync(new URL('./index.html', import.meta.url),'utf8');
const css=readFileSync(new URL('./styles.css', import.meta.url),'utf8');

function section(name,next){
  const start=source.indexOf('function '+name+'(');
  const end=source.indexOf('\nfunction '+next+'(',start+1);
  assert.ok(start>=0 && end>start,'missing '+name);
  return source.slice(start,end);
}

const memoryCode=[
 section('workspaceResumeStorageKey','readWorkspaceResume'),
 section('readWorkspaceResume','persistWorkspaceResume'),
 section('persistWorkspaceResume','canRestoreWorkspaceView'),
 section('canRestoreWorkspaceView','saveWorkspaceView')
].join('\n');

function setup(){
  const store=new Map();
  const state={business:{id:'business-a'},session:{user:{id:'user-a'}}};
  const navHistory=['today','clients'];
  let now=1_800_000_000_000;
  const views=['today','clients','booking','invoices'];
  const context={
    state, navHistory,
    WORKSPACE_RESUME_MS:2*60*60*1000,
    Date:{now:()=>now},
    localStorage:{
      getItem:key=>store.get(key)??null,
      setItem:(key,value)=>store.set(key,String(value)),
      removeItem:key=>store.delete(key)
    },
    $$:selector=>selector==='.view'
      ?views.map(page=>({dataset:{page}}))
      :views.map(view=>({dataset:{view},hidden:false}))
  };
  vm.createContext(context);
  vm.runInContext(memoryCode,context);
  return {context,store,state,setNow:value=>{now=value;}};
}

test('recovers last view, scroll and history only within 2 hours',()=>{
  const {context,setNow}=setup();
  context.persistWorkspaceResume('booking',284);
  setNow(1_800_000_000_000+60*60*1000);
  const found=context.readWorkspaceResume();
  assert.equal(found.view,'booking');
  assert.equal(found.scrollTop,284);
  assert.deepEqual(Array.from(found.history),['today','clients']);
  setNow(1_800_000_000_000+2*60*60*1000);
  assert.equal(context.readWorkspaceResume(),null);
});

test('keeps customer workspaces and users strictly separate',()=>{
  const {context,state}=setup();
  context.persistWorkspaceResume('invoices',55);
  state.business.id='business-b';
  assert.equal(context.readWorkspaceResume(),null);
  state.business.id='business-a';
  state.session.user.id='user-b';
  assert.equal(context.readWorkspaceResume(),null);
  state.session.user.id='user-a';
  assert.equal(context.readWorkspaceResume().view,'invoices');
});

test('rejects hidden, unauthorized or no-longer-existing views',()=>{
  const {context,store}=setup();
  context.persistWorkspaceResume('booking',0);
  const key=context.workspaceResumeStorageKey();
  const payload=JSON.parse(store.get(key));
  payload.view='does-not-exist';
  store.set(key,JSON.stringify(payload));
  assert.equal(context.readWorkspaceResume(),null);
});

test('saves at pagehide and keeps browser Back, in-app Back and Close available',()=>{
  assert.match(source,/window\.addEventListener\("pagehide",\(\)=>\{\s*rememberWorkspacePosition\(\)/);
  assert.match(source,/document\.visibilityState==="hidden"\) rememberWorkspacePosition\(\)/);
  assert.match(source,/syncWorkspaceBrowserHistory\(id,options\)/);
  assert.match(source,/window\.addEventListener\("popstate",event=>/);
  assert.match(source,/history\.back\(\)/);
  assert.match(source,/workspaceCloseBtn\.addEventListener\("click"/);
  assert.match(source,/const OWNER_HOME_IDLE_MS = 2 \* 60 \* 60 \* 1000/);
  assert.match(html,/id="workspaceCloseBtn"[^>]*aria-label="Close this view and return to Today"/);
  assert.match(css,/\.back-btn\[hidden\]\{display:none!important\}/);
});

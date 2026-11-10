import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const appBytes=readFileSync(new URL("./app.js",import.meta.url));
const app=appBytes.toString("utf8");
const resume=readFileSync(new URL("./workspace-resume.js",import.meta.url),"utf8");
const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
const boot=readFileSync(new URL("./boot.js",import.meta.url),"utf8");
const sw=readFileSync(new URL("./service-worker.js",import.meta.url),"utf8");
const release="20261110-nav-resume-r1";
const path="./workspace-resume.js?v="+release;

test("authenticated workspace resumes user+business screen history and scroll for two hours",()=>{
 assert.match(resume,/TWO_HOURS=2\*60\*60\*1000/);
 assert.match(app,/tle_last_workspace_view_v2/);
 assert.match(app,/state\.business\?\.id/);
 assert.match(app,/state\.session\?\.user\?\.id/);
 assert.match(resume,/stack:history\.slice\(-24\),positions:clean/);
 assert.match(resume,/age<0\|\|age>TWO_HOURS/);
 assert.match(resume,/item\.stack\.filter\(allows\)/);
 assert.match(app,/restoreWorkspaceView\(\);/);
 assert.match(resume,/window\.addEventListener\("pagehide",remember\)/);
 assert.match(resume,/document\.addEventListener\("visibilitychange"/);
 assert.match(app,/const view=\$\$\("\.view"\)\.find/);
});

test("Back keeps prior views; Close is explicit; signout clears history",()=>{
 assert.match(app,/let previous=navHistory\.pop\(\)\|\|"today"/);
 assert.match(app,/workspaceCloseBtn\?\.addEventListener\("click"/);
 assert.match(app,/localStorage\.removeItem\(workspaceViewStorageKey\(\)\)/);
 assert.match(html,/id="workspaceCloseBtn"[^>]*hidden/);
 assert.match(app,/OWNER_HOME_IDLE_MS = 2 \* 60 \* 60 \* 1000/);
});

test("PWA loads navigation module before main runtime and cache versions match",()=>{
 for(const source of [app,html,boot,sw]) assert.ok(source.includes(release));
 assert.ok(html.indexOf(path)<html.indexOf("./app.js?v="+release));
 assert.ok(sw.includes(path));
 assert.match(sw,/tle-cleaning-app-20261110-nav-resume-r1/);
 assert.match(boot,/__tleShellVersion="20261110-nav-resume-r1"/);
 assert.ok(appBytes.length<525000,"app.js must remain within its size guardrail");
});

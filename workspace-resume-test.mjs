import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
const boot=readFileSync(new URL("./boot.js",import.meta.url),"utf8");
const sw=readFileSync(new URL("./service-worker.js",import.meta.url),"utf8");
const release="20261110-nav-resume-r1";

test("private workspace restores same user, business, view and scroll within two hours",()=>{
 assert.match(app,/WORKSPACE_RESUME_MS=2\*60\*60\*1000/);
 assert.match(app,/tle_last_workspace_view_v2/);
 assert.match(app,/state\.business\?\.id/);
 assert.match(app,/state\.session\?\.user\?\.id/);
 assert.match(app,/stack:navHistory\.slice\(-24\),positions/);
 assert.match(app,/age<0\|\|age>WORKSPACE_RESUME_MS/);
 assert.match(app,/saved\.stack\.filter\(canRestoreWorkspaceView\)/);
 assert.match(app,/restoreWorkspaceView\(\);/);
 assert.match(app,/window\.addEventListener\("pagehide",rememberWorkspacePosition\)/);
 assert.match(app,/document\.addEventListener\("visibilitychange"/);
});
test("Back returns to prior view, Close is explicit, and sign-out forgets it",()=>{
 assert.match(app,/let previous=navHistory\.pop\(\)\|\|"today"/);
 assert.match(app,/workspaceCloseBtn\?\.addEventListener\("click"/);
 assert.match(app,/localStorage\.removeItem\(workspaceViewStorageKey\(\)\)/);
 assert.match(html,/id="workspaceCloseBtn"[^>]*hidden/);
 assert.match(app,/OWNER_HOME_IDLE_MS = 2 \* 60 \* 60 \* 1000/);
});
test("PWA cache and app release versions are in sync",()=>{
 for(const source of [app,html,boot,sw]) assert.ok(source.includes(release));
 assert.match(sw,/tle-cleaning-app-20261110-nav-resume-r1/);
 assert.match(boot,/__tleShellVersion="20261110-nav-resume-r1"/);
});

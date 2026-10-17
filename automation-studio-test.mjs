import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
const read=path=>readFileSync(path,"utf8");
const html=read("index.html"),script=read("automation-studio.js"),
 css=read("styles/automation-studio.css"),sw=read("service-worker.js"),
 followups=read("followups.js"),migration=read("docs/follow-up-optional-sequences.sql");
new Script(script,{filename:"automation-studio.js"});
assert.match(html,/automation-studio\.js\?v=/,"Automations JS must load");
assert.match(html,/styles\/automation-studio\.css\?v=/,"Automations CSS must load");
assert.ok(html.indexOf("followups.js?v=")<html.indexOf("automation-studio.js?v="),
 "Automation Studio must start after existing Follow-ups module");
assert.match(sw,/\.\/automation-studio\.js\?v=/,"Offline cache missing JS");
assert.match(sw,/\.\/styles\/automation-studio\.css\?v=/,"Offline cache missing CSS");
assert.match(followups,/TLE_AUTOMATION_STUDIO\?\.refresh/,"Existing Follow-ups must sync automation UI");
for(const cat of ["leads","estimates","jobs"])assert.ok(script.includes(cat),"Missing "+cat+" category");
assert.match(script,/state\.ready=false/,"Extra stages must be disabled until protected rules load");
assert.match(script,/mode\(kind\)==="auto"/,"Extra stages must never bypass the existing auto-email switch");
assert.match(script,/confirm\(/,"Turning on additional real-customer emails must require confirmation");
assert.match(script,/get_follow_up_sequence_rules/,"Read must use tenant-authorized RPC");
assert.match(script,/save_follow_up_sequence_rule/,"Write must use tenant-authorized RPC");
assert.ok(!script.includes("service_role"),"Owner UI may not include service keys");
assert.match(css,/@media\(max-width:620px\)/,"Phone styles missing");
assert.match(css, /focus-visible/,"Keyboard focus styles missing");
assert.match(migration,/create table if not exists public\.follow_up_sequence_audit/i);
assert.match(migration,/not exists \(/i,"Duplicate prevention missing");
assert.match(migration,/revoke all on public\.follow_up_sequence_rules from public,anon,authenticated/i);
assert.match(migration,/states\.sent_count=rules\.stage-1/,"Only allow the next sequence step");
assert.match(migration,/rules\.enabled=true/,"Optional steps must default off");
console.log("PASS: Automation Studio UI, tenant-safe RPC and opt-in sequence invariants.");

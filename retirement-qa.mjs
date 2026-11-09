/** Non-destructive retirement guard. Existing account sign-in and recovery are preserved. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app=readFileSync('app.js','utf8');
const html=readFileSync('index.html','utf8');
const worker=readFileSync('service-worker.js','utf8');
assert.match(app,/const CLEANING_APP_NEW_SALES_CLOSED = true;/);
assert.match(app,/if\(CLEANING_APP_NEW_SALES_CLOSED && mode==="signup"\) mode="signin";/);
assert.match(app,/if\(CLEANING_APP_NEW_SALES_CLOSED && state\.authMode==="signup"\)/);
assert.match(app,/if\(CLEANING_APP_NEW_SALES_CLOSED\)\{\s*setBusinessSetupStatus\("New Cleaning App workspaces/);
assert.match(app,/async function startSubscriptionCheckout\(button\)\{\s*if\(CLEANING_APP_NEW_SALES_CLOSED\)/);
assert.match(app,/auth\.signInWithPassword/);
assert.match(app,/auth\.updateUser\(\{password\}\)/);
assert.match(html,/Existing customers only/);
assert.match(html,/#authWelcomeStart,#authSwitch,#authPlanNote,#trialSubscribeBtn/);
assert.match(html,/app\.js\?v=20261108-retired-offer-r1/);
assert.match(worker,/tle-cleaning-app-retired-offer-20261108-r1/);
assert.match(worker,/app\.js\?v=20261108-retired-offer-r1/);
console.log('PASS: new sign-ups, workspace trials and app subscription checkout blocked; historical sign-in/recovery retained.');

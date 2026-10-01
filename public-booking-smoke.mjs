import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";

const root=process.cwd();
const mime={
  ".html":"text/html; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".webmanifest":"application/manifest+json",
  ".svg":"image/svg+xml"
};

const server=http.createServer((req,res)=>{
  const u=new URL(req.url,"http://127.0.0.1");
  let p=decodeURIComponent(u.pathname);
  if(p==="/") p="/index.html";
  const file=path.join(root,p.replace(/^\//,""));
  if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){
    res.writeHead(404);res.end("not found");return;
  }
  res.setHeader("Content-Type",mime[path.extname(file)]||"application/octet-stream");
  res.setHeader("Cache-Control","no-store");
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(4176,"127.0.0.1",resolve));

const businessConfig={
  business:{
    name:"Bright Home Cleaning",
    locale_code:"en-US",
    currency_code:"USD",
    default_language:"en",
    customer_email_language:"en",
    timezone:"America/New_York",
    country_code:"US"
  },
  services:[
    {
      id:"11111111-1111-4111-8111-111111111111",
      name:"Standard Home Cleaning",
      description:"Routine residential cleaning for homes and apartments.",
      pricing_type:"flat",
      base_price:129,
      duration_minutes:120
    },
    {
      id:"22222222-2222-4222-8222-222222222222",
      name:"Office Cleaning",
      description:"Recurring commercial cleaning for offices and workspaces.",
      pricing_type:"flat",
      base_price:189,
      duration_minutes:150
    },
    {
      id:"33333333-3333-4333-8333-333333333333",
      name:"Post-Construction Commercial Cleaning",
      description:"Custom commercial cleanup after construction or renovation.",
      pricing_type:"quote_required",
      base_price:0,
      duration_minutes:180
    },
    {
      id:"44444444-4444-4444-8444-444444444444",
      name:"Large Home Custom Cleaning",
      description:"Custom residential cleaning for larger homes.",
      pricing_type:"quote_required",
      base_price:0,
      duration_minutes:180
    }
  ],
  addons:[
    {id:"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",service_id:"11111111-1111-4111-8111-111111111111",name:"Inside oven",price:25,extra_duration_minutes:20},
    {id:"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",service_id:"22222222-2222-4222-8222-222222222222",name:"Interior glass",price:40,extra_duration_minutes:25},
    {id:"cccccccc-cccc-4ccc-8ccc-cccccccccccc",service_id:"33333333-3333-4333-8333-333333333333",name:"Post-construction detail",price:0,extra_duration_minutes:0}
  ]
};

const profiles=[
  {name:"Safari iPhone",engine:"webkit",viewport:{width:390,height:844}},
  {name:"Safari iPad",engine:"webkit",viewport:{width:820,height:1180}},
  {name:"Android Chrome",engine:"chromium",viewport:{width:412,height:915}},
  {name:"Chrome Desktop",engine:"chromium",viewport:{width:1366,height:768}},
  {name:"Firefox Desktop",engine:"firefox",viewport:{width:1366,height:768}}
];
const engines={chromium,firefox,webkit};

async function mockBackend(context,calls){
  let changeSubmitted=false;
  await context.route("https://bowacxhmjvrqixtwaikv.supabase.co/**",async route=>{
    const url=new URL(route.request().url());
    const pathname=url.pathname;
    calls.push(pathname);
    let body={};
    if(pathname.includes("get_public_booking_config")) body=businessConfig;
    else if(pathname.includes("get_public_available_slots")){
      body=[
        {slot_start:"2026-10-05T14:00:00.000Z"},
        {slot_start:"2026-10-05T16:30:00.000Z"}
      ];
    }else if(pathname.includes("get_public_job_change_context")){
      body={
        business_name:"Bright Home Cleaning",
        timezone:"America/New_York",
        default_language:"en",
        locale_code:"en-US",
        customer_name:"Jamie",
        customer_language:"en",
        service_name:"Standard Home Cleaning",
        starts_at:"2026-10-05T14:00:00.000Z",
        duration_minutes:120,
        service_address:"123 Main St",
        job_status:"scheduled",
        can_change:true,
        change_request:changeSubmitted?{
          id:"aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
          status:"requested",
          requested_start_at:"2026-10-06T15:00:00.000Z",
          reason:"Schedule changed",
          requested_at:"2026-10-01T20:00:00.000Z"
        }:null
      };
    }else if(pathname.includes("get_public_job_reschedule_slots")){
      body=[
        {slot_start:"2026-10-06T15:00:00.000Z"},
        {slot_start:"2026-10-06T17:00:00.000Z"}
      ];
    }else if(pathname.includes("submit_public_job_change_request")){
      changeSubmitted=true;
      body="aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa";
    }else if(pathname.includes("/functions/v1/track-app-visit")) body={ok:true};
    else body={};
    await route.fulfill({
      status:200,
      contentType:"application/json",
      headers:{"Access-Control-Allow-Origin":"*"},
      body:JSON.stringify(body)
    });
  });
}

async function assertNoOverflow(page,profile,label){
  const size=await page.evaluate(()=>({
    scrollWidth:document.documentElement.scrollWidth,
    innerWidth:window.innerWidth
  }));
  if(size.scrollWidth>size.innerWidth+4){
    throw new Error(profile.name+": "+label+" horizontal overflow "+JSON.stringify(size));
  }
}

async function runProfile(profile){
  const browser=await engines[profile.engine].launch({headless:true});
  try{
    const context=await browser.newContext({
      viewport:profile.viewport,
      isMobile:profile.viewport.width<=860,
      hasTouch:profile.viewport.width<=860,
      serviceWorkers:"block"
    });
    const backendCalls=[];
    await mockBackend(context,backendCalls);
    const page=await context.newPage();
    const runtimeErrors=[];
    page.on("pageerror",err=>runtimeErrors.push("pageerror: "+String(err)));
    page.on("console",msg=>{ if(msg.type()==="error"||msg.type()==="warning") runtimeErrors.push(msg.type()+": "+msg.text()); });
    page.on("request",req=>{
      if(req.url().includes("supabase.co")) backendCalls.push("request:"+new URL(req.url()).pathname);
    });

    await page.goto("http://127.0.0.1:4176/?public=book&slug=smoke-cleaning",{
      waitUntil:"domcontentloaded",
      timeout:20000
    });
    await page.waitForSelector("#publicShell",{state:"visible",timeout:10000});
    await page.waitForFunction(()=>document.querySelectorAll("#publicServiceCards [data-service-card]").length>0,null,{timeout:10000});

    const header=await page.locator("#publicHeaderBusinessName").textContent();
    if(!header.includes("Bright Home Cleaning")) throw new Error(profile.name+": business branding did not load");

    const promoClutter=await page.evaluate(()=>({
      hasBack:Boolean(document.querySelector("#publicBackBtn")),
      hasSecure:document.body.textContent.includes("Secure request"),
      hasPromoChips:document.body.textContent.includes("Clear service options")||document.body.textContent.includes("Mobile friendly"),
      intro:document.querySelector("#publicIntro")?.textContent.trim()||""
    }));
    if(promoClutter.hasBack||promoClutter.hasSecure||promoClutter.hasPromoChips){
      throw new Error(profile.name+": demo/promotional clutter is still visible "+JSON.stringify(promoClutter));
    }
    if(promoClutter.intro.includes("upfront pricing")){
      throw new Error(profile.name+": confusing upfront-pricing copy is still visible");
    }

    const bookResidentialCards=await page.locator("#publicServiceCards [data-service-card]").allTextContents();
    if(!bookResidentialCards.some(x=>x.includes("Standard Home Cleaning"))){
      throw new Error(profile.name+": residential booking service card missing");
    }
    if(bookResidentialCards.some(x=>x.includes("Office Cleaning"))){
      throw new Error(profile.name+": commercial service leaked into residential booking");
    }

    const firstBookCard=page.locator("#publicServiceCards [data-service-card]").first();
    await firstBookCard.click();
    if(!(await firstBookCard.evaluate(el=>el.classList.contains("selected")))){
      throw new Error(profile.name+": booking service card cannot be selected");
    }

    const weeklyFrequency=page.locator('#publicFrequencyPills [data-frequency="weekly"]');
    await weeklyFrequency.click();
    const recurrenceValue=await page.locator("#publicRecurrencePattern").inputValue();
    if(recurrenceValue!=="weekly"){
      throw new Error(profile.name+": frequency pills do not work before changing property type");
    }
    if(!(await weeklyFrequency.evaluate(el=>el.classList.contains("selected")))){
      throw new Error(profile.name+": selected frequency pill is not visually active");
    }

    const date=page.locator('#publicRequestForm input[name="date"]');
    await date.evaluate(el=>{
      el.value="2026-10-05";
      el.dispatchEvent(new Event("input",{bubbles:true}));
      el.dispatchEvent(new Event("change",{bubbles:true}));
    });
    try{
      await page.waitForFunction(()=>document.querySelectorAll("#publicSlots [data-slot]").length>0,null,{timeout:7000});
    }catch(err){
      const diag=await page.evaluate(()=>({
        service:document.querySelector("#publicService")?.value||"",
        date:document.querySelector('#publicRequestForm input[name="date"]')?.value||"",
        slots:document.querySelector("#publicSlots")?.innerHTML||"",
        slotsHidden:Boolean(document.querySelector("#publicSlotsWrap")?.hidden),
        appError:document.documentElement.dataset.appError||""
      }));
      throw new Error(profile.name+": slots did not render · "+JSON.stringify(diag)+" · calls="+backendCalls.join(",")+" · runtime="+runtimeErrors.join(" | ")+" · "+err.message);
    }
    const slot=page.locator("#publicSlots [data-slot]").first();
    await slot.click();
    if(!(await slot.evaluate(el=>el.classList.contains("selected")))){
      throw new Error(profile.name+": availability slot cannot be selected");
    }

    const residentialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    if(!String(residentialHero||"").includes("10161222")) throw new Error(profile.name+": residential hero is not a no-people home interior");
    const residentialSummary=await page.locator("#publicSummary img").getAttribute("src");
    await assertNoOverflow(page,profile,"residential booking");

    await page.locator('[data-property-type="commercial"]').click();
    await page.waitForFunction(()=>document.querySelector("#publicPropertyType")?.value==="commercial",null,{timeout:3000});
    const commercialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    if(commercialHero===residentialHero) throw new Error(profile.name+": commercial hero photo did not change");
    if(!String(commercialHero||"").includes("7534224")) throw new Error(profile.name+": commercial hero is not an office/building interior");

    const commercialBookCards=await page.locator("#publicServiceCards [data-service-card]").allTextContents();
    if(!commercialBookCards.some(x=>x.includes("Office Cleaning"))){
      throw new Error(profile.name+": commercial booking service card missing");
    }
    if(commercialBookCards.some(x=>x.includes("Standard Home Cleaning"))){
      throw new Error(profile.name+": residential service leaked into commercial booking");
    }
    await page.locator("#publicServiceCards [data-service-card]").first().click();
    const commercialSummary=await page.locator("#publicSummary img").getAttribute("src");
    if(commercialSummary===residentialSummary) throw new Error(profile.name+": commercial summary photo did not change");
    await assertNoOverflow(page,profile,"commercial booking");

    await page.locator("#publicQuoteTab").click();
    await page.waitForFunction(()=>document.querySelector("#publicQuoteTab")?.classList.contains("active"),null,{timeout:3000});
    const quoteCommercialCards=await page.locator("#publicServiceCards [data-service-card]").allTextContents();
    if(!quoteCommercialCards.some(x=>x.includes("Post-Construction Commercial Cleaning"))){
      throw new Error(profile.name+": commercial quote service missing");
    }
    await page.locator("#publicServiceCards [data-service-card]").first().click();
    const quoteAddonWrap=page.locator("#publicAddonsWrap");
    if(await quoteAddonWrap.evaluate(el=>el.hidden)){
      throw new Error(profile.name+": quote add-ons are hidden");
    }
    const quoteRecurrenceWrap=page.locator("#publicRecurrenceWrap");
    if(await quoteRecurrenceWrap.evaluate(el=>el.hidden)){
      throw new Error(profile.name+": quote frequency is hidden");
    }
    const quoteAddon=page.locator('#publicAddons input[name="addon"]').first();
    if(await quoteAddon.count()===0) throw new Error(profile.name+": quote add-on is missing");
    await quoteAddon.check();
    const quoteAddonCopy=await quoteAddon.locator("xpath=..").textContent();
    if(!quoteAddonCopy.includes("Include in quote")){
      throw new Error(profile.name+": quote add-on copy is missing");
    }
    const quoteCommercialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    if(quoteCommercialHero!==commercialHero) throw new Error(profile.name+": hero changed when switching Book/Quote instead of staying commercial");
    await assertNoOverflow(page,profile,"commercial quote");

    await page.locator('[data-property-type="residential"]').click();
    const quoteResidentialCards=await page.locator("#publicServiceCards [data-service-card]").allTextContents();
    if(!quoteResidentialCards.some(x=>x.includes("Large Home Custom Cleaning"))){
      throw new Error(profile.name+": residential quote service missing");
    }
    const quoteResidentialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    if(quoteResidentialHero!==residentialHero) throw new Error(profile.name+": residential hero should stay the same across Book/Quote");
    if(quoteResidentialHero===quoteCommercialHero) throw new Error(profile.name+": Residential/Commercial hero photos must differ");
    await assertNoOverflow(page,profile,"residential quote");

    if(profile.viewport.width<=900){
      const layout=await page.evaluate(()=>({
        viewport:window.innerWidth,
        formWidth:document.querySelector(".public-demo-booking-form")?.getBoundingClientRect().width||0,
        formGridWidth:document.querySelector(".public-demo-booking-form>.form-grid")?.getBoundingClientRect().width||0,
        summaryWidth:document.querySelector(".public-demo-summary-stack")?.getBoundingClientRect().width||0
      }));
      const minExpected=layout.formWidth*.92;
      if(layout.formGridWidth<minExpected||layout.summaryWidth<minExpected){
        throw new Error(profile.name+": mobile/tablet booking columns collapsed "+JSON.stringify(layout));
      }
    }

    if(profile.viewport.width>=1000){
      const layout=await page.evaluate(()=>({
        formWidth:document.querySelector(".public-demo-booking-form")?.getBoundingClientRect().width||0,
        summaryWidth:document.querySelector(".public-demo-summary-stack")?.getBoundingClientRect().width||0
      }));
      if(layout.summaryWidth<300) throw new Error(profile.name+": desktop summary column is compressed "+JSON.stringify(layout));
    }

    await page.goto("http://127.0.0.1:4176/?public=manage-booking&token=11111111-1111-4111-8111-111111111111",{
      waitUntil:"domcontentloaded",
      timeout:20000
    });
    await page.waitForSelector("#publicManageBooking",{state:"visible",timeout:10000});
    const manageService=await page.locator("#publicManageService").textContent();
    if(!manageService.includes("Standard Home Cleaning")){
      throw new Error(profile.name+": manage-booking context did not load");
    }
    if(!(await page.locator("#publicRequestForm").evaluate(el=>el.hidden))){
      throw new Error(profile.name+": new-booking form is visible in manage-booking mode");
    }
    const manageDate=page.locator("#publicManageDateInput");
    await manageDate.evaluate(el=>{
      el.value="2026-10-06";
      el.dispatchEvent(new Event("change",{bubbles:true}));
    });
    await page.waitForFunction(()=>document.querySelectorAll("#publicManageSlots [data-manage-slot]").length>0,null,{timeout:7000});
    const manageSlot=page.locator("#publicManageSlots [data-manage-slot]").first();
    await manageSlot.click();
    if(await page.locator("#publicManageSubmit").isDisabled()){
      throw new Error(profile.name+": manage-booking submit did not enable after selecting a slot");
    }
    await page.locator("#publicManageReason").fill("Schedule changed");
    await page.locator("#publicManageSubmit").click();
    await page.waitForFunction(()=>document.querySelector("#publicManageStatus")?.textContent.includes("Change request pending"),null,{timeout:7000});
    await assertNoOverflow(page,profile,"manage booking");

    console.log("PUBLIC_BOOKING_OK",profile.name);
    await context.close();
  }finally{
    await browser.close();
  }
}

try{
  for(const profile of profiles) await runProfile(profile);
}finally{
  await new Promise(resolve=>server.close(resolve));
}

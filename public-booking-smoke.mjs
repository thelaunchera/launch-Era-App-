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
      id:"svc-standard",
      name:"Standard Home Cleaning",
      description:"Routine residential cleaning for homes and apartments.",
      pricing_type:"flat",
      base_price:129,
      duration_minutes:120
    },
    {
      id:"svc-office",
      name:"Office Cleaning",
      description:"Recurring commercial cleaning for offices and workspaces.",
      pricing_type:"flat",
      base_price:189,
      duration_minutes:150
    },
    {
      id:"svc-post",
      name:"Post-Construction Commercial Cleaning",
      description:"Custom commercial cleanup after construction or renovation.",
      pricing_type:"quote_required",
      base_price:0,
      duration_minutes:180
    },
    {
      id:"svc-home-quote",
      name:"Large Home Custom Cleaning",
      description:"Custom residential cleaning for larger homes.",
      pricing_type:"quote_required",
      base_price:0,
      duration_minutes:180
    }
  ],
  addons:[
    {id:"addon-oven",service_id:"svc-standard",name:"Inside oven",price:25,extra_duration_minutes:20},
    {id:"addon-glass",service_id:"svc-office",name:"Interior glass",price:40,extra_duration_minutes:25}
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

async function mockBackend(page){
  await page.route("https://bowacxhmjvrqixtwaikv.supabase.co/**",async route=>{
    const url=new URL(route.request().url());
    const pathname=url.pathname;
    let body={};
    if(pathname.endsWith("/rpc/get_public_booking_config")) body=businessConfig;
    else if(pathname.endsWith("/rpc/get_public_available_slots")){
      body=[
        {slot_start:"2026-10-05T14:00:00.000Z"},
        {slot_start:"2026-10-05T16:30:00.000Z"}
      ];
    }else if(pathname.includes("/functions/v1/track-app-visit")) body={ok:true};
    else body={};
    await route.fulfill({
      status:200,
      contentType:"application/json",
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
      hasTouch:profile.viewport.width<=860
    });
    const page=await context.newPage();
    await mockBackend(page);

    await page.goto("http://127.0.0.1:4176/?public=book&slug=smoke-cleaning",{
      waitUntil:"domcontentloaded",
      timeout:20000
    });
    await page.waitForSelector("#publicShell",{state:"visible",timeout:10000});
    await page.waitForFunction(()=>document.querySelectorAll("#publicServiceCards [data-service-card]").length>0,null,{timeout:10000});

    const header=await page.locator("#publicHeaderBusinessName").textContent();
    if(!header.includes("Bright Home Cleaning")) throw new Error(profile.name+": business branding did not load");

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

    const date=page.locator('#publicRequestForm input[name="date"]');
    await date.evaluate(el=>{
      el.value="2026-10-05";
      el.dispatchEvent(new Event("input",{bubbles:true}));
      el.dispatchEvent(new Event("change",{bubbles:true}));
    });
    await page.waitForFunction(()=>document.querySelectorAll("#publicSlots [data-slot]").length>0,null,{timeout:7000});
    const slot=page.locator("#publicSlots [data-slot]").first();
    await slot.click();
    if(!(await slot.evaluate(el=>el.classList.contains("selected")))){
      throw new Error(profile.name+": availability slot cannot be selected");
    }

    const residentialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    const residentialSummary=await page.locator("#publicSummary img").getAttribute("src");
    await assertNoOverflow(page,profile,"residential booking");

    await page.locator('[data-property-type="commercial"]').click();
    await page.waitForFunction(()=>document.querySelector("#publicPropertyType")?.value==="commercial",null,{timeout:3000});
    const commercialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    if(commercialHero===residentialHero) throw new Error(profile.name+": commercial hero photo did not change");

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
    const quoteCommercialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    if(quoteCommercialHero===commercialHero) throw new Error(profile.name+": quote commercial hero photo did not change");
    await assertNoOverflow(page,profile,"commercial quote");

    await page.locator('[data-property-type="residential"]').click();
    const quoteResidentialCards=await page.locator("#publicServiceCards [data-service-card]").allTextContents();
    if(!quoteResidentialCards.some(x=>x.includes("Large Home Custom Cleaning"))){
      throw new Error(profile.name+": residential quote service missing");
    }
    const quoteResidentialHero=await page.locator("#publicHeroPhoto").getAttribute("src");
    if(quoteResidentialHero===quoteCommercialHero) throw new Error(profile.name+": quote residential hero photo did not change");
    await assertNoOverflow(page,profile,"residential quote");

    if(profile.viewport.width>=1000){
      const layout=await page.evaluate(()=>({
        formWidth:document.querySelector(".public-demo-booking-form")?.getBoundingClientRect().width||0,
        summaryWidth:document.querySelector(".public-demo-summary-stack")?.getBoundingClientRect().width||0
      }));
      if(layout.summaryWidth<300) throw new Error(profile.name+": desktop summary column is compressed "+JSON.stringify(layout));
    }

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

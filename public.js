(() => {
  const params = new URLSearchParams(window.location.search);
  let mode = params.get("public");
  const slug = params.get("slug");
  const token = params.get("token");
  const requestedLanguage=String(params.get("lang")||"").toLowerCase();
  const supportedPublicLanguages=["en","es","pt","fr"];
  if(supportedPublicLanguages.includes(requestedLanguage) && window.TLE_I18N?.setLanguage){
    window.TLE_I18N.setLanguage(requestedLanguage);
  }

  const validRequestMode = ["book","quote"].includes(mode) && Boolean(slug);
  const validQuoteReview = mode === "quote-review" && Boolean(token);
  const validInvoiceView = mode === "invoice" && Boolean(token);
  if(!validRequestMode && !validQuoteReview && !validInvoiceView) return;

  window.__tlePublicHandled = true;

  const URL = "https://bowacxhmjvrqixtwaikv.supabase.co";
  const KEY = "sb_publishable_0TueitFYiRF3rAEMLMT8-w_FvbvY0rB";
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const tt = v => window.TLE_I18N?.t?.(v) || v;
  const currentPublicLanguage = () => {
    const value=String(window.TLE_I18N?.language||requestedLanguage||"en").toLowerCase();
    return supportedPublicLanguages.includes(value)?value:"en";
  };
  let publicLocale=navigator.language||"en-US";
  let publicCurrency="USD";
  function setPublicLocale(locale,currency,language){
    publicCurrency=String(currency||publicCurrency||"USD").toUpperCase();
    const current=String(window.TLE_I18N?.language||"").toLowerCase();
    const business=String(language||"").toLowerCase();
    const chosen=supportedPublicLanguages.includes(requestedLanguage)
      ? requestedLanguage
      : supportedPublicLanguages.includes(current)
        ? current
        : supportedPublicLanguages.includes(business)
          ? business
          : "en";
    const localeByLanguage={en:"en-US",es:"es-US",pt:"pt-BR",fr:"fr-FR"};
    publicLocale=localeByLanguage[chosen]||String(locale||publicLocale||"en-US");
    if(window.TLE_I18N?.setLanguage && current!==chosen) window.TLE_I18N.setLanguage(chosen);
  }
  const money = v => new Intl.NumberFormat(publicLocale,{
    style:"currency",currency:publicCurrency,maximumFractionDigits:2
  }).format(Number(v||0));
  const esc = v => String(v??"").replace(/[&<>"']/g,ch=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));

  async function rpc(name,body={}){
    const res = await fetch(URL+"/rest/v1/rpc/"+name,{
      method:"POST",
      headers:{"apikey":KEY,"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    const text = await res.text();
    let data = null;
    try{ data = text ? JSON.parse(text) : null; }catch{ data = text; }
    if(!res.ok) throw new Error(data?.message || data?.error || tt("Request failed"));
    return data;
  }

  function visitorId(){
    let id=localStorage.getItem("tle_visitor_id");
    if(!id){
      id=(crypto.randomUUID?crypto.randomUUID():"v-"+Date.now()+"-"+Math.random().toString(36).slice(2));
      localStorage.setItem("tle_visitor_id",id);
    }
    return id;
  }

  async function track(){
    try{
      await fetch(URL+"/functions/v1/track-app-visit",{
        method:"POST",
        headers:{"apikey":KEY,"Content-Type":"application/json"},
        body:JSON.stringify({
          visitor_id:visitorId(),
          page:"/public/"+mode,
          referrer:document.referrer||null,
          user_agent:navigator.userAgent||null
        })
      });
    }catch{}
  }

  function showPublicShell(){
    const splash=$("#sessionSplash");
    if(splash) splash.hidden=true;
    const auth=$("#authShell"), app=$("#appShell"), worker=$("#workerShell"), pub=$("#publicShell");
    if(auth) auth.hidden=true;
    if(app) app.hidden=true;
    if(worker) worker.hidden=true;
    if(pub) pub.hidden=false;
  }

  function formatDate(value){
    if(!value) return "";
    const d=new Date(value+"T12:00:00");
    return new Intl.DateTimeFormat(publicLocale,{month:"short",day:"numeric",year:"numeric"}).format(d);
  }

  function formatTime(value){
    if(!value) return "";
    const parts=String(value).split(":");
    const d=new Date();
    d.setHours(Number(parts[0]||0),Number(parts[1]||0),0,0);
    return new Intl.DateTimeFormat(publicLocale,{hour:"numeric",minute:"2-digit"}).format(d);
  }

  async function bootInvoiceView(){
    const form=$("#publicRequestForm");
    const success=$("#publicSuccess");
    const quoteReview=$("#publicQuoteReview");
    const invoiceView=$("#publicInvoiceView");
    if(form) form.hidden=true;
    if(success) success.hidden=true;
    if(quoteReview) quoteReview.hidden=true;
    if(invoiceView) invoiceView.hidden=false;

    try{
      const data=await rpc("get_public_invoice_context",{p_token:token});
      setPublicLocale(data?.locale_code,data?.currency_code,data?.default_language);
      $("#publicBusinessName").textContent=data?.business_name||tt("Cleaning business");
      $("#publicModeLabel").textContent=tt("INVOICE");
      $("#publicIntro").textContent=tt("Review your invoice details below.");
      $("#invoiceViewTitle").textContent=tt("Invoice")+" #"+(data?.invoice_number||"");
      const meta=[
        data?.customer_name||"",
        data?.due_at ? tt("Due")+" "+new Intl.DateTimeFormat(publicLocale,{month:"short",day:"numeric",year:"numeric"}).format(new Date(data.due_at)) : "",
        data?.status ? String(data.status).replaceAll("_"," ") : ""
      ].filter(Boolean).join(" · ");
      $("#invoiceViewMeta").textContent=meta;

      const items=data?.items||[];
      $("#invoiceViewItems").innerHTML=items.length
        ? items.map(item=>'<div class="quote-review-item"><span><strong>'+esc(item.description||tt("Cleaning service"))+'</strong><small>'+esc(item.quantity||1)+' × '+money(item.unit_price)+'</small></span><b>'+money(item.line_total)+'</b></div>').join("")
        : '<div class="empty-inline"><strong>'+esc(tt("No invoice items found."))+'</strong></div>';

      $("#invoiceViewSubtotal").textContent=money(data?.subtotal);
      $("#invoiceViewPaid").textContent=money(data?.paid_total);
      $("#invoiceViewBalance").textContent=money(data?.balance_due);
      const methodLabels={cash:"Cash",check:"Check",zelle:"Zelle",etransfer:"E-transfer",bank_transfer:"Bank transfer",other:"Other"};
      const enabledMethods=Array.isArray(data?.payment_methods)&&data.payment_methods.length
        ? data.payment_methods.map(x=>String(x).toLowerCase())
        : ["cash","check","other"];
      $("#invoiceViewMethods").textContent=enabledMethods.map(x=>tt(methodLabels[x]||x)).join(" · ");

      const choices=$("#invoicePaymentChoices");
      const choiceStatus=$("#invoicePaymentChoiceStatus");
      const submitInvoiceBtn=$("#submitInvoiceBtn");
      let selected=String(data?.customer_payment_method||"").toLowerCase();
      const savedMethod=selected;
      const isPaid=String(data?.status||"").toLowerCase()==="paid";

      if(choices){
        choices.innerHTML=enabledMethods.map(method=>
          '<button type="button" data-invoice-payment="'+esc(method)+'">'+esc(tt(methodLabels[method]||method))+'</button>'
        ).join("");
      }

      function renderPaymentChoice(){
        choices?.querySelectorAll("[data-invoice-payment]").forEach(btn=>{
          const active=btn.dataset.invoicePayment===selected;
          btn.classList.toggle("selected",active);
          btn.setAttribute("aria-pressed",active?"true":"false");
          btn.disabled=isPaid;
        });

        if(submitInvoiceBtn){
          submitInvoiceBtn.hidden=isPaid;
          submitInvoiceBtn.disabled=isPaid || !selected;
        }

        if(!choiceStatus) return;
        if(isPaid){
          choiceStatus.textContent=selected
            ? "Paid · "+((methodLabels[selected]||selected)||selected)
            : "Payment confirmed by the cleaning business.";
        }else if(selected){
          choiceStatus.textContent=tt("Selected")+": "+((methodLabels[selected]||selected)||selected)+". "+tt("Tap Submit invoice to send this choice.");
        }else{
          choiceStatus.textContent=tt("Choose a payment method, then submit your choice.");
        }
      }

      renderPaymentChoice();

      choices?.addEventListener("click",e=>{
        const btn=e.target.closest("[data-invoice-payment]");
        if(!btn || isPaid) return;
        selected=String(btn.dataset.invoicePayment||"").toLowerCase();
        renderPaymentChoice();
      });

      submitInvoiceBtn?.addEventListener("click",async()=>{
        if(isPaid || !selected) return;
        submitInvoiceBtn.disabled=true;
        choices?.querySelectorAll("button").forEach(x=>x.disabled=true);
        if(choiceStatus) choiceStatus.textContent=tt("Submitting your payment choice…");
        try{
          const result=await rpc("select_invoice_payment_method",{
            p_token:token,
            p_method:selected
          });
          selected=String(result?.payment_method||selected).toLowerCase();
          if(choiceStatus) choiceStatus.textContent=tt("Submitted")+": "+(methodLabels[selected]||selected)+". "+tt("The business will confirm payment after it is received.");
          submitInvoiceBtn.textContent=tt("Submitted")+" ✓";
          submitInvoiceBtn.disabled=true;
          choices?.querySelectorAll("button").forEach(x=>x.disabled=true);
        }catch(err){
          if(choiceStatus) choiceStatus.textContent=err.message||tt("Could not submit invoice.");
          submitInvoiceBtn.disabled=false;
          choices?.querySelectorAll("button").forEach(x=>x.disabled=false);
        }
      });

      const invoiceDisputeBtn=$("#invoiceDisputeBtn");
      const invoiceDisputeForm=$("#invoiceDisputeForm");
      const invoiceDisputeReason=$("#invoiceDisputeReason");
      const invoiceDisputeStatus=$("#invoiceDisputeStatus");

      invoiceDisputeBtn?.addEventListener("click",()=>{
        invoiceDisputeForm.hidden=false;
        invoiceDisputeBtn.hidden=true;
        invoiceDisputeStatus.textContent="";
        invoiceDisputeReason?.focus();
      });

      $("#cancelInvoiceDisputeBtn")?.addEventListener("click",()=>{
        invoiceDisputeForm.hidden=true;
        invoiceDisputeBtn.hidden=false;
        if(invoiceDisputeStatus) invoiceDisputeStatus.textContent="";
      });

      invoiceDisputeForm?.addEventListener("submit",async e=>{
        e.preventDefault();
        const reason=String(invoiceDisputeReason?.value||"").trim();
        const submit=invoiceDisputeForm.querySelector('button[type="submit"]');
        if(reason.length<3){
          invoiceDisputeStatus.textContent=tt("Please explain what you would like reviewed.");
          return;
        }
        submit.disabled=true;
        invoiceDisputeStatus.textContent=tt("Sending dispute…");
        try{
          await rpc("submit_invoice_dispute",{p_token:token,p_reason:reason});
          invoiceDisputeForm.hidden=true;
          invoiceDisputeBtn.hidden=true;
          invoiceDisputeStatus.textContent=tt("Dispute sent. The cleaning business can now review your message.");
        }catch(err){
          console.warn("[TLE] invoice dispute",err); invoiceDisputeStatus.textContent=tt("Could not send dispute.");
          submit.disabled=false;
        }
      });
    }catch(err){
      $("#publicBusinessName").textContent=tt("Invoice unavailable");
      console.warn("[TLE] public invoice",err); $("#publicIntro").textContent=tt("This invoice link is invalid or expired.");
      if(invoiceView) invoiceView.hidden=true;
    }
  }

  async function bootQuoteReview(){
    const form=$("#publicRequestForm");
    const success=$("#publicSuccess");
    const review=$("#publicQuoteReview");
    if(form) form.hidden=true;
    if(success) success.hidden=true;
    if(review) review.hidden=false;

    try{
      const data=await rpc("get_public_quote_context",{p_token:token});
      setPublicLocale(data?.locale_code,data?.currency_code,data?.default_language);
      $("#publicBusinessName").textContent=data?.business_name||tt("Cleaning business");
      $("#publicModeLabel").textContent=tt("QUOTE");
      $("#publicIntro").textContent=tt("Review the details below and choose Accept or Decline.");

      $("#quoteReviewTitle").textContent=tt("Quote for")+" "+(data?.customer_name||tt("your cleaning"));
      const meta=[
        data?.preferred_date ? formatDate(data.preferred_date) : "",
        data?.preferred_time ? formatTime(data.preferred_time) : "",
        data?.service_address || ""
      ].filter(Boolean).join(" · ");
      $("#quoteReviewMeta").textContent=meta;

      const items=data?.items||[];
      $("#quoteReviewItems").innerHTML=items.length
        ? items.map(item=>'<div class="quote-review-item"><span><strong>'+esc(item.description||tt("Cleaning service"))+'</strong><small>'+esc(tt("Qty"))+' '+esc(item.quantity||1)+'</small></span><b>'+money(item.line_total)+'</b></div>').join("")
        : '<div class="empty-inline"><strong>'+esc(tt("No quote items found."))+'</strong></div>';
      $("#quoteReviewTotal").textContent=money(data?.total);

      const status=String(data?.status||"");
      const actions=$("#quoteReviewActions");
      const statusEl=$("#quoteReviewStatus");
      const submitQuoteButton=$("#submitQuoteBtn");
      if(status==="accepted"){
        if(actions) actions.hidden=true;
        if(submitQuoteButton) submitQuoteButton.hidden=true;
        statusEl.textContent=tt("Accepted. Your service is confirmed.");
      }else if(status==="declined"){
        if(actions) actions.hidden=true;
        if(submitQuoteButton) submitQuoteButton.hidden=true;
        statusEl.textContent=tt("This quote was declined.");
      }else if(status!=="sent"){
        if(actions) actions.hidden=true;
        if(submitQuoteButton) submitQuoteButton.hidden=true;
        statusEl.textContent=tt("This quote is not currently awaiting a response.");
      }

      const submitQuoteBtn=$("#submitQuoteBtn");
      const acceptBtn=$("#acceptQuoteBtn");
      const declineBtn=$("#declineQuoteBtn");
      let selectedQuoteResponse="";

      function renderQuoteResponse(){
        [acceptBtn,declineBtn].forEach(btn=>{
          if(!btn) return;
          const active=btn.dataset.quoteResponse===selectedQuoteResponse;
          btn.classList.toggle("selected",active);
          btn.setAttribute("aria-pressed",active?"true":"false");
        });
        if(submitQuoteBtn){
          submitQuoteBtn.disabled=!selectedQuoteResponse;
        }
        if(status==="sent" && statusEl){
          statusEl.textContent=selectedQuoteResponse
            ? (selectedQuoteResponse==="accept"
              ? "Accept selected. Tap Submit quote to confirm."
              : "Decline selected. Tap Submit quote to confirm.")
            : "Choose Accept or Decline, then submit your response.";
        }
      }

      acceptBtn?.addEventListener("click",()=>{
        selectedQuoteResponse="accept";
        renderQuoteResponse();
      });
      declineBtn?.addEventListener("click",()=>{
        selectedQuoteResponse="decline";
        renderQuoteResponse();
      });
      if(status==="sent") renderQuoteResponse();

      submitQuoteBtn?.addEventListener("click",async()=>{
        if(!selectedQuoteResponse) return;
        const action=selectedQuoteResponse;
        submitQuoteBtn.disabled=true;
        if(acceptBtn) acceptBtn.disabled=true;
        if(declineBtn) declineBtn.disabled=true;
        statusEl.textContent=action==="accept"?tt("Submitting your acceptance…"):tt("Submitting your decline…");
        try{
          await rpc("respond_public_quote",{p_token:token,p_action:action});
          if(actions) actions.hidden=true;
          submitQuoteBtn.hidden=true;
          statusEl.textContent=action==="accept"
            ?"Accepted. Your service is confirmed and a confirmation email is on the way."
            :"Quote declined. The cleaning business can now follow up with you.";
        }catch(err){
          statusEl.textContent=err.message||tt("Could not submit quote.");
          submitQuoteBtn.disabled=false;
          if(acceptBtn) acceptBtn.disabled=false;
          if(declineBtn) declineBtn.disabled=false;
        }
      });

      const quoteDisputeBtn=$("#quoteDisputeBtn");
      const quoteDisputeForm=$("#quoteDisputeForm");
      const quoteDisputeReason=$("#quoteDisputeReason");

      quoteDisputeBtn?.addEventListener("click",()=>{
        quoteDisputeForm.hidden=false;
        quoteDisputeBtn.hidden=true;
        if(submitQuoteBtn) submitQuoteBtn.hidden=true;
        statusEl.textContent="";
        quoteDisputeReason?.focus();
      });

      $("#cancelQuoteDisputeBtn")?.addEventListener("click",()=>{
        quoteDisputeForm.hidden=true;
        quoteDisputeBtn.hidden=false;
        if(submitQuoteBtn && status==="sent") submitQuoteBtn.hidden=false;
        renderQuoteResponse();
      });

      quoteDisputeForm?.addEventListener("submit",async e=>{
        e.preventDefault();
        const reason=String(quoteDisputeReason?.value||"").trim();
        const submit=quoteDisputeForm.querySelector('button[type="submit"]');
        if(reason.length<3){
          statusEl.textContent=tt("Please explain what you would like reviewed.");
          return;
        }
        submit.disabled=true;
        statusEl.textContent=tt("Sending dispute…");
        try{
          await rpc("submit_quote_dispute",{p_token:token,p_reason:reason});
          quoteDisputeForm.hidden=true;
          if(actions) actions.hidden=true;
          if(submitQuoteBtn) submitQuoteBtn.hidden=true;
          statusEl.textContent=tt("Dispute sent. The cleaning business can now review your message.");
        }catch(err){
          console.warn("[TLE] quote dispute",err); statusEl.textContent=tt("Could not send dispute.");
          submit.disabled=false;
        }
      });
    }catch(err){
      $("#publicBusinessName").textContent=tt("Quote unavailable");
      console.warn("[TLE] public quote",err); $("#publicIntro").textContent=tt("This quote link is invalid or expired.");
      if(review) review.hidden=true;
    }
  }

  async function bootRequest(){
    try{
      const data=await rpc("get_public_booking_config",{p_slug:slug});
      setPublicLocale(data?.business?.locale_code,data?.business?.currency_code,data?.business?.default_language);

      const allServices=data?.services||[];
      const fixedPriceServices=allServices.filter(s=>s.pricing_type!=="quote" && Number(s.base_price)>0);
      const quoteOnlyServices=allServices.filter(s=>s.pricing_type==="quote");
      const addons=data?.addons||[];
      let services=[];

      const business=$("#publicBusinessName");
      const label=$("#publicModeLabel");
      const intro=$("#publicIntro");
      const submit=$("#publicSubmitBtn");
      const addWrap=$("#publicAddonsWrap");
      const select=$("#publicService");
      const addonBox=$("#publicAddons");
      const summary=$("#publicSummary");
      const form=$("#publicRequestForm");
      const quoteTimeWrap=$("#publicQuoteTimeWrap");
      const recurrenceWrap=$("#publicRecurrenceWrap");
      const slotsWrap=$("#publicSlotsWrap");
      const slotsBox=$("#publicSlots");
      const slotInput=$("#publicSlotStart");
      const bookTab=$("#publicBookTab");
      const quoteTab=$("#publicQuoteTab");
      const serviceLabel=$("#publicServiceLabel");
      const dateInput=form?.querySelector('[name="date"]');
      const quoteTimeInput=form?.querySelector('[name="time"]');
      const preferredLanguageSelect=$("#publicPreferredLanguage");
      const propertyTypeSelect=$("#publicPropertyType");
      const residentialDetails=$("#publicResidentialDetails");
      const commercialDetails=$("#publicCommercialDetails");
      const propertySizeInput=$("#publicPropertySize");
      const propertySizeUnit=$("#publicPropertySizeUnit");
      const propertySizeOptional=$("#publicPropertySizeOptional");
      const petsSelect=$("#publicPets");
      const petDetailsWrap=$("#publicPetDetailsWrap");
      const timeZoneNotice=$("#publicTimeZoneNotice");

      if(business) business.textContent=data?.business?.name||tt("Cleaning service");
      if(preferredLanguageSelect){
        const configured=String(data?.business?.customer_email_language||"en").toLowerCase();
        preferredLanguageSelect.value=["en","es","fr","ht"].includes(configured)?configured:"en";
      }
      if(quoteTimeInput) quoteTimeInput.required=false;

      const businessZone=data?.business?.timezone||"UTC";
      const businessCountry=String(data?.business?.country_code||"").toUpperCase();
      if(propertySizeUnit){
        propertySizeUnit.value=["US","CA","GB"].includes(businessCountry)?"sqft":"sqm";
      }

      function businessTimeZoneLabel(){
        try{
          const parts=new Intl.DateTimeFormat(publicLocale,{
            timeZone:businessZone,
            timeZoneName:"long"
          }).formatToParts(new Date());
          const name=parts.find(part=>part.type==="timeZoneName")?.value||businessZone;
          return name===businessZone?name:name+" · "+businessZone;
        }catch{
          return businessZone;
        }
      }

      function renderBusinessTimeZoneNotice(){
        if(!timeZoneNotice) return;
        const deviceZone=String(Intl.DateTimeFormat().resolvedOptions().timeZone||"").trim();
        const businessLabel=businessTimeZoneLabel();
        const differentZone=deviceZone && deviceZone!==businessZone;
        timeZoneNotice.textContent=differentZone
          ? tt("Times shown in the cleaning business’s local time")+" · "+businessLabel+" · "+tt("Your device time zone")+": "+deviceZone
          : tt("Times shown in the cleaning business’s local time")+" · "+businessLabel;
      }

      function syncPropertyDetails(){
        const type=String(propertyTypeSelect?.value||"").toLowerCase();
        if(residentialDetails) residentialDetails.hidden=type!=="residential";
        if(commercialDetails) commercialDetails.hidden=type!=="commercial";

        const bedrooms=form?.querySelector('[name="bedrooms"]');
        const bathrooms=form?.querySelector('[name="bathrooms"]');
        const commercialType=form?.querySelector('[name="commercial_space_type"]');
        if(bedrooms) bedrooms.required=type==="residential";
        if(bathrooms) bathrooms.required=type==="residential";
        if(commercialType) commercialType.required=type==="commercial";

        // Size is highly useful for quoting, but remains optional to keep
        // fixed-price booking fast and to support countries where customers
        // may not know the exact floor area.
        if(propertySizeInput) propertySizeInput.required=false;
        if(propertySizeOptional) propertySizeOptional.hidden=false;
      }

      function syncPetDetails(){
        if(!petDetailsWrap) return;
        petDetailsWrap.hidden=String(petsSelect?.value||"")!=="yes";
        const input=petDetailsWrap.querySelector('input[name="pet_details"]');
        if(input && petDetailsWrap.hidden) input.value="";
      }

      renderBusinessTimeZoneNotice();
      syncPropertyDetails();
      syncPetDetails();
      propertyTypeSelect?.addEventListener("change",syncPropertyDetails);
      petsSelect?.addEventListener("change",syncPetDetails);

      function chosenAddonIds(){
        return addonBox ? $$('input[name="addon"]:checked',addonBox).map(x=>x.value) : [];
      }

      function updateSummary(){
        const selected=services.find(s=>s.id===select?.value);
        if(!summary) return;
        if(!selected){
          if(services.length) summary.innerHTML="";
          return;
        }
        const chosenIds=chosenAddonIds();
        const chosen=mode==="quote"?[]:addons.filter(a=>chosenIds.includes(a.id));
        const total=(Number(selected.base_price)||0)+chosen.reduce((sum,a)=>sum+Number(a.price||0),0);
        const duration=Number(selected.duration_minutes||0)+chosen.reduce((sum,a)=>sum+Number(a.extra_duration_minutes||0),0);
        summary.innerHTML='<strong>'+esc(selected.name)+'</strong><span>'+duration+' min'+
          (mode==="quote"?" · "+tt("Price provided after review"):" · "+money(total))+
          '</span>';
      }

      function renderAddons(){
        const selected=services.find(s=>s.id===select?.value);
        if(!addonBox) return;
        if(mode==="quote"){
          addonBox.innerHTML="";
          updateSummary();
          return;
        }
        const available=addons.filter(a=>!a.service_id||a.service_id===selected?.id);
        addonBox.innerHTML=available.length?available.map(a=>
          '<label class="addon-choice">'+
          '<input type="checkbox" name="addon" value="'+esc(a.id)+'">'+
          '<span><strong>'+esc(a.name)+'</strong><small>+'+money(a.price)+' · +'+esc(a.extra_duration_minutes)+' min</small></span>'+
          '</label>'
        ).join(""):'<span class="muted-line">'+esc(tt("No add-ons for this service."))+'</span>';
        updateSummary();
      }

      function formatSlot(iso){
        return new Intl.DateTimeFormat(publicLocale,{
          timeZone:businessZone,hour:"numeric",minute:"2-digit"
        }).format(new Date(iso));
      }

      async function refreshSlots(){
        if(mode==="quote" || !slotsBox || !slotInput) return;
        slotInput.value="";
        const serviceId=select?.value;
        const dateValue=dateInput?.value;
        if(!serviceId || !dateValue){
          slotsBox.innerHTML='<span class="muted-line">'+esc(tt("Choose a service and date first."))+'</span>';
          return;
        }

        slotsBox.innerHTML='<span class="muted-line">'+esc(tt("Checking availability…"))+'</span>';
        try{
          const rows=await rpc("get_public_available_slots",{
            p_slug:slug,
            p_service_id:serviceId,
            p_date:dateValue,
            p_addon_ids:chosenAddonIds()
          });
          const slots=Array.isArray(rows)?rows:[];
          if(!slots.length){
            slotsBox.innerHTML='<span class="muted-line">'+esc(tt("No openings on this date. Try another day."))+'</span>';
            return;
          }
          slotsBox.innerHTML=slots.map(row=>
            '<button type="button" class="slot-btn" data-slot="'+esc(row.slot_start)+'">'+esc(formatSlot(row.slot_start))+'</button>'
          ).join("");
        }catch(err){
          console.warn("[TLE] public availability",err); slotsBox.innerHTML='<span class="muted-line">'+esc(tt("Could not load availability"))+'</span>';
        }
      }

      function renderMode(nextMode,{updateUrl=true}={}){
        if(nextMode!=="book" && nextMode!=="quote") return;
        mode=nextMode;
        services=mode==="quote"?quoteOnlyServices:fixedPriceServices;

        if(bookTab){
          bookTab.classList.toggle("active",mode==="book");
          bookTab.setAttribute("aria-pressed",mode==="book"?"true":"false");
          bookTab.setAttribute("aria-current",mode==="book"?"page":"false");
        }
        if(quoteTab){
          quoteTab.classList.toggle("active",mode==="quote");
          quoteTab.setAttribute("aria-pressed",mode==="quote"?"true":"false");
          quoteTab.setAttribute("aria-current",mode==="quote"?"page":"false");
        }

        if(serviceLabel) serviceLabel.textContent=tt(mode==="quote"?"Custom job type":"Service");
        if(label) label.textContent=tt(mode==="quote"?"REQUEST A QUOTE":"BOOK A CLEANING");
        if(intro) intro.textContent=tt(mode==="quote"
          ?"For custom or variable-price work. Choose a quote-only service and tell us about the job."
          :"Choose a service with upfront pricing, then pick a real available time.");
        if(submit){
          submit.textContent=tt(mode==="quote"?"Send quote request":"Send booking request");
          submit.disabled=!services.length;
        }
        if(addWrap) addWrap.hidden=mode==="quote";
        if(quoteTimeWrap) quoteTimeWrap.hidden=mode!=="quote";
        if(recurrenceWrap) recurrenceWrap.hidden=mode==="quote";
        if(slotsWrap) slotsWrap.hidden=mode==="quote";

        if(select){
          select.value="";
          select.disabled=!services.length;
          select.innerHTML=services.length
            ? '<option value="">'+esc(tt(mode==="quote"?"Choose a custom job type":"Choose a service"))+'</option>'+services.map(s=>
                '<option value="'+esc(s.id)+'">'+esc(s.name)+
                (mode==="quote"?" · "+esc(tt("Custom quote")):s.base_price!=null?" · "+money(s.base_price):"")+
                '</option>'
              ).join("")
            : '<option value="">'+esc(tt(mode==="quote"
                ?"No quote-only services available yet"
                :"No priced services available for online booking"))+'</option>';
        }

        if(slotInput) slotInput.value="";
        if(slotsBox) slotsBox.innerHTML='<span class="muted-line">'+esc(tt("Choose a service and date first."))+'</span>';
        if(addonBox) addonBox.innerHTML="";
        if(summary){
          summary.innerHTML=services.length
            ? ""
            : mode==="quote"
              ? '<span>'+esc(tt("No custom quote services are set up yet. Use Book a Cleaning for services with upfront pricing."))+'</span><button type="button" class="primary-btn" data-switch-public-mode="book">'+esc(tt("Book a Cleaning"))+'</button>'
              : '<span>'+esc(tt("No priced services are available for online booking. Custom or variable-price work belongs in Request a Quote."))+'</span><button type="button" class="primary-btn" data-switch-public-mode="quote">'+esc(tt("Request a Quote"))+'</button>';
        }

        renderAddons();
        syncPropertyDetails();
        renderBusinessTimeZoneNotice();

        // URL syncing is secondary. Never allow an iOS/PWA History API issue
        // to stop the visual mode switch itself.
        if(updateUrl){
          try{
            const nextUrl=new URL(window.location.href);
            nextUrl.searchParams.set("public",mode);
            nextUrl.searchParams.set("slug",slug);
            history.replaceState({tlePublicMode:mode},"",nextUrl.pathname+nextUrl.search+nextUrl.hash);
          }catch(err){
            console.warn("[TLE] public mode URL sync",err);
          }
        }
      }

      function switchMode(nextMode){
        if(nextMode===mode) return;
        renderMode(nextMode,{updateUrl:true});
      }

      $("#publicRequestSwitch")?.addEventListener("click",e=>{
        const control=e.target.closest("[data-public-mode]");
        if(!control) return;
        e.preventDefault();
        e.stopPropagation();
        switchMode(control.dataset.publicMode);
      });
      summary?.addEventListener("click",e=>{
        const btn=e.target.closest("[data-switch-public-mode]");
        if(!btn) return;
        e.preventDefault();
        switchMode(btn.dataset.switchPublicMode);
      });

      select?.addEventListener("change",()=>{
        renderAddons();
        refreshSlots();
      });
      addonBox?.addEventListener("change",()=>{
        updateSummary();
        refreshSlots();
      });
      slotsBox?.addEventListener("click",e=>{
        const btn=e.target.closest("[data-slot]");
        if(!btn) return;
        slotsBox.querySelectorAll("[data-slot]").forEach(x=>x.classList.toggle("selected",x===btn));
        slotInput.value=btn.dataset.slot;
      });

      if(dateInput){
        const dateInBusinessZone=value=>{
          const parts=new Intl.DateTimeFormat("en-CA",{
            timeZone:businessZone,year:"numeric",month:"2-digit",day:"2-digit"
          }).formatToParts(value);
          const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
          return [map.year,map.month,map.day].join("-");
        };
        dateInput.min=dateInBusinessZone(new Date());
        dateInput.max=dateInBusinessZone(new Date(Date.now()+90*86400000));
        dateInput.addEventListener("change",refreshSlots);
      }

      renderMode(mode,{updateUrl:false});

      if(form){
        form.addEventListener("submit",async e=>{
          e.preventDefault();
          if(!services.length) return;
          const fd=new FormData(form);
          const preferred=fd.get("preferred_contact");
          const phone=String(fd.get("phone")||"").trim();
          const propertyType=String(fd.get("property_type")||"").trim().toLowerCase();
          const propertySize=String(fd.get("property_size")||"").trim();
          const propertySizeUnit=String(fd.get("property_size_unit")||"").trim()==="sqm"?"m²":"sq ft";
          const bedrooms=String(fd.get("bedrooms")||"").trim();
          const bathrooms=String(fd.get("bathrooms")||"").trim();
          const floors=String(fd.get(propertyType==="commercial"?"commercial_floors":"floors")||"").trim();
          const pets=String(fd.get("pets")||"").trim();
          const petDetails=String(fd.get("pet_details")||"").trim();
          const commercialSpaceType=String(fd.get("commercial_space_type")||"").trim();
          const restrooms=String(fd.get("restrooms")||"").trim();
          const businessHours=String(fd.get("business_hours")||"").trim();
          const cleanDuringBusinessHours=String(fd.get("clean_during_business_hours")||"").trim();
          const lastClean=String(fd.get("last_professional_clean")||"").trim();
          const cleaningCondition=String(fd.get("cleaning_condition")||"").trim();
          const accessNotes=String(fd.get("access_notes")||"").trim();
          const customerNotes=String(fd.get("notes")||"").trim();

          if((preferred==="text"||preferred==="whatsapp")&&!phone){
            alert(tt("Phone is required for Text or WhatsApp."));
            return;
          }
          if(!["residential","commercial"].includes(propertyType)){
            alert(tt("Choose Residential or Commercial."));
            return;
          }
          if(propertySize && (!/^\d+(?:\.\d+)?$/.test(propertySize) || Number(propertySize)<=0)){
            alert(tt("Property size must be greater than 0."));
            return;
          }
          if(propertyType==="residential"){
            if(!/^\d+$/.test(bedrooms) || Number(bedrooms)<0){
              alert(tt("Enter the number of bedrooms."));
              return;
            }
            if(!/^\d+(?:\.5)?$/.test(bathrooms) || Number(bathrooms)<0){
              alert(tt("Enter the number of bathrooms."));
              return;
            }
          }
          if(propertyType==="commercial" && !commercialSpaceType){
            alert(tt("Choose the commercial space type."));
            return;
          }

          const lastCleanLabels={
            under_month:"Less than a month ago",
            one_three_months:"1–3 months ago",
            three_six_months:"3–6 months ago",
            over_six_months:"More than 6 months ago",
            never_unsure:"Never / not sure"
          };
          const commercialLabels={
            office:"Office",
            retail:"Retail / storefront",
            medical:"Medical / dental",
            restaurant:"Restaurant / food service",
            warehouse:"Warehouse / industrial",
            other:"Other"
          };
          const petLabels={none:"No pets",yes:"Yes",prefer_not:"Prefer not to say"};
          const conditionLabels={
            regular:"Regular upkeep",
            extra_attention:"Needs extra attention",
            heavy_buildup:"Heavy buildup",
            move:"Move-in / move-out",
            unsure:"Not sure"
          };
          const duringHoursLabels={yes:"Yes",no:"No",flexible:"Flexible"};

          const requestNotes=[
            "Property type: "+(propertyType==="commercial"?"Commercial":"Residential"),
            propertySize ? "Approx. size: "+propertySize+" "+propertySizeUnit : "",
            propertyType==="residential" ? "Bedrooms: "+bedrooms : "",
            propertyType==="residential" ? "Bathrooms: "+bathrooms : "",
            floors ? "Floors / levels: "+floors : "",
            propertyType==="residential" && pets ? "Pets: "+(petLabels[pets]||pets) : "",
            propertyType==="residential" && petDetails ? "Pet details: "+petDetails : "",
            propertyType==="commercial" ? "Space type: "+(commercialLabels[commercialSpaceType]||commercialSpaceType) : "",
            propertyType==="commercial" && restrooms ? "Restrooms: "+restrooms : "",
            propertyType==="commercial" && businessHours ? "Business hours: "+businessHours : "",
            propertyType==="commercial" && cleanDuringBusinessHours ? "Clean during business hours: "+(duringHoursLabels[cleanDuringBusinessHours]||cleanDuringBusinessHours) : "",
            cleaningCondition ? "Current condition: "+(conditionLabels[cleaningCondition]||cleaningCondition) : "",
            lastClean ? "Last professional clean: "+(lastCleanLabels[lastClean]||lastClean) : "",
            accessNotes ? "Access / parking: "+accessNotes : "",
            customerNotes ? "Special requests: "+customerNotes : ""
          ].filter(Boolean).join("\n");
          const old=submit.textContent;
          submit.disabled=true;
          submit.textContent=tt("Sending…");
          try{
            if(mode==="quote"){
              await rpc("submit_public_quote_request_v3",{
                p_slug:slug,
                p_service_id:fd.get("service_id"),
                p_customer_name:String(fd.get("name")).trim(),
                p_customer_email:String(fd.get("email")).trim(),
                p_customer_phone:phone||null,
                p_preferred_contact:preferred,
                p_service_address:String(fd.get("address")).trim(),
                p_preferred_date:fd.get("date"),
                p_preferred_time:String(fd.get("time")||"").trim()||null,
                p_notes:requestNotes||null,
                p_language:String(fd.get("preferred_language")||data?.business?.customer_email_language||"en").toLowerCase(),
                p_property_type:propertyType,
                p_property_size:propertySize?Number(propertySize):null,
                p_property_size_unit:String(fd.get("property_size_unit")||"sqft"),
                p_bedrooms:propertyType==="residential"&&bedrooms!==""?Number(bedrooms):null,
                p_bathrooms:propertyType==="residential"&&bathrooms!==""?Number(bathrooms):null,
                p_floors:floors!==""?Number(floors):null,
                p_pets:propertyType==="residential"?(pets||null):null,
                p_pet_details:propertyType==="residential"?(petDetails||null):null,
                p_commercial_space_type:propertyType==="commercial"?(commercialSpaceType||null):null,
                p_restrooms:propertyType==="commercial"&&restrooms!==""?Number(restrooms):null,
                p_last_professional_clean:lastClean||null,
                p_cleaning_condition:cleaningCondition||null,
                p_access_notes:accessNotes||null,
                p_business_hours:propertyType==="commercial"?(businessHours||null):null,
                p_clean_during_business_hours:propertyType==="commercial"?(cleanDuringBusinessHours||null):null
              });
            }else{
              const selectedSlot=String(fd.get("slot_start")||"").trim();
              if(!selectedSlot) throw new Error(tt("Choose one of the available times."));
              await rpc("submit_public_booking_request_v3",{
                p_slug:slug,
                p_service_id:fd.get("service_id"),
                p_addon_ids:fd.getAll("addon"),
                p_customer_name:String(fd.get("name")).trim(),
                p_customer_email:String(fd.get("email")).trim(),
                p_customer_phone:phone||null,
                p_preferred_contact:preferred,
                p_service_address:String(fd.get("address")).trim(),
                p_requested_start_at:selectedSlot,
                p_notes:requestNotes||null,
                p_recurrence_pattern:String(fd.get("recurrence_pattern")||"one_time"),
                p_language:String(fd.get("preferred_language")||data?.business?.customer_email_language||"en").toLowerCase(),
                p_property_type:propertyType,
                p_property_size:propertySize?Number(propertySize):null,
                p_property_size_unit:String(fd.get("property_size_unit")||"sqft"),
                p_bedrooms:propertyType==="residential"&&bedrooms!==""?Number(bedrooms):null,
                p_bathrooms:propertyType==="residential"&&bathrooms!==""?Number(bathrooms):null,
                p_floors:floors!==""?Number(floors):null,
                p_pets:propertyType==="residential"?(pets||null):null,
                p_pet_details:propertyType==="residential"?(petDetails||null):null,
                p_commercial_space_type:propertyType==="commercial"?(commercialSpaceType||null):null,
                p_restrooms:propertyType==="commercial"&&restrooms!==""?Number(restrooms):null,
                p_last_professional_clean:lastClean||null,
                p_cleaning_condition:cleaningCondition||null,
                p_access_notes:accessNotes||null,
                p_business_hours:propertyType==="commercial"?(businessHours||null):null,
                p_clean_during_business_hours:propertyType==="commercial"?(cleanDuringBusinessHours||null):null
              });
            }
            form.hidden=true;
            $("#publicSuccess").hidden=false;
            $("#publicSuccessCopy").textContent=tt(mode==="quote"
              ?"Your quote request was sent. The business will review it and contact you."
              :"Your booking request was sent. The business will review it and confirm the appointment.");
          }catch(err){
            console.warn("[TLE] public request submit",err); alert(tt("Could not send request"));
            submit.disabled=false;
            submit.textContent=old;
          }
        });
      }
    }catch(err){
      $("#publicBusinessName").textContent=tt("Page unavailable");
      console.warn("[TLE] public booking",err); $("#publicIntro").textContent=tt("This page is not available.");
      $("#publicRequestForm").hidden=true;
    }
  }

  async function boot(){
    showPublicShell();
    window.addEventListener("tle:languagechange",event=>{
      const chosen=String(event?.detail?.language||"").toLowerCase();
      if(!supportedPublicLanguages.includes(chosen)) return;
      publicLocale=({en:"en-US",es:"es-US",pt:"pt-BR",fr:"fr-FR"})[chosen]||publicLocale;
      try{
        const next=new URL(window.location.href);
        next.searchParams.set("lang",chosen);
        history.replaceState(history.state||{},"",next.pathname+next.search+next.hash);
      }catch{}
    });
    await track();

    if(validQuoteReview) await bootQuoteReview();
    else if(validInvoiceView) await bootInvoiceView();
    else await bootRequest();

    $("#publicBackBtn")?.addEventListener("click",()=>{
      if(history.length>1) history.back();
      else window.location.href=window.location.origin+window.location.pathname;
    });
  }

  boot();
})();
(() => {
  const params = new URLSearchParams(window.location.search);
  let mode = params.get("public");
  const slug = params.get("slug");
  const token = params.get("token");
  const requestedLanguage=String(params.get("lang")||"").toLowerCase();
  const supportedPublicLanguages=["en","es","fr","ht"];
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
    const localeByLanguage={en:"en-US",es:"es-US",fr:"fr-FR",ht:"ht-HT"};
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

  function showPublicConfirmation(title,message,detail=""){
    document.querySelector(".public-confirmation-overlay")?.remove();
    const overlay=document.createElement("div");
    overlay.className="public-confirmation-overlay";
    overlay.setAttribute("role","dialog");
    overlay.setAttribute("aria-modal","true");
    overlay.innerHTML='<div class="public-confirmation-card">'+
      '<div class="public-confirmation-mark">✓</div>'+
      '<h2>'+esc(title)+'</h2>'+
      '<p>'+esc(message)+'</p>'+
      (detail?'<strong>'+esc(detail)+'</strong>':"")+
      '<button type="button" class="primary-btn" data-close-public-confirmation>'+esc(tt("Done"))+'</button>'+
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector("[data-close-public-confirmation]")?.addEventListener("click",()=>overlay.remove());
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
    const requestSwitch=$("#publicRequestSwitch");
    if(requestSwitch) requestSwitch.hidden=true;

    try{
      const data=await rpc("get_public_invoice_context",{p_token:token});
      setPublicLocale(data?.locale_code,data?.currency_code,data?.default_language);
      $("#publicBusinessName").textContent=data?.business_name||tt("Cleaning business");
      $("#publicModeLabel").textContent=tt("INVOICE");
      $("#publicIntro").textContent=tt("Review your invoice details below.");
      $("#invoiceViewTitle").textContent=tt("Invoice")+" #"+(data?.invoice_number||"");
      const invoiceStatus=String(data?.status||"").toLowerCase();
      const invoiceStatusLabel={
        sent:tt("Sent"),
        draft:tt("Draft"),
        paid:tt("Paid"),
        partial:tt("partial"),
        overdue:tt("Overdue"),
        void:tt("Void")
      }[invoiceStatus]||tt(invoiceStatus.replaceAll("_"," "));
      const meta=[
        data?.customer_name||"",
        data?.due_at ? tt("Due")+" "+new Intl.DateTimeFormat(publicLocale,{month:"short",day:"numeric",year:"numeric"}).format(new Date(data.due_at)) : "",
        invoiceStatusLabel||""
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
      const allowedPaymentMethods=new Set(["cash","check","zelle","other"]);
      const configuredMethods=Array.isArray(data?.payment_methods)&&data.payment_methods.length
        ? data.payment_methods.map(x=>String(x).toLowerCase()).filter(x=>allowedPaymentMethods.has(x))
        : ["cash","check","zelle","other"];
      const enabledMethods=configuredMethods.length?[...new Set(configuredMethods)]:["cash","check","zelle","other"];
      $("#invoiceViewMethods").textContent=enabledMethods.map(x=>tt(methodLabels[x]||x)).join(" · ");

      const choices=$("#invoicePaymentChoices");
      const choiceStatus=$("#invoicePaymentChoiceStatus");
      const submitInvoiceBtn=$("#submitInvoiceBtn");
      const otherWrap=$("#invoiceOtherPaymentWrap");
      const otherInput=$("#invoiceOtherPaymentMethod");
      const otherLabel=$("#invoiceOtherPaymentLabel");
      const copy={
        en:{label:"Other payment method",placeholder:"Example: Venmo, Cash App, Apple Pay",required:"Type the payment method before submitting."},
        es:{label:"Otra forma de pago",placeholder:"Ejemplo: Venmo, Cash App, Apple Pay",required:"Escribe la forma de pago antes de enviarla."},
        fr:{label:"Autre mode de paiement",placeholder:"Exemple : Venmo, Cash App, Apple Pay",required:"Indiquez le mode de paiement avant l’envoi."},
        ht:{label:"Lòt metòd peman",placeholder:"Egzanp: Venmo, Cash App, Apple Pay",required:"Ekri metòd peman an anvan ou voye."}
      }[currentPublicLanguage()]||{};
      if(otherLabel) otherLabel.textContent=copy.label||"Other payment method";
      if(otherInput) otherInput.placeholder=copy.placeholder||"Example: Venmo, Cash App, Apple Pay";

      let selected=String(data?.customer_payment_method||"").toLowerCase();
      let selectedDetail=String(data?.customer_payment_method_detail||"").trim();
      if(otherInput) otherInput.value=selectedDetail;
      const isPaid=String(data?.status||"").toLowerCase()==="paid";
      let hasSubmittedChoice=Boolean(data?.customer_payment_selected_at);
      if(!hasSubmittedChoice && selected && !enabledMethods.includes(selected)){
        selected="";
        selectedDetail="";
      }

      if(choices){
        choices.innerHTML=enabledMethods.map(method=>
          '<button type="button" data-invoice-payment="'+esc(method)+'">'+esc(tt(methodLabels[method]||method))+'</button>'
        ).join("");
      }

      const selectedDisplay=()=>selected==="other" && selectedDetail
        ? tt("Other")+" — "+selectedDetail
        : tt(methodLabels[selected]||selected||"");

      function renderPaymentChoice(){
        const locked=isPaid||hasSubmittedChoice;
        choices?.querySelectorAll("[data-invoice-payment]").forEach(btn=>{
          const active=btn.dataset.invoicePayment===selected;
          btn.classList.toggle("selected",active);
          btn.setAttribute("aria-pressed",active?"true":"false");
          btn.disabled=locked;
        });

        const needsOther=selected==="other";
        if(choices) choices.hidden=hasSubmittedChoice;
        if(otherWrap) otherWrap.hidden=hasSubmittedChoice || !needsOther;
        if(otherInput){
          otherInput.disabled=locked || !needsOther;
          otherInput.setAttribute("aria-required",needsOther?"true":"false");
        }

        if(submitInvoiceBtn){
          submitInvoiceBtn.hidden=isPaid||hasSubmittedChoice;
          submitInvoiceBtn.disabled=isPaid || !selected || (needsOther && selectedDetail.length<2);
        }

        if(!choiceStatus) return;
        if(isPaid){
          choiceStatus.textContent=selected
            ? tt("Paid")+" · "+selectedDisplay()
            : tt("Payment confirmed by the cleaning business.");
        }else if(hasSubmittedChoice){
          choiceStatus.textContent=tt("Payment method sent")+" ✓ · "+selectedDisplay();
        }else if(needsOther && selectedDetail.length<2){
          choiceStatus.textContent=copy.required||"Type the payment method before submitting.";
        }else if(selected){
          choiceStatus.textContent=tt("Selected")+": "+selectedDisplay()+". "+tt("Tap Submit invoice to send this choice.");
        }else{
          choiceStatus.textContent=tt("Choose a payment method, then submit your choice.");
        }
      }

      renderPaymentChoice();

      choices?.addEventListener("click",e=>{
        const btn=e.target.closest("[data-invoice-payment]");
        if(!btn || isPaid || hasSubmittedChoice) return;
        selected=String(btn.dataset.invoicePayment||"").toLowerCase();
        renderPaymentChoice();
        if(selected==="other") setTimeout(()=>otherInput?.focus(),0);
      });

      otherInput?.addEventListener("input",()=>{
        selectedDetail=String(otherInput.value||"").trim();
        renderPaymentChoice();
      });

      submitInvoiceBtn?.addEventListener("click",async()=>{
        if(isPaid || hasSubmittedChoice || !selected || (selected==="other" && selectedDetail.length<2)) return;
        submitInvoiceBtn.disabled=true;
        choices?.querySelectorAll("button").forEach(x=>x.disabled=true);
        if(otherInput) otherInput.disabled=true;
        if(choiceStatus) choiceStatus.textContent=tt("Submitting your payment choice…");
        try{
          const result=await rpc("select_invoice_payment_method_v2",{
            p_token:token,
            p_method:selected,
            p_other_detail:selected==="other"?selectedDetail:null
          });
          selected=String(result?.payment_method||selected).toLowerCase();
          selectedDetail=String(result?.payment_method_detail||selectedDetail||"").trim();
          hasSubmittedChoice=true;
          renderPaymentChoice();
          showPublicConfirmation(
            tt("Payment method sent"),
            tt("We received your payment choice."),
            selectedDisplay()+" · "+tt("The business will confirm it once the payment is received.")
          );
        }catch(err){
          if(choiceStatus) choiceStatus.textContent=err.message||tt("Could not submit invoice.");
          submitInvoiceBtn.disabled=false;
          choices?.querySelectorAll("button").forEach(x=>x.disabled=false);
          if(otherInput) otherInput.disabled=selected!=="other";
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
    const requestSwitch=$("#publicRequestSwitch");
    if(requestSwitch) requestSwitch.hidden=true;

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
      const data=await rpc("get_public_booking_config_v2",{p_slug:slug});
      setPublicLocale(data?.business?.locale_code,data?.business?.currency_code,data?.business?.default_language);

      const allServices=data?.services||[];
      const fixedPriceServices=allServices.filter(s=>s.pricing_type==="flat" && Number(s.base_price)>0);
      const quoteOnlyServices=allServices.filter(s=>!(s.pricing_type==="flat" && Number(s.base_price)>0));
      const addons=data?.addons||[];
      const discounts=data?.discounts||[];
      let services=[];

      const business=$("#publicBusinessName");
      const label=$("#publicModeLabel");
      const intro=$("#publicIntro");
      const submit=$("#publicSubmitBtn");
      const addWrap=$("#publicAddonsWrap");
      const discountWrap=$("#publicDiscountsWrap");
      const discountBox=$("#publicDiscounts");
      const discountInput=$("#publicDiscountId");
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
      const serviceCards=$("#publicServiceCards");
      const cleaningTypeSwitch=$("#publicCleaningTypeSwitch");
      const frequencyPills=$("#publicFrequencyPills");
      const recurrenceSelect=$("#publicRecurrencePattern");
      const heroPhoto=$("#publicHeroPhoto");
      const supportPhoto=$("#publicSupportPhoto");
      const headerBusinessName=$("#publicHeaderBusinessName");
      const headerMark=$("#publicHeaderMark");
      const supportTitle=$("#publicSupportTitle");
      const supportCopy=$("#publicSupportCopy");
      const summaryMicro=$("#publicSummaryMicro");
      const refreshBtn=$("#publicRefreshBtn");
      const discountUi=window.TLE_PUBLIC_DISCOUNTS?.create({
        discounts,
        wrap:discountWrap,
        box:discountBox,
        input:discountInput,
        money,
        onChange:()=>updateSummary()
      });

      if(business) business.textContent=data?.business?.name||tt("Cleaning service");
      if(headerBusinessName) headerBusinessName.textContent=data?.business?.name||tt("Cleaning service");
      if(headerMark){
        const mark=String(data?.business?.name||"CB").trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase();
        headerMark.textContent=mark||"CB";
      }
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

      const demoPhotos={
        "book-residential":{
          hero:"https://images.pexels.com/photos/36729566/pexels-photo-36729566.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/9462224/pexels-photo-9462224.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/19889139/pexels-photo-19889139.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaner in a bright residential home",
          summaryAlt:"Professional cleaner working in a residential kitchen",
          supportAlt:"Bright clean residential living room"
        },
        "book-commercial":{
          hero:"https://images.pexels.com/photos/33357392/pexels-photo-33357392.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/36303748/pexels-photo-36303748.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/10567236/pexels-photo-10567236.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaners at a modern commercial building",
          summaryAlt:"Commercial cleaning cart in a business hallway",
          supportAlt:"Modern commercial workspace"
        },
        "quote-residential":{
          hero:"https://images.pexels.com/photos/6196692/pexels-photo-6196692.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/4239128/pexels-photo-4239128.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/5591909/pexels-photo-5591909.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaners preparing a residential cleaning",
          summaryAlt:"Residential cleaner washing a bathroom fixture",
          supportAlt:"Cleaner wiping a residential kitchen counter"
        },
        "quote-commercial":{
          hero:"https://images.pexels.com/photos/8811390/pexels-photo-8811390.jpeg?auto=compress&cs=tinysrgb&w=1400",
          summary:"https://images.pexels.com/photos/34516664/pexels-photo-34516664.jpeg?auto=compress&cs=tinysrgb&w=900",
          support:"https://images.pexels.com/photos/18134199/pexels-photo-18134199.jpeg?auto=compress&cs=tinysrgb&w=1200",
          heroAlt:"Professional cleaner washing a commercial storefront window",
          summaryAlt:"Professional janitorial supplies for a commercial space",
          supportAlt:"Professional cleaners at a modern office building"
        }
      };

      function activePropertyType(){
        return String(propertyTypeSelect?.value||"residential").toLowerCase()==="commercial"?"commercial":"residential";
      }

      const bookingPropertyPhotos={
        residential:{
          hero:"https://images.pexels.com/photos/10161222/pexels-photo-10161222.jpeg?auto=compress&cs=tinysrgb&w=1400",
          heroAlt:"Bright modern residential living room with no people",
          summary:"https://images.pexels.com/photos/15242038/pexels-photo-15242038.jpeg?auto=compress&cs=tinysrgb&w=900",
          summaryAlt:"Modern residential living room interior"
        },
        commercial:{
          hero:"https://images.pexels.com/photos/7534224/pexels-photo-7534224.jpeg?auto=compress&cs=tinysrgb&w=1400",
          heroAlt:"Modern commercial office interior with no people",
          summary:"https://images.pexels.com/photos/6794918/pexels-photo-6794918.jpeg?auto=compress&cs=tinysrgb&w=900",
          summaryAlt:"Bright modern commercial office interior"
        },
        confirmation:{
          hero:"https://images.pexels.com/photos/7746083/pexels-photo-7746083.jpeg?auto=compress&cs=tinysrgb&w=1400",
          heroAlt:"Neutral clean modern hallway with no people"
        }
      };

      function activeDemoPhotos(){
        return demoPhotos[(mode==="quote"?"quote":"book")+"-"+activePropertyType()]||demoPhotos["book-residential"];
      }

      function activePropertyPhotos(){
        return bookingPropertyPhotos[activePropertyType()]||bookingPropertyPhotos.residential;
      }

      function updateDemoPhotos(){
        const set=activeDemoPhotos();
        const propertyPhotos=activePropertyPhotos();
        if(heroPhoto){ heroPhoto.src=propertyPhotos.hero; heroPhoto.alt=propertyPhotos.heroAlt; }
        if(supportPhoto){ supportPhoto.src=set.support; supportPhoto.alt=set.supportAlt; }
      }

      function serviceScope(service){
        const hay=(String(service?.name||"")+" "+String(service?.description||"")).toLowerCase();
        const commercial=/commercial|office|janitorial|storefront|retail|workspace|warehouse|industrial|medical|dental|restaurant|business/.test(hay);
        const residential=/residential|home|house|apartment|condo|move[- ]?in|move[- ]?out/.test(hay);
        if(commercial&&!residential) return "commercial";
        if(residential&&!commercial) return "residential";
        return "both";
      }

      function addonScope(addon){
        const hay=(String(addon?.name||"")+" "+String(addon?.description||"")).toLowerCase();
        const commercial=/commercial|office|janitorial|storefront|retail|workspace|warehouse|industrial|medical|dental|restaurant|breakroom|kitchenette|trash|liner|high[- ]?touch/.test(hay);
        const residential=/residential|home|house|apartment|condo|oven|refrigerator|fridge|baseboard/.test(hay);
        if(commercial&&!residential) return "commercial";
        if(residential&&!commercial) return "residential";
        return "both";
      }

      function bookingEstimateCopy(key){
        const l=String(publicLocale||"en").toLowerCase();
        const code=l.startsWith("es")?"es":l.startsWith("fr")?"fr":l.startsWith("ht")?"ht":"en";
        const content={
          estimated:{en:"Estimated",es:"Aproximado",fr:"Estimation",ht:"Estimasyon"},
          note:{en:"This price is an estimate, not a fixed rate. The business will check your home details and send a final quote for you to accept. Your appointment is not confirmed yet.",es:"Este precio es aproximado, no fijo. El negocio revisará los datos de tu casa y te enviará el quote final para que lo aceptes. Tu cita aún no está confirmada.",fr:"Ce prix est estimatif. L’entreprise vérifiera les informations et vous enverra un devis final à accepter. Votre rendez-vous n’est pas encore confirmé.",ht:"Pri sa a se yon estimasyon, li pa fiks. Biznis la ap verifye detay kay ou epi voye pri final la pou ou aksepte. Randevou a poko konfime."},
          request:{en:"Booking request",es:"Solicitud de reserva",fr:"Demande de réservation",ht:"Demann rezèvasyon"}
        };
        return content[key]?.[code]||content[key]?.en||"";
      }
      function servicesForRequest(nextMode){
        const pool=nextMode==="quote"?quoteOnlyServices:fixedPriceServices;
        const property=activePropertyType();
        const scoped=pool.filter(service=>{
          const scope=serviceScope(service);
          return scope==="both"||scope===property;
        });
        return scoped.length?scoped:pool;
      }

      function renderServiceCards(){
        if(!serviceCards) return;
        if(!services.length){
          serviceCards.innerHTML='<div class="public-demo-empty">'+esc(tt(mode==="quote"
            ?"No quote-only services available yet"
            :"No priced services available for online booking"))+'</div>';
          return;
        }
        serviceCards.innerHTML=services.map(service=>{
          const selected=select?.value===service.id;
          const price=mode==="quote"
            ? tt("Custom quote")
            : service.base_price!=null?bookingEstimateCopy("estimated")+" · "+money(service.base_price):"";
          return '<button type="button" class="public-demo-service-card'+(selected?" selected":"")+'" data-service-card="'+esc(service.id)+'">'+
            '<span class="public-demo-service-check">✓</span>'+
            '<strong>'+esc(service.name)+'</strong>'+
            (service.description?'<p>'+esc(service.description)+'</p>':"")+
            '<span>'+esc(price)+'</span>'+
          '</button>';
        }).join("");
      }

      function syncCleaningTypeUi(){
        const property=activePropertyType();
        cleaningTypeSwitch?.querySelectorAll("[data-property-type]").forEach(btn=>{
          btn.classList.toggle("selected",btn.dataset.propertyType===property);
        });
        updateDemoPhotos();
        if(supportTitle) supportTitle.textContent=tt(property==="commercial"
          ?"Tell us about the space. We’ll prepare the right cleaning."
          :"Tell us about your home. We’ll take it from here.");
        if(supportCopy) supportCopy.textContent=tt(property==="commercial"
          ?"Choose the service, space details, date, and contact information so the business can prepare the commercial job correctly."
          :"Choose the service, home details, date, and contact information so the business can prepare the job correctly.");
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
        const type=activePropertyType();
        if(residentialDetails) residentialDetails.hidden=type!=="residential";
        if(commercialDetails) commercialDetails.hidden=type!=="commercial";

        const bedrooms=form?.querySelector('[name="bedrooms"]');
        const bathrooms=form?.querySelector('[name="bathrooms"]');
        const commercialType=form?.querySelector('[name="commercial_space_type"]');
        if(bedrooms) bedrooms.required=type==="residential";
        if(bathrooms) bathrooms.required=type==="residential";
        if(commercialType) commercialType.required=type==="commercial";

        if(propertySizeInput) propertySizeInput.required=false;
        if(propertySizeOptional) propertySizeOptional.hidden=false;
        syncCleaningTypeUi();
      }

      function syncPetDetails(){
        if(!petDetailsWrap) return;
        petDetailsWrap.hidden=String(petsSelect?.value||"")!=="yes";
        const input=petDetailsWrap.querySelector('input[name="pet_details"]');
        if(input && petDetailsWrap.hidden) input.value="";
      }

      if(propertyTypeSelect && !propertyTypeSelect.value) propertyTypeSelect.value="residential";
      renderBusinessTimeZoneNotice();
      syncPropertyDetails();
      syncPetDetails();
      propertyTypeSelect?.addEventListener("change",()=>{
        addonBox?.querySelectorAll('input[name="addon"]:checked').forEach(input=>{ input.checked=false; });
        syncPropertyDetails();
        const forceQuote=activePropertyType()==="commercial" && mode==="book";
        renderMode(forceQuote?"quote":mode,{updateUrl:forceQuote});
      });
      frequencyPills?.addEventListener("click",e=>{
        const btn=e.target.closest("[data-frequency]");
        if(!btn || !recurrenceSelect) return;
        recurrenceSelect.value=btn.dataset.frequency;
        frequencyPills.querySelectorAll("[data-frequency]").forEach(x=>x.classList.toggle("selected",x===btn));
        updateSummary();
      });
      recurrenceSelect?.addEventListener("change",()=>{
        frequencyPills?.querySelectorAll("[data-frequency]").forEach(x=>x.classList.toggle("selected",x.dataset.frequency===recurrenceSelect.value));
        updateSummary();
      });
      form?.addEventListener("input",updateSummary);
      form?.addEventListener("change",updateSummary);
      cleaningTypeSwitch?.addEventListener("click",e=>{
        const btn=e.target.closest("[data-property-type]");
        if(!btn || !propertyTypeSelect) return;
        propertyTypeSelect.value=btn.dataset.propertyType;
        propertyTypeSelect.dispatchEvent(new Event("change",{bubbles:true}));
      });
      petsSelect?.addEventListener("change",syncPetDetails);

      function chosenAddonIds(){
        return addonBox ? $$('input[name="addon"]:checked',addonBox).map(x=>x.value) : [];
      }

      function updateSummary(){
        if(!summary) return;
        const selected=services.find(s=>s.id===select?.value);
        const photos=activePropertyPhotos();
        const property=activePropertyType();
        const chosenIds=chosenAddonIds();
        const chosen=addons.filter(a=>chosenIds.includes(a.id));
        const baseTotal=window.TLE_PUBLIC_ESTIMATE?.calculate({
          rules:data?.business?.estimate_settings||{},
          service:selected,addons:chosen,propertyType:property,
          bedrooms:Number(form?.querySelector('[name="bedrooms"]')?.value||0),
          bathrooms:Number(form?.querySelector('[name="bathrooms"]')?.value||0),
          propertySize:Number(form?.querySelector('[name="property_size"]')?.value||0),
          propertyUnit:String(form?.querySelector('[name="property_size_unit"]')?.value||"sqft"),
          frequency:String(recurrenceSelect?.value||"one_time")
        })??0;
        const discountPrice=discountUi?.price(baseTotal)||{discount:0,final:baseTotal,discountRecord:null};
        const total=discountPrice.final;
        const recurrenceLabel=recurrenceSelect?.selectedOptions?.[0]?.textContent?.trim()||tt("One time");
        const chosenSlot=slotsBox?.querySelector("[data-slot].selected");
        const timeLabel=chosenSlot?.textContent?.trim()||tt("Choose a time");
        const dateLabel=dateInput?.value?formatDate(dateInput.value):tt("Choose a date");
        const bedrooms=form?.querySelector('[name="bedrooms"]')?.value;
        const bathrooms=form?.querySelector('[name="bathrooms"]')?.value;
        const commercialType=form?.querySelector('[name="commercial_space_type"]')?.selectedOptions?.[0]?.textContent?.trim();
        const restrooms=form?.querySelector('[name="restrooms"]')?.value;
        const homeLabel=property==="commercial"
          ? [tt("Commercial"),commercialType&&commercialType!==tt("Choose one")?commercialType:"",restrooms?restrooms+" "+tt("restrooms"):""].filter(Boolean).join(" · ")
          : [tt("Residential"),bedrooms?bedrooms+" "+tt("bedrooms"):"",bathrooms?bathrooms+" "+tt("bathrooms"):""].filter(Boolean).join(" · ");
        const extrasLabel=chosen.length?chosen.map(x=>x.name).join(", "):tt("None");
        summary.innerHTML=
          '<div class="public-demo-summary-top"><div><small>'+esc(tt(mode==="quote"?"Your quote request":bookingEstimateCopy("request")))+'</small><h3>'+esc(tt(selected?"Almost done.":"Start your request."))+'</h3></div><span>'+esc(tt(mode==="quote"?"QUOTE":"BOOKING"))+'</span></div>'+
          '<div class="public-demo-summary-photo"><img src="'+esc(photos.summary)+'" alt="'+esc(photos.summaryAlt)+'"></div>'+
          '<div class="public-demo-summary-row"><span>'+esc(tt("Service"))+'</span><strong>'+esc(selected?.name||tt("Choose a service"))+'</strong></div>'+
          '<div class="public-demo-summary-row"><span>'+esc(tt("Property"))+'</span><strong>'+esc(homeLabel||tt(property==="commercial"?"Commercial":"Residential"))+'</strong></div>'+
          '<div class="public-demo-summary-row"><span>'+esc(tt("Frequency"))+'</span><strong>'+esc(recurrenceLabel)+'</strong></div>'+
          '<div class="public-demo-summary-row"><span>'+esc(tt("Date"))+'</span><strong>'+esc(dateLabel)+'</strong></div>'+
          '<div class="public-demo-summary-row"><span>'+esc(tt("Time"))+'</span><strong>'+esc(timeLabel)+'</strong></div>'+
          '<div class="public-demo-summary-row"><span>'+esc(tt("Add-ons"))+'</span><strong>'+esc(extrasLabel)+'</strong></div>'+
          (discountPrice.discountRecord?'<div class="public-demo-summary-row discount-row"><span>'+esc(discountUi?.label("discount")||"Discount")+'</span><strong>−'+esc(money(discountPrice.discount))+' · '+esc(discountPrice.discountRecord.name)+'</strong></div>':"")+
          '<div class="public-demo-summary-total"><span>'+esc(tt(mode==="quote"?"Pricing":"Estimated total"))+'</span><strong>'+esc(mode==="quote"?tt("Custom quote"):selected?money(total):"—")+'</strong></div>'+ (mode==="book" ? '<p class="booking-estimate-disclaimer">'+esc(bookingEstimateCopy("note"))+'</p>' : '');
        if(summaryMicro) summaryMicro.textContent=tt(mode==="quote"
          ?"No payment is collected here. The business will review your details and prepare the quote."
          :bookingEstimateCopy("note"));
      }

      function renderAddons(){
        const selected=services.find(s=>s.id===select?.value);
        if(!addonBox) return;
        const property=activePropertyType();
        const available=addons.filter(a=>{
          if(a.service_id && a.service_id!==selected?.id) return false;
          const scope=addonScope(a);
          return scope==="both"||scope===property;
        });
        addonBox.innerHTML=available.length?available.map(a=>
          '<label class="addon-choice">'+
          '<input type="checkbox" name="addon" value="'+esc(a.id)+'">'+
          '<span><strong>'+esc(a.name)+'</strong><small>'+
          (mode==="quote"?esc(tt("Include in quote")):esc(bookingEstimateCopy("estimated"))+' +'+money(a.price)+' · +'+esc(a.extra_duration_minutes)+' min')+
          '</small></span>'+
          '</label>'
        ).join(""):'<span class="muted-line">'+esc(tt("No add-ons for this service."))+'</span>';
        discountUi?.render(selected?.id||"",mode);
        updateSummary();
      }

      function formatSlot(iso){
        return new Intl.DateTimeFormat(publicLocale,{
          timeZone:businessZone,hour:"numeric",minute:"2-digit"
        }).format(new Date(iso));
      }

      function slotLocalTimeValue(iso){
        const parts=new Intl.DateTimeFormat("en-GB",{
          timeZone:businessZone,
          hour:"2-digit",
          minute:"2-digit",
          hourCycle:"h23"
        }).formatToParts(new Date(iso));
        const map=Object.fromEntries(parts.map(part=>[part.type,part.value]));
        return (map.hour||"00")+":"+(map.minute||"00");
      }

      function syncSubmitForSlot(){
        if(!submit) return;
        submit.disabled=!services.length || !String(slotInput?.value||"").trim();
      }

      async function refreshSlots(){
        if(!slotsBox || !slotInput) return;
        slotInput.value="";
        if(quoteTimeInput) quoteTimeInput.value="";
        syncSubmitForSlot();
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
            p_addon_ids:mode==="quote"?[]:chosenAddonIds()
          });
          const slots=Array.isArray(rows)?rows:[];
          if(!slots.length){
            slotsBox.innerHTML='<div class="booking-availability-alert" role="status" aria-live="polite"><strong>'+esc(tt("No openings on this date. Try another day."))+'</strong></div>';
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
        // Commercial requests stay in the quote flow; direct booking is residential-only.
        if(nextMode==="book" && activePropertyType()==="commercial") nextMode="quote";
        mode=nextMode;
        services=servicesForRequest(mode);

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
          ?"Tell us what you need, then pick a day and available time."
          :"Choose what you need, then pick a day and available time.");
        if(submit){
          submit.textContent=tt(mode==="quote"?"Send quote request":"Request my quote");
        }
        if(addWrap) addWrap.hidden=false;
        if(quoteTimeWrap) quoteTimeWrap.hidden=true;
        if(recurrenceWrap) recurrenceWrap.hidden=false;
        if(slotsWrap) slotsWrap.hidden=false;

        if(select){
          select.value="";
          select.disabled=!services.length;
          select.innerHTML=services.length
            ? '<option value="">'+esc(tt(mode==="quote"?"Choose a custom job type":"Choose a service"))+'</option>'+services.map(s=>
                '<option value="'+esc(s.id)+'">'+esc(s.name)+
                (mode==="quote"?" · "+esc(tt("Custom quote")):s.base_price!=null?" · "+esc(bookingEstimateCopy("estimated"))+" "+money(s.base_price):"")+
                '</option>'
              ).join("")
            : '<option value="">'+esc(tt(mode==="quote"
                ?"No quote-only services available yet"
                :"No priced services available for online booking"))+'</option>';
        }
        renderServiceCards();
        syncCleaningTypeUi();

        if(slotInput) slotInput.value="";
        if(quoteTimeInput) quoteTimeInput.value="";
        if(slotsBox) slotsBox.innerHTML='<span class="muted-line">'+esc(tt("Choose a service and date first."))+'</span>';
        syncSubmitForSlot();
        if(addonBox) addonBox.innerHTML="";
        renderAddons();
        updateDemoPhotos();
        updateSummary();
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

      serviceCards?.addEventListener("click",e=>{
        const card=e.target.closest("[data-service-card]");
        if(!card || !select) return;
        select.value=card.dataset.serviceCard;
        renderServiceCards();
        renderAddons();
        refreshSlots();
        updateSummary();
      });
      select?.addEventListener("change",()=>{
        renderServiceCards();
        renderAddons();
        refreshSlots();
        updateSummary();
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
        if(quoteTimeInput) quoteTimeInput.value=slotLocalTimeValue(btn.dataset.slot);
        syncSubmitForSlot();
        updateSummary();
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
        dateInput.addEventListener("change",()=>{ refreshSlots(); updateSummary(); });
      }

      refreshBtn?.addEventListener("click",async()=>{
        if(refreshBtn.disabled) return;
        const original=refreshBtn.innerHTML;
        refreshBtn.disabled=true;
        refreshBtn.classList.add("is-refreshing");
        refreshBtn.innerHTML='<span aria-hidden="true">↻</span><b>'+esc(tt("Refreshing"))+'</b>';
        try{
          await refreshSlots();
          updateSummary();
          refreshBtn.innerHTML='<span aria-hidden="true">✓</span><b>'+esc(tt("Updated"))+'</b>';
        }catch(err){
          console.warn("[TLE] public refresh",err);
          refreshBtn.innerHTML='<span aria-hidden="true">↻</span><b>'+esc(tt("Refresh"))+'</b>';
        }finally{
          setTimeout(()=>{
            refreshBtn.disabled=false;
            refreshBtn.classList.remove("is-refreshing");
            refreshBtn.innerHTML=original;
          },900);
        }
      });

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
          const recurrencePattern=String(fd.get("recurrence_pattern")||"one_time").trim();
          const requestedAddonNames=addons
            .filter(addon=>fd.getAll("addon").includes(addon.id))
            .map(addon=>addon.name)
            .filter(Boolean);

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
            mode==="quote" ? "Frequency: "+recurrencePattern.replaceAll("_"," ") : "",
            mode==="quote" && requestedAddonNames.length ? "Requested extras: "+requestedAddonNames.join(", ") : "",
            customerNotes ? "Special requests: "+customerNotes : ""
          ].filter(Boolean).join("\n");
          const old=submit.textContent;
          submit.disabled=true;
          submit.textContent=tt("Sending…");
          try{
            const selectedSlot=String(fd.get("slot_start")||"").trim();
            if(!selectedSlot) throw new Error(tt("Choose one of the available times."));

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
                p_preferred_time:slotLocalTimeValue(selectedSlot),
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
              await rpc("submit_public_booking_request_v5",{
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
                p_clean_during_business_hours:propertyType==="commercial"?(cleanDuringBusinessHours||null):null,
                p_discount_id:discountUi?.selectedId()||null
              });
            }
            form.hidden=true;
            const confirmationPhoto=bookingPropertyPhotos.confirmation;
            if(heroPhoto){ heroPhoto.src=confirmationPhoto.hero; heroPhoto.alt=confirmationPhoto.heroAlt; }
            $("#publicSuccess").hidden=false;
            $("#publicSuccessCopy").textContent=tt(mode==="quote"
              ?"Your quote request was sent. The business will review it and contact you."
              :bookingEstimateCopy("note"));
          }catch(err){
            console.warn("[TLE] public request submit",err); alert(err?.message||tt("Could not send request"));
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
      publicLocale=({en:"en-US",es:"es-US",fr:"fr-FR",ht:"ht-HT"})[chosen]||publicLocale;
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
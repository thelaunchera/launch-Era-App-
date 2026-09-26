(() => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("public");
  const slug = params.get("slug");
  const token = params.get("token");

  const validRequestMode = ["book","quote"].includes(mode) && Boolean(slug);
  const validQuoteReview = mode === "quote-review" && Boolean(token);
  const validInvoiceView = mode === "invoice" && Boolean(token);
  if(!validRequestMode && !validQuoteReview && !validInvoiceView) return;

  window.__tlePublicHandled = true;

  const URL = "https://bowacxhmjvrqixtwaikv.supabase.co";
  const KEY = "sb_publishable_0TueitFYiRF3rAEMLMT8-w_FvbvY0rB";
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const money = v => new Intl.NumberFormat("en-US",{
    style:"currency",currency:"USD",maximumFractionDigits:2
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
    if(!res.ok) throw new Error(data?.message || data?.error || "Request failed");
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
      await rpc("track_app_visit",{
        p_visitor_id:visitorId(),
        p_page:"/public/"+mode,
        p_referrer:document.referrer||null,
        p_user_agent:navigator.userAgent||null
      });
    }catch{}
  }

  function showPublicShell(){
    const auth=$("#authShell"), app=$("#appShell"), worker=$("#workerShell"), pub=$("#publicShell");
    if(auth) auth.hidden=true;
    if(app) app.hidden=true;
    if(worker) worker.hidden=true;
    if(pub) pub.hidden=false;
  }

  function formatDate(value){
    if(!value) return "";
    const d=new Date(value+"T12:00:00");
    return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(d);
  }

  function formatTime(value){
    if(!value) return "";
    const parts=String(value).split(":");
    const d=new Date();
    d.setHours(Number(parts[0]||0),Number(parts[1]||0),0,0);
    return new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(d);
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
      $("#publicBusinessName").textContent=data?.business_name||"Cleaning business";
      $("#publicModeLabel").textContent="INVOICE";
      $("#publicIntro").textContent="Review your invoice details below.";
      $("#invoiceViewTitle").textContent="Invoice #"+(data?.invoice_number||"");
      const meta=[
        data?.customer_name||"",
        data?.due_at ? "Due "+new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(data.due_at)) : "",
        data?.status ? String(data.status).replaceAll("_"," ") : ""
      ].filter(Boolean).join(" · ");
      $("#invoiceViewMeta").textContent=meta;

      const items=data?.items||[];
      $("#invoiceViewItems").innerHTML=items.length
        ? items.map(item=>'<div class="quote-review-item"><span><strong>'+esc(item.description||"Cleaning service")+'</strong><small>'+esc(item.quantity||1)+' × '+money(item.unit_price)+'</small></span><b>'+money(item.line_total)+'</b></div>').join("")
        : '<div class="empty-inline"><strong>No invoice items found.</strong></div>';

      $("#invoiceViewSubtotal").textContent=money(data?.subtotal);
      $("#invoiceViewPaid").textContent=money(data?.paid_total);
      $("#invoiceViewBalance").textContent=money(data?.balance_due);
      $("#invoiceViewMethods").textContent=data?.payment_methods||"Cash · Check · Zelle";
    }catch(err){
      $("#publicBusinessName").textContent="Invoice unavailable";
      $("#publicIntro").textContent=err.message||"This invoice link is invalid or expired.";
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
      $("#publicBusinessName").textContent=data?.business_name||"Cleaning business";
      $("#publicModeLabel").textContent="QUOTE";
      $("#publicIntro").textContent="Review the details below and choose Accept or Decline.";

      $("#quoteReviewTitle").textContent="Quote for "+(data?.customer_name||"your cleaning");
      const meta=[
        data?.preferred_date ? formatDate(data.preferred_date) : "",
        data?.preferred_time ? formatTime(data.preferred_time) : "",
        data?.service_address || ""
      ].filter(Boolean).join(" · ");
      $("#quoteReviewMeta").textContent=meta;

      const items=data?.items||[];
      $("#quoteReviewItems").innerHTML=items.length
        ? items.map(item=>'<div class="quote-review-item"><span><strong>'+esc(item.description||"Cleaning service")+'</strong><small>Qty '+esc(item.quantity||1)+'</small></span><b>'+money(item.line_total)+'</b></div>').join("")
        : '<div class="empty-inline"><strong>No quote items found.</strong></div>';
      $("#quoteReviewTotal").textContent=money(data?.total);

      const status=String(data?.status||"");
      const actions=$("#quoteReviewActions");
      const statusEl=$("#quoteReviewStatus");
      if(status==="accepted"){
        if(actions) actions.hidden=true;
        statusEl.textContent="Accepted. Your service is confirmed.";
      }else if(status==="declined"){
        if(actions) actions.hidden=true;
        statusEl.textContent="This quote was declined.";
      }else if(status!=="sent"){
        if(actions) actions.hidden=true;
        statusEl.textContent="This quote is not currently awaiting a response.";
      }

      async function respond(action){
        const accept=$("#acceptQuoteBtn"), decline=$("#declineQuoteBtn");
        if(accept) accept.disabled=true;
        if(decline) decline.disabled=true;
        statusEl.textContent=action==="accept"?"Confirming your service…":"Declining quote…";
        try{
          const result=await rpc("respond_public_quote",{p_token:token,p_action:action});
          if(actions) actions.hidden=true;
          statusEl.textContent=action==="accept"
            ?"Accepted. Your service is confirmed and a confirmation email is on the way."
            :"Quote declined. The cleaning business can now follow up with you.";
          return result;
        }catch(err){
          statusEl.textContent=err.message||"Could not update quote.";
          if(accept) accept.disabled=false;
          if(decline) decline.disabled=false;
        }
      }

      $("#acceptQuoteBtn")?.addEventListener("click",()=>respond("accept"));
      $("#declineQuoteBtn")?.addEventListener("click",()=>respond("decline"));
    }catch(err){
      $("#publicBusinessName").textContent="Quote unavailable";
      $("#publicIntro").textContent=err.message||"This quote link is invalid or expired.";
      if(review) review.hidden=true;
    }
  }

  async function bootRequest(){
    try{
      const data=await rpc("get_public_booking_config",{p_slug:slug});
      const allServices=data?.services||[];
      const services=allServices.filter(s=>
        mode==="quote" ? true : (s.pricing_type!=="quote" && Number(s.base_price)>0)
      );
      const addons=data?.addons||[];

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
      const slotsWrap=$("#publicSlotsWrap");
      const slotsBox=$("#publicSlots");
      const slotInput=$("#publicSlotStart");

      if(business) business.textContent=data?.business?.name||"Cleaning service";
      if(label) label.textContent=mode==="quote"?"REQUEST A QUOTE":"BOOK A CLEANING";
      if(intro) intro.textContent=mode==="quote"
        ?"Tell us what you need and the business will review your request."
        :"Choose a service, date, and one of the real available times below.";
      if(submit) submit.textContent=mode==="quote"?"Send quote request":"Send booking request";
      if(addWrap) addWrap.hidden=mode==="quote";
      if(quoteTimeWrap) quoteTimeWrap.hidden=mode!=="quote";
      if(slotsWrap) slotsWrap.hidden=mode==="quote";

      const quoteTimeInput=form?.querySelector('[name="time"]');
      if(quoteTimeInput) quoteTimeInput.required=mode==="quote";

      if(!services.length){
        if(select){
          select.innerHTML='<option value="">'+(mode==="quote"
            ?"No services available yet"
            :"No priced services available for online booking")+'</option>';
          select.disabled=true;
        }
        if(submit) submit.disabled=true;
        if(summary) summary.innerHTML=mode==="quote"
          ? '<span>No services are available yet. Please contact the cleaning business directly.</span>'
          : '<span>No instant-booking services are available yet. Services without a fixed price require a quote.</span><button type="button" class="primary-btn" id="bookingToQuoteBtn">Request a Quote</button>';
        $("#bookingToQuoteBtn")?.addEventListener("click",()=>{
          window.location.href=window.location.origin+window.location.pathname+"?public=quote&slug="+encodeURIComponent(slug);
        });
      }else if(select){
        select.innerHTML='<option value="">Choose a service</option>'+services.map(s=>
          '<option value="'+esc(s.id)+'">'+esc(s.name)+
          (s.pricing_type==="quote"?" · Quote required":s.base_price!=null?" · "+money(s.base_price):"")+
          '</option>'
        ).join("");
      }

      function chosenAddonIds(){
        return addonBox ? $$('input[name="addon"]:checked',addonBox).map(x=>x.value) : [];
      }

      function updateSummary(){
        const selected=services.find(s=>s.id===select?.value);
        if(!summary) return;
        if(!selected){ summary.innerHTML=""; return; }
        const chosenIds=chosenAddonIds();
        const chosen=addons.filter(a=>chosenIds.includes(a.id));
        const total=(Number(selected.base_price)||0)+chosen.reduce((sum,a)=>sum+Number(a.price||0),0);
        const duration=Number(selected.duration_minutes||0)+chosen.reduce((sum,a)=>sum+Number(a.extra_duration_minutes||0),0);
        summary.innerHTML='<strong>'+esc(selected.name)+'</strong><span>'+duration+' min'+
          (selected.pricing_type==="quote"?" · Quote will be reviewed":" · Estimated "+money(total))+
          '</span>';
      }

      function renderAddons(){
        const selected=services.find(s=>s.id===select?.value);
        if(!addonBox) return;
        const available=addons.filter(a=>!a.service_id||a.service_id===selected?.id);
        addonBox.innerHTML=available.length?available.map(a=>
          '<label class="addon-choice">'+
          '<input type="checkbox" name="addon" value="'+esc(a.id)+'">'+
          '<span><strong>'+esc(a.name)+'</strong><small>+'+money(a.price)+' · +'+esc(a.extra_duration_minutes)+' min</small></span>'+
          '</label>'
        ).join(""):'<span class="muted-line">No add-ons for this service.</span>';
        updateSummary();
      }

      function formatSlot(iso){
        const tz=data?.business?.timezone||"America/New_York";
        return new Intl.DateTimeFormat("en-US",{
          timeZone:tz,hour:"numeric",minute:"2-digit"
        }).format(new Date(iso));
      }

      async function refreshSlots(){
        if(mode==="quote" || !slotsBox || !slotInput) return;
        slotInput.value="";
        const serviceId=select?.value;
        const dateValue=form?.querySelector('[name="date"]')?.value;
        if(!serviceId || !dateValue){
          slotsBox.innerHTML='<span class="muted-line">Choose a service and date first.</span>';
          return;
        }

        slotsBox.innerHTML='<span class="muted-line">Checking availability…</span>';
        try{
          const rows=await rpc("get_public_available_slots",{
            p_slug:slug,
            p_service_id:serviceId,
            p_date:dateValue,
            p_addon_ids:chosenAddonIds()
          });
          const slots=Array.isArray(rows)?rows:[];
          if(!slots.length){
            slotsBox.innerHTML='<span class="muted-line">No openings on this date. Try another day.</span>';
            return;
          }
          slotsBox.innerHTML=slots.map(row=>
            '<button type="button" class="slot-btn" data-slot="'+esc(row.slot_start)+'">'+esc(formatSlot(row.slot_start))+'</button>'
          ).join("");
        }catch(err){
          slotsBox.innerHTML='<span class="muted-line">'+esc(err.message||"Could not load availability")+'</span>';
        }
      }

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
      renderAddons();

      const dateInput=form?.querySelector('[name="date"]');
      if(dateInput){
        dateInput.min=new Date().toLocaleDateString("en-CA");
        dateInput.addEventListener("change",refreshSlots);
      }

      if(form){
        form.addEventListener("submit",async e=>{
          e.preventDefault();
          if(!services.length) return;
          const fd=new FormData(form);
          const preferred=fd.get("preferred_contact");
          const phone=String(fd.get("phone")||"").trim();
          if((preferred==="text"||preferred==="whatsapp")&&!phone){
            alert("Phone is required for Text or WhatsApp.");
            return;
          }
          const old=submit.textContent;
          submit.disabled=true;
          submit.textContent="Sending…";
          try{
            if(mode==="quote"){
              await rpc("submit_public_quote_request",{
                p_slug:slug,
                p_service_id:fd.get("service_id"),
                p_customer_name:String(fd.get("name")).trim(),
                p_customer_email:String(fd.get("email")).trim(),
                p_customer_phone:phone||null,
                p_preferred_contact:preferred,
                p_service_address:String(fd.get("address")).trim(),
                p_preferred_date:fd.get("date"),
                p_preferred_time:fd.get("time"),
                p_notes:String(fd.get("notes")||"").trim()||null
              });
            }else{
              const selectedSlot=String(fd.get("slot_start")||"").trim();
              if(!selectedSlot) throw new Error("Choose one of the available times.");
              await rpc("submit_public_booking_request",{
                p_slug:slug,
                p_service_id:fd.get("service_id"),
                p_addon_ids:fd.getAll("addon"),
                p_customer_name:String(fd.get("name")).trim(),
                p_customer_email:String(fd.get("email")).trim(),
                p_customer_phone:phone||null,
                p_preferred_contact:preferred,
                p_service_address:String(fd.get("address")).trim(),
                p_requested_start_at:selectedSlot,
                p_notes:String(fd.get("notes")||"").trim()||null
              });
            }
            form.hidden=true;
            $("#publicSuccess").hidden=false;
            $("#publicSuccessCopy").textContent=mode==="quote"
              ?"Your quote request was sent. The business will review it and contact you."
              :"Your booking request was sent. The business will review it and confirm the appointment.";
          }catch(err){
            alert(err.message||"Could not send request");
            submit.disabled=false;
            submit.textContent=old;
          }
        });
      }
    }catch(err){
      $("#publicBusinessName").textContent="Page unavailable";
      $("#publicIntro").textContent=err.message||"This page is not available.";
      $("#publicRequestForm").hidden=true;
    }
  }

  async function boot(){
    showPublicShell();
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
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://bowacxhmjvrqixtwaikv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0TueitFYiRF3rAEMLMT8-w_FvbvY0rB";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const state = {
  session: null,
  business: null,
  clients: [],
  services: [],
  jobs: [],
  quotes: [],
  teamMembers: [],
  members: [],
  invites: [],
  authMode: "signin",
  modalType: null,
  modalId: null
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const authShell = $("#authShell");
const appShell = $("#appShell");
const authPanel = $("#authPanel");
const businessSetup = $("#businessSetup");
const authForm = $("#authForm");
const businessForm = $("#businessForm");
const entityForm = $("#entityForm");
const modal = $("#modalBackdrop");
const toastEl = $("#toast");
const sidebar = $("#sidebar");
const pageTitle = $("#pageTitle");

const pageTitles = {
  today:"Today", booking:"Booking Center", leads:"Leads", clients:"Clients",
  calendar:"Calendar + Jobs", quotes:"Quotes", invoices:"Invoices",
  route:"Today's Route", mileage:"Mileage", time:"Time Tracking",
  reports:"Owner Reports", services:"Services + Add-ons", team:"Team", settings:"Settings", admin:"Owner Admin", help:"Help & FAQ"
};

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[ch]);
}
function money(value){
  if(value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(Number(value));
}
function formatDateTime(value){
  if(!value) return "—";
  return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(value));
}
function showToast(message){
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(window.__tleToast);
  window.__tleToast = setTimeout(()=>toastEl.classList.remove("show"),1900);
}
function setBusy(button,busy,label="Working…"){
  if(!button) return;
  if(busy){
    button.dataset.oldText = button.textContent;
    button.disabled = true;
    button.textContent = label;
  }else{
    button.disabled = false;
    button.textContent = button.dataset.oldText || button.textContent;
  }
}
function showAuth(){
  authShell.hidden = false;
  appShell.hidden = true;
  authPanel.hidden = false;
  businessSetup.hidden = true;
}
function showSetup(){
  authShell.hidden = false;
  appShell.hidden = true;
  authPanel.hidden = true;
  businessSetup.hidden = false;
}
function showApp(){
  authShell.hidden = true;
  appShell.hidden = false;
  applyRolePermissions();
  const chip = $(".workspace-chip");
  if(chip && state.business){
    const roleLabel = state.business.role==="owner" ? "Owner workspace" : state.business.role==="admin" ? "Admin access" : "Coworker access";
    chip.innerHTML = `
      <span class="workspace-avatar">${escapeHtml(initials(state.business.name))}</span>
      <span><strong>${escapeHtml(state.business.name)}</strong><small>${roleLabel}</small></span>
    `;
  }
}
function initials(name=""){
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase() || "TL";
}
function applyRolePermissions(){
  const role=state.business?.role||"coworker";
  $("[data-owner-only]").forEach(el=>el.hidden=role!=="owner");
  $("[data-admin-only]").forEach(el=>el.hidden=!["owner","admin"].includes(role));
  if(role==="coworker"){
    const active=$(".nav-item.active");
    if(active && active.hidden) openView("today");
  }
}

function openView(id){
  $$(".view").forEach(v=>v.classList.toggle("active",v.dataset.page===id));
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===id));
  pageTitle.textContent=pageTitles[id]||"The Launch Era Cleaning App";
  sidebar.classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>openView(btn.dataset.view)));
$$("[data-jump]").forEach(btn=>btn.addEventListener("click",()=>openView(btn.dataset.jump)));
$("#menuToggle").addEventListener("click",()=>sidebar.classList.toggle("open"));

function setAuthMode(mode){
  state.authMode = mode;
  const title = $("#authTitle");
  const copy = $("#authCopy");
  const submit = $("#authSubmit");
  const switchBtn = $("#authSwitch");
  const password = $("#authPassword");
  if(mode === "signup"){
    title.textContent = "Create account";
    copy.textContent = "Start your private cleaning business workspace.";
    submit.textContent = "Create account";
    switchBtn.textContent = "Already have an account? Sign in";
    password.autocomplete = "new-password";
  }else if(mode === "recovery"){
    title.textContent = "Choose a new password";
    copy.textContent = "Enter the new password you want to use.";
    submit.textContent = "Update password";
    switchBtn.hidden = true;
    $("#forgotPassword").hidden = true;
    $("#authEmail").closest("label").hidden = true;
    password.autocomplete = "new-password";
  }else{
    title.textContent = "Sign in";
    copy.textContent = "Open your cleaning business workspace.";
    submit.textContent = "Sign in";
    switchBtn.textContent = "Create account";
    switchBtn.hidden = false;
    $("#forgotPassword").hidden = false;
    $("#authEmail").closest("label").hidden = false;
    password.autocomplete = "current-password";
  }
}
$("#authSwitch").addEventListener("click",()=>setAuthMode(state.authMode==="signup"?"signin":"signup"));

authForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const button = $("#authSubmit");
  setBusy(button,true);
  try{
    const email = $("#authEmail").value.trim();
    const password = $("#authPassword").value;
    if(state.authMode === "recovery"){
      const { error } = await supabase.auth.updateUser({password});
      if(error) throw error;
      setAuthMode("signin");
      showToast("Password updated");
      await initialize();
      return;
    }
    if(state.authMode === "signup"){
      const { data, error } = await supabase.auth.signUp({
        email,password,
        options:{ emailRedirectTo: window.location.href.split("#")[0].split("?")[0] }
      });
      if(error) throw error;
      if(data.session){
        await initialize();
      }else{
        setAuthMode("signin");
        showToast("Check your email to verify your account");
      }
    }else{
      const { error } = await supabase.auth.signInWithPassword({email,password});
      if(error) throw error;
      await initialize();
    }
  }catch(err){
    showToast(err.message || "Could not continue");
  }finally{
    setBusy(button,false);
  }
});

$("#forgotPassword").addEventListener("click", async ()=>{
  const email = $("#authEmail").value.trim();
  if(!email){ showToast("Enter your email first"); return; }
  const { error } = await supabase.auth.resetPasswordForEmail(email,{
    redirectTo: window.location.href.split("#")[0].split("?")[0]
  });
  showToast(error ? error.message : "Password reset email sent");
});

$("#signOutBtn").addEventListener("click", async ()=>{
  await supabase.auth.signOut();
  state.session=null; state.business=null;
  showAuth();
});

businessForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const button = e.submitter;
  setBusy(button,true,"Creating…");
  try{
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate()+30);
    const payload = {
      owner_user_id: state.session.user.id,
      name: $("#businessName").value.trim(),
      email: state.session.user.email,
      phone: $("#businessPhone").value.trim() || null,
      service_area: $("#businessArea").value.trim() || null,
      trial_started_at: start.toISOString(),
      trial_ends_at: end.toISOString(),
      subscription_status:"trial"
    };
    const { data, error } = await supabase.from("businesses").insert(payload).select().single();
    if(error) throw error;
    state.business={
      id:data.id,name:data.name,role:"owner",team_member_id:null,
      timezone:data.timezone,default_language:data.default_language,
      service_area:data.service_area,default_travel_buffer_minutes:data.default_travel_buffer_minutes,
      trial_ends_at:data.trial_ends_at,subscription_status:data.subscription_status
    };
    await loadCoreData();
    showApp();
    showToast("Workspace created");
  }catch(err){
    showToast(err.message || "Could not create workspace");
  }finally{
    setBusy(button,false);
  }
});

async function initialize(){
  const { data:{session} } = await supabase.auth.getSession();
  state.session = session;
  if(!session){ showAuth(); return; }

  const inviteToken=new URLSearchParams(window.location.search).get("invite");
  if(inviteToken){
    const {error:claimError}=await supabase.rpc("claim_business_invite",{p_token:inviteToken});
    if(claimError){
      showToast(claimError.message);
    }else{
      const clean=new URL(window.location.href);
      clean.searchParams.delete("invite");
      history.replaceState({}, "", clean.pathname + clean.hash);
      showToast("Workspace access accepted");
    }
  }

  const {data:contexts,error}=await supabase.rpc("get_my_business_context");
  if(error){ showToast(error.message); showAuth(); return; }
  const context=contexts?.[0];
  if(!context){ showSetup(); return; }

  state.business={
    id:context.business_id,
    name:context.business_name,
    role:context.role,
    team_member_id:context.team_member_id,
    timezone:context.timezone,
    default_language:context.default_language,
    service_area:context.service_area,
    default_travel_buffer_minutes:context.default_travel_buffer_minutes,
    trial_ends_at:context.trial_ends_at,
    subscription_status:context.subscription_status
  };
  await loadCoreData();
  showApp();
}

supabase.auth.onAuthStateChange(async (event, session)=>{
  if(event === "PASSWORD_RECOVERY"){
    state.session=session;
    showAuth();
    setAuthMode("recovery");
    return;
  }
  if(event === "SIGNED_OUT"){
    showAuth();
  }
});

async function loadCoreData(){
  if(!state.business) return;
  const businessId = state.business.id;
  const [clientsRes,servicesRes,jobsRes,quotesRes,teamRes] = await Promise.all([
    supabase.from("clients").select("*").eq("business_id",businessId).is("archived_at",null).order("created_at",{ascending:false}),
    supabase.from("services").select("*").eq("business_id",businessId).order("active",{ascending:false}).order("name"),
    supabase.from("jobs").select("*, clients(name,email), services(name), job_assignments(id,team_member_id,team_members(name))").eq("business_id",businessId).order("starts_at",{ascending:true}),
    supabase.from("quotes").select("*, quote_items(*)").eq("business_id",businessId).order("created_at",{ascending:false}),
    supabase.from("team_members").select("*").eq("business_id",businessId).eq("active",true).order("name")
  ]);
  const errors=[clientsRes.error,servicesRes.error,jobsRes.error,quotesRes.error,teamRes.error].filter(Boolean);
  if(errors.length) showToast(errors[0].message);
  state.clients=clientsRes.data||[];
  state.services=servicesRes.data||[];
  state.jobs=jobsRes.data||[];
  state.quotes=quotesRes.data||[];
  state.teamMembers=teamRes.data||[];
  renderClients();
  renderServices();
  renderJobs();
  renderQuotes();
  renderTeam();
  renderTodaySummary();
  if(state.business.role==="owner") await loadOwnerAdmin();
}


async function loadOwnerAdmin(){
  const [membersRes,invitesRes]=await Promise.all([
    supabase.from("business_members").select("*").eq("business_id",state.business.id).order("created_at"),
    supabase.from("business_invites").select("*").eq("business_id",state.business.id).is("accepted_at",null).is("revoked_at",null).order("created_at",{ascending:false})
  ]);
  state.members=membersRes.data||[];
  state.invites=invitesRes.data||[];
  renderMembers();
  const status=$("#adminPlanStatus");
  const trial=$("#adminTrialEnds");
  if(status) status.textContent=state.business.subscription_status||"Trial";
  if(trial) trial.textContent=state.business.trial_ends_at?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric"}).format(new Date(state.business.trial_ends_at)):"—";
}

function renderMembers(){
  const list=$("#membersList");
  if(!list) return;
  const rows=state.members.map(m=>`
    <div class="member-row">
      <div class="member-avatar">${escapeHtml(initials(m.display_name||m.email||m.role))}</div>
      <div><strong>${escapeHtml(m.display_name||m.email||"Team member")}</strong><small>${escapeHtml(m.email||"")} · ${escapeHtml(m.role)}</small></div>
      ${m.role==="owner"
        ? `<span class="status success">Owner</span>`
        : `<select data-member-role="${m.id}"><option value="admin" ${m.role==="admin"?"selected":""}>Admin</option><option value="coworker" ${m.role==="coworker"?"selected":""}>Coworker</option></select><button class="danger-link" data-remove-member="${m.id}">Remove</button>`}
    </div>
  `).join("");
  const pending=state.invites.map(i=>`
    <div class="member-row pending">
      <div class="member-avatar">✉</div>
      <div><strong>${escapeHtml(i.email)}</strong><small>Pending invite · ${escapeHtml(i.role)} · expires ${escapeHtml(formatDateTime(i.expires_at))}</small></div>
      <button data-copy-invite="${i.token}">Copy invite</button>
      <button class="danger-link" data-revoke-invite="${i.id}">Revoke</button>
    </div>
  `).join("");
  list.innerHTML=(rows||'<div class="empty-inline">No members yet.</div>')+pending;
}

function openInviteForm(){
  state.modalType="invite";state.modalId=null;
  modalHeader("OWNER ONLY","Invite teammate","Choose exactly what this person should be able to see.");
  entityForm.innerHTML=`
    <div class="form-grid">
      <label class="full">Email<input name="email" type="email" required placeholder="teammate@email.com"></label>
      <label class="full">Access level<select name="role">
        <option value="coworker">Coworker — assigned jobs only</option>
        <option value="admin">Admin — operate clients, jobs, quotes and invoices</option>
      </select></label>
    </div>
    <div class="permission-note">Owner-only areas stay hidden: billing, subscription, permissions, integrations, migration/security and Owner Reports.</div>
    ${formSubmit("Create invite link")}`;
  modal.hidden=false;
}

async function saveInvite(fd){
  const email=String(fd.get("email")||"").trim().toLowerCase();
  const role=fd.get("role");
  const {data,error}=await supabase.from("business_invites").insert({
    business_id:state.business.id,email,role,invited_by:state.session.user.id
  }).select("token").single();
  if(error) throw error;
  const link=new URL(window.location.href.split("#")[0]);
  link.search="";
  link.searchParams.set("invite",data.token);
  await copyText(link.toString());
  await loadOwnerAdmin();
  showToast("Invite link copied");
}

function renderTeam(){
  const grid=$("#teamGrid");
  if(!grid) return;
  if(!state.teamMembers.length){
    grid.innerHTML=`<article class="empty-card"><strong>No team profiles yet.</strong><span>Add a cleaner before assigning jobs.</span><button class="primary-btn" data-team-create>+ Add team profile</button></article>`;
    return;
  }
  grid.innerHTML=state.teamMembers.map(tm=>`
    <article class="client-card">
      <div class="client-avatar">${escapeHtml(initials(tm.name))}</div>
      <strong>${escapeHtml(tm.name)}</strong>
      <span>${escapeHtml(tm.role||"cleaner")}</span>
      <small>${escapeHtml(tm.email||tm.phone||"No contact saved")}</small>
      <div class="card-actions"><button data-team-edit="${tm.id}">Edit</button></div>
    </article>
  `).join("")+`<article class="client-card add-card" data-team-create><div>＋</div><strong>Add team profile</strong><span>Assign jobs and track time.</span></article>`;
}

function openTeamForm(id=null){
  state.modalType="team"; state.modalId=id;
  const record=state.teamMembers.find(x=>x.id===id);
  modalHeader("TEAM",record?"Edit team profile":"Add team profile","This profile is used for job assignment. App access is managed separately in Owner Admin.");
  entityForm.innerHTML=`
    <div class="form-grid">
      <label>Name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(record?.email||"")}"></label>
      <label>Phone<input name="phone" value="${escapeHtml(record?.phone||"")}"></label>
      <label>Role<input name="role" value="${escapeHtml(record?.role||"cleaner")}"></label>
    </div>
    ${formSubmit(record?"Save changes":"Add team profile")}`;
  modal.hidden=false;
}

async function saveTeam(fd){
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    email:String(fd.get("email")||"").trim()||null,
    phone:String(fd.get("phone")||"").trim()||null,
    role:String(fd.get("role")||"cleaner").trim()||"cleaner",
    active:true
  };
  const query=state.modalId
    ? supabase.from("team_members").update(payload).eq("id",state.modalId)
    : supabase.from("team_members").insert(payload);
  const {error}=await query;
  if(error) throw error;
}

function renderClients(){
  const grid=$("#clientsGrid");
  if(!grid) return;
  if(!state.clients.length){
    grid.innerHTML=`<article class="empty-card"><strong>No clients yet.</strong><span>Add the first real client when you're ready.</span><button class="primary-btn" data-create="client">+ Add client</button></article>`;
    return;
  }
  grid.innerHTML=state.clients.map(c=>`
    <article class="client-card">
      <div class="client-avatar">${escapeHtml(initials(c.name))}</div>
      <strong>${escapeHtml(c.name)}</strong>
      <span>${escapeHtml(c.email)}</span>
      <small>${escapeHtml([c.city,c.state].filter(Boolean).join(", ") || c.address_line1 || "No address yet")}</small>
      <div class="card-actions">
        <button data-edit="client" data-id="${c.id}">Edit</button>
        <button class="danger-link" data-archive-client="${c.id}">Archive</button>
      </div>
    </article>
  `).join("");
}

function renderServices(){
  const grid=$("#servicesGrid");
  if(!grid) return;
  const cards=state.services.map(s=>`
    <article class="${s.active?"":"inactive-card"}">
      <strong>${escapeHtml(s.name)}</strong>
      <span>${Math.round(s.default_duration_minutes/60*10)/10} hr · ${escapeHtml(s.pricing_type)}</span>
      <b>${s.pricing_type==="quote"?"Quote":money(s.base_price)}</b>
      <div class="card-actions">
        <button data-edit="service" data-id="${s.id}">Edit</button>
        <button data-toggle-service="${s.id}">${s.active?"Deactivate":"Activate"}</button>
      </div>
    </article>
  `).join("");
  grid.innerHTML=(cards||"")+`<article class="add-card" data-create="service"><div>＋</div><strong>Add service</strong><span>Set price, duration and booking basics.</span></article>`;
}

function renderJobs(){
  const list=$("#jobsList");
  if(!list) return;
  const visible=state.jobs.filter(j=>j.status!=="canceled");
  if(!visible.length){
    list.innerHTML=`<div class="empty-inline"><strong>No jobs scheduled.</strong><button class="text-btn" data-create="job">Add the first job →</button></div>`;
    return;
  }
  list.innerHTML=visible.slice(0,12).map(j=>`
    <div class="job-block">
      <time>${escapeHtml(formatDateTime(j.starts_at))}</time>
      <div>
        <strong>${escapeHtml(j.clients?.name || "Unassigned client")}</strong>
        <span>${escapeHtml(j.services?.name || "Cleaning job")} · ${Math.round(j.duration_minutes/60*10)/10}h${j.job_assignments?.[0]?.team_members?.name?" · "+escapeHtml(j.job_assignments[0].team_members.name):""}</span>
      </div>
      <div class="record-actions">
        <span class="status ${j.status==="completed"?"success":j.status==="in_progress"?"warning":"neutral"}">${escapeHtml(j.status.replaceAll("_"," "))}</span>
        ${state.business.role==="coworker"
          ? `<button data-coworker-status="${j.id}" data-status="on_the_way">On my way</button><button data-coworker-status="${j.id}" data-status="in_progress">Start</button><button data-coworker-status="${j.id}" data-status="completed">Complete</button>`
          : `<button data-edit="job" data-id="${j.id}">Edit</button><button class="danger-link" data-cancel-job="${j.id}">Cancel</button>`}
      </div>
    </div>
  `).join("");
}

function quoteColumn(status,label){
  const items=state.quotes.filter(q=>q.status===status);
  return `<div class="kanban-col"><h3>${label} <span>${items.length}</span></h3>
    ${items.length?items.map(q=>{
      const service=state.services.find(s=>s.id===q.quote_items?.[0]?.service_id);
      return `<article class="${status==="accepted"?"accepted":""}">
        <strong>${escapeHtml(q.customer_name)}</strong>
        <small>${escapeHtml(service?.name || "Cleaning service")} · ${money(q.total)}</small>
        <b>${status==="accepted"?"Client + job + invoice created":escapeHtml(status)}</b>
        <div class="card-actions">
          ${status!=="accepted"?`<button data-edit="quote" data-id="${q.id}">Edit</button>`:""}
          ${status==="requested"||status==="draft"?`<button data-mark-sent="${q.id}">Mark sent</button>`:""}
          ${status==="sent"?`<button class="accept-btn" data-accept-quote="${q.id}">Accept</button>`:""}
        </div>
      </article>`;
    }).join(""):`<div class="kanban-empty">Nothing here</div>`}
  </div>`;
}
function renderQuotes(){
  const board=$("#quotesBoard");
  if(!board) return;
  board.innerHTML=[
    quoteColumn("requested","Requested"),
    quoteColumn("draft","Draft"),
    quoteColumn("sent","Sent"),
    quoteColumn("accepted","Accepted")
  ].join("");
}

function renderTodaySummary(){
  const today=new Date();
  const sameDay=v=>{
    const d=new Date(v);
    return d.getFullYear()===today.getFullYear() && d.getMonth()===today.getMonth() && d.getDate()===today.getDate();
  };
  const cards=$$(".metric-card", $('[data-page="today"]'));
  if(cards[0]){ cards[0].querySelector("strong").textContent=state.jobs.filter(j=>sameDay(j.starts_at)&&j.status!=="canceled").length; cards[0].querySelector("small").textContent="Scheduled today"; }
  if(cards[1]){ cards[1].querySelector("span").textContent="Active clients"; cards[1].querySelector("strong").textContent=state.clients.length; cards[1].querySelector("small").textContent="Current client records"; }
  if(cards[2]){ cards[2].querySelector("strong").textContent=state.quotes.filter(q=>["requested","draft","sent"].includes(q.status)).length; cards[2].querySelector("small").textContent="Requested, draft or sent"; }
  if(cards[3]){ cards[3].querySelector("span").textContent="Active services"; cards[3].querySelector("strong").textContent=state.services.filter(s=>s.active).length; cards[3].querySelector("small").textContent="Available service types"; }
  if(cards[4]){ cards[4].querySelector("span").textContent="Scheduled jobs"; cards[4].querySelector("strong").textContent=state.jobs.filter(j=>j.status==="scheduled").length; cards[4].querySelector("small").textContent="Upcoming"; }
}

function optionList(items,valueKey,labelKey,selected){
  return items.map(item=>`<option value="${escapeHtml(item[valueKey])}" ${item[valueKey]===selected?"selected":""}>${escapeHtml(item[labelKey])}</option>`).join("");
}
function modalHeader(eyebrow,title,copy){
  $("#modalEyebrow").textContent=eyebrow;
  $("#modalTitle").textContent=title;
  $("#modalCopy").textContent=copy;
}
function openEntityForm(type,id=null){
  state.modalType=type; state.modalId=id;
  let record=null;
  if(type==="client") record=state.clients.find(x=>x.id===id);
  if(type==="service") record=state.services.find(x=>x.id===id);
  if(type==="job") record=state.jobs.find(x=>x.id===id);
  if(type==="quote") record=state.quotes.find(x=>x.id===id);

  if(type==="client"){
    modalHeader("CLIENT",record?"Edit client":"Add client","Keep contact, service address and preferences in one place.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>Email<input name="email" type="email" required value="${escapeHtml(record?.email||"")}"></label>
        <label>Phone<input name="phone" value="${escapeHtml(record?.phone||"")}"></label>
        <label>Preferred contact<select name="preferred_contact">
          <option value="email" ${record?.preferred_contact==="email"?"selected":""}>Email</option>
          <option value="text" ${record?.preferred_contact==="text"?"selected":""}>Text</option>
          <option value="whatsapp" ${record?.preferred_contact==="whatsapp"?"selected":""}>WhatsApp</option>
        </select></label>
        <label class="full">Street address<input name="address_line1" value="${escapeHtml(record?.address_line1||"")}"></label>
        <label>City<input name="city" value="${escapeHtml(record?.city||"")}"></label>
        <label>State<input name="state" value="${escapeHtml(record?.state||"")}"></label>
        <label>ZIP<input name="postal_code" value="${escapeHtml(record?.postal_code||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Add client")}`;
  }

  if(type==="service"){
    modalHeader("SERVICE",record?"Edit service":"Add service","Set the price and expected time once so scheduling stays consistent.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label class="full">Service name<input name="name" required value="${escapeHtml(record?.name||"")}"></label>
        <label>Pricing type<select name="pricing_type">
          ${["flat","hourly","sqft","quote"].map(v=>`<option value="${v}" ${record?.pricing_type===v?"selected":""}>${v==="quote"?"Quote required":v}</option>`).join("")}
        </select></label>
        <label>Base price<input name="base_price" type="number" min="0" step="0.01" value="${record?.base_price??""}"></label>
        <label>Duration (minutes)<input name="default_duration_minutes" type="number" min="15" step="15" required value="${record?.default_duration_minutes||120}"></label>
        <label class="full">Description<textarea name="description">${escapeHtml(record?.description||"")}</textarea></label>
        <label class="check-field"><input name="active" type="checkbox" ${record?.active!==false?"checked":""}> Active service</label>
      </div>${formSubmit(record?"Save changes":"Add service")}`;
  }

  if(type==="job"){
    const local=record?.starts_at?new Date(record.starts_at):null;
    const date=local?local.toLocaleDateString("en-CA"):"";
    const time=local?local.toTimeString().slice(0,5):"";
    modalHeader("JOB",record?"Edit job":"Add job","Schedule a cleaning with duration and travel buffer.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Client<select name="client_id"><option value="">No client</option>${optionList(state.clients,"id","name",record?.client_id)}</select></label>
        <label>Service<select name="service_id"><option value="">No service</option>${optionList(state.services.filter(s=>s.active),"id","name",record?.service_id)}</select></label>
        <label>Assigned teammate<select name="team_member_id"><option value="">Unassigned</option>${optionList(state.teamMembers,"id","name",record?.job_assignments?.[0]?.team_member_id)}</select></label>
        <label>Date<input name="date" type="date" required value="${date}"></label>
        <label>Time<input name="time" type="time" required value="${time}"></label>
        <label>Duration (minutes)<input name="duration_minutes" type="number" min="15" step="15" required value="${record?.duration_minutes||120}"></label>
        <label>Travel buffer (minutes)<input name="travel_buffer" type="number" min="0" step="5" value="${record?.travel_buffer_before_minutes??state.business.default_travel_buffer_minutes??30}"></label>
        <label class="full">Service address<input name="service_address" required value="${escapeHtml(record?.service_address||"")}"></label>
        <label>Status<select name="status">
          ${["scheduled","on_the_way","in_progress","completed","canceled","no_show"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v.replaceAll("_"," ")}</option>`).join("")}
        </select></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Add job")}`;
  }

  if(type==="quote"){
    const item=record?.quote_items?.[0];
    modalHeader("QUOTE",record?"Edit quote":"Create quote","A quote stays here until it is accepted. Acceptance creates the client, job and invoice.");
    entityForm.innerHTML=`
      <div class="form-grid">
        <label>Name<input name="customer_name" required value="${escapeHtml(record?.customer_name||"")}"></label>
        <label>Email<input name="customer_email" type="email" required value="${escapeHtml(record?.customer_email||"")}"></label>
        <label>Phone<input name="customer_phone" value="${escapeHtml(record?.customer_phone||"")}"></label>
        <label>Service<select name="service_id" required><option value="">Choose service</option>${optionList(state.services.filter(s=>s.active),"id","name",item?.service_id)}</select></label>
        <label>Price<input name="price" type="number" min="0" step="0.01" required value="${item?.unit_price??record?.total??""}"></label>
        <label>Status<select name="status">
          ${["requested","draft","sent","declined","expired"].map(v=>`<option value="${v}" ${record?.status===v?"selected":""}>${v}</option>`).join("")}
        </select></label>
        <label>Date<input name="preferred_date" type="date" required value="${record?.preferred_date||""}"></label>
        <label>Time<input name="preferred_time" type="time" required value="${record?.preferred_time?.slice(0,5)||""}"></label>
        <label class="full">Service address<input name="service_address" required value="${escapeHtml(record?.service_address||"")}"></label>
        <label class="full">Notes<textarea name="notes">${escapeHtml(record?.notes||"")}</textarea></label>
      </div>${formSubmit(record?"Save changes":"Create quote")}`;
  }

  modal.hidden=false;
}
function formSubmit(label){ return `<div class="form-footer"><button type="button" class="ghost-btn" data-modal-cancel>Cancel</button><button class="primary-btn" type="submit">${label}</button></div>`; }

entityForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const button=e.submitter;
  setBusy(button,true,"Saving…");
  try{
    const fd=new FormData(entityForm);
    if(state.modalType==="client") await saveClient(fd);
    if(state.modalType==="service") await saveService(fd);
    if(state.modalType==="job") await saveJob(fd);
    if(state.modalType==="quote") await saveQuote(fd);
    if(state.modalType==="team") await saveTeam(fd);
    if(state.modalType==="invite") await saveInvite(fd);
    modal.hidden=true;
    await loadCoreData();
    showToast("Saved");
  }catch(err){
    showToast(err.message || "Could not save");
  }finally{
    setBusy(button,false);
  }
});

async function saveClient(fd){
  const preferred=fd.get("preferred_contact");
  const phone=String(fd.get("phone")||"").trim();
  if((preferred==="text"||preferred==="whatsapp")&&!phone) throw new Error("Phone is required for Text or WhatsApp.");
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    email:String(fd.get("email")).trim(),
    phone:phone||null,
    preferred_contact:preferred,
    address_line1:String(fd.get("address_line1")||"").trim()||null,
    city:String(fd.get("city")||"").trim()||null,
    state:String(fd.get("state")||"").trim()||null,
    postal_code:String(fd.get("postal_code")||"").trim()||null,
    notes:String(fd.get("notes")||"").trim()||null
  };
  const query=state.modalId
    ? supabase.from("clients").update(payload).eq("id",state.modalId)
    : supabase.from("clients").insert(payload);
  const {error}=await query; if(error) throw error;
}

async function saveService(fd){
  const pricing=fd.get("pricing_type");
  const price=String(fd.get("base_price")||"").trim();
  const payload={
    business_id:state.business.id,
    name:String(fd.get("name")).trim(),
    description:String(fd.get("description")||"").trim()||null,
    pricing_type:pricing,
    base_price:pricing==="quote"?null:(price?Number(price):null),
    default_duration_minutes:Number(fd.get("default_duration_minutes")),
    active:fd.get("active")==="on"
  };
  const query=state.modalId
    ? supabase.from("services").update(payload).eq("id",state.modalId)
    : supabase.from("services").insert(payload);
  const {error}=await query; if(error) throw error;
}

async function saveJob(fd){
  const starts=new Date(`${fd.get("date")}T${fd.get("time")}:00`);
  if(Number.isNaN(starts.getTime())) throw new Error("Choose a valid date and time.");
  const payload={
    business_id:state.business.id,
    client_id:fd.get("client_id")||null,
    service_id:fd.get("service_id")||null,
    status:fd.get("status"),
    service_address:String(fd.get("service_address")).trim(),
    starts_at:starts.toISOString(),
    duration_minutes:Number(fd.get("duration_minutes")),
    travel_buffer_before_minutes:Number(fd.get("travel_buffer")||0),
    travel_buffer_after_minutes:Number(fd.get("travel_buffer")||0),
    notes:String(fd.get("notes")||"").trim()||null
  };

  let result;
  if(state.modalId){
    result=await supabase.from("jobs").update(payload).eq("id",state.modalId).select("id").single();
  }else{
    result=await supabase.from("jobs").insert(payload).select("id").single();
  }
  if(result.error) throw result.error;

  const {error:assignmentError}=await supabase.rpc("set_primary_job_assignment",{
    p_job_id:result.data.id,
    p_team_member_id:fd.get("team_member_id")||null
  });
  if(assignmentError) throw assignmentError;
}

async function saveQuote(fd){
  const price=Number(fd.get("price"));
  const payload={
    business_id:state.business.id,
    customer_name:String(fd.get("customer_name")).trim(),
    customer_email:String(fd.get("customer_email")).trim(),
    customer_phone:String(fd.get("customer_phone")||"").trim()||null,
    service_address:String(fd.get("service_address")).trim(),
    preferred_date:fd.get("preferred_date"),
    preferred_time:fd.get("preferred_time"),
    subtotal:price,total:price,
    status:fd.get("status"),
    notes:String(fd.get("notes")||"").trim()||null
  };
  let quoteId=state.modalId;
  if(quoteId){
    const {error}=await supabase.from("quotes").update(payload).eq("id",quoteId);
    if(error) throw error;
    const existing=state.quotes.find(q=>q.id===quoteId)?.quote_items?.[0];
    const itemPayload={service_id:fd.get("service_id"),description:state.services.find(s=>s.id===fd.get("service_id"))?.name||"Cleaning service",quantity:1,unit_price:price,line_total:price};
    if(existing){
      const {error:itemErr}=await supabase.from("quote_items").update(itemPayload).eq("id",existing.id);
      if(itemErr) throw itemErr;
    }else{
      const {error:itemErr}=await supabase.from("quote_items").insert({quote_id:quoteId,...itemPayload});
      if(itemErr) throw itemErr;
    }
  }else{
    const {data,error}=await supabase.from("quotes").insert(payload).select("id").single();
    if(error) throw error;
    quoteId=data.id;
    const service=state.services.find(s=>s.id===fd.get("service_id"));
    const {error:itemErr}=await supabase.from("quote_items").insert({
      quote_id:quoteId,service_id:fd.get("service_id"),description:service?.name||"Cleaning service",quantity:1,unit_price:price,line_total:price
    });
    if(itemErr) throw itemErr;
  }
}

document.addEventListener("click",async e=>{
  const create=e.target.closest("[data-create]");
  const action=e.target.closest("[data-action]");
  const edit=e.target.closest("[data-edit]");
  const teamCreate=e.target.closest("[data-team-create]");
  const teamEdit=e.target.closest("[data-team-edit]");
  if(teamCreate){ openTeamForm(); return; }
  if(teamEdit){ openTeamForm(teamEdit.dataset.teamEdit); return; }
  if(create){ openEntityForm(create.dataset.create); return; }
  if(action){
    const type=action.dataset.action;
    if(state.business.role==="coworker"){ showToast("This action is owner/admin only"); return; }
    if(["client","service","job","quote"].includes(type)) openEntityForm(type);
    else openGeneric(type);
    return;
  }
  if(edit){ openEntityForm(edit.dataset.edit,edit.dataset.id); return; }
  if(e.target.closest("[data-modal-cancel]")){ modal.hidden=true; return; }

  const archive=e.target.closest("[data-archive-client]");
  if(archive){
    if(!confirm("Archive this client? Their record will be hidden, not permanently deleted.")) return;
    const {error}=await supabase.from("clients").update({archived_at:new Date().toISOString()}).eq("id",archive.dataset.archiveClient);
    if(error) showToast(error.message); else {await loadCoreData();showToast("Client archived");}
    return;
  }
  const toggle=e.target.closest("[data-toggle-service]");
  if(toggle){
    const service=state.services.find(s=>s.id===toggle.dataset.toggleService);
    const {error}=await supabase.from("services").update({active:!service.active}).eq("id",service.id);
    if(error) showToast(error.message); else {await loadCoreData();showToast(service.active?"Service deactivated":"Service activated");}
    return;
  }
  const cancel=e.target.closest("[data-cancel-job]");
  if(cancel){
    if(!confirm("Cancel this job?")) return;
    const {error}=await supabase.from("jobs").update({status:"canceled"}).eq("id",cancel.dataset.cancelJob);
    if(error) showToast(error.message); else {await loadCoreData();showToast("Job canceled");}
    return;
  }
  const sent=e.target.closest("[data-mark-sent]");
  if(sent){
    const {error}=await supabase.from("quotes").update({status:"sent"}).eq("id",sent.dataset.markSent);
    if(error) showToast(error.message); else {await loadCoreData();showToast("Quote marked sent");}
    return;
  }
  const coworkerStatus=e.target.closest("[data-coworker-status]");
  if(coworkerStatus){
    const {error}=await supabase.rpc("coworker_set_job_status",{p_job_id:coworkerStatus.dataset.coworkerStatus,p_status:coworkerStatus.dataset.status});
    if(error) showToast(error.message); else {await loadCoreData();showToast("Job status updated");}
    return;
  }

  const removeMember=e.target.closest("[data-remove-member]");
  if(removeMember){
    if(!confirm("Remove this person's app access? Their operational records will remain.")) return;
    const {error}=await supabase.from("business_members").delete().eq("id",removeMember.dataset.removeMember);
    if(error) showToast(error.message); else {await loadOwnerAdmin();showToast("Access removed");}
    return;
  }

  const copyInvite=e.target.closest("[data-copy-invite]");
  if(copyInvite){
    const link=new URL(window.location.href.split("#")[0]);link.search="";link.searchParams.set("invite",copyInvite.dataset.copyInvite);
    await copyText(link.toString());return;
  }

  const revokeInvite=e.target.closest("[data-revoke-invite]");
  if(revokeInvite){
    const {error}=await supabase.from("business_invites").update({revoked_at:new Date().toISOString()}).eq("id",revokeInvite.dataset.revokeInvite);
    if(error) showToast(error.message); else {await loadOwnerAdmin();showToast("Invite revoked");}
    return;
  }

  const accept=e.target.closest("[data-accept-quote]");
  if(accept){
    if(!confirm("Accept this quote? This will create/update the client, schedule the job and create a draft invoice.")) return;
    accept.disabled=true;
    const {error}=await supabase.rpc("accept_quote",{p_quote_id:accept.dataset.acceptQuote});
    accept.disabled=false;
    if(error) showToast(error.message); else {await loadCoreData();showToast("Quote accepted · job and invoice created");}
  }
});

function openQuickAdd(){
  state.modalType="quick"; state.modalId=null;
  modalHeader("ADD NEW","What do you want to add?","Choose an item and open the right form.");
  entityForm.innerHTML=`
    <div class="quick-add-menu">
      <button type="button" data-action="client"><span>◌</span><strong>Client</strong><small>Add contact + address</small></button>
      <button type="button" data-action="job"><span>□</span><strong>Job</strong><small>Schedule a cleaning</small></button>
      <button type="button" data-action="quote"><span>◫</span><strong>Quote</strong><small>Create a quote</small></button>
      <button type="button" data-action="service"><span>＋</span><strong>Service</strong><small>Add price + duration</small></button>
      <button type="button" data-team-create><span>◉</span><strong>Team Profile</strong><small>Add a cleaner for assignments</small></button>
    </div>
    <div class="form-footer"><button type="button" class="ghost-btn" data-modal-cancel>Cancel</button></div>`;
  modal.hidden=false;
}

function openGeneric(type){
  state.modalType=type; state.modalId=null;
  modalHeader("QUICK ADD",type==="invoice"?"Invoice":"Quick action","This module will be connected after the core Clients → Services → Jobs → Quotes workflow.");
  entityForm.innerHTML=`<div class="empty-inline"><strong>Core workflow first.</strong><span>Nothing here will touch the live Sites app.</span></div><div class="form-footer"><button type="button" class="primary-btn" data-modal-cancel>Close</button></div>`;
  modal.hidden=false;
}

document.addEventListener("change",async e=>{
  const memberRole=e.target.closest("[data-member-role]");
  if(!memberRole) return;
  const {error}=await supabase.from("business_members")
    .update({role:memberRole.value,updated_at:new Date().toISOString()})
    .eq("id",memberRole.dataset.memberRole);
  if(error) showToast(error.message);
  else {await loadOwnerAdmin();showToast("Access updated");}
});

const quickAddBtn=$("#quickAddBtn");
if(quickAddBtn) quickAddBtn.addEventListener("click",()=>{
  if(!state.business || !["owner","admin"].includes(state.business.role)){
    showToast("Add New is owner/admin only");
    return;
  }
  openQuickAdd();
});

["#shareAppAccessBtn","#shareAccessCardBtn","#helpInviteBtn"].forEach(selector=>{
  const button=$(selector);
  if(button) button.addEventListener("click",()=>{
    if(state.business?.role!=="owner"){
      showToast("Only the owner can share app access");
      return;
    }
    openInviteForm();
  });
});

const inviteMemberBtn=$("#inviteMemberBtn");
if(inviteMemberBtn) inviteMemberBtn.addEventListener("click",openInviteForm);
const addTeamProfileBtn=$("#addTeamProfileBtn");
if(addTeamProfileBtn) addTeamProfileBtn.addEventListener("click",()=>openTeamForm());

$("#modalClose").addEventListener("click",()=>modal.hidden=true);
modal.addEventListener("click",e=>{if(e.target===modal) modal.hidden=true});

async function copyText(text){
  try{await navigator.clipboard.writeText(text);showToast("Link copied");}
  catch{showToast("Copy unavailable here");}
}
$$("[data-copy-target]").forEach(btn=>btn.addEventListener("click",()=>copyText($("#"+btn.dataset.copyTarget).textContent.trim())));
$("#copyBooking").addEventListener("click",()=>copyText($("#bookingUrl").textContent.trim()));

let spanish=false;
$("#languageBtn").addEventListener("click",()=>{spanish=!spanish;showToast(spanish?"Spanish interface comes next":"English active");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){modal.hidden=true;sidebar.classList.remove("open")}});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}

setAuthMode("signin");
initialize();

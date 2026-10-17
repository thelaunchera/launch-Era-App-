/* The Launch Era • Automation Studio
   Enhances the existing Follow-ups page. All changes use the current tenant and
   authenticated owner/admin session; extra email stages start disabled. */
(()=>{
 "use strict";
 const bridge=window.TLE_FOLLOWUPS_BRIDGE;
 const list=document.querySelector(".followup-rule-list");
 if(!bridge||!list||document.getElementById("automationStudio"))return;
 const $=(s,r=document)=>r.querySelector(s);
 const tr=(en,es,fr,ht)=>{const l=String(bridge.appLocale?.()||"en").toLowerCase();return l.startsWith("es")?es:l.startsWith("fr")?fr:l.startsWith("ht")?ht:en};
 const text=(en,es)=>tr(en,es,en,en);
 const typeNames={
  lead:["New leads","Leads nuevos"],quote:["Estimates","Cotizaciones"],invoice:["Unpaid invoices","Facturas pendientes"],
  review:["Review requests","Solicitud de reseñas"],rebook:["Rebooking","Nuevas reservas"]
 };
 const groups={leads:["lead"],estimates:["quote"],jobs:["invoice","review","rebook"]};
 const firstDefault={lead:2,quote:2,invoice:1,review:1,rebook:30};
 const state={business:null,rules:new Map(),busy:false,ready:false,tab:"leads"};
 const el=(tag,cls,content)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(content!==undefined)node.textContent=content;return node;};
 const studio=el("section","tle-automation-studio");studio.id="automationStudio";
 const head=el("div","tle-automation-head");
 const heading=el("div");
 heading.append(el("p","tle-automation-kicker","AUTOMATIONS"),el("h3","",text("Follow-up automations","Automatizaciones de seguimiento")));
 const caption=el("p","tle-automation-caption",text("A gentle follow-up, never a missed opportunity. Each extra email is optional.","Seguimientos a tiempo y sin complicaciones. Cada correo adicional es opcional."));
 heading.append(caption);
 const pill=el("span","tle-automation-safe",text("Extra emails OFF by default","Correos adicionales DESACTIVADOS"));
 head.append(heading,pill);
 const tabs=el("div","tle-automation-tabs");tabs.setAttribute("role","tablist");tabs.setAttribute("aria-label",text("Automation categories","Categorías de automatización"));
 const tabNames={leads:["Leads","Leads"],estimates:["Estimates","Cotizaciones"],jobs:["Jobs","Trabajos"]};
 const panels=el("div","tle-automation-panels");
 for(const key of Object.keys(groups)){
  const btn=el("button","tle-automation-tab",text(...tabNames[key]));btn.type="button";btn.dataset.automationTab=key;btn.setAttribute("role","tab");btn.setAttribute("aria-selected",String(key==="leads"));tabs.append(btn);
  const panel=el("div","tle-automation-panel");panel.dataset.automationPanel=key;panel.setAttribute("role","tabpanel");panel.hidden=key!=="leads";
  for(const kind of groups[key]){
   const card=$('[data-followup-rule="'+kind+'"]',list);
   if(!card)continue;
   card.classList.add("tle-automation-rule");
   const main=card.querySelector("span:first-child strong");if(main)main.textContent=text(...typeNames[kind]);
   const time=card.querySelector("span:first-child small");
   if(time)time.textContent=text("First follow-up timing","Cuándo hacer el primer seguimiento");
   const stages=el("div","tle-automation-stages");stages.dataset.kind=kind;
   stages.append(makeStage(kind,1),makeStage(kind,2),makeStage(kind,3));
   card.append(stages);panel.append(card);
  }
  panels.append(panel);
 }
 const status=el("p","tle-automation-status",text("Open Follow-ups to load your settings.","Abre Seguimientos para cargar tus reglas."));
 status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const foot=el("p","tle-automation-foot",text("The next stage runs only after the previous stage was queued, the customer still qualifies, and Auto email is enabled. Turning a rule off never sends mail.","La siguiente etapa solo se ejecuta después de la anterior, si el cliente aún necesita seguimiento y el correo automático está activado. Desactivar una regla nunca envía mensajes."));
 studio.append(head,tabs,panels,status,foot);
 list.replaceWith(studio);
 // Preserve legacy selector hooks by keeping the original rule cards in the DOM.
 function makeStage(kind,stage){
  const wrap=el("div","tle-stage");wrap.dataset.stage=String(stage);
  const label=el("label","tle-stage-name");
  if(stage===1){
   label.append(el("strong","",text("First follow-up","Primer seguimiento")));
   const help=el("small","",text("After the event","Después del evento"));label.append(help);
   const days=el("input","tle-stage-days");days.type="number";days.min="1";days.max="30";days.step="1";days.inputMode="numeric";days.dataset.automationFirst=kind;days.setAttribute("aria-label",text("First follow-up delay in days","Días hasta el primer seguimiento"));days.value=String(firstDefault[kind]);
   const field=el("label","tle-stage-day-control");field.append(days,el("span","",text("days","días")));wrap.append(label,field);
  }else{
   const toggle=el("input","tle-stage-switch");toggle.type="checkbox";toggle.dataset.automationEnable=kind+":"+stage;toggle.disabled=true;
   const title=el("span","tle-stage-switch-label",text(stage===2?"Second follow-up":"Third follow-up",stage===2?"Segundo seguimiento":"Tercer seguimiento"));
   const control=el("label","tle-stage-toggle");control.append(toggle,title);
   const days=el("input","tle-stage-days");days.type="number";days.min="1";days.max="30";days.step="1";days.inputMode="numeric";days.value="4";days.dataset.automationDelay=kind+":"+stage;days.disabled=true;days.setAttribute("aria-label",text("Days after previous follow-up","Días después del seguimiento anterior"));
   const field=el("label","tle-stage-day-control");field.append(days,el("span","",text("days later","días después")));
   wrap.append(control,field);
  }
  return wrap;
 }
 function changedTab(name){
  if(!groups[name])return;state.tab=name;
  for(const btn of tabs.querySelectorAll("button")){const active=btn.dataset.automationTab===name;btn.setAttribute("aria-selected",String(active));btn.tabIndex=active?0:-1;}
  for(const p of panels.children)p.hidden=p.dataset.automationPanel!==name;
 }
 function notice(s){status.textContent=s;}
 function business(){const x=bridge.getState?.();return x?.business&&["owner","admin"].includes(String(x.business.role||""))?x.business.id:null;}
 function mode(kind){return String(bridge.getState?.()?.followUpSettings?.[kind+"_mode"]||"remind");}
 function validDays(value){const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=30?n:null;}
 function rule(kind,stage){return state.rules.get(kind+":"+stage)||{enabled:false,delay_days:4};}
 function sync(){
  const pref=bridge.getState?.()?.followUpSettings||{};
  for(const kind of Object.keys(firstDefault)){
   const first=$('[data-automation-first="'+kind+'"]',studio);if(first&&document.activeElement!==first)first.value=String(pref[kind+"_delay_days"]??firstDefault[kind]);
   const active=mode(kind)==="auto";
   for(const stage of [2,3]){
    const r=rule(kind,stage);
    const toggle=$('[data-automation-enable="'+kind+":"+stage+'"]',studio),days=$('[data-automation-delay="'+kind+":"+stage+'"]',studio);
    if(!toggle||!days)continue;
    toggle.checked=!!r.enabled;toggle.disabled=!state.ready||!active||state.busy;
    toggle.title=!active?text("Choose Auto email above first","Activa correo automático arriba primero"):"";
    if(document.activeElement!==days)days.value=String(r.delay_days);
    days.disabled=!state.ready||!active||state.busy;
   }
  }
 }
 async function refresh(){
  const id=business();
  if(!id){state.ready=false;notice(text("Sign in as an owner or admin to manage automations.","Entra como dueño o administrador para gestionar automatizaciones."));sync();return;}
  if(state.busy||state.business===id&&state.ready){sync();return;}
  state.business=id;state.ready=false;state.busy=true;sync();
  notice(text("Loading automation stages…","Cargando etapas de automatización…"));
  try{
   const result=await bridge.supabase.rpc("get_follow_up_sequence_rules",{p_business_id:id});
   if(result.error)throw result.error;
   if(state.business!==id)return;
   state.rules.clear();
   for(const row of result.data||[])state.rules.set(row.follow_up_type+":"+row.stage,row);
   state.ready=true;
   notice(text("Settings saved per cleaning business. Stages 2 and 3 are opt-in.","Configuración independiente por negocio. Las etapas 2 y 3 se activan solo si tú lo decides."));
  }catch(err){console.warn("Follow-up sequence rules unavailable",err?.message||err);notice(text("Extra stages unavailable. Existing follow-ups remain unchanged.","Etapas adicionales no disponibles. Los seguimientos actuales continúan sin cambios."));}
  finally{state.busy=false;sync();}
 }
 async function saveFirst(kind,node){
  const value=validDays(node.value),prior=bridge.getState?.()?.followUpSettings?.[kind+"_delay_days"]??firstDefault[kind];
  if(value===null){node.value=String(prior);notice(text("Choose 1–30 days.","Selecciona de 1 a 30 días."));return;}
  if(mode(kind)==="auto"&&!confirm(text("Changing this delay can send due automatic emails on the next scheduled run. Continue?","Cambiar este plazo puede enviar correos pendientes en la próxima ejecución. ¿Continuar?"))){node.value=String(prior);return;}
  node.disabled=true;
  try{
   const r=await bridge.supabase.from("follow_up_settings").update({[kind+"_delay_days"]:value,updated_at:new Date().toISOString()}).eq("business_id",state.business).select("*").single();
   if(r.error)throw r.error;
   bridge.getState().followUpSettings=r.data;
   notice(text("First follow-up timing saved.","Tiempo del primer seguimiento guardado."));
  }catch(err){node.value=String(prior);notice(text("Couldn't save: ","No se pudo guardar: ")+(err?.message||"Error"));}
  finally{node.disabled=false;sync();}
 }
 async function saveStage(kind,stage,source){
  if(!state.ready)return;
  const toggle=$('[data-automation-enable="'+kind+":"+stage+'"]',studio),days=$('[data-automation-delay="'+kind+":"+stage+'"]',studio);
  const previous=rule(kind,stage),delay=validDays(days.value);
  if(delay===null){notice(text("Choose 1–30 days.","Selecciona de 1 a 30 días."));sync();return;}
  if(source==="enabled"&&toggle.checked&&!previous.enabled){
   if(mode(kind)!=="auto"||!confirm(text("Enable this additional email stage? It can email eligible real customers after the previous follow-up and selected delay.","¿Activar este correo adicional? Podrá enviarse a clientes reales que sigan pendientes después de la etapa anterior y el plazo seleccionado."))){sync();return;}
  }
  state.busy=true;sync();
  try{
   const r=await bridge.supabase.rpc("save_follow_up_sequence_rule",{p_business_id:state.business,p_follow_up_type:kind,p_stage:stage,p_delay_days:delay,p_enabled:!!toggle.checked});
   if(r.error)throw r.error;
   state.rules.set(kind+":"+stage,{follow_up_type:kind,stage,delay_days:delay,enabled:!!toggle.checked});
   notice(text("Automation stage saved.","Etapa de automatización guardada."));
  }catch(err){notice(text("Couldn't save: ","No se pudo guardar: ")+(err?.message||"Error"));}
  finally{state.busy=false;sync();}
 }
 tabs.addEventListener("click",event=>{const btn=event.target.closest("[data-automation-tab]");if(btn)changedTab(btn.dataset.automationTab);});
 tabs.addEventListener("keydown",event=>{if(!["ArrowLeft","ArrowRight"].includes(event.key))return;const keys=Object.keys(groups),i=keys.indexOf(state.tab),next=keys[(i+(event.key==="ArrowRight"?1:keys.length-1))%keys.length];changedTab(next);tabs.querySelector('[data-automation-tab="'+next+'"]')?.focus();event.preventDefault();});
 studio.addEventListener("change",event=>{
  const target=event.target;
  if(target.matches("[data-automation-first]"))void saveFirst(target.dataset.automationFirst,target);
  const match=target.dataset.automationEnable||target.dataset.automationDelay;
  if(match){const [kind,stage]=match.split(":");void saveStage(kind,Number(stage),target.dataset.automationEnable?"enabled":"days");}
 });
 studio.addEventListener("change",event=>{if(event.target.matches("[data-followup-mode]"))queueMicrotask(sync);});
 window.TLE_AUTOMATION_STUDIO={refresh,version:"20261017-safe-stages"};
 document.addEventListener("click",()=>{if(business()!==state.business)void refresh();},{capture:true});
 void refresh();
})();
/* Cosmetic text only: synthetic preview of Cleaning App workspace.
   No auth, customer or tenant data read or written. */
(function(){
 const MODE={
  en:{signup:["Let's get your business organized.","Your bookings, clients and quotes, all in one easy place."],signin:["Hey, welcome back!","Your cleaning schedule is ready when you are."]},
  es:{signup:["Vamos a organizar tu negocio.","Ten tus reservas, clientes y cotizaciones a mano."],signin:["¡Qué bueno verte de nuevo!","Tu agenda de limpieza está lista para ti."]},
  fr:{signup:["On organise votre activité ensemble.","Vos réservations, clients et devis, réunis au même endroit."],signin:["Content de vous revoir !","Votre planning de nettoyage vous attend."]}
 };
 const T_HT={
  authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
  authStoryCopy:"Kenbe rezèvasyon, kliyan, devis ak fakti yo ansanm, san w pa bezwen fouye nan mesaj ak nòt.",
  authTagOne:"Rezèvasyon + kalandriye",authTagTwo:"Kliyan + travay",authTagThree:"Devis + fakti",
  authPreviewLabel:"ESPAS EGZANP",authPreviewSample:"Done envante sèlman",
  authPreviewGreeting:"Wè jounen ou pi klè.",authPreviewSub:"Tout operasyon yo nan yon sèl kote.",
  authPreviewJobs:"Travay k ap vini",authPreviewClients:"Kliyan egzanp",authPreviewQuotes:"Devis ouvè",
  authPreviewLineOne:"Netwayaj regilye · 9:30 AM",authPreviewScheduled:"Pwograme",
  authPreviewLineTwo:"Gwo netwayaj · 1:00 PM",authPreviewQuote:"Devis pare",
  authEditorialEyebrow:"ESPAS NETWAYAJ OU",
  authStoryHeading:'Dirije yon biznis netwayaj mande anpil.<br><span>Kenbe tout bagay annòd pi fasil.</span>'
 };
 const T={
 en:{
 authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
 authStoryCopy:"Keep your bookings, client details, quotes and invoices together — without digging through messages and notes.",
 authTagOne:"Bookings + calendar",authTagTwo:"Clients + jobs",authTagThree:"Quotes + invoices",
 authPreviewLabel:"SAMPLE WORKSPACE",authPreviewSample:"Fictional data only",
 authPreviewGreeting:"A clear view of your day.",authPreviewSub:"Your operations, easier to see.",
 authPreviewJobs:"Upcoming jobs",authPreviewClients:"Sample clients",authPreviewQuotes:"Open quotes",
 authPreviewLineOne:"Recurring cleaning · 9:30 AM",authPreviewScheduled:"Scheduled",
 authPreviewLineTwo:"Deep cleaning · 1:00 PM",authPreviewQuote:"Quote ready",
 authEditorialEyebrow:"YOUR CLEANING WORKSPACE",
 authStoryHeading:"Running a cleaning business is a lot.<br><span>Keeping track shouldn't be.</span>"
 },
 es:{
 authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
 authStoryCopy:"Ten tus reservas, clientes, cotizaciones y facturas a mano, sin buscar entre mensajes y notas.",
 authTagOne:"Reservas + calendario",authTagTwo:"Clientes + trabajos",authTagThree:"Cotizaciones + facturas",
 authPreviewLabel:"ESPACIO DE EJEMPLO",authPreviewSample:"Solo datos ficticios",
 authPreviewGreeting:"Tu día de un vistazo.",authPreviewSub:"Tus operaciones, más claras.",
 authPreviewJobs:"Próximos trabajos",authPreviewClients:"Clientes de ejemplo",authPreviewQuotes:"Cotizaciones abiertas",
 authPreviewLineOne:"Limpieza recurrente · 9:30 AM",authPreviewScheduled:"Agendado",
 authPreviewLineTwo:"Limpieza profunda · 1:00 PM",authPreviewQuote:"Cotización lista",
 authEditorialEyebrow:"TU ESPACIO DE LIMPIEZA",
 authStoryHeading:'Llevar un negocio de limpieza es mucho.<br><span>Organizarlo no tiene que serlo.</span>'
 },
 fr:{
 authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
 authStoryCopy:"Gardez réservations, clients, devis et factures au même endroit, sans fouiller vos messages.",
 authTagOne:"Réservations + calendrier",authTagTwo:"Clients + missions",authTagThree:"Devis + factures",
 authPreviewLabel:"ESPACE D’EXEMPLE",authPreviewSample:"Données fictives uniquement",
 authPreviewGreeting:"Votre journée en un coup d’œil.",authPreviewSub:"Vos opérations en un clin d’œil.",
 authPreviewJobs:"Missions à venir",authPreviewClients:"Clients fictifs",authPreviewQuotes:"Devis ouverts",
 authPreviewLineOne:"Nettoyage récurrent · 9 h 30",authPreviewScheduled:"Planifié",
 authPreviewLineTwo:"Grand nettoyage · 13 h",authPreviewQuote:"Devis prêt",
 authEditorialEyebrow:"VOTRE ESPACE DE NETTOYAGE",
 authStoryHeading:"Gérer une entreprise de nettoyage, c'est beaucoup.<br><span>Tout suivre peut être plus simple.</span>"
 }
 };
 window.TLE_AUTH_EDITORIAL_TRANSLATE=function(language){
  const copy=language==="ht"?T_HT:(T[language]||T.en);
  const shell=document.getElementById("authShell");
  if(shell && !shell.classList.contains("auth-mode-recovery")){
   const mode=shell.classList.contains("auth-mode-signin")?"signin":"signup";
   const words=(language==="ht"?{signup:["Ann mete biznis ou annòd.","Kenbe rezèvasyon, kliyan ak devis ou yo nan yon sèl kote."],signin:["Kontan wè ou ankò!","Orè netwayaj ou pare pou ou."]}:MODE[language]||MODE.en)[mode];
   const title=document.getElementById("authTitle"),description=document.getElementById("authCopy");
   if(title)title.textContent=words[0];
   if(description)description.textContent=words[1];
  }
  for(const [id,value] of Object.entries(copy)){
   const node=document.getElementById(id);
   if(!node)continue;
   if(id==="authStoryHeading") node.innerHTML=value;
   else node.textContent=value;
  }
 };
 document.addEventListener("DOMContentLoaded",function(){
  const getLang=()=>String(window.TLE_I18N?.language||document.documentElement.lang||"en").toLowerCase();
  window.TLE_AUTH_EDITORIAL_TRANSLATE(getLang());
  window.addEventListener("tle:languagechange",()=>window.TLE_AUTH_EDITORIAL_TRANSLATE(getLang()));
  document.querySelectorAll("[data-language-toggle]").forEach(button=>{
   button.addEventListener("click",function(){
    requestAnimationFrame(()=>window.TLE_AUTH_EDITORIAL_TRANSLATE(getLang()));
   });
  });
 });
})();

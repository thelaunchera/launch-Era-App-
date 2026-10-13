/* Cosmetic text only: synthetic preview of Cleaning App workspace.
   No auth, customer or tenant data read or written. */
(function(){
 const MODE={
  en:{signup:["Your business. Beautifully organized.","Everything for your cleaning days, all in one place."],signin:["Welcome back to your workspace.","Pick up right where you left off."]},
  es:{signup:["Tu negocio. Todo en orden.","Todo lo que necesitas para organizar las limpiezas, en un solo lugar."],signin:["Qué bueno tenerte de vuelta.","Continúa donde lo dejaste."]},
  fr:{signup:["Votre entreprise. Parfaitement organisée.","Tout pour organiser vos journées de nettoyage, au même endroit."],signin:["Heureux de vous retrouver.","Reprenez là où vous en étiez."]}
 };
 const T_HT={
  authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
  authStoryCopy:"Rezèvasyon, kliyan, devis, travay ak fakti — tout òganize nan yon sèl espas pou biznis netwayaj ou.",
  authTagOne:"Rezèvasyon + kalandriye",authTagTwo:"Kliyan + travay",authTagThree:"Devis + fakti",
  authPreviewLabel:"ESPAS EGZANP",authPreviewSample:"Done envante sèlman",
  authPreviewGreeting:"Wè jounen ou pi klè.",authPreviewSub:"Tout operasyon yo nan yon sèl kote.",
  authPreviewJobs:"Travay k ap vini",authPreviewClients:"Kliyan egzanp",authPreviewQuotes:"Devis ouvè",
  authPreviewLineOne:"Netwayaj regilye · 9:30 AM",authPreviewScheduled:"Pwograme",
  authPreviewLineTwo:"Gwo netwayaj · 1:00 PM",authPreviewQuote:"Devis pare",
  authEditorialEyebrow:"ESPAS NETWAYAJ OU",
  authStoryHeading:'Òganize jounen an.<br><span>San dezòd.</span>'
 };
 const T={
 en:{
 authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
 authStoryCopy:"Bookings, clients, quotes, jobs and invoices — finally in one organized workspace built for cleaning business owners.",
 authTagOne:"Bookings + calendar",authTagTwo:"Clients + jobs",authTagThree:"Quotes + invoices",
 authPreviewLabel:"SAMPLE WORKSPACE",authPreviewSample:"Fictional data only",
 authPreviewGreeting:"A clear view of your day.",authPreviewSub:"Your operations, easier to see.",
 authPreviewJobs:"Upcoming jobs",authPreviewClients:"Sample clients",authPreviewQuotes:"Open quotes",
 authPreviewLineOne:"Recurring cleaning · 9:30 AM",authPreviewScheduled:"Scheduled",
 authPreviewLineTwo:"Deep cleaning · 1:00 PM",authPreviewQuote:"Quote ready",
 authEditorialEyebrow:"YOUR CLEANING WORKSPACE",
 authStoryHeading:'Run the day.<br><span>Not the chaos.</span>'
 },
 es:{
 authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
 authStoryCopy:"Reservas, clientes, cotizaciones, trabajos y facturas, por fin organizados en un solo espacio para tu negocio de limpieza.",
 authTagOne:"Reservas + calendario",authTagTwo:"Clientes + trabajos",authTagThree:"Cotizaciones + facturas",
 authPreviewLabel:"ESPACIO DE EJEMPLO",authPreviewSample:"Solo datos ficticios",
 authPreviewGreeting:"Tu día de un vistazo.",authPreviewSub:"Tus operaciones, más claras.",
 authPreviewJobs:"Próximos trabajos",authPreviewClients:"Clientes de ejemplo",authPreviewQuotes:"Cotizaciones abiertas",
 authPreviewLineOne:"Limpieza recurrente · 9:30 AM",authPreviewScheduled:"Agendado",
 authPreviewLineTwo:"Limpieza profunda · 1:00 PM",authPreviewQuote:"Cotización lista",
 authEditorialEyebrow:"TU ESPACIO DE LIMPIEZA",
 authStoryHeading:'Organiza tu día.<br><span>Sin el caos.</span>'
 },
 fr:{
 authStoryKicker:"THE LAUNCH ERA / CLEANING APP",
 authStoryCopy:"Réservations, clients, devis, missions et factures enfin réunis dans un seul espace de travail.",
 authTagOne:"Réservations + calendrier",authTagTwo:"Clients + missions",authTagThree:"Devis + factures",
 authPreviewLabel:"ESPACE D’EXEMPLE",authPreviewSample:"Données fictives uniquement",
 authPreviewGreeting:"Votre journée en un coup d’œil.",authPreviewSub:"Vos opérations en un clin d’œil.",
 authPreviewJobs:"Missions à venir",authPreviewClients:"Clients fictifs",authPreviewQuotes:"Devis ouverts",
 authPreviewLineOne:"Nettoyage récurrent · 9 h 30",authPreviewScheduled:"Planifié",
 authPreviewLineTwo:"Grand nettoyage · 13 h",authPreviewQuote:"Devis prêt",
 authEditorialEyebrow:"VOTRE ESPACE DE NETTOYAGE",
 authStoryHeading:'Gérez vos journées.<br><span>Sans le chaos.</span>'
 }
 };
 window.TLE_AUTH_EDITORIAL_TRANSLATE=function(language){
  const copy=language==="ht"?T_HT:(T[language]||T.en);
  const shell=document.getElementById("authShell");
  if(shell && !shell.classList.contains("auth-mode-recovery")){
   const mode=shell.classList.contains("auth-mode-signin")?"signin":"signup";
   const words=(language==="ht"?{signup:["Biznis ou. Byen òganize.","Tout sa ou bezwen pou jounen netwayaj ou, nan yon sèl kote."],signin:["Byenveni tounen nan espas ou.","Kontinye kote ou te rete a."]}:MODE[language]||MODE.en)[mode];
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

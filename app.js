const views=[...document.querySelectorAll('.view')];
const nav=[...document.querySelectorAll('.nav-item')];
const title=document.getElementById('pageTitle');
const sidebar=document.getElementById('sidebar');
const toast=document.getElementById('toast');
const modal=document.getElementById('modalBackdrop');

const pageTitles={
  today:'Today',
  booking:'Booking Center',
  leads:'Leads',
  clients:'Clients',
  calendar:'Calendar + Jobs',
  quotes:'Quotes',
  invoices:'Invoices',
  route:"Today's Route",
  mileage:'Mileage',
  time:'Time Tracking',
  reports:'Reports',
  services:'Services + Add-ons',
  team:'Team',
  settings:'Settings'
};

function openView(id){
  views.forEach(v=>v.classList.toggle('active',v.dataset.page===id));
  nav.forEach(n=>n.classList.toggle('active',n.dataset.view===id));
  title.textContent=pageTitles[id]||'The Launch Era Cleaning App';
  sidebar.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
nav.forEach(btn=>btn.addEventListener('click',()=>openView(btn.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>openView(btn.dataset.jump)));
document.getElementById('menuToggle').addEventListener('click',()=>sidebar.classList.toggle('open'));

function showToast(message='Copied'){
  toast.textContent=message;toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),1800);
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);showToast('Link copied');}
  catch{showToast('Copy this link manually');}
}
document.querySelectorAll('[data-copy-target]').forEach(btn=>btn.addEventListener('click',()=>{
  const target=document.getElementById(btn.dataset.copyTarget);
  copyText(target.textContent.trim());
}));
document.getElementById('copyBooking').addEventListener('click',()=>copyText(document.getElementById('bookingUrl').textContent.trim()));

function openModal(type='item'){
  const labels={
    lead:['Add lead','Capture a new inquiry and the next action.'],
    client:['Add client','Create a client record with contact, address and service notes.'],
    quote:['Create quote','Build a professional quote. Accepted quotes will later create the client, job and invoice automatically.'],
    invoice:['Create invoice','Prepare an invoice and choose Cash on Spot, Zelle or Stripe-ready payment tracking.'],
    job:['Add job','Schedule a one-time or recurring cleaning while respecting duration and travel buffer.'],
    item:['Quick add','Choose a fast action from the dashboard.']
  };
  const [heading,copy]=labels[type]||labels.item;
  document.getElementById('modalTitle').textContent=heading;
  document.getElementById('modalCopy').textContent=copy+' This prototype is UI-first; production data will connect during backend migration.';
  modal.hidden=false;
}
document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.action)));
document.getElementById('quickAddBtn').addEventListener('click',()=>openModal('item'));
document.getElementById('modalClose').addEventListener('click',()=>modal.hidden=true);
document.getElementById('modalDone').addEventListener('click',()=>modal.hidden=true);
modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});

let spanish=false;
document.getElementById('languageBtn').addEventListener('click',()=>{
  spanish=!spanish;
  showToast(spanish?'Español preview coming next':'English active');
});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){modal.hidden=true;sidebar.classList.remove('open')}});
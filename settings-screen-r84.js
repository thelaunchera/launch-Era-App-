/* TLE responsive Settings: keep the real existing panels/forms and saved data. */
(()=>{
'use strict';
function mountSettings(){
const view=document.querySelector('#appShell .view[data-page="settings"]');
const legacy=view?.querySelector('.settings-grid.settings-simple-grid');
if(!view||!legacy||view.dataset.tleGroupedSettings||legacy.children.length!==9)return;
view.dataset.tleGroupedSettings='ready';
view.classList.add('tle-settings-screen');
const dict={
en:{settings:'Settings',search:'Search settings',workspace:'Workspace',communication:'Communication',account:'Account & security',device:'Device & app',business:'Business info',greeting:'Greeting colors',branding:'Business branding',booking:'Booking settings',team:'Team access',clients:'Client emails',notifications:'Notifications',language:'Language',payments:'Payment methods',reviews:'Google reviews',face:'Face ID & passcode',privacy:'Privacy',lock:'Auto-lock',storage:'Storage',about:'About',haptics:'Haptic feedback',wifi:'Sync over Wi-Fi only',unavailable:'Not available',notSupported:'Not supported',profile:'Business profile',plan:'Your cleaning workspace',back:'Back to Settings',manage:'Edit notification channels',notifyNote:'Email and Push can be enabled and saved through the existing alert editor.',presentation:'On-device presentation',banners:'Banners',sounds:'Sounds',badges:'Badges',previews:'Show previews',quiet:'Quiet hours',deviceManaged:'Controlled by your device',faceText:'Face ID and passcodes are managed by your device or password manager, not by a setting inside this app.',privacyText:'How The Launch Era handles your information.',lockText:'The Cleaning App signs out after inactivity. The security interval is set by the app.',storageText:'Device-reported storage estimate; business data will not be erased.',aboutText:'The Launch Era Cleaning App helps manage your bookings, clients, quotes and invoices.',wifiText:'Wi-Fi-only syncing is not currently supported; your existing sync continues unchanged.',openPrivacy:'Read privacy policy',openTerms:'Terms of service',empty:'No matching settings',online:'Connection',used:'Used',quota:'Storage estimate',yes:'Online',no:'Offline'},
es:{settings:'Ajustes',search:'Buscar ajustes',workspace:'Negocio',communication:'Comunicación',account:'Cuenta y seguridad',device:'Dispositivo y app',business:'Datos del negocio',greeting:'Colores de bienvenida',branding:'Imagen del negocio',booking:'Configuración de reservas',team:'Acceso del equipo',clients:'Correos a clientes',notifications:'Notificaciones',language:'Idioma',payments:'Métodos de pago',reviews:'Reseñas de Google',face:'Face ID y código',privacy:'Privacidad',lock:'Bloqueo automático',storage:'Almacenamiento',about:'Acerca de',haptics:'Respuesta háptica',wifi:'Sincronizar solo con Wi-Fi',unavailable:'No disponible',notSupported:'No compatible',profile:'Perfil del negocio',plan:'Tu espacio de trabajo',back:'Volver a Ajustes',manage:'Editar canales de alertas',notifyNote:'Puedes activar Correo o Push y guardar los cambios en el editor de alertas existente.',presentation:'Presentación en dispositivo',banners:'Banners',sounds:'Sonidos',badges:'Indicadores',previews:'Vistas previas',quiet:'Horas de silencio',deviceManaged:'Lo controla tu dispositivo',faceText:'Face ID y el código se gestionan desde tu dispositivo o gestor de contraseñas, no desde esta app.',privacyText:'Cómo The Launch Era protege y utiliza tus datos.',lockText:'La Cleaning App cierra la sesión por inactividad. El plazo de seguridad lo establece la app.',storageText:'Estimación del espacio del dispositivo; no se borran los datos del negocio.',aboutText:'The Launch Era Cleaning App organiza reservas, clientes, cotizaciones y facturas.',wifiText:'La sincronización solo por Wi-Fi todavía no está disponible. La sincronización actual sigue funcionando.',openPrivacy:'Leer política de privacidad',openTerms:'Términos del servicio',empty:'No se encontraron ajustes',online:'Conexión',used:'Utilizado',quota:'Espacio estimado',yes:'Conectado',no:'Sin conexión'},
fr:{settings:'Paramètres',search:'Rechercher',workspace:'Entreprise',communication:'Communication',account:'Compte et sécurité',device:'Appareil et app',business:'Informations entreprise',greeting:'Couleurs d’accueil',branding:'Image de marque',booking:'Réservations',team:'Accès équipe',clients:'E-mails clients',notifications:'Notifications',language:'Langue',payments:'Paiements',reviews:'Avis Google',face:'Face ID et code',privacy:'Confidentialité',lock:'Verrouillage auto',storage:'Stockage',about:'À propos',haptics:'Retour haptique',wifi:'Synchronisation Wi-Fi uniquement',unavailable:'Indisponible',notSupported:'Non pris en charge',profile:'Profil professionnel',plan:'Votre espace professionnel',back:'Retour aux paramètres',manage:'Modifier les alertes',notifyNote:'Les canaux Email et Push sont gérés dans l’éditeur existant.',presentation:'Présentation sur appareil',banners:'Bannières',sounds:'Sons',badges:'Badges',previews:'Aperçus',quiet:'Heures calmes',deviceManaged:'Géré par votre appareil',faceText:'Face ID et les codes se configurent sur votre appareil.',privacyText:'Comment The Launch Era protège vos données.',lockText:'La session expire après une période d’inactivité.',storageText:'Estimation locale du stockage sans effacer vos données.',aboutText:'The Launch Era Cleaning App pour vos réservations et opérations.',wifiText:'La synchronisation Wi-Fi uniquement n’est pas disponible.',openPrivacy:'Confidentialité',openTerms:'Conditions',empty:'Aucun résultat',online:'Connexion',used:'Utilisé',quota:'Stockage estimé',yes:'En ligne',no:'Hors ligne'},
ht:{settings:'Anviwònman',search:'Chèche',workspace:'Biznis',communication:'Kominikasyon',account:'Kont ak sekirite',device:'Aparèy ak app',business:'Enfòmasyon biznis',greeting:'Koulè akèy',branding:'Mak biznis',booking:'Rezèvasyon',team:'Aksè ekip',clients:'Imèl kliyan',notifications:'Notifikasyon',language:'Lang',payments:'Peman',reviews:'Revizyon Google',face:'Face ID ak kòd',privacy:'Konfidansyalite',lock:'Bloke otomatik',storage:'Depo',about:'Konsènan',haptics:'Vibrasyon',wifi:'Wi-Fi sèlman',unavailable:'Pa disponib',notSupported:'Pa sipòte',profile:'Pwofil biznis',plan:'Espas travay ou',back:'Retounen nan anviwònman',manage:'Chanje alèt',notifyNote:'Ou ka chwazi Imèl oswa Push epi sove nan editè alèt la.',presentation:'Sou aparèy la',banners:'Bannè',sounds:'Son',badges:'Badj',previews:'Aperçu',quiet:'Lè trankil',deviceManaged:'Aparèy la kontwole sa',faceText:'Face ID ak kòd se aparèy ou ki jere yo.',privacyText:'Kijan The Launch Era pwoteje done ou.',lockText:'Sesyon an fèmen lè pa gen aktivite.',storageText:'Estimasyon depo san efase dosye biznis.',aboutText:'The Launch Era Cleaning App pou operasyon ou.',wifiText:'Senkronizasyon Wi-Fi sèlman pa disponib.',openPrivacy:'Konfidansyalite',openTerms:'Kondisyon',empty:'Pa gen rezilta',online:'Koneksyon',used:'Itilize',quota:'Depo estime',yes:'Konekte',no:'Pa konekte'}};
function language(){const v=String(window.TLE_I18N?.language||document.documentElement.lang||'en').slice(0,2).toLowerCase();return dict[v]?v:'en';}
function t(key){return dict[language()][key]||dict.en[key]||key;}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
const icons={business:'⌂',greeting:'☼',branding:'▣',booking:'▦',team:'♧',clients:'✉',notifications:'♢',language:'文',payments:'$',reviews:'☆',face:'◎',privacy:'◇',lock:'▤',storage:'▥',about:'ⓘ',haptics:'◈',wifi:'◉'};
const keys=['business','greeting','branding','clients','notifications','booking','payments','reviews','team'];
const panels=[...legacy.children];
panels.forEach((panel,i)=>{panel.dataset.tleSettingsPanel=keys[i];panel.classList.add('tle-settings-original');});
const shell=document.createElement('div');
shell.className='tle-settings-frame';
shell.innerHTML='<div class="tle-settings-stage"><div class="tle-settings-list"><header class="tle-settings-header"><h2 id="tleSettingsHeading"></h2></header><label class="tle-settings-search"><span aria-hidden="true">⌕</span><input id="tleSettingsSearch" type="search" autocomplete="off"></label><button type="button" class="tle-settings-profile" data-setting="business"><span class="tle-settings-avatar" aria-hidden="true">TLE</span><span class="tle-settings-profile-copy"><strong id="tleSettingsBusinessName"></strong><small id="tleSettingsPlan"></small></span><span class="tle-settings-chevron" aria-hidden="true">›</span></button><div id="tleSettingsGroups"></div><p class="tle-settings-empty" id="tleSettingsEmpty" hidden></p></div><div class="tle-settings-dim" aria-hidden="true"></div><section class="tle-settings-detail" id="tleSettingsDetail" aria-hidden="true" inert><div class="tle-settings-detail-header"><button type="button" id="tleSettingsBack" class="tle-settings-back">‹ <span id="tleSettingsBackText"></span></button><strong id="tleSettingsDetailTitle"></strong><span aria-hidden="true"></span></div><div id="tleSettingsDetailScroll" class="tle-settings-detail-scroll"><div id="tleSettingsSupplement"></div><div id="tleSettingsPanelHost"></div></div></section></div>';
view.querySelector('.settings-intro')?.setAttribute('data-tle-replaced','true');
view.insertBefore(shell,legacy);
shell.querySelector('#tleSettingsPanelHost').appendChild(legacy);
const list=shell.querySelector('.tle-settings-list'),detail=shell.querySelector('#tleSettingsDetail');
const groups=shell.querySelector('#tleSettingsGroups'),search=shell.querySelector('#tleSettingsSearch');
const supplement=shell.querySelector('#tleSettingsSupplement');
let active=null,opener=null,haptics=false;
try{haptics=localStorage.getItem('tle_settings_haptics_v1')==='true';}catch{}
const vibrate=typeof navigator.vibrate==='function';
function buzz(){if(haptics&&vibrate)navigator.vibrate(8);}
const defs=[
{group:'workspace',items:['greeting','branding','booking','team','business']},
{group:'communication',items:['notifications','clients','language','reviews']},
{group:'account',items:['face','privacy','lock','payments']},
{group:'device',items:['storage','about','haptics','wifi']}
];
function row(key,gidx){
 const panel=panels[keys.indexOf(key)];
 if(panel&&(panel.hidden||panel.inert))return '';
 const disabled=key==='wifi'||(key==='haptics'&&!vibrate);
 const isSwitch=key==='haptics'&&vibrate;
 const right=isSwitch?'<input type="checkbox" class="tle-settings-switch-input" role="switch" data-switch="haptics" '+(haptics?'checked':'')+'><span class="tle-settings-switch-track" aria-hidden="true"><span></span></span>':'<span class="tle-settings-row-value">'+(disabled?esc(t(key==='wifi'?'unavailable':'notSupported')):'')+'</span>'+(disabled?'':'<span class="tle-settings-chevron" aria-hidden="true">›</span>');
 const content='<span class="tle-settings-icon tle-settings-icon-'+(gidx+1)+'" aria-hidden="true">'+icons[key]+'</span><span class="tle-settings-row-name">'+esc(t(key))+'</span>'+right;
 return isSwitch?'<label class="tle-settings-row tle-settings-switch-row" data-searchable="'+esc(t(key))+'">'+content+'</label>':'<button type="button" class="tle-settings-row" data-setting="'+key+'" data-searchable="'+esc(t(key))+'" '+(disabled?'disabled':'')+'>'+content+'</button>';
}
function filter(){
 const q=search.value.trim().toLocaleLowerCase();let hits=0;
 groups.querySelectorAll('.tle-settings-group').forEach(group=>{
  let n=0,category=group.querySelector('h3')?.textContent.toLocaleLowerCase()||'';
  group.querySelectorAll('.tle-settings-row').forEach(item=>{
   const ok=!q||category.includes(q)||item.dataset.searchable?.toLocaleLowerCase().includes(q);
   item.hidden=!ok;if(ok){n++;hits++;}
  });group.hidden=!n;
 });
 const profile=shell.querySelector('.tle-settings-profile');
 profile.hidden=!!q&&!(t('business')+' '+t('profile')+' '+shell.querySelector('#tleSettingsBusinessName').textContent).toLocaleLowerCase().includes(q);
 const empty=shell.querySelector('#tleSettingsEmpty');
 empty.hidden=hits!==0||!profile.hidden;empty.textContent=t('empty');
}
function render(){
 shell.querySelector('#tleSettingsHeading').textContent=t('settings');
 search.setAttribute('placeholder',t('search'));search.setAttribute('aria-label',t('search'));
 shell.querySelector('#tleSettingsPlan').textContent=t('plan');
 shell.querySelector('#tleSettingsBackText').textContent=t('settings');
 shell.querySelector('#tleSettingsBack').setAttribute('aria-label',t('back'));
 shell.querySelector('#tleSettingsBusinessName').textContent=document.querySelector('#settingsBusinessName')?.textContent?.trim().replace(/^—$/,'')||t('profile');
 groups.innerHTML=defs.map((group,i)=>{let rows=group.items.map(key=>row(key,i)).join('');return rows?'<section class="tle-settings-group"><h3>'+esc(t(group.group))+'</h3><div class="tle-settings-group-card">'+rows+'</div></section>':'';}).join('');
 filter();if(active)shell.querySelector('#tleSettingsDetailTitle').textContent=t(active);
}
function extras(key){
 let info=key==='face'?'faceText':key==='privacy'?'privacyText':key==='lock'?'lockText':key==='storage'?'storageText':key==='about'?'aboutText':null;
 let body=info?'<p class="tle-settings-explainer">'+esc(t(info))+'</p>':'';
 if(key==='privacy')body+='<div class="tle-settings-link-group"><a class="legal-privacy-link" href="https://thelaunchera.com/privacy.html" target="_blank" rel="noopener">'+esc(t('openPrivacy'))+' ↗</a><a class="legal-terms-link" href="https://thelaunchera.com/terms.html" target="_blank" rel="noopener">'+esc(t('openTerms'))+' ↗</a></div>';
 if(key==='language')body+='<button type="button" class="tle-settings-detail-button" id="tleSettingsChooseLanguage">'+esc(t('language'))+' ↗</button>';
 if(key==='storage')body+='<div class="tle-settings-system-readout" id="tleSettingsStorageInfo"></div>';
 if(key==='notifications'){
   body+='<p class="tle-settings-explainer">'+esc(t('notifyNote'))+'</p><section class="tle-settings-group tle-settings-aux-group"><h3>'+esc(t('presentation'))+'</h3><div class="tle-settings-group-card">';
   for(const sub of ['banners','sounds','badges','previews','quiet'])body+='<div class="tle-settings-row tle-settings-static-row"><span class="tle-settings-icon tle-settings-icon-2">♢</span><span class="tle-settings-row-name">'+esc(t(sub))+'</span><small class="tle-settings-row-value">'+esc(t('deviceManaged'))+'</small></div>';
   body+='</div></section>';
 }
 return body;
}
async function storage(){
 const el=supplement.querySelector('#tleSettingsStorageInfo');if(!el)return;
 el.textContent=t('online')+': '+t(navigator.onLine?'yes':'no');
 if(navigator.storage?.estimate)try{
  const result=await navigator.storage.estimate();if(active!=='storage')return;
  const fmt=n=>Number.isFinite(n)?(n/1048576).toLocaleString(language(),{maximumFractionDigits:1})+' MB':'—';
  el.textContent=t('online')+': '+t(navigator.onLine?'yes':'no')+' · '+t('used')+': '+fmt(result.usage)+' · '+t('quota')+': '+fmt(result.quota);
 }catch{}
}
function open(key,trigger){
 if(key==='haptics'||key==='wifi')return;
 active=key;opener=trigger||document.activeElement;
 panels.forEach(p=>{const selected=p.dataset.tleSettingsPanel===key;p.classList.toggle('tle-current-panel',selected);p.classList.toggle('settings-open',selected);});
 supplement.innerHTML=extras(key);
 shell.querySelector('#tleSettingsDetailTitle').textContent=t(key);
 detail.inert=false;detail.setAttribute('aria-hidden','false');
 shell.classList.add('tle-settings-detail-open');
 shell.querySelector('#tleSettingsDetailScroll').scrollTop=0;
 if(key==='storage')void storage();
 buzz();requestAnimationFrame(()=>shell.querySelector('#tleSettingsBack')?.focus({preventScroll:true}));
}
function close(){
 if(!active)return;
 active=null;shell.classList.remove('tle-settings-detail-open');
 detail.setAttribute('aria-hidden','true');detail.inert=true;
 panels.forEach(p=>p.classList.remove('tle-current-panel','settings-open'));
 buzz();(opener?.isConnected?opener:search).focus({preventScroll:true});opener=null;
}
groups.addEventListener('click',e=>{const button=e.target.closest('button[data-setting]');if(button&&!button.disabled)open(button.dataset.setting,button);});
groups.addEventListener('change',e=>{const input=e.target.closest('[data-switch="haptics"]');if(!input)return;haptics=input.checked;try{localStorage.setItem('tle_settings_haptics_v1',String(haptics));}catch{}buzz();});
shell.querySelector('.tle-settings-profile').addEventListener('click',e=>open('business',e.currentTarget));
shell.querySelector('#tleSettingsBack').addEventListener('click',close);
shell.addEventListener('click',e=>{if(e.target.closest('#tleSettingsChooseLanguage'))document.querySelector('#languageBtn')?.click();});
search.addEventListener('input',filter);
document.addEventListener('keydown',e=>{if(active&&view.classList.contains('active')&&e.key==='Escape'&&document.querySelector('#modalBackdrop')?.hidden){e.preventDefault();close();}});
document.addEventListener('click',e=>{if(active&&view.classList.contains('active')&&e.target.closest('#appShell #backBtn')){e.preventDefault();e.stopImmediatePropagation();close();}},true);
const watch=new MutationObserver(()=>{if(!view.classList.contains('active')&&active)close();if(view.classList.contains('active'))render();});
watch.observe(view,{attributes:true,attributeFilter:['class']});
const biz=document.querySelector('#settingsBusinessName');
if(biz)new MutationObserver(()=>{shell.querySelector('#tleSettingsBusinessName').textContent=biz.textContent?.trim().replace(/^—$/,'')||t('profile');}).observe(biz,{childList:true,subtree:true,characterData:true});
panels.forEach(p=>new MutationObserver(()=>{if(!active)render();}).observe(p,{attributes:true,attributeFilter:['hidden','inert']}));
new MutationObserver(()=>render()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
view.addEventListener('click',e=>{const head=e.target.closest('.tle-current-panel .panel-head.settings-accordion-trigger');if(head&&!e.target.closest('button,input,a,select'))e.stopImmediatePropagation();},true);
render();
}
const target=document.querySelector('#appShell .view[data-page="settings"]');
if(target){
  if(target.classList.contains('active'))mountSettings();
  else {
    const onOpen=new MutationObserver(observer=>{
      if(target.classList.contains('active')){
        observer.disconnect();
        mountSettings();
      }
    });
    onOpen.observe(target,{attributes:true,attributeFilter:['class']});
  }
}
})();
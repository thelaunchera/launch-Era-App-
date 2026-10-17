/* TLE r85 — Today's Route. Abstract illustrated preview, never a live GPS/ETA feed. */
(()=>{
  "use strict";
  const PATH='M 76 557 L 76 458 Q 76 446 88 446 L 236 446 Q 248 446 248 434 L 248 328 Q 248 316 260 316 L 344 316 Q 356 316 356 304 L 356 144';
  const dict={
    en:{preview:'Illustrated route preview · not live GPS',today:"Today's route",navigate:'Open live route',share:'Share trip',shareConfirm:'This will share the Google Maps route, including customer service addresses. Continue?',shareTitle:'Today’s cleaning route',shareText:'Scheduled cleaning route',noStops:'No stops scheduled',noStopsDesc:'Add a cleaning job with an address to prepare your route.',next:'Next scheduled job',due:'Scheduled now',mins:'min',start:'Scheduled start',stop:'Stop',stops:'stops',first:'Starting point',nextStop:'Next cleaning stop',progress:'Route preview',complete:'Preview complete',replay:'Restarting preview',scheduled:'Scheduled',time:'Time',call:'Call',message:'Message',contact:'Customer contact',noPhone:'No phone number saved for this client.',noContact:'No contact method saved for this client.',openPhone:'Opening the phone app',openMessage:'Opening message composer',shareUnsupported:'Sharing is not supported here. Copy the route in Google Maps.',shareCopied:'Route link copied',shareUnavailable:'Could not share the route',done:'Done',weather:'Use Google Maps for actual driving time and traffic.',noEta:'Live travel time in Maps',mile:'Distance logged',visit:'Visit',notLive:'Animated preview only',onlyScheduled:'Time counts down to the appointment, not your estimated arrival.'},
    es:{preview:'Vista ilustrada · no es GPS en vivo',today:'Ruta de hoy',navigate:'Abrir ruta GPS',share:'Compartir ruta',shareConfirm:'Se compartirá la ruta de Google Maps con las direcciones de los clientes. ¿Continuar?',shareTitle:'Ruta de limpieza de hoy',shareText:'Ruta de limpiezas programadas',noStops:'No hay paradas programadas',noStopsDesc:'Añade una limpieza con dirección para preparar tu ruta.',next:'Próxima limpieza programada',due:'Empieza ahora',mins:'min',start:'Hora programada',stop:'Parada',stops:'paradas',first:'Punto de salida',nextStop:'Próxima limpieza',progress:'Vista previa',complete:'Vista previa completada',replay:'Reiniciando recorrido',scheduled:'Programado',time:'Hora',call:'Llamar',message:'Mensaje',contact:'Contactar cliente',noPhone:'Este cliente no tiene teléfono guardado.',noContact:'No hay datos de contacto del cliente.',openPhone:'Abriendo la aplicación de teléfono',openMessage:'Abriendo mensajes',shareUnsupported:'No se puede compartir aquí. Copia la ruta desde Google Maps.',shareCopied:'Enlace de la ruta copiado',shareUnavailable:'No se pudo compartir la ruta',done:'Listo',weather:'Consulta el tráfico y tiempo real en Google Maps.',noEta:'Tiempo de traslado en Maps',mile:'Distancia registrada',visit:'Visita',notLive:'Animación ilustrativa',onlyScheduled:'Los minutos son hasta la cita, no una estimación de llegada.'},
    fr:{preview:'Aperçu illustré · pas de GPS en direct',today:"Itinéraire du jour",navigate:"Ouvrir l’itinéraire",share:'Partager',shareConfirm:'Partager les adresses des clients dans Google Maps ?',shareTitle:'Tournée de nettoyage',shareText:'Tournée programmée',noStops:'Aucun arrêt prévu',noStopsDesc:'Ajoutez une mission avec une adresse.',next:'Prochain rendez-vous prévu',due:'Prévu maintenant',mins:'min',start:'Heure prévue',stop:'Arrêt',stops:'arrêts',first:'Point de départ',nextStop:'Prochain arrêt',progress:'Aperçu du trajet',complete:'Aperçu terminé',replay:"Redémarrage de l’aperçu",scheduled:'Prévu',time:'Heure',call:'Appeler',message:'Message',contact:'Contact client',noPhone:'Aucun numéro enregistré.',noContact:'Aucun moyen de contact enregistré.',openPhone:'Ouverture du téléphone',openMessage:'Ouverture du message',shareUnsupported:'Partage indisponible, ouvrez Google Maps.',shareCopied:'Lien copié',shareUnavailable:'Partage impossible',done:'Terminé',weather:'Google Maps affiche le trafic réel.',noEta:'Trajet réel dans Maps',mile:'Distance enregistrée',visit:'Visite',notLive:'Animation illustrative',onlyScheduled:"Le compte à rebours indique l'heure prévue, pas l’arrivée."},
    ht:{preview:'Aperçu desen · se pa GPS an dirèk',today:'Wout jodi a',navigate:'Louvri GPS',share:'Pataje wout la',shareConfirm:'Sa ap pataje adrès kliyan yo nan Google Maps. Kontinye?',shareTitle:'Wout netwayaj',shareText:'Wout travay ki pwograme',noStops:'Pa gen arè',noStopsDesc:'Ajoute yon travay ki gen adrès.',next:'Pwochen travay ki pwograme',due:'Se kounye a',mins:'min',start:'Lè travay la',stop:'Arè',stops:'arè',first:'Kote depa',nextStop:'Pwochen netwayaj',progress:'Aperçu wout',complete:'Aperçu fini',replay:'Rekòmanse aperçu',scheduled:'Pwograme',time:'Lè',call:'Rele',message:'Mesaj',contact:'Kontakte kliyan',noPhone:'Pa gen nimewo telefòn kliyan sa a.',noContact:'Pa gen kontak pou kliyan sa a.',openPhone:'Louvri telefòn',openMessage:'Louvri mesaj',shareUnsupported:'Pataj pa disponib. Louvri Google Maps.',shareCopied:'Lyen kopye',shareUnavailable:'Pataj pa posib',done:'Fini',weather:'Google Maps montre trafik an dirèk.',noEta:'Tan reyèl nan Maps',mile:'Distans anrejistre',visit:'Vizit',notLive:'Se yon animasyon sèlman',onlyScheduled:'Minut yo se pou lè randevou a, se pa lè rive.'}
  };
  const lang=()=>{const l=String(window.TLE_I18N?.language||document.documentElement.lang||'en').slice(0,2).toLowerCase();return dict[l]?l:'en';};
  const t=k=>dict[lang()][k]||dict.en[k]||k;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const timeFormat=value=>{const d=new Date(value);return Number.isNaN(+d)?'—':new Intl.DateTimeFormat(lang(),{hour:'numeric',minute:'2-digit'}).format(d);};
  const cleanPhone=value=>{const raw=String(value||'').replace(/[^\d+]/g,'');return /^\+?\d{7,15}$/.test(raw)?raw:'';};
  const blocks=[
    [10,15,110,96],[140,15,117,96],[276,15,143,96],
    [10,131,45,150],[95,131,131,154],[248,132,87,138],[377,132,43,138],
    [10,301,47,122],[96,301,128,123],[268,338,152,85],
    [11,467,47,146],[95,465,126,148],[268,465,151,148],
    [10,628,115,22],[145,628,113,22],[279,628,140,22]
  ];
  function mapSVG(){
    const roads='<path d="M76 0 V650 M248 0 V650 M356 0 V650 M0 121 H430 M0 292 H430 M0 445 H430 M0 614 H430" fill="none" stroke="#f9fdff" stroke-width="20"/><path d="M-35 360 L466 100" stroke="#fff" stroke-width="19"/><path d="M-35 360 L466 100" stroke="#c2dbea" stroke-width="2" stroke-dasharray="4 13"/>';
    const city=blocks.map(([x,y,w,h],i)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="13" fill="'+(i%3===0?'#f6fafc':'#fcfeff')+'" opacity=".96"/>').join('');
    const trees=[125,154,180,203].map((x,i)=>'<circle cx="'+x+'" cy="'+(i%2?187:218)+'" r="'+(i%2?13:16)+'" fill="#b4d5e4"/><circle cx="'+(x-6)+'" cy="'+(i%2?180:210)+'" r="8" fill="#d3eaf3"/>').join('');
    return '<svg class="tle-route-map-svg" viewBox="0 0 430 650" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="430" height="650" fill="#d7e8f2"/>'+city+'<rect x="111" y="162" width="110" height="89" rx="13" fill="#d7edf3"/>'+trees+roads+'<path d="'+PATH+'" class="tle-route-path-base" fill="none" stroke="#237dbb" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="'+PATH+'" class="tle-route-path-driven" fill="none" stroke="#a3d3ef" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><g class="tle-route-pickup" transform="translate(356 144)"><circle class="tle-route-pulse" r="17" fill="#4e9ed3"/><path d="M0 -29 C-15 -29 -22 -17 -22 -5 C-22 12 0 29 0 29 C0 29 22 12 22 -5 C22 -17 15 -29 0 -29 Z" fill="#145b90" stroke="white" stroke-width="2"/><circle cy="-6" r="7" fill="#fff"/></g><g class="tle-route-startpin" transform="translate(76 557)"><circle r="12" fill="white" stroke="#237dbb" stroke-width="5"/><circle r="4" fill="#237dbb"/></g><g class="tle-route-car" transform="translate(76 557)"><rect x="-11" y="-19" width="22" height="38" rx="9" fill="#102f4d" stroke="#ffffff" stroke-width="2"/><rect x="-8" y="-10" width="16" height="12" rx="4" fill="#acd5e8"/><rect x="-7" y="7" width="14" height="6" rx="3" fill="#448bad"/><circle cx="-7" cy="-13" r="2" fill="#ffeeb9"/><circle cx="7" cy="-13" r="2" fill="#ffeeb9"/></g></svg>';
  }
  function mapsURL(jobs){
    const addresses=jobs.map(j=>String(j.service_address||'').trim()).filter(Boolean);
    if(!addresses.length)return '';
    const params=new URLSearchParams({api:'1',destination:addresses[addresses.length-1],travelmode:'driving',dir_action:'navigate'});
    if(addresses.length>1)params.set('waypoints',addresses.slice(0,-1).join('|'));
    return 'https://www.google.com/maps/dir/?'+params.toString();
  }
  let state=null;
  const timeToNext=()=>state?.next?.starts_at?Math.max(0,Math.ceil((new Date(state.next.starts_at).getTime()-Date.now())/60000)):null;
  function updateTime(){
    if(!state)return;
    const remaining=timeToNext(),eta=state.root.querySelector('.tle-route-eta-value');
    const label=state.root.querySelector('.tle-route-eta-label');
    const value=remaining===null?'—':remaining===0?t('due'):String(remaining);
    if(eta.textContent!==value)eta.textContent=value;
    if(label)label.textContent=remaining===0?t('due'):t('next');
  }
  function toast(message){
    if(!state)return;
    const el=state.root.querySelector('.tle-route-toast');
    if(!el)return;
    el.textContent=message;el.classList.remove('tle-route-toast-on');void el.offsetWidth;
    el.classList.add('tle-route-toast-on');clearTimeout(state.toastTimeout);
    state.toastTimeout=setTimeout(()=>el.classList.remove('tle-route-toast-on'),2700);
  }
  function animate(now){
    if(!state || !state.active || document.hidden || !state.routable.length)return;
    const ctx=state;
    const dt=Math.min(.06,(now-(ctx.lastFrame||now))/1000);ctx.lastFrame=now;
    const {path,length,car,driven,arrival,bar}=ctx;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(reduced){ctx.frame=null;return;}
    if(ctx.phase==='drive'){
      ctx.progress=Math.min(1,ctx.progress+dt*.056);
      const l=ctx.progress*length;
      const point=path.getPointAtLength(l),near=path.getPointAtLength(Math.min(length,l+1.5));
      const raw=Math.atan2(near.y-point.y,near.x-point.x)*180/Math.PI+90;
      // Turn smoothing around right angles without spinning 360°.
      ctx.angle+=((raw-ctx.angle+540)%360-180)*Math.min(1,dt*9);
      car.setAttribute('transform','translate('+point.x.toFixed(2)+' '+point.y.toFixed(2)+') rotate('+ctx.angle.toFixed(2)+')');
      driven.style.strokeDasharray=l+' '+length;
      bar.style.transform='scaleX('+ctx.progress+')';
      if(ctx.progress>=1){ctx.phase='hold';ctx.holdTime=now;arrival.textContent=t('complete');}
    }else if(ctx.phase==='hold'){
      if(now-ctx.holdTime>=2600){ctx.phase='draw';ctx.drawProgress=0;arrival.textContent=t('replay');}
    }else{
      ctx.drawProgress=Math.min(1,ctx.drawProgress+dt/1.1);
      const e=1-Math.pow(1-ctx.drawProgress,3);
      path.style.strokeDasharray=length;
      path.style.strokeDashoffset=length*(1-e);
      if(ctx.drawProgress>=1){
        path.style.strokeDashoffset='0';
        ctx.phase='drive';ctx.progress=0;ctx.angle=180;
        bar.style.transform='scaleX(0)';driven.style.strokeDasharray='0 '+length;
        arrival.textContent=t('notLive');
      }
    }
    if(ctx.nextUpdate!==Math.floor(Date.now()/30000)){ctx.nextUpdate=Math.floor(Date.now()/30000);updateTime();}
    ctx.frame=requestAnimationFrame(animate);
  }
  function pause(){if(!state)return;state.active=false;state.lastFrame=0;if(state.frame!=null)cancelAnimationFrame(state.frame);state.frame=null;}
  function resume(){
    if(!state)return;
    const view=document.querySelector('#appShell .view[data-page="route"]');
    if(document.hidden||!view?.classList.contains('active')||!state.routable.length){pause();return;}
    if(state.active)return;
    state.active=true;state.lastFrame=0;updateTime();
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    state.frame=requestAnimationFrame(animate);
  }
  function click(e){
    const root=state?.root;if(!root||!root.contains(e.target))return;
    if(e.target.closest('[data-tle-route-back]')){
      const back=document.querySelector('#appShell #backBtn');
      if(back&&!back.hidden)back.click();
      else document.querySelector('#appShell .nav-item[data-view="today"]')?.click();
      return;
    }
    const share=e.target.closest('[data-tle-route-share]');
    if(share){
      const url=mapsURL(state.routable);
      if(!url){toast(t('noStops'));return;}
      if(!window.confirm(t('shareConfirm')))return;
      const payload={title:t('shareTitle'),text:t('shareText'),url};
      if(navigator.share){
        navigator.share(payload).catch(error=>{if(error?.name!=='AbortError')toast(t('shareUnavailable'));});
      }else if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url).then(()=>toast(t('shareCopied')),()=>toast(t('shareUnsupported')));}
      else toast(t('shareUnsupported'));
      return;
    }
    const action=e.target.closest('[data-tle-route-contact]');
    if(action){
      const mode=action.dataset.tleRouteContact;const target=state.next;
      const phone=cleanPhone(target?.contactPhone),email=String(target?.contactEmail||'').trim();
      if(mode==='call'){if(phone){toast(t('openPhone'));window.location.href='tel:'+phone;}else toast(t('noPhone'));return;}
      if(phone){toast(t('openMessage'));window.location.href='sms:'+phone;}else if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast(t('openMessage'));window.location.href='mailto:'+encodeURIComponent(email);}else toast(t('noContact'));
    }
  }
  function render(jobs=[],options={}){
    const root=document.querySelector('#routeVisual');
    if(!root)return;
    pause();
    if(state)clearTimeout(state.toastTimeout);
    const real=Array.isArray(jobs)?jobs:[];
    const routable=real.filter(j=>String(j.service_address||'').trim()&&!['canceled','no_show','completed'].includes(String(j.status||'').toLowerCase()));
    const next=routable.find(j=>new Date(j.starts_at).getTime()>Date.now())||routable[0]||null;
    const contacts=options.contacts&&typeof options.contacts==='object'?options.contacts:{};
    const contact=next?.client_id ? contacts[String(next.client_id)]||{} : {};
    const businessName=String(next?.clients?.name||next?.services?.name||t('nextStop'));
    const time=next?.starts_at?timeFormat(next.starts_at):'—';
    const miles=Number(options.todayMiles)||0;
    const count=routable.length;
    const safeName=esc(businessName);
    const initials=businessName.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]?.toUpperCase()||'').join('').slice(0,2)||'TLE';
    const vehicle=String(next?.job_assignments?.[0]?.team_members?.name||options.businessName||'The Launch Era');
    root.className='tle-route-screen';
    root.innerHTML='<div class="tle-route-canvas">'+mapSVG()+
      '<div class="tle-route-top-controls"><button class="tle-route-back" data-tle-route-back type="button" aria-label="'+esc(t('today'))+'"><span aria-hidden="true">‹</span></button><button type="button" class="tle-route-share" data-tle-route-share '+(count?'':'disabled')+'>'+esc(t('share'))+' ↗</button></div>'+
      '<span class="tle-route-map-caption">'+esc(t('preview'))+'</span>'+
      '<div class="tle-route-sheet"><div class="tle-route-grab" aria-hidden="true"></div>'+
      '<div class="tle-route-sheet-heading"><div><span class="tle-route-overline">'+esc(t('next'))+'</span><div class="tle-route-eta"><strong class="tle-route-eta-value" aria-live="polite" aria-atomic="true">—</strong><span class="tle-route-min-unit">'+esc(t('mins'))+'</span></div><span class="tle-route-time-note">'+esc(t('onlyScheduled'))+'</span></div><div class="tle-route-sheet-badge">'+count+' '+esc(count===1?t('stop'):t('stops'))+'</div></div>'+
      '<div class="tle-route-animated-bar"><span></span></div>'+
      '<div class="tle-route-contact-row"><span class="tle-route-avatar">'+esc(initials)+'</span><span class="tle-route-contact-info"><strong>'+safeName+'</strong><small>'+esc(t('start'))+': '+esc(time)+' · '+esc(vehicle)+'</small></span><div class="tle-route-contact-actions"><button type="button" data-tle-route-contact="call" aria-label="'+esc(t('call'))+'">☎</button><button type="button" data-tle-route-contact="message" aria-label="'+esc(t('message'))+'">✉</button></div></div>'+
      '<div class="tle-route-stops-summary"><div><i></i><span>'+esc(t('first'))+'</span><small>'+esc(t('notLive'))+'</small></div><div><i></i><span>'+esc(t('nextStop'))+'</span><small>'+safeName+(next?.service_address?' · '+esc(next.service_address):'')+'</small></div></div>'+
      (count?'<button class="tle-route-open-maps" type="button" data-best-route>'+esc(t('navigate'))+' ↗</button>':'<div class="tle-route-empty"><strong>'+esc(t('noStops'))+'</strong><p>'+esc(t('noStopsDesc'))+'</p></div>')+
      '<p class="tle-route-advisory">'+esc(t('weather'))+'</p>'+
      '<span class="tle-route-status" aria-live="off">'+esc(t('notLive'))+'</span>'+
      '</div><div class="tle-route-toast" role="status" aria-live="polite"></div></div>';
    const path=root.querySelector('.tle-route-path-base'),driven=root.querySelector('.tle-route-path-driven');
    const length=path.getTotalLength();
    driven.style.strokeDasharray='0 '+length;
    if(!count)root.classList.add('tle-route-is-empty');
    state={root,real,routable,next:next?{...next,contactPhone:contact.phone||next.clients?.phone||'',contactEmail:contact.email||next.clients?.email||''}:null,
      path,driven,length,car:root.querySelector('.tle-route-car'),arrival:root.querySelector('.tle-route-status'),bar:root.querySelector('.tle-route-animated-bar span'),
      frame:null,toastTimeout:null,active:false,lastFrame:0,nextUpdate:0,progress:0,angle:180,phase:'drive',holdTime:0,drawProgress:0};
    root.removeEventListener('click',click);
    root.addEventListener('click',click);
    updateTime();resume();
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else resume();});
  const route=document.querySelector('#appShell .view[data-page="route"]');
  if(route)new MutationObserver(()=>{if(route.classList.contains('active'))resume();else pause();}).observe(route,{attributes:true,attributeFilter:['class']});
  window.TLE_ROUTE_R85={render,pause,resume};
})();
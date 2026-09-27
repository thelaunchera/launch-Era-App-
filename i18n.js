(()=>{
  const STORAGE_KEY="tle_language";
  const exact={
    "Could not sign out":"No se pudo cerrar la sesión",
    "Signing out…":"Cerrando sesión…",
    "Log out":"Cerrar sesión",
    "Use your current admin email to continue.":"Usa tu correo actual de administrador para continuar.",
    "Back to sign in":"Volver a iniciar sesión",
    "Enter the new password you want to use.":"Escribe la nueva contraseña que quieres usar.",
    "Choose a new password":"Elige una contraseña nueva",
    "Update password":"Actualizar contraseña",
    "Sign-in email sent":"Correo de acceso enviado",
    "Check your email and open the sign-in message. No password is needed.":"Revisa tu correo y abre el mensaje de acceso. No necesitas contraseña.",
    "Sending your secure sign-in email…":"Enviando tu enlace seguro de acceso…",
    "Enter your admin email first.":"Primero escribe tu correo de administrador.",
    "Continue with your admin email. No password required.":"Continúa con tu correo de administrador. No necesitas contraseña.",
    "Continue as Admin":"Continuar como Admin",
    "BUSINESS ACCESS":"ACCESO AL NEGOCIO",
    "Sign in":"Iniciar sesión",
    "Create account":"Crear cuenta",
    "Open your cleaning business workspace.":"Abre el espacio de trabajo de tu negocio de limpieza.",
    "Create your cleaning business account.":"Crea la cuenta de tu negocio de limpieza.",
    "Password":"Contraseña",
    "Email":"Correo electrónico",
    "Forgot password?":"¿Olvidaste tu contraseña?",
    "Already have an account? Sign in":"¿Ya tienes una cuenta? Inicia sesión",
    "FIRST SETUP":"CONFIGURACIÓN INICIAL",
    "Tell me about your business.":"Cuéntame sobre tu negocio.",
    "This creates your private workspace and starts the 30-day trial.":"Esto crea tu espacio privado y comienza la prueba de 30 días.",
    "Business name":"Nombre del negocio",
    "Phone":"Teléfono",
    "Service area":"Área de servicio",
    "Create my workspace":"Crear mi espacio",
    "Worker Access":"Acceso del trabajador",
    "Exit":"Salir",
    "MY WORK":"MI TRABAJO",
    "Today":"Hoy",
    "Only your assigned jobs appear here.":"Aquí solo aparecen los trabajos que tienes asignados.",
    "Assigned jobs":"Trabajos asignados",
    "Timer":"Temporizador",
    "Off":"Apagado",
    "TODAY + UPCOMING":"HOY + PRÓXIMOS",
    "My assigned jobs":"Mis trabajos asignados",
    "LIMITED ACCESS":"ACCESO LIMITADO",
    "What you can use":"Lo que puedes usar",
    "Assigned jobs":"Trabajos asignados",
    "Route + address":"Ruta + dirección",
    "Job status":"Estado del trabajo",
    "Time tracking":"Control de tiempo",
    "Mileage":"Millaje",
    "You cannot see leads, quotes, invoices, pricing, reports, billing, settings or other clients.":"No puedes ver leads, cotizaciones, facturas, precios, reportes, facturación, ajustes ni otros clientes.",
    "Secure request":"Solicitud segura",
    "BOOK A CLEANING":"RESERVAR UNA LIMPIEZA",
    "REQUEST A QUOTE":"SOLICITAR COTIZACIÓN",
    "Choose your service and send your request.":"Elige tu servicio y envía tu solicitud.",
    "Cleaning service":"Servicio de limpieza",
    "Service":"Servicio",
    "Choose a service":"Elige un servicio",
    "Add-ons":"Extras",
    "Date":"Fecha",
    "Time":"Hora",
    "Preferred time":"Hora preferida",
    "Available times":"Horarios disponibles",
    "Choose a service and date first.":"Primero elige un servicio y una fecha.",
    "Name":"Nombre",
    "Preferred contact":"Contacto preferido",
    "Text":"Mensaje de texto",
    "WhatsApp":"WhatsApp",
    "Service address":"Dirección del servicio",
    "Notes":"Notas",
    "Anything the cleaning business should know?":"¿Hay algo que el negocio de limpieza deba saber?",
    "Send booking request":"Enviar solicitud de reserva",
    "Send quote request":"Enviar solicitud de cotización",
    "INVOICE":"FACTURA",
    "Invoice":"Factura",
    "Subtotal":"Subtotal",
    "Paid":"Pagado",
    "Balance due":"Saldo pendiente",
    "Payment methods":"Métodos de pago",
    "Payment is arranged directly with the cleaning business. No card payment is collected on this page.":"El pago se coordina directamente con el negocio de limpieza. No se cobran tarjetas en esta página.",
    "QUOTE":"COTIZACIÓN",
    "Review your quote":"Revisa tu cotización",
    "Total":"Total",
    "Decline":"Rechazar",
    "Accept quote":"Aceptar cotización",
    "Request received":"Solicitud recibida",
    "The cleaning business received your request and will follow up with you.":"El negocio de limpieza recibió tu solicitud y se comunicará contigo.",
    "THE LAUNCH ERA CLEANING APP":"THE LAUNCH ERA CLEANING APP",
    "Here’s what needs your attention today.":"Esto es lo que necesita tu atención hoy.",
    "Open today’s route →":"Abrir ruta de hoy →",
    "Today’s jobs":"Trabajos de hoy",
    "Scheduled today":"Programados para hoy",
    "Active clients":"Clientes activos",
    "Current client records":"Registros actuales de clientes",
    "Open quotes":"Cotizaciones abiertas",
    "Requested, draft or sent":"Solicitadas, borradores o enviadas",
    "Outstanding invoices":"Facturas pendientes",
    "Still to collect":"Pendiente de cobrar",
    "Booking requests":"Solicitudes de reserva",
    "Waiting for review":"Esperando revisión",
    "TODAY":"HOY",
    "Schedule + route":"Horario + ruta",
    "Full calendar →":"Calendario completo →",
    "QUICK ACTIONS":"ACCIONES RÁPIDAS",
    "Move work forward":"Avanza el trabajo",
    "Add client":"Añadir cliente",
    "Create quote":"Crear cotización",
    "Booking link":"Link de reservas",
    "Create invoice":"Crear factura",
    "Log mileage":"Registrar millaje",
    "Track time":"Registrar tiempo",
    "NEEDS ATTENTION":"NECESITA ATENCIÓN",
    "Don’t let these slip":"No dejes que esto se pase",
    "Nothing urgent.":"Nada urgente.",
    "No overdue invoices, sent quotes, or new booking requests need attention.":"No hay facturas vencidas, cotizaciones enviadas ni nuevas reservas que requieran atención.",
    "THIS WEEK":"ESTA SEMANA",
    "No completed work logged yet.":"Todavía no hay trabajos completados registrados.",
    "See reports →":"Ver reportes →",
    "Booking Center":"Centro de Reservas",
    "Leads":"Leads",
    "Clients":"Clientes",
    "Calendar + Jobs":"Calendario + Trabajos",
    "Quotes":"Cotizaciones",
    "Invoices":"Facturas",
    "Operations":"Operaciones",
    "Today's Route":"Ruta de Hoy",
    "Mileage":"Millaje",
    "Time Tracking":"Control de Tiempo",
    "Supplies":"Suministros",
    "Owner Reports":"Reportes del Owner",
    "Business":"Negocio",
    "Services + Add-ons":"Servicios + Extras",
    "Team":"Equipo",
    "Settings":"Ajustes",
    "Owner Admin":"Admin del Owner",
    "Platform Admin":"Admin de la Plataforma",
    "Help & FAQ":"Ayuda y Preguntas",
    "30-day trial":"Prueba de 30 días",
    "Full access":"Acceso completo",
    "Then $5.99/month. No card required to start.":"Después $5.99/mes. No se requiere tarjeta para comenzar.",
    "Sign out":"Cerrar sesión",
    "+ Add New":"+ Añadir",
    "BOOKING CENTER":"CENTRO DE RESERVAS",
    "Your public front door.":"Tu puerta de entrada pública.",
    "Control what clients can book, when they can book it, and where each request goes next.":"Controla qué pueden reservar tus clientes, cuándo pueden hacerlo y a dónde va cada solicitud.",
    "Copy booking link":"Copiar link de reservas",
    "PUBLIC LINKS":"LINKS PÚBLICOS",
    "Share anywhere":"Compártelos donde quieras",
    "Quote request link":"Link para cotización",
    "Open":"Abrir",
    "Copy":"Copiar",
    "AVAILABILITY":"DISPONIBILIDAD",
    "Only show real openings":"Mostrar solo horarios realmente disponibles",
    "Save":"Guardar",
    "Travel buffer":"Tiempo entre servicios",
    "No buffer":"Sin tiempo extra",
    "Minimum booking notice":"Anticipación mínima para reservar",
    "Same-day allowed":"Permitir el mismo día",
    "If a day is off, clients will never see slots on that day. Service duration, add-ons, travel buffer, scheduled jobs and pending requests are all checked before a time is shown.":"Si un día está desactivado, los clientes no verán horarios ese día. Antes de mostrar una hora se revisan la duración, extras, tiempo de viaje, trabajos ya programados y solicitudes pendientes.",
    "BOOKING REQUESTS":"SOLICITUDES DE RESERVA",
    "Requests waiting for review":"Solicitudes esperando revisión",
    "BOOKABLE SERVICES":"SERVICIOS DISPONIBLES",
    "Services + add-ons shown to clients":"Servicios + extras que ven los clientes",
    "Edit services →":"Editar servicios →",
    "CLIENT EXPERIENCE":"EXPERIENCIA DEL CLIENTE",
    "What the customer sees":"Lo que ve el cliente",
    "No account required":"No requiere cuenta",
    "Choose service":"Elegir servicio",
    "Pick available time":"Elegir horario disponible",
    "Enter details":"Ingresar datos",
    "Review":"Revisar",
    "Booking / Quote":"Reserva / Cotización",
    "LEADS":"LEADS",
    "CLIENTS":"CLIENTES",
    "CALENDAR + JOBS":"CALENDARIO + TRABAJOS",
    "RECURRING":"RECURRENTES",
    "QUOTES":"COTIZACIONES",
    "Quote requests stay here until the customer accepts.":"Las solicitudes de cotización se quedan aquí hasta que el cliente acepte.",
    "INVOICES":"FACTURAS",
    "TODAY'S ROUTE":"RUTA DE HOY",
    "Know where you’re going before you leave.":"Sabe adónde vas antes de salir.",
    "MILEAGE":"MILLAJE",
    "Keep business miles organized.":"Mantén organizadas las millas del negocio.",
    "+ Log drive":"+ Registrar viaje",
    "This week":"Esta semana",
    "This month":"Este mes",
    "TIME TRACKING":"CONTROL DE TIEMPO",
    "See how long jobs actually take.":"Mira cuánto duran realmente los trabajos.",
    "Start timer":"Iniciar temporizador",
    "SUPPLIES":"SUMINISTROS",
    "Know what’s running low before the next job.":"Sabe qué se está acabando antes del próximo trabajo.",
    "Keep a lightweight list of cleaning supplies, current quantity, reorder level and cost.":"Lleva una lista simple de suministros, cantidad actual, nivel de reposición y costo.",
    "+ Add supply":"+ Añadir suministro",
    "Active supplies":"Suministros activos",
    "Items being tracked":"Artículos en seguimiento",
    "Low stock":"Poco inventario",
    "At or below reorder level":"En o por debajo del nivel de reposición",
    "Inventory value":"Valor del inventario",
    "Estimated from unit costs":"Estimado según costo por unidad",
    "REPORTS":"REPORTES",
    "Simple numbers that help you run the business.":"Números simples que te ayudan a manejar el negocio.",
    "Revenue this month":"Ingresos este mes",
    "Confirmed payments recorded this month.":"Pagos confirmados registrados este mes.",
    "Jobs completed":"Trabajos completados",
    "No completed jobs yet.":"Todavía no hay trabajos completados.",
    "Business miles":"Millas del negocio",
    "Tracked mileage this month.":"Millaje registrado este mes.",
    "Work hours":"Horas trabajadas",
    "Tracked team time this month.":"Tiempo del equipo registrado este mes.",
    "SERVICES + ADD-ONS":"SERVICIOS + EXTRAS",
    "Set pricing and duration once.":"Configura precio y duración una sola vez.",
    "+ Add add-on":"+ Añadir extra",
    "+ Add service":"+ Añadir servicio",
    "TEAM":"EQUIPO",
    "Assign the right person to the right job.":"Asigna la persona correcta al trabajo correcto.",
    "Workers use a private no-password link. Admin access stays separate.":"Los trabajadores usan un link privado sin contraseña. El acceso Admin se mantiene separado.",
    "Invite Admin":"Invitar Admin",
    "+ Add team profile":"+ Añadir trabajador",
    "OWNER ONLY":"SOLO OWNER",
    "Workers do not need passwords":"Los trabajadores no necesitan contraseñas",
    "Create the worker profile, assign jobs, then use Share worker link on that person’s card. The link only opens their assigned work.":"Crea el perfil del trabajador, asígnale trabajos y luego usa Compartir link del trabajador. El link solo abre su trabajo asignado.",
    "Invite an Admin →":"Invitar un Admin →",
    "SETTINGS":"AJUSTES",
    "Your business rules live here.":"Aquí viven las reglas de tu negocio.",
    "Business profile":"Perfil del negocio",
    "Business name":"Nombre del negocio",
    "Booking rules":"Reglas de reserva",
    "Contact + payments":"Contacto + pagos",
    "Client payment methods":"Métodos de pago del cliente",
    "Automatic client emails":"Correos automáticos al cliente",
    "Quote review · Service confirmation · Invoice":"Cotización en revisión · Confirmación de servicio · Factura",
    "Replies go to":"Las respuestas llegan a",
    "Business login email":"Correo de acceso del negocio",
    "App access":"Acceso a la app",
    "Manage teammates from Team or Owner Admin.":"Administra el equipo desde Equipo o Admin del Owner.",
    "HELP & FAQ":"AYUDA Y PREGUNTAS",
    "Quick help without the guesswork.":"Ayuda rápida y clara.",
    "Install the app on your phone, share access with your team, and find answers to the most common questions.":"Instala la app en tu teléfono, comparte acceso con tu equipo y encuentra respuestas a las preguntas más comunes.",
    "IPHONE":"IPHONE",
    "Put the app on your Home Screen":"Pon la app en tu pantalla de inicio",
    "Open the app in Safari.":"Abre la app en Safari.",
    "Tap the Share button.":"Toca el botón Compartir.",
    "Scroll and tap Add to Home Screen.":"Desliza y toca Añadir a pantalla de inicio.",
    "Tap Add.":"Toca Añadir.",
    "It will open from your Home Screen like an app.":"Se abrirá desde tu pantalla de inicio como una app.",
    "ANDROID":"ANDROID",
    "Add the app to your phone":"Añade la app a tu teléfono",
    "Open the app in Chrome.":"Abre la app en Chrome.",
    "Tap the ⋮ menu.":"Toca el menú ⋮.",
    "Tap Install app or Add to Home screen.":"Toca Instalar app o Añadir a pantalla de inicio.",
    "Confirm Install.":"Confirma Instalar.",
    "SHARE ACCESS":"COMPARTIR ACCESO",
    "Worker link or Admin invite":"Link de trabajador o invitación Admin",
    "ACCESS LEVELS":"NIVELES DE ACCESO",
    "Who can see what?":"¿Quién puede ver qué?",
    "Owner":"Owner",
    "Admin":"Admin",
    "Worker":"Trabajador",
    "Everything, including billing, permissions, reports, integrations and Owner Admin.":"Todo, incluyendo facturación, permisos, reportes, integraciones y Admin del Owner.",
    "Clients, jobs, quotes, invoices, services and day-to-day business operations.":"Clientes, trabajos, cotizaciones, facturas, servicios y operaciones diarias del negocio.",
    "No password. Only assigned jobs, route/address, job status, time tracking, mileage and the client contact needed for that job.":"Sin contraseña. Solo trabajos asignados, ruta/dirección, estado del trabajo, tiempo, millaje y contacto necesario del cliente.",
    "FAQ":"PREGUNTAS FRECUENTES",
    "How do I share the app with a worker?":"¿Cómo comparto la app con un trabajador?",
    "Can a worker see my revenue or billing?":"¿Puede un trabajador ver mis ingresos o facturación?",
    "What happens when a quote is accepted?":"¿Qué pasa cuando se acepta una cotización?",
    "Can clients book without creating an account?":"¿Pueden reservar los clientes sin crear una cuenta?",
    "How do I remove someone’s access?":"¿Cómo elimino el acceso de alguien?",
    "How do owners and admins sign in?":"¿Cómo entran los owners y admins?",
    "PLATFORM ADMIN":"ADMIN DE PLATAFORMA",
    "Launch Era App Admin Hub":"Panel Admin de The Launch Era",
    "Customers, subscriptions and product visits. Internal admin activity is excluded.":"Clientes, suscripciones y visitas del producto. La actividad interna de admin está excluida.",
    "Internal only":"Solo interno",
    "Customers":"Clientes",
    "Trials":"Pruebas",
    "Active subscribers":"Suscriptores activos",
    "Visits · 30 days":"Visitas · 30 días",
    "Unique visitors · 30 days":"Visitantes únicos · 30 días",
    "APP CUSTOMERS":"CLIENTES DE LA APP",
    "Who signed up / bought":"Quién se registró / compró",
    "RECENT ACTIVITY":"ACTIVIDAD RECIENTE",
    "App visits":"Visitas de la app",
    "Billing, access, permissions, integrations and sensitive business controls stay with the owner.":"Facturación, acceso, permisos, integraciones y controles sensibles quedan con el owner.",
    "ACCESS + PERMISSIONS":"ACCESO + PERMISOS",
    "Who can enter this workspace":"Quién puede entrar a este espacio",
    "+ Invite teammate":"+ Invitar Admin",
    "PLAN + BILLING":"PLAN + FACTURACIÓN",
    "Subscription":"Suscripción",
    "Status":"Estado",
    "Trial ends":"La prueba termina",
    "30 days":"30 días",
    "After trial":"Después de la prueba",
    "SECURITY":"SEGURIDAD",
    "Protected controls":"Controles protegidos",
    "Workspace ownership":"Propiedad del espacio",
    "Cannot be changed by Admin or Worker.":"No puede cambiarlo un Admin ni un Trabajador.",
    "Permissions":"Permisos",
    "Only the owner can promote, demote or remove access.":"Solo el owner puede cambiar roles o eliminar accesos.",
    "Data protection":"Protección de datos",
    "Business records are isolated by account permissions.":"Los datos de cada negocio están aislados por permisos de cuenta.",
    "INTEGRATIONS":"INTEGRACIONES",
    "Private connections":"Conexiones privadas",
    "App subscription":"Suscripción de la app",
    "Subscription access is managed by The Launch Era.":"El acceso a la suscripción lo administra The Launch Era.",
    "Email + automations":"Correo + automatizaciones",
    "Credentials and connection settings stay hidden from teammates.":"Las credenciales y conexiones permanecen ocultas para el equipo.",
    "QUICK ADD":"AÑADIR",
    "Create or update a business record.":"Crea o actualiza un registro del negocio.",
    "Cancel":"Cancelar",
    "Save changes":"Guardar cambios",
    "Add lead":"Añadir lead",
    "Add worker":"Añadir trabajador",
    "Edit":"Editar",
    "Archive":"Archivar",
    "Restore":"Restaurar",
    "Deactivate":"Desactivar",
    "Activate":"Activar",
    "Approve":"Aprobar",
    "Decline":"Rechazar",
    "Record payment":"Registrar pago",
    "Mark sent":"Marcar como enviada",
    "Cash":"Efectivo",
    "Check":"Cheque",
    "Zelle":"Zelle",
    "Loading…":"Cargando…",
    "Saving…":"Guardando…",
    "Sending…":"Enviando…",
    "Creating…":"Creando…",
    "Running":"Activo",
    "Complete":"Completo",
    "Completed":"Completado",
    "scheduled":"programado",
    "requested":"solicitado",
    "draft":"borrador",
    "sent":"enviado",
    "accepted":"aceptado",
    "declined":"rechazado",
    "paid":"pagado",
    "partial":"parcial",
    "overdue":"vencida",
    "active":"activo",
    "trial":"prueba",
    "past_due":"vencido",
    "canceled":"cancelado",
    "expired":"expirado"
  };

  const patterns=[
    [/^(\d+) new$/i,(m,n)=>`${n} nuevas`],
    [/^(\d+) completed$/i,(m,n)=>`${n} completados`],
    [/^(\d+) booking request(s)?$/i,(m,n)=>`${n} solicitud${n==="1"?"":"es"} de reserva`],
    [/^Due (.+)$/i,(m,d)=>`Vence ${d}`],
    [/^(\d+(?:\.\d+)?) mi today$/i,(m,n)=>`${n} mi hoy`],
    [/^(\d+(?:\.\d+)?) work hours$/i,(m,n)=>`${n} horas trabajadas`],
    [/^(\d+) stop(s)? scheduled today$/i,(m,n)=>`${n} parada${n==="1"?"":"s"} programada${n==="1"?"":"s"} hoy`]
  ];

  const originals=new WeakMap();
  const attrOriginals=new WeakMap();
  let applying=false;
  let lang=localStorage.getItem(STORAGE_KEY) || ((navigator.language||"").toLowerCase().startsWith("es") ? "es" : "en");

  function translateString(value){
    const key=String(value||"").trim();
    if(!key) return value;
    if(exact[key]) return exact[key];
    for(const [re,fn] of patterns){
      const match=key.match(re);
      if(match) return fn(...match);
    }
    return key;
  }

  function setTextNode(node){
    if(!originals.has(node)) originals.set(node,node.nodeValue);
    const original=originals.get(node);
    if(lang==="en"){
      if(node.nodeValue!==original) node.nodeValue=original;
      return;
    }
    const leading=(original.match(/^\s*/)||[""])[0];
    const trailing=(original.match(/\s*$/)||[""])[0];
    const core=original.trim();
    const translated=translateString(core);
    node.nodeValue=leading+translated+trailing;
  }

  function setAttrs(el){
    if(!(el instanceof Element)) return;
    let saved=attrOriginals.get(el);
    if(!saved){saved={};attrOriginals.set(el,saved);}
    for(const attr of ["placeholder","aria-label","title"]){
      if(!el.hasAttribute(attr)) continue;
      if(!(attr in saved)) saved[attr]=el.getAttribute(attr);
      el.setAttribute(attr,lang==="es"?translateString(saved[attr]):saved[attr]);
    }
  }

  function translateTree(root){
    if(!root) return;
    if(root.nodeType===Node.TEXT_NODE){setTextNode(root);return;}
    if(root.nodeType!==Node.ELEMENT_NODE && root.nodeType!==Node.DOCUMENT_NODE) return;
    if(root.nodeType===Node.ELEMENT_NODE) setAttrs(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    let node;
    while((node=walker.nextNode())){
      if(node.nodeType===Node.TEXT_NODE) setTextNode(node);
      else setAttrs(node);
    }
  }

  function updateToggles(){
    document.documentElement.lang=lang;
    document.querySelectorAll("[data-language-toggle],#languageBtn").forEach(btn=>{
      btn.textContent=lang==="es"?"EN":"ES";
      btn.setAttribute("aria-label",lang==="es"?"Switch to English":"Cambiar a español");
    });
  }

  function applyLanguage(next=lang){
    lang=next==="es"?"es":"en";
    localStorage.setItem(STORAGE_KEY,lang);
    applying=true;
    translateTree(document.body);
    updateToggles();
    applying=false;
    window.dispatchEvent(new CustomEvent("tle:languagechange",{detail:{language:lang}}));
  }

  function toggle(){
    applyLanguage(lang==="es"?"en":"es");
  }

  document.addEventListener("click",e=>{
    const btn=e.target.closest("[data-language-toggle],#languageBtn");
    if(!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toggle();
  },true);

  const observer=new MutationObserver(mutations=>{
    if(applying||lang!=="es") return;
    applying=true;
    for(const mutation of mutations){
      if(mutation.type==="characterData") setTextNode(mutation.target);
      mutation.addedNodes?.forEach(n=>translateTree(n));
    }
    updateToggles();
    applying=false;
  });

  function init(){
    applyLanguage(lang);
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:false});
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();

  window.TLE_I18N={
    get language(){return lang;},
    setLanguage:applyLanguage,
    toggle,
    t(value){return lang==="es"?translateString(value):value;}
  };
})();
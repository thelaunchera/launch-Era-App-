(()=>{
  const STORAGE_KEY="tle_language";
  const exact={
    "Client view":"Vista cliente",
    "Booking":"Reservas",
    "Add Instagram, Facebook and your review link in Business Profile.":"Añade Instagram, Facebook y tu enlace de reseñas en el perfil del negocio.",
    "Open reviews":"Abrir reseñas",
    "Add link":"Añadir link",
    "Reviews":"Reseñas",
    "These links appear on your private Dashboard for one-tap access. They do not post automatically.":"Estos enlaces aparecen en tu Dashboard privado para acceso rápido. No publican automáticamente.",
    "Add Instagram and Facebook in Business Profile.":"Añade Instagram y Facebook en el perfil del negocio.",
    "Keep your client-facing links close while you run the day.":"Ten tus enlaces para clientes a mano mientras manejas el día.",
    "Open page":"Abrir página",
    "Open profile":"Abrir perfil",
    "Open client view":"Abrir vista del cliente",
    "Add page":"Añadir página",
    "Add profile":"Añadir perfil",
    "Booking page":"Página de reservas",
    "Facebook":"Facebook",
    "Add your social profiles in Business Profile.":"Añade tus redes en el perfil del negocio.",
    "Your business, one tap away.":"Tu negocio, a un toque.",
    "ONLINE PRESENCE":"PRESENCIA ONLINE",
    "Actual":"Real",
    "Planned":"Planeado",
    "Type":"Tipo",
    "Job":"Trabajo",
    "Miles":"Millas",
    "Resend quote":"Reenviar cotización",
    "Send quote":"Enviar cotización",
    "Confirm payment":"Confirmar pago",
    "Add payment":"Añadir pago",
    "Send invoice":"Enviar factura",
    "Resolve dispute":"Resolver disputa",
    "Customer chose":"Cliente eligió",
    "Overdue":"Vencida",
    "No client":"Sin cliente",
    "No due date":"Sin fecha de vencimiento",
    "Amount":"Monto",
    "Client":"Cliente",
    "Delete quote":"Borrar cotización",
    "Delete invoice":"Borrar factura",
    "Delete client":"Borrar cliente",
    "Delete lead":"Borrar lead",
    "Quote":"Cotización",
    "Source":"Fuente",
    "Deleted":"Borrado",
    "Deleting…":"Borrando…",
    "Delete":"Borrar",
    "Submitting your decline…":"Enviando rechazo…",
    "Submitting your acceptance…":"Enviando aceptación…",
    "Choose Accept or Decline, then submit your response.":"Elige Aceptar o Rechazar y luego envía tu respuesta.",
    "Decline selected. Tap Submit quote to confirm.":"Rechazar seleccionado. Toca Enviar cotización para confirmar.",
    "Accept selected. Tap Submit quote to confirm.":"Aceptar seleccionado. Toca Enviar cotización para confirmar.",
    "Submitted ✓":"Enviado ✓",
    "Submitting your payment choice…":"Enviando tu forma de pago…",
    "Choose a payment method, then submit your choice.":"Elige una forma de pago y luego envía tu opción.",
    
    "Selected: Cash. Tap Submit invoice to send this choice.":"Seleccionado: Efectivo. Toca Enviar factura para enviar esta opción.",
    "Selected: Check. Tap Submit invoice to send this choice.":"Seleccionado: Cheque. Toca Enviar factura para enviar esta opción.",
    "Submitting only sends your payment choice. The business will confirm the payment in the app after it is actually received. Only then will you receive a payment confirmation email.":"Enviar solo comunica tu forma de pago. El negocio confirmará el pago en la app cuando realmente lo reciba. Solo entonces recibirás el correo de confirmación.",
    "Choose one option, then submit it to the business.":"Elige una opción y envíala al negocio.",
    "Submit quote":"Enviar cotización",
    "Submit invoice":"Enviar factura",
    "Paid app activations will appear here with the customer email.":"Las activaciones pagadas aparecerán aquí con el correo del cliente.",
    "No purchases yet.":"Aún no hay compras.",
    "New authenticated app opens will appear here.":"Las nuevas aperturas autenticadas aparecerán aquí.",
    "No customer logins yet.":"Aún no hay inicios de sesión de clientes.",
    "Anonymous visitor":"Visitante anónimo",
    "Login":"Inicio de sesión",
    "Cleaning business":"Negocio de limpieza",
    "Unknown email":"Correo desconocido",
    "Purchases + activations":"Compras + activaciones",
    "PURCHASES":"COMPRAS",
    "Recent visits":"Visitas recientes",
    "REAL VISITOR ACTIVITY":"VISITAS REALES",
    "Real visitors only · internal activity excluded":"Solo visitantes reales · actividad interna excluida",
    "INTERNAL ACTIVITY":"ACTIVIDAD INTERNA",
    "My / internal views":"Mis vistas / internas",
    "Not counted in real visits":"No se cuentan en las visitas reales",
    "View activity":"Ver actividad",
    "Clear":"Limpiar",
    "No internal activity to clear.":"No hay actividad interna para limpiar.",
    "Your own activity stays separate from real visitor metrics.":"Tu actividad permanece separada de las métricas de visitantes reales.",
    "VISIT ACTIVITY":"VISITAS",
    "Recent logins":"Inicios recientes",
    "LOGIN ACTIVITY":"INICIOS DE SESIÓN",
    "One moment…":"Un momento…",
    "Checking your schedule and local weather.":"Revisando tu agenda y el clima de tu zona.",
    "Getting your day ready…":"Preparando tu día…",
    "unique":"únicos",
    "New external visits will appear here.":"Las nuevas visitas externas aparecerán aquí.",
    "No location data yet.":"Aún no hay datos de ubicación.",
    "Top states":"Estados principales",
    "VISITOR LOCATION":"UBICACIÓN",
    "You still have full access. When your free period ends, you can continue for $5.99/month.":"Todavía tienes acceso completo. Al terminar la prueba, puedes continuar por $5.99/mes.",
    "Your free access ends in 3 days":"Tu acceso gratis termina en 3 días",
    "FREE ACCESS":"ACCESO GRATIS",
    "48 hours":"48 horas",
    "24 hours":"24 horas",
    "12 hours":"12 horas",
    "2 hours":"2 horas",
    "60 min":"60 minutos",
    "45 min":"45 minutos",
    "30 min":"30 minutos",
    "15 min":"15 minutos",
    "Next stop":"Próxima parada",
    "Address not added":"Sin dirección",
    "Business drive":"Viaje de trabajo",
    "Waiting for response":"Esperando respuesta",
    "outstanding":"pendiente",
    "Pending":"Pendiente",
    "Confirmed":"Confirmado",
    "Lost":"Perdido",
    "Booked":"Reservado",
    "Quoted":"Cotizado",
    "Qualified":"Calificado",
    "Contacted":"Contactado",
    "New":"Nuevo",
    "Void":"Anulada",
    "Canceled":"Cancelado",
    "Scheduled":"Programado",
    "In progress":"En progreso",
    "Declined":"Rechazada",
    "Accepted":"Aceptada",
    "Sent":"Enviada",
    "Draft":"Borrador",
    "Requested":"Solicitada",
    "Your scheduled jobs will appear here.":"Tus próximos trabajos aparecerán aquí.",
    "No jobs today.":"No hay trabajos hoy.",
    "Cleaning job":"Trabajo de limpieza",
    "Nothing scheduled":"Sin trabajos hoy",
    "Good evening":"Buenas noches",
    "Good afternoon":"Buenas tardes",
    "Good morning":"Buenos días",
    "Change language":"Cambiar idioma",
    "Español":"Español",
    "Privacy Policy":"Política de Privacidad",
    "and acknowledge our":"y reconoces nuestra",
    "By creating an account, you agree to our":"Al crear una cuenta, aceptas nuestros",
    "© 2026 The Launch Era":"© 2026 The Launch Era",
    "Could not send feedback.":"No se pudo enviar el feedback.",
    "Tell us a little more before sending.":"Cuéntanos un poco más antes de enviarlo.",
    "Sign in to send feedback":"Inicia sesión para enviar feedback",
    "Feedback sent. Thank you!":"Feedback enviado. ¡Gracias!",
    "A short description is enough.":"Una descripción corta es suficiente.",
    "Tell us what happened or what you need":"Cuéntanos qué pasó o qué necesitas",
    "Something else":"Otra cosa",
    "I have a question":"Tengo una pregunta",
    "I have an idea":"Tengo una idea",
    "Something is not working":"Algo no está funcionando",
    "Feedback type":"Tipo de feedback",
    "Send a quick bug report, idea or question. Your business email is included so we can follow up if needed.":"Envía un reporte corto de un error, una idea o una pregunta. Incluimos el correo de tu negocio para poder responderte si hace falta.",
    "Help us improve the Cleaning App":"Ayúdanos a mejorar la Cleaning App",
    "FEEDBACK":"FEEDBACK",
    "Terms for using The Launch Era":"Términos para usar The Launch Era",
    "How your information is handled":"Cómo se maneja tu información",
    "Send feedback":"Enviar feedback",
    "Need help or want to tell us something?":"¿Necesitas ayuda o quieres contarnos algo?",
    "SUPPORT":"SOPORTE",
    "Feedback":"Feedback",
    "Help":"Ayuda",
    "Instagram":"Instagram",
    "Share this app":"Comparte esta app",
    "App shared":"App compartida",
    "App link copied":"Link de la app copiado",
    "Terms":"Términos",
    "Privacy":"Privacidad",
    "The first-time tips explain each section in a few words. Restart them anytime without changing your business data.":"Los tips de primera vez explican cada sección en pocas palabras. Puedes reiniciarlos cuando quieras sin cambiar los datos de tu negocio.",
    "Restart tour":"Reiniciar recorrido",
    "Need the walkthrough again?":"¿Necesitas ver la guía otra vez?",
    "GUIDED TOUR":"RECORRIDO GUIADO",
    "Enter a valid email.":"Escribe un correo válido.",
    "Enter your email first.":"Primero escribe tu correo.",
    "Enter the 6-digit code.":"Escribe el código de 6 dígitos.",
    "That code could not be verified.":"No se pudo verificar ese código.",
    "Could not send a new code.":"No se pudo enviar un código nuevo.",
    "Could not send the access code.":"No se pudo enviar el código de acceso.",
    "A code was already sent. Check your email.":"Ya se envió un código. Revisa tu correo.",
    "New code sent. Check your email.":"Nuevo código enviado. Revisa tu correo.",
    "Code sent. Check your email.":"Código enviado. Revisa tu correo.",
    "Checking your code…":"Verificando tu código…",
    "Checking…":"Verificando…",
    "Sending your access code…":"Enviando tu código de acceso…",
    "Sending code…":"Enviando código…",
    "Use a different email":"Usar otro correo",
    "Send a new code":"Enviar un código nuevo",
    "Open my app":"Abrir mi app",
    "6-digit code":"Código de 6 dígitos",
    "Enter the 6-digit code sent to your email.":"Escribe el código de 6 dígitos enviado a tu correo.",
    "Secure owner access. No password needed.":"Acceso seguro del dueño. No necesitas contraseña.",
    "Hawaii Time":"Hora de Hawái",
    "Alaska Time":"Hora de Alaska",
    "Arizona Time":"Hora de Arizona",
    "City, county or service radius":"Ciudad, condado o radio de servicio",
    "Owner access required.":"Se requiere acceso de Dueño.",
    "Not set":"Sin configurar",
    "Owner or Admin access required.":"Se requiere acceso de Dueño o Admin.",
    "Business email is required.":"El correo del negocio es obligatorio.",
    "Business name is required.":"El nombre del negocio es obligatorio.",
    "Save business details":"Guardar detalles del negocio",
    "Pacific Time":"Hora del Pacífico",
    "Mountain Time":"Hora de la Montaña",
    "Central Time":"Hora Central",
    "Eastern Time":"Hora del Este",
    "Update the company information used across your workspace and client-facing flows.":"Actualiza la información de la compañía que se usa dentro de la app y en las funciones para clientes.",
    "Default language":"Idioma predeterminado",
    "Time zone":"Zona horaria",
    "Business email":"Correo del negocio",
    "Edit business details":"Editar detalles del negocio",
    "COMPANY DETAILS":"DETALLES DE LA COMPAÑÍA",
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
    "No overdue invoices, sent quotes, or new booking requests need attention.":"Nada pendiente por ahora.",
    "THIS WEEK":"ESTA SEMANA",
    "No completed work logged yet.":"Aún no hay trabajos completados.",
    "See reports →":"Ver reportes →",
    "Booking Center":"Reservas",
    "Leads":"Leads",
    "Clients":"Clientes",
    "Calendar + Jobs":"Calendario",
    "Quotes":"Cotizaciones",
    "Invoices":"Facturas",
    "Operations":"Operaciones",
    "Today's Route":"Ruta",
    "Mileage":"Millaje",
    "Time Tracking":"Tiempo",
    "Supplies":"Suministros",
    "Owner Reports":"Reportes",
    "Business":"Negocio",
    "Services + Add-ons":"Servicios",
    "Team":"Equipo",
    "Settings":"Ajustes",
    "Owner Admin":"Admin",
    "Platform Admin":"Plataforma",
    "Help & FAQ":"Ayuda",
    "30-day trial":"Prueba de 30 días",
    "Full access":"Acceso completo",
    "Then $5.99/month. No card required to start.":"Luego $5.99/mes.",
    "Sign out":"Cerrar sesión",
    "+ Add New":"+ Nuevo",
    "BOOKING CENTER":"RESERVAS",
    "Your public front door.":"Tus reservas en un solo lugar.",
    "Control what clients can book, when they can book it, and where each request goes next.":"Define servicios, horarios y solicitudes.",
    "Copy booking link":"Copiar link de reservas",
    "PUBLIC LINKS":"ENLACES",
    "Share anywhere":"Compártelos donde quieras",
    "Quote request link":"Link para cotización",
    "Open":"Abrir",
    "Copy":"Copiar",
    "AVAILABILITY":"DISPONIBILIDAD",
    "Only show real openings":"Solo horarios disponibles",
    "Save":"Guardar",
    "Travel buffer":"Tiempo entre servicios",
    "No buffer":"Sin tiempo extra",
    "Minimum booking notice":"Aviso mínimo",
    "Same-day allowed":"Permitir el mismo día",
    "If a day is off, clients will never see slots on that day. Service duration, add-ons, travel buffer, scheduled jobs and pending requests are all checked before a time is shown.":"Los clientes solo verán horarios disponibles.",
    "BOOKING REQUESTS":"SOLICITUDES",
    "Requests waiting for review":"Por revisar",
    "BOOKABLE SERVICES":"SERVICIOS",
    "Services + add-ons shown to clients":"Lo que ve el cliente",
    "Edit services →":"Editar servicios →",
    "CLIENT EXPERIENCE":"CLIENTE",
    "What the customer sees":"Vista del cliente",
    "No account required":"Sin cuenta",
    "Choose service":"Elegir servicio",
    "Pick available time":"Elegir hora",
    "Enter details":"Datos",
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
    "Likely human visits · 30 days":"Visitas probablemente humanas · 30 días",
    "Internal + suspicious traffic excluded":"Actividad interna + tráfico sospechoso excluidos",
    "Likely human visitors · 30 days":"Visitantes probablemente humanos · 30 días",
    "Filtered unique visitor IDs":"IDs únicos filtrados",
    "Filtered traffic · 30 days":"Tráfico filtrado · 30 días",
    "Suspected bots / automated traffic":"Bots sospechosos / tráfico automatizado",
    "Likely human states":"Estados con visitas probablemente humanas",
    "Suspicious traffic excluded":"Tráfico sospechoso excluido",
    "LIKELY HUMAN ACTIVITY":"ACTIVIDAD PROBABLEMENTE HUMANA",
    "FILTERED TRAFFIC":"TRÁFICO FILTRADO",
    "Suspected bots / automation":"Bots sospechosos / automatización",
    "Automatically excluded from visitor metrics":"Excluido automáticamente de las métricas de visitantes",
    "Filtered":"Filtrado",
    "No suspicious traffic detected.":"No se detectó tráfico sospechoso.",
    "Nothing is currently being filtered from visitor metrics.":"Actualmente no se está filtrando nada de las métricas de visitantes.",
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
    "Email connections":"Conexiones de correo",
    "Email delivery and private connection settings stay hidden from teammates.":"La entrega de correos y las conexiones privadas permanecen ocultas para el equipo.",
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
    "Cash":"Efectivo","Bank transfer":"Transferencia bancaria","Other":"Otro",
    "Check":"Cheque",
    "Other":"Otro",
    "Country":"País",
    "Currency":"Moneda",
    "Distance":"Distancia",
    "Kilometers":"Kilómetros",
    "Business distance":"Distancia del negocio",
    "Log distance":"Registrar distancia",
    
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


  const extra={
    pt:{
      "Sign in":"Entrar","Create account":"Criar conta","Email":"E-mail","Password":"Senha",
      "Forgot password?":"Esqueceu a senha?","Already have an account? Sign in":"Já tem uma conta? Entre",
      "Create your cleaning business account.":"Crie a conta da sua empresa de limpeza.",
      "Open your cleaning business workspace.":"Abra o espaço de trabalho da sua empresa de limpeza.",
      "Business name":"Nome da empresa","Phone":"Telefone","Service area":"Área de atendimento",
      "Create my workspace":"Criar meu espaço","FIRST SETUP":"CONFIGURAÇÃO INICIAL",
      "Tell me about your business.":"Conte um pouco sobre sua empresa.",
      "Today":"Hoje","Booking Center":"Reservas","Leads":"Leads","Clients":"Clientes",
      "Calendar + Jobs":"Calendário + trabalhos","Quotes":"Orçamentos","Invoices":"Faturas",
      "Today's Route":"Rota de hoje","Mileage":"Quilometragem","Time Tracking":"Controle de tempo",
      "Supplies":"Materiais","Owner Reports":"Relatórios","Services + Add-ons":"Serviços + extras",
      "Team":"Equipe","Settings":"Configurações","Owner Admin":"Admin do proprietário",
      "Help & FAQ":"Ajuda e FAQ","Log out":"Sair","Change language":"Mudar idioma",
      "Good morning":"Bom dia","Good afternoon":"Boa tarde","Good evening":"Boa noite",
      "Booking requests":"Solicitações de reserva","Open quotes":"Orçamentos abertos",
      "Outstanding invoices":"Faturas pendentes","Today's jobs":"Trabalhos de hoje",
      "Add client":"Adicionar cliente","Create quote":"Criar orçamento","Create invoice":"Criar fatura",
      "Log mileage":"Registrar quilometragem","Track time":"Registrar tempo",
      "Nothing urgent.":"Nada urgente.","No jobs today.":"Nenhum trabalho hoje.",
      "Booking page":"Página de reservas","Open page":"Abrir página","Open profile":"Abrir perfil",
      "Privacy":"Privacidade","Terms":"Termos","Share this app":"Compartilhar este app",
      "Feedback":"Feedback","Help":"Ajuda","Restart tour":"Reiniciar tour",
      "Business email":"E-mail da empresa","Default language":"Idioma padrão","Time zone":"Fuso horário",
      "Edit business details":"Editar dados da empresa","Save business details":"Salvar dados da empresa",
      "Client payment methods":"Formas de pagamento do cliente","Cash":"Dinheiro","Check":"Cheque",
      "Other":"Outro","Country":"País","Currency":"Moeda","Distance":"Distância","Kilometers":"Quilômetros","Business distance":"Distância do negócio","Log distance":"Registrar distância","Payment methods":"Formas de pagamento",
      "Guest Employee Access":"Acesso de funcionário convidado","GUEST EMPLOYEE ACCESS":"ACESSO DE FUNCIONÁRIO CONVIDADO",
      "Welcome, guest 👋":"Bem-vindo, convidado 👋","MY WORK":"MEU TRABALHO",
      "Assigned jobs":"Trabalhos atribuídos","Route + address":"Rota + endereço","Job status":"Status do trabalho",
      "Messages":"Mensagens","MESSAGE CENTER":"CENTRAL DE MENSAGENS","Send message":"Enviar mensagem",
      "Message your admin":"Fale com o administrador","Message employee":"Enviar mensagem ao funcionário",
      "No messages yet.":"Ainda não há mensagens.","Type a message…":"Digite uma mensagem…",
      "Worker Access":"Acesso do funcionário","Exit":"Sair","LIMITED ACCESS":"ACESSO LIMITADO",
      "What you can use":"O que você pode usar",
      "BOOK A CLEANING":"AGENDAR LIMPEZA","REQUEST A QUOTE":"PEDIR ORÇAMENTO",
      "Choose your service and send your request.":"Escolha o serviço e envie sua solicitação.",
      "Cleaning service":"Serviço de limpeza","Service":"Serviço","Choose a service":"Escolha um serviço",
      "Add-ons":"Extras","Date":"Data","Time":"Hora","Preferred time":"Horário preferido",
      "Available times":"Horários disponíveis","Name":"Nome","Preferred contact":"Contato preferido",
      "Text":"SMS","WhatsApp":"WhatsApp","Service address":"Endereço do serviço","Notes":"Observações",
      "Send booking request":"Enviar solicitação de reserva","Send quote request":"Enviar pedido de orçamento",
      "Request received":"Solicitação recebida","INVOICE":"FATURA","Invoice":"Fatura",
      "Subtotal":"Subtotal","Paid":"Pago","Balance due":"Saldo devido","Total":"Total",
      "Review your quote":"Revise seu orçamento","Decline":"Recusar","Accept quote":"Aceitar orçamento",
      "Submit quote":"Enviar orçamento","Submit invoice":"Enviar fatura",
      "Payment is arranged directly with the cleaning business. No card payment is collected on this page.":"O pagamento é combinado diretamente com a empresa de limpeza. Nenhum pagamento com cartão é cobrado nesta página.",
      "Business drive":"Viagem de trabalho","Miles":"Milhas","Job":"Trabalho","Type":"Tipo",
      "No mileage logged yet.":"Nenhuma quilometragem registrada ainda.","Save mileage":"Salvar quilometragem",
      "From":"De","To":"Para","Note (optional)":"Observação (opcional)","Job (optional)":"Trabalho (opcional)",
      "Português":"Português","Français":"Français","English":"English","Español":"Español",
      "Try again":"Tentar novamente","Close":"Fechar","Start tour":"Iniciar tour","Got it":"Entendi"
    },
    fr:{
      "Sign in":"Se connecter","Create account":"Créer un compte","Email":"E-mail","Password":"Mot de passe",
      "Forgot password?":"Mot de passe oublié ?","Already have an account? Sign in":"Vous avez déjà un compte ? Connectez-vous",
      "Create your cleaning business account.":"Créez le compte de votre entreprise de nettoyage.",
      "Open your cleaning business workspace.":"Ouvrez l’espace de travail de votre entreprise de nettoyage.",
      "Business name":"Nom de l’entreprise","Phone":"Téléphone","Service area":"Zone de service",
      "Create my workspace":"Créer mon espace","FIRST SETUP":"CONFIGURATION INITIALE",
      "Tell me about your business.":"Parlez-nous de votre entreprise.",
      "Today":"Aujourd’hui","Booking Center":"Réservations","Leads":"Prospects","Clients":"Clients",
      "Calendar + Jobs":"Calendrier + travaux","Quotes":"Devis","Invoices":"Factures",
      "Today's Route":"Itinéraire du jour","Mileage":"Kilométrage","Time Tracking":"Suivi du temps",
      "Supplies":"Fournitures","Owner Reports":"Rapports","Services + Add-ons":"Services + options",
      "Team":"Équipe","Settings":"Paramètres","Owner Admin":"Administration propriétaire",
      "Help & FAQ":"Aide et FAQ","Log out":"Se déconnecter","Change language":"Changer de langue",
      "Good morning":"Bonjour","Good afternoon":"Bon après-midi","Good evening":"Bonsoir",
      "Booking requests":"Demandes de réservation","Open quotes":"Devis ouverts",
      "Outstanding invoices":"Factures impayées","Today's jobs":"Travaux du jour",
      "Add client":"Ajouter un client","Create quote":"Créer un devis","Create invoice":"Créer une facture",
      "Log mileage":"Enregistrer le kilométrage","Track time":"Suivre le temps",
      "Nothing urgent.":"Rien d’urgent.","No jobs today.":"Aucun travail aujourd’hui.",
      "Booking page":"Page de réservation","Open page":"Ouvrir la page","Open profile":"Ouvrir le profil",
      "Privacy":"Confidentialité","Terms":"Conditions","Share this app":"Partager l’application",
      "Feedback":"Avis","Help":"Aide","Restart tour":"Recommencer le guide",
      "Business email":"E-mail de l’entreprise","Default language":"Langue par défaut","Time zone":"Fuseau horaire",
      "Edit business details":"Modifier les informations","Save business details":"Enregistrer les informations",
      "Client payment methods":"Modes de paiement client","Cash":"Espèces","Check":"Chèque",
      "Other":"Autre","Country":"Pays","Currency":"Devise","Distance":"Distance","Kilometers":"Kilomètres","Business distance":"Distance professionnelle","Log distance":"Enregistrer la distance","Payment methods":"Modes de paiement",
      "Guest Employee Access":"Accès employé invité","GUEST EMPLOYEE ACCESS":"ACCÈS EMPLOYÉ INVITÉ",
      "Welcome, guest 👋":"Bienvenue, invité 👋","MY WORK":"MON TRAVAIL",
      "Assigned jobs":"Travaux attribués","Route + address":"Itinéraire + adresse","Job status":"Statut du travail",
      "Messages":"Messages","MESSAGE CENTER":"CENTRE DE MESSAGES","Send message":"Envoyer le message",
      "Message your admin":"Écrire à l’administrateur","Message employee":"Écrire à l’employé",
      "No messages yet.":"Aucun message pour le moment.","Type a message…":"Écrivez un message…",
      "Worker Access":"Accès employé","Exit":"Quitter","LIMITED ACCESS":"ACCÈS LIMITÉ",
      "What you can use":"Ce que vous pouvez utiliser",
      "BOOK A CLEANING":"RÉSERVER UN NETTOYAGE","REQUEST A QUOTE":"DEMANDER UN DEVIS",
      "Choose your service and send your request.":"Choisissez votre service et envoyez votre demande.",
      "Cleaning service":"Service de nettoyage","Service":"Service","Choose a service":"Choisissez un service",
      "Add-ons":"Options","Date":"Date","Time":"Heure","Preferred time":"Heure préférée",
      "Available times":"Horaires disponibles","Name":"Nom","Preferred contact":"Contact préféré",
      "Text":"SMS","WhatsApp":"WhatsApp","Service address":"Adresse du service","Notes":"Notes",
      "Send booking request":"Envoyer la demande de réservation","Send quote request":"Envoyer la demande de devis",
      "Request received":"Demande reçue","INVOICE":"FACTURE","Invoice":"Facture",
      "Subtotal":"Sous-total","Paid":"Payé","Balance due":"Solde dû","Total":"Total",
      "Review your quote":"Vérifiez votre devis","Decline":"Refuser","Accept quote":"Accepter le devis",
      "Submit quote":"Envoyer le devis","Submit invoice":"Envoyer la facture",
      "Payment is arranged directly with the cleaning business. No card payment is collected on this page.":"Le paiement est organisé directement avec l’entreprise de nettoyage. Aucun paiement par carte n’est encaissé sur cette page.",
      "Business drive":"Déplacement professionnel","Miles":"Miles","Job":"Travail","Type":"Type",
      "No mileage logged yet.":"Aucun kilométrage enregistré.","Save mileage":"Enregistrer le kilométrage",
      "From":"De","To":"À","Note (optional)":"Note (facultatif)","Job (optional)":"Travail (facultatif)",
      "Português":"Português","Français":"Français","English":"English","Español":"Español",
      "Try again":"Réessayer","Close":"Fermer","Start tour":"Commencer le guide","Got it":"Compris"
    }
  };

  const patterns=[
    [/^Enter the 6-digit code sent to (.+)\.$/i,(m,e)=>`Escribe el código de 6 dígitos enviado a ${e}.`],
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
  const SUPPORTED=["en","es","pt","fr"];
  const browserLanguage=String(navigator.language||"en").slice(0,2).toLowerCase();
  let lang=localStorage.getItem(STORAGE_KEY) || (SUPPORTED.includes(browserLanguage)?browserLanguage:"en");

  function translateString(value){
    const key=String(value||"").trim();
    if(!key || lang==="en") return key||value;
    if(lang==="es"){
      if(exact[key]) return exact[key];
      for(const [re,fn] of patterns){
        const match=key.match(re);
        if(match) return fn(...match);
      }
      return key;
    }
    return extra[lang]?.[key]||key;
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
      el.setAttribute(attr,lang==="en"?saved[attr]:translateString(saved[attr]));
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
    const names={en:"English",es:"Español",pt:"Português",fr:"Français"};
    document.querySelectorAll("[data-language-toggle],#languageBtn").forEach(btn=>{
      if(btn.id==="languageBtn" && btn.querySelector(".top-icon")){
        const icon=btn.querySelector(".top-icon");
        const label=btn.querySelector(".top-label");
        if(icon) icon.textContent=lang.toUpperCase();
        if(label) label.textContent=names[lang]||"Language";
      }else{
        btn.textContent=lang.toUpperCase();
      }
      btn.setAttribute("aria-label","Change language");
    });
  }

  function applyLanguage(next=lang){
    lang=SUPPORTED.includes(next)?next:"en";
    localStorage.setItem(STORAGE_KEY,lang);

    // Disconnect while we rewrite text so our own translations are never
    // mistaken for fresh source content by the MutationObserver.
    observer.disconnect();
    applying=true;
    try{
      translateTree(document.body);
      updateToggles();
    }finally{
      applying=false;
      observeDom();
    }

    window.dispatchEvent(new CustomEvent("tle:languagechange",{detail:{language:lang}}));
  }

  function toggle(){
    const index=SUPPORTED.indexOf(lang);
    applyLanguage(SUPPORTED[(index+1)%SUPPORTED.length]);
  }

  document.addEventListener("click",e=>{
    const btn=e.target.closest("[data-language-toggle],#languageBtn");
    if(!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toggle();
  },true);

  const observer=new MutationObserver(mutations=>{
    if(applying) return;

    // Avoid observing the translations that this callback itself writes.
    observer.disconnect();
    applying=true;
    try{
    for(const mutation of mutations){
      if(mutation.type==="characterData"){
        // App-rendered text can change after the first translation (page titles,
        // counters, modal copy, statuses). Treat that new English value as the
        // fresh source string before translating it.
        originals.set(mutation.target,mutation.target.nodeValue);
        if(lang!=="en") setTextNode(mutation.target);
      }

      if(mutation.type==="attributes"){
        const el=mutation.target;
        if(el instanceof Element){
          let saved=attrOriginals.get(el);
          if(!saved){saved={};attrOriginals.set(el,saved);}
          const attr=mutation.attributeName;
          if(["placeholder","aria-label","title"].includes(attr)){
            saved[attr]=el.getAttribute(attr);
            if(lang!=="en") setAttrs(el);
          }
        }
      }

      mutation.addedNodes?.forEach(n=>{
        // New nodes are always captured from their current English source text,
        // then translated immediately when Spanish is active.
        translateTree(n);
      });
    }
    updateToggles();
    }finally{
      applying=false;
      observeDom();
    }
  });

  function observeDom(){
    if(!document.body) return;
    observer.observe(document.body,{
      subtree:true,
      childList:true,
      characterData:true,
      attributes:true,
      attributeFilter:["placeholder","aria-label","title"]
    });
  }

  function init(){
    applyLanguage(lang);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();

  window.TLE_I18N={
    get language(){return lang;},
    setLanguage:applyLanguage,
    toggle,
    t(value){return lang==="en"?value:translateString(value);}
  };
})();
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
    "Online presence":"Présence en ligne",
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
    "Purchases":"Achats",
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
    "Logins":"Connexions",
    "LOGIN ACTIVITY":"INICIOS DE SESIÓN",
    "One moment…":"Un momento…",
    "Checking your schedule and local weather.":"Revisando tu agenda y el clima de tu zona.",
    "Today":"Aujourd’hui",
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
    "Feedback":"Retour",
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
    "Guided tour":"Visite guidée",
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
    "Customer communication language":"Idioma de comunicación con clientes",
    "Controls the language you see inside the app.":"Controla el idioma que ves dentro de la app.",
    "Default for customer emails, quotes, invoices, booking confirmations, reminders and follow-ups. A customer can keep their own preferred language.":"Idioma predeterminado para correos, cotizaciones, facturas, confirmaciones de reserva, recordatorios y seguimientos. Cada cliente puede conservar su idioma preferido.",
    "Client email language":"Idioma de correos al cliente",
    "Controls the language you see inside the app.":"Controla el idioma que ves dentro de la app.",
    "Used for automatic quote, booking, invoice, payment and follow-up emails. It can be different from your app language.":"Se usa para los correos automáticos de cotización, reserva, factura, pago y seguimiento. Puede ser diferente del idioma de tu app.",
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
    "Time tracking":"Suivi du temps",
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
    "Booking requests":"Demandes de réservation",
    "Waiting for review":"Esperando revisión",
    "TODAY":"HOY",
    "Schedule + route":"Horario + ruta",
    "Full calendar →":"Calendario completo →",
    "QUICK ACTIONS":"ACCIONES RÁPIDAS",
    "Quick actions":"Actions rapides",
    "Add client":"Añadir cliente",
    "Create quote":"Crear cotización",
    "Booking link":"Link de reservas",
    "Create invoice":"Crear factura",
    "Log mileage":"Registrar millaje",
    "Track time":"Registrar tiempo",
    "NEEDS ATTENTION":"NECESITA ATENCIÓN",
    "Needs attention":"À surveiller",
    "Nothing urgent.":"Nada urgente.",
    "No overdue invoices, sent quotes, or new booking requests need attention.":"Nada pendiente por ahora.",
    "THIS WEEK":"ESTA SEMANA",
    "No completed work logged yet.":"Aún no hay trabajos completados.",
    "See reports →":"Ver reportes →",
    "Booking Center":"Reservas",
    "Leads":"Leads",
    "Clients":"Clientes",
    "Calendar + Jobs":"Calendario",
    "Quotes":"Devis",
    "Invoices":"Factures",
    "Operations":"Operaciones",
    "Today's Route":"Ruta",
    "Mileage":"Millaje",
    "Time Tracking":"Tiempo",
    "Supplies":"Fournitures",
    "Owner Reports":"Reportes",
    "Business":"Negocio",
    "Services + Add-ons":"Servicios",
    "Team":"Équipe",
    "Settings":"Ajustes",
    "Owner settings":"Paramètres owner",
    "Platform Admin":"Plataforma",
    "Help & FAQ":"Ayuda",
    "30-day trial":"Prueba de 30 días",
    "Full access":"Acceso completo",
    "Then $5.99/month. No card required to start.":"Luego $5.99/mes.",
    "Sign out":"Cerrar sesión",
    "+ Add New":"+ Nuevo",
    "BOOKING CENTER":"RESERVAS",
    "Booking Page":"Page de réservation",
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
    "Booking requests":"Por revisar",
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
    "Today’s route":"Itinéraire du jour",
    "MILEAGE":"MILLAJE",
    "Mileage log":"Kilométrage",
    "+ Log drive":"+ Registrar viaje",
    "This week":"Esta semana",
    "This month":"Este mes",
    "TIME TRACKING":"CONTROL DE TIEMPO",
    "Time tracking":"Mira cuánto duran realmente los trabajos.",
    "Start timer":"Iniciar temporizador",
    "Finish timer":"Finalizar temporizador",
    "Current job":"Trabajo actual",
    "No timer running.":"No hay temporizador activo.",
    "Start time from an assigned job when work begins.":"Inicia el tiempo desde un trabajo asignado cuando comience el servicio.",
    "Off":"Apagado",
    "On my way":"En camino",
    "Start job":"Iniciar trabajo",
    "Call client":"Llamar al cliente",
    "No assigned jobs.":"No hay trabajos asignados.",
    "Your owner or admin will assign jobs when they are ready.":"El owner o admin te asignará trabajos cuando estén listos.",
    "Cleaning job":"Trabajo de limpieza",
    "Cleaning":"Limpieza",
    "SUPPLIES":"SUMINISTROS",
    "Supplies":"Sabe qué se está acabando antes del próximo trabajo.",
    "Keep a lightweight list of cleaning supplies, current quantity, reorder level and cost.":"Lleva una lista simple de suministros, cantidad actual, nivel de reposición y costo.",
    "+ Add supply":"+ Añadir suministro",
    "Active supplies":"Suministros activos",
    "Items being tracked":"Artículos en seguimiento",
    "Low stock":"Poco inventario",
    "At or below reorder level":"En o por debajo del nivel de reposición",
    "Inventory value":"Valor del inventario",
    "Estimated from unit costs":"Estimado según costo por unidad",
    "REPORTS":"REPORTES",
    "Business reports":"Rapports d’activité",
    "Revenue this month":"Ingresos este mes",
    "Confirmed payments recorded this month.":"Pagos confirmados registrados este mes.",
    "Jobs completed":"Trabajos completados",
    "No completed jobs yet.":"Todavía no hay trabajos completados.",
    "Business miles":"Millas del negocio",
    "Tracked mileage this month.":"Millaje registrado este mes.",
    "Work hours":"Horas trabajadas",
    "Tracked team time this month.":"Tiempo del equipo registrado este mes.",
    "SERVICES + ADD-ONS":"SERVICIOS + EXTRAS",
    "Services + add-ons":"Services + extras",
    "+ Add add-on":"+ Añadir extra",
    "+ Add service":"+ Añadir servicio",
    "TEAM":"EQUIPO",
    "Team":"Asigna la persona correcta al trabajo correcto.",
    "Workers use a private no-password link. Admin access stays separate.":"Los trabajadores usan un link privado sin contraseña. El acceso Admin se mantiene separado.",
    "Invite Admin":"Invitar Admin",
    "+ Add team profile":"+ Añadir trabajador",
    "OWNER ONLY":"SOLO OWNER",
    "Workers do not need passwords":"Los trabajadores no necesitan contraseñas",
    "Create the worker profile, assign jobs, then use Share worker link on that person’s card. The link only opens their assigned work.":"Crea el perfil del trabajador, asígnale trabajos y luego usa Compartir link del trabajador. El link solo abre su trabajo asignado.",
    "Invite an Admin →":"Invitar un Admin →",
    "SETTINGS":"AJUSTES",
    "Business settings":"Paramètres de l’entreprise",
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
    "Manage teammates from Team or Owner settings.":"Administra el equipo desde Equipo o Admin del Owner.",
    "HELP & FAQ":"AYUDA Y PREGUNTAS",
    "Help Center":"Centre d’aide",
    "Install the app on your phone, share access with your team, and find answers to the most common questions.":"Instala la app en tu teléfono, comparte acceso con tu equipo y encuentra respuestas a las preguntas más comunes.",
    "IPHONE":"IPHONE",
    "iPhone install":"Installer sur iPhone",
    "Open the app in Safari.":"Abre la app en Safari.",
    "Tap the Share button.":"Toca el botón Compartir.",
    "Scroll and tap Add to Home Screen.":"Desliza y toca Añadir a pantalla de inicio.",
    "Tap Add.":"Toca Añadir.",
    "It will open from your Home Screen like an app.":"Se abrirá desde tu pantalla de inicio como una app.",
    "ANDROID":"ANDROID",
    "Android install":"Installer sur Android",
    "Open the app in Chrome.":"Abre la app en Chrome.",
    "Tap the ⋮ menu.":"Toca el menú ⋮.",
    "Tap Install app or Add to Home screen.":"Toca Instalar app o Añadir a pantalla de inicio.",
    "Confirm Install.":"Confirma Instalar.",
    "SHARE ACCESS":"COMPARTIR ACCESO",
    "Access sharing":"Partager l’accès",
    "ACCESS LEVELS":"NIVELES DE ACCESO",
    "Access levels":"Niveaux d’accès",
    "Owner":"Owner",
    "Admin":"Admin",
    "Worker":"Trabajador",
    "Everything, including billing, permissions, reports, integrations and Owner settings.":"Todo, incluyendo facturación, permisos, reportes, integraciones y Admin del Owner.",
    "Clients, jobs, quotes, invoices, services and day-to-day business operations.":"Clientes, trabajos, cotizaciones, facturas, servicios y operaciones diarias del negocio.",
    "No password. Only assigned jobs, route/address, job status, time tracking, mileage and the client contact needed for that job.":"Sin contraseña. Solo trabajos asignados, ruta/dirección, estado del trabajo, tiempo, millaje y contacto necesario del cliente.",
    "FAQ":"FAQ",
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
    "Customers":"Clients",
    "Trials":"Pruebas",
    "Active subscribers":"Suscriptores activos",
    "Visits · 30 days":"Visitas · 30 días",
    "Unique visitors · 30 days":"Visitantes únicos · 30 días",
    "APP CUSTOMERS":"CLIENTES DE LA APP",
    "Customers":"Quién se registró / compró",
    "RECENT ACTIVITY":"ACTIVIDAD RECIENTE",
    "App visits":"Visitas de la app",
    "Billing, access, permissions, integrations and sensitive business controls stay with the owner.":"Facturación, acceso, permisos, integraciones y controles sensibles quedan con el owner.",
    "ACCESS + PERMISSIONS":"ACCESO + PERMISOS",
    "Access":"Accès",
    "+ Invite teammate":"+ Invitar Admin",
    "PLAN + BILLING":"PLAN + FACTURACIÓN",
    "Subscription":"Suscripción",
    "Status":"Estado",
    "Trial ends":"La prueba termina",
    "30 days":"30 días",
    "After trial":"Después de la prueba",
    "SECURITY":"SEGURIDAD",
    "Security":"Sécurité",
    "Workspace ownership":"Propiedad del espacio",
    "Cannot be changed by Admin or Worker.":"No puede cambiarlo un Admin ni un Trabajador.",
    "Permissions":"Permisos",
    "Only the owner can promote, demote or remove access.":"Solo el owner puede cambiar roles o eliminar accesos.",
    "Data protection":"Protección de datos",
    "Business records are isolated by account permissions.":"Los datos de cada negocio están aislados por permisos de cuenta.",
    "INTEGRATIONS":"INTEGRACIONES",
    "Integrations":"Intégrations",
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
    "Cash":"Efectivo","Check":"Cheque","Zelle":"Zelle","E-transfer":"Transferencia electrónica","Bank transfer":"Transferencia bancaria","Other":"Otro",
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
      "Team":"Equipe","Settings":"Configurações","Owner settings":"Admin do proprietário",
      "Help & FAQ":"Ajuda e FAQ","Log out":"Sair","Change language":"Mudar idioma",
      "Good morning":"Bom dia","Good afternoon":"Boa tarde","Good evening":"Boa noite",
      "Booking requests":"Solicitações de reserva","Open quotes":"Orçamentos abertos",
      "Outstanding invoices":"Faturas pendentes","Today's jobs":"Trabalhos de hoje",
      "Add client":"Adicionar cliente","Create quote":"Criar orçamento","Create invoice":"Criar fatura",
      "Log mileage":"Registrar quilometragem","Track time":"Registrar tempo",
      "Start timer":"Iniciar cronômetro","Finish timer":"Encerrar cronômetro","Current job":"Trabalho atual",
      "No timer running.":"Nenhum cronômetro ativo.","Start time from an assigned job when work begins.":"Inicie o tempo a partir de um trabalho atribuído quando o serviço começar.",
      "Running":"Ativo","Off":"Desligado","On my way":"A caminho","Start job":"Iniciar trabalho","Complete":"Concluir",
      "Call client":"Ligar para o cliente","No assigned jobs.":"Nenhum trabalho atribuído.",
      "Your owner or admin will assign jobs when they are ready.":"O proprietário ou administrador atribuirá trabalhos quando estiverem prontos.",
      "Cleaning job":"Trabalho de limpeza","Cleaning":"Limpeza",
      "Nothing urgent.":"Nada urgente.","No jobs today.":"Nenhum trabalho hoje.",
      "Booking page":"Página de reservas","Open page":"Abrir página","Open profile":"Abrir perfil",
      "Privacy":"Privacidade","Terms":"Termos","Share this app":"Compartilhar este app",
      "Feedback":"Feedback","Help":"Ajuda","Restart tour":"Reiniciar tour",
      "Business email":"E-mail da empresa","Default language":"Idioma padrão","Time zone":"Fuso horário",
      "Customer communication language":"Idioma de comunicação com clientes","Controls the language you see inside the app.":"Controla o idioma exibido dentro do app.","Default for customer emails, quotes, invoices, booking confirmations, reminders and follow-ups. A customer can keep their own preferred language.":"Idioma padrão para e-mails, orçamentos, faturas, confirmações de reserva, lembretes e acompanhamentos. Cada cliente pode manter seu idioma preferido.",
      "Client email language":"Idioma dos e-mails para clientes","Controls the language you see inside the app.":"Controla o idioma exibido dentro do app.","Used for automatic quote, booking, invoice, payment and follow-up emails. It can be different from your app language.":"Usado nos e-mails automáticos de orçamento, reserva, fatura, pagamento e acompanhamento. Pode ser diferente do idioma do app.",
      "Edit business details":"Editar dados da empresa","Save business details":"Salvar dados da empresa",
      "Client payment methods":"Formas de pagamento do cliente","Cash":"Dinheiro","Check":"Cheque","Zelle":"Zelle","E-transfer":"E-transfer","Bank transfer":"Transferência bancária",
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
      "Try again":"Tentar novamente","Close":"Fechar","Start tour":"Iniciar tour","Got it":"Entendi",
      "Review your invoice details below.":"Revise os detalhes da sua fatura abaixo.",
      "Selected":"Selecionado","Tap Submit invoice to send this choice.":"Toque em Enviar fatura para enviar esta escolha.",
      "Choose a payment method, then submit your choice.":"Escolha uma forma de pagamento e depois envie sua escolha.",
      "Submitting your payment choice…":"Enviando sua forma de pagamento…","Submitted":"Enviado",
      "The business will confirm payment after it is received.":"A empresa confirmará o pagamento depois de recebê-lo.",
      "Please explain what you would like reviewed.":"Explique o que você gostaria que fosse revisado.",
      "Sending dispute…":"Enviando contestação…","Dispute sent. The cleaning business can now review your message.":"Contestação enviada. A empresa de limpeza já pode revisar sua mensagem.",
      "Invoice unavailable":"Fatura indisponível","QUOTE":"ORÇAMENTO",
      "Review the details below and choose Accept or Decline.":"Revise os detalhes abaixo e escolha Aceitar ou Recusar.",
      "Quote for":"Orçamento para","your cleaning":"sua limpeza",
      "Accepted. Your service is confirmed.":"Aceito. Seu serviço está confirmado.",
      "This quote was declined.":"Este orçamento foi recusado.",
      "This quote is not currently awaiting a response.":"Este orçamento não está aguardando resposta no momento.",
      "Quote unavailable":"Orçamento indisponível",
      "Choose a service and date first.":"Escolha primeiro um serviço e uma data.",
      "Checking availability…":"Verificando disponibilidade…","No openings on this date. Try another day.":"Não há horários disponíveis nesta data. Tente outro dia.",
      "Phone is required for Text or WhatsApp.":"O telefone é obrigatório para SMS ou WhatsApp.",
      "Sending…":"Enviando…","Choose one of the available times.":"Escolha um dos horários disponíveis.",
      "Page unavailable":"Página indisponível"
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
      "Team":"Équipe","Settings":"Paramètres","Owner settings":"Administration propriétaire",
      "Help & FAQ":"Aide et FAQ","Log out":"Se déconnecter","Change language":"Changer de langue",
      "Good morning":"Bonjour","Good afternoon":"Bon après-midi","Good evening":"Bonsoir",
      "Booking requests":"Demandes de réservation","Open quotes":"Devis ouverts",
      "Outstanding invoices":"Factures impayées","Today's jobs":"Travaux du jour",
      "Add client":"Ajouter un client","Create quote":"Créer un devis","Create invoice":"Créer une facture",
      "Log mileage":"Enregistrer le kilométrage","Track time":"Suivre le temps",
      "Start timer":"Démarrer le minuteur","Finish timer":"Arrêter le minuteur","Current job":"Travail en cours",
      "No timer running.":"Aucun minuteur actif.","Start time from an assigned job when work begins.":"Démarrez le temps depuis un travail attribué lorsque le service commence.",
      "Running":"Actif","Off":"Arrêté","On my way":"En route","Start job":"Démarrer le travail","Complete":"Terminer",
      "Call client":"Appeler le client","No assigned jobs.":"Aucun travail attribué.",
      "Your owner or admin will assign jobs when they are ready.":"Le propriétaire ou l’administrateur attribuera des travaux lorsqu’ils seront prêts.",
      "Cleaning job":"Travail de nettoyage","Cleaning":"Nettoyage",
      "Nothing urgent.":"Rien d’urgent.","No jobs today.":"Aucun travail aujourd’hui.",
      "Booking page":"Page de réservation","Open page":"Ouvrir la page","Open profile":"Ouvrir le profil",
      "Privacy":"Confidentialité","Terms":"Conditions","Share this app":"Partager l’application",
      "Feedback":"Avis","Help":"Aide","Restart tour":"Recommencer le guide",
      "Business email":"E-mail de l’entreprise","Default language":"Langue par défaut","Time zone":"Fuseau horaire",
      "Customer communication language":"Langue de communication client","Controls the language you see inside the app.":"Contrôle la langue affichée dans l’application.","Default for customer emails, quotes, invoices, booking confirmations, reminders and follow-ups. A customer can keep their own preferred language.":"Langue par défaut pour les e-mails clients, devis, factures, confirmations de réservation, rappels et suivis. Chaque client peut conserver sa langue préférée.",
      "Client email language":"Langue des e-mails clients","Controls the language you see inside the app.":"Contrôle la langue affichée dans l’application.","Used for automatic quote, booking, invoice, payment and follow-up emails. It can be different from your app language.":"Utilisée pour les e-mails automatiques de devis, réservation, facture, paiement et suivi. Elle peut être différente de la langue de l’application.",
      "Edit business details":"Modifier les informations","Save business details":"Enregistrer les informations",
      "Client payment methods":"Modes de paiement client","Cash":"Espèces","Check":"Chèque","Zelle":"Zelle","E-transfer":"Virement électronique","Bank transfer":"Virement bancaire",
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
      "Try again":"Réessayer","Close":"Fermer","Start tour":"Commencer le guide","Got it":"Compris",
      "Review your invoice details below.":"Vérifiez les détails de votre facture ci-dessous.",
      "Selected":"Sélectionné","Tap Submit invoice to send this choice.":"Touchez Envoyer la facture pour transmettre ce choix.",
      "Choose a payment method, then submit your choice.":"Choisissez un mode de paiement puis envoyez votre choix.",
      "Submitting your payment choice…":"Envoi de votre choix de paiement…","Submitted":"Envoyé",
      "The business will confirm payment after it is received.":"L’entreprise confirmera le paiement après réception.",
      "Please explain what you would like reviewed.":"Expliquez ce que vous souhaitez faire vérifier.",
      "Sending dispute…":"Envoi de la contestation…","Dispute sent. The cleaning business can now review your message.":"Contestation envoyée. L’entreprise de nettoyage peut maintenant examiner votre message.",
      "Invoice unavailable":"Facture indisponible","QUOTE":"DEVIS",
      "Review the details below and choose Accept or Decline.":"Vérifiez les détails ci-dessous puis choisissez Accepter ou Refuser.",
      "Quote for":"Devis pour","your cleaning":"votre nettoyage",
      "Accepted. Your service is confirmed.":"Accepté. Votre service est confirmé.",
      "This quote was declined.":"Ce devis a été refusé.",
      "This quote is not currently awaiting a response.":"Ce devis n’attend pas de réponse actuellement.",
      "Quote unavailable":"Devis indisponible",
      "Choose a service and date first.":"Choisissez d’abord un service et une date.",
      "Checking availability…":"Vérification des disponibilités…","No openings on this date. Try another day.":"Aucun créneau disponible à cette date. Essayez un autre jour.",
      "Phone is required for Text or WhatsApp.":"Le téléphone est obligatoire pour SMS ou WhatsApp.",
      "Sending…":"Envoi…","Choose one of the available times.":"Choisissez l’un des créneaux disponibles.",
      "Page unavailable":"Page indisponible"
    }
  };


  const uiCorrections={
    es:{
    "Visits":"Visites",
    "Visitor locations":"Localisation des visiteurs",
    "Owner reports":"Rapports owner",
    "History":"Historique",
    "Due today":"Pour aujourd’hui",
    "Follow-up rules":"Règles de suivi",
    "Follow-ups":"Suivis",
    "Availability":"Disponibilité",
    "Pricing + quotes":"Tarifs + devis",
    "Bookable services":"Services réservables",
    "Public links":"Liens publics",
      "Invoices":"Mira qué está pagado y qué necesita seguimiento.",
      "Outstanding":"Pendiente",
      "Paid this month":"Pagado este mes",
      "Open invoices":"Facturas abiertas",
      "+ New invoice":"+ Nueva factura",
      "Owner":"Dueño",
    "Admin":"Administrador",
    "Admin access":"Acceso de administrador",
    "Guest employee":"Empleado invitado",
      "Status":"Estado",
      "Time tracking":"Mira cuánto duran realmente los trabajos.",
      "Mileage log":"Mantén organizada la distancia del negocio.",
      "No time entries yet.":"Aún no hay registros de tiempo.",
      "Time worked will appear here.":"El tiempo trabajado aparecerá aquí.",
      "Remove from this list":"Quitar de esta lista",
      "Removing…":"Quitando…",
      "Removed from Time Tracking only.":"Quitado solo de Control de Tiempo.",
      "Could not remove it from this list.":"No se pudo quitar de esta lista.",
      "Residential":"Residencial",
      "Commercial":"Comercial",
      "Extra job":"Trabajo extra",
      "Extra job type":"Tipo de trabajo extra",
      "Choose type":"Elige el tipo",
      "Store":"Tienda",
      "School":"Escuela",
      "Office":"Oficina",
      "Supply run":"Compra de suministros",
      "From":"Desde",
      "To":"Hasta",
      "Job (optional)":"Trabajo (opcional)",
      "No specific job":"Sin trabajo específico",
      "Note (optional)":"Nota (opcional)",
      "Office / home / previous stop":"Oficina / casa / parada anterior",
      "Client / supply store":"Cliente / tienda de suministros",
      "e.g. pick up supplies":"Ej. recoger suministros",
      "Enter a distance greater than 0.":"Escribe una distancia mayor que 0.",
      "Complete From and To.":"Completa Desde y Hasta.",
      "Choose the extra job type.":"Elige el tipo de trabajo extra.",
      "No mileage logged yet.":"Aún no hay millaje registrado.",
      "Use “Log drive” after a business trip.":"Usa “Registrar viaje” después de un viaje de trabajo.",
      "Date / note":"Fecha / nota",
      "Distance":"Distancia",
      "Job / team":"Trabajo / equipo",
      "Business workspace":"Espacio del negocio",
      "Refresh":"Actualizar",
      "No route today.":"No hay ruta hoy.",
      "Schedule jobs to build today’s stop list.":"Programa trabajos para crear la ruta de hoy.",
      "Your route appears here when jobs are scheduled.":"Tu ruta aparece aquí cuando hay trabajos programados.",
      "Completed this month.":"Completados este mes.",
      "No tracked time yet.":"Aún no hay tiempo registrado.",
      "Tracked team time this month.":"Tiempo del equipo registrado este mes."
    },
    pt:{
      "Invoices":"Veja o que foi pago e o que precisa de acompanhamento.",
      "Outstanding":"Pendente",
      "Paid this month":"Pago este mês",
      "Open invoices":"Faturas em aberto",
      "+ New invoice":"+ Nova fatura",
      "Owner":"Proprietário",
      "Admin":"Administrador",
      "Admin access":"Acesso de administrador",
      "Guest employee":"Funcionário convidado",
      "Actual":"Real",
      "Planned":"Planejado",
      "Status":"Status",
      "Type":"Tipo",
      "Job":"Trabalho",
      "Miles":"Milhas",
      "Time tracking":"Veja quanto tempo os trabalhos realmente levam.",
      "Mileage log":"Mantenha organizada a distância percorrida pela empresa.",
      "No time entries yet.":"Ainda não há registros de tempo.",
      "Time worked will appear here.":"O tempo trabalhado aparecerá aqui.",
      "Remove from this list":"Remover desta lista",
      "Removing…":"Removendo…",
      "Removed from Time Tracking only.":"Removido apenas do Controle de Tempo.",
      "Could not remove it from this list.":"Não foi possível remover desta lista.",
      "Residential":"Residencial",
      "Commercial":"Comercial",
      "Extra job":"Trabalho extra",
      "Extra job type":"Tipo de trabalho extra",
      "Choose type":"Escolha o tipo",
      "Store":"Loja",
      "School":"Escola",
      "Office":"Escritório",
      "Supply run":"Compra de materiais",
      "From":"De",
      "To":"Para",
      "Job (optional)":"Trabalho (opcional)",
      "No specific job":"Sem trabalho específico",
      "Note (optional)":"Observação (opcional)",
      "Office / home / previous stop":"Escritório / casa / parada anterior",
      "Client / supply store":"Cliente / loja de materiais",
      "e.g. pick up supplies":"Ex. buscar materiais",
      "Enter a distance greater than 0.":"Digite uma distância maior que 0.",
      "Complete From and To.":"Preencha De e Para.",
      "Choose the extra job type.":"Escolha o tipo de trabalho extra.",
      "No mileage logged yet.":"Ainda não há quilometragem registrada.",
      "Use “Log drive” after a business trip.":"Use “Registrar quilometragem” depois de um deslocamento de trabalho.",
      "Date / note":"Data / observação",
      "Distance":"Distância",
      "Job / team":"Trabalho / equipe",
      "Business workspace":"Espaço da empresa",
      "Refresh":"Atualizar",
      "No route today.":"Não há rota hoje.",
      "Schedule jobs to build today’s stop list.":"Agende trabalhos para montar a rota de hoje.",
      "Your route appears here when jobs are scheduled.":"Sua rota aparecerá aqui quando houver trabalhos agendados.",
      "OWNER ONLY":"SOMENTE PROPRIETÁRIO",
      "Billing, access, permissions, integrations and sensitive business controls stay with the owner.":"Cobrança, acesso, permissões, integrações e controles sensíveis do negócio ficam somente com o proprietário.",
      "Private":"Privado",
      "ACCESS + PERMISSIONS":"ACESSO + PERMISSÕES",
      "Access":"Quem pode entrar neste espaço",
      "+ Invite teammate":"+ Convidar membro",
      "Everything + billing, reports, permissions, integrations.":"Tudo, incluindo cobrança, relatórios, permissões e integrações.",
      "Runs clients, jobs, quotes, invoices, services and team operations.":"Gerencia clientes, trabalhos, orçamentos, faturas, serviços e operações da equipe.",
      "Only assigned jobs, route, time tracking and needed client details.":"Somente trabalhos atribuídos, rota, controle de tempo e dados necessários do cliente.",
      "Worker":"Funcionário",
      "PLAN + BILLING":"PLANO + COBRANÇA",
      "Subscription":"Assinatura",
      "Trial":"Teste",
      "Owner only":"Somente proprietário",
      "Trial ends":"O teste termina",
      "30 days":"30 dias",
      "After trial":"Depois do teste",
      "SECURITY":"SEGURANÇA",
      "Security":"Controles protegidos",
      "Workspace ownership":"Propriedade do espaço",
      "Cannot be changed by Admin or Worker.":"Não pode ser alterada por Administrador ou Funcionário.",
      "Permissions":"Permissões",
      "Only the owner can promote, demote or remove access.":"Somente o proprietário pode alterar funções ou remover acesso.",
      "Locked":"Bloqueado",
      "Data protection":"Proteção de dados",
      "Business records are isolated by account permissions.":"Os registros da empresa são isolados pelas permissões da conta.",
      "Protected":"Protegido",
      "INTEGRATIONS":"INTEGRAÇÕES",
      "Integrations":"Conexões privadas",
      "App subscription":"Assinatura do app",
      "Subscription access is managed by The Launch Era.":"O acesso à assinatura é gerenciado pela The Launch Era.",
      "Email connections":"Conexões de e-mail",
      "Email delivery and private connection settings stay hidden from teammates.":"As configurações de envio de e-mail e conexões privadas ficam ocultas dos membros da equipe.",
      "Cleaning App":"Cleaning App",
      "Contact me":"Fale comigo",
      "Share app":"Compartilhar app",
      "Workers use a private no-password link. Admin access stays separate.":"Funcionários usam um link privado sem senha. O acesso Admin permanece separado.",
      "Invite Admin":"Convidar Admin",
      "+ Add team profile":"+ Adicionar perfil da equipe",
      "Workers do not need passwords":"Funcionários não precisam de senha",
      "Create the worker profile, assign jobs, then use Share worker link on that person’s card. The link only opens their assigned work.":"Crie o perfil do funcionário, atribua trabalhos e depois use Compartilhar link do funcionário no cartão dele. O link abre somente os trabalhos atribuídos.",
      "Invite an Admin →":"Convidar um Admin →",
      "Share worker link":"Compartilhar link do funcionário",
      "Owner settings":"Admin do proprietário",
      "Everything, including billing, permissions, reports, integrations and Owner settings.":"Tudo, incluindo cobrança, permissões, relatórios, integrações e Admin do proprietário.",
      "Clients, jobs, quotes, invoices, services and day-to-day business operations.":"Clientes, trabalhos, orçamentos, faturas, serviços e operações diárias do negócio.",
      "No password. Only assigned jobs, route/address, job status, time tracking, mileage and the client contact needed for that job.":"Sem senha. Somente trabalhos atribuídos, rota/endereço, status do trabalho, controle de tempo, quilometragem e o contato do cliente necessário para esse trabalho.",
      "No password. Only assigned jobs, route/address, job status, time tracking, mileage, messages with the admin and the client contact needed for that assigned job.":"Sem senha. Somente trabalhos atribuídos, rota/endereço, status do trabalho, controle de tempo, quilometragem, mensagens com o administrador e o contato do cliente necessário para esse trabalho.",
      "Owner":"Proprietário",
      "Admin":"Administrador",
      "On":"Ativado"
    },
    fr:{
      "Invoices":"Voyez ce qui est payé et ce qui nécessite un suivi.",
      "Outstanding":"À recevoir",
      "Paid this month":"Payé ce mois-ci",
      "Open invoices":"Factures ouvertes",
      "+ New invoice":"+ Nouvelle facture",
      "Owner":"Propriétaire",
      "Admin":"Administrateur",
      "Admin access":"Accès administrateur",
      "Guest employee":"Employé invité",
      "Actual":"Réel",
      "Planned":"Prévu",
      "Status":"Statut",
      "Type":"Type",
      "Job":"Travail",
      "Miles":"Miles",
      "Time tracking":"Voyez combien de temps les travaux prennent réellement.",
      "Mileage log":"Gardez les déplacements professionnels bien organisés.",
      "No time entries yet.":"Aucun temps enregistré pour le moment.",
      "Time worked will appear here.":"Le temps travaillé apparaîtra ici.",
      "Remove from this list":"Retirer de cette liste",
      "Removing…":"Suppression…",
      "Removed from Time Tracking only.":"Retiré uniquement du suivi du temps.",
      "Could not remove it from this list.":"Impossible de le retirer de cette liste.",
      "Residential":"Résidentiel",
      "Commercial":"Commercial",
      "Extra job":"Travail supplémentaire",
      "Extra job type":"Type de travail supplémentaire",
      "Choose type":"Choisir le type",
      "Store":"Magasin",
      "School":"École",
      "Office":"Bureau",
      "Supply run":"Achat de fournitures",
      "From":"De",
      "To":"À",
      "Job (optional)":"Travail (facultatif)",
      "No specific job":"Aucun travail précis",
      "Note (optional)":"Note (facultative)",
      "Office / home / previous stop":"Bureau / domicile / arrêt précédent",
      "Client / supply store":"Client / magasin de fournitures",
      "e.g. pick up supplies":"Ex. récupérer des fournitures",
      "Enter a distance greater than 0.":"Saisissez une distance supérieure à 0.",
      "Complete From and To.":"Complétez De et À.",
      "Choose the extra job type.":"Choisissez le type de travail supplémentaire.",
      "No mileage logged yet.":"Aucun kilométrage enregistré pour le moment.",
      "Use “Log drive” after a business trip.":"Utilisez « Enregistrer le kilométrage » après un déplacement professionnel.",
      "Date / note":"Date / note",
      "Distance":"Distance",
      "Job / team":"Travail / équipe",
      "Business workspace":"Espace de l’entreprise",
      "Refresh":"Actualiser",
      "No route today.":"Aucun itinéraire aujourd’hui.",
      "Schedule jobs to build today’s stop list.":"Planifiez des travaux pour créer l’itinéraire du jour.",
      "Your route appears here when jobs are scheduled.":"Votre itinéraire apparaîtra ici lorsque des travaux seront planifiés.",
      "OWNER ONLY":"PROPRIÉTAIRE UNIQUEMENT",
      "Billing, access, permissions, integrations and sensitive business controls stay with the owner.":"La facturation, les accès, les autorisations, les intégrations et les contrôles sensibles restent réservés au propriétaire.",
      "Private":"Privé",
      "ACCESS + PERMISSIONS":"ACCÈS + AUTORISATIONS",
      "Access":"Qui peut accéder à cet espace",
      "+ Invite teammate":"+ Inviter un membre",
      "Everything + billing, reports, permissions, integrations.":"Tout, y compris facturation, rapports, autorisations et intégrations.",
      "Runs clients, jobs, quotes, invoices, services and team operations.":"Gère les clients, travaux, devis, factures, services et opérations de l’équipe.",
      "Only assigned jobs, route, time tracking and needed client details.":"Uniquement les travaux attribués, l’itinéraire, le suivi du temps et les informations client nécessaires.",
      "Worker":"Employé",
      "PLAN + BILLING":"FORFAIT + FACTURATION",
      "Subscription":"Abonnement",
      "Trial":"Essai",
      "Owner only":"Propriétaire uniquement",
      "Trial ends":"Fin de l’essai",
      "30 days":"30 jours",
      "After trial":"Après l’essai",
      "SECURITY":"SÉCURITÉ",
      "Security":"Contrôles protégés",
      "Workspace ownership":"Propriété de l’espace",
      "Cannot be changed by Admin or Worker.":"Ne peut pas être modifiée par un administrateur ou un employé.",
      "Permissions":"Autorisations",
      "Only the owner can promote, demote or remove access.":"Seul le propriétaire peut modifier les rôles ou supprimer un accès.",
      "Locked":"Verrouillé",
      "Data protection":"Protection des données",
      "Business records are isolated by account permissions.":"Les données de l’entreprise sont isolées par les autorisations du compte.",
      "Protected":"Protégé",
      "INTEGRATIONS":"INTÉGRATIONS",
      "Integrations":"Connexions privées",
      "App subscription":"Abonnement à l’application",
      "Subscription access is managed by The Launch Era.":"L’accès à l’abonnement est géré par The Launch Era.",
      "Email connections":"Connexions e-mail",
      "Email delivery and private connection settings stay hidden from teammates.":"Les paramètres d’envoi des e-mails et des connexions privées restent masqués pour l’équipe.",
      "Cleaning App":"Cleaning App",
      "Contact me":"Me contacter",
      "Share app":"Partager l’application",
      "Workers use a private no-password link. Admin access stays separate.":"Les employés utilisent un lien privé sans mot de passe. L’accès Admin reste séparé.",
      "Invite Admin":"Inviter un Admin",
      "+ Add team profile":"+ Ajouter un profil d’équipe",
      "Workers do not need passwords":"Les employés n’ont pas besoin de mot de passe",
      "Create the worker profile, assign jobs, then use Share worker link on that person’s card. The link only opens their assigned work.":"Créez le profil de l’employé, attribuez des travaux, puis utilisez Partager le lien employé sur sa carte. Le lien ouvre uniquement ses travaux attribués.",
      "Invite an Admin →":"Inviter un Admin →",
      "Share worker link":"Partager le lien employé",
      "Owner settings":"Administration propriétaire",
      "Everything, including billing, permissions, reports, integrations and Owner settings.":"Tout, y compris la facturation, les autorisations, les rapports, les intégrations et l’administration propriétaire.",
      "Clients, jobs, quotes, invoices, services and day-to-day business operations.":"Clients, travaux, devis, factures, services et opérations quotidiennes de l’entreprise.",
      "No password. Only assigned jobs, route/address, job status, time tracking, mileage and the client contact needed for that job.":"Sans mot de passe. Uniquement les travaux attribués, l’itinéraire/l’adresse, le statut du travail, le suivi du temps, le kilométrage et le contact client nécessaire.",
      "No password. Only assigned jobs, route/address, job status, time tracking, mileage, messages with the admin and the client contact needed for that assigned job.":"Sans mot de passe. Uniquement les travaux attribués, l’itinéraire/l’adresse, le statut du travail, le suivi du temps, le kilométrage, les messages avec l’administrateur et le contact client nécessaire.",
      "Owner":"Propriétaire",
      "Admin":"Administrateur",
      "On":"Activé"
    }
  };


  const staticCorrections={
    es:{
      "Request failed":"La solicitud falló.",
      "Could not submit invoice.":"No se pudo enviar la factura.",
      "This invoice link is invalid or expired.":"Este enlace de factura no es válido o venció.",
      "Could not submit quote.":"No se pudo enviar la cotización.",
      "This quote link is invalid or expired.":"Este enlace de cotización no es válido o venció.",
      "Could not load availability":"No se pudo cargar la disponibilidad",
      "This page is not available.":"Esta página no está disponible.",
      "Email address":"Correo electrónico",
      "This is your limited employee view. You only see the tools your admin shared with you.":"Esta es tu vista limitada de empleado. Solo ves las herramientas que tu admin compartió contigo.",
      "Use this for job questions or quick updates.":"Usa esto para preguntas del trabajo o actualizaciones rápidas.",
      "Your conversation with the admin will appear here.":"Tu conversación con el admin aparecerá aquí.",
      "Messages with admin":"Mensajes con admin",
      "This is guest employee access only. You cannot see leads, quotes, invoices, pricing, reports, billing, settings or clients outside your assigned jobs.":"Este es acceso de empleado invitado. No puedes ver leads, cotizaciones, facturas, precios, reportes, facturación, ajustes ni clientes fuera de tus trabajos asignados.",
      "How would you like to pay?":"¿Cómo te gustaría pagar?",
      "Dispute invoice":"Disputar factura",
      "What would you like the business to review?":"¿Qué te gustaría que el negocio revise?",
      "Send dispute":"Enviar disputa",
      "Recent activity":"Actividad reciente",
      "LOCAL WEATHER":"CLIMA LOCAL",
      "Loading weather…":"Cargando clima…",
      "Quote behavior":"Flujo de cotización",
      "Request stays in Quotes until accepted":"La solicitud permanece en Cotizaciones hasta ser aceptada",
      "Lead pipeline":"Prospects",
      "+ Add lead":"+ Añadir lead",
      "Actions":"Acciones",
      "Client records":"Clients",
      "+ Add client":"+ Añadir cliente",
      "Calendar + jobs":"Calendrier + travaux",
      "+ Add job":"+ Añadir trabajo",
      "NEXT 2 WEEKS":"PRÓXIMAS 2 SEMANAS",
      "14-day schedule":"Agenda de 14 días",
      "Upcoming jobs":"Próximos trabajos",
      "Tap Edit to change a job.":"Toca Editar para cambiar un trabajo.",
      "Quotes":"Primero cotiza. Crea el trabajo después de la aceptación.",
      "+ New quote":"+ Nueva cotización",
      "Today’s ordered stops":"Paradas ordenadas de hoy",
      "Tracked driving this month.":"Distancia registrada este mes.",
      "Employees use private Guest Employee Access with no password. Admin access stays separate, and you can message employees here.":"Los empleados usan acceso privado de invitado sin contraseña. El acceso Admin permanece separado y puedes enviar mensajes aquí.",
      "Admin ↔ Employee":"Admin ↔ Empleado",
      "Private messages stay inside this business workspace.":"Los mensajes privados permanecen dentro de este negocio.",
      "Choose an employee.":"Elige un empleado.",
      "The conversation will appear here.":"La conversación aparecerá aquí.",
      "Temperature":"Temperatura",
      "Minimum notice":"Aviso mínimo",
      "REVIEWS":"RESEÑAS",
      "Google review link":"Enlace de reseña de Google",
      "Not added":"Sin añadir",
      "Save review link":"Guardar enlace de reseña",
      "Open link":"Abrir enlace",
      "Add the worker":"Añade al empleado",
      "Create their Team profile.":"Crea su perfil en Equipo.",
      "Assign jobs":"Asigna trabajos",
      "Only assigned jobs will be visible.":"Solo serán visibles los trabajos asignados.",
      "Send the private link by text or WhatsApp.":"Envía el enlace privado por SMS o WhatsApp.",
      "No password. They see assigned work and can message the admin.":"Sin contraseña. Ven sus trabajos asignados y pueden escribir al admin.",
      "Guest employee":"Empleado invitado",
      "Contact me":"Contáctame",
      "FAQ":"Preguntas frecuentes",
      "Share app":"Compartir app",
      "Copied":"Copiado",
      "Timer started":"Temporizador iniciado",
      "Timer finished":"Temporizador finalizado",
      "Mileage saved":"Millaje guardado",
      "Enter a valid distance":"Escribe una distancia válida",
      "Write a message…":"Escribe un mensaje…",
      "Write a message to your admin…":"Escribe un mensaje a tu admin…"
    },
    pt:{
      "Request failed":"A solicitação falhou.",
      "Could not submit invoice.":"Não foi possível enviar a fatura.",
      "This invoice link is invalid or expired.":"Este link de fatura é inválido ou expirou.",
      "Could not submit quote.":"Não foi possível enviar o orçamento.",
      "This quote link is invalid or expired.":"Este link de orçamento é inválido ou expirou.",
      "Could not load availability":"Não foi possível carregar a disponibilidade",
      "This page is not available.":"Esta página não está disponível.",
      "Today’s jobs":"Trabalhos de hoje",
      "Today's jobs":"Trabalhos de hoje",
      "Active clients":"Clientes ativos",
      "Current client records":"Registros atuais de clientes",
      "Open quotes":"Orçamentos abertos",
      "Requested, draft or sent":"Solicitados, rascunhos ou enviados",
      "Outstanding invoices":"Faturas pendentes",
      "Still to collect":"Ainda a receber",
      "Booking requests":"Solicitações de reserva",
      "Waiting for review":"Aguardando revisão",
      "TODAY":"HOJE",
      "Schedule + route":"Agenda + rota",
      "Full calendar →":"Calendário completo →",
      "No jobs today.":"Nenhum trabalho hoje.",
      "Your scheduled jobs will appear here.":"Seus trabalhos agendados aparecerão aqui.",
      "QUICK ACTIONS":"AÇÕES RÁPIDAS",
      "Quick actions":"Avance o trabalho",
      "NEEDS ATTENTION":"PRECISA DE ATENÇÃO",
      "Needs attention":"Não deixe isso passar",
      "No overdue invoices, sent quotes, or new booking requests need attention.":"Nenhuma fatura vencida, orçamento enviado ou nova solicitação precisa de atenção.",
      "THIS WEEK":"ESTA SEMANA",
      "See reports →":"Ver relatórios →",
      "ONLINE PRESENCE":"PRESENÇA ONLINE",
      "Online presence":"Sua empresa a um toque.",
      "Add Instagram, Facebook and your review link in Business Profile.":"Adicione Instagram, Facebook e o link de avaliações no Perfil da Empresa.",
      "Add profile":"Adicionar perfil",
      "Add page":"Adicionar página",
      "Add link":"Adicionar link",
      "Client view":"Visão do cliente",
      "Nothing scheduled":"Nada agendado",
      "Service":"Serviço",
      "Quote for":"Orçamento para",
      "Waiting for response":"Aguardando resposta",
      "No overdue invoices, sent quotes, or new booking requests need attention.":"Nenhuma fatura vencida, orçamento enviado ou nova solicitação precisa de atenção.",
      "No booking requests waiting.":"Nenhuma solicitação de reserva aguardando.",
      "Reviewed requests leave this list automatically after 12 hours.":"Solicitações revisadas saem desta lista automaticamente após 12 horas.",
      "Check client":"Ver cliente",
      "Checked":"Verificado",
      "Approve":"Aprovar",
      "Decline":"Recusar",

      "Email address":"E-mail",
      "This is your limited employee view. You only see the tools your admin shared with you.":"Esta é sua visualização limitada de funcionário. Você vê apenas as ferramentas compartilhadas pelo administrador.",
      "Use this for job questions or quick updates.":"Use isto para dúvidas sobre o trabalho ou atualizações rápidas.",
      "Your conversation with the admin will appear here.":"Sua conversa com o administrador aparecerá aqui.",
      "Messages with admin":"Mensagens com o administrador",
      "This is guest employee access only. You cannot see leads, quotes, invoices, pricing, reports, billing, settings or clients outside your assigned jobs.":"Este é um acesso limitado de funcionário convidado. Você não pode ver leads, orçamentos, faturas, preços, relatórios, cobrança, configurações ou clientes fora dos trabalhos atribuídos.",
      "How would you like to pay?":"Como você gostaria de pagar?",
      "Dispute invoice":"Contestar fatura",
      "What would you like the business to review?":"O que você gostaria que a empresa revisasse?",
      "Send dispute":"Enviar contestação",
      "Recent activity":"Atividade recente",
      "LOCAL WEATHER":"CLIMA LOCAL",
      "Loading weather…":"Carregando clima…",
      "Lead pipeline":"Veja quem precisa do próximo passo.",
      "+ Add lead":"+ Adicionar lead",
      "Actions":"Ações",
      "Client records":"Todos os clientes, sem anotações espalhadas.",
      "+ Add client":"+ Adicionar cliente",
      "Calendar + jobs":"Sua agenda com tempo de deslocamento incluído.",
      "+ Add job":"+ Adicionar trabalho",
      "NEXT 2 WEEKS":"PRÓXIMAS 2 SEMANAS",
      "14-day schedule":"Agenda de 14 dias",
      "Upcoming jobs":"Próximos trabalhos",
      "Tap Edit to change a job.":"Toque em Editar para alterar um trabalho.",
      "Quotes":"Primeiro faça o orçamento. Crie o trabalho após a aceitação.",
      "+ New quote":"+ Novo orçamento",
      "Today’s ordered stops":"Paradas de hoje em ordem",
      "Tracked driving this month.":"Distância registrada este mês.",
      "Employees use private Guest Employee Access with no password. Admin access stays separate, and you can message employees here.":"Funcionários usam acesso privado de convidado sem senha. O acesso Admin fica separado e você pode enviar mensagens aqui.",
      "Admin ↔ Employee":"Admin ↔ Funcionário",
      "Private messages stay inside this business workspace.":"As mensagens privadas ficam dentro deste espaço de trabalho.",
      "Choose an employee.":"Escolha um funcionário.",
      "The conversation will appear here.":"A conversa aparecerá aqui.",
      "Temperature":"Temperatura",
      "Minimum notice":"Aviso mínimo",
      "REVIEWS":"AVALIAÇÕES",
      "Google review link":"Link de avaliação do Google",
      "Not added":"Não adicionado",
      "Save review link":"Salvar link de avaliação",
      "Open link":"Abrir link",
      "Add the worker":"Adicione o funcionário",
      "Create their Team profile.":"Crie o perfil dele em Equipe.",
      "Assign jobs":"Atribua trabalhos",
      "Only assigned jobs will be visible.":"Apenas os trabalhos atribuídos ficarão visíveis.",
      "Send the private link by text or WhatsApp.":"Envie o link privado por SMS ou WhatsApp.",
      "No password. They see assigned work and can message the admin.":"Sem senha. Eles veem o trabalho atribuído e podem falar com o administrador.",
      "Guest employee":"Funcionário convidado",
      "Contact me":"Fale comigo",
      "FAQ":"Perguntas frequentes",
      "Share app":"Compartilhar app",
      "Copied":"Copiado",
      "Timer started":"Cronômetro iniciado",
      "Timer finished":"Cronômetro encerrado",
      "Mileage saved":"Quilometragem salva",
      "Enter a valid distance":"Digite uma distância válida",
      "Write a message…":"Escreva uma mensagem…",
      "Write a message to your admin…":"Escreva uma mensagem para o administrador…"
    },
    fr:{
      "Request failed":"La demande a échoué.",
      "Could not submit invoice.":"Impossible d’envoyer la facture.",
      "This invoice link is invalid or expired.":"Ce lien de facture est invalide ou a expiré.",
      "Could not submit quote.":"Impossible d’envoyer le devis.",
      "This quote link is invalid or expired.":"Ce lien de devis est invalide ou a expiré.",
      "Could not load availability":"Impossible de charger les disponibilités",
      "This page is not available.":"Cette page n’est pas disponible.",
      "Today’s jobs":"Travaux du jour",
      "Today's jobs":"Travaux du jour",
      "Active clients":"Clients actifs",
      "Current client records":"Fiches clients actuelles",
      "Open quotes":"Devis ouverts",
      "Requested, draft or sent":"Demandés, brouillons ou envoyés",
      "Outstanding invoices":"Factures impayées",
      "Still to collect":"Reste à encaisser",
      "Booking requests":"Demandes de réservation",
      "Waiting for review":"En attente de vérification",
      "TODAY":"AUJOURD’HUI",
      "Schedule + route":"Planning + itinéraire",
      "Full calendar →":"Calendrier complet →",
      "No jobs today.":"Aucun travail aujourd’hui.",
      "Your scheduled jobs will appear here.":"Vos travaux planifiés apparaîtront ici.",
      "QUICK ACTIONS":"ACTIONS RAPIDES",
      "Quick actions":"Faites avancer le travail",
      "NEEDS ATTENTION":"À SURVEILLER",
      "Needs attention":"Ne laissez rien passer",
      "No overdue invoices, sent quotes, or new booking requests need attention.":"Aucune facture en retard, aucun devis envoyé ni nouvelle demande ne nécessite votre attention.",
      "THIS WEEK":"CETTE SEMAINE",
      "See reports →":"Voir les rapports →",
      "ONLINE PRESENCE":"PRÉSENCE EN LIGNE",
      "Online presence":"Votre entreprise à portée de main.",
      "Add Instagram, Facebook and your review link in Business Profile.":"Ajoutez Instagram, Facebook et votre lien d’avis dans le Profil de l’entreprise.",
      "Add profile":"Ajouter le profil",
      "Add page":"Ajouter la page",
      "Add link":"Ajouter le lien",
      "Client view":"Vue client",
      "Nothing scheduled":"Rien de planifié",
      "Service":"Service",
      "Quote for":"Devis pour",
      "Waiting for response":"En attente de réponse",
      "No booking requests waiting.":"Aucune demande de réservation en attente.",
      "Reviewed requests leave this list automatically after 12 hours.":"Les demandes vérifiées quittent cette liste automatiquement après 12 heures.",
      "Check client":"Vérifier le client",
      "Checked":"Vérifié",
      "Approve":"Approuver",
      "Decline":"Refuser",

      "Email address":"E-mail",
      "This is your limited employee view. You only see the tools your admin shared with you.":"Voici votre espace employé limité. Vous ne voyez que les outils partagés par votre administrateur.",
      "Use this for job questions or quick updates.":"Utilisez ceci pour les questions sur le travail ou les mises à jour rapides.",
      "Your conversation with the admin will appear here.":"Votre conversation avec l’administrateur apparaîtra ici.",
      "Messages with admin":"Messages avec l’administrateur",
      "This is guest employee access only. You cannot see leads, quotes, invoices, pricing, reports, billing, settings or clients outside your assigned jobs.":"Ceci est un accès employé invité limité. Vous ne pouvez pas voir les prospects, devis, factures, prix, rapports, facturation, paramètres ni les clients hors de vos travaux attribués.",
      "How would you like to pay?":"Comment souhaitez-vous payer ?",
      "Dispute invoice":"Contester la facture",
      "What would you like the business to review?":"Que souhaitez-vous faire vérifier par l’entreprise ?",
      "Send dispute":"Envoyer la contestation",
      "Recent activity":"Activité récente",
      "LOCAL WEATHER":"MÉTÉO LOCALE",
      "Loading weather…":"Chargement de la météo…",
      "Lead pipeline":"Voyez qui a besoin d’une prochaine action.",
      "+ Add lead":"+ Ajouter un prospect",
      "Actions":"Actions",
      "Client records":"Tous les clients, sans notes dispersées.",
      "+ Add client":"+ Ajouter un client",
      "Calendar + jobs":"Votre planning avec le temps de déplacement inclus.",
      "+ Add job":"+ Ajouter un travail",
      "NEXT 2 WEEKS":"2 PROCHAINES SEMAINES",
      "14-day schedule":"Planning sur 14 jours",
      "Upcoming jobs":"Travaux à venir",
      "Tap Edit to change a job.":"Touchez Modifier pour changer un travail.",
      "Quotes":"Créez d’abord le devis, puis le travail après acceptation.",
      "+ New quote":"+ Nouveau devis",
      "Today’s ordered stops":"Arrêts du jour dans l’ordre",
      "Tracked driving this month.":"Distance enregistrée ce mois-ci.",
      "Employees use private Guest Employee Access with no password. Admin access stays separate, and you can message employees here.":"Les employés utilisent un accès invité privé sans mot de passe. L’accès Admin reste séparé et vous pouvez envoyer des messages ici.",
      "Admin ↔ Employee":"Admin ↔ Employé",
      "Private messages stay inside this business workspace.":"Les messages privés restent dans cet espace de travail.",
      "Choose an employee.":"Choisissez un employé.",
      "The conversation will appear here.":"La conversation apparaîtra ici.",
      "Temperature":"Température",
      "Minimum notice":"Préavis minimum",
      "REVIEWS":"AVIS",
      "Google review link":"Lien d’avis Google",
      "Not added":"Non ajouté",
      "Save review link":"Enregistrer le lien d’avis",
      "Open link":"Ouvrir le lien",
      "Add the worker":"Ajoutez l’employé",
      "Create their Team profile.":"Créez son profil dans Équipe.",
      "Assign jobs":"Attribuez des travaux",
      "Only assigned jobs will be visible.":"Seuls les travaux attribués seront visibles.",
      "Send the private link by text or WhatsApp.":"Envoyez le lien privé par SMS ou WhatsApp.",
      "No password. They see assigned work and can message the admin.":"Sans mot de passe. Ils voient les travaux attribués et peuvent écrire à l’administrateur.",
      "Guest employee":"Employé invité",
      "Contact me":"Me contacter",
      "FAQ":"Questions fréquentes",
      "Share app":"Partager l’application",
      "Copied":"Copié",
      "Timer started":"Minuteur démarré",
      "Timer finished":"Minuteur arrêté",
      "Mileage saved":"Kilométrage enregistré",
      "Enter a valid distance":"Saisissez une distance valide",
      "Write a message…":"Écrivez un message…",
      "Write a message to your admin…":"Écrivez un message à votre administrateur…"
    }
  };


  // 2026-09-28 — concise section labels + complete public Booking Page copy.
  Object.assign(staticCorrections.es,{
    "Booking Center":"Centro de reservas","Leads":"Leads","Clients":"Clientes","Calendar":"Calendario",
    "Quotes":"Cotizaciones","Invoices":"Facturas","Follow-ups":"Seguimientos","Today's Route":"Ruta de hoy",
    "Mileage":"Millaje","Time Tracking":"Control de tiempo","Supplies":"Suministros","Reports":"Reportes",
    "Services + Add-ons":"Servicios + extras","Team":"Equipo","Settings":"Ajustes","Help & FAQ":"Ayuda y FAQ",
    "Owner Reports":"Reportes del dueño","Owner Admin":"Admin del dueño",
    "Book a Cleaning":"Reservar una limpieza","Request a Quote":"Pedir una cotización","Secure request":"Solicitud segura",
    "Back":"Atrás","BOOK A CLEANING":"RESERVAR UNA LIMPIEZA","REQUEST A QUOTE":"PEDIR UNA COTIZACIÓN",
    "Choose request type":"Elige el tipo de solicitud","Choose your service and send your request.":"Elige tu servicio y envía tu solicitud.",
    "Choose a service with upfront pricing, then pick a real available time.":"Elige un servicio con precio definido y luego selecciona un horario realmente disponible.",
    "For custom or variable-price work. Choose a quote-only service and tell us about the job.":"Para trabajos personalizados o de precio variable. Elige un servicio de cotización y cuéntanos sobre el trabajo.",
    "Custom job type":"Tipo de trabajo personalizado","Choose a custom job type":"Elige un tipo de trabajo personalizado","Custom quote":"Cotización personalizada",
    "No quote-only services available yet":"Aún no hay servicios de cotización disponibles","No priced services available for online booking":"Aún no hay servicios con precio disponibles para reservar online",
    "No custom quote services are set up yet. Use Book a Cleaning for services with upfront pricing.":"Aún no hay servicios personalizados configurados para cotización. Usa Reservar una limpieza para servicios con precio definido.",
    "No priced services are available for online booking. Custom or variable-price work belongs in Request a Quote.":"No hay servicios con precio disponibles para reservar online. Los trabajos personalizados o de precio variable van en Pedir una cotización.",
    "Price provided after review":"Precio después de revisar","No add-ons for this service.":"No hay extras para este servicio.",
    "Your quote request was sent. The business will review it and contact you.":"Tu solicitud de cotización fue enviada. El negocio la revisará y se pondrá en contacto contigo.",
    "Your booking request was sent. The business will review it and confirm the appointment.":"Tu solicitud de reserva fue enviada. El negocio la revisará y confirmará la cita.",
    "Could not send request":"No se pudo enviar la solicitud","Page unavailable":"Página no disponible","Quote unavailable":"Cotización no disponible",
    "Invoice unavailable":"Factura no disponible","This page is not available.":"Esta página no está disponible.",
    "This quote link is invalid or expired.":"Este enlace de cotización no es válido o venció.","This invoice link is invalid or expired.":"Este enlace de factura no es válido o venció.",
    "Review the details below and choose Accept or Decline.":"Revisa los detalles y elige Aceptar o Rechazar.","Quote for":"Cotización para","your cleaning":"tu limpieza",
    "Qty":"Cant.","No quote items found.":"No se encontraron artículos en la cotización.","No invoice items found.":"No se encontraron artículos en la factura.",
    "Could not send dispute.":"No se pudo enviar la disputa.","Due":"Vence","Open Cleaning App":"Abrir Cleaning App"
  });
  Object.assign(staticCorrections.pt,{
    "Booking Center":"Central de reservas","Leads":"Leads","Clients":"Clientes","Calendar":"Calendário",
    "Quotes":"Orçamentos","Invoices":"Faturas","Follow-ups":"Acompanhamentos","Today's Route":"Rota de hoje",
    "Mileage":"Quilometragem","Time Tracking":"Controle de tempo","Supplies":"Materiais","Reports":"Relatórios",
    "Services + Add-ons":"Serviços + extras","Team":"Equipe","Settings":"Configurações","Help & FAQ":"Ajuda e FAQ",
    "Owner Reports":"Relatórios do proprietário","Owner Admin":"Admin do proprietário",
    "Book a Cleaning":"Agendar limpeza","Request a Quote":"Pedir orçamento","Secure request":"Solicitação segura",
    "Back":"Voltar","BOOK A CLEANING":"AGENDAR LIMPEZA","REQUEST A QUOTE":"PEDIR ORÇAMENTO",
    "Choose request type":"Escolha o tipo de solicitação","Choose your service and send your request.":"Escolha seu serviço e envie sua solicitação.",
    "Choose a service with upfront pricing, then pick a real available time.":"Escolha um serviço com preço definido e depois selecione um horário realmente disponível.",
    "For custom or variable-price work. Choose a quote-only service and tell us about the job.":"Para trabalhos personalizados ou de preço variável. Escolha um serviço de orçamento e conte sobre o trabalho.",
    "Custom job type":"Tipo de trabalho personalizado","Choose a custom job type":"Escolha um tipo de trabalho personalizado","Custom quote":"Orçamento personalizado",
    "No quote-only services available yet":"Ainda não há serviços de orçamento disponíveis","No priced services available for online booking":"Ainda não há serviços com preço disponíveis para reserva online",
    "No custom quote services are set up yet. Use Book a Cleaning for services with upfront pricing.":"Ainda não há serviços personalizados configurados para orçamento. Use Agendar limpeza para serviços com preço definido.",
    "No priced services are available for online booking. Custom or variable-price work belongs in Request a Quote.":"Não há serviços com preço disponíveis para reserva online. Trabalhos personalizados ou de preço variável devem usar Pedir orçamento.",
    "Price provided after review":"Preço após análise","No add-ons for this service.":"Não há extras para este serviço.",
    "Your quote request was sent. The business will review it and contact you.":"Seu pedido de orçamento foi enviado. A empresa irá analisá-lo e entrar em contato.",
    "Your booking request was sent. The business will review it and confirm the appointment.":"Sua solicitação de reserva foi enviada. A empresa irá analisá-la e confirmar o agendamento.",
    "Could not send request":"Não foi possível enviar a solicitação","Page unavailable":"Página indisponível","Quote unavailable":"Orçamento indisponível",
    "Invoice unavailable":"Fatura indisponível","This page is not available.":"Esta página não está disponível.",
    "This quote link is invalid or expired.":"Este link de orçamento é inválido ou expirou.","This invoice link is invalid or expired.":"Este link de fatura é inválido ou expirou.",
    "Review the details below and choose Accept or Decline.":"Revise os detalhes abaixo e escolha Aceitar ou Recusar.","Quote for":"Orçamento para","your cleaning":"sua limpeza",
    "Qty":"Qtd.","No quote items found.":"Nenhum item de orçamento encontrado.","No invoice items found.":"Nenhum item de fatura encontrado.",
    "Could not send dispute.":"Não foi possível enviar a contestação.","Due":"Vence","Open Cleaning App":"Abrir Cleaning App"
  });
  Object.assign(staticCorrections.fr,{
    "Booking Center":"Centre de réservation","Leads":"Prospects","Clients":"Clients","Calendar":"Calendrier",
    "Quotes":"Devis","Invoices":"Factures","Follow-ups":"Suivis","Today's Route":"Itinéraire du jour",
    "Mileage":"Kilométrage","Time Tracking":"Suivi du temps","Supplies":"Fournitures","Reports":"Rapports",
    "Services + Add-ons":"Services + options","Team":"Équipe","Settings":"Paramètres","Help & FAQ":"Aide et FAQ",
    "Owner Reports":"Rapports propriétaire","Owner Admin":"Admin propriétaire",
    "Book a Cleaning":"Réserver un nettoyage","Request a Quote":"Demander un devis","Secure request":"Demande sécurisée",
    "Back":"Retour","BOOK A CLEANING":"RÉSERVER UN NETTOYAGE","REQUEST A QUOTE":"DEMANDER UN DEVIS",
    "Choose request type":"Choisissez le type de demande","Choose your service and send your request.":"Choisissez votre service et envoyez votre demande.",
    "Choose a service with upfront pricing, then pick a real available time.":"Choisissez un service avec un prix défini, puis sélectionnez un créneau réellement disponible.",
    "For custom or variable-price work. Choose a quote-only service and tell us about the job.":"Pour les travaux personnalisés ou à prix variable. Choisissez un service sur devis et décrivez le travail.",
    "Custom job type":"Type de travail personnalisé","Choose a custom job type":"Choisissez un type de travail personnalisé","Custom quote":"Devis personnalisé",
    "No quote-only services available yet":"Aucun service sur devis n’est encore disponible","No priced services available for online booking":"Aucun service tarifé n’est encore disponible à la réservation en ligne",
    "No custom quote services are set up yet. Use Book a Cleaning for services with upfront pricing.":"Aucun service personnalisé sur devis n’est encore configuré. Utilisez Réserver un nettoyage pour les services avec un prix défini.",
    "No priced services are available for online booking. Custom or variable-price work belongs in Request a Quote.":"Aucun service tarifé n’est disponible à la réservation en ligne. Les travaux personnalisés ou à prix variable passent par Demander un devis.",
    "Price provided after review":"Prix après examen","No add-ons for this service.":"Aucune option pour ce service.",
    "Your quote request was sent. The business will review it and contact you.":"Votre demande de devis a été envoyée. L’entreprise l’examinera et vous contactera.",
    "Your booking request was sent. The business will review it and confirm the appointment.":"Votre demande de réservation a été envoyée. L’entreprise l’examinera et confirmera le rendez-vous.",
    "Could not send request":"Impossible d’envoyer la demande","Page unavailable":"Page indisponible","Quote unavailable":"Devis indisponible",
    "Invoice unavailable":"Facture indisponible","This page is not available.":"Cette page n’est pas disponible.",
    "This quote link is invalid or expired.":"Ce lien de devis est invalide ou a expiré.","This invoice link is invalid or expired.":"Ce lien de facture est invalide ou a expiré.",
    "Review the details below and choose Accept or Decline.":"Vérifiez les détails ci-dessous et choisissez Accepter ou Refuser.","Quote for":"Devis pour","your cleaning":"votre nettoyage",
    "Qty":"Qté","No quote items found.":"Aucun élément de devis trouvé.","No invoice items found.":"Aucun élément de facture trouvé.",
    "Could not send dispute.":"Impossible d’envoyer la contestation.","Due":"Échéance","Open Cleaning App":"Ouvrir Cleaning App"
  });


  Object.assign(staticCorrections.es,{"Access":"Acceso","Security":"Seguridad","Integrations":"Integraciones"});
  Object.assign(staticCorrections.pt,{"Access":"Acesso","Security":"Segurança","Integrations":"Integrações"});
  Object.assign(staticCorrections.fr,{"Access":"Accès","Security":"Sécurité","Integrations":"Intégrations"});

  const canonicalTranslations=new Map();
  function indexCanonicalTranslations(dict){
    Object.entries(dict||{}).forEach(([source,target])=>{
      if(typeof target!=="string") return;
      const translated=target.trim();
      const canonical=String(source||"").trim();
      if(!translated || !canonical || translated===canonical) return;
      if(!canonicalTranslations.has(translated)) canonicalTranslations.set(translated,canonical);
    });
  }
  indexCanonicalTranslations(exact);
  Object.values(extra).forEach(indexCanonicalTranslations);
  Object.values(uiCorrections).forEach(indexCanonicalTranslations);
  Object.values(staticCorrections).forEach(indexCanonicalTranslations);

  function canonicalizeString(value){
    let key=String(value||"").trim();
    let guard=0;
    while(canonicalTranslations.has(key) && guard<4){
      const next=canonicalTranslations.get(key);
      if(!next || next===key) break;
      key=next;
      guard++;
    }
    return key;
  }

  Object.assign(exact,{
    "Keep the app, client communication, booking rules and payments easy to control from one place.":"Controla fácilmente la app, la comunicación con clientes, las reservas y los pagos desde un solo lugar.",
    "BUSINESS":"NEGOCIO",
    "Business basics":"Datos básicos del negocio",
    "The information clients and your workspace use.":"La información que usan tus clientes y tu espacio de trabajo.",
    "Business":"Negocio",
    "YOUR APP":"TU APP",
    "App preferences":"Preferencias de la app",
    "These only change what the business owner sees inside the app.":"Esto solo cambia lo que el dueño ve dentro de la app.",
    "App language":"Idioma de la app",
    "Edit app preferences":"Editar preferencias",
    "CLIENT COMMUNICATION":"COMUNICACIÓN CON CLIENTES",
    "Emails to your clients":"Emails para tus clientes",
    "This is separate from the language you use inside the app.":"Esto es independiente del idioma que usas dentro de la app.",
    "Automatic":"Automático",
    "Default client email language":"Idioma predeterminado de emails",
    "Change default":"Cambiar predeterminado",
    "Save language":"Guardar idioma",
    "A client can have their own preferred email language. Their preference overrides this default without changing your app language.":"Cada cliente puede tener su propio idioma de email. Su preferencia reemplaza este predeterminado sin cambiar el idioma de tu app.",
    "BOOKING":"RESERVAS",
    "Booking + availability":"Reservas + disponibilidad",
    "Control when clients can book and how much travel time you need.":"Controla cuándo pueden reservar los clientes y cuánto tiempo necesitas para trasladarte.",
    "Open booking settings →":"Abrir ajustes de reservas →",
    "PAYMENTS":"PAGOS",
    "Client payment options":"Opciones de pago del cliente",
    "These are the choices clients see on invoices.":"Estas son las opciones que los clientes ven en las facturas.",
    "Enabled methods":"Métodos activados",
    "Edit payment options →":"Editar opciones de pago →",
    "Used after confirmed payments and review follow-ups.":"Se usa después de pagos confirmados y seguimientos de reseñas.",
    "TEAM ACCESS":"ACCESO DEL EQUIPO",
    "Who can use the app":"Quién puede usar la app",
    "Admins and guest employees are managed separately from client settings.":"Los administradores y empleados invitados se gestionan por separado de los ajustes de clientes.",
    "Open Team →":"Abrir Equipo →",
    "Email language":"Idioma de emails",
    "Business default":"Predeterminado del negocio",
    "Kreyòl Ayisyen":"Kreyòl Ayisyen"
  });

  Object.assign(extra.pt,{
    "Keep the app, client communication, booking rules and payments easy to control from one place.":"Controle facilmente o app, a comunicação com clientes, as reservas e os pagamentos em um só lugar.",
    "BUSINESS":"EMPRESA","Business basics":"Dados básicos da empresa","The information clients and your workspace use.":"As informações usadas pelos clientes e pelo seu espaço de trabalho.",
    "Business":"Empresa","YOUR APP":"SEU APP","App preferences":"Preferências do app","These only change what the business owner sees inside the app.":"Isso só muda o que o proprietário vê dentro do app.","App language":"Idioma do app","Edit app preferences":"Editar preferências",
    "CLIENT COMMUNICATION":"COMUNICAÇÃO COM CLIENTES","Emails to your clients":"E-mails para seus clientes","This is separate from the language you use inside the app.":"Isso é separado do idioma que você usa dentro do app.","Automatic":"Automático","Default client email language":"Idioma padrão dos e-mails","Change default":"Alterar padrão","Save language":"Salvar idioma",
    "A client can have their own preferred email language. Their preference overrides this default without changing your app language.":"Cada cliente pode ter seu próprio idioma de e-mail. A preferência dele substitui este padrão sem mudar o idioma do app.",
    "BOOKING":"RESERVAS","Booking + availability":"Reservas + disponibilidade","Control when clients can book and how much travel time you need.":"Controle quando os clientes podem reservar e quanto tempo de deslocamento você precisa.","Open booking settings →":"Abrir configurações de reservas →",
    "PAYMENTS":"PAGAMENTOS","Client payment options":"Opções de pagamento do cliente","These are the choices clients see on invoices.":"Estas são as opções que os clientes veem nas faturas.","Enabled methods":"Métodos ativados","Edit payment options →":"Editar opções de pagamento →",
    "Used after confirmed payments and review follow-ups.":"Usado após pagamentos confirmados e acompanhamentos de avaliação.",
    "TEAM ACCESS":"ACESSO DA EQUIPE","Who can use the app":"Quem pode usar o app","Admins and guest employees are managed separately from client settings.":"Administradores e funcionários convidados são gerenciados separadamente das configurações de clientes.","Open Team →":"Abrir Equipe →",
    "Email language":"Idioma do e-mail","Business default":"Padrão da empresa","Kreyòl Ayisyen":"Kreyòl Ayisyen"
  });

  Object.assign(extra.fr,{
    "Keep the app, client communication, booking rules and payments easy to control from one place.":"Gérez facilement l’application, la communication client, les réservations et les paiements depuis un seul endroit.",
    "BUSINESS":"ENTREPRISE","Business basics":"Informations de l’entreprise","The information clients and your workspace use.":"Les informations utilisées par vos clients et votre espace de travail.",
    "Business":"Entreprise","YOUR APP":"VOTRE APP","App preferences":"Préférences de l’application","These only change what the business owner sees inside the app.":"Cela change uniquement ce que le propriétaire voit dans l’application.","App language":"Langue de l’application","Edit app preferences":"Modifier les préférences",
    "CLIENT COMMUNICATION":"COMMUNICATION CLIENT","Emails to your clients":"E-mails à vos clients","This is separate from the language you use inside the app.":"Ceci est indépendant de la langue utilisée dans l’application.","Automatic":"Automatique","Default client email language":"Langue par défaut des e-mails","Change default":"Modifier la langue","Save language":"Enregistrer la langue",
    "A client can have their own preferred email language. Their preference overrides this default without changing your app language.":"Chaque client peut avoir sa langue d’e-mail préférée. Elle remplace ce choix par défaut sans changer la langue de votre application.",
    "BOOKING":"RÉSERVATIONS","Booking + availability":"Réservations + disponibilités","Control when clients can book and how much travel time you need.":"Contrôlez quand les clients peuvent réserver et le temps de déplacement nécessaire.","Open booking settings →":"Ouvrir les paramètres de réservation →",
    "PAYMENTS":"PAIEMENTS","Client payment options":"Options de paiement client","These are the choices clients see on invoices.":"Ce sont les options que les clients voient sur les factures.","Enabled methods":"Modes activés","Edit payment options →":"Modifier les options de paiement →",
    "Used after confirmed payments and review follow-ups.":"Utilisé après les paiements confirmés et les suivis d’avis.",
    "TEAM ACCESS":"ACCÈS ÉQUIPE","Who can use the app":"Qui peut utiliser l’application","Admins and guest employees are managed separately from client settings.":"Les administrateurs et employés invités sont gérés séparément des paramètres clients.","Open Team →":"Ouvrir Équipe →",
    "Email language":"Langue des e-mails","Business default":"Valeur par défaut de l’entreprise","Kreyòl Ayisyen":"Kreyòl Ayisyen"
  });

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
    const key=canonicalizeString(value);
    if(!key) return key||value;
    if(lang==="en") return key;
    if(staticCorrections[lang]?.[key]) return staticCorrections[lang][key];
    if(uiCorrections[lang]?.[key]) return uiCorrections[lang][key];
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
      el.setAttribute(attr,translateString(saved[attr]));
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

  const LANGUAGE_NAMES={en:"English",es:"Español",pt:"Português",fr:"Français"};

  function ensureLanguageMenu(){
    let menu=document.getElementById("tleLanguageMenu");
    if(menu) return menu;
    menu=document.createElement("div");
    menu.id="tleLanguageMenu";
    menu.className="language-menu";
    menu.hidden=true;
    menu.setAttribute("role","dialog");
    menu.setAttribute("aria-label","Choose language");
    menu.innerHTML=`
      <div class="language-menu-head">
        <div><small>LANGUAGE</small><strong>Choose your language</strong></div>
        <button type="button" class="language-menu-close" aria-label="Close">×</button>
      </div>
      <div class="language-featured-row">
        <button type="button" class="language-choice featured" data-language-choice="es"><span>Español</span><small>ES</small></button>
        <button type="button" class="language-choice featured" data-language-choice="en"><span>English</span><small>EN</small></button>
      </div>
      <div class="language-more-label">MORE LANGUAGES</div>
      <div class="language-list">
        <button type="button" class="language-choice" data-language-choice="pt"><span>Português</span><small>PT</small></button>
        <button type="button" class="language-choice" data-language-choice="fr"><span>Français</span><small>FR</small></button>
      </div>
    `;
    document.body.appendChild(menu);
    menu.querySelector(".language-menu-close")?.addEventListener("click",()=>closeLanguageMenu());
    menu.addEventListener("click",e=>{
      const choice=e.target.closest("[data-language-choice]");
      if(!choice) return;
      const next=choice.dataset.languageChoice;
      applyLanguage(next);
      closeLanguageMenu();
    });
    return menu;
  }

  function updateLanguageMenu(){
    const menu=document.getElementById("tleLanguageMenu");
    if(!menu) return;
    const staticNames={es:"Español",en:"English",pt:"Português",fr:"Français"};
    const menuCopy={
      en:{kicker:"LANGUAGE",title:"Choose your language",more:"MORE LANGUAGES",close:"Close",button:"Language",aria:"Choose language"},
      es:{kicker:"IDIOMA",title:"Elige tu idioma",more:"MÁS IDIOMAS",close:"Cerrar",button:"Idioma",aria:"Elegir idioma"},
      pt:{kicker:"IDIOMA",title:"Escolha seu idioma",more:"MAIS IDIOMAS",close:"Fechar",button:"Idioma",aria:"Escolher idioma"},
      fr:{kicker:"LANGUE",title:"Choisissez votre langue",more:"AUTRES LANGUES",close:"Fermer",button:"Langue",aria:"Choisir la langue"}
    }[lang]||{kicker:"LANGUAGE",title:"Choose your language",more:"MORE LANGUAGES",close:"Close",button:"Language",aria:"Choose language"};
    const headSmall=menu.querySelector(".language-menu-head small");
    const headTitle=menu.querySelector(".language-menu-head strong");
    const more=menu.querySelector(".language-more-label");
    const close=menu.querySelector(".language-menu-close");
    if(headSmall) headSmall.textContent=menuCopy.kicker;
    if(headTitle) headTitle.textContent=menuCopy.title;
    if(more) more.textContent=menuCopy.more;
    if(close) close.setAttribute("aria-label",menuCopy.close);
    menu.querySelectorAll("[data-language-choice]").forEach(btn=>{
      const code=btn.dataset.languageChoice;
      const name=btn.querySelector("span");
      const small=btn.querySelector("small");
      if(name) name.textContent=staticNames[code]||code;
      if(small) small.textContent=code.toUpperCase();
      btn.classList.toggle("active",code===lang);
      btn.setAttribute("aria-pressed",code===lang?"true":"false");
    });
  }

  function positionLanguageMenu(anchor){
    const menu=ensureLanguageMenu();
    const rect=anchor.getBoundingClientRect();
    const width=Math.min(340,window.innerWidth-24);
    const left=Math.max(12,Math.min(window.innerWidth-width-12,rect.right-width));
    const top=Math.min(window.innerHeight-12,rect.bottom+10);
    menu.style.width=width+"px";
    menu.style.left=left+"px";
    menu.style.top=top+"px";
  }

  function openLanguageMenu(anchor){
    const menu=ensureLanguageMenu();
    positionLanguageMenu(anchor);
    updateLanguageMenu();
    menu.hidden=false;
    anchor.setAttribute("aria-expanded","true");
    window.__tleLanguageAnchor=anchor;
  }

  function closeLanguageMenu(){
    const menu=document.getElementById("tleLanguageMenu");
    if(menu) menu.hidden=true;
    if(window.__tleLanguageAnchor){
      window.__tleLanguageAnchor.setAttribute("aria-expanded","false");
      window.__tleLanguageAnchor=null;
    }
  }

  function updateToggles(){
    document.documentElement.lang=lang;
    const toggleCopy={
      en:{button:"Language",aria:"Choose language"},
      es:{button:"Idioma",aria:"Elegir idioma"},
      pt:{button:"Idioma",aria:"Escolher idioma"},
      fr:{button:"Langue",aria:"Choisir la langue"}
    }[lang]||{button:"Language",aria:"Choose language"};
    document.querySelectorAll("[data-language-toggle],#languageBtn").forEach(btn=>{
      if(btn.id==="languageBtn" && btn.querySelector(".top-icon")){
        const icon=btn.querySelector(".top-icon");
        const label=btn.querySelector(".top-label");
        if(icon) icon.textContent=lang.toUpperCase();
        if(label) label.textContent=toggleCopy.button;
      }else{
        btn.textContent=lang.toUpperCase();
      }
      btn.setAttribute("aria-label",toggleCopy.aria);
      btn.setAttribute("aria-haspopup","dialog");
      btn.setAttribute("aria-expanded","false");
    });
    updateLanguageMenu();
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
    const trigger=document.querySelector("#languageBtn,[data-language-toggle]");
    if(trigger) openLanguageMenu(trigger);
  }

  document.addEventListener("click",e=>{
    const btn=e.target.closest("[data-language-toggle],#languageBtn");
    if(btn){
      e.preventDefault();
      e.stopImmediatePropagation();
      const menu=document.getElementById("tleLanguageMenu");
      if(menu && !menu.hidden && window.__tleLanguageAnchor===btn) closeLanguageMenu();
      else openLanguageMenu(btn);
      return;
    }

    const menu=document.getElementById("tleLanguageMenu");
    if(menu && !menu.hidden && !e.target.closest("#tleLanguageMenu")) closeLanguageMenu();
  },true);

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape") closeLanguageMenu();
  });
  window.addEventListener("resize",()=>{ if(window.__tleLanguageAnchor) positionLanguageMenu(window.__tleLanguageAnchor); });
  window.addEventListener("scroll",()=>{ if(window.__tleLanguageAnchor) positionLanguageMenu(window.__tleLanguageAnchor); },true);

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
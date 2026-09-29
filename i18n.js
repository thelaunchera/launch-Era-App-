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
    "Review your invoice details below.":"Revisa los detalles de tu factura.",
    "Payment confirmed by the cleaning business.":"Pago confirmado por el negocio.",
    "Payment method sent":"Forma de pago enviada",
    "We received your payment choice.":"Recibimos tu forma de pago.",
    "The business will confirm it once the payment is received.":"El negocio la confirmará cuando reciba el pago.",
    "Done":"Listo",
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
    "Booking requests":"Solicitudes de reserva",
    "Waiting for review":"Esperando revisión",
    "TODAY":"HOY",
    "Schedule + route":"Horario + ruta",
    "Full calendar →":"Calendario completo →",
    "QUICK ACTIONS":"ACCIONES RÁPIDAS",
    "Quick actions":"Acciones rápidas",
    "Add client":"Añadir cliente",
    "Create quote":"Crear cotización",
    "Booking link":"Link de reservas",
    "Create invoice":"Crear factura",
    "Log mileage":"Registrar millaje",
    "Track time":"Registrar tiempo",
    "NEEDS ATTENTION":"NECESITA ATENCIÓN",
    "Needs attention":"Requiere atención",
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
    "Owner settings":"Ajustes del dueño",
    "Platform Admin":"Plataforma",
    "Help & FAQ":"Ayuda",
    "30-day trial":"Prueba de 30 días",
    "Full access":"Acceso completo",
    "Then $5.99/month. No card required to start.":"Luego $5.99/mes.",
    "Sign out":"Cerrar sesión",
    "+ Add New":"+ Nuevo",
    "BOOKING CENTER":"RESERVAS",
    "Booking Page":"Página de reservas",
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
    "Today’s route":"Ruta de hoy",
    "MILEAGE":"MILLAJE",
    "Mileage log":"Registro de millaje",
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
    "Business reports":"Reportes del negocio",
    "Revenue this month":"Ingresos este mes",
    "Confirmed payments recorded this month.":"Pagos confirmados registrados este mes.",
    "Jobs completed":"Trabajos completados",
    "No completed jobs yet.":"Todavía no hay trabajos completados.",
    "Business miles":"Millas del negocio",
    "Tracked mileage this month.":"Millaje registrado este mes.",
    "Work hours":"Horas trabajadas",
    "Tracked team time this month.":"Tiempo del equipo registrado este mes.",
    "SERVICES + ADD-ONS":"SERVICIOS + EXTRAS",
    "Services + add-ons":"Servicios + extras",
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
    "Business settings":"Ajustes del negocio",
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
    "Help Center":"Centro de ayuda",
    "Install the app on your phone, share access with your team, and find answers to the most common questions.":"Instala la app en tu teléfono, comparte acceso con tu equipo y encuentra respuestas a las preguntas más comunes.",
    "IPHONE":"IPHONE",
    "iPhone install":"Instalación en iPhone",
    "Open the app in Safari.":"Abre la app en Safari.",
    "Tap the Share button.":"Toca el botón Compartir.",
    "Scroll and tap Add to Home Screen.":"Desliza y toca Añadir a pantalla de inicio.",
    "Tap Add.":"Toca Añadir.",
    "It will open from your Home Screen like an app.":"Se abrirá desde tu pantalla de inicio como una app.",
    "ANDROID":"ANDROID",
    "Android install":"Instalación en Android",
    "Open the app in Chrome.":"Abre la app en Chrome.",
    "Tap the ⋮ menu.":"Toca el menú ⋮.",
    "Tap Install app or Add to Home screen.":"Toca Instalar app o Añadir a pantalla de inicio.",
    "Confirm Install.":"Confirma Instalar.",
    "SHARE ACCESS":"COMPARTIR ACCESO",
    "Access sharing":"Compartir acceso",
    "ACCESS LEVELS":"NIVELES DE ACCESO",
    "Access levels":"Niveles de acceso",
    "Owner":"Dueño",
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
    "Access":"Acceso",
    "+ Invite teammate":"+ Invitar Admin",
    "PLAN + BILLING":"PLAN + FACTURACIÓN",
    "Subscription":"Suscripción",
    "Status":"Estado",
    "Trial ends":"La prueba termina",
    "30 days":"30 días",
    "After trial":"Después de la prueba",
    "SECURITY":"SEGURIDAD",
    "Security":"Seguridad",
    "Workspace ownership":"Propiedad del espacio",
    "Cannot be changed by Admin or Worker.":"No puede cambiarlo un Admin ni un Trabajador.",
    "Permissions":"Permisos",
    "Only the owner can promote, demote or remove access.":"Solo el owner puede cambiar roles o eliminar accesos.",
    "Data protection":"Protección de datos",
    "Business records are isolated by account permissions.":"Los datos de cada negocio están aislados por permisos de cuenta.",
    "INTEGRATIONS":"INTEGRACIONES",
    "Integrations":"Integraciones",
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
      "From":"De","To":"À","Note (optional)":"Note (facultatif)","Job (optional)":"Travail (facultatif)","Français":"Français","English":"English","Español":"Español",
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


  extra.ht={
  "Sign in": "Konekte",
  "Create account": "Kreye kont",
  "Email": "Imèl",
  "Password": "Modpas",
  "Forgot password?": "Ou bliye modpas la?",
  "Already have an account? Sign in": "Ou deja gen yon kont? Konekte",
  "Already have an account?": "Ou deja gen yon kont?",
  "Create your cleaning business account.": "Kreye kont biznis netwayaj ou.",
  "Open your cleaning business workspace.": "Louvri espas travay biznis netwayaj ou.",
  "Business name": "Non biznis la",
  "Phone": "Telefòn",
  "Phone (optional)": "Telefòn (opsyonèl)",
  "Service area": "Zòn sèvis",
  "Create my workspace": "Kreye espas travay mwen",
  "FIRST SETUP": "PREMYE KONFIGIRASYON",
  "Tell me about your business.": "Pale nou de biznis ou.",
  "Today": "Jodi a",
  "Tomorrow": "Demen",
  "Booking Center": "Sant rezèvasyon",
  "Leads": "Pwospè",
  "Clients": "Kliyan",
  "Calendar + Jobs": "Kalandriye + travay",
  "Calendar": "Kalandriye",
  "Quotes": "Devis",
  "Invoices": "Fakti",
  "Today's Route": "Wout jodi a",
  "Mileage": "Kilometraj",
  "Time Tracking": "Suivi tan",
  "Supplies": "Founiti",
  "Owner Reports": "Rapò pwopriyetè",
  "Reports": "Rapò",
  "Services + Add-ons": "Sèvis + opsyon",
  "Team": "Ekip",
  "Settings": "Paramèt",
  "Owner settings": "Paramèt pwopriyetè",
  "Owner Admin": "Admin pwopriyetè",
  "Help & FAQ": "Èd ak FAQ",
  "Log out": "Dekonekte",
  "Change language": "Chanje lang",
  "Good morning": "Bonjou",
  "Good afternoon": "Bon aprèmidi",
  "Good evening": "Bonswa",
  "Booking requests": "Demann rezèvasyon",
  "Open quotes": "Devis ouvè",
  "Outstanding invoices": "Fakti ki poko peye",
  "Today's jobs": "Travay jodi a",
  "Add client": "Ajoute kliyan",
  "Create quote": "Kreye devis",
  "Create invoice": "Kreye fakti",
  "Log mileage": "Anrejistre kilometraj",
  "Track time": "Suiv tan",
  "Start timer": "Kòmanse kronomèt",
  "Finish timer": "Fini kronomèt",
  "Current job": "Travay aktyèl",
  "No timer running.": "Pa gen kronomèt k ap mache.",
  "Start time from an assigned job when work begins.": "Kòmanse tan an nan travay ki asiyen an lè travay la kòmanse.",
  "Running": "Aktif",
  "Off": "Etenn",
  "On my way": "Sou wout",
  "Start job": "Kòmanse travay",
  "Complete": "Fini",
  "Completed": "Fini",
  "Call client": "Rele kliyan",
  "No assigned jobs.": "Pa gen travay ki asiyen.",
  "Your owner or admin will assign jobs when they are ready.": "Pwopriyetè oswa admin ou ap asiyen travay lè yo pare.",
  "Cleaning job": "Travay netwayaj",
  "Cleaning": "Netwayaj",
  "Nothing urgent.": "Pa gen anyen ijan.",
  "No jobs today.": "Pa gen travay jodi a.",
  "Booking page": "Paj rezèvasyon",
  "Open page": "Louvri paj",
  "Open profile": "Louvri pwofil",
  "Privacy": "Konfidansyalite",
  "Terms": "Kondisyon",
  "Share this app": "Pataje aplikasyon sa a",
  "Feedback": "Opinyon",
  "Help": "Èd",
  "Restart tour": "Rekòmanse gid la",
  "Business email": "Imèl biznis",
  "Default language": "Lang pa defo",
  "Time zone": "Zòn lè",
  "Customer communication language": "Lang kominikasyon kliyan",
  "Controls the language you see inside the app.": "Sa kontwole lang ou wè andedan aplikasyon an.",
  "Default for customer emails, quotes, invoices, booking confirmations, reminders and follow-ups. A customer can keep their own preferred language.": "Lang pa defo pou imèl kliyan, devis, fakti, konfimasyon rezèvasyon, rapèl ak swivi. Chak kliyan ka kenbe lang li prefere.",
  "Client email language": "Lang imèl kliyan",
  "Used for automatic quote, booking, invoice, payment and follow-up emails. It can be different from your app language.": "Yo itilize sa pou imèl otomatik devis, rezèvasyon, fakti, peman ak swivi. Li ka diferan ak lang aplikasyon an.",
  "Edit business details": "Modifye enfòmasyon biznis",
  "Save business details": "Sove enfòmasyon biznis",
  "Client payment methods": "Metòd peman kliyan",
  "Cash": "Lajan kach",
  "Check": "Chèk",
  "Zelle": "Zelle",
  "E-transfer": "Transfè elektwonik",
  "Bank transfer": "Transfè labank",
  "Other": "Lòt",
  "Country": "Peyi",
  "Currency": "Lajan",
  "Distance": "Distans",
  "Kilometers": "Kilomèt",
  "Miles": "Mil",
  "Business distance": "Distans biznis",
  "Log distance": "Anrejistre distans",
  "Payment methods": "Metòd peman",
  "Guest Employee Access": "Aksè anplwaye envite",
  "GUEST EMPLOYEE ACCESS": "AKSÈ ANPLWAYE ENVITE",
  "Welcome, guest 👋": "Byenveni, envite 👋",
  "MY WORK": "TRAVAY MWEN",
  "Assigned jobs": "Travay ki asiyen",
  "Route + address": "Wout + adrès",
  "Job status": "Estati travay",
  "Messages": "Mesaj",
  "MESSAGE CENTER": "SANT MESAJ",
  "Send message": "Voye mesaj",
  "Message your admin": "Ekri admin ou",
  "Message employee": "Ekri anplwaye",
  "No messages yet.": "Pa gen mesaj ankò.",
  "Type a message…": "Ekri yon mesaj…",
  "Worker Access": "Aksè anplwaye",
  "Exit": "Soti",
  "LIMITED ACCESS": "AKSÈ LIMITE",
  "What you can use": "Sa ou ka itilize",
  "BOOK A CLEANING": "REZÈVE YON NETWAYAJ",
  "REQUEST A QUOTE": "MANDE YON DEVIS",
  "Book a Cleaning": "Rezève yon netwayaj",
  "Request a Quote": "Mande yon devis",
  "Choose your service and send your request.": "Chwazi sèvis ou epi voye demann ou.",
  "Cleaning service": "Sèvis netwayaj",
  "Service": "Sèvis",
  "Choose a service": "Chwazi yon sèvis",
  "Add-ons": "Opsyon",
  "Date": "Dat",
  "Time": "Lè",
  "Preferred time": "Lè ou prefere",
  "Available times": "Lè ki disponib",
  "Name": "Non",
  "Preferred contact": "Kontak prefere",
  "Text": "SMS",
  "WhatsApp": "WhatsApp",
  "Service address": "Adrès sèvis",
  "Notes": "Nòt",
  "Send booking request": "Voye demann rezèvasyon",
  "Send quote request": "Voye demann devis",
  "Request received": "Demann resevwa",
  "INVOICE": "FAKTI",
  "Invoice": "Fakti",
  "Subtotal": "Sou-total",
  "Paid": "Peye",
  "Balance due": "Balans pou peye",
  "Total": "Total",
  "Review your quote": "Revize devis ou",
  "Decline": "Refize",
  "Accept quote": "Aksepte devis",
  "Submit quote": "Voye devis",
  "Submit invoice": "Voye fakti",
  "Payment is arranged directly with the cleaning business. No card payment is collected on this page.": "Peman fèt dirèkteman ak biznis netwayaj la. Pa gen peman kat ki fèt sou paj sa a.",
  "Business drive": "Vwayaj biznis",
  "Job": "Travay",
  "Type": "Kalite",
  "No mileage logged yet.": "Pa gen kilometraj ki anrejistre ankò.",
  "Save mileage": "Sove kilometraj",
  "From": "Soti",
  "To": "Pou",
  "Note (optional)": "Nòt (opsyonèl)",
  "Job (optional)": "Travay (opsyonèl)",
  "Try again": "Eseye ankò",
  "Close": "Fèmen",
  "Start tour": "Kòmanse gid",
  "Got it": "Mwen konprann",
  "Review your invoice details below.": "Revize detay fakti ou anba a.",
  "Selected": "Chwazi",
  "Tap Submit invoice to send this choice.": "Peze Voye fakti pou voye chwa sa a.",
  "Choose a payment method, then submit your choice.": "Chwazi yon metòd peman, epi voye chwa ou.",
  "Submitting your payment choice…": "N ap voye chwa peman ou…",
  "Submitted": "Voye",
  "The business will confirm payment after it is received.": "Biznis la ap konfime peman an apre li resevwa li.",
  "Please explain what you would like reviewed.": "Tanpri esplike sa ou ta renmen yo revize.",
  "Sending dispute…": "N ap voye kontestasyon an…",
  "Dispute sent. The cleaning business can now review your message.": "Kontestasyon an voye. Biznis netwayaj la ka revize mesaj ou kounye a.",
  "Invoice unavailable": "Fakti pa disponib",
  "QUOTE": "DEVIS",
  "Review the details below and choose Accept or Decline.": "Revize detay yo anba a epi chwazi Aksepte oswa Refize.",
  "Quote for": "Devis pou",
  "your cleaning": "netwayaj ou",
  "Accepted. Your service is confirmed.": "Aksepte. Sèvis ou konfime.",
  "This quote was declined.": "Devis sa a te refize.",
  "This quote is not currently awaiting a response.": "Devis sa a pa ap tann yon repons kounye a.",
  "Quote unavailable": "Devis pa disponib",
  "Choose a service and date first.": "Chwazi yon sèvis ak yon dat an premye.",
  "Checking availability…": "N ap tcheke disponiblite…",
  "No openings on this date. Try another day.": "Pa gen lè ki disponib nan dat sa a. Eseye yon lòt jou.",
  "Phone is required for Text or WhatsApp.": "Telefòn obligatwa pou SMS oswa WhatsApp.",
  "Sending…": "N ap voye…",
  "Choose one of the available times.": "Chwazi youn nan lè ki disponib yo.",
  "Page unavailable": "Paj pa disponib",
  "Current location": "Kote aktyèl",
  "Not viewed yet": "Poko wè",
  "Viewed": "Wè",
  "LOCAL WEATHER": "TAN LOKAL",
  "Weather unavailable": "Tan an pa disponib",
  "Updating weather…": "N ap mete tan an ajou…",
  "Snow now in your area.": "Nèj ap tonbe nan zòn ou kounye a.",
  "Storms are active now in your area.": "Gen tanpèt nan zòn ou kounye a.",
  "Rain now in your area.": "Lapli ap tonbe nan zòn ou kounye a.",
  "Snow expected": "Nèj prevwa",
  "Storms expected": "Tanpèt prevwa",
  "Rain expected": "Lapli prevwa",
  " around ": " anviwon ",
  "Check the required fields above and try again.": "Tcheke chan obligatwa yo anlè epi eseye ankò.",
  "The email or password doesn’t match. Check them and try again.": "Imèl oswa modpas la pa koresponn. Tcheke yo epi eseye ankò.",
  "Confirm your email first, then sign in.": "Konfime imèl ou an premye, apre sa konekte.",
  "That email already has an account. Sign in instead of creating another one.": "Imèl sa a deja gen yon kont. Konekte olye ou kreye yon lòt.",
  "We couldn’t complete this. Check the required fields and tap “Try again”.": "Nou pa t ka fini sa. Tcheke chan obligatwa yo epi peze “Eseye ankò”.",
  "The error is still happening. Support has been alerted. Check the required fields and try again.": "Erè a toujou ap rive. Sipò deja resevwa alèt. Tcheke chan obligatwa yo epi eseye ankò.",
  "CLEANING APP": "CLEANING APP",
  "Your cleaning business shouldn’t live in DMs, notes and memory.": "Biznis netwayaj ou pa ta dwe rete nan mesaj, nòt ak memwa.",
  "Keep clients, quotes, bookings, jobs and invoices in one organized place.": "Kenbe kliyan, devis, rezèvasyon, travay ak fakti nan yon sèl kote òganize.",
  "Simple setup": "Konfigirasyon senp",
  "No card required": "Pa bezwen kat",
  "Get 30 days free": "Jwenn 30 jou gratis",
  "No card required · Then $5.99/month": "Pa bezwen kat · Apre sa $5.99/mwa",
  "← Back": "← Retounen",
  "Your workspace is ready. Check the calendar and what’s next.": "Espas travay ou pare. Tcheke kalandriye a ak sa k ap vini.",
  "View calendar →": "Gade kalandriye →",
  "Remember username": "Sonje non itilizatè",
  "Hide password": "Kache modpas",
  "Show password": "Montre modpas",
  "We couldn’t create your workspace. Try again.": "Nou pa t ka kreye espas travay ou. Eseye ankò.",
  "No conversation yet.": "Pa gen konvèsasyon ankò.",
  "Messages from your admin will appear here.": "Mesaj admin ou ap parèt isit la.",
  "Write the first message below.": "Ekri premye mesaj la anba a.",
  "Customer": "Kliyan",
  "Quote accepted": "Devis aksepte",
  "Quote declined": "Devis refize",
  "New quote request": "Nouvo demann devis",
  "Quote request": "Demann devis",
  "Payment method selected": "Metòd peman chwazi",
  "Payment received": "Peman resevwa",
  "New dispute": "Nouvo kontestasyon",
  "Job started": "Travay kòmanse",
  "Job completed": "Travay fini",
  "Employee": "Anplwaye",
  "New team message": "Nouvo mesaj ekip",
  "Customer marked this email as spam": "Kliyan an make imèl sa a kòm spam",
  "Email needs verification": "Imèl la bezwen verifikasyon",
  "Customer email": "Imèl kliyan",
  "EMAIL DELIVERY ISSUE": "PWOBLÈM LIVREZON IMÈL",
  "Verify the email address before sending again.": "Verifye adrès imèl la anvan ou voye ankò.",
  "Email not delivered": "Imèl pa delivre",
  "The email provider could not deliver this message.": "Founisè imèl la pa t ka livre mesaj sa a.",
  "Status": "Estati",
  "Detected": "Detekte",
  "Check clients": "Tcheke kliyan",
  "Job details are no longer available.": "Detay travay la pa disponib ankò.",
  "BOOKING REQUEST": "DEMANN REZÈVASYON",
  "INQUIRY": "DEMANN",
  "SERVICE": "SÈVIS",
  "Address": "Adrès",
  "Requested date & time": "Dat ak lè yo mande",
  "Frequency": "Frekans",
  "Email language": "Lang imèl",
  "Open client": "Louvri kliyan",
  "Open lead": "Louvri pwospè",
  "Booking request": "Demann rezèvasyon",
  "Lead": "Pwospè",
  "Payment": "Peman",
  "Payment choice": "Chwa peman",
  "Dispute": "Kontestasyon",
  "Job update": "Mizajou travay",
  "Team message": "Mesaj ekip",
  "Email delivery issue": "Pwoblèm livrezon imèl",
  "Notification": "Notifikasyon",
  "Notifications": "Notifikasyon",
  "You’re all caught up": "Tout bagay ajou",
  "Only new notifications will appear here.": "Sèlman nouvo notifikasyon ap parèt isit la.",
  "New notification": "Nouvo notifikasyon",
  "Some data couldn’t refresh. Your saved data is safe; tap Refresh to try again.": "Kèk done pa t ka rafrechi. Done ki sove yo an sekirite; peze Rafrechi pou eseye ankò.",
  "More actions": "Plis aksyon",
  "No invoices yet.": "Pa gen fakti ankò.",
  "Create one manually or accept a quote to prepare a draft invoice.": "Kreye youn manyèlman oswa aksepte yon devis pou prepare yon fakti bouyon.",
  "New invoice": "Nouvo fakti",
  "Paid in full": "Peye nèt",
  "Collect now": "Kolekte kounye a",
  "Ready to send": "Pare pou voye",
  "Balance left": "Balans ki rete",
  "Awaiting payment": "Ap tann peman",
  "remaining": "rete",
  "total": "total",
  "Due ": "Dwe ",
  "Invoice total": "Total fakti",
  "Custom quote": "Devis pèsonalize",
  "No add-ons": "Pa gen opsyon",
  "Quote path": "Chemen devis",
  "No clients yet.": "Pa gen kliyan ankò.",
  "Confirmed bookings add clients automatically. You can also add one manually.": "Rezèvasyon konfime ajoute kliyan otomatikman. Ou ka ajoute youn manyèlman tou.",
  "Paid up": "Ajou",
  "Next cleaning": "Pwochen netwayaj",
  "Not scheduled": "Pa pwograme",
  "Last cleaning": "Dènye netwayaj",
  "Info": "Enfòmasyon",
  "Client not found": "Kliyan pa jwenn",
  "Recurring": "Repete",
  "Quote": "Devis",
  "Lead / inquiry": "Pwospè / demann",
  "CLIENT INFO": "ENFÒMASYON KLIYAN",
  "Contact details and full activity history in one place.": "Detay kontak ak tout istwa aktivite nan yon sèl kote.",
  "⚠ Email needs verification": "⚠ Imèl la bezwen verifikasyon",
  "A recent email could not be delivered. Confirm or correct this address before sending again.": "Yon imèl resan pa t ka delivre. Konfime oswa korije adrès sa a anvan ou voye ankò.",
  "No": "Non",
  "Client notes": "Nòt kliyan",
  "Upcoming": "K ap vini",
  "Invoiced": "Faktire",
  "History": "Istwa",
  "No history yet.": "Pa gen istwa ankò.",
  "Edit client": "Modifye kliyan",
  "Inactive": "Inaktif",
  "Quote required": "Devis obligatwa",
  "Bookable": "Ka rezève",
  "Custom": "Pèsonalize",
  "Duration": "Dire",
  "Pricing": "Pri",
  "Upfront": "Pri dirèk",
  "Included by default": "Enkli pa defo",
  "No add-ons yet": "Pa gen opsyon ankò",
  "Edit service": "Modifye sèvis",
  "Add-on": "Opsyon",
  "Deactivate": "Dezaktive",
  "Activate": "Aktive",
  "GENERAL": "JENERAL",
  "General add-ons": "Opsyon jeneral",
  "Available across services": "Disponib pou tout sèvis",
  "Add service": "Ajoute sèvis",
  "Set price, duration and booking basics.": "Mete pri, dire ak baz rezèvasyon.",
  "No incoming jobs in the next 3 days.": "Pa gen travay k ap vini nan pwochen 3 jou yo.",
  "One-time and recurring jobs will appear here when they fall inside the 72-hour window.": "Travay yon sèl fwa ak travay repete ap parèt isit la lè yo antre nan fenèt 72 èdtan an.",
  "Add a job →": "Ajoute yon travay →",
  "Month": "Mwa",
  "MONTH VIEW": "VIZYON MWA",
  "14 days": "14 jou",
  "NEXT 2 WEEKS": "PWOCHEN 2 SEMÈN",
  "No jobs are scheduled for this day.": "Pa gen travay pwograme pou jou sa a.",
  "1 scheduled job": "1 travay pwograme",
  "DAY DETAILS": "DETAY JOU",
  "Close day details": "Fèmen detay jou",
  "Not assigned": "Pa asiyen",
  "Address not added": "Adrès pa ajoute",
  "Unassigned client": "Kliyan pa asiyen",
  "Assigned to": "Asiyen bay",
  "Edit job": "Modifye travay",
  "Partial payment": "Peman pasyèl",
  "Booked + invoice created": "Rezève + fakti kreye",
  "Waiting for customer": "Ap tann kliyan",
  "Declined by customer": "Kliyan refize",
  "Needs your price": "Bezwen pri ou",
  "Ready to finish": "Pare pou fini",
  "Next: follow up": "Apre: fè swivi",
  "Next: build quote": "Apre: prepare devis",
  "Next: send to client": "Apre: voye bay kliyan",
  "Converted to work": "Konvèti an travay",
  "Review when useful": "Revize lè sa itil",
  "Nothing needs attention here.": "Pa gen anyen ki bezwen atansyon isit la.",
  "Requested": "Mande",
  "Draft": "Bouyon",
  "Sent": "Voye",
  "Accepted": "Aksepte",
  "Declined": "Refize",
  "Good morning · your day is ready": "Bonjou · jounen ou pare",
  "Good morning · let’s see what’s ahead": "Bonjou · ann wè sa k ap vini",
  "Good morning · one clear step at a time": "Bonjou · yon etap klè alafwa",
  "Good afternoon · here’s where things stand": "Bon aprèmidi · men kote bagay yo ye",
  "Good afternoon · let’s check what’s next": "Bon aprèmidi · ann wè sa k ap vini",
  "Good afternoon · keep the day moving": "Bon aprèmidi · kontinye avanse",
  "Good afternoon · your next steps are here": "Bon aprèmidi · pwochen etap ou yo isit la",
  "Good evening · let’s wrap things up": "Bonswa · ann fini jounen an",
  "Good evening · the day is almost done": "Bonswa · jounen an prèske fini",
  "It’s snowing now.": "Nèj ap tonbe kounye a.",
  "Storms are active now.": "Gen tanpèt kounye a.",
  "It’s raining now.": "Lapli ap tonbe kounye a.",
  "Snow": "Nèj",
  "Storms": "Tanpèt",
  "Rain": "Lapli",
  "Find anything fast.": "Jwenn nenpòt bagay vit.",
  "Search clients, jobs, quotes and invoices.": "Chèche kliyan, travay, devis ak fakti.",
  "No matches.": "Pa gen rezilta.",
  "Try a name, email, address or number.": "Eseye yon non, imèl, adrès oswa nimewo.",
  "YOUR WORKSPACE IS READY": "ESPAS TRAVAY OU PARE",
  "Get ready for your first booking.": "Prepare pou premye rezèvasyon ou.",
  "Set up what clients can book, when they can book, then share your link.": "Mete sa kliyan ka rezève, kilè yo ka rezève, epi pataje lyen ou.",
  "Set up booking →": "Konfigire rezèvasyon →",
  "New this week": "Nouvo semèn sa a",
  "Ready to grow": "Pare pou grandi",
  "About the same as last week": "Prèske menm jan ak semèn pase",
  "vs last week": "kont semèn pase",
  "Est. scheduled this week": "Estimasyon pwograme semèn sa a",
  "Collected this week": "Kolekte semèn sa a",
  "Jobs this week": "Travay semèn sa a",
  "New clients": "Nouvo kliyan",
  "CAPACITY": "KAPASITE",
  "This week": "Semèn sa a",
  "YOUR NEXT MOVE": "PWOCHEN ETAP OU",
  "QUICK ACTIONS": "AKSYON RAPID",
  "Keep the day moving": "Kontinye jounen an",
  "FOLLOW THROUGH": "SWIVI",
  "Open items": "Bagay ouvè",
  "THIS WEEK": "SEMÈN SA A",
  "Work hours": "Lè travay",
  "CLIENT-FACING LINKS": "LYEN POU KLIYAN",
  "Your business online": "Biznis ou sou entènèt",
  "Add availability to see how full your week is.": "Ajoute disponiblite pou wè kijan semèn ou plen.",
  "See open time →": "Gade lè ki lib →",
  "Nothing urgent is waiting. Tomorrow is ready for a clean start.": "Pa gen anyen ijan k ap tann. Demen pare pou yon nouvo kòmansman.",
  "Storms are active in your area. Your workspace is calm with no urgent jobs or new requests waiting.": "Gen tanpèt nan zòn ou. Espas travay ou kalm, san travay ijan ni nouvo demann k ap tann.",
  "Rain is moving through your area. No urgent jobs or new requests are waiting.": "Lapli ap pase nan zòn ou. Pa gen travay ijan ni nouvo demann k ap tann.",
  "Snow is active in your area. No urgent jobs or new requests are waiting.": "Nèj ap tonbe nan zòn ou. Pa gen travay ijan ni nouvo demann k ap tann.",
  "Cloudy outside, calm inside. No urgent jobs or new requests are waiting.": "Nublado deyò, kalm isit la. Pa gen travay ijan ni nouvo demann k ap tann.",
  "Midday is clear. No urgent jobs or new requests are waiting.": "Mitan jounen an kalm. Pa gen travay ijan ni nouvo demann k ap tann.",
  "The route is clear. Nothing urgent is waiting.": "Wout la klè. Pa gen anyen ijan k ap tann.",
  "Everything is up to date. Good time to check the calendar and what’s next.": "Tout bagay ajou. Se yon bon moman pou tcheke kalandriye a ak sa k ap vini.",
  "Open route →": "Louvri wout →",
  "Review requests →": "Revize demann →",
  "Review quotes →": "Revize devis →",
  "Review invoices →": "Revize fakti →",
  "Collect payment →": "Kolekte peman →",
  "Follow up →": "Fè swivi →",
  "Review it before the customer keeps looking.": "Revize li anvan kliyan an kontinye chèche.",
  "Review bookings →": "Revize rezèvasyon →",
  "Everything important is caught up.": "Tout bagay enpòtan ajou.",
  "Use the open time this week to fill the calendar or follow up with past clients.": "Itilize lè ki lib semèn sa a pou ranpli kalandriye a oswa fè swivi ak ansyen kliyan.",
  "scheduled": "pwograme",
  "See reports →": "Gade rapò →",
  "Add a service address first.": "Ajoute yon adrès sèvis an premye.",
  "Open in Maps": "Louvri nan Maps",
  "Open GPS route": "Louvri wout GPS",
  "Every week": "Chak semèn",
  "Every 2 weeks": "Chak 2 semèn",
  "Monthly": "Chak mwa",
  "One time": "Yon sèl fwa",
  "Regular upkeep": "Antretyen regilye",
  "Needs extra attention": "Bezwen plis atansyon",
  "Heavy buildup": "Gwo akimilasyon",
  "Move-in / move-out": "Antre / soti",
  "Not sure": "Pa sèten",
  "Commercial": "Komèsyal",
  "Residential": "Rezidansyèl",
  "bed": "chanm",
  "bath": "twalèt",
  "restroom": "twalèt",
  "level": "nivo",
  "new": "nouvo",
  "No booking requests waiting.": "Pa gen demann rezèvasyon k ap tann.",
  "Reviewed requests leave this list automatically after 12 hours.": "Demann ki revize yo soti nan lis sa a otomatikman apre 12 èdtan.",
  "Linked to existing client:": "Lye ak kliyan ki deja egziste:",
  "Checked": "Tcheke",
  "Check client": "Tcheke kliyan",
  "Approve booking": "Apwouve rezèvasyon",
  "Owner access required.": "Aksè pwopriyetè obligatwa.",
  "BUSINESS": "BIZNIS",
  "Edit business basics": "Modifye enfòmasyon baz biznis",
  "Update your company details. Time zone and country are detected from your service area.": "Mete enfòmasyon konpayi ou ajou. Zòn lè ak peyi detekte apati zòn sèvis ou.",
  "City, region, country": "Vil, rejyon, peyi",
  "Detected automatically from your service area.": "Detekte otomatikman apati zòn sèvis ou.",
  "YOUR APP": "APLIKASYON OU",
  "App preferences": "Preferans aplikasyon",
  "These settings change your workspace, not the language your customers receive by email.": "Paramèt sa yo chanje espas travay ou, pa lang kliyan yo resevwa pa imèl.",
  "App language": "Lang aplikasyon",
  "Customer email language is controlled separately in Client Communication.": "Lang imèl kliyan kontwole separeman nan Kominikasyon Kliyan.",
  "Save app preferences": "Sove preferans aplikasyon",
  "PAYMENTS": "PEMAN",
  "Client payment options": "Opsyon peman kliyan",
  "Choose the payment methods clients can select on invoices.": "Chwazi metòd peman kliyan ka chwazi sou fakti.",
  "Enabled methods": "Metòd aktive",
  "Add another payment method": "Ajoute yon lòt metòd peman",
  "e.g. Venmo, Cash App": "Eg. Venmo, Cash App",
  "The app stores the payment choice, not bank credentials.": "Aplikasyon an sove chwa peman an, pa enfòmasyon bankè.",
  "Save payment options": "Sove opsyon peman",
  "Service area is required.": "Zòn sèvis obligatwa.",
  "Business name is required.": "Non biznis la obligatwa.",
  "Business email is required.": "Imèl biznis obligatwa.",
  "Use a 3-letter currency code.": "Itilize yon kòd lajan 3 lèt.",
  "Choose at least one payment method.": "Chwazi omwen yon metòd peman.",
  "Connected": "Konekte",
  "Loading booking link…": "N ap chaje lyen rezèvasyon…",
  "Loading quote link…": "N ap chaje lyen devis…",
  "Open booking link": "Louvri lyen rezèvasyon",
  "Open quote request link": "Louvri lyen demann devis",
  "Included with this service": "Enkli ak sèvis sa a",
  "Service add-ons are selected automatically. Uncheck anything this job does not need.": "Opsyon sèvis yo chwazi otomatikman. Dezaktive nenpòt sa travay sa a pa bezwen.",
  "Included by default · ": "Enkli pa defo · ",
  "Optional · ": "Opsyonèl · ",
  "No add-ons for this service.": "Pa gen opsyon pou sèvis sa a.",
  "Choose whether customers see a price now or request a custom quote.": "Chwazi si kliyan yo wè yon pri kounye a oswa mande yon devis pèsonalize.",
  "Service name": "Non sèvis",
  "Customer pricing": "Pri kliyan",
  "Upfront price": "Pri dirèk",
  "Not needed": "Pa nesesè",
  "Duration (minutes)": "Dire (minit)",
  "Description": "Deskripsyon",
  "Active service": "Sèvis aktif",
  "Save changes": "Sove chanjman",
  "ADD-ON": "OPSYON",
  "Edit add-on": "Modifye opsyon",
  "Add add-on": "Ajoute opsyon",
  "Assign it to a service to include it automatically. It can still be removed for any individual booking.": "Asiyen li ak yon sèvis pou li enkli otomatikman. Ou ka toujou retire li pou yon rezèvasyon espesifik.",
  "Edit drive": "Modifye vwayaj",
  "Log drive": "Anrejistre vwayaj",
  "Keep business distance simple with separate From and To fields.": "Kenbe distans biznis la senp ak chan Soti ak Pou separe.",
  "Feedback sent. Thank you!": "Opinyon voye. Mèsi!",
  "Enter a valid distance.": "Antre yon distans valab.",
  "Mileage saved": "Kilometraj sove",
  "Quote sent.": "Devis voye.",
  "Waiting for the customer to accept. This window will stay open until you close it.": "N ap tann kliyan an aksepte. Fenèt sa a ap rete ouvè jiskaske ou fèmen li.",
  "Quote emailed to customer": "Devis voye pa imèl bay kliyan",
  "Active timer not found.": "Kronomèt aktif pa jwenn.",
  "Finishing timer": "N ap fini kronomèt la",
  "Could not confirm that the timer stopped.": "Nou pa t ka konfime kronomèt la te sispann.",
  "Only Owner or Admin can delete records.": "Se sèlman Pwopriyetè oswa Admin ki ka efase dosye.",
  "client": "kliyan",
  "lead": "pwospè",
  "quote": "devis",
  "invoice": "fakti",
  "Permanently delete this client? Related jobs and invoices will also be deleted. This cannot be undone.": "Efase kliyan sa a nèt? Travay ak fakti ki lye yo ap efase tou. Sa pa ka anile.",
  "Permanently delete this invoice? Its payments, items, public link and related disputes will also be deleted.": "Efase fakti sa a nèt? Peman, atik, lyen piblik ak kontestasyon ki lye yo ap efase tou.",
  "Permanently delete this quote? Its items, public link and related disputes will also be deleted.": "Efase devis sa a nèt? Atik, lyen piblik ak kontestasyon ki lye yo ap efase tou.",
  "Deleted": "Efase",
  "Deleting…": "N ap efase…",
  "Could not delete": "Pa t ka efase",
  "Finishing…": "N ap fini…",
  "Timer finished": "Kronomèt fini",
  "Could not finish timer": "Pa t ka fini kronomèt",
  "MILEAGE": "KILOMETRAJ",
  "Add the distance driven for this assigned job.": "Ajoute distans ou kondwi pou travay sa a.",
  "Example: supply stop": "Egzanp: arè pou founiti",
  "Saving…": "N ap sove…",
  "Client email language saved": "Lang imèl kliyan sove",
  "Could not save language": "Pa t ka sove lang",
  "Save language": "Sove lang",
  "Keep bookings, clients, jobs, quotes and invoices organized in one place.": "Kenbe rezèvasyon, kliyan, travay, devis ak fakti òganize nan yon sèl kote.",
  "App shared": "Aplikasyon pataje",
  "App link copied": "Lyen aplikasyon kopye",
  "Refreshing…": "N ap rafrechi…",
  "App update ready. Loading the newest version without signing you out.": "Mizajou aplikasyon pare. N ap chaje vèsyon ki pi nouvo san dekonekte ou.",
  "New inquiry": "Nouvo demann",
  "Everything is up to date": "Tout bagay ajou",
  "Could not refresh. Try again.": "Pa t ka rafrechi. Eseye ankò.",
  "Property details": "Detay pwopriyete",
  "Enough detail for the business to price and prepare the job correctly.": "Bay ase detay pou biznis la ka mete pri epi prepare travay la kòrèkteman.",
  "Property type": "Kalite pwopriyete",
  "Choose one": "Chwazi youn",
  "Approx. property size": "Gwosè apwoksimatif pwopriyete",
  "Approximate is fine if you do not know the exact size.": "Yon estimasyon bon si ou pa konnen gwosè egzak la.",
  "Property size unit": "Inite gwosè",
  "Bedrooms": "Chanm",
  "Bathrooms": "Twalèt",
  "Floors / levels": "Etaj / nivo",
  "Pets in the home": "Bèt nan kay la",
  "No pets": "Pa gen bèt",
  "Yes": "Wi",
  "Prefer not to say": "Mwen prefere pa di",
  "Pet details": "Detay sou bèt",
  "e.g. 2 dogs, 1 cat": "Eg. 2 chen, 1 chat",
  "Space type": "Kalite espas",
  "Retail / storefront": "Boutik / lokal",
  "Medical / dental": "Medikal / dantè",
  "Restaurant / food service": "Restoran / sèvis manje",
  "Warehouse / industrial": "Depo / endistriyèl",
  "Restrooms": "Twalèt",
  "Business hours": "Orè biznis",
  "e.g. Mon–Fri 9:00–5:00": "Eg. lendi–vandredi 9:00–5:00",
  "Clean during business hours?": "Èske netwayaj ka fèt pandan lè biznis?",
  "Flexible": "Fleksib",
  "Current condition": "Kondisyon aktyèl",
  "When was it last professionally cleaned?": "Kilè yo te fè dènye netwayaj pwofesyonèl la?",
  "Less than a month ago": "Mwens pase yon mwa",
  "1–3 months ago": "1–3 mwa",
  "3–6 months ago": "3–6 mwa",
  "More than 6 months ago": "Plis pase 6 mwa",
  "Never / not sure": "Pa janm / pa sèten",
  "Access / parking": "Aksè / pakin",
  "Gate, parking, building access, stairs, elevator…": "Pòtay, pakin, aksè bilding, eskalye, asansè…",
  "Contact": "Kontak",
  "Where the business should send confirmations and follow-ups.": "Kote biznis la dwe voye konfimasyon ak swivi.",
  "Special requests": "Demann espesyal",
  "Pets, fragile items, priority rooms, add-ons, or anything else we should know.": "Bèt, bagay frajil, chanm priyoritè, opsyon oswa nenpòt lòt bagay nou dwe konnen.",
  "Times shown in the cleaning business’s local time": "Lè yo parèt nan lè lokal biznis netwayaj la",
  "Your device time zone": "Zòn lè aparèy ou",
  "(optional)": "(opsyonèl)",
  "Street, city, region, postal code, country": "Ri, vil, rejyon, kòd postal, peyi",
  "Parking, doorman, stairs, elevator…": "Pakin, gadyen, eskalye, asansè…",
  "Do not enter door, lockbox or alarm codes here.": "Pa antre kòd pòt, bwat kle oswa alam isit la.",
  "Secure request": "Demann an sekirite",
  "Choose request type": "Chwazi kalite demann",
  "Choose a service with upfront pricing, then pick a real available time.": "Chwazi yon sèvis ki gen pri davans, apre sa chwazi yon lè ki vrèman disponib.",
  "For custom or variable-price work. Choose a quote-only service and tell us about the job.": "Pou travay pèsonalize oswa pri varyab, chwazi yon sèvis ki mande devis epi eksplike travay la.",
  "Custom job type": "Kalite travay pèsonalize",
  "Choose a custom job type": "Chwazi yon kalite travay pèsonalize",
  "No quote-only services available yet": "Poko gen sèvis devis sèlman disponib",
  "No priced services available for online booking": "Poko gen sèvis ki gen pri disponib pou rezèvasyon sou entènèt",
  "Price provided after review": "Pri apre revizyon",
  "Your quote request was sent. The business will review it and contact you.": "Demann devis ou voye. Biznis la ap revize li epi kontakte ou.",
  "Your booking request was sent. The business will review it and confirm the appointment.": "Demann rezèvasyon ou voye. Biznis la ap revize li epi konfime randevou a.",
  "Could not send request": "Pa t ka voye demann",
  "Open Cleaning App": "Louvri Cleaning App",
  "How would you like to pay?": "Kijan ou ta renmen peye?",
  "Dispute invoice": "Konteste fakti",
  "What would you like the business to review?": "Kisa ou ta renmen biznis la revize?",
  "Send dispute": "Voye kontestasyon",
  "Recent activity": "Aktivite resan",
  "Availability": "Disponiblite",
  "Pricing + quotes": "Pri + devis",
  "Bookable services": "Sèvis ki ka rezève",
  "Public links": "Lyen piblik",
  "Outstanding": "Poko peye",
  "Paid this month": "Peye mwa sa a",
  "Open invoices": "Fakti ouvè",
  "+ New invoice": "+ Nouvo fakti",
  "Owner": "Pwopriyetè",
  "Admin": "Admin",
  "Admin access": "Aksè admin",
  "Guest employee": "Anplwaye envite",
  "Business workspace": "Espas travay biznis",
  "Refresh": "Rafrechi",
  "Security": "Sekirite",
  "Integrations": "Entegrasyon",
  "Access": "Aksè",
  "App subscription": "Abònman aplikasyon",
  "Subscription": "Abònman",
  "Trial": "Esè",
  "Trial ends": "Esè fini",
  "After trial": "Apre esè",
  "Owner only": "Pwopriyetè sèlman",
  "Private": "Prive",
  "Locked": "Bloke",
  "Protected": "Pwoteje",
  "Workers do not need passwords": "Anplwaye yo pa bezwen modpas",
  "Invite Admin": "Envite Admin",
  "Share worker link": "Pataje lyen anplwaye",
  "Contact me": "Kontakte mwen",
  "Share app": "Pataje aplikasyon"
};

  Object.assign(extra.ht,{
    "Clear":"Syèl klè",
    "Partly cloudy":"Pasyèlman nwaj",
    "Cloudy":"Nwaj",
    "Foggy":"Bwouya",
    "Drizzle":"Ti lapli",
    "Rain":"Lapli",
    "Snow":"Nèj",
    "Thunderstorms":"Tanpèt loraj",
    "Weather":"Tan",
    "Windy":"Gen van",
    "SECURITY":"SEKIRITE",
    "Security":"Sekirite",
    "INTEGRATIONS":"ENTEGRASYON",
    "Integrations":"Entegrasyon",
    "ACCESS + PERMISSIONS":"AKSÈ + PÈMISYON",
    "Access":"Aksè",
    "Permissions":"Pèmisyon",
    "Owner":"Pwopriyetè",
    "Admin":"Admin",
    "Worker":"Anplwaye",
    "Admin access":"Aksè admin",
    "Guest employee":"Anplwaye envite",
    "OWNER ONLY":"PWOPRIYETÈ SÈLMAN",
    "PLAN + BILLING":"PLAN + FAKTIRASYON",
    "Subscription":"Abònman",
    "Trial":"Esè",
    "Owner only":"Pwopriyetè sèlman",
    "Private":"Prive",
    "Locked":"Bloke",
    "Protected":"Pwoteje"
  });

  const uiCorrections={
    es:{
    "Visits":"Visitas",
    "Visitor locations":"Ubicaciones de visitantes",
    "Owner reports":"Reportes del dueño",
    "History":"Historial",
    "Due today":"Vence hoy",
    "Follow-up rules":"Reglas de seguimiento",
    "Follow-ups":"Seguimientos",
    "Availability":"Disponibilidad",
    "Pricing + quotes":"Precios + cotizaciones",
    "Bookable services":"Servicios reservables",
    "Public links":"Enlaces públicos",
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
      "On":"Activado",
      "No route today.":"No hay ruta hoy.",
      "Schedule jobs to build today’s stop list.":"Programa trabajos para crear la ruta de hoy.",
      "Your route appears here when jobs are scheduled.":"Tu ruta aparece aquí cuando hay trabajos programados.",
      "Completed this month.":"Completados este mes.",
      "No tracked time yet.":"Aún no hay tiempo registrado.",
      "Tracked team time this month.":"Tiempo del equipo registrado este mes."
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
      "Lead pipeline":"Prospectos",
      "+ Add lead":"+ Añadir lead",
      "Actions":"Acciones",
      "Client records":"Registros de clientes",
      "+ Add client":"+ Añadir cliente",
      "Calendar + jobs":"Calendario + trabajos",
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
  Object.assign(staticCorrections.fr,{"Access":"Accès","Security":"Sécurité","Integrations":"Intégrations"});

  // 2026-09-29 — full visible UI + Booking Page language coverage v208
  const coverageV208={
  "Lead": {
    "es": "Prospecto",
    "fr": "Prospect",
    "ht": "Pwospè"
  },
  "Leads": {
    "es": "Prospectos",
    "fr": "Prospects",
    "ht": "Pwospè"
  },
  "LEADS": {
    "es": "PROSPECTOS",
    "fr": "PROSPECTS",
    "ht": "PWOSPÈ"
  },
  "Lead pipeline": {
    "es": "Pipeline de prospectos",
    "fr": "Pipeline de prospects",
    "ht": "Pipeline pwospè"
  },
  "+ Add lead": {
    "es": "+ Añadir prospecto",
    "fr": "+ Ajouter un prospect",
    "ht": "+ Ajoute pwospè"
  },
  "Add lead": {
    "es": "Añadir prospecto",
    "fr": "Ajouter un prospect",
    "ht": "Ajoute pwospè"
  },
  "Source": {
    "es": "Fuente",
    "fr": "Source",
    "ht": "Sous"
  },
  "Status": {
    "es": "Estado",
    "fr": "Statut",
    "ht": "Estati"
  },
  "Booked": {
    "es": "Reservado",
    "fr": "Réservé",
    "ht": "Rezève"
  },
  "Booking link": {
    "es": "Enlace de reservas",
    "fr": "Lien de réservation",
    "ht": "Lyen rezèvasyon"
  },
  "Quote link": {
    "es": "Enlace de cotización",
    "fr": "Lien de devis",
    "ht": "Lyen devis"
  },
  "Edit": {
    "es": "Editar",
    "fr": "Modifier",
    "ht": "Modifye"
  },
  "Archive": {
    "es": "Archivar",
    "fr": "Archiver",
    "ht": "Achive"
  },
  "Delete lead": {
    "es": "Borrar prospecto",
    "fr": "Supprimer le prospect",
    "ht": "Efase pwospè"
  },
  "Client": {
    "es": "Cliente",
    "fr": "Client",
    "ht": "Kliyan"
  },
  "CLIENTS": {
    "es": "CLIENTES",
    "fr": "CLIENTS",
    "ht": "KLIYAN"
  },
  "Client records": {
    "es": "Registros de clientes",
    "fr": "Fiches clients",
    "ht": "Dosye kliyan"
  },
  "+ Add client": {
    "es": "+ Añadir cliente",
    "fr": "+ Ajouter un client",
    "ht": "+ Ajoute kliyan"
  },
  "No client": {
    "es": "Sin cliente",
    "fr": "Sans client",
    "ht": "Pa gen kliyan"
  },
  "No email": {
    "es": "Sin correo",
    "fr": "Sans e-mail",
    "ht": "Pa gen imèl"
  },
  "No address yet": {
    "es": "Sin dirección todavía",
    "fr": "Pas encore d’adresse",
    "ht": "Pa gen adrès ankò"
  },
  "No due date": {
    "es": "Sin fecha de vencimiento",
    "fr": "Sans date d’échéance",
    "ht": "Pa gen dat limit"
  },
  "Amount": {
    "es": "Monto",
    "fr": "Montant",
    "ht": "Montan"
  },
  "Paid up": {
    "es": "Al día",
    "fr": "À jour",
    "ht": "Ajou"
  },
  "Next cleaning": {
    "es": "Próxima limpieza",
    "fr": "Prochain nettoyage",
    "ht": "Pwochen netwayaj"
  },
  "Last cleaning": {
    "es": "Última limpieza",
    "fr": "Dernier nettoyage",
    "ht": "Dènye netwayaj"
  },
  "Not scheduled": {
    "es": "Sin programar",
    "fr": "Non planifié",
    "ht": "Pa pwograme"
  },
  "Info": {
    "es": "Información",
    "fr": "Infos",
    "ht": "Enfòmasyon"
  },
  "Edit client": {
    "es": "Editar cliente",
    "fr": "Modifier le client",
    "ht": "Modifye kliyan"
  },
  "Client notes": {
    "es": "Notas del cliente",
    "fr": "Notes client",
    "ht": "Nòt kliyan"
  },
  "Client not found": {
    "es": "Cliente no encontrado",
    "fr": "Client introuvable",
    "ht": "Kliyan pa jwenn"
  },
  "Delete client": {
    "es": "Borrar cliente",
    "fr": "Supprimer le client",
    "ht": "Efase kliyan"
  },
  "Completed": {
    "es": "Completado",
    "fr": "Terminé",
    "ht": "Fini"
  },
  "Upcoming": {
    "es": "Próximos",
    "fr": "À venir",
    "ht": "K ap vini"
  },
  "Invoiced": {
    "es": "Facturado",
    "fr": "Facturé",
    "ht": "Faktire"
  },
  "History": {
    "es": "Historial",
    "fr": "Historique",
    "ht": "Istwa"
  },
  "No history yet.": {
    "es": "Todavía no hay historial.",
    "fr": "Pas encore d’historique.",
    "ht": "Pa gen istwa ankò."
  },
  "Requested": {
    "es": "Solicitada",
    "fr": "Demandé",
    "ht": "Mande"
  },
  "Draft": {
    "es": "Borrador",
    "fr": "Brouillon",
    "ht": "Bouyon"
  },
  "Sent": {
    "es": "Enviada",
    "fr": "Envoyé",
    "ht": "Voye"
  },
  "Accepted": {
    "es": "Aceptada",
    "fr": "Accepté",
    "ht": "Aksepte"
  },
  "Declined": {
    "es": "Rechazada",
    "fr": "Refusé",
    "ht": "Refize"
  },
  "Overdue": {
    "es": "Vencida",
    "fr": "En retard",
    "ht": "Anreta"
  },
  "outstanding": {
    "es": "pendiente",
    "fr": "à encaisser",
    "ht": "poko peye"
  },
  "Customer chose": {
    "es": "Cliente eligió",
    "fr": "Le client a choisi",
    "ht": "Kliyan chwazi"
  },
  "Resolve dispute": {
    "es": "Resolver disputa",
    "fr": "Résoudre la contestation",
    "ht": "Rezoud kontestasyon"
  },
  "Send invoice": {
    "es": "Enviar factura",
    "fr": "Envoyer la facture",
    "ht": "Voye fakti"
  },
  "Add payment": {
    "es": "Añadir pago",
    "fr": "Ajouter un paiement",
    "ht": "Ajoute peman"
  },
  "Confirm payment": {
    "es": "Confirmar pago",
    "fr": "Confirmer le paiement",
    "ht": "Konfime peman"
  },
  "Record payment": {
    "es": "Registrar pago",
    "fr": "Enregistrer le paiement",
    "ht": "Anrejistre peman"
  },
  "Delete invoice": {
    "es": "Borrar factura",
    "fr": "Supprimer la facture",
    "ht": "Efase fakti"
  },
  "Send quote": {
    "es": "Enviar cotización",
    "fr": "Envoyer le devis",
    "ht": "Voye devis"
  },
  "Resend quote": {
    "es": "Reenviar cotización",
    "fr": "Renvoyer le devis",
    "ht": "Voye devis ankò"
  },
  "Delete quote": {
    "es": "Borrar cotización",
    "fr": "Supprimer le devis",
    "ht": "Efase devis"
  },
  "Next stop": {
    "es": "Próxima parada",
    "fr": "Prochain arrêt",
    "ht": "Pwochen arè"
  },
  "Extra job": {
    "es": "Trabajo extra",
    "fr": "Travail supplémentaire",
    "ht": "Travay anplis"
  },
  "Planned": {
    "es": "Planeado",
    "fr": "Prévu",
    "ht": "Planifye"
  },
  "Actual": {
    "es": "Real",
    "fr": "Réel",
    "ht": "Reyèl"
  },
  "Remove from this list": {
    "es": "Quitar de esta lista",
    "fr": "Retirer de cette liste",
    "ht": "Retire nan lis sa a"
  },
  "No time entries yet.": {
    "es": "Todavía no hay registros de tiempo.",
    "fr": "Aucun temps enregistré pour le moment.",
    "ht": "Pa gen anrejistreman tan ankò."
  },
  "Time worked will appear here.": {
    "es": "El tiempo trabajado aparecerá aquí.",
    "fr": "Le temps travaillé apparaîtra ici.",
    "ht": "Tan travay la ap parèt isit la."
  },
  "No mileage logged yet.": {
    "es": "Todavía no hay millaje registrado.",
    "fr": "Aucun kilométrage enregistré.",
    "ht": "Pa gen distans anrejistre ankò."
  },
  "Add profile": {
    "es": "Añadir perfil",
    "fr": "Ajouter le profil",
    "ht": "Ajoute pwofil"
  },
  "Add page": {
    "es": "Añadir página",
    "fr": "Ajouter la page",
    "ht": "Ajoute paj"
  },
  "Add link": {
    "es": "Añadir enlace",
    "fr": "Ajouter le lien",
    "ht": "Ajoute lyen"
  },
  "Client view": {
    "es": "Vista del cliente",
    "fr": "Vue client",
    "ht": "Vizyalizasyon kliyan"
  },
  "Keep your client-facing links close while you run the day.": {
    "es": "Ten a mano los enlaces para clientes mientras manejas el día.",
    "fr": "Gardez les liens destinés aux clients à portée de main pendant la journée.",
    "ht": "Kenbe lyen kliyan yo toupre pandan w ap jere jounen an."
  },
  "Add Instagram, Facebook and your review link in Business Profile.": {
    "es": "Añade Instagram, Facebook y tu enlace de reseñas en el perfil del negocio.",
    "fr": "Ajoutez Instagram, Facebook et votre lien d’avis dans le profil de l’entreprise.",
    "ht": "Ajoute Instagram, Facebook ak lyen revizyon ou nan pwofil biznis la."
  },
  "MILEAGE": {
    "es": "MILLAJE",
    "fr": "KILOMÉTRAGE",
    "ht": "KILOMETRAJ"
  },
  "Mileage log": {
    "es": "Registro de millaje",
    "fr": "Journal de kilométrage",
    "ht": "Jounal kilometraj"
  },
  "+ Log drive": {
    "es": "+ Registrar viaje",
    "fr": "+ Enregistrer un trajet",
    "ht": "+ Anrejistre vwayaj"
  },
  "This month": {
    "es": "Este mes",
    "fr": "Ce mois-ci",
    "ht": "Mwa sa a"
  },
  "Date / note": {
    "es": "Fecha / nota",
    "fr": "Date / note",
    "ht": "Dat / nòt"
  },
  "No specific job": {
    "es": "Sin trabajo específico",
    "fr": "Aucun travail précis",
    "ht": "Pa gen travay espesifik"
  },
  "Extra job type": {
    "es": "Tipo de trabajo extra",
    "fr": "Type de travail supplémentaire",
    "ht": "Kalite travay anplis"
  },
  "Choose type": {
    "es": "Elige el tipo",
    "fr": "Choisir le type",
    "ht": "Chwazi kalite"
  },
  "Store": {
    "es": "Tienda",
    "fr": "Magasin",
    "ht": "Magazen"
  },
  "School": {
    "es": "Escuela",
    "fr": "École",
    "ht": "Lekòl"
  },
  "Office": {
    "es": "Oficina",
    "fr": "Bureau",
    "ht": "Biwo"
  },
  "Supply run": {
    "es": "Compra de suministros",
    "fr": "Achat de fournitures",
    "ht": "Ale pran founiti"
  },
  "Office / home / previous stop": {
    "es": "Oficina / casa / parada anterior",
    "fr": "Bureau / domicile / arrêt précédent",
    "ht": "Biwo / lakay / arè anvan"
  },
  "Client / supply store": {
    "es": "Cliente / tienda de suministros",
    "fr": "Client / magasin de fournitures",
    "ht": "Kliyan / magazen founiti"
  },
  "e.g. pick up supplies": {
    "es": "Ej. recoger suministros",
    "fr": "Ex. récupérer des fournitures",
    "ht": "Eg. pran founiti"
  },
  "Enter a distance greater than 0.": {
    "es": "Escribe una distancia mayor que 0.",
    "fr": "Saisissez une distance supérieure à 0.",
    "ht": "Antre yon distans ki pi gran pase 0."
  },
  "Complete From and To.": {
    "es": "Completa Desde y Hasta.",
    "fr": "Complétez De et À.",
    "ht": "Ranpli Soti ak Rive."
  },
  "Choose the extra job type.": {
    "es": "Elige el tipo de trabajo extra.",
    "fr": "Choisissez le type de travail supplémentaire.",
    "ht": "Chwazi kalite travay anplis la."
  },
  "Removing…": {
    "es": "Quitando…",
    "fr": "Suppression…",
    "ht": "N ap retire…"
  },
  "Removed from Time Tracking only.": {
    "es": "Quitado solo del control de tiempo.",
    "fr": "Retiré uniquement du suivi du temps.",
    "ht": "Retire sèlman nan Suivi tan."
  },
  "Could not remove it from this list.": {
    "es": "No se pudo quitar de esta lista.",
    "fr": "Impossible de le retirer de cette liste.",
    "ht": "Pa t ka retire li nan lis sa a."
  },
  "TIME TRACKING": {
    "es": "CONTROL DE TIEMPO",
    "fr": "SUIVI DU TEMPS",
    "ht": "SWIV TAN"
  },
  "Time tracking": {
    "es": "Control de tiempo",
    "fr": "Suivi du temps",
    "ht": "Swiv tan"
  },
  "Job / team": {
    "es": "Trabajo / equipo",
    "fr": "Travail / équipe",
    "ht": "Travay / ekip"
  },
  "Current job": {
    "es": "Trabajo actual",
    "fr": "Travail en cours",
    "ht": "Travay aktyèl"
  },
  "Running": {
    "es": "Activo",
    "fr": "En cours",
    "ht": "Ap kouri"
  },
  "Finish timer": {
    "es": "Finalizar temporizador",
    "fr": "Arrêter le minuteur",
    "ht": "Fini kronomèt"
  },
  "No timer running.": {
    "es": "No hay temporizador activo.",
    "fr": "Aucun minuteur actif.",
    "ht": "Pa gen kronomèt k ap mache."
  },
  "Start time from an assigned job when work begins.": {
    "es": "Inicia el tiempo desde un trabajo asignado cuando empiece el trabajo.",
    "fr": "Démarrez le temps depuis un travail attribué lorsque le travail commence.",
    "ht": "Kòmanse tan an nan yon travay asiyen lè travay la kòmanse."
  },
  "Tomorrow": {
    "es": "Mañana",
    "fr": "Demain",
    "ht": "Demen"
  },
  "Current location": {
    "es": "Ubicación actual",
    "fr": "Position actuelle",
    "ht": "Kote aktyèl"
  },
  "Not viewed yet": {
    "es": "Aún no visto",
    "fr": "Pas encore vu",
    "ht": "Poko wè"
  },
  "Viewed": {
    "es": "Visto",
    "fr": "Vu",
    "ht": "Wè"
  },
  "Weather unavailable": {
    "es": "Clima no disponible",
    "fr": "Météo indisponible",
    "ht": "Tan an pa disponib"
  },
  "Updating weather…": {
    "es": "Actualizando clima…",
    "fr": "Mise à jour de la météo…",
    "ht": "N ap mete tan an ajou…"
  },
  "Snow now in your area.": {
    "es": "Está nevando ahora en tu zona.",
    "fr": "Il neige actuellement dans votre zone.",
    "ht": "Nèj ap tonbe nan zòn ou kounye a."
  },
  "Storms are active now in your area.": {
    "es": "Hay tormentas activas ahora en tu zona.",
    "fr": "Des orages sont actifs dans votre zone.",
    "ht": "Gen tanpèt nan zòn ou kounye a."
  },
  "Rain now in your area.": {
    "es": "Está lloviendo ahora en tu zona.",
    "fr": "Il pleut actuellement dans votre zone.",
    "ht": "Lapli ap tonbe nan zòn ou kounye a."
  },
  "Snow expected": {
    "es": "Se espera nieve",
    "fr": "Neige prévue",
    "ht": "Nèj prevwa"
  },
  "Storms expected": {
    "es": "Se esperan tormentas",
    "fr": "Orages prévus",
    "ht": "Tanpèt prevwa"
  },
  "Rain expected": {
    "es": "Se espera lluvia",
    "fr": "Pluie prévue",
    "ht": "Lapli prevwa"
  },
  "Your cleaning business shouldn’t live in DMs, notes and memory.": {
    "es": "Tu negocio de limpieza no debería vivir entre mensajes, notas y memoria.",
    "fr": "Votre entreprise de nettoyage ne devrait pas vivre dans les messages, les notes et votre mémoire.",
    "ht": "Biznis netwayaj ou pa ta dwe rete nan mesaj, nòt ak memwa."
  },
  "Keep clients, quotes, bookings, jobs and invoices in one organized place.": {
    "es": "Mantén clientes, cotizaciones, reservas, trabajos y facturas en un solo lugar organizado.",
    "fr": "Gardez clients, devis, réservations, travaux et factures dans un seul endroit organisé.",
    "ht": "Kenbe kliyan, devis, rezèvasyon, travay ak fakti nan yon sèl kote òganize."
  },
  "Simple setup": {
    "es": "Configuración sencilla",
    "fr": "Configuration simple",
    "ht": "Konfigirasyon senp"
  },
  "No card required": {
    "es": "No se requiere tarjeta",
    "fr": "Aucune carte requise",
    "ht": "Pa bezwen kat"
  },
  "Get 30 days free": {
    "es": "Obtén 30 días gratis",
    "fr": "Profitez de 30 jours gratuits",
    "ht": "Jwenn 30 jou gratis"
  },
  "Already have an account?": {
    "es": "¿Ya tienes una cuenta?",
    "fr": "Vous avez déjà un compte ?",
    "ht": "Ou deja gen yon kont?"
  },
  "No card required · Then $5.99/month": {
    "es": "Sin tarjeta · Luego $5.99/mes",
    "fr": "Sans carte · Puis 5,99 $/mois",
    "ht": "Pa bezwen kat · Apre sa $5.99/mwa"
  },
  "← Back": {
    "es": "← Atrás",
    "fr": "← Retour",
    "ht": "← Retounen"
  },
  "BUSINESS ACCESS": {
    "es": "ACCESO AL NEGOCIO",
    "fr": "ACCÈS À L’ENTREPRISE",
    "ht": "AKSÈ BIZNIS"
  },
  "Email address": {
    "es": "Correo electrónico",
    "fr": "E-mail",
    "ht": "Adrès imèl"
  },
  "Remember username": {
    "es": "Recordar usuario",
    "fr": "Mémoriser l’identifiant",
    "ht": "Sonje non itilizatè"
  },
  "By creating an account, you agree to our": {
    "es": "Al crear una cuenta, aceptas nuestros",
    "fr": "En créant un compte, vous acceptez nos",
    "ht": "Lè w kreye yon kont, ou dakò ak"
  },
  "and acknowledge our": {
    "es": "y reconoces nuestra",
    "fr": "et reconnaissez notre",
    "ht": "epi ou rekonèt"
  },
  "Privacy Policy": {
    "es": "Política de privacidad",
    "fr": "Politique de confidentialité",
    "ht": "Règleman sou vi prive"
  },
  "This creates your private workspace and starts the 30-day trial.": {
    "es": "Esto crea tu espacio privado e inicia la prueba de 30 días.",
    "fr": "Cela crée votre espace privé et démarre l’essai de 30 jours.",
    "ht": "Sa kreye espas prive ou epi kòmanse esè 30 jou a."
  },
  "Try again": {
    "es": "Intentar de nuevo",
    "fr": "Réessayer",
    "ht": "Eseye ankò"
  },
  "TODAY + UPCOMING": {
    "es": "HOY + PRÓXIMOS",
    "fr": "AUJOURD’HUI + À VENIR",
    "ht": "JODI A + K AP VINI"
  },
  "My assigned jobs": {
    "es": "Mis trabajos asignados",
    "fr": "Mes travaux attribués",
    "ht": "Travay mwen asiyen"
  },
  "MESSAGES": {
    "es": "MENSAJES",
    "fr": "MESSAGES",
    "ht": "MESAJ"
  },
  "Message your admin": {
    "es": "Escribe a tu admin",
    "fr": "Écrire à votre administrateur",
    "ht": "Ekri admin ou"
  },
  "Use this for job questions or quick updates.": {
    "es": "Úsalo para preguntas del trabajo o actualizaciones rápidas.",
    "fr": "Utilisez ceci pour les questions sur le travail ou les mises à jour rapides.",
    "ht": "Sèvi avè l pou kesyon sou travay oswa mizajou rapid."
  },
  "No messages yet.": {
    "es": "Todavía no hay mensajes.",
    "fr": "Aucun message pour le moment.",
    "ht": "Pa gen mesaj ankò."
  },
  "Your conversation with the admin will appear here.": {
    "es": "Tu conversación con el admin aparecerá aquí.",
    "fr": "Votre conversation avec l’administrateur apparaîtra ici.",
    "ht": "Konvèsasyon ou ak admin ap parèt isit la."
  },
  "✓ Assigned jobs": {
    "es": "✓ Trabajos asignados",
    "fr": "✓ Travaux attribués",
    "ht": "✓ Travay asiyen"
  },
  "✓ Route + address": {
    "es": "✓ Ruta + dirección",
    "fr": "✓ Itinéraire + adresse",
    "ht": "✓ Wout + adrès"
  },
  "✓ Job status": {
    "es": "✓ Estado del trabajo",
    "fr": "✓ Statut du travail",
    "ht": "✓ Estati travay"
  },
  "✓ Time tracking": {
    "es": "✓ Control de tiempo",
    "fr": "✓ Suivi du temps",
    "ht": "✓ Swiv tan"
  },
  "✓ Mileage": {
    "es": "✓ Millaje",
    "fr": "✓ Kilométrage",
    "ht": "✓ Kilometraj"
  },
  "✓ Messages with admin": {
    "es": "✓ Mensajes con admin",
    "fr": "✓ Messages avec l’administrateur",
    "ht": "✓ Mesaj ak admin"
  },
  "This is guest employee access only. You cannot see leads, quotes, invoices, pricing, reports, billing, settings or clients outside your assigned jobs.": {
    "es": "Este acceso es solo para empleados invitados. No puedes ver prospectos, cotizaciones, facturas, precios, reportes, facturación, ajustes ni clientes fuera de tus trabajos asignados.",
    "fr": "Cet accès est réservé aux employés invités. Vous ne pouvez pas voir les prospects, devis, factures, prix, rapports, facturation, paramètres ni les clients hors de vos travaux attribués.",
    "ht": "Sa a se aksè anplwaye envite sèlman. Ou pa ka wè pwospè, devis, fakti, pri, rapò, bòdwo, paramèt oswa kliyan ki pa nan travay ou asiyen yo."
  },
  "One time": {
    "es": "Una vez",
    "fr": "Une fois",
    "ht": "Yon sèl fwa"
  },
  "Every week": {
    "es": "Cada semana",
    "fr": "Chaque semaine",
    "ht": "Chak semèn"
  },
  "Every 2 weeks": {
    "es": "Cada 2 semanas",
    "fr": "Toutes les 2 semaines",
    "ht": "Chak 2 semèn"
  },
  "Other payment method": {
    "es": "Otro método de pago",
    "fr": "Autre mode de paiement",
    "ht": "Lòt metòd peman"
  },
  "Choose one option, then submit it to the business.": {
    "es": "Elige una opción y envíala al negocio.",
    "fr": "Choisissez une option puis envoyez-la à l’entreprise.",
    "ht": "Chwazi yon opsyon, epi voye l bay biznis la."
  },
  "Submitting only sends your payment choice. The business will confirm the payment in the app after it is actually received. Only then will you receive a payment confirmation email.": {
    "es": "Enviar solo comunica tu forma de pago. El negocio confirmará el pago en la app cuando realmente lo reciba. Solo entonces recibirás el correo de confirmación.",
    "fr": "L’envoi transmet uniquement votre choix de paiement. L’entreprise confirmera le paiement dans l’application après réception réelle. Vous recevrez ensuite l’e-mail de confirmation.",
    "ht": "Voye a sèlman voye chwa peman ou. Biznis la ap konfime peman an nan aplikasyon an apre li resevwa li toutbon. Se lè sa a sèlman w ap resevwa imèl konfimasyon an."
  },
  "The cleaning business received your request and will follow up with you.": {
    "es": "El negocio de limpieza recibió tu solicitud y se comunicará contigo.",
    "fr": "L’entreprise de nettoyage a reçu votre demande et vous contactera.",
    "ht": "Biznis netwayaj la resevwa demann ou epi l ap kontakte ou."
  },
  "Owner View": {
    "es": "Vista del dueño",
    "fr": "Vue propriétaire",
    "ht": "Vizyalizasyon pwopriyetè"
  },
  "30 days left": {
    "es": "Quedan 30 días",
    "fr": "30 jours restants",
    "ht": "30 jou rete"
  },
  "$5.99/month after your trial": {
    "es": "$5.99/mes después de la prueba",
    "fr": "5,99 $/mois après l’essai",
    "ht": "$5.99/mwa apre esè a"
  },
  "Full access during the trial. No card required to start.": {
    "es": "Acceso completo durante la prueba. No necesitas tarjeta para comenzar.",
    "fr": "Accès complet pendant l’essai. Aucune carte requise pour commencer.",
    "ht": "Aksè konplè pandan esè a. Pa bezwen kat pou kòmanse."
  },
  "Search your workspace": {
    "es": "Buscar en tu espacio",
    "fr": "Rechercher dans votre espace",
    "ht": "Chèche nan espas travay ou"
  },
  "Find anything fast.": {
    "es": "Encuentra todo rápido.",
    "fr": "Trouvez rapidement ce qu’il vous faut.",
    "ht": "Jwenn nenpòt bagay vit."
  },
  "Search clients, jobs, quotes and invoices.": {
    "es": "Busca clientes, trabajos, cotizaciones y facturas.",
    "fr": "Recherchez clients, travaux, devis et factures.",
    "ht": "Chèche kliyan, travay, devis ak fakti."
  },
  "INQUIRIES": {
    "es": "SOLICITUDES",
    "fr": "DEMANDES",
    "ht": "DEMANN"
  },
  "+ Add New": {
    "es": "+ Añadir",
    "fr": "+ Ajouter",
    "ht": "+ Ajoute"
  },
  "FREE ACCESS": {
    "es": "ACCESO GRATIS",
    "fr": "ACCÈS GRATUIT",
    "ht": "AKSÈ GRATIS"
  },
  "Free access reminder": {
    "es": "Recordatorio de acceso gratis",
    "fr": "Rappel d’accès gratuit",
    "ht": "Rapèl aksè gratis"
  },
  "YOUR WORKSPACE IS READY": {
    "es": "TU ESPACIO ESTÁ LISTO",
    "fr": "VOTRE ESPACE EST PRÊT",
    "ht": "ESPAS TRAVAY OU PARE"
  },
  "Get ready for your first booking.": {
    "es": "Prepárate para tu primera reserva.",
    "fr": "Préparez votre première réservation.",
    "ht": "Prepare pou premye rezèvasyon ou."
  },
  "Set up what clients can book, when they can book, then share your link.": {
    "es": "Configura qué pueden reservar tus clientes, cuándo pueden hacerlo y luego comparte tu enlace.",
    "fr": "Configurez ce que les clients peuvent réserver, quand ils peuvent le faire, puis partagez votre lien.",
    "ht": "Mete sa kliyan ka rezève, kilè yo ka rezève, epi pataje lyen ou."
  },
  "Set up booking →": {
    "es": "Configurar reservas →",
    "fr": "Configurer les réservations →",
    "ht": "Konfigire rezèvasyon →"
  },
  "Checking your schedule and what’s next.": {
    "es": "Revisando tu agenda y lo que sigue.",
    "fr": "Vérification du planning et de la suite.",
    "ht": "N ap tcheke orè ou ak sa k ap vini."
  },
  "One moment…": {
    "es": "Un momento…",
    "fr": "Un instant…",
    "ht": "Yon moman…"
  },
  "Loading weather…": {
    "es": "Cargando clima…",
    "fr": "Chargement de la météo…",
    "ht": "N ap chaje tan an…"
  },
  "Best route": {
    "es": "Mejor ruta",
    "fr": "Meilleur itinéraire",
    "ht": "Pi bon wout"
  },
  "Est. scheduled this week": {
    "es": "Estimado programado esta semana",
    "fr": "Estimation planifiée cette semaine",
    "ht": "Estimasyon pwograme semèn sa a"
  },
  "Based on scheduled services": {
    "es": "Según servicios programados",
    "fr": "Selon les services planifiés",
    "ht": "Dapre sèvis pwograme"
  },
  "Collected this week": {
    "es": "Cobrado esta semana",
    "fr": "Encaissé cette semaine",
    "ht": "Kolekte semèn sa a"
  },
  "Confirmed payments": {
    "es": "Pagos confirmados",
    "fr": "Paiements confirmés",
    "ht": "Peman konfime"
  },
  "Jobs this week": {
    "es": "Trabajos esta semana",
    "fr": "Travaux cette semaine",
    "ht": "Travay semèn sa a"
  },
  "On the schedule": {
    "es": "En la agenda",
    "fr": "Au planning",
    "ht": "Sou orè a"
  },
  "New clients": {
    "es": "Clientes nuevos",
    "fr": "Nouveaux clients",
    "ht": "Nouvo kliyan"
  },
  "Added this week": {
    "es": "Añadidos esta semana",
    "fr": "Ajoutés cette semaine",
    "ht": "Ajoute semèn sa a"
  },
  "TODAY": {
    "es": "HOY",
    "fr": "AUJOURD’HUI",
    "ht": "JODI A"
  },
  "Schedule + route": {
    "es": "Agenda + ruta",
    "fr": "Planning + itinéraire",
    "ht": "Orè + wout"
  },
  "Full calendar →": {
    "es": "Calendario completo →",
    "fr": "Calendrier complet →",
    "ht": "Kalandriye konplè →"
  },
  "CAPACITY": {
    "es": "CAPACIDAD",
    "fr": "CAPACITÉ",
    "ht": "KAPASITE"
  },
  "This week": {
    "es": "Esta semana",
    "fr": "Cette semaine",
    "ht": "Semèn sa a"
  },
  "Your availability will appear here.": {
    "es": "Tu disponibilidad aparecerá aquí.",
    "fr": "Vos disponibilités apparaîtront ici.",
    "ht": "Disponiblite ou ap parèt isit la."
  },
  "See open time →": {
    "es": "Ver horarios libres →",
    "fr": "Voir les créneaux libres →",
    "ht": "Gade lè ki lib →"
  },
  "YOUR NEXT MOVE": {
    "es": "TU PRÓXIMO PASO",
    "fr": "VOTRE PROCHAINE ÉTAPE",
    "ht": "PWOCHEN ETAP OU"
  },
  "Everything is caught up.": {
    "es": "Todo está al día.",
    "fr": "Tout est à jour.",
    "ht": "Tout bagay ajou."
  },
  "Nothing urgent needs your attention right now.": {
    "es": "Nada urgente necesita tu atención ahora.",
    "fr": "Rien d’urgent ne demande votre attention pour le moment.",
    "ht": "Pa gen anyen ijan ki bezwen atansyon ou kounye a."
  },
  "View calendar →": {
    "es": "Ver calendario →",
    "fr": "Voir le calendrier →",
    "ht": "Gade kalandriye →"
  },
  "FOLLOW THROUGH": {
    "es": "SEGUIMIENTO",
    "fr": "SUIVI",
    "ht": "SWIVI"
  },
  "Open items": {
    "es": "Pendientes",
    "fr": "Éléments ouverts",
    "ht": "Bagay ouvè"
  },
  "Your weekly activity will build here.": {
    "es": "Tu actividad semanal aparecerá aquí.",
    "fr": "Votre activité hebdomadaire apparaîtra ici.",
    "ht": "Aktivite semèn ou ap parèt isit la."
  },
  "Work hours": {
    "es": "Horas trabajadas",
    "fr": "Heures travaillées",
    "ht": "Lè travay"
  },
  "CLIENT-FACING LINKS": {
    "es": "ENLACES PARA CLIENTES",
    "fr": "LIENS CLIENTS",
    "ht": "LYEN POU KLIYAN"
  },
  "Your business online": {
    "es": "Tu negocio online",
    "fr": "Votre entreprise en ligne",
    "ht": "Biznis ou sou entènèt"
  },
  "BOOKING CENTER": {
    "es": "CENTRO DE RESERVAS",
    "fr": "CENTRE DE RÉSERVATION",
    "ht": "SANT REZÈVASYON"
  },
  "Booking Page": {
    "es": "Página de reservas",
    "fr": "Page de réservation",
    "ht": "Paj rezèvasyon"
  },
  "Control what clients can book, when they can book it, and where each request goes next.": {
    "es": "Controla qué pueden reservar los clientes, cuándo pueden hacerlo y qué pasa con cada solicitud.",
    "fr": "Contrôlez ce que les clients peuvent réserver, quand ils peuvent le faire et la suite de chaque demande.",
    "ht": "Kontwole sa kliyan ka rezève, kilè yo ka rezève, ak kote chak demann ale apre sa."
  },
  "Copy booking link": {
    "es": "Copiar enlace de reservas",
    "fr": "Copier le lien de réservation",
    "ht": "Kopye lyen rezèvasyon"
  },
  "PUBLIC LINKS": {
    "es": "ENLACES PÚBLICOS",
    "fr": "LIENS PUBLICS",
    "ht": "LYEN PIBLIK"
  },
  "Public links": {
    "es": "Enlaces públicos",
    "fr": "Liens publics",
    "ht": "Lyen piblik"
  },
  "Copy link": {
    "es": "Copiar enlace",
    "fr": "Copier le lien",
    "ht": "Kopye lyen"
  },
  "Quote request link": {
    "es": "Enlace para pedir cotización",
    "fr": "Lien de demande de devis",
    "ht": "Lyen demann devis"
  },
  "BOOKING REQUESTS": {
    "es": "SOLICITUDES DE RESERVA",
    "fr": "DEMANDES DE RÉSERVATION",
    "ht": "DEMANN REZÈVASYON"
  },
  "BOOKABLE SERVICES": {
    "es": "SERVICIOS RESERVABLES",
    "fr": "SERVICES RÉSERVABLES",
    "ht": "SÈVIS KI KA REZÈVE"
  },
  "Bookable services": {
    "es": "Servicios reservables",
    "fr": "Services réservables",
    "ht": "Sèvis ki ka rezève"
  },
  "Edit services →": {
    "es": "Editar servicios →",
    "fr": "Modifier les services →",
    "ht": "Modifye sèvis →"
  },
  "CUSTOMER EXPERIENCE": {
    "es": "EXPERIENCIA DEL CLIENTE",
    "fr": "EXPÉRIENCE CLIENT",
    "ht": "EKSPERYANS KLIYAN"
  },
  "Pricing + quotes": {
    "es": "Precios + cotizaciones",
    "fr": "Prix + devis",
    "ht": "Pri + devis"
  },
  "No account required": {
    "es": "Sin cuenta necesaria",
    "fr": "Aucun compte requis",
    "ht": "Pa bezwen kont"
  },
  "Fixed price": {
    "es": "Precio fijo",
    "fr": "Prix fixe",
    "ht": "Pri fiks"
  },
  "Custom job": {
    "es": "Trabajo personalizado",
    "fr": "Travail personnalisé",
    "ht": "Travay pèsonalize"
  },
  "Quotes stay in Quotes until accepted.": {
    "es": "Las cotizaciones permanecen en Cotizaciones hasta ser aceptadas.",
    "fr": "Les devis restent dans Devis jusqu’à leur acceptation.",
    "ht": "Devis yo rete nan Devis jiskaske yo aksepte."
  },
  "AVAILABILITY": {
    "es": "DISPONIBILIDAD",
    "fr": "DISPONIBILITÉS",
    "ht": "DISPONIBLITE"
  },
  "Travel buffer": {
    "es": "Tiempo de traslado",
    "fr": "Marge de déplacement",
    "ht": "Tan vwayaj"
  },
  "No buffer": {
    "es": "Sin margen",
    "fr": "Sans marge",
    "ht": "Pa gen tan anplis"
  },
  "Minimum notice": {
    "es": "Aviso mínimo",
    "fr": "Préavis minimum",
    "ht": "Avi minimòm"
  },
  "Same-day allowed": {
    "es": "Permitir el mismo día",
    "fr": "Même jour autorisé",
    "ht": "Menm jou pèmèt"
  },
  "2 hours": {
    "es": "2 horas",
    "fr": "2 heures",
    "ht": "2 èdtan"
  },
  "12 hours": {
    "es": "12 horas",
    "fr": "12 heures",
    "ht": "12 èdtan"
  },
  "24 hours": {
    "es": "24 horas",
    "fr": "24 heures",
    "ht": "24 èdtan"
  },
  "48 hours": {
    "es": "48 horas",
    "fr": "48 heures",
    "ht": "48 èdtan"
  },
  "Clients only see times that fit your hours, service length, travel buffer and existing bookings.": {
    "es": "Los clientes solo ven horarios que encajan con tus horas, duración del servicio, traslado y reservas existentes.",
    "fr": "Les clients ne voient que les créneaux compatibles avec vos horaires, la durée du service, le déplacement et les réservations existantes.",
    "ht": "Kliyan yo sèlman wè lè ki mache ak orè ou, dire sèvis la, tan vwayaj ak rezèvasyon ki deja egziste."
  },
  "CALENDAR + JOBS": {
    "es": "CALENDARIO + TRABAJOS",
    "fr": "CALENDRIER + TRAVAUX",
    "ht": "KALANDRIYE + TRAVAY"
  },
  "Calendar + jobs": {
    "es": "Calendario + trabajos",
    "fr": "Calendrier + travaux",
    "ht": "Kalandriye + travay"
  },
  "+ Add job": {
    "es": "+ Añadir trabajo",
    "fr": "+ Ajouter un travail",
    "ht": "+ Ajoute travay"
  },
  "14-day schedule": {
    "es": "Agenda de 14 días",
    "fr": "Planning sur 14 jours",
    "ht": "Orè 14 jou"
  },
  "14 days": {
    "es": "14 días",
    "fr": "14 jours",
    "ht": "14 jou"
  },
  "Upcoming jobs": {
    "es": "Próximos trabajos",
    "fr": "Travaux à venir",
    "ht": "Travay k ap vini"
  },
  "Recurring series are shown once in Recurring.": {
    "es": "Las series recurrentes se muestran una sola vez en Recurrentes.",
    "fr": "Les séries récurrentes apparaissent une seule fois dans Récurrents.",
    "ht": "Seri repete yo parèt yon sèl fwa nan Repete."
  },
  "RECURRING": {
    "es": "RECURRENTES",
    "fr": "RÉCURRENTS",
    "ht": "REPETE"
  },
  "Upcoming recurring jobs": {
    "es": "Próximos trabajos recurrentes",
    "fr": "Travaux récurrents à venir",
    "ht": "Travay repete k ap vini"
  },
  "Month": {
    "es": "Mes",
    "fr": "Mois",
    "ht": "Mwa"
  },
  "MONTH VIEW": {
    "es": "VISTA MENSUAL",
    "fr": "VUE MENSUELLE",
    "ht": "VIZYON MWA"
  },
  "No jobs are scheduled for this day.": {
    "es": "No hay trabajos programados para este día.",
    "fr": "Aucun travail n’est prévu ce jour.",
    "ht": "Pa gen travay pwograme pou jou sa a."
  },
  "DAY DETAILS": {
    "es": "DETALLES DEL DÍA",
    "fr": "DÉTAILS DU JOUR",
    "ht": "DETAY JOU"
  },
  "Close day details": {
    "es": "Cerrar detalles del día",
    "fr": "Fermer les détails du jour",
    "ht": "Fèmen detay jou"
  },
  "Not assigned": {
    "es": "Sin asignar",
    "fr": "Non attribué",
    "ht": "Pa asiyen"
  },
  "Unassigned client": {
    "es": "Cliente sin asignar",
    "fr": "Client non attribué",
    "ht": "Kliyan pa asiyen"
  },
  "Assigned to": {
    "es": "Asignado a",
    "fr": "Attribué à",
    "ht": "Asiyen bay"
  },
  "Edit job": {
    "es": "Editar trabajo",
    "fr": "Modifier le travail",
    "ht": "Modifye travay"
  },
  "QUOTES": {
    "es": "COTIZACIONES",
    "fr": "DEVIS",
    "ht": "DEVIS"
  },
  "Quote requests stay here until the customer accepts.": {
    "es": "Las solicitudes de cotización permanecen aquí hasta que el cliente acepte.",
    "fr": "Les demandes de devis restent ici jusqu’à l’acceptation du client.",
    "ht": "Demann devis yo rete isit la jiskaske kliyan an aksepte."
  },
  "+ New quote": {
    "es": "+ Nueva cotización",
    "fr": "+ Nouveau devis",
    "ht": "+ Nouvo devis"
  },
  "Booked + invoice created": {
    "es": "Reservado + factura creada",
    "fr": "Réservé + facture créée",
    "ht": "Rezève + fakti kreye"
  },
  "Waiting for customer": {
    "es": "Esperando al cliente",
    "fr": "En attente du client",
    "ht": "Ap tann kliyan"
  },
  "Declined by customer": {
    "es": "Rechazado por el cliente",
    "fr": "Refusé par le client",
    "ht": "Kliyan refize"
  },
  "Needs your price": {
    "es": "Necesita tu precio",
    "fr": "Prix à définir",
    "ht": "Bezwen pri ou"
  },
  "Ready to finish": {
    "es": "Listo para terminar",
    "fr": "Prêt à finaliser",
    "ht": "Pare pou fini"
  },
  "Next: follow up": {
    "es": "Siguiente: seguimiento",
    "fr": "Suite : relance",
    "ht": "Apre: fè swivi"
  },
  "Next: build quote": {
    "es": "Siguiente: preparar cotización",
    "fr": "Suite : créer le devis",
    "ht": "Apre: prepare devis"
  },
  "Next: send to client": {
    "es": "Siguiente: enviar al cliente",
    "fr": "Suite : envoyer au client",
    "ht": "Apre: voye bay kliyan"
  },
  "Converted to work": {
    "es": "Convertido en trabajo",
    "fr": "Converti en travail",
    "ht": "Konvèti an travay"
  },
  "Review when useful": {
    "es": "Revisar cuando sea útil",
    "fr": "À revoir si utile",
    "ht": "Revize lè sa itil"
  },
  "Nothing needs attention here.": {
    "es": "Nada necesita atención aquí.",
    "fr": "Rien ne demande votre attention ici.",
    "ht": "Pa gen anyen ki bezwen atansyon isit la."
  },
  "INVOICES": {
    "es": "FACTURAS",
    "fr": "FACTURES",
    "ht": "FAKTI"
  },
  "Partial payment": {
    "es": "Pago parcial",
    "fr": "Paiement partiel",
    "ht": "Peman pasyèl"
  },
  "Customer": {
    "es": "Cliente",
    "fr": "Client",
    "ht": "Kliyan"
  },
  "Payment": {
    "es": "Pago",
    "fr": "Paiement",
    "ht": "Peman"
  },
  "Payment choice": {
    "es": "Forma de pago",
    "fr": "Choix de paiement",
    "ht": "Chwa peman"
  },
  "Dispute": {
    "es": "Disputa",
    "fr": "Contestation",
    "ht": "Kontestasyon"
  },
  "FOLLOW-UPS": {
    "es": "SEGUIMIENTOS",
    "fr": "SUIVIS",
    "ht": "SWIVI"
  },
  "After cleaning": {
    "es": "Después de la limpieza",
    "fr": "Après le nettoyage",
    "ht": "Apre netwayaj"
  },
  "Rebooking": {
    "es": "Nueva reserva",
    "fr": "Nouvelle réservation",
    "ht": "Rezèvasyon ankò"
  },
  "Due now": {
    "es": "Para ahora",
    "fr": "À faire maintenant",
    "ht": "Pou kounye a"
  },
  "Due tomorrow": {
    "es": "Para mañana",
    "fr": "Pour demain",
    "ht": "Pou demen"
  },
  "Due today": {
    "es": "Para hoy",
    "fr": "Pour aujourd’hui",
    "ht": "Pou jodi a"
  },
  "Auto email": {
    "es": "Email automático",
    "fr": "E-mail automatique",
    "ht": "Imèl otomatik"
  },
  "Remind me": {
    "es": "Recordarme",
    "fr": "Me rappeler",
    "ht": "Fè m sonje"
  },
  "Needs follow-up": {
    "es": "Necesita seguimiento",
    "fr": "Relance nécessaire",
    "ht": "Bezwen swivi"
  },
  "Send now": {
    "es": "Enviar ahora",
    "fr": "Envoyer maintenant",
    "ht": "Voye kounye a"
  },
  "Snooze 2 days": {
    "es": "Posponer 2 días",
    "fr": "Reporter de 2 jours",
    "ht": "Ranvwaye 2 jou"
  },
  "Open source": {
    "es": "Abrir origen",
    "fr": "Ouvrir la source",
    "ht": "Louvri sous"
  },
  "CUSTOM MESSAGE": {
    "es": "MENSAJE PERSONALIZADO",
    "fr": "MESSAGE PERSONNALISÉ",
    "ht": "MESAJ PÈSONALIZE"
  },
  "Write the email in the customer’s language. Leave a field blank to keep the default.": {
    "es": "Escribe el email en el idioma del cliente. Deja un campo vacío para mantener el valor predeterminado.",
    "fr": "Écrivez l’e-mail dans la langue du client. Laissez un champ vide pour conserver le message par défaut.",
    "ht": "Ekri imèl la nan lang kliyan an. Kite yon chan vid pou kenbe mesaj pa defo a."
  },
  "Customer language": {
    "es": "Idioma del cliente",
    "fr": "Langue du client",
    "ht": "Lang kliyan"
  },
  "Subject (optional)": {
    "es": "Asunto (opcional)",
    "fr": "Objet (facultatif)",
    "ht": "Sijè (opsyonèl)"
  },
  "Message": {
    "es": "Mensaje",
    "fr": "Message",
    "ht": "Mesaj"
  },
  "Save message": {
    "es": "Guardar mensaje",
    "fr": "Enregistrer le message",
    "ht": "Sove mesaj"
  },
  "Use default": {
    "es": "Usar predeterminado",
    "fr": "Utiliser par défaut",
    "ht": "Sèvi ak pa defo"
  },
  "Edit message": {
    "es": "Editar mensaje",
    "fr": "Modifier le message",
    "ht": "Modifye mesaj"
  },
  "Nothing needs follow-up.": {
    "es": "Nada necesita seguimiento.",
    "fr": "Aucune relance nécessaire.",
    "ht": "Pa gen anyen ki bezwen swivi."
  },
  "New items will appear here automatically.": {
    "es": "Los nuevos elementos aparecerán aquí automáticamente.",
    "fr": "Les nouveaux éléments apparaîtront ici automatiquement.",
    "ht": "Nouvo bagay yo ap parèt isit la otomatikman."
  },
  "No follow-ups sent yet.": {
    "es": "Todavía no se han enviado seguimientos.",
    "fr": "Aucune relance envoyée pour le moment.",
    "ht": "Pa gen swivi ki voye ankò."
  },
  "Loading follow-ups…": {
    "es": "Cargando seguimientos…",
    "fr": "Chargement des suivis…",
    "ht": "N ap chaje swivi…"
  },
  "Checking what needs attention.": {
    "es": "Revisando qué necesita atención.",
    "fr": "Vérification des éléments à suivre.",
    "ht": "N ap tcheke sa ki bezwen atansyon."
  },
  "Could not load follow-ups.": {
    "es": "No se pudieron cargar los seguimientos.",
    "fr": "Impossible de charger les suivis.",
    "ht": "Pa t ka chaje swivi yo."
  },
  "Tap Refresh follow-ups to try again.": {
    "es": "Toca Actualizar seguimientos para intentarlo de nuevo.",
    "fr": "Touchez Actualiser les suivis pour réessayer.",
    "ht": "Peze Rafrechi swivi pou eseye ankò."
  },
  "Follow-up rule updated": {
    "es": "Regla de seguimiento actualizada",
    "fr": "Règle de suivi mise à jour",
    "ht": "Règ swivi mete ajou"
  },
  "Follow-up message saved": {
    "es": "Mensaje de seguimiento guardado",
    "fr": "Message de suivi enregistré",
    "ht": "Mesaj swivi sove"
  },
  "Default follow-up restored": {
    "es": "Seguimiento predeterminado restaurado",
    "fr": "Suivi par défaut restauré",
    "ht": "Swivi pa defo retabli"
  },
  "Follow-ups refreshed": {
    "es": "Seguimientos actualizados",
    "fr": "Suivis actualisés",
    "ht": "Swivi rafrechi"
  },
  "Follow-up emailed": {
    "es": "Seguimiento enviado por email",
    "fr": "Relance envoyée par e-mail",
    "ht": "Swivi voye pa imèl"
  },
  "Snoozed for 2 days": {
    "es": "Pospuesto 2 días",
    "fr": "Reporté de 2 jours",
    "ht": "Ranvwaye pou 2 jou"
  },
  "Follow-up marked done": {
    "es": "Seguimiento marcado como listo",
    "fr": "Suivi marqué terminé",
    "ht": "Swivi make fini"
  },
  "TODAY'S ROUTE": {
    "es": "RUTA DE HOY",
    "fr": "ITINÉRAIRE DU JOUR",
    "ht": "WOUT JODI A"
  },
  "Today’s route": {
    "es": "Ruta de hoy",
    "fr": "Itinéraire du jour",
    "ht": "Wout jodi a"
  },
  "Your route appears here when jobs are scheduled.": {
    "es": "Tu ruta aparecerá aquí cuando haya trabajos programados.",
    "fr": "Votre itinéraire apparaîtra ici lorsque des travaux seront planifiés.",
    "ht": "Wout ou ap parèt isit la lè gen travay pwograme."
  },
  "SUPPLIES": {
    "es": "SUMINISTROS",
    "fr": "FOURNITURES",
    "ht": "FOUNITI"
  },
  "Keep a lightweight list of cleaning supplies, current quantity, reorder level and cost.": {
    "es": "Lleva una lista simple de suministros, cantidad actual, nivel de reposición y costo.",
    "fr": "Gardez une liste simple des fournitures, quantités, seuils de réapprovisionnement et coûts.",
    "ht": "Kenbe yon lis senp founiti netwayaj, kantite aktyèl, nivo pou rekòmande ak pri."
  },
  "+ Add supply": {
    "es": "+ Añadir suministro",
    "fr": "+ Ajouter une fourniture",
    "ht": "+ Ajoute founiti"
  },
  "Active supplies": {
    "es": "Suministros activos",
    "fr": "Fournitures actives",
    "ht": "Founiti aktif"
  },
  "Items being tracked": {
    "es": "Artículos en seguimiento",
    "fr": "Articles suivis",
    "ht": "Atik n ap swiv"
  },
  "Low stock": {
    "es": "Poco inventario",
    "fr": "Stock faible",
    "ht": "Stòk ba"
  },
  "At or below reorder level": {
    "es": "En o por debajo del nivel de reposición",
    "fr": "Au niveau de réapprovisionnement ou en dessous",
    "ht": "Nan oswa anba nivo pou rekòmande"
  },
  "Inventory value": {
    "es": "Valor del inventario",
    "fr": "Valeur du stock",
    "ht": "Valè envantè"
  },
  "Estimated from unit costs": {
    "es": "Estimado según costos unitarios",
    "fr": "Estimée à partir des coûts unitaires",
    "ht": "Estimasyon dapre pri pa inite"
  },
  "REPORTS": {
    "es": "REPORTES",
    "fr": "RAPPORTS",
    "ht": "RAPÒ"
  },
  "Business reports": {
    "es": "Reportes del negocio",
    "fr": "Rapports de l’entreprise",
    "ht": "Rapò biznis"
  },
  "Revenue this month": {
    "es": "Ingresos este mes",
    "fr": "Revenus ce mois-ci",
    "ht": "Revni mwa sa a"
  },
  "Confirmed payments recorded this month.": {
    "es": "Pagos confirmados registrados este mes.",
    "fr": "Paiements confirmés enregistrés ce mois-ci.",
    "ht": "Peman konfime anrejistre mwa sa a."
  },
  "Jobs completed": {
    "es": "Trabajos completados",
    "fr": "Travaux terminés",
    "ht": "Travay fini"
  },
  "No completed jobs yet.": {
    "es": "Todavía no hay trabajos completados.",
    "fr": "Aucun travail terminé pour le moment.",
    "ht": "Pa gen travay fini ankò."
  },
  "Tracked driving this month.": {
    "es": "Distancia registrada este mes.",
    "fr": "Distance enregistrée ce mois-ci.",
    "ht": "Distans kondwi anrejistre mwa sa a."
  },
  "Tracked team time this month.": {
    "es": "Tiempo del equipo registrado este mes.",
    "fr": "Temps d’équipe enregistré ce mois-ci.",
    "ht": "Tan ekip anrejistre mwa sa a."
  },
  "SERVICES + ADD-ONS": {
    "es": "SERVICIOS + EXTRAS",
    "fr": "SERVICES + OPTIONS",
    "ht": "SÈVIS + OPSYON"
  },
  "Services + add-ons": {
    "es": "Servicios + extras",
    "fr": "Services + options",
    "ht": "Sèvis + opsyon"
  },
  "+ Add add-on": {
    "es": "+ Añadir extra",
    "fr": "+ Ajouter une option",
    "ht": "+ Ajoute opsyon"
  },
  "+ Add service": {
    "es": "+ Añadir servicio",
    "fr": "+ Ajouter un service",
    "ht": "+ Ajoute sèvis"
  },
  "Inactive": {
    "es": "Inactivo",
    "fr": "Inactif",
    "ht": "Inaktif"
  },
  "Quote required": {
    "es": "Requiere cotización",
    "fr": "Devis requis",
    "ht": "Devis obligatwa"
  },
  "Bookable": {
    "es": "Reservable",
    "fr": "Réservable",
    "ht": "Ka rezève"
  },
  "Custom": {
    "es": "Personalizado",
    "fr": "Personnalisé",
    "ht": "Pèsonalize"
  },
  "Duration": {
    "es": "Duración",
    "fr": "Durée",
    "ht": "Dire"
  },
  "Pricing": {
    "es": "Precios",
    "fr": "Tarification",
    "ht": "Pri"
  },
  "Upfront": {
    "es": "Precio directo",
    "fr": "Prix affiché",
    "ht": "Pri dirèk"
  },
  "Included by default": {
    "es": "Incluido por defecto",
    "fr": "Inclus par défaut",
    "ht": "Enkli pa defo"
  },
  "No add-ons yet": {
    "es": "Todavía no hay extras",
    "fr": "Aucune option pour le moment",
    "ht": "Pa gen opsyon ankò"
  },
  "Edit service": {
    "es": "Editar servicio",
    "fr": "Modifier le service",
    "ht": "Modifye sèvis"
  },
  "Add-on": {
    "es": "Extra",
    "fr": "Option",
    "ht": "Opsyon"
  },
  "General add-ons": {
    "es": "Extras generales",
    "fr": "Options générales",
    "ht": "Opsyon jeneral"
  },
  "Available across services": {
    "es": "Disponibles en todos los servicios",
    "fr": "Disponibles pour tous les services",
    "ht": "Disponib pou tout sèvis"
  },
  "Add service": {
    "es": "Añadir servicio",
    "fr": "Ajouter un service",
    "ht": "Ajoute sèvis"
  },
  "Set price, duration and booking basics.": {
    "es": "Define precio, duración y datos básicos de reserva.",
    "fr": "Définissez le prix, la durée et les bases de réservation.",
    "ht": "Mete pri, dire ak baz rezèvasyon."
  },
  "TEAM": {
    "es": "EQUIPO",
    "fr": "ÉQUIPE",
    "ht": "EKIP"
  },
  "+ Add team profile": {
    "es": "+ Añadir perfil de equipo",
    "fr": "+ Ajouter un profil d’équipe",
    "ht": "+ Ajoute pwofil ekip"
  },
  "Create the worker profile, assign jobs, then use": {
    "es": "Crea el perfil del empleado, asigna trabajos y luego usa",
    "fr": "Créez le profil de l’employé, attribuez des travaux, puis utilisez",
    "ht": "Kreye pwofil anplwaye a, asiyen travay, epi sèvi ak"
  },
  "on that person’s card. The link only opens their assigned work.": {
    "es": "en la tarjeta de esa persona. El enlace solo abre sus trabajos asignados.",
    "fr": "sur sa carte. Le lien ouvre uniquement ses travaux attribués.",
    "ht": "sou kat moun sa a. Lyen an sèlman ouvri travay li asiyen yo."
  },
  "Invite an Admin →": {
    "es": "Invitar un Admin →",
    "fr": "Inviter un Admin →",
    "ht": "Envite yon Admin →"
  },
  "MESSAGE CENTER": {
    "es": "CENTRO DE MENSAJES",
    "fr": "CENTRE DE MESSAGES",
    "ht": "SANT MESAJ"
  },
  "Admin ↔ Employee": {
    "es": "Admin ↔ Empleado",
    "fr": "Admin ↔ Employé",
    "ht": "Admin ↔ Anplwaye"
  },
  "Private messages stay inside this business workspace.": {
    "es": "Los mensajes privados permanecen dentro de este negocio.",
    "fr": "Les messages privés restent dans cet espace de travail.",
    "ht": "Mesaj prive yo rete andedan espas travay biznis sa a."
  },
  "Choose an employee.": {
    "es": "Elige un empleado.",
    "fr": "Choisissez un employé.",
    "ht": "Chwazi yon anplwaye."
  },
  "The conversation will appear here.": {
    "es": "La conversación aparecerá aquí.",
    "fr": "La conversation apparaîtra ici.",
    "ht": "Konvèsasyon an ap parèt isit la."
  },
  "SETTINGS": {
    "es": "AJUSTES",
    "fr": "PARAMÈTRES",
    "ht": "PARAMÈT"
  },
  "Business settings": {
    "es": "Ajustes del negocio",
    "fr": "Paramètres de l’entreprise",
    "ht": "Paramèt biznis"
  },
  "Keep the app, client communication, booking rules and payments easy to control from one place.": {
    "es": "Controla fácilmente la app, la comunicación con clientes, las reservas y los pagos desde un solo lugar.",
    "fr": "Gérez facilement l’application, la communication client, les réservations et les paiements depuis un seul endroit.",
    "ht": "Kontwole fasil aplikasyon an, kominikasyon kliyan, règ rezèvasyon ak peman nan yon sèl kote."
  },
  "Business basics": {
    "es": "Datos básicos del negocio",
    "fr": "Informations de l’entreprise",
    "ht": "Baz biznis"
  },
  "The information clients and your workspace use.": {
    "es": "La información que usan tus clientes y tu espacio de trabajo.",
    "fr": "Les informations utilisées par vos clients et votre espace de travail.",
    "ht": "Enfòmasyon kliyan ak espas travay ou itilize."
  },
  "Edit →": {
    "es": "Editar →",
    "fr": "Modifier →",
    "ht": "Modifye →"
  },
  "CLIENT COMMUNICATION": {
    "es": "COMUNICACIÓN CON CLIENTES",
    "fr": "COMMUNICATION CLIENT",
    "ht": "KOMINIKASYON KLIYAN"
  },
  "Emails to your clients": {
    "es": "Emails para tus clientes",
    "fr": "E-mails à vos clients",
    "ht": "Imèl pou kliyan ou"
  },
  "This is separate from the language you use inside the app.": {
    "es": "Esto es independiente del idioma que usas dentro de la app.",
    "fr": "Ceci est indépendant de la langue utilisée dans l’application.",
    "ht": "Sa separe ak lang ou itilize andedan aplikasyon an."
  },
  "Default client email language": {
    "es": "Idioma predeterminado de emails",
    "fr": "Langue par défaut des e-mails",
    "ht": "Lang imèl kliyan pa defo"
  },
  "Change default": {
    "es": "Cambiar predeterminado",
    "fr": "Modifier la langue",
    "ht": "Chanje pa defo"
  },
  "A client can have their own preferred email language. Their preference overrides this default without changing your app language.": {
    "es": "Cada cliente puede tener su propio idioma de email. Su preferencia reemplaza este valor sin cambiar el idioma de la app.",
    "fr": "Chaque client peut avoir sa langue d’e-mail préférée. Elle remplace ce choix sans changer la langue de l’application.",
    "ht": "Yon kliyan ka gen pwòp lang imèl li. Preferans li ranplase valè sa a san chanje lang aplikasyon ou."
  },
  "Replies go to": {
    "es": "Las respuestas llegan a",
    "fr": "Les réponses vont à",
    "ht": "Repons ale nan"
  },
  "Business login email": {
    "es": "Correo de acceso del negocio",
    "fr": "E-mail de connexion de l’entreprise",
    "ht": "Imèl koneksyon biznis"
  },
  "BOOKING": {
    "es": "RESERVAS",
    "fr": "RÉSERVATIONS",
    "ht": "REZÈVASYON"
  },
  "Booking + availability": {
    "es": "Reservas + disponibilidad",
    "fr": "Réservations + disponibilités",
    "ht": "Rezèvasyon + disponiblite"
  },
  "Control when clients can book and how much travel time you need.": {
    "es": "Controla cuándo pueden reservar los clientes y cuánto tiempo necesitas para trasladarte.",
    "fr": "Contrôlez quand les clients peuvent réserver et le temps de déplacement nécessaire.",
    "ht": "Kontwole kilè kliyan ka rezève ak konbyen tan vwayaj ou bezwen."
  },
  "Open booking settings →": {
    "es": "Abrir ajustes de reservas →",
    "fr": "Ouvrir les paramètres de réservation →",
    "ht": "Louvri paramèt rezèvasyon →"
  },
  "These are the choices clients see on invoices.": {
    "es": "Estas son las opciones que los clientes ven en las facturas.",
    "fr": "Ce sont les options que les clients voient sur les factures.",
    "ht": "Sa yo se chwa kliyan wè sou fakti yo."
  },
  "Edit payment options →": {
    "es": "Editar opciones de pago →",
    "fr": "Modifier les options de paiement →",
    "ht": "Modifye opsyon peman →"
  },
  "REVIEWS": {
    "es": "RESEÑAS",
    "fr": "AVIS",
    "ht": "REVIZYON"
  },
  "Google review link": {
    "es": "Enlace de reseña de Google",
    "fr": "Lien d’avis Google",
    "ht": "Lyen revizyon Google"
  },
  "Used after confirmed payments and review follow-ups.": {
    "es": "Se usa después de pagos confirmados y seguimientos de reseñas.",
    "fr": "Utilisé après les paiements confirmés et les suivis d’avis.",
    "ht": "Yo itilize sa apre peman konfime ak swivi revizyon."
  },
  "Not added": {
    "es": "Sin añadir",
    "fr": "Non ajouté",
    "ht": "Pa ajoute"
  },
  "Google review URL": {
    "es": "URL de reseña de Google",
    "fr": "URL d’avis Google",
    "ht": "URL revizyon Google"
  },
  "Save review link": {
    "es": "Guardar enlace de reseña",
    "fr": "Enregistrer le lien d’avis",
    "ht": "Sove lyen revizyon"
  },
  "Open link": {
    "es": "Abrir enlace",
    "fr": "Ouvrir le lien",
    "ht": "Louvri lyen"
  },
  "TEAM ACCESS": {
    "es": "ACCESO DEL EQUIPO",
    "fr": "ACCÈS ÉQUIPE",
    "ht": "AKSÈ EKIP"
  },
  "Who can use the app": {
    "es": "Quién puede usar la app",
    "fr": "Qui peut utiliser l’application",
    "ht": "Ki moun ki ka itilize aplikasyon an"
  },
  "Admins and guest employees are managed separately from client settings.": {
    "es": "Los administradores y empleados invitados se gestionan por separado de los ajustes de clientes.",
    "fr": "Les administrateurs et employés invités sont gérés séparément des paramètres clients.",
    "ht": "Admin ak anplwaye envite yo jere separeman ak paramèt kliyan."
  },
  "Open Team →": {
    "es": "Abrir Equipo →",
    "fr": "Ouvrir Équipe →",
    "ht": "Louvri Ekip →"
  },
  "HELP & FAQ": {
    "es": "AYUDA Y PREGUNTAS",
    "fr": "AIDE ET FAQ",
    "ht": "ÈD AK FAQ"
  },
  "Help Center": {
    "es": "Centro de ayuda",
    "fr": "Centre d’aide",
    "ht": "Sant èd"
  },
  "Install the app on your phone, share access with your team, and find answers to the most common questions.": {
    "es": "Instala la app en tu teléfono, comparte acceso con tu equipo y encuentra respuestas a las preguntas más comunes.",
    "fr": "Installez l’application sur votre téléphone, partagez l’accès avec votre équipe et trouvez les réponses aux questions courantes.",
    "ht": "Enstale aplikasyon an sou telefòn ou, pataje aksè ak ekip ou epi jwenn repons pou kesyon ki pi komen yo."
  },
  "iPhone install": {
    "es": "Instalación en iPhone",
    "fr": "Installation sur iPhone",
    "ht": "Enstalasyon sou iPhone"
  },
  "Android install": {
    "es": "Instalación en Android",
    "fr": "Installation sur Android",
    "ht": "Enstalasyon sou Android"
  },
  "Open the app in": {
    "es": "Abre la app en",
    "fr": "Ouvrez l’application dans",
    "ht": "Louvri aplikasyon an nan"
  },
  "Tap the": {
    "es": "Toca",
    "fr": "Touchez",
    "ht": "Peze"
  },
  "Scroll and tap": {
    "es": "Desliza y toca",
    "fr": "Faites défiler puis touchez",
    "ht": "Desann epi peze"
  },
  "Add to Home Screen": {
    "es": "Añadir a pantalla de inicio",
    "fr": "Ajouter à l’écran d’accueil",
    "ht": "Ajoute sou ekran dakèy"
  },
  "Add to Home screen": {
    "es": "Añadir a pantalla de inicio",
    "fr": "Ajouter à l’écran d’accueil",
    "ht": "Ajoute sou ekran dakèy"
  },
  "Install app": {
    "es": "Instalar app",
    "fr": "Installer l’application",
    "ht": "Enstale aplikasyon"
  },
  "It will open from your Home Screen like an app.": {
    "es": "Se abrirá desde tu pantalla de inicio como una app.",
    "fr": "Elle s’ouvrira depuis votre écran d’accueil comme une application.",
    "ht": "Li ap ouvri sou ekran dakèy ou tankou yon aplikasyon."
  },
  "SHARE ACCESS": {
    "es": "COMPARTIR ACCESO",
    "fr": "PARTAGER L’ACCÈS",
    "ht": "PATAJE AKSÈ"
  },
  "Access sharing": {
    "es": "Compartir acceso",
    "fr": "Partage d’accès",
    "ht": "Pataje aksè"
  },
  "Add the worker": {
    "es": "Añade al empleado",
    "fr": "Ajoutez l’employé",
    "ht": "Ajoute anplwaye a"
  },
  "Create their Team profile.": {
    "es": "Crea su perfil en Equipo.",
    "fr": "Créez son profil dans Équipe.",
    "ht": "Kreye pwofil Ekip li."
  },
  "Assign jobs": {
    "es": "Asigna trabajos",
    "fr": "Attribuez des travaux",
    "ht": "Asiyen travay"
  },
  "Only assigned jobs will be visible.": {
    "es": "Solo serán visibles los trabajos asignados.",
    "fr": "Seuls les travaux attribués seront visibles.",
    "ht": "Se sèlman travay asiyen yo ki ap vizib."
  },
  "Send the private link by text or WhatsApp.": {
    "es": "Envía el enlace privado por SMS o WhatsApp.",
    "fr": "Envoyez le lien privé par SMS ou WhatsApp.",
    "ht": "Voye lyen prive a pa SMS oswa WhatsApp."
  },
  "No password. They see assigned work and can message the admin.": {
    "es": "Sin contraseña. Ven sus trabajos asignados y pueden escribir al admin.",
    "fr": "Sans mot de passe. Ils voient leurs travaux attribués et peuvent écrire à l’administrateur.",
    "ht": "Pa bezwen modpas. Yo wè travay asiyen yo epi yo ka ekri admin."
  },
  "ACCESS LEVELS": {
    "es": "NIVELES DE ACCESO",
    "fr": "NIVEAUX D’ACCÈS",
    "ht": "NIVO AKSÈ"
  },
  "Access levels": {
    "es": "Niveles de acceso",
    "fr": "Niveaux d’accès",
    "ht": "Nivo aksè"
  },
  "GUIDED TOUR": {
    "es": "RECORRIDO GUIADO",
    "fr": "VISITE GUIDÉE",
    "ht": "GID ETAP PA ETAP"
  },
  "Guided tour": {
    "es": "Recorrido guiado",
    "fr": "Visite guidée",
    "ht": "Gid etap pa etap"
  },
  "The first-time tips explain each section in a few words. Restart them anytime without changing your business data.": {
    "es": "Los consejos iniciales explican cada sección en pocas palabras. Puedes reiniciarlos cuando quieras sin cambiar los datos del negocio.",
    "fr": "Les conseils de première utilisation expliquent chaque section en quelques mots. Relancez-les à tout moment sans modifier vos données.",
    "ht": "Konsèy premye itilizasyon yo eksplike chak seksyon an kèk mo. Ou ka rekòmanse yo nenpòt lè san chanje done biznis ou."
  },
  "Request failed": {
    "es": "La solicitud falló.",
    "fr": "La demande a échoué.",
    "ht": "Demann lan echwe."
  },
  "Done": {
    "es": "Listo",
    "fr": "Terminé",
    "ht": "Fini"
  },
  "Cleaning business": {
    "es": "Negocio de limpieza",
    "fr": "Entreprise de nettoyage",
    "ht": "Biznis netwayaj"
  },
  "partial": {
    "es": "parcial",
    "fr": "partiel",
    "ht": "pasyèl"
  },
  "Void": {
    "es": "Anulada",
    "fr": "Annulé",
    "ht": "Anile"
  },
  "No invoice items found.": {
    "es": "No se encontraron artículos en la factura.",
    "fr": "Aucun élément de facture trouvé.",
    "ht": "Pa jwenn okenn atik nan fakti a."
  },
  "Payment confirmed by the cleaning business.": {
    "es": "Pago confirmado por el negocio de limpieza.",
    "fr": "Paiement confirmé par l’entreprise de nettoyage.",
    "ht": "Biznis netwayaj la konfime peman an."
  },
  "Payment method sent": {
    "es": "Forma de pago enviada",
    "fr": "Mode de paiement envoyé",
    "ht": "Metòd peman voye"
  },
  "Selected": {
    "es": "Seleccionado",
    "fr": "Sélectionné",
    "ht": "Chwazi"
  },
  "Tap Submit invoice to send this choice.": {
    "es": "Toca Enviar factura para enviar esta opción.",
    "fr": "Touchez Envoyer la facture pour transmettre ce choix.",
    "ht": "Peze Voye fakti pou voye chwa sa a."
  },
  "We received your payment choice.": {
    "es": "Recibimos tu forma de pago.",
    "fr": "Nous avons reçu votre choix de paiement.",
    "ht": "Nou resevwa chwa peman ou."
  },
  "The business will confirm it once the payment is received.": {
    "es": "El negocio lo confirmará cuando reciba el pago.",
    "fr": "L’entreprise le confirmera une fois le paiement reçu.",
    "ht": "Biznis la ap konfime li lè peman an resevwa."
  },
  "Could not submit invoice.": {
    "es": "No se pudo enviar la factura.",
    "fr": "Impossible d’envoyer la facture.",
    "ht": "Pa t ka voye fakti a."
  },
  "Please explain what you would like reviewed.": {
    "es": "Explica qué te gustaría que revisaran.",
    "fr": "Expliquez ce que vous souhaitez faire vérifier.",
    "ht": "Tanpri esplike sa ou ta renmen yo revize."
  },
  "Sending dispute…": {
    "es": "Enviando disputa…",
    "fr": "Envoi de la contestation…",
    "ht": "N ap voye kontestasyon an…"
  },
  "Dispute sent. The cleaning business can now review your message.": {
    "es": "Disputa enviada. El negocio de limpieza ya puede revisar tu mensaje.",
    "fr": "Contestation envoyée. L’entreprise de nettoyage peut maintenant examiner votre message.",
    "ht": "Kontestasyon an voye. Biznis netwayaj la ka revize mesaj ou kounye a."
  },
  "Could not send dispute.": {
    "es": "No se pudo enviar la disputa.",
    "fr": "Impossible d’envoyer la contestation.",
    "ht": "Pa t ka voye kontestasyon an."
  },
  "This invoice link is invalid or expired.": {
    "es": "Este enlace de factura no es válido o venció.",
    "fr": "Ce lien de facture est invalide ou a expiré.",
    "ht": "Lyen fakti sa a pa valab oswa li ekspire."
  },
  "No quote items found.": {
    "es": "No se encontraron artículos en la cotización.",
    "fr": "Aucun élément de devis trouvé.",
    "ht": "Pa jwenn okenn atik nan devis la."
  },
  "Accepted. Your service is confirmed.": {
    "es": "Aceptado. Tu servicio está confirmado.",
    "fr": "Accepté. Votre service est confirmé.",
    "ht": "Aksepte. Sèvis ou konfime."
  },
  "This quote was declined.": {
    "es": "Esta cotización fue rechazada.",
    "fr": "Ce devis a été refusé.",
    "ht": "Devis sa a te refize."
  },
  "This quote is not currently awaiting a response.": {
    "es": "Esta cotización no está esperando respuesta.",
    "fr": "Ce devis n’attend pas de réponse actuellement.",
    "ht": "Devis sa a pa ap tann yon repons kounye a."
  },
  "Submitting your acceptance…": {
    "es": "Enviando aceptación…",
    "fr": "Envoi de votre acceptation…",
    "ht": "N ap voye akseptasyon ou…"
  },
  "Submitting your decline…": {
    "es": "Enviando rechazo…",
    "fr": "Envoi de votre refus…",
    "ht": "N ap voye refi ou…"
  },
  "Could not submit quote.": {
    "es": "No se pudo enviar la cotización.",
    "fr": "Impossible d’envoyer le devis.",
    "ht": "Pa t ka voye devis la."
  },
  "This quote link is invalid or expired.": {
    "es": "Este enlace de cotización no es válido o venció.",
    "fr": "Ce lien de devis est invalide ou a expiré.",
    "ht": "Lyen devis sa a pa valab oswa li ekspire."
  },
  "Checking availability…": {
    "es": "Comprobando disponibilidad…",
    "fr": "Vérification des disponibilités…",
    "ht": "N ap tcheke disponiblite…"
  },
  "No openings on this date. Try another day.": {
    "es": "No hay horarios disponibles en esta fecha. Prueba otro día.",
    "fr": "Aucun créneau disponible à cette date. Essayez un autre jour.",
    "ht": "Pa gen lè ki disponib nan dat sa a. Eseye yon lòt jou."
  },
  "Could not load availability": {
    "es": "No se pudo cargar la disponibilidad",
    "fr": "Impossible de charger les disponibilités",
    "ht": "Pa t ka chaje disponiblite"
  },
  "No custom quote services are set up yet. Use Book a Cleaning for services with upfront pricing.": {
    "es": "Aún no hay servicios personalizados configurados para cotización. Usa Reservar una limpieza para servicios con precio definido.",
    "fr": "Aucun service personnalisé sur devis n’est encore configuré. Utilisez Réserver un nettoyage pour les services avec un prix défini.",
    "ht": "Pa gen sèvis pèsonalize pou devis ki konfigire ankò. Sèvi ak Rezève yon netwayaj pou sèvis ki gen pri dirèk."
  },
  "No priced services are available for online booking. Custom or variable-price work belongs in Request a Quote.": {
    "es": "No hay servicios con precio disponibles para reservar online. Los trabajos personalizados o de precio variable van en Pedir una cotización.",
    "fr": "Aucun service tarifé n’est disponible à la réservation en ligne. Les travaux personnalisés ou à prix variable passent par Demander un devis.",
    "ht": "Pa gen sèvis ki gen pri disponib pou rezèvasyon sou entènèt. Travay pèsonalize oswa pri varyab ale nan Mande yon devis."
  },
  "Phone is required for Text or WhatsApp.": {
    "es": "El teléfono es obligatorio para SMS o WhatsApp.",
    "fr": "Le téléphone est obligatoire pour SMS ou WhatsApp.",
    "ht": "Telefòn obligatwa pou SMS oswa WhatsApp."
  },
  "Choose Residential or Commercial.": {
    "es": "Elige Residencial o Comercial.",
    "fr": "Choisissez Résidentiel ou Commercial.",
    "ht": "Chwazi Rezidansyèl oswa Komèsyal."
  },
  "Property size must be greater than 0.": {
    "es": "El tamaño de la propiedad debe ser mayor que 0.",
    "fr": "La surface doit être supérieure à 0.",
    "ht": "Gwosè pwopriyete a dwe pi gran pase 0."
  },
  "Enter the number of bedrooms.": {
    "es": "Escribe el número de habitaciones.",
    "fr": "Indiquez le nombre de chambres.",
    "ht": "Antre kantite chanm yo."
  },
  "Enter the number of bathrooms.": {
    "es": "Escribe el número de baños.",
    "fr": "Indiquez le nombre de salles de bain.",
    "ht": "Antre kantite twalèt yo."
  },
  "Choose the commercial space type.": {
    "es": "Elige el tipo de espacio comercial.",
    "fr": "Choisissez le type d’espace commercial.",
    "ht": "Chwazi kalite espas komèsyal la."
  },
  "Choose one of the available times.": {
    "es": "Elige uno de los horarios disponibles.",
    "fr": "Choisissez l’un des créneaux disponibles.",
    "ht": "Chwazi youn nan lè ki disponib yo."
  },
  "This page is not available.": {
    "es": "Esta página no está disponible.",
    "fr": "Cette page n’est pas disponible.",
    "ht": "Paj sa a pa disponib."
  },
  "Price provided after review": {
    "es": "Precio después de revisar",
    "fr": "Prix après examen",
    "ht": "Pri apre revizyon"
  },
  "No add-ons for this service.": {
    "es": "No hay extras para este servicio.",
    "fr": "Aucune option pour ce service.",
    "ht": "Pa gen opsyon pou sèvis sa a."
  },
  "Choose a service and date first.": {
    "es": "Primero elige un servicio y una fecha.",
    "fr": "Choisissez d’abord un service et une date.",
    "ht": "Chwazi yon sèvis ak yon dat an premye."
  },
  "Book a Cleaning": {
    "es": "Reservar una limpieza",
    "fr": "Réserver un nettoyage",
    "ht": "Rezève yon netwayaj"
  },
  "Request a Quote": {
    "es": "Pedir una cotización",
    "fr": "Demander un devis",
    "ht": "Mande yon devis"
  },
  "BOOK A CLEANING": {
    "es": "RESERVAR UNA LIMPIEZA",
    "fr": "RÉSERVER UN NETTOYAGE",
    "ht": "REZÈVE YON NETWAYAJ"
  },
  "REQUEST A QUOTE": {
    "es": "PEDIR UNA COTIZACIÓN",
    "fr": "DEMANDER UN DEVIS",
    "ht": "MANDE YON DEVIS"
  },
  "Choose request type": {
    "es": "Elige el tipo de solicitud",
    "fr": "Choisissez le type de demande",
    "ht": "Chwazi kalite demann"
  },
  "Choose your service and send your request.": {
    "es": "Elige tu servicio y envía tu solicitud.",
    "fr": "Choisissez votre service et envoyez votre demande.",
    "ht": "Chwazi sèvis ou epi voye demann ou."
  },
  "Choose a service with upfront pricing, then pick a real available time.": {
    "es": "Elige un servicio con precio definido y luego selecciona un horario realmente disponible.",
    "fr": "Choisissez un service avec un prix défini, puis sélectionnez un créneau réellement disponible.",
    "ht": "Chwazi yon sèvis ak pri dirèk, apre sa chwazi yon lè ki vrèman disponib."
  },
  "For custom or variable-price work. Choose a quote-only service and tell us about the job.": {
    "es": "Para trabajos personalizados o de precio variable. Elige un servicio de cotización y cuéntanos sobre el trabajo.",
    "fr": "Pour les travaux personnalisés ou à prix variable. Choisissez un service sur devis et décrivez le travail.",
    "ht": "Pou travay pèsonalize oswa pri varyab. Chwazi yon sèvis devis sèlman epi di nou sou travay la."
  },
  "Custom job type": {
    "es": "Tipo de trabajo personalizado",
    "fr": "Type de travail personnalisé",
    "ht": "Kalite travay pèsonalize"
  },
  "Choose a custom job type": {
    "es": "Elige un tipo de trabajo personalizado",
    "fr": "Choisissez un type de travail personnalisé",
    "ht": "Chwazi yon kalite travay pèsonalize"
  },
  "Custom quote": {
    "es": "Cotización personalizada",
    "fr": "Devis personnalisé",
    "ht": "Devis pèsonalize"
  },
  "No quote-only services available yet": {
    "es": "Aún no hay servicios de cotización disponibles",
    "fr": "Aucun service sur devis n’est encore disponible",
    "ht": "Pa gen sèvis devis sèlman ki disponib ankò"
  },
  "No priced services available for online booking": {
    "es": "Aún no hay servicios con precio disponibles para reservar online",
    "fr": "Aucun service tarifé n’est encore disponible à la réservation en ligne",
    "ht": "Pa gen sèvis ki gen pri disponib pou rezèvasyon sou entènèt ankò"
  },
  "Your quote request was sent. The business will review it and contact you.": {
    "es": "Tu solicitud de cotización fue enviada. El negocio la revisará y se pondrá en contacto contigo.",
    "fr": "Votre demande de devis a été envoyée. L’entreprise l’examinera et vous contactera.",
    "ht": "Demann devis ou voye. Biznis la ap revize li epi kontakte ou."
  },
  "Your booking request was sent. The business will review it and confirm the appointment.": {
    "es": "Tu solicitud de reserva fue enviada. El negocio la revisará y confirmará la cita.",
    "fr": "Votre demande de réservation a été envoyée. L’entreprise l’examinera et confirmera le rendez-vous.",
    "ht": "Demann rezèvasyon ou voye. Biznis la ap revize li epi konfime randevou a."
  },
  "Could not send request": {
    "es": "No se pudo enviar la solicitud",
    "fr": "Impossible d’envoyer la demande",
    "ht": "Pa t ka voye demann lan"
  },
  "Page unavailable": {
    "es": "Página no disponible",
    "fr": "Page indisponible",
    "ht": "Paj pa disponib"
  },
  "Quote unavailable": {
    "es": "Cotización no disponible",
    "fr": "Devis indisponible",
    "ht": "Devis pa disponib"
  },
  "Invoice unavailable": {
    "es": "Factura no disponible",
    "fr": "Facture indisponible",
    "ht": "Fakti pa disponib"
  },
  "Review the details below and choose Accept or Decline.": {
    "es": "Revisa los detalles y elige Aceptar o Rechazar.",
    "fr": "Vérifiez les détails ci-dessous et choisissez Accepter ou Refuser.",
    "ht": "Revize detay ki anba yo epi chwazi Aksepte oswa Refize."
  },
  "Quote for": {
    "es": "Cotización para",
    "fr": "Devis pour",
    "ht": "Devis pou"
  },
  "your cleaning": {
    "es": "tu limpieza",
    "fr": "votre nettoyage",
    "ht": "netwayaj ou"
  },
  "Qty": {
    "es": "Cant.",
    "fr": "Qté",
    "ht": "Kant."
  },
  "Due": {
    "es": "Vence",
    "fr": "Échéance",
    "ht": "Dat limit"
  },
  "Open Cleaning App": {
    "es": "Abrir Cleaning App",
    "fr": "Ouvrir Cleaning App",
    "ht": "Louvri Cleaning App"
  }
};
  for(const [source,translations] of Object.entries(coverageV208)){
    for(const lang of ["es","fr","ht"]){
      staticCorrections[lang]=staticCorrections[lang]||{};
      const value=translations?.[lang];
      if(typeof value==="string" && value.trim()) staticCorrections[lang][source]=value;
    }
  }

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

  Object.assign(exact,{
    "Property details":"Detalles de la propiedad",
    "Enough detail for the business to price and prepare the job correctly.":"La información necesaria para que el negocio cotice y prepare el trabajo correctamente.",
    "Approx. property size":"Tamaño aproximado de la propiedad",
    "Property size unit":"Unidad de tamaño",
    "Bedrooms":"Habitaciones",
    "Bathrooms":"Baños",
    "Floors / levels":"Pisos / niveles",
    "Pets in the home":"Mascotas en la casa",
    "No pets":"Sin mascotas",
    "Yes":"Sí",
    "Prefer not to say":"Prefiero no decir",
    "Space type":"Tipo de espacio",
    "Retail / storefront":"Tienda / local comercial",
    "Medical / dental":"Médico / dental",
    "Restaurant / food service":"Restaurante / servicio de comida",
    "Warehouse / industrial":"Almacén / industrial",
    "Restrooms":"Baños",
    "When was it last professionally cleaned?":"¿Cuándo fue la última limpieza profesional?",
    "Less than a month ago":"Hace menos de un mes",
    "1–3 months ago":"Hace 1–3 meses",
    "3–6 months ago":"Hace 3–6 meses",
    "More than 6 months ago":"Hace más de 6 meses",
    "Never / not sure":"Nunca / no estoy seguro",
    "Access / parking":"Acceso / estacionamiento",
    "Gate, parking, building access, stairs, elevator…":"Portón, estacionamiento, acceso al edificio, escaleras, elevador…",
    "Contact":"Contacto",
    "Where the business should send confirmations and follow-ups.":"Dónde debe enviar el negocio las confirmaciones y seguimientos.",
    "Special requests":"Solicitudes especiales",
    "Pets, fragile items, priority rooms, add-ons, or anything else we should know.":"Mascotas, objetos frágiles, habitaciones prioritarias, extras o cualquier otra cosa que debamos saber.",
    "Times shown in the cleaning business’s local time":"Los horarios se muestran en la hora local del negocio de limpieza",
    "Property size must be greater than 0.":"El tamaño de la propiedad debe ser mayor que 0.",
    "Enter the number of bedrooms.":"Escribe el número de habitaciones.",
    "Enter the number of bathrooms.":"Escribe el número de baños.",
    "Choose the commercial space type.":"Elige el tipo de espacio comercial."
  });


  Object.assign(extra.fr,{
    "Property details":"Détails du logement",
    "Enough detail for the business to price and prepare the job correctly.":"Les informations nécessaires pour établir le prix et préparer correctement la prestation.",
    "Approx. property size":"Surface approximative",
    "Property size unit":"Unité de surface",
    "Bedrooms":"Chambres",
    "Bathrooms":"Salles de bain",
    "Floors / levels":"Étages / niveaux",
    "Pets in the home":"Animaux dans le logement",
    "No pets":"Aucun animal",
    "Yes":"Oui",
    "Prefer not to say":"Je préfère ne pas préciser",
    "Space type":"Type d’espace",
    "Retail / storefront":"Commerce / boutique",
    "Medical / dental":"Médical / dentaire",
    "Restaurant / food service":"Restaurant / restauration",
    "Warehouse / industrial":"Entrepôt / industriel",
    "Restrooms":"Sanitaires",
    "When was it last professionally cleaned?":"Quand le lieu a-t-il été nettoyé professionnellement pour la dernière fois ?",
    "Less than a month ago":"Il y a moins d’un mois",
    "1–3 months ago":"Il y a 1–3 mois",
    "3–6 months ago":"Il y a 3–6 mois",
    "More than 6 months ago":"Il y a plus de 6 mois",
    "Never / not sure":"Jamais / je ne sais pas",
    "Access / parking":"Accès / stationnement",
    "Gate, parking, building access, stairs, elevator…":"Portail, stationnement, accès au bâtiment, escaliers, ascenseur…",
    "Contact":"Contact",
    "Where the business should send confirmations and follow-ups.":"Coordonnées utilisées pour les confirmations et les suivis.",
    "Special requests":"Demandes particulières",
    "Pets, fragile items, priority rooms, add-ons, or anything else we should know.":"Animaux, objets fragiles, pièces prioritaires, options ou toute autre information utile.",
    "Times shown in the cleaning business’s local time":"Les horaires sont affichés dans l’heure locale de l’entreprise de nettoyage",
    "Property size must be greater than 0.":"La surface doit être supérieure à 0.",
    "Enter the number of bedrooms.":"Indiquez le nombre de chambres.",
    "Enter the number of bathrooms.":"Indiquez le nombre de salles de bain.",
    "Choose the commercial space type.":"Choisissez le type d’espace commercial."
  });

  Object.assign(exact,{
    "Property details":"Detalles de la propiedad",
    "Enough detail for the business to price and prepare the job correctly.":"La información necesaria para que el negocio pueda calcular y preparar bien el trabajo.",
    "Property type":"Tipo de propiedad",
    "Choose one":"Elige una opción",
    "Residential":"Residencial",
    "Commercial":"Comercial",
    "Approx. property size":"Tamaño aproximado de la propiedad",
    "Approximate is fine if you do not know the exact size.":"Un tamaño aproximado está bien si no sabes la medida exacta.",
    "Property size unit":"Unidad del tamaño de la propiedad",
    "Bedrooms":"Habitaciones",
    "Bathrooms":"Baños",
    "Floors / levels":"Pisos / niveles",
    "Pets in the home":"Mascotas en la propiedad",
    "No pets":"Sin mascotas",
    "Yes":"Sí",
    "Prefer not to say":"Prefiero no decirlo",
    "Pet details":"Detalles de mascotas",
    "e.g. 2 dogs, 1 cat":"Ej. 2 perros, 1 gato",
    "Space type":"Tipo de espacio",
    "Retail / storefront":"Tienda / local comercial",
    "Medical / dental":"Médico / dental",
    "Restaurant / food service":"Restaurante / servicio de alimentos",
    "Warehouse / industrial":"Almacén / industrial",
    "Restrooms":"Baños",
    "Business hours":"Horario del negocio",
    "e.g. Mon–Fri 9:00–5:00":"Ej. lun–vie 9:00–5:00",
    "Clean during business hours?":"¿Se puede limpiar durante el horario del negocio?",
    "No":"No",
    "Flexible":"Flexible",
    "Current condition":"Condición actual",
    "Regular upkeep":"Mantenimiento regular",
    "Needs extra attention":"Necesita atención extra",
    "Heavy buildup":"Acumulación fuerte",
    "Move-in / move-out":"Mudanza: entrada / salida",
    "Not sure":"No estoy seguro",
    "When was it last professionally cleaned?":"¿Cuándo fue la última limpieza profesional?",
    "Less than a month ago":"Hace menos de un mes",
    "1–3 months ago":"Hace 1–3 meses",
    "3–6 months ago":"Hace 3–6 meses",
    "More than 6 months ago":"Hace más de 6 meses",
    "Never / not sure":"Nunca / no estoy seguro",
    "Access / parking":"Acceso / estacionamiento",
    "Gate, parking, building access, stairs, elevator…":"Portón, estacionamiento, acceso al edificio, escaleras, elevador…",
    "Contact":"Contacto",
    "Where the business should send confirmations and follow-ups.":"Dónde debe enviar el negocio las confirmaciones y seguimientos.",
    "Email language":"Idioma del email",
    "Special requests":"Solicitudes especiales",
    "Pets, fragile items, priority rooms, add-ons, or anything else we should know.":"Mascotas, objetos frágiles, habitaciones prioritarias, extras o cualquier otra cosa que debamos saber.",
    "Times shown in the cleaning business’s local time":"Las horas se muestran en la zona horaria local del negocio de limpieza",
    "Your device time zone":"Zona horaria de tu dispositivo",
    "(optional)":"(opcional)"
  });


  Object.assign(extra.fr,{
    "Property details":"Détails du logement",
    "Enough detail for the business to price and prepare the job correctly.":"Assez d’informations pour permettre à l’entreprise de chiffrer et préparer correctement le service.",
    "Property type":"Type de propriété","Choose one":"Choisissez une option","Residential":"Résidentiel","Commercial":"Commercial",
    "Approx. property size":"Surface approximative","Approximate is fine if you do not know the exact size.":"Une estimation suffit si vous ne connaissez pas la surface exacte.","Property size unit":"Unité de surface",
    "Bedrooms":"Chambres","Bathrooms":"Salles de bain","Floors / levels":"Étages / niveaux","Pets in the home":"Animaux sur place","No pets":"Aucun animal","Yes":"Oui","Prefer not to say":"Je préfère ne pas préciser","Pet details":"Détails sur les animaux","e.g. 2 dogs, 1 cat":"Ex. 2 chiens, 1 chat",
    "Space type":"Type d’espace","Retail / storefront":"Commerce / boutique","Medical / dental":"Médical / dentaire","Restaurant / food service":"Restaurant / restauration","Warehouse / industrial":"Entrepôt / industriel","Restrooms":"Sanitaires",
    "Business hours":"Horaires d’ouverture","e.g. Mon–Fri 9:00–5:00":"Ex. lun–ven 9:00–17:00","Clean during business hours?":"Le nettoyage peut-il avoir lieu pendant les heures d’ouverture ?","No":"Non","Flexible":"Flexible",
    "Current condition":"État actuel","Regular upkeep":"Entretien régulier","Needs extra attention":"Nécessite plus d’attention","Heavy buildup":"Accumulation importante","Move-in / move-out":"Emménagement / déménagement","Not sure":"Je ne sais pas",
    "When was it last professionally cleaned?":"Quand a eu lieu le dernier nettoyage professionnel ?","Less than a month ago":"Il y a moins d’un mois","1–3 months ago":"Il y a 1–3 mois","3–6 months ago":"Il y a 3–6 mois","More than 6 months ago":"Il y a plus de 6 mois","Never / not sure":"Jamais / je ne sais pas",
    "Access / parking":"Accès / stationnement","Gate, parking, building access, stairs, elevator…":"Portail, stationnement, accès au bâtiment, escaliers, ascenseur…",
    "Contact":"Contact","Where the business should send confirmations and follow-ups.":"Où l’entreprise doit envoyer les confirmations et les suivis.","Email language":"Langue des e-mails","Special requests":"Demandes particulières","Pets, fragile items, priority rooms, add-ons, or anything else we should know.":"Animaux, objets fragiles, pièces prioritaires, options ou toute autre information utile.",
    "Times shown in the cleaning business’s local time":"Les horaires sont affichés dans le fuseau horaire local de l’entreprise de nettoyage","Your device time zone":"Fuseau horaire de votre appareil","(optional)":"(facultatif)"
  });

  Object.assign(exact,{"Phone (optional)":"Teléfono (opcional)"});
  Object.assign(extra.fr,{"Phone (optional)":"Téléphone (facultatif)"});

  Object.assign(exact,{
    "Street, city, region, postal code, country":"Calle, ciudad, región, código postal, país",
    "Parking, doorman, stairs, elevator…":"Estacionamiento, portero, escaleras, elevador…",
    "Do not enter door, lockbox or alarm codes here.":"No escribas aquí códigos de puerta, caja de llaves ni alarma."
  });
  Object.assign(extra.fr,{
    "Street, city, region, postal code, country":"Rue, ville, région, code postal, pays",
    "Parking, doorman, stairs, elevator…":"Stationnement, concierge, escaliers, ascenseur…",
    "Do not enter door, lockbox or alarm codes here.":"N’indiquez pas ici de code de porte, de boîte à clés ou d’alarme."
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
  const SUPPORTED=["en","es","fr","ht"];
  const browserLanguage=String(navigator.language||"en").slice(0,2).toLowerCase();
  const savedLanguage=String(localStorage.getItem(STORAGE_KEY)||"").trim().toLowerCase();
  if(savedLanguage && !SUPPORTED.includes(savedLanguage)){
    localStorage.removeItem(STORAGE_KEY);
  }
  let lang=SUPPORTED.includes(savedLanguage)
    ? savedLanguage
    : (SUPPORTED.includes(browserLanguage)?browserLanguage:"en");

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

  const LANGUAGE_NAMES={en:"English",es:"Español",fr:"Français",ht:"Kreyòl Ayisyen"};

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
        <button type="button" class="language-choice" data-language-choice="fr"><span>Français</span><small>FR</small></button>
        <button type="button" class="language-choice" data-language-choice="ht"><span>Kreyòl Ayisyen</span><small>HT</small></button>
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
    const staticNames={es:"Español",en:"English",fr:"Français",ht:"Kreyòl Ayisyen"};
    const menuCopy={
      en:{kicker:"LANGUAGE",title:"Choose your language",more:"MORE LANGUAGES",close:"Close",button:"Language",aria:"Choose language"},
      es:{kicker:"IDIOMA",title:"Elige tu idioma",more:"MÁS IDIOMAS",close:"Cerrar",button:"Idioma",aria:"Elegir idioma"},
      fr:{kicker:"LANGUE",title:"Choisissez votre langue",more:"AUTRES LANGUES",close:"Fermer",button:"Langue",aria:"Choisir la langue"},
      ht:{kicker:"LANG",title:"Chwazi lang ou",more:"PLIS LANG",close:"Fèmen",button:"Lang",aria:"Chwazi lang"}
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
      fr:{button:"Langue",aria:"Choisir la langue"},
      ht:{button:"Lang",aria:"Chwazi lang"}
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
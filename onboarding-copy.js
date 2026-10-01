// The Launch Era Cleaning Web App — onboarding copy only.
// Separated from app.js so runtime logic stays smaller and easier to audit.
(function(){
const ONBOARDING_COPY={
  welcome:{
    en:{kicker:"YOU’RE IN",title:"Thanks for choosing The Launch Era Cleaning Web App.",text:"Your account is ready. We’ll stay with you for the first few steps so you can see where everything lives without having to figure it out alone."},
    es:{kicker:"YA ESTÁS DENTRO",title:"Gracias por usar The Launch Era Cleaning Web App.",text:"Tu cuenta ya está lista. Te acompañaremos en los primeros pasos para que veas dónde está cada cosa sin tener que descubrirlo todo sola."}
  },
  today:{
    en:{title:"Today",text:"Your daily snapshot: today’s jobs, booking requests, open quotes, invoices and follow-through."},
    es:{title:"Hoy",text:"Tu resumen diario: trabajos de hoy, solicitudes de reserva, cotizaciones, facturas y pendientes."}
  },
  booking:{
    en:{title:"Booking Center",text:"Manage booking requests, availability and the public booking link your clients use."},
    es:{title:"Centro de reservas",text:"Maneja solicitudes de reserva, disponibilidad y el enlace público que usan tus clientes."}
  },
  leads:{
    en:{title:"Leads",text:"Keep potential customers here before they become active clients or booked jobs."},
    es:{title:"Leads",text:"Guarda aquí clientes potenciales antes de convertirlos en clientes activos o trabajos reservados."}
  },
  clients:{
    en:{title:"Clients",text:"Store client contact details, service addresses and the records you need for future jobs."},
    es:{title:"Clientes",text:"Guarda datos de contacto, direcciones de servicio y la información que necesitas para futuros trabajos."}
  },
  calendar:{
    en:{title:"Calendar + Jobs",text:"See upcoming jobs and open dates so you can plan the schedule without double-booking."},
    es:{title:"Calendario + trabajos",text:"Mira los próximos trabajos y fechas disponibles para organizarte sin duplicar reservas."}
  },
  quotes:{
    en:{title:"Quotes",text:"Review requests, build estimates, send them to clients and track whether they are accepted or declined."},
    es:{title:"Cotizaciones",text:"Revisa solicitudes, prepara estimados, envíalos al cliente y controla si fueron aceptados o rechazados."}
  },
  invoices:{
    en:{title:"Invoices",text:"Create and send invoices, then record the payment method your business accepts when the client pays."},
    es:{title:"Facturas",text:"Crea y envía facturas y registra la forma de pago que acepta tu negocio cuando el cliente pague."}
  },
  followups:{
    en:{title:"Follow-ups",text:"See which leads, quotes, invoices, completed cleanings and past clients need the next touch."},
    es:{title:"Seguimientos",text:"Mira qué leads, cotizaciones, facturas, limpiezas terminadas y clientes anteriores necesitan el próximo contacto."}
  },
  route:{
    en:{title:"Today’s Route",text:"See today’s stops in order so you and your team know where to go next."},
    es:{title:"Ruta de hoy",text:"Mira las paradas de hoy en orden para que tú y tu equipo sepan cuál sigue."}
  },
  mileage:{
    en:{title:"Mileage",text:"Log business distance connected to jobs so your driving records stay organized."},
    es:{title:"Millaje",text:"Registra las millas del negocio vinculadas a trabajos para mantener tus recorridos organizados."}
  },
  time:{
    en:{title:"Time Tracking",text:"Start and stop work timers and keep track of hours worked on jobs."},
    es:{title:"Control de tiempo",text:"Inicia y detén temporizadores de trabajo y lleva control de las horas trabajadas."}
  },
  reports:{
    en:{title:"Owner Reports",text:"Owner-only view of business activity, totals and operational performance."},
    es:{title:"Reportes del dueño",text:"Vista solo para el dueño con actividad, totales y desempeño operativo del negocio."}
  },
  services:{
    en:{title:"Services + Add-ons",text:"Create the services, prices and extras used in bookings, quotes and invoices."},
    es:{title:"Servicios + extras",text:"Crea los servicios, precios y extras que usarás en reservas, cotizaciones y facturas."}
  },
  supplies:{
    en:{title:"Supplies",text:"Keep your cleaning supply list organized so you know what the business needs."},
    es:{title:"Suministros",text:"Mantén organizada tu lista de productos de limpieza para saber qué necesita el negocio."}
  },
  team:{
    en:{title:"Team",text:"Add employees, assign jobs, share Guest Employee Access and message them without exposing owner controls."},
    es:{title:"Equipo",text:"Añade empleados, asigna trabajos, comparte acceso de invitado y envíales mensajes sin mostrar controles del dueño."}
  },
  settings:{
    en:{title:"Settings",text:"Edit company details, booking rules, payment options, client emails and your review link."},
    es:{title:"Configuración",text:"Edita datos de la compañía, reglas de reserva, pagos, correos al cliente y enlace de reseñas."}
  },
  admin:{
    en:{title:"Owner Admin",text:"Sensitive owner controls live here: access, permissions, integrations and account-level settings."},
    es:{title:"Admin del dueño",text:"Aquí están los controles sensibles del dueño: accesos, permisos, integraciones y ajustes de la cuenta."}
  },
  help:{
    en:{title:"Help & FAQ",text:"Find setup help, access instructions and common answers. You can restart this guided tour here anytime."},
    es:{title:"Ayuda y preguntas",text:"Encuentra ayuda de configuración, instrucciones de acceso y respuestas comunes. Aquí puedes reiniciar este recorrido cuando quieras."}
  },
  "platform-admin":{
    en:{title:"Owner View",text:"Private owner controls for web app customers, subscriptions and real product activity."},
    es:{title:"Owner View",text:"Vista privada para clientes de la Web App, suscripciones y actividad real del producto."}
  }
};

const ONBOARDING_EXTRA={
  fr:{
    welcome:{kicker:"BIENVENUE",title:"Merci d’utiliser The Launch Era Cleaning Web App.",text:"Votre compte est prêt. Nous allons vous accompagner dans les premières étapes pour que vous sachiez où tout se trouve sans devoir tout découvrir seul."},
    today:{title:"Aujourd’hui",text:"Votre résumé du jour : travaux, demandes de réservation, devis, factures et éléments en attente."},
    booking:{title:"Réservations",text:"Gérez les demandes de réservation, les disponibilités et le lien public utilisé par vos clients."},
    leads:{title:"Prospects",text:"Gardez les clients potentiels ici avant qu’ils deviennent des clients actifs ou des travaux réservés."},
    clients:{title:"Clients",text:"Conservez les coordonnées, adresses de service et informations nécessaires pour les prochains travaux."},
    calendar:{title:"Calendrier + travaux",text:"Consultez les travaux à venir et les créneaux libres pour éviter les doubles réservations."},
    quotes:{title:"Devis",text:"Examinez les demandes, créez des devis, envoyez-les et suivez leur acceptation ou leur refus."},
    invoices:{title:"Factures",text:"Créez et envoyez des factures puis enregistrez le mode de paiement accepté par votre entreprise."},
    followups:{title:"Suivis",text:"Voyez quels prospects, devis, factures, nettoyages terminés et anciens clients ont besoin d’un prochain contact."},
    route:{title:"Itinéraire du jour",text:"Voyez les arrêts du jour dans l’ordre pour savoir où aller ensuite."},
    mileage:{title:"Kilométrage",text:"Enregistrez les déplacements professionnels liés aux travaux pour garder vos trajets organisés."},
    time:{title:"Suivi du temps",text:"Démarrez et arrêtez les chronomètres pour suivre le temps travaillé sur chaque intervention."},
    reports:{title:"Rapports",text:"Consultez l’activité, les totaux et les performances opérationnelles de l’entreprise."},
    services:{title:"Services + options",text:"Créez les services, prix et options utilisés dans les réservations, devis et factures."},
    supplies:{title:"Fournitures",text:"Organisez les produits de nettoyage pour savoir ce qui doit être réapprovisionné."},
    team:{title:"Équipe",text:"Ajoutez des employés, attribuez des travaux, partagez un accès invité et échangez des messages sans exposer les contrôles du propriétaire."},
    settings:{title:"Paramètres",text:"Modifiez les informations de l’entreprise, les règles de réservation, paiements, e-mails clients et liens."},
    admin:{title:"Administration propriétaire",text:"Les contrôles sensibles sont ici : accès, permissions, intégrations et paramètres du compte."},
    help:{title:"Aide et FAQ",text:"Trouvez l’aide de configuration, les instructions d’accès et les réponses fréquentes. Vous pouvez relancer ce guide à tout moment."},
    "platform-admin":{title:"Vue propriétaire",text:"Contrôles privés pour les clients de la Web App, les abonnements et l’activité réelle du produit."}
  }
};

ONBOARDING_EXTRA.ht={
  welcome:{kicker:"BYENVINI",title:"Mèsi paske w ap itilize The Launch Era Cleaning Web App.",text:"Kont ou pare. N ap gide w nan premye etap yo pou ou konnen kote tout bagay ye san ou pa bezwen dekouvri tout poukont ou."},
  today:{title:"Jodi a",text:"Rezime jounen ou: travay, demann rezèvasyon, devis, fakti ak aksyon rapid."},
  booking:{title:"Rezèvasyon",text:"Jere demann rezèvasyon, disponiblite ak lyen piblik kliyan yo itilize."},
  leads:{title:"Pwospè",text:"Kenbe kliyan potansyèl yo isit la anvan yo vin kliyan aktif oswa travay pwograme."},
  clients:{title:"Kliyan",text:"Kenbe kontak, adrès sèvis ak enfòmasyon ou bezwen pou pwochen travay yo."},
  calendar:{title:"Kalandriye + travay",text:"Gade travay k ap vini ak lè ki lib pou òganize orè a san doub rezèvasyon."},
  quotes:{title:"Devis",text:"Revize demann, kreye devis, voye yo bay kliyan epi swiv si yo aksepte oswa refize."},
  invoices:{title:"Fakti",text:"Kreye epi voye fakti, epi anrejistre metòd peman biznis ou aksepte."},
  followups:{title:"Swivi",text:"Gade ki pwospè, devis, fakti, netwayaj fini ak ansyen kliyan ki bezwen pwochen kontak la."},
  route:{title:"Wout jodi a",text:"Gade arè jounen an nan lòd pou konnen ki kote pou ale apre sa."},
  mileage:{title:"Kilometraj",text:"Anrejistre distans biznis ki lye ak travay yo pou kenbe vwayaj yo òganize."},
  time:{title:"Suivi tan",text:"Kòmanse epi fini kronomèt pou swiv tan ki pase sou chak travay."},
  reports:{title:"Rapò",text:"Gade aktivite, total ak pèfòmans operasyon biznis la."},
  services:{title:"Sèvis + opsyon",text:"Kreye sèvis, pri ak opsyon yo itilize nan rezèvasyon, devis ak fakti."},
  supplies:{title:"Founiti",text:"Òganize founiti netwayaj pou konnen sa ki bezwen ranplase."},
  team:{title:"Ekip",text:"Ajoute anplwaye, asiyen travay, pataje aksè envite epi voye mesaj san ekspoze kontwòl pwopriyetè."},
  settings:{title:"Paramèt",text:"Modifye enfòmasyon konpayi, règ rezèvasyon, peman, imèl kliyan ak lyen."},
  admin:{title:"Admin pwopriyetè",text:"Kontwòl sansib yo isit la: aksè, pèmisyon, entegrasyon ak paramèt kont."},
  help:{title:"Èd ak FAQ",text:"Jwenn èd pou konfigirasyon, enstriksyon aksè ak repons komen. Ou ka rekòmanse gid sa a nenpòt lè."},
  "platform-admin":{title:"Vizyalizasyon pwopriyetè",text:"Kontwòl prive pou kliyan Web App la, abònman ak aktivite reyèl pwodwi a."}
};
window.TLE_ONBOARDING_COPY=ONBOARDING_COPY;
window.TLE_ONBOARDING_EXTRA=ONBOARDING_EXTRA;
})();

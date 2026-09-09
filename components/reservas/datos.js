// Contenido de la landing de Operon Reservas.
// Se mantiene separado de los componentes para poder revisar los textos y los
// números de un vistazo — son lo que se defiende frente al cliente.

/** URL pública del recorrido comercial (fixtures, no toca la base real). */
export const DEMO_URL = "https://operon-reservas.netlify.app/";

/**
 * Comisión típica de Booking.com para alojamientos en Argentina. El rango real
 * publicado va de 10% a 20% según país, tipo de alojamiento y acuerdos de
 * visibilidad; 15% es la media y lo que reportan los propietarios de cabañas.
 * Se usa en la calculadora y se aclara al pie.
 */
export const COMISION_OTA = 0.15;

/** Funciones del panel. Cada una apunta a una captura real del producto. */
export const funciones = [
  {
    id: "calendario",
    etiqueta: "Calendario",
    titulo: "Todas tus unidades, noche por noche",
    texto:
      "Una fila por cabaña y una columna por día. Las reservas se pintan solas y los bloqueos los marcás vos. Arriba, lo único que importa del mes: ocupación, cuánto falta cobrar, quién llega y quién se va.",
    puntos: ["Bloqueos manuales", "Ocupación del mes", "Llegadas y salidas"],
    imagen: "/reservas/panel-calendario.webp",
    alt: "Calendario de reservas de Operon Reservas con tres unidades y las estadías pintadas sobre los días del mes",
  },
  {
    id: "reservas",
    etiqueta: "Reservas",
    titulo: "De consulta a cobrada, sin cambiar de app",
    texto:
      "Filtrás por estado, buscás por código o por huésped, y en cada fila ves el total, la seña y el saldo. También de dónde vino: tu web, un WhatsApp o una OTA.",
    puntos: ["Estados con transiciones controladas", "Saldo a la vista", "Origen de cada reserva"],
    imagen: "/reservas/panel-reservas.webp",
    alt: "Listado de reservas con filtros por estado, totales, seña y saldo de cada estadía",
  },
  {
    id: "comprobante",
    etiqueta: "Comprobante",
    titulo: "El PDF que el huésped pide siempre",
    texto:
      "Cada reserva tiene su comprobante imprimible: huésped, estadía, pagos registrados y saldo. Se lo mandás por WhatsApp o por mail en dos clics, sin armar nada a mano.",
    puntos: ["Imprimir o guardar en PDF", "Pagos y saldo", "WhatsApp directo al huésped"],
    imagen: "/reservas/panel-reserva-detalle.webp",
    alt: "Comprobante de reserva con los datos del huésped, la estadía, los pagos registrados y el saldo a abonar",
  },
  {
    id: "unidades",
    etiqueta: "Unidades",
    titulo: "Tus cabañas, cargadas una sola vez",
    texto:
      "Capacidad, foto, servicios y, en cada tarjeta, la próxima llegada y la ocupación de los últimos 30 días. Cada unidad publica además su calendario en formato iCal.",
    puntos: ["Foto y servicios", "Ocupación 30 días", "Feed iCal por unidad"],
    imagen: "/reservas/panel-unidades.webp",
    alt: "Tarjetas de las tres unidades del alojamiento con foto, capacidad, próxima llegada y ocupación",
  },
  {
    id: "tarifas",
    etiqueta: "Tarifas",
    titulo: "El precio lo ponés vos, y lo probás antes",
    texto:
      "Precio base por unidad más reglas que lo modifican por fecha, por día de la semana o por largo de estadía. El simulador te dice cuánto sale una estadía concreta antes de publicarla.",
    puntos: ["Reglas por temporada", "Mínimo de noches", "Simulador de estadía"],
    imagen: "/reservas/panel-tarifas.webp",
    alt: "Pantalla de tarifas con el precio base por noche de cada unidad y el simulador de estadía",
  },
  {
    id: "cobros",
    etiqueta: "Cobros y avisos",
    titulo: "La seña se cobra sola. Los mails también salen solos",
    texto:
      "Conectás tu cuenta de Mercado Pago y definís qué porcentaje pedís de anticipo. Cada cambio de estado dispara un mail: al huésped y a vos. Nada depende de que te acuerdes.",
    puntos: ["Mercado Pago por OAuth", "% de seña configurable", "Mails automáticos con reintentos"],
    imagen: "/reservas/panel-configuracion.webp",
    alt: "Configuración del alojamiento con datos de contacto, horarios, moneda y porcentaje de seña",
  },
];

/** Los tres pasos que recorre el huésped desde la web del propietario. */
export const pasosHuesped = [
  {
    n: "01",
    titulo: "Elige fechas en tu web",
    texto:
      "El buscador vive en tu propio sitio, con tu marca. El huésped nunca sale a un marketplace donde lo esperan otras veinte cabañas.",
    imagen: "/reservas/web-1-buscar.webp",
    ancho: 1553,
    alto: 854,
    alt: "Buscador de disponibilidad con fechas de ingreso, salida y cantidad de personas",
  },
  {
    n: "02",
    titulo: "Ve sólo lo que está libre de verdad",
    texto:
      "La disponibilidad sale de la misma base que tu panel, en el momento. No hay sincronización nocturna que te deje vendiendo una noche ya tomada.",
    imagen: "/reservas/web-2-resultados.webp",
    ancho: 1553,
    alto: 1510,
    alt: "Unidades disponibles para las fechas elegidas, con el total de la estadía y la seña de cada una",
  },
  {
    n: "03",
    titulo: "Deja sus datos y paga la seña",
    texto:
      "La reserva entra a tu panel con nombre, mail y teléfono. El huésped es tuyo: podés volver a escribirle el año que viene sin pedirle permiso a nadie.",
    imagen: "/reservas/web-3-datos.webp",
    ancho: 1553,
    alto: 1414,
    alt: "Formulario donde el huésped completa sus datos para confirmar la reserva",
  },
];

/**
 * Comparación con las dos alternativas reales de un propietario chico: la OTA
 * y la planilla. Cada fila es un hecho verificable, no un adjetivo.
 */
export const comparacion = {
  columnas: [
    { id: "operon", titulo: "Operon Reservas", sub: "Tu web + tu panel", destacada: true },
    { id: "ota", titulo: "Booking / Airbnb", sub: "Marketplace" },
    { id: "planilla", titulo: "Planilla + WhatsApp", sub: "Como venías" },
  ],
  filas: [
    {
      criterio: "Comisión por reserva",
      operon: { v: "0%", tono: "bien" },
      ota: { v: "15% típico", tono: "mal" },
      planilla: { v: "0%", tono: "bien" },
    },
    {
      criterio: "El mail y el teléfono del huésped son tuyos",
      operon: { v: "Sí", tono: "bien" },
      ota: { v: "No", tono: "mal" },
      planilla: { v: "Sí", tono: "bien" },
    },
    {
      criterio: "Dos personas reservan la misma noche a la vez",
      operon: { v: "El sistema rechaza una", tono: "bien" },
      ota: { v: "Sólo dentro de su canal", tono: "medio" },
      planilla: { v: "Te enterás al otro día", tono: "mal" },
    },
    {
      criterio: "Cobro de la seña",
      operon: { v: "Mercado Pago, a tu cuenta", tono: "bien" },
      ota: { v: "Pasa por ellos", tono: "medio" },
      planilla: { v: "Alias por WhatsApp", tono: "mal" },
    },
    {
      criterio: "Calendario de todas tus unidades juntas",
      operon: { v: "Sí", tono: "bien" },
      ota: { v: "Sólo lo que publicaste ahí", tono: "medio" },
      planilla: { v: "Una pestaña por cabaña", tono: "mal" },
    },
    {
      criterio: "Confirmación al huésped",
      operon: { v: "Automática", tono: "bien" },
      ota: { v: "Automática", tono: "bien" },
      planilla: { v: "Vos, a las 23:40", tono: "mal" },
    },
    {
      criterio: "Quién decide tus precios",
      operon: { v: "Vos", tono: "bien" },
      ota: { v: "Vos, con presión de paridad", tono: "medio" },
      planilla: { v: "Vos", tono: "bien" },
    },
    {
      criterio: "Comprobante en PDF",
      operon: { v: "Incluido", tono: "bien" },
      ota: { v: "El de ellos", tono: "medio" },
      planilla: { v: "A mano", tono: "mal" },
    },
  ],
};

export const faqs = [
  {
    q: "¿Reemplaza a mi página web?",
    a: "No. Va abajo. Tu web sigue siendo tuya, con tus fotos y tu marca; Operon Reservas es el motor que le pone el buscador de disponibilidad, calcula el precio, toma la reserva y cobra la seña. Si todavía no tenés web, también la hacemos — pero son dos cosas distintas y se pueden contratar por separado.",
  },
  {
    q: "Ya publico en Booking y en Airbnb. ¿Tengo que dejarlos?",
    a: "No, y no te lo recomendaríamos de entrada. Lo sano es que las OTA te traigan al huésped que no te conoce y que el que ya fue vuelva por tu web, sin comisión. Hoy cada unidad publica su calendario en formato iCal para que Airbnb y Booking lean tus fechas ocupadas. La importación en sentido inverso (leer los calendarios de ellos) está en desarrollo.",
  },
  {
    q: "¿Puede pasar que venda dos veces la misma noche?",
    a: "No. Dos estadías que compartan aunque sea una noche en la misma cabaña no se pueden guardar: la prohibición está en la base de datos, no en la pantalla, así que no hay forma de saltearla — ni con dos personas apretando «Reservar» en el mismo segundo. Los bloqueos por mantenimiento se cuentan igual que una reserva, así que tampoco podés bloquear una noche que ya vendiste.",
  },
  {
    q: "¿Cómo cobro la seña?",
    a: "Conectás tu cuenta de Mercado Pago una sola vez y elegís qué porcentaje pedís de anticipo. Cuando el huésped confirma, se le arma el pago; la plata va a tu cuenta, no a la nuestra. Si preferís seguir cobrando por transferencia, también podés: la reserva queda esperando seña y la marcás vos.",
  },
  {
    q: "¿Mis datos están mezclados con los de otros alojamientos?",
    a: "No. Cada alojamiento es una organización aislada por seguridad a nivel de fila en Postgres: un usuario sólo ve las filas de la organización donde es miembro. La web pública no accede a ninguna tabla directamente, sólo a tres funciones que devuelven lo justo para mostrar disponibilidad y tomar la reserva.",
  },
  {
    q: "Tengo una sola cabaña. ¿Me sirve igual?",
    a: "Sí. El sistema no cobra por unidad ni te obliga a cargar diez. Con una sola ya ganás el calendario, la reserva directa, el cobro de la seña y los avisos automáticos. Escala a varias unidades y a varias propiedades cuando lo necesites.",
  },
  {
    q: "¿Cuánto sale?",
    a: "Depende de si necesitás sólo el motor o también la web, y de cuántas unidades administrás. Lo hablamos en una llamada de veinte minutos y te pasamos un número cerrado, sin comisión por reserva. Antes de eso, entrá a la demo y fijate si te sirve.",
  },
];

/** Lo que el sistema viene a reemplazar. Alimenta la marquesina del hero. */
export const reemplaza = [
  "La planilla de Google",
  "El cuaderno del mostrador",
  "«Che, ¿el 14 está libre?»",
  "La doble reserva del finde largo",
  "Confirmar a mano a las 23:40",
  "El 15% de comisión",
  "Pedir la seña por WhatsApp",
  "Buscar el alias en el chat",
  "Calcular el total con la calculadora del celu",
];

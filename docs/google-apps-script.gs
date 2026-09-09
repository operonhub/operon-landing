/**
 * Operon — Recepción de leads de /contanos-tu-proceso en Google Sheets.
 *
 * Este script se pega en el editor de Apps Script de una Google Sheet y se
 * publica como Web App (Implementar → Nueva implementación → Aplicación web).
 * El endpoint del sitio (POST /api/leads) le reenvía cada contacto validado.
 *
 * Guía completa: docs/configuracion-formulario-google-sheets.md
 *
 * Configurá dos Script Properties (Configuración del proyecto → Propiedades):
 *   - SHARED_SECRET : el mismo valor que GOOGLE_SHEETS_WEBHOOK_SECRET en Vercel.
 *   - NOTIFY_EMAIL  : correo donde querés recibir el aviso de cada contacto.
 *
 * Encabezados esperados en la fila 1 de la hoja (en este orden):
 *   Fecha | Nombre y apellido | Empresa | Proceso a simplificar |
 *   Funcionamiento actual y problema | Teléfono | Correo electrónico |
 *   Consentimiento | utm_source | utm_medium | utm_campaign | utm_content |
 *   fbclid | URL de origen | Estado
 */

// Nombre de la pestaña donde se guardan los leads.
var SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Sin cuerpo.' });
    }

    var data = JSON.parse(e.postData.contents);

    // 1) Validar el secreto compartido.
    var expected = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!expected || String(data.secret || '') !== String(expected)) {
      return json({ ok: false, error: 'No autorizado.' });
    }

    // 2) Verificar consentimiento y al menos un medio de contacto.
    var telefono = str(data.telefono);
    var email = str(data.email);
    if (String(data.consentimiento) !== 'Sí') {
      return json({ ok: false, error: 'Falta consentimiento.' });
    }
    if (!telefono && !email) {
      return json({ ok: false, error: 'Falta teléfono o correo.' });
    }

    // 3) Preparar la fila. La Fecha se genera acá automáticamente; el Estado
    //    inicial siempre es "NUEVO".
    var tz = Session.getScriptTimeZone() || 'America/Argentina/Buenos_Aires';
    var fecha = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');

    var row = [
      fecha,
      str(data.nombre),
      str(data.empresa),
      str(data.proceso),
      str(data.situacion),
      telefono,
      email,
      str(data.consentimiento),
      str(data.utm_source),
      str(data.utm_medium),
      str(data.utm_campaign),
      str(data.utm_content),
      str(data.fbclid),
      str(data.origen),
      'NUEVO'
    ];

    // 4) Agregar la fila a la hoja (protegida con LockService para evitar
    //    condiciones de carrera entre envíos simultáneos).
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = getSheet();
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    // 5) Notificar por correo (no interrumpe la respuesta si falla el envío).
    try {
      notify(data, fecha);
    } catch (mailErr) {
      // Silencioso: el lead ya quedó guardado, que es lo importante.
    }

    // 6) Responder JSON.
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: 'Error al procesar.' });
  }
}

// Respuesta rápida para verificar en el navegador que el deploy responde.
function doGet() {
  return json({ ok: true, service: 'operon-leads' });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Fecha', 'Nombre y apellido', 'Empresa', 'Proceso a simplificar',
      'Funcionamiento actual y problema', 'Teléfono', 'Correo electrónico',
      'Consentimiento', 'utm_source', 'utm_medium', 'utm_campaign',
      'utm_content', 'fbclid', 'URL de origen', 'Estado'
    ]);
  }
  return sheet;
}

function notify(data, fecha) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;

  var nombre = str(data.nombre);
  var empresa = str(data.empresa);
  var subject = '[Operon] Nuevo caso · ' + (empresa || nombre || 'Contacto');

  var lines = [
    'Nuevo contacto desde operonhub.com/contanos-tu-proceso',
    '',
    'Fecha: ' + fecha,
    'Nombre y apellido: ' + nombre,
    'Empresa: ' + empresa,
    'Proceso a simplificar: ' + str(data.proceso),
    '',
    'Cómo lo hacen hoy y qué problema tienen:',
    str(data.situacion),
    '',
    'Teléfono: ' + (str(data.telefono) || '—'),
    'Correo: ' + (str(data.email) || '—'),
    'Consentimiento: ' + str(data.consentimiento),
    '',
    'Campaña:',
    '  utm_source: ' + str(data.utm_source),
    '  utm_medium: ' + str(data.utm_medium),
    '  utm_campaign: ' + str(data.utm_campaign),
    '  utm_content: ' + str(data.utm_content),
    '  fbclid: ' + str(data.fbclid),
    '  URL de origen: ' + str(data.origen),
    '',
    'Estado inicial: NUEVO'
  ];

  MailApp.sendEmail(to, subject, lines.join('\n'));
}

function str(v) {
  return (v === null || v === undefined) ? '' : String(v).trim();
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

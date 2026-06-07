/***** Fuel Tracker Google Drive JSON backend v8 *****
 * 1) Отвори https://script.google.com и създай нов проект.
 * 2) Постави този код в Code.gs.
 * 3) Deploy > New deployment > Web app.
 * 4) Execute as: Me. Who has access: Anyone with the link.
 * 5) Copy Web App URL, който завършва на /exec, и го постави в HTML приложението.
 *
 * Файлът fuel_tracker_data.json ще бъде създаден в основната папка на твоя Google Drive.
 */

const FUEL_TRACKER_FILE_NAME = 'fuel_tracker_data.json';

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'load';
    if (action === 'ping') {
      return respond_({ ok: true, message: 'Fuel Tracker backend is running', time: new Date().toISOString() }, e);
    }
    return respond_({ ok: true, action: 'load', data: loadData_() }, e);
  } catch (err) {
    return respond_({ ok: false, error: errorMessage_(err) }, e);
  }
}

function doPost(e) {
  try {
    const raw = getRequestBody_(e);
    const payload = JSON.parse(raw || '{}');
    const action = payload.action || 'load';

    if (action === 'save') {
      const data = payload.data || { app: 'fuel-tracker-manual', version: 7, entries: [] };
      saveData_(data);
      return respond_({ ok: true, action: 'save', savedAt: new Date().toISOString() }, e);
    }

    if (action === 'load') {
      return respond_({ ok: true, action: 'load', data: loadData_() }, e);
    }

    return respond_({ ok: false, error: 'Unknown action: ' + action }, e);
  } catch (err) {
    return respond_({ ok: false, error: errorMessage_(err) }, e);
  }
}

function getRequestBody_(e) {
  if (e && e.postData && e.postData.contents) return e.postData.contents;
  if (e && e.parameter && e.parameter.payload) return e.parameter.payload;
  return '{}';
}

function loadData_() {
  const file = getOrCreateFile_();
  const text = file.getBlob().getDataAsString('UTF-8') || '{}';
  try {
    const data = JSON.parse(text);
    if (!data.entries) data.entries = [];
    return data;
  } catch (err) {
    return { app: 'fuel-tracker-manual', version: 7, entries: [], parseError: errorMessage_(err) };
  }
}

function saveData_(data) {
  data.savedAt = new Date().toISOString();
  data.version = data.version || 7;
  const file = getOrCreateFile_();
  file.setContent(JSON.stringify(data, null, 2));
}

function getOrCreateFile_() {
  const files = DriveApp.getFilesByName(FUEL_TRACKER_FILE_NAME);
  if (files.hasNext()) return files.next();
  return DriveApp.createFile(FUEL_TRACKER_FILE_NAME, JSON.stringify({
    app: 'fuel-tracker-manual',
    version: 7,
    createdAt: new Date().toISOString(),
    entries: []
  }, null, 2), MimeType.PLAIN_TEXT);
}

function respond_(obj, e) {
  const callback = e && e.parameter && e.parameter.callback;
  const json = JSON.stringify(obj);

  if (callback) {
    const safeName = String(callback).replace(/[^a-zA-Z0-9_$\.]/g, '');
    return ContentService
      .createTextOutput(safeName + '(' + json.replace(/</g, '\\u003c') + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function errorMessage_(err) {
  return String(err && err.message ? err.message : err);
}

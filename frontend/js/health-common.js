



const $ = id => document.getElementById(id);
const state = {
  tab: PAGE.entities[0].key,
  cache: {}, report: [], editing: null,
  busy: false, request: 0, modalRequest: 0, formLoading: false, serverFormError: null
};
const FIELD_LABELS = {
  vaccine_id: 'Vaccine ID', batch_id: 'Batch ID', resident_id: 'Resident ID',
  household_id: 'Household ID', zone_id: 'Zone ID', equipment_id: 'Equipment ID',
  staff_id: 'Staff ID', assigned_to: 'Assigned Staff ID',
  storage_temp_min: 'Minimum Storage Temperature (°C)',
  storage_temp_max: 'Maximum Storage Temperature (°C)',
  min_temp: 'Minimum Safe Temperature (°C)', max_temp: 'Maximum Safe Temperature (°C)',
  temperature_celsius: 'Temperature (°C)',
  is_out_of_range: 'Outside Safe Temperature Range?',
  days_left: 'Days Until Expiry',
  batch_status: 'Batch Availability',
  match_status: 'Appointment-to-Vaccination Match',
  date_administered: 'Date Vaccinated',
  dose_number: 'Dose Number',
  quantity_received: 'Doses Received', quantity_remaining: 'Doses Remaining'
};
const label = value => FIELD_LABELS[value] || String(value).replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
const node = (tag, value, className) => {
  const element = document.createElement(tag);
  if (value !== undefined) element.textContent = String(value);
  if (className) element.className = className;
  return element;
};
const entity = () => PAGE.entities.find(item => item.key === state.tab);
const isReport = () => state.tab === 'report';
const isExpiry = () => state.tab === 'expiry';

const TEXT_LIMITS = {
  zones: { zone_name: 50, description: 255 },
  staff: { first_name: 50, last_name: 50, staff_role: 20, license_number: 50, contact_number: 20 },
  users: { username: 50, password: 72, role: 20 },
  residents: { first_name: 50, middle_name: 50, last_name: 50, address: 255, contact_number: 20 },
  vaccines: { vaccine_name: 100, description: 255 },
  appointments: { status: 20, notes: 255 },
  consultations: { blood_pressure: 10, chief_complaint: 255, diagnosis: 255, notes: 500 },
  records: { next_dose_status: 10, remarks: 255 },
  batches: { batch_number: 50, status: 20 },
  milestones: { notes: 255 },
  movements: { movement_type: 20, remarks: 255 },
  equipment: { equipment_name: 100, equipment_type: 50, location: 100, status: 25 },
  alerts: { alert_type: 25, severity: 10, message: 255, status: 15 },
  households: { household_name: 100, address: 255 },
  adverse: { severity: 10, description: 500, outcome: 255 }
};
const todayLocal = () => {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
};

function formatCell(key, value) {
  if (value === null || value === undefined || value === '') return '—';
  if (key === 'days_left' && Number.isFinite(Number(value))) {
    const n = Number(value);
    return n < 0 ? `Expired ${Math.abs(n)} day(s) ago` : n === 0 ? 'Expires today' : `${n} day(s) remaining`;
  }
  if (['temperature_celsius','storage_temp_min','storage_temp_max','min_temp','max_temp'].includes(key)) {
    return `${value} °C`;
  }
  if (key === 'is_out_of_range') return (value === true || Number(value) === 1) ? 'Outside safe range' : 'Within safe range';
  if (key === 'is_active') return (value === true || Number(value) === 1) ? 'Active' : 'Inactive';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if ((value === 0 || value === 1) && /^(is_active|is_out_of_range)$/.test(key)) return value === 1 ? 'Yes' : 'No';
  if (/date|_at$/.test(key) && /^\d{4}-\d\d-\d\d/.test(String(value))) {
    const text = String(value);

    return text.slice(0, 10) + (text.length > 10 ? ' ' + text.slice(11, 16) : '');
  }
  return String(value);
}
function notice(message, type = 'success') {
  $('notice').textContent = message;
  $('notice').className = 'notice' + (type === 'error' ? ' error' : '');
  $('notice').hidden = false;
}
function clearNotice() { $('notice').hidden = true; }
function toast(message) {
  const box = $('toast');
  box.textContent = message;
  box.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { box.hidden = true; }, 3500);
}
function showFormError(message, fieldNames = []) {
  const box = $('formError');
  box.textContent = message || '';
  box.hidden = !message;
  $('formFields').querySelectorAll('[aria-invalid="true"]').forEach(input => input.removeAttribute('aria-invalid'));
  for (const key of fieldNames) {
    const input = $('form').elements.namedItem(key);
    if (input && typeof input.setAttribute === 'function') input.setAttribute('aria-invalid', 'true');
  }
}

async function api(url, options = {}) {
  if (location.protocol !== 'http:' && location.protocol !== 'https:') {
    throw new Error('Open this page from the running Express server (not directly from Downloads or Messenger).');
  }
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  try {
    const token = sessionStorage.getItem('bhs_auth_token');
    if (token) headers.Authorization = 'Bearer ' + token;
  } catch (_) {  }

  let response;
  try { response = await fetch(url, { ...options, headers }); }
  catch (_) {
    throw new Error('Cannot reach the server. Open the page through the same Express host and check Node.js/MySQL connection.');
  }
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('json')) {
    throw new Error(response.status === 404
      ? 'This feature is not available on the running backend yet. Check the API route.'
      : 'The server returned an unexpected response. Please check the backend.');
  }
  let data;
  try { data = await response.json(); }
  catch (_) { throw new Error('Could not read the server response. Please refresh and try again.'); }

  if (!response.ok) {
    const serverMessage = typeof data?.message === 'string' ? data.message.trim() : '';
    const fallbacks = {
      400: 'Please check the information you entered.',
      401: 'Please log in again to continue.',
      403: 'Your account is not allowed to perform this action.',
      404: 'The requested record or feature could not be found.',
      409: 'This record conflicts with an existing record.',
      500: 'The server had a problem saving this request. Please contact your team integrator.'
    };
    let message = serverMessage || fallbacks[response.status] || 'The request could not be completed.';
    if (response.status >= 500 && /^(Database error|Internal server error)$/i.test(message)) message = fallbacks[500];
    if (response.status === 401) message = 'Please log in again to continue.';
    if (response.status === 403) message = 'Your account is not allowed to perform this action.';

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (data === null) throw new Error('The server returned no information.');
  return data;
}

function renderNav() {
  const nav = $('sideNav');
  const items = [
    ...PAGE.entities.map(item => ({ id: item.key, title: item.title, icon: '▦' })),
    { id: 'report', title: 'JOIN Report', icon: '≋' }
  ];
  if (PAGE.expiry) items.push({ id: 'expiry', title: 'Batch Expiry', icon: '◷' });
  for (const item of items) {
    const button = node('button', undefined, 'nav-item');
    button.type = 'button';
    button.dataset.tab = item.id;
    button.append(node('span', item.icon, 'nav-ico'), node('span', item.title));
    button.addEventListener('click', () => showTab(item.id));
    nav.append(button);
  }
}
function showTab(id) {
  if (!$('modal').hidden) closeForm();

  state.request++;
  state.tab = id;
  state.report = [];
  clearNotice();
  $('search').value = '';
  $('toolbar').hidden = isExpiry();
  $('primaryAction').hidden = isReport() || isExpiry();
  for (const button of document.querySelectorAll('[data-tab]')) {
    const active = button.dataset.tab === id;
    button.classList.toggle('active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  }
  const selected = entity();
  const heading = selected ? selected.title : isReport() ? PAGE.report.title : 'Vaccine Batch Expiry';
  $('crumb').textContent = selected?.title || (isReport() ? 'JOIN Report' : 'Batch Expiry');
  $('pageTitle').textContent = heading;
  $('pageSubtitle').textContent = selected
    ? `Browse, add, edit and manage ${selected.title.toLowerCase()} records.`
    : isReport() ? `${PAGE.report.join} • Related records from the database` : 'Review upcoming and already-expired vaccine batches.';
  $('sectionTitle').textContent = selected ? `${selected.title} Directory` : isReport() ? 'Joined Records' : 'Expiry Monitoring';
  $('sectionDesc').textContent = selected ? 'View and manage records below.'    : isReport() ? 'See how the related records connect. Empty values mean a matching record does not exist.'
       : 'Check expiry dates and remaining doses. Update statuses and alerts when needed.';
  $('primaryAction').textContent = `+ Add ${selected?.title.replace(/s$/, '') || 'Record'}`;
  $('apiText').textContent = selected ? 'Saved health center records' : isReport() ? 'Related database information' : 'Review current batch expiry dates';
  $('special').hidden = !isExpiry();
  renderStats();
  if (isExpiry()) { expiryControls(); loadExpiry(); }
  else if (isReport()) loadReport();
  else loadEntity(selected);
}
async function updateStats() {
  for (const item of PAGE.entities) {
    try {
      const result = await api(item.api);
      state.cache[item.key] = Array.isArray(result) ? result : null;
    } catch (_) {
      state.cache[item.key] = null;
    }
  }
  renderStats();
}
function renderStats() {
  const wrap = $('stats');
  wrap.replaceChildren();
  for (const item of PAGE.entities) {
    const card = node('div', undefined, 'stat');
    const left = node('div');
    left.append(node('div', item.title, 'stat-label'), node('div', Array.isArray(state.cache[item.key]) ? state.cache[item.key].length : '—', 'stat-value'));
    card.append(left, node('span', '▤', 'stat-icon'));
    wrap.append(card);
  }
}
function rowsAndCols() {
  if (isReport()) return { rows: state.report, cols: state.report.length ? Object.keys(state.report[0]) : [], id: null };
  if (isExpiry()) return { rows: state.report, cols: state.report.length ? Object.keys(state.report[0]) : ['batch_number', 'vaccine_name', 'expiry_date', 'days_left', 'status'], id: null };
  const item = entity();
  return { rows: state.cache[item.key] || [], cols: item.columns, id: item.id };
}
function renderTable() {
  const { rows, cols } = rowsAndCols();
  const item = entity();
  const term = $('search').value.trim().toLowerCase();
  const filtered = term ? rows.filter(row => Object.values(row).some(v => String(v ?? '').toLowerCase().includes(term))) : rows;
  const head = $('thead'); const body = $('tbody');
  head.replaceChildren(); body.replaceChildren();
  const heading = node('tr');
  for (const col of cols) heading.append(node('th', label(col)));
  if (item) heading.append(node('th', 'Actions'));
  head.append(heading);
  if (!filtered.length) {
    const empty = node('tr');
    const message = node('td', rows.length ? 'No matching records.' : 'No records available.', 'empty');
    message.colSpan = cols.length + (item ? 1 : 0);
    empty.append(message); body.append(empty);
  }
  for (const row of filtered) {
    const tr = node('tr');
    for (const col of cols) {
      const td = node('td', formatCell(col, row[col]));
      td.dataset.label = label(col);
      tr.append(td);
    }
    if (item) {
      const td = node('td', undefined, 'action-cell');
      td.dataset.label = 'Actions';
      const buttons = node('div', undefined, 'actions');
      const edit = node('button', 'Edit', 'btn small');
      const remove = node('button', 'Delete', 'btn small danger');
      edit.type = remove.type = 'button';
      edit.addEventListener('click', () => openForm(row));
      remove.addEventListener('click', () => deleteRecord(row));
      buttons.append(edit, remove); td.append(buttons); tr.append(td);
    }
    body.append(tr);
  }
  $('counter').textContent = `Showing ${filtered.length} of ${rows.length} record(s)`;
}
function setLoading(text) {
  $('tbody').replaceChildren();
  const tr = node('tr'); const td = node('td', text, 'empty');
  td.colSpan = Math.max(1, (entity()?.columns?.length || 5) + (entity() ? 1 : 0));
  tr.append(td); $('tbody').append(tr);
  $('counter').textContent = text;
}
async function loadEntity(item) {
  const request = ++state.request;
  setLoading('Loading records...');
  try {
    const data = await api(item.api);
    if (!Array.isArray(data)) throw new Error('The server returned an unexpected record format.');
    if (request !== state.request) return;
    state.cache[item.key] = data;
    renderStats(); renderTable();
  } catch (error) {
    if (request !== state.request) return;
    state.cache[item.key] = null;
    renderStats(); renderTable(); notice(`${item.title}: ${error.message}`, 'error');
  }
}
async function loadReport() {
  const request = ++state.request;
  setLoading('Loading report...');
  try {
    const data = await api(PAGE.report.api);
    if (!Array.isArray(data)) throw new Error('The server returned an unexpected report format.');
    if (request !== state.request) return;
    state.report = data; renderTable();
  } catch (error) {
    if (request !== state.request) return;
    state.report = []; renderTable(); notice(`JOIN Report: ${error.message}`, 'error');
  }
}

function expiryControls() {
  const wrap = $('special'); wrap.replaceChildren();
  const filter = node('div', undefined, 'inline-form');
  const labelDays = node('label', 'Warning window (days)');
  const days = node('input'); days.id = 'days'; days.type = 'number'; days.min = '1'; days.step = '1'; days.value = '30';
  labelDays.append(days);
  const check = node('button', 'Check upcoming', 'btn');
  check.type = 'button'; check.addEventListener('click', loadExpiry);
  filter.append(labelDays, check); wrap.append(filter);
  const control = node('div', undefined, 'inline-form');
  const run = node('button', 'Update Expiry Status and Alerts', 'btn primary');
  run.type = 'button'; run.addEventListener('click', runExpiry);
  control.append(run); wrap.append(control);
}
async function loadExpiry() {
  const days = Number($('days')?.value);
  if (!Number.isInteger(days) || days < 1) { notice('Enter a valid number of warning days (1 or greater).', 'error'); return; }
  const request = ++state.request;
  clearNotice(); setLoading('Loading expiring batches...');
  try {
    const data = await api(`/api/expiry/expiring?days=${days}`);
    if (!Array.isArray(data)) throw new Error('The server returned an unexpected expiry report.');
    if (request !== state.request) return;
    state.report = data; renderTable();
  } catch (error) {
    if (request !== state.request) return;
    state.report = []; renderTable(); notice(error.message, 'error');
  }
}
async function runExpiry() {
  if (state.busy) return;
  const days = Number($('days').value);
  if (!Number.isInteger(days) || days < 1) { notice('Enter a valid warning window first.', 'error'); return; }
  if (!confirm('Update expired batch statuses and create any missing expiry alerts?')) return;
  state.busy = true;
  const runButton = [...$('special').querySelectorAll('button')].find(b => b.textContent.includes('Update Expiry'));
  if (runButton) runButton.disabled = true;
  try {
    const result = await api('/api/expiry/check', { method: 'POST', body: JSON.stringify({ days }) });
    await loadExpiry();
    notice(`Expiry statuses updated: ${result.batches_marked_expired ?? 0} batch(es). New upcoming-expiry alerts: ${result.near_expiry_alerts_created ?? 0}. New expired-batch alerts: ${result.expired_alerts_created ?? 0}.`);
    toast('Expiry check completed');
  } catch (error) {
    notice(`Expiry check: ${error.message}`, 'error');
  } finally {
    state.busy = false;
    if (runButton) runButton.disabled = false;
  }
}

function presentFormValue(value, field) {
  if (value === null || value === undefined) return '';
  if (field.type === 'datetime') return String(value).slice(0, 16).replace(' ', 'T');
  if (field.type === 'date') return String(value).slice(0, 10);
  if (field.type === 'boolean') return (value === true || value === 1 || value === '1') ? '1' : '0';
  return String(value);
}
async function addField(root, field, row) {
  const group = node('div', undefined, 'field');
  const title = node('label', field.label);
  title.htmlFor = 'fld_' + field.key;
  if (field.required || (field.requiredOnCreate && !row)) title.append(node('span', ' *', 'required'));
  let input;
  if (['lookup', 'select', 'boolean'].includes(field.type)) {
    input = node('select');
    const empty = node('option', 'Select ' + field.label + '...'); empty.value = '';
    input.append(empty);
    if (field.type === 'boolean') {
      for (const [text, value] of [['Yes', '1'], ['No', '0']]) {
        const opt = node('option', text); opt.value = value; input.append(opt);
      }
    } else if (field.type === 'select') {
      for (const value of field.options) { const opt = node('option', value); opt.value = value; input.append(opt); }
    } else {
      const [url, key, ...textKeys] = field.lookup;
      try {
        const items = await api(url);
        if (!Array.isArray(items)) throw new Error('Unexpected lookup format');
        for (const item of items) {
          const name = textKeys.map(k => item[k] ?? '').filter(v => v !== '').join(' ').trim();
          const opt = node('option', `${item[key]} — ${name || label(key)}`);
          opt.value = String(item[key]); input.append(opt);
        }
        if (items.length === 0) group.append(node('small', 'No related records yet. Create the referenced record first.'));
      } catch (_) {

        input = node('input'); input.type = 'number'; input.step = '1'; input.min = '1';
        input.placeholder = `Enter existing ${field.key}`;
        group.append(node('small', 'Related-record list unavailable. Enter an existing ID manually.'));
      }
    }
  } else if (field.type === 'textarea') {
    input = node('textarea');
  } else {
    input = node('input');
    input.type = field.type === 'decimal' || field.type === 'number' ? 'number'
      : field.type === 'datetime' ? 'datetime-local'
        : field.type === 'date' ? 'date'
          : field.type === 'password' ? 'password' : 'text';
    if (field.type === 'decimal') input.step = 'any';
    if (field.type === 'number') input.step = '1';
  }
  input.name = field.key; input.id = 'fld_' + field.key;
  input.required = !!field.required || !!(field.requiredOnCreate && !row);
  if (field.min !== undefined) input.min = String(field.min);
  if (field.max !== undefined) input.max = String(field.max);
  const maxTextLength = field.maxLength ?? TEXT_LIMITS[entity().key]?.[field.key];
  if (maxTextLength !== undefined && ['text', 'textarea', 'password'].includes(field.type)) input.maxLength = maxTextLength;
  if (field.placeholder) input.placeholder = field.placeholder;
  if (field.key === 'birthdate' && !row) input.max = todayLocal();
  const initial = presentFormValue(row?.[field.key], field);
  input.value = initial !== '' ? initial : (field.type === 'boolean' && !row && !field.required ? '1' : '');
  group.prepend(title); group.append(input);
  if (field.help) group.append(node('small', field.help));
  root.append(group);
}
function payloadFromForm(config) {
  const values = {};
  for (const field of config.fields) {
    const input = $('form').elements.namedItem(field.key);
    if (!input) continue;
    const raw = input.value.trim();
    if (raw === '' && !field.required) {
      if (field.type === 'password' && state.editing !== null) continue;
      values[field.key] = null;
    } else if (['lookup', 'number', 'decimal'].includes(field.type)) {
      values[field.key] = raw === '' ? null : Number(raw);
    } else if (field.type === 'boolean') {
      values[field.key] = raw === '1';
    } else if (field.type === 'datetime') {
      values[field.key] = raw ? raw.replace('T', ' ') + (raw.length === 16 ? ':00' : '') : null;
    } else values[field.key] = raw;
  }
  return values;
}
function crossFieldValidation(config, values, showOptional = false) {
  const fail = (message, keys) => ({ message, keys });
  const has = key => values[key] !== null && values[key] !== undefined && values[key] !== '';
  const temperaturePairs = [
    ['vaccines', 'storage_temp_min', 'storage_temp_max'],
    ['equipment', 'min_temp', 'max_temp']
  ];
  for (const [module, min, max] of temperaturePairs) {
    if (config.key === module && has(min) && has(max) && Number(values[min]) > Number(values[max])) {
      return fail('Minimum temperature cannot be higher than maximum temperature. Please check both values.', [min, max]);
    }
  }
  if (config.key === 'vaccines' && has('total_doses_required') && values.total_doses_required < 1) {
    return fail('Total doses required must be at least 1.', ['total_doses_required']);
  }
  if (config.key === 'residents' && has('birthdate') && values.birthdate > todayLocal()) {
    return fail('Birthdate cannot be in the future.', ['birthdate']);
  }
  if (config.key === 'batches') {
    if (has('quantity_received') && has('quantity_remaining') && values.quantity_remaining > values.quantity_received) {
      return fail('Remaining quantity cannot exceed the quantity received.', ['quantity_received', 'quantity_remaining']);
    }
    if (has('received_date') && has('expiry_date') && values.expiry_date < values.received_date) {
      return fail('Expiry date cannot be earlier than received date.', ['received_date', 'expiry_date']);
    }
  }
  if (config.key === 'records' && has('date_administered') && has('next_due_date') && values.next_due_date < values.date_administered) {
    return fail('Next due date cannot be before the date administered.', ['date_administered', 'next_due_date']);
  }
  if (config.key === 'users' && has('password') && (String(values.password).length < 8 || new TextEncoder().encode(String(values.password)).length > 72)) {
    return fail('Password must be at least 8 characters and at most 72 UTF-8 bytes.', ['password']);
  }
  if (showOptional && config.key === 'users' && state.editing === null && !has('password')) {
    return fail('A password is required to create a user.', ['password']);
  }
  return null;
}
function validateLive() {
  if ($('modal').hidden || state.formLoading) return;
  const config = entity();
  const problem = crossFieldValidation(config, payloadFromForm(config));
  if (problem) showFormError(problem.message, problem.keys);
  else showFormError(state.serverFormError || '');
  $('saveBtn').disabled = state.busy || !!problem;
}
async function openForm(row = null) {
  const config = entity();
  const request = ++state.modalRequest;
  state.editing = row ? row[config.id] : null;
  state.formLoading = true;
  state.serverFormError = null;
  $('modalTitle').textContent = row ? `Edit ${config.title}` : `Add ${config.title}`;
  $('formFields').replaceChildren();
  $('modal').hidden = false;
  showFormError('');
  $('saveBtn').disabled = true;
  $('saveBtn').textContent = 'Loading form...';
  for (const field of config.fields) {
    if ($('modal').hidden || request !== state.modalRequest) return;
    await addField($('formFields'), field, row);
    if ($('modal').hidden || request !== state.modalRequest) return;
  }
  state.formLoading = false;
  $('saveBtn').textContent = row ? 'Save Changes' : 'Create Record';
  $('formFields').querySelector('input, select, textarea')?.focus();
  validateLive();
}
function closeForm() {
  if (state.busy) return;
  state.modalRequest++;
  state.formLoading = false;
  $('modal').hidden = true;
  $('formFields').replaceChildren();
  state.editing = null;
  state.serverFormError = null;
  showFormError('');
}
async function submitForm(event) {
  event.preventDefault();
  if (state.busy || state.formLoading) return;
  const config = entity();
  const payload = payloadFromForm(config);
  const problem = crossFieldValidation(config, payload, true);
  if (problem) {
    showFormError(problem.message, problem.keys);
    $('form').elements.namedItem(problem.keys[0])?.focus();
    return;
  }
  if (!$('form').reportValidity()) return;
  const editing = state.editing !== null;
  const url = config.api + (editing ? '/' + encodeURIComponent(state.editing) : '');
  state.busy = true;
  $('saveBtn').disabled = true;
  $('saveBtn').textContent = 'Saving...';
  try {
    const result = await api(url, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    state.busy = false;
    closeForm();
    await loadEntity(config);
    await updateStats();
    clearNotice();
    toast(result.message || (editing ? 'Record updated successfully.' : 'Record created successfully.'));
  } catch (error) {
    state.serverFormError = error.message;
    showFormError(error.message);
  } finally {
    state.busy = false;
    if (!$('modal').hidden) {
      $('saveBtn').textContent = editing ? 'Save Changes' : 'Create Record';
      $('saveBtn').disabled = false;
      validateLive();
    }
  }
}
async function deleteRecord(row) {
  if (state.busy) return;
  const config = entity(); const id = row[config.id];
  if (!confirm(`Delete ${config.title} record #${id}? Related records may prevent deletion.`)) return;
  state.busy = true;
  try {
    const result = await api(config.api + '/' + encodeURIComponent(id), { method: 'DELETE' });
    await loadEntity(config);
    await updateStats();
    clearNotice();
    toast(result.message || 'Record deleted successfully.');
  } catch (error) {
    notice('Could not delete record: ' + error.message, 'error');
  } finally { state.busy = false; }
}

$('search').addEventListener('input', renderTable);
$('refresh').addEventListener('click', () => isExpiry() ? loadExpiry() : isReport() ? loadReport() : loadEntity(entity()));
$('primaryAction').addEventListener('click', () => openForm());
$('form').addEventListener('submit', submitForm);
$('form').addEventListener('input', () => { state.serverFormError = null; validateLive(); });
$('form').addEventListener('change', () => { state.serverFormError = null; validateLive(); });
$('close').addEventListener('click', closeForm);
$('cancel').addEventListener('click', closeForm);
$('modal').addEventListener('click', event => { if (event.target === $('modal')) closeForm(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('modal').hidden) closeForm(); });
$('avatar').textContent = PAGE.initials;
$('eyebrow').textContent = PAGE.eyebrow;
$('memberNote').textContent = `${PAGE.person} — ${PAGE.role}`;
renderNav();
showTab(PAGE.entities[0].key);
updateStats();

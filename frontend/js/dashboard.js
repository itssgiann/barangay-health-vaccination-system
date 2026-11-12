
(async () => {
  'use strict';
  const logout = () => {
    sessionStorage.removeItem('bhs_auth_token');
    sessionStorage.removeItem('bhs_user');
    location.replace('login.html');
  };
  const token = sessionStorage.getItem('bhs_auth_token');
  let expired = false;
  try {
    const encoded = token?.split('.')[1] || '';
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - encoded.length % 4) % 4);
    const payload = JSON.parse(atob(padded));
    expired = !Number(payload.exp) || Date.now() >= Number(payload.exp) * 1000;
  } catch (_) { expired = true; }
  if (!token || expired) { logout(); return; }
  document.getElementById('logoutBtn').addEventListener('click', logout);
  let signedInUser = {};
  try {
    signedInUser = JSON.parse(sessionStorage.getItem('bhs_user') || '{}');
    document.getElementById('userName').textContent = signedInUser.username || 'Staff member';
    document.getElementById('userRole').textContent = signedInUser.role || 'Staff';
  } catch (_) {  }
  const status = document.getElementById('serverStatus');
  try {
    const response = await fetch('/api/zones', {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401 || response.status === 403) {
      status.classList.add('error');
      status.textContent = 'Session was not accepted. Please sign out and sign in again.';
      return;
    }
    if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) {
      throw new Error(`The API returned HTTP ${response.status}. Check your backend.`);
    }
    await response.json();
    status.textContent = 'System connected. You can open a section below.';


    if (Number.isSafeInteger(Number(signedInUser.staff_id)) && Number(signedInUser.staff_id) > 0) {
      try {
        const staffResponse = await fetch('/api/staff', {
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        if (staffResponse.ok && (staffResponse.headers.get('content-type') || '').includes('application/json')) {
          const staffRecords = await staffResponse.json();
          if (Array.isArray(staffRecords)) {
            const person = staffRecords.find(item => Number(item.staff_id) === Number(signedInUser.staff_id));
            const fullName = [person?.first_name, person?.last_name].filter(Boolean).join(' ').trim();
            if (fullName) document.getElementById('userName').textContent = fullName;
          }
        }
      } catch (_) {  }
    }
  } catch (_) {
    status.classList.add('error');
    status.textContent = 'Unable to connect. Check the server, then refresh this page.';
  }
})();

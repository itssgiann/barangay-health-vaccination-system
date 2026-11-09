/* Barangay Health: login (Step 2). Backend must implement POST /api/users/login. */
(() => {
  'use strict';
  const form = document.getElementById('loginForm');
  const userInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('loginError');
  const submit = document.getElementById('loginBtn');
  const submitText = document.getElementById('loginBtnText');
  const toggle = document.getElementById('togglePassword');
  let busy = false;

  const error = message => {
    errorBox.textContent = message;
    errorBox.hidden = false;
    userInput.setAttribute('aria-invalid', String(!userInput.value.trim()));
    passwordInput.setAttribute('aria-invalid', String(!passwordInput.value));
  };
  const clearError = () => {
    errorBox.hidden = true;
    errorBox.textContent = '';
    userInput.removeAttribute('aria-invalid');
    passwordInput.removeAttribute('aria-invalid');
  };
  userInput.addEventListener('input', clearError);
  passwordInput.addEventListener('input', clearError);
  toggle.addEventListener('click', () => {
    const visible = passwordInput.type === 'text';
    passwordInput.type = visible ? 'password' : 'text';
    toggle.textContent = visible ? 'Show' : 'Hide';
    toggle.setAttribute('aria-pressed', String(!visible));
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    passwordInput.focus();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    clearError();
    const username = userInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      error('Please enter your username and password.');
      (!username ? userInput : passwordInput).focus();
      return;
    }
    if (!['http:', 'https:'].includes(location.protocol)) {
      error('Open this page from your running Express server, not a downloaded HTML file.');
      return;
    }
    busy = true;
    submit.disabled = true;
    submitText.textContent = 'Signing in…';
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!(response.headers.get('content-type') || '').includes('application/json')) {
        throw new Error('Unexpected server response. Check the backend login route.');
      }
      const data = await response.json();
      if (!response.ok) {
        error(response.status === 401 ? 'Username or password is incorrect. Please try again.' : data?.message || 'Unable to sign in. Please try again.');
        return;
      }
      if (typeof data.token !== 'string' || !data.token || !data.user || !data.user.username) {
        throw new Error('Login response is missing a token or user details.');
      }
      // Session-scoped storage: cleared when the browser tab session ends.
      sessionStorage.setItem('bhs_auth_token', data.token);
      sessionStorage.setItem('bhs_user', JSON.stringify({
        username: data.user.username, role: data.user.role,
        user_id: data.user.user_id, staff_id: data.user.staff_id
      }));
      passwordInput.value = '';
      location.replace('dashboard.html');
    } catch (err) {
      error(err instanceof TypeError ? 'Cannot reach the server. Check Node.js and your connection.' : err.message || 'Unable to sign in.');
    } finally {
      busy = false;
      submit.disabled = false;
      submitText.textContent = 'Sign in';
    }
  });
})();

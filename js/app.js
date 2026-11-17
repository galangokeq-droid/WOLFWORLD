import { signInWithPassword, signOut, getCurrentSession } from './auth/authentication.js';
import { fetchCurrentProfile } from './services/profile.service.js';
import { resolveAccess, APP_ROLES } from './auth/authorization.js';
import { isValidEmail, isNonEmpty } from './utils/validators.js';
import { toUserMessage } from './utils/error-handler.js';
import { loadDashboard } from './pages/dashboard.js';

const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const submitButton = document.getElementById('submit-button');
const errorBox = document.getElementById('login-error');
const passwordToggle = document.getElementById('password-toggle');
const forgotButton = document.getElementById('forgot-password');
const userName = document.getElementById('user-name');
const logoutButton = document.getElementById('logout-button');

const ACCESS_MESSAGES = {
  PROFILE_MISSING: 'Profil akun belum terdaftar. Hubungi Owner.',
  ACCOUNT_INACTIVE: 'Akun Anda nonaktif. Hubungi Owner.',
  UNKNOWN_ROLE: 'Role akun tidak dikenali. Hubungi Owner.',
};

function showMessage(message, type) {
  errorBox.textContent = message;
  errorBox.classList.toggle('alert-error', type === 'error');
  errorBox.classList.toggle('alert-success', type === 'success');
  errorBox.hidden = false;
}

function showError(message) {
  showMessage(message, 'error');
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = '';
}

function setFieldError(element, message) {
  element.textContent = message ?? '';
  element.hidden = !message;
}

function validateForm() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const emailMessage = !isNonEmpty(email)
    ? 'Email wajib diisi.'
    : !isValidEmail(email)
      ? 'Format email tidak valid.'
      : null;
  const passwordMessage = isNonEmpty(password) ? null : 'Password wajib diisi.';

  setFieldError(emailError, emailMessage);
  setFieldError(passwordError, passwordMessage);
  return !emailMessage && !passwordMessage;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Memeriksa...' : 'Masuk';
}

function showLogin() {
  dashboardView.hidden = true;
  loginView.hidden = false;
}

function showDashboard(profile) {
  loginView.hidden = true;
  dashboardView.hidden = false;
  userName.textContent = profile.fullName ?? 'Owner';
  loadDashboard();
}

/**
 * Setelah login: ambil profil, cek status akun dan role.
 * Hanya Owner yang masuk ke dashboard saat ini. Panel Admin dibuat di tahap berikutnya.
 */
async function completeSignIn() {
  const profile = await fetchCurrentProfile();
  const access = resolveAccess(profile);

  if (!access.allowed) {
    await signOut();
    showLogin();
    showError(ACCESS_MESSAGES[access.reason]);
    return;
  }

  if (access.role !== APP_ROLES.OWNER) {
    await signOut();
    showLogin();
    showError('Panel Admin belum tersedia pada tahap ini.');
    return;
  }

  clearError();
  showDashboard(profile);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  if (!validateForm()) return;

  setLoading(true);
  try {
    await signInWithPassword(emailInput.value.trim(), passwordInput.value);
    await completeSignIn();
  } catch (error) {
    showError(toUserMessage(error));
  } finally {
    setLoading(false);
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    await signOut();
    passwordInput.value = '';
    clearError();
    showLogin();
  } catch (error) {
    showError(toUserMessage(error));
  }
});

passwordToggle.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  passwordToggle.textContent = isHidden ? 'Sembunyikan' : 'Tampilkan';
  passwordToggle.setAttribute('aria-pressed', String(isHidden));
});

forgotButton.addEventListener('click', () => {
  showError('Fitur reset password belum tersedia. Hubungi Owner.');
});

async function restoreSession() {
  try {
    const session = await getCurrentSession();
    if (session) await completeSignIn();
  } catch (error) {
    showError(toUserMessage(error));
  }
}

restoreSession();
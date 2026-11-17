import { signInWithPassword, signOut, getCurrentSession } from './auth/authentication.js';
import { fetchCurrentProfile } from './services/profile.service.js';
import { resolveAccess, APP_ROLES } from './auth/authorization.js';
import { isValidEmail, isNonEmpty } from './utils/validators.js';
import { toUserMessage } from './utils/error-handler.js';
import { loadDashboard } from './pages/dashboard.js';
import { renderOrdersList } from './pages/orders.js';
import { renderPaymentsList } from './pages/payments.js';

const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const dashboardContent = document.getElementById('dashboard-content');
const moduleContent = document.getElementById('module-content');
const pageTitle = document.getElementById('page-title');
const menuButton = document.getElementById('menu-button');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const navButtons = document.querySelectorAll('[data-page]');

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

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  orders: 'Pesanan',
  payments: 'Pembayaran',
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
  submitButton.textContent = isLoading ? 'Memeriksa...' : 'Login';
}

function openDrawer() {
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  drawerOverlay.hidden = false;
  menuButton.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  drawerOverlay.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}

/** Pindah halaman di dalam dashboard. Hanya satu modul yang tampil dalam satu waktu. */
function navigate(page) {
  const isDashboard = page === 'dashboard';
  dashboardContent.hidden = !isDashboard;
  moduleContent.hidden = isDashboard;
  pageTitle.textContent = PAGE_TITLES[page] ?? PAGE_TITLES.dashboard;

  for (const button of navButtons) {
    const active = button.dataset.page === page;
    button.classList.toggle('is-active', active);
    if (active) {
      button.setAttribute('aria-current', 'page');
    } else {
      button.removeAttribute('aria-current');
    }
  }

  closeDrawer();
  window.scrollTo(0, 0);

  if (isDashboard) {
    loadDashboard();
  } else if (page === 'orders') {
    renderOrdersList(moduleContent);
  } else if (page === 'payments') {
    renderPaymentsList(moduleContent);
  }
}

function showLogin() {
  closeDrawer();
  dashboardView.hidden = true;
  loginView.hidden = false;
}

function showDashboard(profile) {
  loginView.hidden = true;
  dashboardView.hidden = false;
  userName.textContent = profile.fullName ?? 'Owner';
  navigate('dashboard');
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

menuButton.addEventListener('click', () => {
  if (drawer.classList.contains('is-open')) {
    closeDrawer();
  } else {
    openDrawer();
  }
});

drawerOverlay.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDrawer();
});

for (const button of navButtons) {
  button.addEventListener('click', () => navigate(button.dataset.page));
}

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
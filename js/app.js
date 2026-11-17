import { signInWithPassword, signOut, getCurrentSession } from './auth/authentication.js';
import { fetchCurrentProfile } from './services/profile.service.js';
import { resolveAccess } from './auth/authorization.js';
import { isValidEmail, isNonEmpty } from './utils/validators.js';
import { toUserMessage } from './utils/error-handler.js';

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const submitButton = document.getElementById('submit-button');
const errorBox = document.getElementById('login-error');
const passwordToggle = document.getElementById('password-toggle');
const forgotButton = document.getElementById('forgot-password');

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

/**
 * Setelah login: ambil profil, cek status akun, lalu tentukan panel.
 * Jika profil atau role tidak bisa diverifikasi, sesi ditutup dan error ditampilkan.
 */
async function completeSignIn() {
  const profile = await fetchCurrentProfile();
  const access = resolveAccess(profile);

  if (!access.allowed) {
    await signOut();
    const messages = {
      PROFILE_MISSING: 'Profil akun belum terdaftar. Hubungi Owner.',
      ACCOUNT_INACTIVE: 'Akun Anda nonaktif. Hubungi Owner.',
      UNKNOWN_ROLE: 'Role akun tidak dikenali. Hubungi Owner.',
    };
    showError(messages[access.reason]);
    return;
  }

  // Panel Owner dan Admin dibuat di tahap berikutnya (Stage 5 dan 6).
  showError(`Login berhasil sebagai ${access.role}. Panel belum tersedia pada tahap ini.`);
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

const AUTH_MESSAGES = {
  'Invalid login credentials': 'Email atau password salah.',
  'Email not confirmed': 'Email belum dikonfirmasi. Hubungi Owner.',
  'Too many requests': 'Terlalu banyak percobaan. Coba lagi beberapa saat.',
};

const DEFAULT_MESSAGE = 'Terjadi kesalahan. Silakan coba lagi.';
const NETWORK_MESSAGE = 'Koneksi bermasalah. Periksa jaringan Anda.';

export function toUserMessage(error) {
  console.error('[WOLFWORLD]', error);

  const raw = typeof error?.message === 'string' ? error.message : '';
  if (AUTH_MESSAGES[raw]) return AUTH_MESSAGES[raw];
  if (/network|failed to fetch/i.test(raw)) return NETWORK_MESSAGE;

  return DEFAULT_MESSAGE;
}
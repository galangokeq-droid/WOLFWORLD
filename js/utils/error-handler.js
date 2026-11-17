const AUTH_MESSAGES = {
  'Invalid login credentials': 'Email atau password salah.',
  'Email not confirmed': 'Email belum dikonfirmasi. Hubungi Owner.',
  'Too many requests': 'Terlalu banyak percobaan. Coba lagi beberapa saat.',
};

const DEFAULT_MESSAGE = 'Terjadi kesalahan. Silakan coba lagi.';

/**
 * Mengubah error teknis menjadi pesan Bahasa Indonesia yang aman ditampilkan.
 * Detail teknis hanya dicatat ke console, tidak ditampilkan ke pengguna.
 */
export function toUserMessage(error) {
  if (!error) return DEFAULT_MESSAGE;

  console.error('[WOLFWORLD]', error);

  if (typeof error.message === 'string') {
    for (const [key, message] of Object.entries(AUTH_MESSAGES)) {
      if (error.message.includes(key)) return message;
    }
  }

  if (error.status === 0 || error.message === 'Failed to fetch') {
    return 'Koneksi bermasalah. Periksa jaringan Anda.';
  }

  return DEFAULT_MESSAGE;
  }

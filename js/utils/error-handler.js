const AUTH_MESSAGES = {
  'Invalid login credentials': 'Email atau password salah.',
  'Email not confirmed': 'Email belum dikonfirmasi. Hubungi Owner.',
  'Too many requests': 'Terlalu banyak percobaan. Coba lagi beberapa saat.',
};

const DEFAULT_MESSAGE = 'Terjadi kesalahan. Silakan coba lagi.';

/**
 * Mengubah error teknis menjadi pesan Bahasa Indonesia yang aman ditampilkan.
 * SEMENTARA: pesan asli ditampilkan untuk debugging. Kembalikan ke versi aman setelah masalah selesai.
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

  const detail = typeof error.message === 'string' ? error.message : '';
  return `${DEFAULT_MESSAGE} (${detail})`;
}
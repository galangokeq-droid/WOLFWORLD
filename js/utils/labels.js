export const ORDER_STATUS_LABELS = {
  pending: 'Menunggu',
  waiting_payment: 'Menunggu pembayaran',
  paid: 'Dibayar',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  refunded: 'Dikembalikan',
};

export const PAYMENT_STATUS_LABELS = {
  pending: 'Menunggu',
  waiting_verification: 'Menunggu verifikasi',
  verified: 'Terverifikasi',
  rejected: 'Ditolak',
  failed: 'Gagal',
  refunded: 'Dikembalikan',
};

export function statusLabel(map, status) {
  return map[status] ?? status ?? '-';
}
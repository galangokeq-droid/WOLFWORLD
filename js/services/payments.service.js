import { supabase } from '../config/supabase.js';

const ERROR_TEXT = {
  NOT_ALLOWED: 'Anda tidak punya izin untuk aksi ini.',
  PAYMENT_NOT_FOUND: 'Data pembayaran tidak ditemukan.',
  INVALID_PAYMENT_STATE: 'Pembayaran ini sudah diproses sebelumnya.',
  REASON_REQUIRED: 'Alasan penolakan wajib diisi.',
};

function friendlyError(error) {
  const key = Object.keys(ERROR_TEXT).find((k) => error?.message?.includes(k));
  return new Error(key ? ERROR_TEXT[key] : 'Terjadi kesalahan. Silakan coba lagi.');
}

export async function fetchPayments({ limit = 50 } = {}) {
  const { data, error } = await supabase
    .from('payments')
    .select('id, order_id, amount, currency, status, gateway_reference, rejection_reason, created_at, orders ( order_number, customer_name )')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function verifyPayment(paymentId) {
  const { error } = await supabase.rpc('verify_payment', { p_payment_id: paymentId });
  if (error) throw friendlyError(error);
}

export async function rejectPayment(paymentId, reason) {
  const { error } = await supabase.rpc('reject_payment', {
    p_payment_id: paymentId,
    p_reason: reason,
  });
  if (error) throw friendlyError(error);
}
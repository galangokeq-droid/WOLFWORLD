import { supabase } from '../config/supabase.js';

export const ORDER_STATUSES = [
  'pending',
  'waiting_payment',
  'paid',
  'processing',
  'completed',
  'cancelled',
  'refunded',
];

export async function fetchOrders({ limit = 50 } = {}) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, customer_email, status, payment_status, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchOrderDetail(orderId) {
  const [orderRes, itemsRes, paymentsRes] = await Promise.all([
    supabase.from('orders').select('*').eq('id', orderId).maybeSingle(),
    supabase
      .from('order_items')
      .select('id, title_snapshot, item_type, quantity, price_snapshot, subtotal')
      .eq('order_id', orderId),
    supabase
      .from('payments')
      .select('id, amount, currency, status, gateway_reference, notes, rejection_reason, verified_at, created_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false }),
  ]);

  for (const res of [orderRes, itemsRes, paymentsRes]) {
    if (res.error) throw res.error;
  }

  return {
    order: orderRes.data,
    items: itemsRes.data ?? [],
    payments: paymentsRes.data ?? [],
  };
}

/** Mengubah status lewat fungsi database yang sudah mengecek izin dan menulis log. */
export async function setOrderStatus(orderId, status) {
  const { error } = await supabase.rpc('update_order_status', {
    p_order_id: orderId,
    p_status: status,
  });
  if (error) throw error;
}
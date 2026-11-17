import { supabase } from '../config/supabase.js';

const PENDING_ORDER_STATUSES = ['pending', 'waiting_payment'];
const PENDING_PAYMENT_STATUSES = ['pending', 'waiting_verification'];
const ACTIVE_PROJECT_STATUSES = ['pending', 'in_progress', 'waiting_review', 'revision'];

async function countRows(table, applyFilters = (query) => query) {
  const query = applyFilters(supabase.from(table).select('id', { count: 'exact', head: true }));
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

async function countProfilesByRole(roleSlug) {
  const { count, error } = await supabase
    .from('profiles')
    .select('id, roles!inner(slug)', { count: 'exact', head: true })
    .eq('roles.slug', roleSlug);
  if (error) throw error;
  return count ?? 0;
}

async function sumColumn(table, column) {
  const { data, error } = await supabase.from(table).select(column);
  if (error) throw error;
  return (data ?? []).reduce((total, row) => total + Number(row[column] ?? 0), 0);
}

async function fetchRecent(table, columns, limit) {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

async function fetchOverviewCounts() {
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    pendingPayments,
    activeProjects,
    totalProducts,
    totalServices,
    totalAdmins,
    totalCustomers,
  ] = await Promise.all([
    countRows('orders'),
    countRows('orders', (query) => query.in('status', PENDING_ORDER_STATUSES)),
    countRows('orders', (query) => query.eq('status', 'completed')),
    countRows('payments', (query) => query.in('status', PENDING_PAYMENT_STATUSES)),
    countRows('projects', (query) => query.in('status', ACTIVE_PROJECT_STATUSES)),
    countRows('products'),
    countRows('services'),
    countProfilesByRole('admin'),
    countProfilesByRole('customer'),
  ]);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    pendingPayments,
    activeProjects,
    totalProducts,
    totalServices,
    totalAdmins,
    totalCustomers,
  };
}

/**
 * Mengambil seluruh data dashboard Owner dari database.
 * Semua angka berasal dari tabel asli; tidak ada data yang dibuat manual.
 */
export async function fetchOwnerDashboard() {
  const [totalRevenue, totalExpenses, counts, recentOrders, recentPayments, recentActivities] =
    await Promise.all([
      sumColumn('revenue_records', 'amount'),
      sumColumn('expense_records', 'amount'),
      fetchOverviewCounts(),
      fetchRecent('orders', 'id, order_number, customer_name, total_amount, status, created_at', 5),
      fetchRecent('payments', 'id, amount, status, created_at', 5),
      fetchRecent('activity_logs', 'action, description, created_at', 10),
    ]);

  return {
    summary: {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      ...counts,
    },
    recentOrders,
    recentPayments,
    recentActivities,
  };
}
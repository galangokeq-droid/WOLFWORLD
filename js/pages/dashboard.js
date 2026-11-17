import { fetchOwnerDashboard } from '../services/dashboard.service.js';
import { toUserMessage } from '../utils/error-handler.js';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});
const countFormatter = new Intl.NumberFormat('id-ID');
const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

const ORDER_STATUS_LABELS = {
  pending: 'Menunggu',
  waiting_payment: 'Menunggu pembayaran',
  paid: 'Dibayar',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  refunded: 'Dikembalikan',
};

const PAYMENT_STATUS_LABELS = {
  pending: 'Menunggu',
  waiting_verification: 'Menunggu verifikasi',
  verified: 'Terverifikasi',
  rejected: 'Ditolak',
  failed: 'Gagal',
  refunded: 'Dikembalikan',
};

const STAT_DEFINITIONS = [
  { key: 'totalRevenue', label: 'Total Pendapatan', format: formatCurrency },
  { key: 'totalExpenses', label: 'Total Pengeluaran', format: formatCurrency },
  { key: 'netProfit', label: 'Laba Bersih', format: formatCurrency },
  { key: 'totalOrders', label: 'Total Pesanan', format: formatCount },
  { key: 'pendingOrders', label: 'Pesanan Menunggu', format: formatCount },
  { key: 'completedOrders', label: 'Pesanan Selesai', format: formatCount },
  { key: 'pendingPayments', label: 'Pembayaran Menunggu', format: formatCount },
  { key: 'activeProjects', label: 'Proyek Aktif', format: formatCount },
  { key: 'totalProducts', label: 'Total Produk', format: formatCount },
  { key: 'totalServices', label: 'Total Layanan', format: formatCount },
  { key: 'totalAdmins', label: 'Total Admin', format: formatCount },
  { key: 'totalCustomers', label: 'Total Pelanggan', format: formatCount },
];

const dashboardError = document.getElementById('dashboard-error');
const statsGrid = document.getElementById('stats-grid');
const recentOrders = document.getElementById('recent-orders');
const recentPayments = document.getElementById('recent-payments');
const recentActivities = document.getElementById('recent-activities');

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0));
}

function formatCount(value) {
  return countFormatter.format(Number(value ?? 0));
}

function formatDate(value) {
  return value ? dateFormatter.format(new Date(value)) : '-';
}

function statusLabel(map, status) {
  return map[status] ?? status ?? '-';
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function buildRow(primary, secondary, aside) {
  const row = createElement('li', 'list-item');
  const details = createElement('div');
  details.append(createElement('strong', null, primary), createElement('div', 'stat-label', secondary));
  row.append(details, createElement('div', 'stat-label', aside));
  return row;
}

function renderStats(summary) {
  const cards = STAT_DEFINITIONS.map((definition) => {
    const card = createElement('article', 'glass stat-card');
    card.append(
      createElement('span', 'stat-label', definition.label),
      createElement('span', 'stat-value', definition.format(summary[definition.key])),
    );
    return card;
  });
  statsGrid.replaceChildren(...cards);
}

function renderList(container, items, emptyText, buildItem) {
  if (items.length === 0) {
    container.replaceChildren(createElement('li', 'list-empty', emptyText));
    return;
  }
  container.replaceChildren(...items.map(buildItem));
}

function renderDashboard(data) {
  renderStats(data.summary);

  renderList(recentOrders, data.recentOrders, 'Belum ada pesanan.', (order) =>
    buildRow(
      order.order_number ?? '-',
      order.customer_name ?? '-',
      `${formatCurrency(order.total_amount)} · ${statusLabel(ORDER_STATUS_LABELS, order.status)}`,
    ),
  );

  renderList(recentPayments, data.recentPayments, 'Belum ada pembayaran.', (payment) =>
    buildRow(
      formatCurrency(payment.amount),
      formatDate(payment.created_at),
      statusLabel(PAYMENT_STATUS_LABELS, payment.status),
    ),
  );

  renderList(recentActivities, data.recentActivities, 'Belum ada aktivitas.', (activity) =>
    buildRow(activity.action ?? '-', activity.description ?? '', formatDate(activity.created_at)),
  );
}

/**
 * Memuat dan menampilkan data dashboard Owner.
 * Jika gagal, pesan error ditampilkan di atas dashboard.
 */
export async function loadDashboard() {
  dashboardError.hidden = true;
  try {
    const data = await fetchOwnerDashboard();
    renderDashboard(data);
  } catch (error) {
    dashboardError.textContent = toUserMessage(error);
    dashboardError.hidden = false;
  }
}
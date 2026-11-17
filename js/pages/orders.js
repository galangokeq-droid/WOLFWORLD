import { fetchOrders, fetchOrderDetail, setOrderStatus, ORDER_STATUSES } from '../services/orders.service.js';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, statusLabel } from '../utils/labels.js';
import {
  createAlert,
  createBackButton,
  createElement,
  createEmpty,
  createInfoRow,
  createListRow,
  formatCurrency,
  formatDate,
} from '../utils/dom.js';
import { toUserMessage } from '../utils/error-handler.js';

/** Daftar pesanan dengan pencarian dan filter status. */
export async function renderOrdersList(container, notice = null) {
  container.replaceChildren(createElement('p', 'list-empty', 'Memuat pesanan...'));

  const search = createElement('input', 'field-input');
  search.type = 'search';
  search.placeholder = 'Cari nomor pesanan atau nama';
  search.setAttribute('aria-label', 'Cari pesanan');

  const filter = createElement('select', 'field-input');
  filter.setAttribute('aria-label', 'Filter status pesanan');
  filter.append(new Option('Semua status', ''));
  for (const status of ORDER_STATUSES) {
    filter.append(new Option(ORDER_STATUS_LABELS[status], status));
  }

  const toolbar = createElement('div', 'glass toolbar');
  toolbar.append(search, filter);

  const messageSlot = createElement('div');
  if (notice) messageSlot.append(createAlert(notice.message, notice.type));

  const list = createElement('ul', 'list');
  const panel = createElement('section', 'glass panel');
  panel.append(createElement('h3', null, 'Daftar Pesanan'), list);

  let orders = [];

  function render() {
    const keyword = search.value.trim().toLowerCase();
    const status = filter.value;

    const visible = orders.filter((order) => {
      const matchText =
        !keyword ||
        (order.order_number ?? '').toLowerCase().includes(keyword) ||
        (order.customer_name ?? '').toLowerCase().includes(keyword);
      const matchStatus = !status || order.status === status;
      return matchText && matchStatus;
    });

    if (visible.length === 0) {
      list.replaceChildren(
        createEmpty(orders.length === 0 ? 'Belum ada pesanan.' : 'Tidak ada pesanan yang cocok.'),
      );
      return;
    }

    list.replaceChildren(
      ...visible.map((order) => {
        const item = createListRow(
          order.order_number ?? '-',
          order.customer_name ?? '-',
          `${formatCurrency(order.total_amount)} · ${statusLabel(ORDER_STATUS_LABELS, order.status)}`,
        );
        item.classList.add('is-clickable');
        item.tabIndex = 0;
        item.setAttribute('role', 'button');

        const open = () => renderOrderDetail(container, order.id);
        item.addEventListener('click', open);
        item.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open();
          }
        });
        return item;
      }),
    );
  }

  search.addEventListener('input', render);
  filter.addEventListener('change', render);

  container.replaceChildren(toolbar, messageSlot, panel);

  try {
    orders = await fetchOrders();
    render();
  } catch (error) {
    messageSlot.replaceChildren(createAlert(toUserMessage(error)));
    list.replaceChildren(createEmpty('Pesanan belum bisa dimuat.'));
  }
}

/** Detail pesanan: info, item, pembayaran, dan ubah status. */
export async function renderOrderDetail(container, orderId, notice = null) {
  container.replaceChildren(createElement('p', 'list-empty', 'Memuat detail pesanan...'));
  const back = createBackButton('← Kembali ke daftar', () => renderOrdersList(container));

  let detail;
  try {
    detail = await fetchOrderDetail(orderId);
  } catch (error) {
    container.replaceChildren(back, createAlert(toUserMessage(error)));
    return;
  }

  const { order, items, payments } = detail;
  if (!order) {
    container.replaceChildren(back, createAlert('Pesanan tidak ditemukan.'));
    return;
  }

  const messageSlot = createElement('div');
  if (notice) messageSlot.append(createAlert(notice.message, notice.type));

  const info = createElement('section', 'glass panel');
  info.append(
    createElement('h3', null, order.order_number ?? 'Detail pesanan'),
    createInfoRow('Pelanggan', order.customer_name),
    createInfoRow('Email', order.customer_email),
    createInfoRow('Telepon', order.customer_phone),
    createInfoRow('Status pesanan', ORDER_STATUS_LABELS[order.status] ?? order.status),
    createInfoRow('Status pembayaran', PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status),
    createInfoRow('Total', formatCurrency(order.total_amount)),
    createInfoRow('Dibuat', formatDate(order.created_at)),
    createInfoRow('Catatan', order.notes),
  );

  const itemList = createElement('ul', 'list');
  itemList.replaceChildren(
    ...(items.length === 0
      ? [createEmpty('Tidak ada item.')]
      : items.map((item) =>
          createListRow(
            item.title_snapshot,
            `${item.quantity} × ${formatCurrency(item.price_snapshot)}`,
            formatCurrency(item.subtotal),
          ),
        )),
  );
  const itemPanel = createElement('section', 'glass panel');
  itemPanel.append(createElement('h3', null, 'Item Pesanan'), itemList);

  const paymentList = createElement('ul', 'list');
  paymentList.replaceChildren(
    ...(payments.length === 0
      ? [createEmpty('Belum ada pembayaran.')]
      : payments.map((payment) =>
          createListRow(
            formatCurrency(payment.amount),
            [formatDate(payment.created_at), payment.rejection_reason ? `alasan: ${payment.rejection_reason}` : null]
              .filter(Boolean)
              .join(' · '),
            PAYMENT_STATUS_LABELS[payment.status] ?? payment.status,
          ),
        )),
  );
  const paymentPanel = createElement('section', 'glass panel');
  paymentPanel.append(createElement('h3', null, 'Pembayaran'), paymentList);

  const statusSelect = createElement('select', 'field-input');
  statusSelect.setAttribute('aria-label', 'Status pesanan baru');
  for (const status of ORDER_STATUSES) {
    statusSelect.append(new Option(ORDER_STATUS_LABELS[status], status, false, status === order.status));
  }

  const saveButton = createElement('button', 'btn btn-primary', 'Simpan status');
  saveButton.type = 'button';
  saveButton.addEventListener('click', async () => {
    if (statusSelect.value === order.status) {
      messageSlot.replaceChildren(createAlert('Status belum berubah.'));
      return;
    }

    saveButton.disabled = true;
    try {
      await setOrderStatus(order.id, statusSelect.value);
      await renderOrderDetail(container, order.id, { message: 'Status pesanan berhasil diubah.', type: 'success' });
    } catch (error) {
      messageSlot.replaceChildren(createAlert(toUserMessage(error)));
      saveButton.disabled = false;
    }
  });

  const statusPanel = createElement('section', 'glass panel');
  const actionRow = createElement('div', 'action-row');
  actionRow.append(statusSelect, saveButton);
  statusPanel.append(createElement('h3', null, 'Ubah Status'), actionRow);

  container.replaceChildren(back, messageSlot, info, statusPanel, itemPanel, paymentPanel);
}
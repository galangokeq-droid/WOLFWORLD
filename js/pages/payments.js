import { fetchPayments, verifyPayment, rejectPayment } from '../services/payments.service.js';
import { PAYMENT_STATUS_LABELS, statusLabel } from '../utils/labels.js';
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

const ACTIONABLE_STATUSES = new Set(['pending', 'waiting_verification']);

/** Daftar pembayaran dengan filter status. */
export async function renderPaymentsList(container, notice = null) {
  container.replaceChildren(createElement('p', 'list-empty', 'Memuat pembayaran...'));

  const filter = createElement('select', 'field-input');
  filter.setAttribute('aria-label', 'Filter status pembayaran');
  filter.append(new Option('Semua status', ''));
  for (const [value, label] of Object.entries(PAYMENT_STATUS_LABELS)) {
    filter.append(new Option(label, value));
  }

  const toolbar = createElement('div', 'glass toolbar');
  toolbar.append(filter);

  const messageSlot = createElement('div');
  if (notice) messageSlot.append(createAlert(notice.message, notice.type));

  const list = createElement('ul', 'list');
  const panel = createElement('section', 'glass panel');
  panel.append(createElement('h3', null, 'Daftar Pembayaran'), list);

  let payments = [];

  function render() {
    const status = filter.value;
    const visible = payments.filter((payment) => !status || payment.status === status);

    if (visible.length === 0) {
      list.replaceChildren(
        createEmpty(payments.length === 0 ? 'Belum ada pembayaran.' : 'Tidak ada pembayaran dengan status ini.'),
      );
      return;
    }

    list.replaceChildren(
      ...visible.map((payment) => {
        const item = createListRow(
          formatCurrency(payment.amount),
          `${payment.orders?.order_number ?? '-'} · ${payment.orders?.customer_name ?? '-'}`,
          statusLabel(PAYMENT_STATUS_LABELS, payment.status),
        );
        item.classList.add('is-clickable');
        item.tabIndex = 0;
        item.setAttribute('role', 'button');

        const open = () => renderPaymentDetail(container, payment);
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

  filter.addEventListener('change', render);

  container.replaceChildren(toolbar, messageSlot, panel);

  try {
    payments = await fetchPayments();
    render();
  } catch (error) {
    messageSlot.replaceChildren(createAlert(toUserMessage(error)));
    list.replaceChildren(createEmpty('Pembayaran belum bisa dimuat.'));
  }
}

/** Detail pembayaran dan aksi verifikasi (setujui atau tolak dengan alasan). */
export function renderPaymentDetail(container, payment, notice = null) {
  const back = createBackButton('← Kembali ke daftar', () => renderPaymentsList(container));

  const messageSlot = createElement('div');
  if (notice) messageSlot.append(createAlert(notice.message, notice.type));

  const info = createElement('section', 'glass panel');
  info.append(
    createElement('h3', null, payment.orders?.order_number ?? 'Detail pembayaran'),
    createInfoRow('Pelanggan', payment.orders?.customer_name),
    createInfoRow('Jumlah', formatCurrency(payment.amount)),
    createInfoRow('Status', PAYMENT_STATUS_LABELS[payment.status] ?? payment.status),
    createInfoRow('Referensi', payment.gateway_reference),
    createInfoRow('Dibuat', formatDate(payment.created_at)),
  );
  if (payment.rejection_reason) {
    info.append(createInfoRow('Alasan penolakan', payment.rejection_reason));
  }

  const panels = [back, messageSlot, info];

  if (ACTIONABLE_STATUSES.has(payment.status)) {
    const approveButton = createElement('button', 'btn btn-primary btn-block', 'Setujui pembayaran');
    approveButton.type = 'button';

    const reasonInput = createElement('textarea', 'field-input');
    reasonInput.rows = 3;
    reasonInput.placeholder = 'Alasan penolakan (wajib jika ditolak)';
    reasonInput.setAttribute('aria-label', 'Alasan penolakan');

    const rejectButton = createElement('button', 'btn btn-secondary btn-block', 'Tolak pembayaran');
    rejectButton.type = 'button';

    const setBusy = (busy) => {
      approveButton.disabled = busy;
      rejectButton.disabled = busy;
    };

    approveButton.addEventListener('click', async () => {
      setBusy(true);
      try {
        await verifyPayment(payment.id);
        await renderPaymentsList(container, { message: 'Pembayaran disetujui.', type: 'success' });
      } catch (error) {
        messageSlot.replaceChildren(createAlert(toUserMessage(error)));
        setBusy(false);
      }
    });

    rejectButton.addEventListener('click', async () => {
      const reason = reasonInput.value.trim();
      if (!reason) {
        messageSlot.replaceChildren(createAlert('Isi alasan penolakan terlebih dahulu.'));
        reasonInput.focus();
        return;
      }

      setBusy(true);
      try {
        await rejectPayment(payment.id, reason);
        await renderPaymentsList(container, { message: 'Pembayaran ditolak.', type: 'success' });
      } catch (error) {
        messageSlot.replaceChildren(createAlert(toUserMessage(error)));
        setBusy(false);
      }
    });

    const actions = createElement('section', 'glass panel');
    actions.append(
      createElement('h3', null, 'Verifikasi'),
      approveButton,
      reasonInput,
      rejectButton,
    );
    panels.push(actions);
  }

  container.replaceChildren(...panels);
}
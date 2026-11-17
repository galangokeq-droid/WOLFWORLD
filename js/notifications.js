const bellButton = document.getElementById('notification-button');
const statusBox = document.getElementById('notification-status');

const STATUS_TEXT = {
  unsupported: 'Browser ini tidak mendukung notifikasi.',
  granted: 'Notifikasi sudah aktif.',
  denied: 'Notifikasi diblokir. Aktifkan lagi lewat pengaturan browser.',
  default: 'Ketuk lonceng untuk mengizinkan notifikasi.',
};

function currentState() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

function renderState() {
  const state = currentState();
  statusBox.textContent = STATUS_TEXT[state];
  statusBox.hidden = state === 'granted';
  bellButton.disabled = state === 'unsupported';
  bellButton.classList.toggle('is-active', state === 'granted');
}

bellButton.addEventListener('click', async () => {
  const state = currentState();
  if (state === 'default') {
    await Notification.requestPermission();
  }
  renderState();
});

renderState();
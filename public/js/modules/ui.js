export function toast(msg, icon = '💖') {
  let zone = document.querySelector('#toast-zone');
  if (!zone) {
    document.body.insertAdjacentHTML('beforeend', '<div id="toast-zone"></div>');
    zone = document.querySelector('#toast-zone');
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  zone.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 2600);
}

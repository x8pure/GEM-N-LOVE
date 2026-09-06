const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--rose)"><polyline points="20 6 9 17 4 12"/></svg>`;

export function toast(msg, icon = checkSvg) {
  let zone = document.querySelector('#toast-zone');
  if (!zone) {
    document.body.insertAdjacentHTML('beforeend', '<div id="toast-zone"></div>');
    zone = document.querySelector('#toast-zone');
  }
  const el = document.createElement('div');
  el.className = 'toast';
  const iconHtml = icon && icon.startsWith('<svg') ? icon : checkSvg;
  el.innerHTML = `<span class="toast-ic">${iconHtml}</span><span>${msg}</span>`;
  zone.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 2600);
}

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

let scrollLockDepth = 0;
let lockedScrollY = 0;
let previousBodyStyles = {
  position: '',
  top: '',
  width: '',
  overflow: '',
  paddingRight: ''
};

export function lockBodyScroll() {
  scrollLockDepth++;
  if (scrollLockDepth > 1) {
    return;
  }

  lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;

  previousBodyStyles = {
    position: document.body.style.position || '',
    top: document.body.style.top || '',
    width: document.body.style.width || '',
    overflow: document.body.style.overflow || '',
    paddingRight: document.body.style.paddingRight || ''
  };

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.body.classList.add('body-scroll-locked');
}

export function unlockBodyScroll() {
  if (scrollLockDepth <= 0) return;
  scrollLockDepth--;
  if (scrollLockDepth > 0) {
    return;
  }

  const savedTop = document.body.style.top;
  const restoreY = savedTop ? Math.abs(parseInt(savedTop, 10)) : lockedScrollY;

  document.body.style.position = previousBodyStyles.position || '';
  document.body.style.top = previousBodyStyles.top || '';
  document.body.style.width = previousBodyStyles.width || '';
  document.body.style.overflow = previousBodyStyles.overflow || '';
  document.body.style.paddingRight = previousBodyStyles.paddingRight || '';
  document.documentElement.style.overflow = '';
  document.body.classList.remove('body-scroll-locked');

  const htmlEl = document.documentElement;
  const prevHtmlScroll = htmlEl.style.scrollBehavior;
  const prevBodyScroll = document.body.style.scrollBehavior;
  htmlEl.style.scrollBehavior = 'auto';
  document.body.style.scrollBehavior = 'auto';

  window.scrollTo(0, restoreY);

  requestAnimationFrame(() => {
    htmlEl.style.scrollBehavior = prevHtmlScroll || '';
    document.body.style.scrollBehavior = prevBodyScroll || '';
  });
}

if (typeof window !== 'undefined') {
  window.lockBodyScroll = lockBodyScroll;
  window.unlockBodyScroll = unlockBodyScroll;
}


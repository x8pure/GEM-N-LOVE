export function getClientSid() {
  try {
    let sid = localStorage.getItem('ls_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('ls_sid', sid);
    }
    try {
      document.cookie = 'ls_sid=' + encodeURIComponent(sid) + '; Path=/; SameSite=Lax;' + (location.protocol === 'https:' ? ' Secure;' : '') + ' Max-Age=31536000';
    } catch {}
    return sid;
  } catch { return ''; }
}

export async function api(path, opts = {}) {
  const sid = getClientSid();
  const token = localStorage.getItem('ls_auth_token');
  const customHeaders = {
    'Content-Type': 'application/json',
    ...(sid ? { 'x-ls-sid': sid } : {}),
    ...(token ? { 'Authorization': 'Bearer ' + token, 'x-ls-token': token } : {}),
    ...(opts.headers || {})
  };
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...opts,
    headers: customHeaders,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const serverSid = res.headers.get('x-ls-sid');
  if (serverSid) {
    try {
      localStorage.setItem('ls_sid', serverSid);
      document.cookie = 'ls_sid=' + encodeURIComponent(serverSid) + '; Path=/; SameSite=Lax;' + (location.protocol === 'https:' ? ' Secure;' : '') + ' Max-Age=31536000';
    } catch {}
  }
  let data;
  try { data = await res.json(); } catch { data = { ok: false }; }
  if (!res.ok) throw Object.assign(new Error(data.error || 'Hata olustu'), { data });
  return data;
}

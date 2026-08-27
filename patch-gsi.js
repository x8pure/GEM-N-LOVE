const fs = require('fs');
let code = fs.readFileSync('public/js/shop.js', 'utf8');

// Remove getSavedGoogleAccounts, saveGoogleAccount, openGoogleAuthModal
code = code.replace(/function getSavedGoogleAccounts\(\) \{[\s\S]*?function openGoogleAuthModal\(\) \{[\s\S]*?\}\n\n  function initAuth\(\)/, 'function initAuth()');

const initAuthReplacement = `  function initAuth() {
    const getAuthRedirect = (role) => {
      if (role === 'admin') return '/admin';
      const params = new URLSearchParams(location.search);
      const next = params.get('next') || params.get('redirect') || params.get('returnUrl');
      if (next && next.startsWith('/') && !next.startsWith('//')) return next;
      return '/';
    };

    const login = $('#login-form');
    if (login) login.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const r = await api('/api/auth/login', { method: 'POST', body: { email: $('#l-email').value.trim(), password: $('#l-pass').value } });
        toast(t('auth.hi', { name: r.user.name }), '👋');
        document.dispatchEvent(new Event('ls:session'));
        setTimeout(() => { location.href = getAuthRedirect(r.user?.role); }, 500);
      } catch (err) { toast(err.message, '⚠️'); }
    });
    const reg = $('#register-form');
    if (reg) reg.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const r = await api('/api/auth/register', { method: 'POST', body: { name: $('#r-name').value.trim(), email: $('#r-email').value.trim(), password: $('#r-pass').value } });
        toast(t('auth.hi', { name: r.user.name }), '🎉');
        document.dispatchEvent(new Event('ls:session'));
        setTimeout(() => { location.href = getAuthRedirect(r.user?.role); }, 500);
      } catch (err) { toast(err.message, '⚠️'); }
    });

    const gLogin = $('#btn-google-login');
    const gReg = $('#btn-google-reg');
    
    if (window.__LS_GOOGLE_CLIENT_ID__) {
       const handleCredentialResponse = async (response) => {
          try {
            toast(t('auth.google.wait') || 'Lütfen bekleyin...', '⏳');
            const r = await api('/api/auth/google', {
              method: 'POST',
              body: { credential: response.credential }
            });
            if (r.token) {
              localStorage.setItem('ls_auth_token', r.token);
            }
            toast((t('auth.google.ok') || 'Giriş yapıldı'), '🎉');
            document.dispatchEvent(new Event('ls:session'));
            setTimeout(() => {
              location.href = getAuthRedirect(r.user?.role);
            }, 400);
          } catch (err) {
            toast(err.message || 'Google ile giriş yapılamadı', '⚠️');
          }
       };
       
       if (window.google && window.google.accounts) {
         window.google.accounts.id.initialize({
           client_id: window.__LS_GOOGLE_CLIENT_ID__,
           callback: handleCredentialResponse
         });
         
         if (gLogin) {
            gLogin.innerHTML = '';
            window.google.accounts.id.renderButton(gLogin, { theme: 'outline', size: 'large' });
         }
         if (gReg) {
            gReg.innerHTML = '';
            window.google.accounts.id.renderButton(gReg, { theme: 'outline', size: 'large' });
         }
       } else {
         // Wait for script to load
         window.onload = () => {
           if (window.google && window.google.accounts) {
             window.google.accounts.id.initialize({
               client_id: window.__LS_GOOGLE_CLIENT_ID__,
               callback: handleCredentialResponse
             });
             
             if (gLogin) {
                gLogin.innerHTML = '';
                window.google.accounts.id.renderButton(gLogin, { theme: 'outline', size: 'large' });
             }
             if (gReg) {
                gReg.innerHTML = '';
                window.google.accounts.id.renderButton(gReg, { theme: 'outline', size: 'large' });
             }
           }
         }
       }
    } else {
       if (gLogin) gLogin.style.display = 'none';
       if (gReg) gReg.style.display = 'none';
       const orDividers = document.querySelectorAll('.auth-or');
       orDividers.forEach(d => d.style.display = 'none');
    }
  }`;

code = code.replace(/function initAuth\(\) \{[\s\S]*?\}\n\n  \/\* ================= ACCOUNT & PROFILE DASHBOARD \(OPTION 1\) ================= \*\//, initAuthReplacement + '\n\n  /* ================= ACCOUNT & PROFILE DASHBOARD (OPTION 1) ================= */');
fs.writeFileSync('public/js/shop.js', code);
console.log('Replaced.');

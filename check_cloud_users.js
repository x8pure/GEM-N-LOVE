import { loadFromCloudFirestore } from './lib/firebase.js';

async function check() {
  const c = await loadFromCloudFirestore();
  if (c && c.users) {
    console.log(c.users.map(u => ({ email: u.email, pass: u.passwordHash })));
  }
}
check();

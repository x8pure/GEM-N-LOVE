import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const csvPath = path.join(process.cwd(), 'import_users.csv');

const dbContent = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(dbContent);

const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim().length > 0);

// Skip header
lines.shift();

let importedCount = 0;

for (const line of lines) {
  const [idStr, adSoyad, eposta, telefon, telefonNorm, dogumTarihi, sonZiyaret, aktivasyon] = line.split(';');

  if (!eposta || !eposta.includes('@')) continue;

  const email = eposta.toLowerCase().trim();

  // Check if user exists
  if (db.users.find(u => u.email === email)) {
    continue;
  }

  // Generate random password hash since we don't have original passwords
  // Users will need to use "forgot password" to reset it.
  const randomPassword = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.createHash('sha256').update(randomPassword).digest('hex');
  
  const userId = 'u' + crypto.randomBytes(6).toString('hex');
  
  // Format dates properly
  let createdAt = new Date().toISOString();
  if (sonZiyaret) {
    const parts = sonZiyaret.split(' ');
    if (parts.length === 2) {
      const dateParts = parts[0].split('.');
      if (dateParts.length === 3) {
        createdAt = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1]}.000Z`).toISOString();
      }
    }
  }

  const newUser = {
    id: userId,
    email: email,
    passwordHash: passwordHash,
    name: adSoyad.trim(),
    role: 'customer',
    createdAt: createdAt,
    addresses: [
      {
        label: "İletişim Adresi",
        full: "",
        city: "",
        zip: "",
        phone: telefonNorm || telefon || "",
        discreet: true
      }
    ]
  };

  db.users.push(newUser);
  importedCount++;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully imported ${importedCount} users.`);

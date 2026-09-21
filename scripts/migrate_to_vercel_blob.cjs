const fs = require('fs');
const path = require('path');
const http = require('http');
const { put } = require('@vercel/blob');

// 1. Extract clean token
const rawToken = process.env.BLOB_READ_WRITE_TOKEN || '';
const match = rawToken.match(/vercel_blob_rw_[A-Za-z0-9_]+/);
const token = match ? match[0] : rawToken.trim();

if (!token) {
  console.error('ERROR: No valid Vercel Blob token found in environment!');
  process.exit(1);
}
console.log('Using Vercel Blob Token:', token.substring(0, 20) + '... (length: ' + token.length + ')');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Find all unique /uploads/ paths that are NOT full URLs
const text = JSON.stringify(db);
const matches = [...text.matchAll(/(["']?)(\/uploads\/[a-zA-Z0-9_\.-]+)\1/g)].map(m => m[2]);
const uniqueUploads = [...new Set(matches)];

console.log(`Found ${uniqueUploads.length} unique /uploads/ paths in db.json to migrate.`);

async function fetchBuffer(uploadPath) {
  // Check local disk first
  const fileName = path.basename(uploadPath);
  const localFile = path.join(__dirname, '..', 'public', 'uploads', fileName);
  if (fs.existsSync(localFile)) {
    const buf = fs.readFileSync(localFile);
    if (buf.length > 0) return { buf, ext: path.extname(fileName).replace('.', '') };
  }

  // Otherwise fetch via local server endpoint
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + uploadPath, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${uploadPath}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const ct = res.headers['content-type'] || 'image/webp';
        const ext = ct.includes('jpeg') || ct.includes('jpg') ? 'jpg' : (ct.includes('png') ? 'png' : 'webp');
        resolve({ buf, ext });
      });
    }).on('error', reject);
  });
}

async function run() {
  const urlMap = {};
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < uniqueUploads.length; i++) {
    const uploadPath = uniqueUploads[i];
    const fileName = path.basename(uploadPath);
    console.log(`[${i + 1}/${uniqueUploads.length}] Processing ${fileName}...`);

    try {
      const { buf, ext } = await fetchBuffer(uploadPath);
      const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : (ext === 'png' ? 'image/png' : 'image/webp');
      
      const blob = await put(`uploads/${fileName}`, buf, {
        access: 'public',
        addRandomSuffix: true,
        contentType: mimeType,
        token: token
      });

      if (blob && blob.url) {
        urlMap[uploadPath] = blob.url;
        successCount++;
        console.log(`  -> SUCCESS: ${blob.url}`);
      } else {
        throw new Error('No blob.url returned');
      }
    } catch (err) {
      console.error(`  -> FAILED for ${uploadPath}:`, err.message);
      failCount++;
    }
  }

  console.log(`\nMigration Summary: ${successCount} succeeded, ${failCount} failed.`);

  if (successCount > 0) {
    console.log('Updating db.json with new Vercel Blob URLs...');
    let updatedText = JSON.stringify(db, null, 2);
    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      // Global replace oldUrl with newUrl
      updatedText = updatedText.split(oldUrl).join(newUrl);
    }
    fs.writeFileSync(dbPath, updatedText, 'utf-8');
    console.log('db.json successfully updated on disk!');
  }
}

run().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});

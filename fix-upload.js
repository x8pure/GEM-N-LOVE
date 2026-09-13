import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /async function saveUpload[\s\S]*?return trimmed\.startsWith\('data:'\) \? '' : trimmed;\s*\}/;

const newFunc = `async function saveUpload(dataUrl: string): Promise<string> {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  const trimmed = dataUrl.trim();
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  const base64Index = trimmed.indexOf(';base64,');
  if (trimmed.startsWith('data:image/') && base64Index !== -1) {
    const header = trimmed.substring(5, base64Index);
    const rawType = header.replace(/^image\\//, '').split(';')[0].trim().toLowerCase();
    const rawBase64 = trimmed.substring(base64Index + 8);

    const extMap: Record<string, string> = {
      'svg+xml': 'svg', 'svg': 'svg',
      'png': 'png', 'x-png': 'png',
      'jpeg': 'jpg', 'jpg': 'jpg', 'pjpeg': 'jpg',
      'webp': 'webp', 'avif': 'avif', 'gif': 'gif'
    };
    const ext = extMap[rawType] || 'jpg';
    const mimeType = rawType === 'svg' || rawType === 'svg+xml' ? 'image/svg+xml' : (rawType === 'jpg' ? 'image/jpeg' : \`image/\${rawType}\`);

    try {
      const cleanBase64 = rawBase64.replace(/[\\s\\r\\n]+/g, '');
      const buf = Buffer.from(cleanBase64, 'base64');
      if (buf.length > 0) {
        const name = uid('img') + '.' + ext;

        // 1. Primary for Vercel: If Vercel Blob Token is set, upload to Vercel Blob Storage CDN
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          try {
            const blob = await put(\`uploads/\${name}\`, buf, {
              access: 'public',
              addRandomSuffix: true,
              contentType: mimeType,
              token: process.env.BLOB_READ_WRITE_TOKEN
            });
            if (blob && blob.url) {
              return blob.url;
            }
          } catch (blobErr) {
            console.error('Vercel Blob upload failed, falling back:', blobErr);
          }
        }

        // 2. Fallback for local dev and Cloud container environment
        const uploadDir = path.join(PUB, 'uploads');
        try { fs.mkdirSync(uploadDir, { recursive: true }); } catch {}
        try { fs.writeFileSync(path.join(uploadDir, name), buf); } catch {}
        
        const savedPath = '/uploads/' + name;

        // Persist to Cloud Firestore so container rebuilds never lose the photo
        await saveImageToCloud(name, trimmed).catch(() => {});

        return savedPath;
      }
    } catch (err) {
      console.error('saveUpload error:', err);
    }
  }

  return trimmed.startsWith('data:') ? '' : trimmed;
}`;

code = code.replace(regex, newFunc);
fs.writeFileSync('server.ts', code);
console.log("Fixed saveUpload");

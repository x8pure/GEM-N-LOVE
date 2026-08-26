const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/db.json'));

db.categories = db.categories.filter(c => c.id !== 'ct53c237f770d7'); // Remove "Bir Başka Yeni"
const manken = db.categories.find(c => c.id === 'ctc53872dfd698');
if (manken) {
  manken.slug = 'realistik-mankenler';
}

fs.writeFileSync('data/db.json', JSON.stringify(db, null, 2));
console.log('Fixed DB');

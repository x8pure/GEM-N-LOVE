const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./data/db.json', 'utf8'));

db.reviews[0] = {
  ...db.reviews[0],
  productId: "pe31257abd626",
  userName: "C*** D.",
  rating: 5,
  text: "Eşimle birlikte denemek için aldık. Titreşim modları cidden çok başarılı, silikon malzemesi çok kaliteli ve yumuşacık hissettiriyor. Kargo paketinde hiçbir mağaza ibaresi yoktu, kuryeye de belli olmuyor, gizlilik konusunda çok titizler."
};

db.reviews[1] = {
  ...db.reviews[1],
  productId: "p2484e3b314df",
  userName: "A*** K.",
  rating: 4,
  text: "Malzeme dokusu gayet gerçekçi ve esnek. Kullanımı oldukça keyifli ancak temizliği biraz zahmetli diyebilirim, kullanımdan sonra yıkayıp kurutmak ve pudralamak gerekiyor ki ilk günkü formunda kalsın. Paketleme sağlamdı."
};

db.reviews[2] = {
  ...db.reviews[2],
  productId: "pfad02d97d511",
  userName: "M*** T.",
  rating: 3,
  text: "Ürün malzemesi gerçekten kaliteli, metal olmasının verdiği ağırlık hissi güzel. Ancak anal denemeye yeni başladığım için setin en küçük boyu bile başlangıç için bana biraz zorlayıcı geldi, tam istediğim rahatlığı bulamadım maalesef. Belki tecrübe kazandıkça daha iyi olur. Kargolama süreci ise çok hızlı ve özenliydi."
};

fs.writeFileSync('./data/db.json', JSON.stringify(db, null, 2));
console.log("Reviews updated!");

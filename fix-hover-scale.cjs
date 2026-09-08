const fs = require('fs');
let css = fs.readFileSync('public/css/shop.css', 'utf8');

css = css.replace(
  /\.bento-card:hover \.bento-bg \{\n  transform: scale\(1\.06\)/g,
  '.bento-card:hover .bento-bg {\n  transform: scale(1.15)'
);
css = css.replace(
  /\.bento-card-b:hover \.bento-bg \{\n  transform: scale\(1\.06\)/g,
  '.bento-card-b:hover .bento-bg {\n  transform: scale(1.15)'
);
css = css.replace(
  /\.bento-card-c:hover \.bento-bg,\n\.bento-card-d:hover \.bento-bg \{\n  transform: scale\(1\.06\)/g,
  '.bento-card-c:hover .bento-bg,\n.bento-card-d:hover .bento-bg {\n  transform: scale(1.15)'
);
css = css.replace(
  /\.bento-card-e:hover \.bento-bg,\n\.bento-card-f:hover \.bento-bg \{\n  transform: scale\(1\.06\)/g,
  '.bento-card-e:hover .bento-bg,\n.bento-card-f:hover .bento-bg {\n  transform: scale(1.15)'
);
css = css.replace(
  /\.bento-card-h:hover \.bento-bg \{\n  transform: scale\(1\.06\)/g,
  '.bento-card-h:hover .bento-bg {\n  transform: scale(1.15)'
);

fs.writeFileSync('public/css/shop.css', css);

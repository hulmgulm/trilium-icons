/* this script creates a json file, which can be used as manifests for the material design icon pack */
/* all three codepoints files are the same */
const fs = require('node:fs');

const icons = { icons: {} };
const codepoints = fs.readFileSync('MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints', 'utf-8');

codepoints.matchAll(/^(.*?) (.*?)$/gms).forEach(match => {
  icons.icons[`mat_${match[1]}`] = {
    glyph: `\\${match[2]}`,
    terms: [match[1].replace(/_/g, ' ')]
  };
});

fs.writeFileSync('material.json', JSON.stringify(icons, null, 2));
console.log('material.json created successfully');


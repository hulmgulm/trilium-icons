/* this script creates several json files, which can be used as manifests for the font awesome icon packs */
const fs = require('node:fs');

const iconsBrands = { icons: {} };
const brands = fs.readFileSync('brands.css', 'utf-8');

brands.matchAll(/.fa-(.*?) {\n.*?-fa: "(.*?)";\n}/g).forEach(match => {
  iconsBrands.icons[`fa-${match[1]}`] = {
    glyph: match[2],
    terms: [match[1].replace(/-/g, ' ')]
  };
});

fs.writeFileSync('brands.json', JSON.stringify(iconsBrands, null, 2));
console.log('brands.json created successfully');

const iconsFa = { icons: {} };
const fa = fs.readFileSync('fontawesome.css', 'utf-8');

fa.matchAll(/.fa-(.*?) {\n.*?-fa: "(.*?)";\n}/g).forEach(match => {
  iconsFa.icons[`fa-${match[1]}`] = {
    glyph: match[2],
    terms: [match[1].replace(/-/g, ' ')]
  };
});

fs.writeFileSync('fontawesome.json', JSON.stringify(iconsFa, null, 2));
console.log('fontawesome.json created successfully');

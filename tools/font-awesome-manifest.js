/* this script creates several json files, which can be used as manifests for the font awesome icon packs */
const fs = require('node:fs');

const FONT_AWESOME_VERSION = '7.x';

async function downloadCss(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  return response.text();
}

async function downloadFont(url, fileName) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const destination = `${process.cwd()}/${fileName}`;
  fs.writeFileSync(destination, buffer);
  console.log(`${fileName} saved to ${destination}`);
  return destination;
}

async function buildManifest() {
  await downloadFont(`https://github.com/FortAwesome/Font-Awesome/raw/refs/heads/${FONT_AWESOME_VERSION}/webfonts/fa-brands-400.woff2`, 'fa-brands-400.woff2');

  const iconsBrands = { icons: {} };
  const brands = await downloadCss(`https://raw.githubusercontent.com/FortAwesome/Font-Awesome/refs/heads/${FONT_AWESOME_VERSION}/css/brands.css`);

  brands.matchAll(/.fa-(.*?) {\n.*?-fa: "(.*?)";\n}/g).forEach(match => {
    iconsBrands.icons[`fa-${match[1]}`] = {
      glyph: match[2],
      terms: [match[1].replace(/-/g, ' ')]
    };
  });

  fs.writeFileSync('brands.json', JSON.stringify(iconsBrands, null, 2));
  console.log('brands.json created successfully');

  await downloadFont(`https://github.com/FortAwesome/Font-Awesome/raw/refs/heads/${FONT_AWESOME_VERSION}/webfonts/fa-solid-900.woff2`, 'fa-solid-900.woff2');

  const iconsFa = { icons: {} };
  const fa = await downloadCss(`https://raw.githubusercontent.com/FortAwesome/Font-Awesome/refs/heads/${FONT_AWESOME_VERSION}/css/fontawesome.css`);

  fa.matchAll(/.fa-(.*?) {\n.*?-fa: "(.*?)";\n}/g).forEach(match => {
    iconsFa.icons[`fa-${match[1]}`] = {
      glyph: match[2],
      terms: [match[1].replace(/-/g, ' ')]
    };
  });

  fs.writeFileSync('fontawesome.json', JSON.stringify(iconsFa, null, 2));
  console.log('fontawesome.json created successfully');
}

buildManifest().catch(error => {
  console.error(error);
  process.exit(1);
});

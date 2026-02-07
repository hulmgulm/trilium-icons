/* this script creates emoji.json file, which can be used as manifest for the emoji icon pack */
const fs = require('node:fs');
const icons = { icons: {} };

fetch(`https://unicode.org/emoji/charts/full-emoji-list.html`)
  .then(async (response) => {
    const reader = response.body.getReader();
    const chunks = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      totalBytes += value.length;
      const downloadedMB = (totalBytes / 1024 / 1024).toFixed(2);
      process.stdout.write(`\rDownloaded ${downloadedMB} MB of about 8 MB`);
    }

    const buffer = Buffer.concat(chunks);
    const data = buffer.toString('utf-8');

    console.log(''); // new line after progress
    const emojis = data.matchAll(/class='chars'>([^<]*)<\/td>.*?class='name'>([^<]*)<\/td>/sg);
    emojis.forEach(emoji => {
      const name = emoji[2]
        .replace(/⊛/g, '')
        .trim()
        .replace(/ &amp; |: |:|\.| - | \(| \)|! | "|" |"|\)|'| /g, '-')
        .replace(/--/g, '-')
        .trim()
        .toLowerCase();
      icons.icons[`utf-${name}`] = {
        glyph: emoji[1],
        terms: [emoji[2]]
      };
    });
    fs.writeFileSync('emoji.json', JSON.stringify(icons, null, 2));
    console.log('emoji.json created successfully');
  })
  .catch(err => console.error('Error:', err));

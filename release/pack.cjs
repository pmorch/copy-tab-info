const { readFileSync, existsSync, mkdirSync } = require('fs');
const { parse, resolve } = require('path');
const AdmZip = require('adm-zip');

try {
  const { base } = parse(resolve(__dirname, '..'));
  const { version } = JSON.parse(
    readFileSync(resolve(__dirname, '..', 'dist', 'manifest.json'), 'utf8')
  );

  const filename = `${base}-v${version}.zip`;
  const zip = new AdmZip();
  zip.addLocalFolder('../dist');
  zip.writeZip(`${filename}`);

  console.log(
    `Success! Created release/${filename}. You can upload this file to web store.`
  );
} catch (e) {
  console.error('Error! Failed to generate a zip file:', e);
}

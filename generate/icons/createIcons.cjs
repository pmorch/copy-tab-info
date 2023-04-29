const sharp = require('sharp');
const svgfont2js = require('@ladjs/svgfont2js').default
const fs = require('fs');

const iconName = 'link'
const color = '#1467eb'
const sizes = [16, 32, 48, 64, 128]

const icons = svgfont2js(
  fs.readFileSync(
    require.resolve('font-awesome/fonts/fontawesome-webfont.svg'),
    'utf8'
  )
);

const icon = icons.filter(i => i.name == iconName)[0]

for (const size of sizes) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${icon.width} ${icon.height}">
      <path fill="${color}" d="${icon.path}"></path>
    </svg>
`
  const outFile = `${iconName}-${size}.png`
  console.log('Creating', outFile)
  sharp(Buffer.from(svg))
    .resize(size, size)
    .toFile(outFile, (err, info) => {
      if (err) {
        console.log(`Error creating ${outFile}`, err, info)
        process.exit(1)
      }
    });
}

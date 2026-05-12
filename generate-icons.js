/**
 * generate-icons.js
 * Generates all PWA icon sizes from a single source SVG.
 * Run once, or any time you update your logo.
 *
 * Usage:
 *   npm install sharp        (one-time)
 *   node generate-icons.js
 *
 * Input:  icon-source.svg  (put your logo here, ideally 512x512+)
 * Output: icons/icon-*.png
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SRC   = path.join(__dirname, 'icon-source.svg');
const DEST  = path.join(__dirname, 'icons');

if (!fs.existsSync(SRC)) {
  console.error('✗  icon-source.svg not found. Add your logo SVG first.');
  process.exit(1);
}

if (!fs.existsSync(DEST)) fs.mkdirSync(DEST);

Promise.all(
  SIZES.map(size =>
    sharp(SRC)
      .resize(size, size, { fit: 'contain', background: { r: 13, g: 13, b: 13, alpha: 1 } })
      .png()
      .toFile(path.join(DEST, `icon-${size}.png`))
      .then(() => console.log(`✓  icon-${size}.png`))
  )
).then(() => console.log('\nAll icons generated → icons/'));

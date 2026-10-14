// openrgb-sdk 0.6.0 decodes flag bitfields with Array(known.length - bits.length),
// which throws "Invalid array length" when newer OpenRGB servers set flag bits the
// SDK doesn't know about. Clamp the padding to 0. Runs automatically on npm install.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'node_modules', 'openrgb-sdk', 'dist', 'device.js');
const src = fs.readFileSync(file, 'utf8');
const fixed = src.replace(/Array\((flags(?:Array)?)\.length - flagcheck_str\.length\)/g,
    'Array(Math.max(0, $1.length - flagcheck_str.length))');

if (fixed !== src) {
    fs.writeFileSync(file, fixed);
    console.log('Patched openrgb-sdk flag decoding');
}

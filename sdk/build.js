const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function resolveBin(name) {
  const localBin = path.resolve(__dirname, 'node_modules/.bin', name);
  if (fs.existsSync(localBin)) return `"${localBin}"`;

  const cfBin = path.resolve(__dirname, '../cloudflare/node_modules/.bin', name);
  if (fs.existsSync(cfBin)) return `"${cfBin}"`;

  return `npx --yes ${name}`;
}

const esbuildCmd = resolveBin('esbuild');
const tscCmd = resolveBin('tsc');

// Ensure dist directory exists
const distDir = path.resolve(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Building UltraDemon SDK bundles...');

// 1. Build ESM (.mjs)
execSync(
  `${esbuildCmd} src/index.ts --bundle --platform=neutral --target=es2022 --format=esm --outfile=dist/index.mjs`,
  { stdio: 'inherit', cwd: __dirname }
);
console.log('ESM bundle built -> dist/index.mjs');

// 2. Build CJS (.js)
execSync(
  `${esbuildCmd} src/index.ts --bundle --platform=neutral --target=es2022 --format=cjs --outfile=dist/index.js`,
  { stdio: 'inherit', cwd: __dirname }
);
console.log('CJS bundle built -> dist/index.js');

// 3. Generate TypeScript declarations (.d.ts)
console.log('Generating TypeScript declaration files...');
execSync(
  `${tscCmd} -p tsconfig.json --emitDeclarationOnly`,
  { stdio: 'inherit', cwd: __dirname }
);
console.log('TypeScript declarations generated -> dist/index.d.ts');

console.log('UltraDemon SDK build completed successfully.');

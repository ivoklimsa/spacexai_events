import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'assets', 'favicon.ico');

if (!existsSync(src)) {
  console.error(`Missing ${src}`);
  process.exit(1);
}

// Resolve package root without relying on package.json exports.
const candidates = [
  join(root, 'node_modules', '@open-slide', 'core'),
  join(root, 'node_modules', '.pnpm'),
];

let dest = null;
const direct = join(candidates[0], 'src', 'app', 'favicon.ico');
if (existsSync(dirname(direct))) {
  dest = direct;
} else {
  // pnpm nested layout fallback via import.meta.resolve on a public export.
  try {
    const resolved = await import.meta.resolve('@open-slide/core');
    let dir = dirname(fileURLToPath(resolved));
    while (dir !== dirname(dir)) {
      const candidate = join(dir, 'src', 'app', 'favicon.ico');
      if (existsSync(dirname(candidate))) {
        dest = candidate;
        break;
      }
      dir = dirname(dir);
    }
  } catch (err) {
    console.error(err);
  }
}

if (!dest) {
  console.error('Could not locate @open-slide/core src/app/favicon.ico');
  process.exit(1);
}

copyFileSync(src, dest);
console.log(`Synced favicon → ${dest}`);

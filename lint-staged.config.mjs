import fs from 'node:fs';

/** Prettier 3 errors on explicitly passed symlink paths; skip them (targets are formatted via real paths). */
function notSymlink(file) {
  try {
    return !fs.lstatSync(file).isSymbolicLink();
  } catch {
    return false;
  }
}

export default {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{js,mjs,cjs}': ['prettier --write'],
  '*.{json,md,yml,yaml}': (files) => {
    const targets = files.filter(notSymlink);
    if (targets.length === 0) return [];
    return `prettier --write ${targets.map((f) => JSON.stringify(f)).join(' ')}`;
  },
};

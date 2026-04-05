const fs = require('fs');
const path = require('path');

const targetRoots = ['apps', 'packages'];
const componentsToMove = ['PageHeader', 'Breadcrumbs'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (
        !file.includes('node_modules') &&
        !file.includes('.git') &&
        !file.includes('dist')
      ) {
        results = results.concat(walk(file));
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

function migrateImports() {
  targetRoots.forEach((root) => {
    const rootPath = path.resolve(__dirname, '../../', root);
    if (!fs.existsSync(rootPath)) return;

    const files = walk(rootPath);

    files.forEach((file) => {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;

      // Handle simple single-line imports first
      const singleLineRegex =
        /import\s+{[^}]+}\s+from\s+['"]@gateflow\/ui['"];/g;

      content = content.replace(singleLineRegex, (match) => {
        const importStr = match.match(/{([^}]+)}/)[1];
        let imports = importStr
          .split(',')
          .map((s) => s.trim().split(/\s+/)[0])
          .filter(Boolean);

        const moved = imports.filter((i) => componentsToMove.includes(i));
        const stayed = imports.filter((i) => !componentsToMove.includes(i));

        if (moved.length === 0) return match;

        changed = true;
        let newImports = [];
        if (stayed.length > 0) {
          newImports.push(
            `import { ${stayed.join(', ')} } from '@gateflow/ui';`
          );
        }
        newImports.push(
          `import { ${moved.join(', ')} } from '@gateflow/components';`
        );

        return newImports.join('\n');
      });

      if (changed) {
        fs.writeFileSync(file, content);
        console.log(
          `Migrated: ${file.replace(path.resolve(__dirname, '../../'), '')}`
        );
      }
    });
  });
}

migrateImports();

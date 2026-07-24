const registry = require('./registry.json');

const WORKSPACE_FILES = new Set([
  'AGENTS.md',
  'CHANGELOG.md',
  'README.md',
  'package.json',
  'pnpm-lock.yaml',
  'turbo.json',
  'pnpm-workspace.yaml',
]);

const WORKSPACE_PREFIXES = [
  'docs/',
  'scripts/',
  '.agents/',
  '.antigravity/',
  '.ai/workflow-v2/',
  '.github/',
];

function appForFile(file) {
  return Object.entries(registry.apps).find(([, app]) => file.startsWith(`${app.path}/`));
}

function justificationFor(file, justifications) {
  return Object.entries(justifications || {}).find(([prefix, reason]) => (
    file.startsWith(prefix) && typeof reason === 'string' && reason.trim()
  ));
}

function validateLoopScope({
  focusedApp,
  targetType = 'app',
  files,
  sharedPackageJustifications = {},
  contractScope = null,
}) {
  const errors = [];
  const focused = registry.apps[focusedApp];
  if (!focused) return [`Unknown focused application: ${focusedApp}`];

  for (const file of files) {
    if (contractScope) {
      if (contractScope.exclude.some((prefix) => file.startsWith(prefix))) {
        errors.push(`${file} is excluded by the approved task contract`);
        continue;
      }
      if (!contractScope.include.some((prefix) => file.startsWith(prefix))) {
        errors.push(`${file} is outside the approved task contract include paths`);
        continue;
      }
    }
    const appEntry = appForFile(file);
    if (targetType === 'workspace' && file.startsWith('apps/')) {
      errors.push(`${file} is app code and cannot be changed by a workspace task`);
      continue;
    }
    if (appEntry) {
      if (appEntry[0] !== focusedApp) {
        errors.push(`${file} belongs to parked application ${appEntry[0]}`);
      }
      continue;
    }
    if (file.startsWith('apps/')) {
      errors.push(`${file} belongs to an unregistered/non-focused application`);
      continue;
    }
    if (file.startsWith('packages/')) {
      if (!justificationFor(file, sharedPackageJustifications)) {
        errors.push(`${file} is a shared package change and requires justification`);
      }
      continue;
    }
    if (
      !WORKSPACE_FILES.has(file) &&
      !WORKSPACE_PREFIXES.some((prefix) => file.startsWith(prefix))
    ) {
      errors.push(`${file} is outside the allowed focused/workspace scope`);
    }
  }
  return errors;
}

function validateOwnedFiles({ requested, preExistingDirty }) {
  const dirty = new Set(preExistingDirty || []);
  return {
    owned: requested.filter((file) => !dirty.has(file)),
    conflicts: requested.filter((file) => dirty.has(file)),
  };
}

module.exports = {
  validateLoopScope,
  validateOwnedFiles,
};

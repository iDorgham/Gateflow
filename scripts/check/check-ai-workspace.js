#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { getRepoRoot } = require('./repo-root');

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function frontmatter(file) {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.startsWith('---\n')) return {};
  const end = source.indexOf('\n---', 4);
  if (end === -1) return {};
  return Object.fromEntries(
    source
      .slice(4, end)
      .split(/\r?\n/)
      .flatMap((line) => {
        const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
        if (!match) return [];
        const value = match[2].replace(/^['"]|['"]$/g, '');
        return [
          [
            match[1],
            value === 'true' ? true : value === 'false' ? false : value,
          ],
        ];
      })
  );
}

function validateWorkspace(root) {
  const errors = [];
  const warnings = [];
  const source = path.join(root, '.agents');
  if (!fs.existsSync(source))
    return {
      valid: true,
      skipped: true,
      errors: [],
      warnings: [
        '.agents is local/gitignored in this checkout; structural validation skipped',
      ],
      counts: {},
    };

  const commandsFile = path.join(source, 'commands.json');
  if (!fs.existsSync(commandsFile))
    errors.push('missing .agents/commands.json');
  const commands = fs.existsSync(commandsFile)
    ? JSON.parse(fs.readFileSync(commandsFile, 'utf8')).commands || {}
    : {};
  for (const [name, command] of Object.entries(commands)) {
    if (!command.title || !command.description || !command.run)
      errors.push(`command ${name} is missing title, description, or run`);
    if (command.run) {
      const target = path.resolve(
        root,
        command.run.replace(/^\.antigravity/, '.agents')
      );
      const targetInSource =
        target === source || target.startsWith(`${source}${path.sep}`);
      if (!targetInSource)
        errors.push(`command ${name} points outside .agents: ${command.run}`);
      else if (!fs.existsSync(target))
        errors.push(`command ${name} points to missing ${command.run}`);
    }
  }

  const skillFiles = walk(path.join(source, 'skills')).filter(
    (file) => path.basename(file) === 'SKILL.md'
  );
  const skillNames = new Map();
  let missingSkillMetadata = 0;
  for (const file of skillFiles) {
    const meta = frontmatter(file);
    const relative = path.relative(root, file);
    if (!meta.name || !meta.description) missingSkillMetadata += 1;
    if (meta.name) {
      if (skillNames.has(meta.name))
        errors.push(
          `duplicate skill name ${meta.name}: ${skillNames.get(meta.name)} and ${relative}`
        );
      skillNames.set(meta.name, relative);
    }
  }
  if (missingSkillMetadata)
    warnings.push(
      `${missingSkillMetadata} legacy skill(s) need name/description frontmatter`
    );

  const agentFiles = walk(path.join(source, 'agents', 'workflow-v2')).filter(
    (file) => file.endsWith('.md') && path.basename(file) !== 'README.md'
  );
  const agentNames = new Set(
    agentFiles.map((file) => path.basename(file, '.md'))
  );
  for (const file of agentFiles) {
    const meta = frontmatter(file);
    const relative = path.relative(root, file);
    for (const key of [
      'name',
      'role',
      'writeAccess',
      'parallelSafe',
      'workdirLock',
      'parent',
    ]) {
      if (meta[key] === undefined || meta[key] === '')
        errors.push(`${relative} is missing ${key}`);
    }
    if (meta.name && meta.name !== path.basename(file, '.md'))
      errors.push(`${relative} name does not match filename`);
    if (meta.parent && meta.parent !== 'user' && !agentNames.has(meta.parent))
      errors.push(`${relative} points to missing parent ${meta.parent}`);
    if (meta.parallelSafe !== true && meta.parallelSafe !== false)
      errors.push(`${relative} parallelSafe must be true or false`);
    if (!['none', 'workdir', 'workspace-docs'].includes(meta.writeAccess))
      errors.push(`${relative} has invalid writeAccess ${meta.writeAccess}`);
  }

  const forbidden = walk(source).filter((file) =>
    /(^|\/)(\.DS_Store|__pycache__\/|.*\.pyc$)/.test(file)
  );
  if (forbidden.length)
    warnings.push(
      `remove ${forbidden.length} generated artifact(s) from the AI source`
    );

  return {
    valid: errors.length === 0,
    skipped: false,
    errors,
    warnings,
    counts: {
      commands: Object.keys(commands).length,
      skills: skillFiles.length,
      workflowAgents: agentFiles.length,
    },
  };
}

if (require.main === module) {
  const result = validateWorkspace(getRepoRoot(__dirname));
  if (process.argv.includes('--json'))
    console.log(JSON.stringify(result, null, 2));
  else {
    console.log(
      `AI workspace: ${result.valid ? 'valid' : 'invalid'} (${result.counts.commands || 0} commands, ${result.counts.workflowAgents || 0} agents, ${result.counts.skills || 0} skills)`
    );
    for (const warning of result.warnings) console.log(`warning: ${warning}`);
    for (const error of result.errors) console.error(`error: ${error}`);
  }
  if (!result.valid) process.exitCode = 1;
}

module.exports = { frontmatter, validateWorkspace };

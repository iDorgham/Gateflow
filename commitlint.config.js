/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Types allowed in this project
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'perf', // Performance improvement
        'refactor', // Code change, no feature/fix
        'security', // Security fix
        'test', // Tests only
        'docs', // Documentation
        'chore', // Tooling, deps, CI
        'ci', // CI/CD changes
        'build', // Build system
        'revert', // Revert a commit
        'style', // Formatting, whitespace
        'wip', // Work in progress (blocked from main via branch protection)
      ],
    ],

    // Scopes map to monorepo packages / areas
    'scope-enum': [
      1,
      'always',
      [
        // Apps
        'client',
        'admin',
        'scanner',
        'marketing',
        // Packages
        'ui',
        'db',
        'types',
        'config',
        // Cross-cutting
        'auth',
        'api',
        'qr',
        'scan',
        'team',
        'projects',
        'crm',
        'residents',
        'units',
        'contacts',
        'gates',
        'settings',
        'ai',
        'i18n',
        'rtl',
        'analytics',
        // Infra
        'ci',
        'deploy',
        'scripts',
        'deps',
        'docs',
        'release',
      ],
    ],

    'scope-case': [1, 'always', 'kebab-case'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [1, 'always', 200],
    'header-max-length': [2, 'always', 120],
  },

  // Helpful prompt when running `git commit` interactively
  prompt: {
    messages: {
      type: 'Select the type of change:',
      scope: 'What is the scope? (optional, press enter to skip):',
      subject: 'Write a short description (max 100 chars):',
      body: 'Provide a longer description (optional, press enter to skip):',
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: { description: 'A bug fix', title: 'Bug Fixes', emoji: '🐛' },
          perf: {
            description: 'Performance improvement',
            title: 'Performance',
            emoji: '⚡',
          },
          security: {
            description: 'Security fix',
            title: 'Security',
            emoji: '🔒',
          },
          refactor: {
            description: 'Code refactor without feature/fix',
            title: 'Refactoring',
            emoji: '♻️',
          },
          docs: {
            description: 'Documentation only',
            title: 'Documentation',
            emoji: '📝',
          },
          chore: {
            description: 'Tooling, deps, CI — no production code',
            title: 'Chores',
            emoji: '🔧',
          },
          test: {
            description: 'Test additions or corrections',
            title: 'Tests',
            emoji: '🧪',
          },
          ci: { description: 'CI/CD configuration', title: 'CI', emoji: '👷' },
        },
      },
    },
  },
};

module.exports = {
  extends: ['gitmoji'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'chore',
        'wip',
        // project-specific (see .cz-config.js)
        'ref',
        'pack',
        'bcode',
        'version',
        'deploy',
      ],
    ],
  },
}


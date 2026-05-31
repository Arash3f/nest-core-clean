module.exports = {
  types: [
    {
      value: ":sparkles: feat",
      name: "✨ feat:\tAdding a new feature",
    },
    {
      value: ":wrench: fix",
      name: "🔧 fix:\tFixing a bug",
    },
    {
      value: ":memo: docs",
      name: "📝 docs:\tAdd or update documentation",
    },
    {
      value: ":hammer: ref",
      name: "🔨 ref:\tRefactoring code",
    },
    {
      value: ":fire: perf",
      name: "🔥 perf:\tImproves performance",
    },
    {
      value: ":package: pack",
      name: "📦 pack:\tAdd or update compiled files or packages.",
    },
    {
      value: ":construction: wip",
      name: "🚧 wip:\tWork in progress",
    },
    {
      value: ":poop: Bcode",
      name: "💩 Bcode:\tWrite bad code that needs to be improved.",
    },
    {
      value: ":bookmark: version",
      name: "🔖 ver:\tNew Release or Version.",
    },
    {
      value: ":rocket: deploy",
      name: "🚀 depl:\tReady to deploy",
    },
  ],
  scopes: [
    { name: "global" },
    { name: "domain" },
    { name: "application" },
    { name: "infrastructure" },
    { name: "presentation" },
    { name: "cli" },
    { name: "config" },
    { name: "docs" },
    { name: "tests" },
    { name: "deps" },
  ],
  allowCustomScopes: false,
  subjectLimit: 100,
}

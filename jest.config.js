module.exports = {
  rootDir: ".",
  moduleFileExtensions: ["js", "json", "ts"],
  extensionsToTreatAsEsm: [".ts"],
  modulePaths: ["<rootDir>"],
  testMatch: ["**/*.spec.ts"],
  testEnvironment: "node",
  coverageDirectory: "./coverage",
  coverageReporters: ["html"],
  coveragePathIgnorePatterns: ["<rootDir>/src/utils"],
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest"],
  },
  moduleNameMapper: {
    "^@src/(.*)$": "src/$1",
  },
}

import { execSync } from "child_process"

/**
 * Generates Zeus GraphQL client from schema.gql into tests/utils/graphql.
 * Run after the app has written schema.gql (start:dev once).
 */
execSync("node scripts/zeus-generate.mjs", { stdio: "inherit" })

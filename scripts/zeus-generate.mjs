import { CLI } from "graphql-zeus/lib/CLIClass.js"

await CLI.execute({ _: ["schema.gql", "./tests/utils/graphql"], node: true })

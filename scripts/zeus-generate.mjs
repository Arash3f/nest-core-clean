import { CLI } from "graphql-zeus/lib/CLIClass.js"
import { readdir, readFile, writeFile } from "fs/promises"
import { join } from "path"

await CLI.execute({ _: ["schema.gql", "./tests/utils/graphql"], node: true })

/** Zeus on Windows can emit CR before `;`, which breaks TypeScript comments. Normalize to LF. */
const outDir = join(process.cwd(), "tests/utils/graphql/zeus")
for (const name of await readdir(outDir)) {
  if (!name.endsWith(".ts")) continue
  const path = join(outDir, name)
  let text = await readFile(path, "utf8")
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  text = text.replace(/\/\/ (-+)\n\t?;/g, "// ------------------------------------------------------;")
  text = text.replace(
    /\/\/ THIS FILE WAS AUTOMATICALLY GENERATED \(DO NOT MODIFY\)\n\t?;/g,
    "// THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY);",
  )
  await writeFile(path, text, "utf8")
}

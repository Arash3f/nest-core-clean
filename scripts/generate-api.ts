import { Logger } from "@nestjs/common"
import { exec } from "child_process"
import { promisify } from "util"

/**
 * ? prepare async promis exec
 */
const execAsync = promisify(exec)

/**
 * To update Swagger Api file, we use (pnpm run api) and make this function to run
 * @see https://github.com/acacode/swagger-typescript-api
 */
async function generateSwagger() {
  const serverAddress = `http://${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`

  const schemaPath = `${serverAddress}/${process.env.SWAGGER_DOCS_PATH}`
  const outputPath = "swagger"
  const command = `npx swagger-typescript-api generate -p ${schemaPath} -o ${outputPath} --axios`
  const { stderr, stdout } = await execAsync(command)
  Logger.verbose(stdout)
  if (stderr) {
    Logger.error(stderr)
  }
}

void generateSwagger()

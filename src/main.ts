import { NodeEnv } from "@infrastructure/config/env.types"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import type { NestExpressApplication } from "@nestjs/platform-express"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { CoreExceptionFilter } from "@presentation/http/common/filters/core-exception.filter"
import type { Request } from "express"
import type { ServerResponse } from "http"
import { AppModule } from "src/app.module"

interface HotModule {
  hot: {
    accept: () => void
    dispose: (callback: () => Promise<void> | void) => void
  }
}
declare const module: HotModule

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(EnvConfigService)

  setupGlobalValidation(app, configService)
  setupSwagger(app, configService)
  setupCors(app)
  setupLogger(app, configService)

  app.set("trust proxy", 1)

  await app.listen(configService.serverPort, configService.serverAddress)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  return app
}

function setupLogger(app: NestExpressApplication, configService: EnvConfigService) {
  app.useLogger(
    configService.nodeEnv === NodeEnv.Development
      ? ["log", "debug", "error", "verbose", "warn"]
      : ["error", "warn"],
  )
}

function setupSwagger(app: NestExpressApplication, configService: EnvConfigService) {
  const config = new DocumentBuilder()
    .setTitle("My Project APIs")
    .setDescription("The Project APIs description")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup(configService.swaggerPath, app, document)

  app.use(`/${configService.swaggerDocsPath}`, (_req: Request, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(document))
  })

  return document
}

function setupCors(app: NestExpressApplication) {
  app.enableCors()
}

function setupGlobalValidation(app: NestExpressApplication, configService: EnvConfigService) {
  app.useGlobalFilters(new CoreExceptionFilter(configService))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
}

void bootstrap()

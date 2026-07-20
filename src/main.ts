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

/**
 * Webpack Hot Module Replacement (HMR) contract for Node.js bundles.
 *
 * @remarks
 * When HMR is enabled, Webpack injects a `module.hot` object that can:
 * - accept updated modules without restarting the process
 * - run cleanup logic before replacing the current module
 */
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
  setupCors(app, configService)
  setupLogger(app, configService)

  /**
   * Trust the first proxy hop.
   *
   * @remarks
   * Useful when running behind a reverse proxy (e.g., Nginx) so that
   * `req.ip` and related fields can be resolved correctly.
   */
  app.set("trust proxy", 1)

  await app.listen(configService.serverPort, configService.serverAddress)

  /**
   * HMR support (development only).
   */
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  return app
}

/**
 * Configures NestJS logger levels based on the runtime environment.
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 *
 * @remarks
 * - Development: enables detailed logs.
 * - Other environments: restricts output to warnings/errors.
 */
function setupLogger(app: NestExpressApplication, configService: EnvConfigService) {
  app.useLogger(
    configService.nodeEnv === NodeEnv.Development
      ? ["log", "debug", "error", "verbose", "warn"]
      : ["error", "warn"],
  )
}

/**
 * Configures Swagger (OpenAPI) for the application.
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 *
 * @remarks
 * Exposes:
 * - Swagger UI at `configService.swaggerPath`
 * - Raw OpenAPI JSON at `/{configService.swaggerDocsPath}`
 *
 * @returns The generated OpenAPI document.
 */
function setupSwagger(app: NestExpressApplication, configService: EnvConfigService) {
  if (configService.isProduction) {
    return undefined
  }

  const config = new DocumentBuilder()
    .setTitle("NestJS Core Clean")
    .setDescription("Clean Architecture NestJS starter with REST and GraphQL")
    .setVersion("1.0.0")
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

/**
 * Enables Cross-Origin Resource Sharing (CORS).
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 */
function setupCors(app: NestExpressApplication, configService: EnvConfigService) {
  const origins = configService.corsOrigins

  if (origins.length === 1 && origins[0] === "*") {
    app.enableCors()
    return
  }

  app.enableCors({ origin: origins, credentials: true })
}

/**
 * Applies global validation pipeline and exception filter.
 *
 * @param app - NestJS application instance.
 * @param configService - Configuration provider.
 *
 * @remarks
 * - `transform: true` converts input payloads to DTO instances/types.
 * - `whitelist: true` removes unknown properties not present on the DTO.
 * - `forbidNonWhitelisted: true` rejects unknown properties with a 400.
 */
function setupGlobalValidation(app: NestExpressApplication, configService: EnvConfigService) {
  app.useGlobalFilters(new CoreExceptionFilter(configService))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
}

void bootstrap()

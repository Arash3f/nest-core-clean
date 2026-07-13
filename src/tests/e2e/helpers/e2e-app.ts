import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import type { INestApplication } from "@nestjs/common"
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import type { NestExpressApplication } from "@nestjs/platform-express"
import { CoreExceptionFilter } from "@presentation/http/common/filters/core-exception.filter"
import { AppModule } from "@src/app.module"

export interface E2eContext {
  app: INestApplication
  prisma: PrismaService
  apiConfig: EnvConfigService
}

/**
 * Boots the full AppModule for HTTP e2e tests (mirrors main.ts globals).
 * TokenGuard is already registered via APP_GUARD in AppModule.
 */
export async function createE2eApp(): Promise<E2eContext> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false })

  const apiConfig = app.get(EnvConfigService)
  const prisma = app.get(PrismaService)

  app.useGlobalFilters(new CoreExceptionFilter(apiConfig))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.set("trust proxy", 1)
  await app.listen(apiConfig.serverPort, apiConfig.serverAddress)

  return { app, prisma, apiConfig }
}

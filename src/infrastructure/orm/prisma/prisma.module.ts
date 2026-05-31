import { EnvConfigModule } from "@infrastructure/config/env-config.module"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { PRISMA_SERVICE } from "@infrastructure/orm/prisma/prisma.tokens"
import { Module } from "@nestjs/common"

@Module({
  exports: [PrismaService, PRISMA_SERVICE],
  imports: [EnvConfigModule],
  providers: [PrismaService, { provide: PRISMA_SERVICE, useExisting: PrismaService }],
})
export class PrismaModule {}

import { PrismaModule } from "@infrastructure/orm/prisma/prisma.module"
import { Module } from "@nestjs/common"
import { HealthController } from "@presentation/http/modules/health/health.controller"

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
})
export class HealthHttpModule {}

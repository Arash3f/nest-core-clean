import { AuthInfrastructureModule } from "@infrastructure/adapters/auth/auth-infrastructure.module"
import { UserInfrastructureModule } from "@infrastructure/adapters/user/user-infrastructure.module"
import { SeedService } from "@infrastructure/bootstrap/seed.service"
import { EnvConfigModule } from "@infrastructure/config/env-config.module"
import { PrismaModule } from "@infrastructure/orm/prisma/prisma.module"
import { Module } from "@nestjs/common"

@Module({
  imports: [PrismaModule, EnvConfigModule, AuthInfrastructureModule, UserInfrastructureModule],
  providers: [SeedService],
  exports: [PrismaModule, EnvConfigModule, AuthInfrastructureModule, UserInfrastructureModule],
})
export class InfrastructureModule {}

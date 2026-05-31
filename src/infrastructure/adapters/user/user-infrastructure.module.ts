import { USER_REPOSITORY_PORT } from "@domain/user/ports/user-repository.port"
import { PrismaUsersRepository } from "@infrastructure/adapters/user/user.repository.adapter"
import { PrismaModule } from "@infrastructure/orm/prisma/prisma.module"
import { Module } from "@nestjs/common"

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [USER_REPOSITORY_PORT],
})
export class UserInfrastructureModule {}

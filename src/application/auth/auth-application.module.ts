import { LoginUseCase } from "@application/auth/use-cases/login/login.usecase"
import { LOGIN_USE_CASE } from "@application/auth/use-cases/login/login-usecase.port"
import { AuthInfrastructureModule } from "@infrastructure/adapters/auth/auth-infrastructure.module"
import { UserInfrastructureModule } from "@infrastructure/adapters/user/user-infrastructure.module"
import { Module } from "@nestjs/common"

@Module({
  imports: [AuthInfrastructureModule, UserInfrastructureModule],
  providers: [
    LoginUseCase,
    {
      provide: LOGIN_USE_CASE,
      useExisting: LoginUseCase,
    },
  ],
  exports: [LOGIN_USE_CASE],
})
export class AuthApplicationModule {}

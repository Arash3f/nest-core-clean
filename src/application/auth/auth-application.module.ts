import { ChangeMyPasswordUseCase } from "@application/auth/use-cases/change-my-password/change-my-password.usecase"
import { CHANGE_MY_PASSWORD_USE_CASE } from "@application/auth/use-cases/change-my-password/change-my-password-usecase.port"
import { LoginUseCase } from "@application/auth/use-cases/login/login.usecase"
import { LOGIN_USE_CASE } from "@application/auth/use-cases/login/login-usecase.port"
import { LogoutUseCase } from "@application/auth/use-cases/logout/logout.usecase"
import { LOGOUT_USE_CASE } from "@application/auth/use-cases/logout/logout-usecase.port"
import { RefreshTokenUseCase } from "@application/auth/use-cases/refresh-token/refresh-token.usecase"
import { REFRESH_TOKEN_USE_CASE } from "@application/auth/use-cases/refresh-token/refresh-token-usecase.port"
import { RegisterUseCase } from "@application/auth/use-cases/register/register.usecase"
import { REGISTER_USE_CASE } from "@application/auth/use-cases/register/register-usecase.port"
import { AuthInfrastructureModule } from "@infrastructure/adapters/auth/auth-infrastructure.module"
import { UserInfrastructureModule } from "@infrastructure/adapters/user/user-infrastructure.module"
import { Module } from "@nestjs/common"

@Module({
  imports: [AuthInfrastructureModule, UserInfrastructureModule],
  providers: [
    LoginUseCase,
    { provide: LOGIN_USE_CASE, useExisting: LoginUseCase },

    RegisterUseCase,
    { provide: REGISTER_USE_CASE, useExisting: RegisterUseCase },

    LogoutUseCase,
    { provide: LOGOUT_USE_CASE, useExisting: LogoutUseCase },

    RefreshTokenUseCase,
    { provide: REFRESH_TOKEN_USE_CASE, useExisting: RefreshTokenUseCase },

    ChangeMyPasswordUseCase,
    { provide: CHANGE_MY_PASSWORD_USE_CASE, useExisting: ChangeMyPasswordUseCase },
  ],
  exports: [
    LOGIN_USE_CASE,
    REGISTER_USE_CASE,
    LOGOUT_USE_CASE,
    REFRESH_TOKEN_USE_CASE,
    CHANGE_MY_PASSWORD_USE_CASE,
  ],
})
export class AuthApplicationModule {}

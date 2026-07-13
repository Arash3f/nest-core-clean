import {
  CHANGE_MY_PASSWORD_USE_CASE,
  ChangeMyPasswordUseCasePort,
} from "@application/auth/use-cases/change-my-password/change-my-password-usecase.port"
import {
  LOGIN_USE_CASE,
  LoginUseCasePort,
} from "@application/auth/use-cases/login/login-usecase.port"
import {
  LOGOUT_USE_CASE,
  LogoutUseCasePort,
} from "@application/auth/use-cases/logout/logout-usecase.port"
import {
  REFRESH_TOKEN_USE_CASE,
  RefreshTokenUseCasePort,
} from "@application/auth/use-cases/refresh-token/refresh-token-usecase.port"
import {
  REGISTER_USE_CASE,
  RegisterUseCasePort,
} from "@application/auth/use-cases/register/register-usecase.port"
import {
  CHANGE_PASSWORD_USER_USE_CASE,
  ChangePasswordUseCasePort,
} from "@application/user/use-cases/change-password/change-password-usecase.port"
import { Inject, UseGuards } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { Throttle } from "@nestjs/throttler"
import { IdDto } from "@presentation/graphql/common/dto/id.dto"
import { SuccessDto } from "@presentation/graphql/common/dto/success.dto"
import { ChangeMyPasswordRequestDto } from "@presentation/graphql/modules/auth/dto/change-my-password-request.dto"
import { ChangePasswordRequestDto } from "@presentation/graphql/modules/auth/dto/change-password-request.dto"
import { LoginRequestDto } from "@presentation/graphql/modules/auth/dto/login-request.dto"
import { LoginResponseDto } from "@presentation/graphql/modules/auth/dto/login-response.dto"
import { RefreshTokenRequestDto } from "@presentation/graphql/modules/auth/dto/refresh-token-request.dto"
import { RegisterRequestDto } from "@presentation/graphql/modules/auth/dto/register-request.dto"
import { GetDeviceFingerprint } from "@presentation/http/common/decorators/get-device-fingerprint.decorator"
import { GetUserId } from "@presentation/http/common/decorators/get-user-id.decorator"
import { GqlThrottlerGuard } from "@presentation/http/common/guards/gql-throttler.guard"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"
import { IsLoggedInGuard } from "@presentation/http/common/guards/is-logged-in.guard"

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCasePort,

    @Inject(REGISTER_USE_CASE)
    private readonly registerUseCase: RegisterUseCasePort,

    @Inject(LOGOUT_USE_CASE)
    private readonly logoutUseCase: LogoutUseCasePort,

    @Inject(REFRESH_TOKEN_USE_CASE)
    private readonly refreshTokenUseCase: RefreshTokenUseCasePort,

    @Inject(CHANGE_PASSWORD_USER_USE_CASE)
    private readonly changePasswordUseCase: ChangePasswordUseCasePort,

    @Inject(CHANGE_MY_PASSWORD_USE_CASE)
    private readonly changeMyPasswordUseCase: ChangeMyPasswordUseCasePort,
  ) {}

  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async logIn(
    @Args("data") data: LoginRequestDto,
    @GetDeviceFingerprint() deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute({ ...data, deviceId })
  }

  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async register(
    @Args("data") data: RegisterRequestDto,
    @GetDeviceFingerprint() deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.registerUseCase.execute({ ...data, deviceId })
  }

  @Mutation(() => SuccessDto)
  @UseGuards(IsLoggedInGuard)
  async logout(@GetUserId() requesterId: string): Promise<SuccessDto> {
    return await this.logoutUseCase.execute({ id: requesterId })
  }

  @Mutation(() => SuccessDto)
  @UseGuards(IsAdminGuard)
  async changePassword(
    @Args("data") data: ChangePasswordRequestDto,
    @Args("where") where: IdDto,
  ): Promise<SuccessDto> {
    return await this.changePasswordUseCase.execute({ where, data })
  }

  @Mutation(() => SuccessDto)
  @UseGuards(IsLoggedInGuard)
  async changeMyPassword(
    @GetUserId() requesterId: string,
    @Args("data") data: ChangeMyPasswordRequestDto,
  ): Promise<SuccessDto> {
    return await this.changeMyPasswordUseCase.execute({
      userId: requesterId,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlThrottlerGuard)
  async refreshToken(
    @Args("data") data: RefreshTokenRequestDto,
    @GetDeviceFingerprint() deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.refreshTokenUseCase.execute({
      refreshToken: data.refreshToken,
      deviceId,
    })
  }
}

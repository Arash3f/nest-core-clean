import {
  LOGIN_USE_CASE,
  LoginUseCasePort,
} from "@application/auth/use-cases/login/login-usecase.port"
import {
  CHANGE_PASSWORD_USER_USE_CASE,
  ChangePasswordUseCasePort,
} from "@application/user/use-cases/change-password/change-password-usecase.port"
import { Inject, UseGuards } from "@nestjs/common"
import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { IdDto } from "@presentation/graphql/common/dto/id.dto"
import { SuccessDto } from "@presentation/graphql/common/dto/success.dto"
import { ChangePasswordRequestDto } from "@presentation/graphql/modules/auth/dto/change-password-request.dto"
import { LoginRequestDto } from "@presentation/graphql/modules/auth/dto/login-request.dto"
import { LoginResponseDto } from "@presentation/graphql/modules/auth/dto/login-response.dto"
import { GetDeviceFingerprint } from "@presentation/http/common/decorators/get-device-fingerprint.decorator"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCasePort,

    @Inject(CHANGE_PASSWORD_USER_USE_CASE)
    private readonly changePasswordUseCase: ChangePasswordUseCasePort,
  ) {}

  /**
   * Login a user with username/password.
   */
  @Mutation(() => LoginResponseDto)
  async logIn(
    @Args("data") data: LoginRequestDto,
    @GetDeviceFingerprint() _deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute({ ...data })
  }

  /**
   * Admin-only: reset any user's password by id.
   */
  @Mutation(() => SuccessDto)
  @UseGuards(IsAdminGuard)
  async changePassword(
    @Args("data") data: ChangePasswordRequestDto,
    @Args("where") where: IdDto,
  ): Promise<SuccessDto> {
    return await this.changePasswordUseCase.execute({ where, data })
  }
}

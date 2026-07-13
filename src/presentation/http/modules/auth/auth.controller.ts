import {
  LOGIN_USE_CASE,
  LoginUseCasePort,
} from "@application/auth/use-cases/login/login-usecase.port"
import {
  CHANGE_PASSWORD_USER_USE_CASE,
  ChangePasswordUseCasePort,
} from "@application/user/use-cases/change-password/change-password-usecase.port"
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import { Body, Controller, Inject, Patch, Post, UseGuards } from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { apiErrorResponses } from "@presentation/http/common/decorators/api-error-response.decorator"
import { GetDeviceFingerprint } from "@presentation/http/common/decorators/get-device-fingerprint.decorator"
import { SuccessDto } from "@presentation/http/common/dto/success.dto"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"
import { ChangePasswordRequestDto } from "@presentation/http/modules/auth/dto/change-password-request.dto"
import { LoginRequestDto } from "@presentation/http/modules/auth/dto/login-request.dto"
import { LoginResponseDto } from "@presentation/http/modules/auth/dto/login-response.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCasePort,

    @Inject(CHANGE_PASSWORD_USER_USE_CASE)
    private readonly changePasswordUseCase: ChangePasswordUseCasePort,
  ) {}

  @Post("logIn")
  @ApiOperation({
    operationId: "logIn",
    summary: "Login user",
  })
  @ApiBody({ type: LoginRequestDto })
  @apiErrorResponses([AuthErrors.IncorrectUsernameOrPassword])
  @ApiResponse({ type: LoginResponseDto })
  async logIn(
    @Body() data: LoginRequestDto,
    @GetDeviceFingerprint() _deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute({
      ...data,
    })
  }

  @Patch("changePassword")
  @ApiOperation({
    operationId: "changePassword",
    summary: "Update user password",
  })
  @ApiBody({ type: ChangePasswordRequestDto })
  @ApiResponse({ type: SuccessDto, status: 200 })
  @apiErrorResponses([UserErrors.UserNotFound])
  @UseGuards(IsAdminGuard)
  async changePassword(@Body() data: ChangePasswordRequestDto): Promise<SuccessDto> {
    return await this.changePasswordUseCase.execute(data)
  }
}

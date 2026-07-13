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
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ThrottlerGuard } from "@nestjs/throttler"
import { apiErrorResponses } from "@presentation/http/common/decorators/api-error-response.decorator"
import { GetDeviceFingerprint } from "@presentation/http/common/decorators/get-device-fingerprint.decorator"
import { GetUserId } from "@presentation/http/common/decorators/get-user-id.decorator"
import { SuccessDto } from "@presentation/http/common/dto/success.dto"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"
import { IsLoggedInGuard } from "@presentation/http/common/guards/is-logged-in.guard"
import { ChangeMyPasswordRequestDto } from "@presentation/http/modules/auth/dto/change-my-password-request.dto"
import { ChangePasswordRequestDto } from "@presentation/http/modules/auth/dto/change-password-request.dto"
import { LoginRequestDto } from "@presentation/http/modules/auth/dto/login-request.dto"
import { LoginResponseDto } from "@presentation/http/modules/auth/dto/login-response.dto"
import { RefreshTokenRequestDto } from "@presentation/http/modules/auth/dto/refresh-token-request.dto"
import { RegisterRequestDto } from "@presentation/http/modules/auth/dto/register-request.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
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

  @Post("logIn")
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    operationId: "logIn",
    summary: "Login user",
  })
  @ApiBody({ type: LoginRequestDto })
  @apiErrorResponses([AuthErrors.IncorrectUsernameOrPassword, AuthErrors.InactiveUser])
  @ApiResponse({ type: LoginResponseDto })
  async logIn(
    @Body() data: LoginRequestDto,
    @GetDeviceFingerprint() deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute({
      ...data,
      deviceId,
    })
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    operationId: "register",
    summary: "Register a new member account",
    description:
      "Public self-registration. Always creates a Member and returns tokens (auto-login).",
  })
  @ApiBody({ type: RegisterRequestDto })
  @apiErrorResponses([UserErrors.UsernameIsDuplicated])
  @ApiResponse({ type: LoginResponseDto, status: 201 })
  async register(
    @Body() data: RegisterRequestDto,
    @GetDeviceFingerprint() deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.registerUseCase.execute({
      ...data,
      deviceId,
    })
  }

  @Post("logout")
  @ApiOperation({
    operationId: "logout",
    summary: "logout user",
  })
  @ApiResponse({ type: SuccessDto })
  @UseGuards(IsLoggedInGuard)
  async logout(@GetUserId() currentUserId: string): Promise<SuccessDto> {
    return await this.logoutUseCase.execute({ id: currentUserId })
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

  @Patch("changeMyPassword")
  @ApiOperation({
    operationId: "changeMyPassword",
    summary: "Change own password",
  })
  @ApiBody({ type: ChangeMyPasswordRequestDto })
  @ApiResponse({ type: SuccessDto, status: 200 })
  @apiErrorResponses([UserErrors.UserNotFound, AuthErrors.IncorrectCurrentPassword])
  @UseGuards(IsLoggedInGuard)
  async changeMyPassword(
    @GetUserId() userId: string,
    @Body() data: ChangeMyPasswordRequestDto,
  ): Promise<SuccessDto> {
    return await this.changeMyPasswordUseCase.execute({
      userId,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  @Post("refreshToken")
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    operationId: "refreshToken",
    summary: "refresh token",
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({ type: LoginResponseDto, status: 201 })
  @apiErrorResponses([
    AuthErrors.UserIsNotAuthorized,
    AuthErrors.DeviceMismatch,
    AuthErrors.InValidRefreshToken,
  ])
  async refresh(
    @Body() input: RefreshTokenRequestDto,
    @GetDeviceFingerprint() deviceId: string,
  ): Promise<LoginResponseDto> {
    return await this.refreshTokenUseCase.execute({
      refreshToken: input.refreshToken,
      deviceId,
    })
  }
}

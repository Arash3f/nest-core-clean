import {
  LOGIN_USE_CASE,
  LoginUseCasePort,
} from "@application/auth/use-cases/login/login-usecase.port"
import { Body, Controller, Post } from "@nestjs/common"
import { Inject } from "@nestjs/common"
import { LoginRequestDto } from "@presentation/http/modules/auth/dto/login-request.dto"
import { LoginResponseDto } from "@presentation/http/modules/auth/dto/login-response.dto"

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCasePort,
  ) {}

  @Post("login")
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute({
      ...loginDto,
    })
  }
}

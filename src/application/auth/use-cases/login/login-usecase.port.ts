import type { LoginInput } from "@application/auth/use-cases/login/login.input"
import type { LoginOutput } from "@application/auth/use-cases/login/login.output"

export const LOGIN_USE_CASE = Symbol("LOGIN_USE_CASE")

export interface LoginUseCasePort {
  execute(input: LoginInput): Promise<LoginOutput>
}

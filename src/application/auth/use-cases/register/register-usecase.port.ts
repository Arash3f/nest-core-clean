import type { LoginOutput } from "@application/auth/use-cases/login/login.output"
import type { RegisterInput } from "@application/auth/use-cases/register/register.input"

export const REGISTER_USE_CASE = Symbol("REGISTER_USE_CASE")

export interface RegisterUseCasePort {
  execute(input: RegisterInput): Promise<LoginOutput>
}

import type { PasswordHasherPort } from "@domain/auth/ports/password-hasher.port"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { Injectable } from "@nestjs/common"
import * as argon2 from "argon2"

@Injectable()
export class Argon2PasswordHasherAdapter implements PasswordHasherPort {
  constructor(private readonly env: EnvConfigService) {
    this.env = env
  }

  async hash(plain: string): Promise<string> {
    return argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: this.env.memoryCost,
      timeCost: this.env.timeCost,
      parallelism: this.env.parallelism,
    })
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain)
    } catch {
      return false
    }
  }
}

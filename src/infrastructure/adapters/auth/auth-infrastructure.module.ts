import { TOKEN_SERVICE_PORT } from "@application/auth/ports/token-service.port"
import { PASSWORD_HASHER_PORT } from "@domain/auth/ports/password-hasher.port"
import { Argon2PasswordHasherAdapter } from "@infrastructure/adapters/auth/password-hasher.adapter"
import { JwtTokenServiceAdapter } from "@infrastructure/adapters/auth/token-service.adapter"
import { EnvConfigModule } from "@infrastructure/config/env-config.module"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"

@Module({
  imports: [
    EnvConfigModule,
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: (env: EnvConfigService) => ({
        secret: env.jwtSecret,
        signOptions: { expiresIn: env.jwtAccessExpire },
      }),
    }),
  ],
  providers: [
    { provide: TOKEN_SERVICE_PORT, useClass: JwtTokenServiceAdapter },
    { provide: PASSWORD_HASHER_PORT, useClass: Argon2PasswordHasherAdapter },
  ],
  exports: [TOKEN_SERVICE_PORT, PASSWORD_HASHER_PORT, JwtModule],
})
export class AuthInfrastructureModule {}

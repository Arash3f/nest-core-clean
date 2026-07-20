import { ConfigUser, DatabaseConfig, NodeEnv } from "@infrastructure/config/env.types"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): NodeEnv {
    return this.configService.get<NodeEnv>("NODE_ENV", NodeEnv.Development)
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === NodeEnv.Development
  }

  get isProduction(): boolean {
    return this.nodeEnv === NodeEnv.Production
  }

  get isTest(): boolean {
    return this.nodeEnv === NodeEnv.Test
  }

  get serverPort(): number {
    return Number(this.configService.get<number>("SERVER_PORT", 3000))
  }

  get swaggerDocsPath(): string {
    return this.configService.get<string>("SWAGGER_DOCS_PATH", "docs")
  }

  get swaggerPath(): string {
    return this.configService.get<string>("SWAGGER_PATH", "/swagger")
  }

  get corsOrigins(): string[] {
    const raw: string = this.configService.getOrThrow("CORS_ORIGINS")
    return raw
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  }

  get jwtSecret(): string {
    return this.configService.get<string>("JWT_SECRET") as string
  }

  get jwtAccessExpire(): number {
    return Number(this.configService.get<number>("jwtAccessExpire", 3600))
  }

  get jwtRefreshExpire(): number {
    return Number(this.configService.get<number>("jwtRefreshExpire", 3600))
  }

  get serverAddress(): string {
    return this.configService.get<string>("SERVER_ADDRESS") as string
  }

  get uploadDir(): string {
    return this.configService.get<string>("UPLOAD_DIR") as string
  }

  get memoryCost(): number {
    return this.configService.get<number>("PASSWORD_HASH_MEMORY_COST") as number
  }

  get timeCost(): number {
    return this.configService.get<number>("PASSWORD_HASH_TIME_COST") as number
  }

  get parallelism(): number {
    return this.configService.get<number>("PASSWORD_HASH_PARALLELISM") as number
  }

  get database(): DatabaseConfig {
    return {
      connectionUrl: this.configService.get<string>("DATABASE_CONNECTION_URL") as string,
      name: this.configService.get<string>("DATABASE_NAME") as string,
      username: this.configService.get<string>("DATABASE_USERNAME") as string,
      password: this.configService.get<string>("DATABASE_PASSWORD") as string,
      port: this.configService.get<string>("DATABASE_PORT") as string,
      host: this.configService.get<string>("DATABASE_HOST") as string,
    }
  }

  get seedOnBoot(): boolean {
    return this.configService.get<boolean>("SEED_ON_BOOT") as boolean
  }

  get superUser(): ConfigUser {
    return {
      name: this.configService.get<string>("SUPER_USER_NAME") as string,
      username: this.configService.get<string>("SUPER_USER_USERNAME") as string,
      password: this.configService.get<string>("SUPER_USER_PASSWORD") as string,
    }
  }

  get memberUser(): ConfigUser | null {
    const username = this.configService.get<string>("MEMBER_USER_USERNAME")
    const name = this.configService.get<string>("MEMBER_USER_NAME")
    const password = this.configService.get<string>("MEMBER_USER_PASSWORD")

    if (!username || !name || !password) return null

    return {
      name,
      username,
      password,
    }
  }

  /** Alias used by e2e helpers (matches REST/GraphQL naming). */
  get defaultSuperUser(): ConfigUser {
    return this.superUser
  }

  /** Alias used by e2e helpers (matches REST/GraphQL naming). */
  get defaultMemberUser(): ConfigUser {
    const member = this.memberUser
    if (!member) {
      throw new Error("MEMBER_USER_* env vars are required in this environment")
    }
    return member
  }

  get throttleTtlMs(): number {
    return Number(this.configService.get<number>("THROTTLE_TTL_MS", 60_000))
  }

  get throttleLimit(): number {
    return Number(this.configService.get<number>("THROTTLE_LIMIT", 10))
  }
}

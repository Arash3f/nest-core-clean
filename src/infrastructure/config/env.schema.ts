import { NodeEnv } from "@infrastructure/config/env.types"
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class EnvSchema {
  @IsString()
  SWAGGER_DOCS_PATH: string

  @IsString()
  SWAGGER_PATH: string

  @IsNumber()
  SERVER_PORT: number

  @IsString()
  JWT_SECRET: string

  @IsNumber()
  jwtAccessExpire: number

  @IsNumber()
  jwtRefreshExpire: number

  @IsString()
  DATABASE_CONNECTION_URL: string

  @IsString()
  SERVER_ADDRESS: string

  @IsString()
  DATABASE_NAME: string

  @IsString()
  DATABASE_USERNAME: string

  @IsString()
  DATABASE_PASSWORD: string

  @IsString()
  DATABASE_PORT: string

  @IsString()
  DATABASE_HOST: string

  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv

  @IsBoolean()
  SEED_ON_BOOT: boolean

  @IsString()
  SUPER_USER_USERNAME: string

  @IsString()
  SUPER_USER_NAME: string

  @IsString()
  SUPER_USER_PASSWORD: string

  @IsOptional()
  @IsString()
  MEMBER_USER_USERNAME?: string

  @IsOptional()
  @IsString()
  MEMBER_USER_NAME?: string

  @IsOptional()
  @IsString()
  MEMBER_USER_PASSWORD?: string

  @IsString()
  UPLOAD_DIR: string

  @IsNumber()
  PASSWORD_HASH_MEMORY_COST: number

  @IsNumber()
  PASSWORD_HASH_TIME_COST: number

  @IsNumber()
  PASSWORD_HASH_PARALLELISM: number

  @IsNumber()
  THROTTLE_TTL_MS: number

  @IsNumber()
  THROTTLE_LIMIT: number
}

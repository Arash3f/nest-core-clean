import { Role } from "@domain/common/value-objects/role.value-object"
import type { EnvConfigService } from "@infrastructure/config/env-config.service"
import type { PrismaClient } from "@prisma/client"
import * as argon2 from "argon2"

import type { GraphQLResponse } from "../../../utils/graphql/zeus"
import { Chain } from "../../../utils/graphql/zeus"

export interface GraphqlErrorBody {
  code?: number | string
  module?: string
  message?: string
  persianTranslation?: string
  statusCode?: number
  [key: string]: unknown
}

export function extractGraphqlError(err: unknown): GraphqlErrorBody | undefined {
  if (typeof err === "string") return { message: err }

  const obj = err as { response?: GraphQLResponse; errors?: unknown[] }
  const response = obj?.response ?? obj
  const first = (
    response?.errors as Array<{ extensions?: GraphqlErrorBody; message?: string }> | undefined
  )?.[0]

  if (first) return { message: first.message, ...first.extensions }
  if (err instanceof Error) return { message: err.message }
  return undefined
}

export interface RequestOptions {
  headers?: Record<string, string>
}

export const TOKENS_SELECTION = { accessToken: true, refreshToken: true } as const
export const SUCCESS_SELECTION = { success: true } as const
export const USER_SELECTION = {
  id: true,
  name: true,
  username: true,
  active: true,
  role: true,
} as const

/**
 * GraphQL e2e helper via Zeus + Prisma seed/reset.
 */
export class GraphqlTestApiCaller {
  private apiConfigService: EnvConfigService
  private prisma: PrismaClient
  private url = ""
  private accessToken: string | null = null
  private userAgent = "e2e-test-runner/1.0"

  gql(opts: RequestOptions = {}) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": this.userAgent,
      ...opts.headers,
    }
    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    }
    return Chain(this.url, { headers })
  }

  get query() {
    return this.gql()("query")
  }

  get mutation() {
    return this.gql()("mutation")
  }

  setApiConfig(apiConfigService: EnvConfigService) {
    this.apiConfigService = apiConfigService
    this.url = `http://127.0.0.1:${apiConfigService.serverPort}/graphql`
  }

  setPrismaClient(prisma: PrismaClient) {
    this.prisma = prisma
  }

  private setAuthToken(accessToken: string | null) {
    this.accessToken = accessToken
  }

  async setAdminMode() {
    await this.loginAs(
      this.apiConfigService.defaultSuperUser.username,
      this.apiConfigService.defaultSuperUser.password,
    )
  }

  async setMemberMode() {
    await this.loginAs(
      this.apiConfigService.defaultMemberUser.username,
      this.apiConfigService.defaultMemberUser.password,
    )
  }

  setAnonymousMode() {
    this.setAuthToken(null)
  }

  async loginAs(username: string, password: string) {
    this.setAnonymousMode()
    const { logIn } = await this.mutation({
      logIn: [{ data: { username, password } }, TOKENS_SELECTION],
    })
    this.setAuthToken(logIn.accessToken)
  }

  async resetDatabase() {
    const rows = await this.prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
    `
    const tables = rows.map((r) => `"public"."${r.tablename}"`).join(", ")
    if (tables) {
      await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`)
    }
  }

  private hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: this.apiConfigService.memoryCost,
      timeCost: this.apiConfigService.timeCost,
      parallelism: this.apiConfigService.parallelism,
    })
  }

  private async seedUser(user: {
    name: string
    username: string
    password: string
    role: Role
  }) {
    await this.prisma.user.create({
      data: {
        name: user.name,
        username: user.username.toLowerCase(),
        passwordHash: await this.hashPassword(user.password),
        role: user.role,
      },
    })
  }

  async createAdminUser() {
    const u = this.apiConfigService.defaultSuperUser
    await this.seedUser({ ...u, role: Role.Admin })
  }

  async createMemberUser() {
    const u = this.apiConfigService.defaultMemberUser
    await this.seedUser({ ...u, role: Role.Member })
  }
}

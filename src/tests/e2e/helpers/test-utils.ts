import { Role } from "@domain/common/value-objects/role.value-object"
import type { EnvConfigService } from "@infrastructure/config/env-config.service"
import type { PrismaClient } from "@prisma/client"
import * as argon2 from "argon2"
import axios, { type AxiosInstance } from "axios"

type Tokens = { accessToken: string; refreshToken: string }

/**
 * HTTP helper for e2e specs — drives the running app via axios and seeds/resets DB via Prisma.
 */
export class TestApiCaller {
  private apiConfigService: EnvConfigService
  private prisma: PrismaClient
  private accessToken: string | null = null

  readonly http: AxiosInstance = axios.create({
    validateStatus: () => true,
    headers: { "User-Agent": "nest-clean-e2e" },
  })

  setApiConfig(apiConfigService: EnvConfigService) {
    this.apiConfigService = apiConfigService
    this.http.defaults.baseURL = `http://127.0.0.1:${apiConfigService.serverPort}`
  }

  setPrismaClient(prisma: PrismaClient) {
    this.prisma = prisma
  }

  private applyAuthHeader() {
    if (this.accessToken) {
      this.http.defaults.headers.common["Authorization"] = `Bearer ${this.accessToken}`
    } else {
      delete this.http.defaults.headers.common["Authorization"]
    }
  }

  setAnonymousMode() {
    this.accessToken = null
    this.applyAuthHeader()
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

  async loginAs(username: string, password: string) {
    this.setAnonymousMode()
    const { data, status } = await this.http.post<Tokens>("/auth/logIn", { username, password })
    if (status >= 400) {
      throw new Error(`loginAs failed (${status}): ${JSON.stringify(data)}`)
    }
    this.accessToken = data.accessToken
    this.applyAuthHeader()
    return data
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

  private async seedUser(user: { name: string; username: string; password: string; role: Role }) {
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

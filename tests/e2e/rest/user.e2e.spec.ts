import { UserErrors } from "@domain/user/errors/user.exceptions"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { createE2eApp } from "@src/tests/e2e/helpers/e2e-app"
import { TestApiCaller } from "@src/tests/e2e/helpers/test-utils"
import type { INestApplication } from "@nestjs/common"

describe("User (REST e2e)", () => {
  const api = new TestApiCaller()
  let app: INestApplication
  let prisma: PrismaService
  let apiConfig: EnvConfigService

  beforeAll(async () => {
    const ctx = await createE2eApp()
    app = ctx.app
    prisma = ctx.prisma
    apiConfig = ctx.apiConfig
    api.setApiConfig(apiConfig)
    api.setPrismaClient(prisma)
  })

  beforeEach(async () => {
    api.setAnonymousMode()
    await api.resetDatabase()
    await api.createAdminUser()
    await api.createMemberUser()
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  describe("me / updateMe", () => {
    it("returns the authenticated user", async () => {
      await api.setMemberMode()
      const { data, status } = await api.http.get("/user/me")

      expect(status).toBe(200)
      expect(data.username).toBe(apiConfig.defaultMemberUser.username.toLowerCase())
    })

    it("updates own name/username", async () => {
      await api.setMemberMode()
      const { data, status } = await api.http.post("/user/updateMe", {
        name: "Updated Name",
        username: "member2",
      })

      expect(status).toBe(201)
      expect(data.name).toBe("Updated Name")
      expect(data.username).toBe("member2")
    })

    it("rejects duplicate username on updateMe", async () => {
      await api.setMemberMode()
      const { data, status } = await api.http.post("/user/updateMe", {
        username: apiConfig.defaultSuperUser.username,
      })

      expect(status).toBe(UserErrors.UsernameIsDuplicated.statusCode)
      expect(data.code).toBe(UserErrors.UsernameIsDuplicated.code)
    })
  })

  describe("health", () => {
    it("GET /health is ok", async () => {
      const { status, data } = await api.http.get("/health")
      expect(status).toBe(200)
      expect(data).toBeTruthy()
    })
  })
})

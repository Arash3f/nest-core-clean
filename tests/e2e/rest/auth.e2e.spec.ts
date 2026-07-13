import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { createE2eApp } from "@src/tests/e2e/helpers/e2e-app"
import { TestApiCaller } from "@src/tests/e2e/helpers/test-utils"
import type { INestApplication } from "@nestjs/common"

describe("Auth (REST e2e)", () => {
  const api = new TestApiCaller()
  let app: INestApplication
  let prisma: PrismaService
  let apiConfig: EnvConfigService

  const FAKEID = "98a753df-bf91-45f0-914f-35acd9966ad5"

  let admin: { username: string; password: string }
  let member: { username: string; password: string }

  const expectJwt = (token: string) => {
    expect(typeof token).toBe("string")
    expect(token.split(".")).toHaveLength(3)
  }

  beforeAll(async () => {
    const ctx = await createE2eApp()
    app = ctx.app
    prisma = ctx.prisma
    apiConfig = ctx.apiConfig

    api.setApiConfig(apiConfig)
    api.setPrismaClient(prisma)

    admin = {
      username: apiConfig.defaultSuperUser.username,
      password: apiConfig.defaultSuperUser.password,
    }
    member = {
      username: apiConfig.defaultMemberUser.username,
      password: apiConfig.defaultMemberUser.password,
    }
  })

  beforeEach(async () => {
    api.setAnonymousMode()
    await api.resetDatabase()
    await api.createAdminUser()
    await api.createMemberUser()
    await api.setAdminMode()
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  describe("LogIn", () => {
    it("returns access/refresh tokens for valid credentials", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.post("/auth/logIn", admin)

      expect(status).toBe(201)
      expectJwt(data.accessToken)
      expectJwt(data.refreshToken)
    })

    it("rejects wrong password", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.post("/auth/logIn", {
        username: admin.username,
        password: "wrong-password",
      })

      expect(status).toBe(AuthErrors.IncorrectUsernameOrPassword.statusCode)
      expect(data.code).toBe(AuthErrors.IncorrectUsernameOrPassword.code)
    })

    it("rejects inactive user", async () => {
      await prisma.user.update({
        where: { username: member.username.toLowerCase() },
        data: { active: false },
      })

      api.setAnonymousMode()
      const { data, status } = await api.http.post("/auth/logIn", member)

      expect(status).toBe(AuthErrors.InactiveUser.statusCode)
      expect(data.code).toBe(AuthErrors.InactiveUser.code)
    })
  })

  describe("Register", () => {
    it("creates a member and returns tokens", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.post("/auth/register", {
        name: "New User",
        username: "newbie",
        password: "password123",
      })

      expect(status).toBe(201)
      expectJwt(data.accessToken)
      expectJwt(data.refreshToken)

      const row = await prisma.user.findUnique({ where: { username: "newbie" } })
      expect(row?.role).toBe("Member")
    })

    it("rejects duplicate username", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.post("/auth/register", {
        name: "Dup",
        username: admin.username,
        password: "password123",
      })

      expect(status).toBe(UserErrors.UsernameIsDuplicated.statusCode)
      expect(data.code).toBe(UserErrors.UsernameIsDuplicated.code)
    })
  })

  describe("RefreshToken", () => {
    it("rotates tokens", async () => {
      api.setAnonymousMode()
      const login = await api.http.post("/auth/logIn", admin)
      const before = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })

      const { data, status } = await api.http.post("/auth/refreshToken", {
        refreshToken: login.data.refreshToken,
      })

      expect(status).toBe(201)
      expectJwt(data.accessToken)
      expectJwt(data.refreshToken)

      const after = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })
      expect(after?.refreshTokenHash).toBeTruthy()
      expect(after?.refreshTokenHash).not.toBe(before?.refreshTokenHash)
    })

    it("rejects invalid refresh token", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.post("/auth/refreshToken", {
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhakeifQ.invalid",
      })

      expect(status).toBe(AuthErrors.InValidRefreshToken.statusCode)
      expect(data.code).toBe(AuthErrors.InValidRefreshToken.code)
    })
  })

  describe("Logout", () => {
    it("clears refresh token hash", async () => {
      await api.setAdminMode()
      const before = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })
      expect(before?.refreshTokenHash).toBeTruthy()

      const { status } = await api.http.post("/auth/logout")
      expect(status).toBe(201)

      const after = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })
      expect(after?.refreshTokenHash).toBeNull()
    })
  })

  describe("ChangePassword / ChangeMyPassword", () => {
    it("admin can change another user's password", async () => {
      const target = await prisma.user.findUnique({
        where: { username: member.username.toLowerCase() },
      })

      const { status } = await api.http.patch("/auth/changePassword", {
        where: { id: target!.id },
        data: { newPassword: "brand-new-pass" },
      })
      expect(status).toBe(200)

      api.setAnonymousMode()
      const login = await api.http.post("/auth/logIn", {
        username: member.username,
        password: "brand-new-pass",
      })
      expect(login.status).toBe(201)
    })

    it("user can change own password with current password", async () => {
      await api.setMemberMode()
      const { status } = await api.http.patch("/auth/changeMyPassword", {
        currentPassword: member.password,
        newPassword: "member-new-pass",
      })
      expect(status).toBe(200)

      api.setAnonymousMode()
      const login = await api.http.post("/auth/logIn", {
        username: member.username,
        password: "member-new-pass",
      })
      expect(login.status).toBe(201)
    })

    it("rejects wrong current password", async () => {
      await api.setMemberMode()
      const { data, status } = await api.http.patch("/auth/changeMyPassword", {
        currentPassword: "nope",
        newPassword: "member-new-pass",
      })
      expect(status).toBe(AuthErrors.IncorrectCurrentPassword.statusCode)
      expect(data.code).toBe(AuthErrors.IncorrectCurrentPassword.code)
    })

    it("admin changePassword not found", async () => {
      const { data, status } = await api.http.patch("/auth/changePassword", {
        where: { id: FAKEID },
        data: { newPassword: "whatever123" },
      })
      expect(status).toBe(UserErrors.UserNotFound.statusCode)
      expect(data.code).toBe(UserErrors.UserNotFound.code)
    })
  })
})

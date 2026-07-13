import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { createE2eApp } from "@src/tests/e2e/helpers/e2e-app"
import type { INestApplication } from "@nestjs/common"

import {
  extractGraphqlError,
  GraphqlTestApiCaller,
  SUCCESS_SELECTION,
  TOKENS_SELECTION,
} from "./helpers/test-utils"

const fail = (message: string): never => {
  throw new Error(message)
}

describe("Auth (GraphQL e2e)", () => {
  const api = new GraphqlTestApiCaller()
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

  describe("logIn", () => {
    it("returns access/refresh tokens", async () => {
      api.setAnonymousMode()
      const { logIn } = await api.mutation({ logIn: [{ data: admin }, TOKENS_SELECTION] })
      expectJwt(logIn.accessToken)
      expectJwt(logIn.refreshToken)
    })

    it("rejects wrong password", async () => {
      api.setAnonymousMode()
      try {
        await api.mutation({
          logIn: [
            { data: { username: admin.username, password: "wrong" } },
            TOKENS_SELECTION,
          ],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.IncorrectUsernameOrPassword)
      }
    })

    it("rejects inactive user", async () => {
      await prisma.user.update({
        where: { username: member.username.toLowerCase() },
        data: { active: false },
      })
      api.setAnonymousMode()
      try {
        await api.mutation({ logIn: [{ data: member }, TOKENS_SELECTION] })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.InactiveUser)
      }
    })
  })

  describe("register", () => {
    it("creates member and returns tokens", async () => {
      api.setAnonymousMode()
      const { register } = await api.mutation({
        register: [
          { data: { name: "New", username: "newbie", password: "password123" } },
          TOKENS_SELECTION,
        ],
      })
      expectJwt(register.accessToken)
      const row = await prisma.user.findUnique({ where: { username: "newbie" } })
      expect(row?.role).toBe("Member")
    })

    it("rejects duplicate username", async () => {
      api.setAnonymousMode()
      try {
        await api.mutation({
          register: [
            {
              data: {
                name: "Dup",
                username: admin.username,
                password: "password123",
              },
            },
            TOKENS_SELECTION,
          ],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UsernameIsDuplicated)
      }
    })
  })

  describe("refreshToken", () => {
    it("rotates stored refresh hash", async () => {
      api.setAnonymousMode()
      const { logIn } = await api.mutation({ logIn: [{ data: admin }, TOKENS_SELECTION] })
      const before = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })

      const { refreshToken } = await api.mutation({
        refreshToken: [{ data: { refreshToken: logIn.refreshToken } }, TOKENS_SELECTION],
      })
      expectJwt(refreshToken.accessToken)

      const after = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })
      expect(after?.refreshTokenHash).toBeTruthy()
      expect(after?.refreshTokenHash).not.toBe(before?.refreshTokenHash)
    })
  })

  describe("logout", () => {
    it("clears refresh token hash", async () => {
      const before = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })
      expect(before?.refreshTokenHash).toBeTruthy()

      const { logout } = await api.mutation({ logout: SUCCESS_SELECTION })
      expect(logout.success).toBe(true)

      const after = await prisma.user.findUnique({
        where: { username: admin.username.toLowerCase() },
      })
      expect(after?.refreshTokenHash).toBeNull()
    })
  })

  describe("changePassword / changeMyPassword", () => {
    it("admin can change another user's password", async () => {
      const target = await prisma.user.findUnique({
        where: { username: member.username.toLowerCase() },
      })

      const { changePassword } = await api.mutation({
        changePassword: [
          {
            data: { newPassword: "brand-new-pass" },
            where: { id: target!.id },
          },
          SUCCESS_SELECTION,
        ],
      })
      expect(changePassword.success).toBe(true)

      api.setAnonymousMode()
      const { logIn } = await api.mutation({
        logIn: [
          { data: { username: member.username, password: "brand-new-pass" } },
          TOKENS_SELECTION,
        ],
      })
      expectJwt(logIn.accessToken)
    })

    it("user can change own password", async () => {
      await api.setMemberMode()
      const { changeMyPassword } = await api.mutation({
        changeMyPassword: [
          {
            data: {
              currentPassword: member.password,
              newPassword: "member-new-pass",
            },
          },
          SUCCESS_SELECTION,
        ],
      })
      expect(changeMyPassword.success).toBe(true)
    })

    it("rejects wrong current password", async () => {
      await api.setMemberMode()
      try {
        await api.mutation({
          changeMyPassword: [
            { data: { currentPassword: "nope", newPassword: "member-new-pass" } },
            SUCCESS_SELECTION,
          ],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.IncorrectCurrentPassword)
      }
    })

    it("admin changePassword not found", async () => {
      try {
        await api.mutation({
          changePassword: [
            { data: { newPassword: "whatever123" }, where: { id: FAKEID } },
            SUCCESS_SELECTION,
          ],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UserNotFound)
      }
    })
  })
})

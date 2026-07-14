import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { createE2eApp } from "@tests/e2e/helpers/e2e-app"
import type { INestApplication } from "@nestjs/common"

import {
  extractGraphqlError,
  GraphqlTestApiCaller,
  USER_SELECTION,
} from "./helpers/test-utils"

const fail = (message: string): never => {
  throw new Error(message)
}

describe("User (GraphQL e2e)", () => {
  const api = new GraphqlTestApiCaller()
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
      const { me } = await api.query({ me: USER_SELECTION })
      expect(me.username).toBe(apiConfig.defaultMemberUser.username.toLowerCase())
      expect(me.role).toBe("Member")
    })

    it("rejects anonymous me", async () => {
      api.setAnonymousMode()
      try {
        await api.query({ me: USER_SELECTION })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.UserIsNotAuthorized)
      }
    })

    it("updates own name/username", async () => {
      await api.setMemberMode()
      const { updateMe } = await api.mutation({
        updateMe: [
          { data: { name: "Updated Name", username: "member2" } },
          USER_SELECTION,
        ],
      })
      expect(updateMe.name).toBe("Updated Name")
      expect(updateMe.username).toBe("member2")
    })

    it("rejects duplicate username on updateMe", async () => {
      await api.setMemberMode()
      try {
        await api.mutation({
          updateMe: [
            { data: { username: apiConfig.defaultSuperUser.username } },
            USER_SELECTION,
          ],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UsernameIsDuplicated)
      }
    })
  })
})

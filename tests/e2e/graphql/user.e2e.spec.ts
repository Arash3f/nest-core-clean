import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { createE2eApp } from "@tests/e2e/helpers/e2e-app"
import type { INestApplication } from "@nestjs/common"

import {
  extractGraphqlError,
  GraphqlTestApiCaller,
  SUCCESS_SELECTION,
  USER_SELECTION,
} from "./helpers/test-utils"

const fail = (message: string): never => {
  throw new Error(message)
}

const READ_USERS_SELECTION = { count: true, data: USER_SELECTION } as const

describe("User (GraphQL e2e)", () => {
  const api = new GraphqlTestApiCaller()
  let app: INestApplication
  let prisma: PrismaService
  let apiConfig: EnvConfigService

  const FAKEID = "98a753df-bf91-45f0-914f-35acd9966ad5"

  let adminUsername: string
  let memberUsername: string

  const mockUser = {
    name: "John Doe",
    username: "John.Doe",
    password: "Sup3rS3cret!",
    role: "Member",
  } as const

  beforeAll(async () => {
    const ctx = await createE2eApp()
    app = ctx.app
    prisma = ctx.prisma
    apiConfig = ctx.apiConfig
    api.setApiConfig(apiConfig)
    api.setPrismaClient(prisma)

    adminUsername = apiConfig.defaultSuperUser.username.toLowerCase()
    memberUsername = apiConfig.defaultMemberUser.username.toLowerCase()
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

  describe("me / updateMe", () => {
    it("returns the authenticated admin user", async () => {
      const { me } = await api.query({ me: USER_SELECTION })
      expect(me.username).toBe(adminUsername)
      expect(me.role).toBe("Admin")
      expect(me.active).toBe(true)
    })

    it("returns the authenticated member user", async () => {
      await api.setMemberMode()
      const { me } = await api.query({ me: USER_SELECTION })
      expect(me.username).toBe(memberUsername)
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
        updateMe: [{ data: { name: "Updated Name", username: "member2" } }, USER_SELECTION],
      })
      expect(updateMe.name).toBe("Updated Name")
      expect(updateMe.username).toBe("member2")
    })

    it("rejects duplicate username on updateMe", async () => {
      await api.setMemberMode()
      try {
        await api.mutation({
          updateMe: [{ data: { username: apiConfig.defaultSuperUser.username } }, USER_SELECTION],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UsernameIsDuplicated)
      }
    })
  })

  describe("createUser", () => {
    it("creates a user and persists it (username lower-cased)", async () => {
      const { createUser } = await api.mutation({
        createUser: [{ data: mockUser }, USER_SELECTION],
      })

      expect(createUser.id).toBeDefined()
      expect(createUser.name).toBe(mockUser.name)
      expect(createUser.username).toBe(mockUser.username.toLowerCase())
      expect(createUser.role).toBe("Member")
      expect(createUser.active).toBe(true)

      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: createUser.id } })
      expect(persisted.username).toBe(mockUser.username.toLowerCase())
    })

    it("can create an Admin", async () => {
      const { createUser } = await api.mutation({
        createUser: [
          { data: { ...mockUser, username: "second.admin", role: "Admin" } },
          USER_SELECTION,
        ],
      })

      expect(createUser.role).toBe("Admin")
    })

    it("rejects duplicate username", async () => {
      try {
        await api.mutation({
          createUser: [{ data: { ...mockUser, username: memberUsername } }, USER_SELECTION],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UsernameIsDuplicated)
      }
    })

    it("rejects anonymous createUser", async () => {
      api.setAnonymousMode()
      try {
        await api.mutation({ createUser: [{ data: mockUser }, USER_SELECTION] })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.UserIsNotAuthorized)
      }
    })

    it("rejects non-admin member", async () => {
      await api.setMemberMode()
      try {
        await api.mutation({ createUser: [{ data: mockUser }, USER_SELECTION] })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.AccessDenied)
      }
    })
  })

  describe("readUsers", () => {
    it("returns the two seeded users with no filter", async () => {
      const { readUsers } = await api.query({ readUsers: [{}, READ_USERS_SELECTION] })

      expect(readUsers.count).toBe(2)
      expect(readUsers.data.length).toBe(2)
    })

    it("rejects non-admin member", async () => {
      await api.setMemberMode()
      try {
        await api.query({ readUsers: [{}, READ_USERS_SELECTION] })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.AccessDenied)
      }
    })

    it("filters by username (case-insensitive contains)", async () => {
      const { readUsers } = await api.query({
        readUsers: [{ where: { username: adminUsername.toUpperCase() } }, READ_USERS_SELECTION],
      })

      expect(readUsers.count).toBe(1)
      expect(readUsers.data[0].username).toBe(adminUsername)
    })

    it("filters by role", async () => {
      const { readUsers } = await api.query({
        readUsers: [{ where: { role: "Admin" } }, READ_USERS_SELECTION],
      })

      expect(readUsers.count).toBe(1)
      expect(readUsers.data[0].role).toBe("Admin")
    })

    it("filters by the active flag", async () => {
      await prisma.user.update({
        where: { username: memberUsername },
        data: { active: false },
      })

      const { readUsers: actives } = await api.query({
        readUsers: [{ where: { active: true } }, READ_USERS_SELECTION],
      })
      expect(actives.count).toBe(1)
      expect(actives.data[0].username).toBe(adminUsername)

      const { readUsers: inactives } = await api.query({
        readUsers: [{ where: { active: false } }, READ_USERS_SELECTION],
      })
      expect(inactives.count).toBe(1)
      expect(inactives.data[0].username).toBe(memberUsername)
    })

    it("paginates results", async () => {
      const { readUsers: page1 } = await api.query({
        readUsers: [{ pagination: { take: 1, skip: 0 } }, READ_USERS_SELECTION],
      })
      expect(page1.count).toBe(2)
      expect(page1.data.length).toBe(1)

      const { readUsers: page2 } = await api.query({
        readUsers: [{ pagination: { take: 1, skip: 1 } }, READ_USERS_SELECTION],
      })
      expect(page2.data.length).toBe(1)
      expect(page2.data[0].id).not.toBe(page1.data[0].id)
    })

    it("sorts by username ascending and descending", async () => {
      const { readUsers: asc } = await api.query({
        readUsers: [{ sortBy: { field: "username", descending: false } }, READ_USERS_SELECTION],
      })
      const ascNames = asc.data.map((u) => u.username)
      expect(ascNames).toEqual([...ascNames].sort())

      const { readUsers: desc } = await api.query({
        readUsers: [{ sortBy: { field: "username", descending: true } }, READ_USERS_SELECTION],
      })
      const descNames = desc.data.map((u) => u.username)
      expect(descNames).toEqual([...ascNames].reverse())
    })

    it("returns empty result for an unknown filter", async () => {
      const { readUsers } = await api.query({
        readUsers: [{ where: { id: FAKEID } }, READ_USERS_SELECTION],
      })
      expect(readUsers.count).toBe(0)
      expect(readUsers.data).toHaveLength(0)
    })

    it("rejects anonymous readUsers", async () => {
      api.setAnonymousMode()
      try {
        await api.query({ readUsers: [{}, READ_USERS_SELECTION] })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.UserIsNotAuthorized)
      }
    })
  })

  describe("updateUser", () => {
    it("updates fields (name, active, role, username lower-cased)", async () => {
      const { createUser: created } = await api.mutation({
        createUser: [{ data: mockUser }, USER_SELECTION],
      })

      const { updateUser: updated } = await api.mutation({
        updateUser: [
          {
            data: { name: "Jane Roe", active: false, role: "Admin", username: "Jane.Roe" },
            where: { id: created.id },
          },
          USER_SELECTION,
        ],
      })

      expect(updated.id).toBe(created.id)
      expect(updated.name).toBe("Jane Roe")
      expect(updated.active).toBe(false)
      expect(updated.role).toBe("Admin")
      expect(updated.username).toBe("jane.roe")
    })

    it("rejects unknown id", async () => {
      try {
        await api.mutation({
          updateUser: [{ data: { name: "x" }, where: { id: FAKEID } }, USER_SELECTION],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UserNotFound)
      }
    })

    it("rejects duplicate username", async () => {
      const member = await prisma.user.findUniqueOrThrow({
        where: { username: memberUsername },
      })

      try {
        await api.mutation({
          updateUser: [
            { data: { username: adminUsername }, where: { id: member.id } },
            USER_SELECTION,
          ],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UsernameIsDuplicated)
      }
    })

    it("rejects non-admin member", async () => {
      const { createUser: created } = await api.mutation({
        createUser: [{ data: mockUser }, USER_SELECTION],
      })
      await api.setMemberMode()

      try {
        await api.mutation({
          updateUser: [{ data: { name: "x" }, where: { id: created.id } }, USER_SELECTION],
        })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.AccessDenied)
      }
    })
  })

  describe("deleteUser", () => {
    it("soft-deletes a user (sets active to false)", async () => {
      const { createUser: created } = await api.mutation({
        createUser: [{ data: mockUser }, USER_SELECTION],
      })

      const { deleteUser } = await api.mutation({
        deleteUser: [{ where: { id: created.id } }, SUCCESS_SELECTION],
      })
      expect(deleteUser.success).toBe(true)

      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: created.id } })
      expect(persisted.active).toBe(false)
      expect(persisted.refreshTokenHash).toBeNull()
    })

    it("rejects unknown id", async () => {
      try {
        await api.mutation({ deleteUser: [{ where: { id: FAKEID } }, SUCCESS_SELECTION] })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(UserErrors.UserNotFound)
      }
    })

    it("rejects non-admin member", async () => {
      const { createUser: created } = await api.mutation({
        createUser: [{ data: mockUser }, USER_SELECTION],
      })
      await api.setMemberMode()

      try {
        await api.mutation({ deleteUser: [{ where: { id: created.id } }, SUCCESS_SELECTION] })
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject(AuthErrors.AccessDenied)
      }
    })
  })

  describe("validation", () => {
    const expectInputRejected = async (request: () => Promise<unknown>) => {
      try {
        await request()
        fail("expected rejection")
      } catch (err) {
        const body = extractGraphqlError(err)
        expect(body?.message).toBeTruthy()
      }
    }

    const expectPipeValidationError = async (request: () => Promise<unknown>) => {
      try {
        await request()
        fail("expected rejection")
      } catch (err) {
        expect(extractGraphqlError(err)).toMatchObject({
          statusCode: 400,
          code: 9999,
          module: "DomainModule",
        })
      }
    }

    it("rejects CreateUser missing the role", async () => {
      await expectInputRejected(() =>
        api.mutation({
          createUser: [
            { data: { name: "x", username: "x.user", password: "Sup3rS3cret!" } as never },
            USER_SELECTION,
          ],
        }),
      )
    })

    it("rejects CreateUser carrying an unknown field", async () => {
      await expectInputRejected(() =>
        api.mutation({
          createUser: [{ data: { ...mockUser, extra: true } as never }, USER_SELECTION],
        }),
      )
    })

    it("400 for a non-uuid id filter on ReadUsers", async () => {
      await expectPipeValidationError(() =>
        api.query({ readUsers: [{ where: { id: "not-a-uuid" } }, READ_USERS_SELECTION] }),
      )
    })

    it("400 when ReadUsers pagination take exceeds the maximum", async () => {
      await expectPipeValidationError(() =>
        api.query({ readUsers: [{ pagination: { take: 999 } }, READ_USERS_SELECTION] }),
      )
    })
  })
})

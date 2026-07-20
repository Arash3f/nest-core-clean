import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { createE2eApp } from "@tests/e2e/helpers/e2e-app"
import { TestApiCaller } from "@tests/e2e/helpers/test-utils"
import type { INestApplication } from "@nestjs/common"

describe("User (REST e2e)", () => {
  const api = new TestApiCaller()
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
      const { data, status } = await api.http.get("/user/me")

      expect(status).toBe(200)
      expect(data.username).toBe(adminUsername)
      expect(data.role).toBe("Admin")
      expect(data.active).toBe(true)
    })

    it("returns the authenticated member user", async () => {
      await api.setMemberMode()
      const { data, status } = await api.http.get("/user/me")

      expect(status).toBe(200)
      expect(data.username).toBe(memberUsername)
      expect(data.role).toBe("Member")
    })

    it("rejects anonymous me", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.get("/user/me")

      expect(status).toBe(AuthErrors.UserIsNotAuthorized.statusCode)
      expect(data).toMatchObject(AuthErrors.UserIsNotAuthorized)
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

  describe("createUser", () => {
    it("creates a user and persists it (username lower-cased)", async () => {
      const { data, status } = await api.http.post("/user/createUser", mockUser)

      expect(status).toBe(201)
      expect(data.id).toBeDefined()
      expect(data.name).toBe(mockUser.name)
      expect(data.username).toBe(mockUser.username.toLowerCase())
      expect(data.role).toBe("Member")
      expect(data.active).toBe(true)

      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: data.id } })
      expect(persisted.username).toBe(mockUser.username.toLowerCase())
    })

    it("can create an Admin", async () => {
      const { data, status } = await api.http.post("/user/createUser", {
        ...mockUser,
        username: "second.admin",
        role: "Admin",
      })

      expect(status).toBe(201)
      expect(data.role).toBe("Admin")
    })

    it("rejects duplicate username", async () => {
      const { data, status } = await api.http.post("/user/createUser", {
        ...mockUser,
        username: memberUsername,
      })

      expect(status).toBe(UserErrors.UsernameIsDuplicated.statusCode)
      expect(data).toMatchObject(UserErrors.UsernameIsDuplicated)
    })

    it("rejects anonymous createUser", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.post("/user/createUser", mockUser)

      expect(status).toBe(AuthErrors.UserIsNotAuthorized.statusCode)
      expect(data).toMatchObject(AuthErrors.UserIsNotAuthorized)
    })

    it("rejects non-admin member", async () => {
      await api.setMemberMode()
      const { data, status } = await api.http.post("/user/createUser", mockUser)

      expect(status).toBe(AuthErrors.AccessDenied.statusCode)
      expect(data).toMatchObject(AuthErrors.AccessDenied)
    })
  })

  describe("readUsers", () => {
    it("returns the two seeded users with no filter", async () => {
      const { data, status } = await api.http.get("/user")

      expect(status).toBe(200)
      expect(data.count).toBe(2)
      expect(data.data.length).toBe(2)
    })

    it("rejects non-admin member", async () => {
      await api.setMemberMode()
      const { data, status } = await api.http.get("/user")

      expect(status).toBe(AuthErrors.AccessDenied.statusCode)
      expect(data).toMatchObject(AuthErrors.AccessDenied)
    })

    it("filters by username (case-insensitive contains)", async () => {
      const { data, status } = await api.http.get("/user", {
        params: { username: adminUsername.toUpperCase() },
      })

      expect(status).toBe(200)
      expect(data.count).toBe(1)
      expect(data.data[0].username).toBe(adminUsername)
    })

    it("filters by role", async () => {
      const { data, status } = await api.http.get("/user", { params: { role: "Admin" } })

      expect(status).toBe(200)
      expect(data.count).toBe(1)
      expect(data.data[0].role).toBe("Admin")
    })

    it("filters by the active flag", async () => {
      await prisma.user.update({
        where: { username: memberUsername },
        data: { active: false },
      })

      const { data: actives } = await api.http.get("/user", { params: { active: true } })
      expect(actives.count).toBe(1)
      expect(actives.data[0].username).toBe(adminUsername)

      const { data: inactives } = await api.http.get("/user", { params: { active: false } })
      expect(inactives.count).toBe(1)
      expect(inactives.data[0].username).toBe(memberUsername)
    })

    it("paginates results", async () => {
      const { data: page1 } = await api.http.get("/user", { params: { take: 1, skip: 0 } })
      expect(page1.count).toBe(2)
      expect(page1.data.length).toBe(1)

      const { data: page2 } = await api.http.get("/user", { params: { take: 1, skip: 1 } })
      expect(page2.data.length).toBe(1)
      expect(page2.data[0].id).not.toBe(page1.data[0].id)
    })

    it("sorts by username ascending and descending", async () => {
      const { data: asc } = await api.http.get("/user", {
        params: { sortField: "username", sortDescending: false },
      })
      const ascNames = asc.data.map((u: { username: string }) => u.username)
      expect(ascNames).toEqual([...ascNames].sort())

      const { data: desc } = await api.http.get("/user", {
        params: { sortField: "username", sortDescending: true },
      })
      const descNames = desc.data.map((u: { username: string }) => u.username)
      expect(descNames).toEqual([...ascNames].reverse())
    })

    it("returns empty result for an unknown filter", async () => {
      const { data, status } = await api.http.get("/user", { params: { id: FAKEID } })
      expect(status).toBe(200)
      expect(data.count).toBe(0)
      expect(data.data).toHaveLength(0)
    })

    it("rejects anonymous readUsers", async () => {
      api.setAnonymousMode()
      const { data, status } = await api.http.get("/user")

      expect(status).toBe(AuthErrors.UserIsNotAuthorized.statusCode)
      expect(data).toMatchObject(AuthErrors.UserIsNotAuthorized)
    })
  })

  describe("updateUser", () => {
    it("updates fields (name, active, role, username lower-cased)", async () => {
      const { data: created } = await api.http.post("/user/createUser", mockUser)

      const { data: updated, status } = await api.http.post("/user/updateUser", {
        where: { id: created.id },
        data: { name: "Jane Roe", active: false, role: "Admin", username: "Jane.Roe" },
      })

      expect(status).toBe(201)
      expect(updated.id).toBe(created.id)
      expect(updated.name).toBe("Jane Roe")
      expect(updated.active).toBe(false)
      expect(updated.role).toBe("Admin")
      expect(updated.username).toBe("jane.roe")
    })

    it("rejects unknown id", async () => {
      const { data, status } = await api.http.post("/user/updateUser", {
        where: { id: FAKEID },
        data: { name: "x" },
      })

      expect(status).toBe(UserErrors.UserNotFound.statusCode)
      expect(data).toMatchObject(UserErrors.UserNotFound)
    })

    it("rejects duplicate username", async () => {
      const member = await prisma.user.findUniqueOrThrow({ where: { username: memberUsername } })

      const { data, status } = await api.http.post("/user/updateUser", {
        where: { id: member.id },
        data: { username: adminUsername },
      })

      expect(status).toBe(UserErrors.UsernameIsDuplicated.statusCode)
      expect(data).toMatchObject(UserErrors.UsernameIsDuplicated)
    })

    it("rejects non-admin member", async () => {
      const { data: created } = await api.http.post("/user/createUser", mockUser)
      await api.setMemberMode()

      const { data, status } = await api.http.post("/user/updateUser", {
        where: { id: created.id },
        data: { name: "x" },
      })

      expect(status).toBe(AuthErrors.AccessDenied.statusCode)
      expect(data).toMatchObject(AuthErrors.AccessDenied)
    })
  })

  describe("deleteUser", () => {
    it("soft-deletes a user (sets active to false)", async () => {
      const { data: created } = await api.http.post("/user/createUser", mockUser)

      const { data: res, status } = await api.http.delete(`/user/${created.id}`)
      expect(status).toBe(200)
      expect(res.success).toBe(true)

      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: created.id } })
      expect(persisted.active).toBe(false)
      expect(persisted.refreshTokenHash).toBeNull()
    })

    it("revokes refresh tokens when a user is soft-deleted", async () => {
      const { data: created } = await api.http.post("/user/createUser", mockUser)

      api.setAnonymousMode()
      const { data: session } = await api.http.post("/auth/logIn", {
        username: mockUser.username,
        password: mockUser.password,
      })
      await api.setAdminMode()

      await api.http.delete(`/user/${created.id}`)

      api.setAnonymousMode()
      const { data, status } = await api.http.post("/auth/refreshToken", {
        refreshToken: session.refreshToken,
      })

      expect(status).toBe(AuthErrors.UserIsNotAuthorized.statusCode)
      expect(data).toMatchObject(AuthErrors.UserIsNotAuthorized)
    })

    it("rejects unknown id", async () => {
      const { data, status } = await api.http.delete(`/user/${FAKEID}`)

      expect(status).toBe(UserErrors.UserNotFound.statusCode)
      expect(data).toMatchObject(UserErrors.UserNotFound)
    })

    it("rejects non-admin member", async () => {
      const { data: created } = await api.http.post("/user/createUser", mockUser)
      await api.setMemberMode()

      const { data, status } = await api.http.delete(`/user/${created.id}`)

      expect(status).toBe(AuthErrors.AccessDenied.statusCode)
      expect(data).toMatchObject(AuthErrors.AccessDenied)
    })
  })

  describe("validation", () => {
    it("400 when CreateUser is missing the role", async () => {
      const { status, data } = await api.http.post("/user/createUser", {
        name: "x",
        username: "x.user",
        password: "Sup3rS3cret!",
      })

      expect(status).toBe(400)
      expect(data).toMatchObject({
        statusCode: 400,
        code: 9999,
        module: "DomainModule",
      })
    })

    it("400 when CreateUser carries an unknown field (whitelist)", async () => {
      const { status, data } = await api.http.post("/user/createUser", {
        ...mockUser,
        extra: true,
      })

      expect(status).toBe(400)
      expect(data).toMatchObject({
        statusCode: 400,
        code: 9999,
        module: "DomainModule",
      })
    })

    it("400 for a non-uuid id filter on ReadUsers", async () => {
      const { status, data } = await api.http.get("/user", { params: { id: "not-a-uuid" } })

      expect(status).toBe(400)
      expect(data).toMatchObject({
        statusCode: 400,
        code: 9999,
        module: "DomainModule",
      })
    })

    it("400 when ReadUsers pagination take exceeds the maximum", async () => {
      const { status, data } = await api.http.get("/user", { params: { take: 999 } })

      expect(status).toBe(400)
      expect(data).toMatchObject({
        statusCode: 400,
        code: 9999,
        module: "DomainModule",
      })
    })
  })

  describe("health", () => {
    it("GET /health is ok", async () => {
      const { status, data } = await api.http.get("/health")
      expect(status).toBe(200)
      expect(data.status).toBe("ok")
      expect(data.database).toBe("ok")
    })
  })
})

import { LoginUseCase } from "@application/auth/use-cases/login/login.usecase"
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { DomainException } from "@domain/common/errors/domain.exception"
import { Role } from "@domain/common/value-objects/role.value-object"
import { User } from "@domain/user/entities/user.entity"

describe("LoginUseCase", () => {
  const user = new User(
    "u1",
    "admin",
    "hash",
    "Admin",
    true,
    Role.Admin,
    null,
    new Date(),
    new Date(),
  )

  const usersRepo = {
    findByUsername: jest.fn(),
    setRefreshTokenHash: jest.fn(),
  }
  const hasher = {
    verify: jest.fn(),
    hash: jest.fn(),
  }
  const tokenService = {
    signTokenPair: jest.fn(),
  }

  const useCase = new LoginUseCase(
    usersRepo as never,
    hasher as never,
    tokenService as never,
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns token pair for valid credentials", async () => {
    usersRepo.findByUsername.mockResolvedValue(user)
    hasher.verify.mockResolvedValue(true)
    tokenService.signTokenPair.mockResolvedValue({
      accessToken: "a",
      refreshToken: "r",
    })
    hasher.hash.mockResolvedValue("rt-hash")

    const result = await useCase.execute({
      username: "Admin",
      password: "secret",
      deviceId: "device-1",
    })

    expect(result).toEqual({ accessToken: "a", refreshToken: "r" })
    expect(usersRepo.setRefreshTokenHash).toHaveBeenCalledWith("u1", "rt-hash")
    expect(tokenService.signTokenPair).toHaveBeenCalledWith({
      id: "u1",
      username: "admin",
      deviceId: "device-1",
      role: Role.Admin,
    })
  })

  it("throws IncorrectUsernameOrPassword when user missing", async () => {
    usersRepo.findByUsername.mockResolvedValue(null)

    await expect(
      useCase.execute({ username: "x", password: "y", deviceId: "d" }),
    ).rejects.toBeInstanceOf(DomainException)

    try {
      await useCase.execute({ username: "x", password: "y", deviceId: "d" })
    } catch (e) {
      expect((e as DomainException).code).toBe(AuthErrors.IncorrectUsernameOrPassword.code)
    }
  })

  it("throws InactiveUser when account is inactive", async () => {
    usersRepo.findByUsername.mockResolvedValue(
      new User("u1", "admin", "hash", "Admin", false, Role.Admin, null, new Date(), new Date()),
    )

    await expect(
      useCase.execute({ username: "admin", password: "y", deviceId: "d" }),
    ).rejects.toMatchObject({ code: AuthErrors.InactiveUser.code })
  })
})

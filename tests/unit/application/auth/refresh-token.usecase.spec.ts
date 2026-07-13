import { RefreshTokenUseCase } from "@application/auth/use-cases/refresh-token/refresh-token.usecase"
import { AuthErrors } from "@domain/auth/errors/auth.exceptions"
import { Role } from "@domain/common/value-objects/role.value-object"
import { User } from "@domain/user/entities/user.entity"

describe("RefreshTokenUseCase", () => {
  const user = new User(
    "u1",
    "admin",
    "hash",
    "Admin",
    true,
    Role.Admin,
    "stored-hash",
    new Date(),
    new Date(),
  )

  const usersRepo = {
    findById: jest.fn(),
    setRefreshTokenHash: jest.fn(),
  }
  const hasher = {
    verify: jest.fn(),
    hash: jest.fn(),
  }
  const tokenService = {
    verifyRefreshToken: jest.fn(),
    signTokenPair: jest.fn(),
  }

  const useCase = new RefreshTokenUseCase(
    usersRepo as never,
    hasher as never,
    tokenService as never,
  )

  beforeEach(() => jest.clearAllMocks())

  it("rotates tokens when refresh is valid", async () => {
    tokenService.verifyRefreshToken.mockResolvedValue({
      id: "u1",
      username: "admin",
      deviceId: "device-1",
    })
    usersRepo.findById.mockResolvedValue(user)
    hasher.verify.mockResolvedValue(true)
    tokenService.signTokenPair.mockResolvedValue({
      accessToken: "a2",
      refreshToken: "r2",
    })
    hasher.hash.mockResolvedValue("new-hash")

    const result = await useCase.execute({
      refreshToken: "r1",
      deviceId: "device-1",
    })

    expect(result).toEqual({ accessToken: "a2", refreshToken: "r2" })
    expect(usersRepo.setRefreshTokenHash).toHaveBeenCalledWith("u1", "new-hash")
  })

  it("throws DeviceMismatch when device differs", async () => {
    tokenService.verifyRefreshToken.mockResolvedValue({
      id: "u1",
      username: "admin",
      deviceId: "other",
    })

    await expect(
      useCase.execute({ refreshToken: "r1", deviceId: "device-1" }),
    ).rejects.toMatchObject({ code: AuthErrors.DeviceMismatch.code })
  })
})

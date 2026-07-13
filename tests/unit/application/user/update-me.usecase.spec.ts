import { UpdateMeUseCase } from "@application/user/use-cases/update-me/update-me.usecase"
import { Role } from "@domain/common/value-objects/role.value-object"
import { User } from "@domain/user/entities/user.entity"
import { UserErrors } from "@domain/user/errors/user.exceptions"

describe("UpdateMeUseCase", () => {
  const user = new User(
    "u1",
    "member",
    "hash",
    "Member",
    true,
    Role.Member,
    null,
    new Date(),
    new Date(),
  )

  const usersRepo = {
    findById: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
  }

  const useCase = new UpdateMeUseCase(usersRepo as never)

  beforeEach(() => jest.clearAllMocks())

  it("updates name and username", async () => {
    usersRepo.findById.mockResolvedValue(user)
    usersRepo.findByUsername.mockResolvedValue(null)
    usersRepo.update.mockResolvedValue(
      new User("u1", "member2", "hash", "New", true, Role.Member, null, new Date(), new Date()),
    )

    const result = await useCase.execute({
      userId: "u1",
      name: "New",
      username: "Member2",
    })

    expect(result.username).toBe("member2")
    expect(result.name).toBe("New")
  })

  it("throws when username duplicated", async () => {
    usersRepo.findById.mockResolvedValue(user)
    usersRepo.findByUsername.mockResolvedValue(
      new User("u2", "taken", "h", "X", true, Role.Member, null, new Date(), new Date()),
    )

    await expect(
      useCase.execute({ userId: "u1", username: "taken" }),
    ).rejects.toMatchObject({ code: UserErrors.UsernameIsDuplicated.code })
  })
})

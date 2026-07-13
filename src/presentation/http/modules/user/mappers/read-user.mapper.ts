import type { ReadUsersWithFilterInput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.input"
import type { ReadUsersWithFilterOutput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.output"
import type { ReadUserRequestDto } from "@presentation/http/modules/user/dto/read-user-request.dto"
import type { ReadUserResponseDto } from "@presentation/http/modules/user/dto/read-user-response.dto"

export class ReadUserMapper {
  static toUseCaseInput(query: ReadUserRequestDto): ReadUsersWithFilterInput {
    return {
      where: {
        id: query.id,
        username: query.username,
        name: query.name,
        role: query.role,
        active: query.active,
      },
      pagination: {
        take: query.take,
        skip: query.skip,
      },
      sortBy:
        query.sortField !== undefined
          ? {
              field: query.sortField,
              descending: query.sortDescending ?? true,
            }
          : undefined,
    }
  }

  static toDto(output: ReadUsersWithFilterOutput): ReadUserResponseDto {
    return {
      count: output.count,
      data: output.data,
    }
  }
}

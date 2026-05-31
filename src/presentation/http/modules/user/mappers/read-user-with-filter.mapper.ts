import type { ReadUsersWithFilterOutput } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.output"
import type { ReadUserResponseDto } from "@presentation/http/modules/user/dto/read-user-with-filter-response.dto"

export class ReadeUserWithFilterMapper {
  static toDto(output: ReadUsersWithFilterOutput): ReadUserResponseDto {
    return {
      count: output.count,
      data: output.data,
    }
  }
}

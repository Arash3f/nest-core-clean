import {
  CREATE_USER_USE_CASE,
  CreateUserUseCasePort,
} from "@application/user/use-cases/create-user/create-user-usecase.port"
import {
  DELETE_USER_USER_CASE,
  DeleteUserUseCasePort,
} from "@application/user/use-cases/delete-user/delete-user-usecase.port"
import { ME_USE_CASE, MeUseCasePort } from "@application/user/use-cases/me/me-usecase.port"
import {
  READ_USERS_WITH_FILTER_USE_CASE,
  ReadUsersWithFilterUseCasePort,
} from "@application/user/use-cases/read-users-with-filter/read-users-with-filter-usecase.port"
import {
  UPDATE_USER_USE_CASE,
  UpdateUserUseCasePort,
} from "@application/user/use-cases/update-user/update-user-usecase.port"
import { Inject, UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { IdDto } from "@presentation/graphql/common/dto/id.dto"
import { PaginationDto } from "@presentation/graphql/common/dto/pagination.dto"
import { SortByDto } from "@presentation/graphql/common/dto/sort-by.dto"
import { SuccessDto } from "@presentation/graphql/common/dto/success.dto"
import { CreateUserRequestDto } from "@presentation/graphql/modules/user/dto/create-user-request.dto"
import { ReadUserWhereRequestDto } from "@presentation/graphql/modules/user/dto/read-user-request.dto"
import { ReadUserResponseDto } from "@presentation/graphql/modules/user/dto/read-user-response.dto"
import { UpdateUserRequestDataDto } from "@presentation/graphql/modules/user/dto/update-user-request.dto"
import { ReadUserGraphqlMapper } from "@presentation/graphql/modules/user/mappers/read-user.mapper"
import { UserGraphqlMapper } from "@presentation/graphql/modules/user/mappers/user.mapper"
import { UserModel } from "@presentation/graphql/modules/user/model/user.model"
import { GetUserId } from "@presentation/http/common/decorators/get-user-id.decorator"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"
import { IsLoggedInGuard } from "@presentation/http/common/guards/is-logged-in.guard"

@Resolver()
export class UserResolver {
  constructor(
    @Inject(CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCasePort,

    @Inject(DELETE_USER_USER_CASE)
    private readonly deleteUserUseCase: DeleteUserUseCasePort,

    @Inject(ME_USE_CASE)
    private readonly meUseCase: MeUseCasePort,

    @Inject(READ_USERS_WITH_FILTER_USE_CASE)
    private readonly readUsersWithFilterUseCase: ReadUsersWithFilterUseCasePort,

    @Inject(UPDATE_USER_USE_CASE)
    private readonly updateUserUseCase: UpdateUserUseCasePort,
  ) {}

  @Query(() => UserModel)
  @UseGuards(IsLoggedInGuard)
  async me(@GetUserId() requesterId: string): Promise<UserModel> {
    const output = await this.meUseCase.execute({ id: requesterId })
    return UserGraphqlMapper.fromMe(output)
  }

  @Mutation(() => UserModel)
  @UseGuards(IsAdminGuard)
  async createUser(@Args("data") data: CreateUserRequestDto): Promise<UserModel> {
    const output = await this.createUserUseCase.execute(data)
    return UserGraphqlMapper.fromUser(output)
  }

  @Query(() => ReadUserResponseDto)
  @UseGuards(IsAdminGuard)
  async readUsers(
    @Args("where", { nullable: true }) where: ReadUserWhereRequestDto,
    @Args("pagination", { nullable: true }) pagination: PaginationDto,
    @Args("sortBy", { nullable: true }) sortBy: SortByDto,
  ): Promise<ReadUserResponseDto> {
    const output = await this.readUsersWithFilterUseCase.execute(
      ReadUserGraphqlMapper.toUseCaseInput(where, pagination, sortBy),
    )
    return ReadUserGraphqlMapper.toDto(output)
  }

  @Mutation(() => UserModel)
  @UseGuards(IsAdminGuard)
  async updateUser(
    @Args("data") data: UpdateUserRequestDataDto,
    @Args("where") where: IdDto,
  ): Promise<UserModel> {
    const output = await this.updateUserUseCase.execute({ data, where })
    return UserGraphqlMapper.fromUser(output)
  }

  @Mutation(() => SuccessDto)
  @UseGuards(IsAdminGuard)
  async deleteUser(@Args("where") where: IdDto): Promise<SuccessDto> {
    return await this.deleteUserUseCase.execute(where)
  }
}

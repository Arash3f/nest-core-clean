import { UserSimpleModel } from "@application/user/models/user-simple.model"
import {
  CHANGE_PASSWORD_USER_USE_CASE,
  ChangePasswordUseCasePort,
} from "@application/user/use-cases/change-password/change-password-usecase.port"
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
import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from "@nestjs/common"
import { Inject } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { GetUserId } from "@presentation/http/common/decorators/get-user-id.decorator"
import { IdDto } from "@presentation/http/common/dto/id.dto"
import { SuccessDto } from "@presentation/http/common/dto/success.dto"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"
import { IsLoggedInGuard } from "@presentation/http/common/guards/is-logged-in.guard"
import { ChangePasswordRequestDto } from "@presentation/http/modules/user/dto/change-password-request.dto"
import { CreateUserRequestDto } from "@presentation/http/modules/user/dto/create-user-request.dto"
import { ReadUserRequestDto } from "@presentation/http/modules/user/dto/read-user-with-filter-request.dto"
import { ReadUserResponseDto } from "@presentation/http/modules/user/dto/read-user-with-filter-response.dto"
import { UpdateUserRequestDto } from "@presentation/http/modules/user/dto/update-user-request.dto"
import { CreateUserMapper } from "@presentation/http/modules/user/mappers/create-user.mapper"
import { MeMapper } from "@presentation/http/modules/user/mappers/me-response.mapper"
import { ReadeUserWithFilterMapper } from "@presentation/http/modules/user/mappers/read-user-with-filter.mapper"
import { UpdateUserMapper } from "@presentation/http/modules/user/mappers/update-user.mapper"
import { UserModel } from "@presentation/http/modules/user/model/user.model"

@Controller("user")
export class UserController {
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

    @Inject(CHANGE_PASSWORD_USER_USE_CASE)
    private readonly changePasswordUseCase: ChangePasswordUseCasePort,
  ) {}

  /**
   * * return the requester informations by requester Token
   * @param requesterId Get the userId from the Token
   * @returns User informations
   */
  @Get("me")
  @ApiOperation({
    operationId: "me",
    summary: "Get my information",
    description: "return the requester informations by requester Token",
  })
  @ApiResponse({
    type: UserModel,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async me(@GetUserId() requesterId: string): Promise<UserSimpleModel> {
    const output = await this.meUseCase.execute({ id: requesterId })

    return MeMapper.toDto(output)
  }

  /**
   * * Takes the user's information and after validate the information create new User
   * @param data Necessary data for create user
   * @returns New User informations or throw error
   * @throws {UsernameIsDuplicated}
   */
  @Post("createUser")
  @ApiOperation({
    operationId: "createUser",
    summary: "Create new user",
    description: "Takes the user's information and after validate the information create new User",
  })
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({
    type: UserModel,
    status: 201,
  })
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  async createUser(@Body() data: CreateUserRequestDto): Promise<UserSimpleModel> {
    const output = await this.createUserUseCase.execute(data)
    return CreateUserMapper.toDto(output)
  }

  /**
   * * Takes the information for search and sends the found items
   * @param data Information for search, pagination, sort
   * @returns Users found
   */
  @Post("readUsers/filter")
  @ApiOperation({
    operationId: "readUsers",
    summary: "Found users",
    description: "Takes the information for search and sends the found items",
  })
  @ApiBody({ type: ReadUserRequestDto })
  @ApiResponse({
    type: ReadUserResponseDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  async readUsersWithFilter(@Body() data: ReadUserRequestDto): Promise<ReadUserResponseDto> {
    const output = await this.readUsersWithFilterUseCase.execute(data)
    return ReadeUserWithFilterMapper.toDto(output)
  }

  /**
   * * Takes the necessary information for update user and sends the updated user
   * @param data Necessary data for update user
   * @returns Updated user Information or throw error
   * @throws {UserNotFound, UsernameIsDuplicated}
   */
  @Put("updateUser")
  @ApiOperation({
    operationId: "updateUser",
    summary: "Updated user",
    description: "Takes the necessary information for update user and sends the updated use",
  })
  @ApiBody({ type: UpdateUserRequestDto })
  @ApiResponse({
    type: UserModel,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  async updateUser(@Body() data: UpdateUserRequestDto): Promise<UserSimpleModel> {
    const output = await this.updateUserUseCase.execute(data)
    return UpdateUserMapper.toDto(output)
  }

  /**
   * * Take the information for find user and delete it
   * @param where Information for find the user
   * @returns True value or throw Error
   * @throws {UserNotFound}
   */
  @Delete("deleteUser")
  @ApiOperation({
    operationId: "deleteUser",
    summary: "Delete user",
    description: "Take the information for find user and delete it",
  })
  @ApiBody({ type: IdDto })
  @ApiResponse({
    type: SuccessDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  async deleteUser(@Body() where: IdDto): Promise<SuccessDto> {
    return await this.deleteUserUseCase.execute(where)
  }

  /**
   * * Take the information for find user and update password
   * @param input Necessary data for update user's password
   * @returns True value or throw Error
   * @throws {UserNotFound}
   */
  @Patch("changePassword")
  @ApiOperation({
    operationId: "changePassword",
    summary: "Update user password",
    description: "Take the information for find user and update password",
  })
  @ApiBody({ type: ChangePasswordRequestDto })
  @ApiResponse({ type: SuccessDto, status: 200 })
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  async changePassword(@Body() data: ChangePasswordRequestDto): Promise<SuccessDto> {
    return await this.changePasswordUseCase.execute(data)
  }
}

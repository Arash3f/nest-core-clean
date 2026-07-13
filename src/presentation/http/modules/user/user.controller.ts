import { UserSimpleModel } from "@application/user/models/user-simple.model"
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
  UPDATE_ME_USE_CASE,
  UpdateMeUseCasePort,
} from "@application/user/use-cases/update-me/update-me-usecase.port"
import {
  UPDATE_USER_USE_CASE,
  UpdateUserUseCasePort,
} from "@application/user/use-cases/update-user/update-user-usecase.port"
import { UserErrors } from "@domain/user/errors/user.exceptions"
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { apiErrorResponses } from "@presentation/http/common/decorators/api-error-response.decorator"
import { GetUserId } from "@presentation/http/common/decorators/get-user-id.decorator"
import { SuccessDto } from "@presentation/http/common/dto/success.dto"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"
import { IsLoggedInGuard } from "@presentation/http/common/guards/is-logged-in.guard"
import { ParseUUIDPipe } from "@presentation/http/common/pipes/uuid.pipe"
import { CreateUserRequestDto } from "@presentation/http/modules/user/dto/create-user-request.dto"
import { ReadUserRequestDto } from "@presentation/http/modules/user/dto/read-user-request.dto"
import { ReadUserResponseDto } from "@presentation/http/modules/user/dto/read-user-response.dto"
import { UpdateMeRequestDto } from "@presentation/http/modules/user/dto/update-me-request.dto"
import { UpdateUserRequestDto } from "@presentation/http/modules/user/dto/update-user-request.dto"
import { CreateUserMapper } from "@presentation/http/modules/user/mappers/create-user.mapper"
import { MeMapper } from "@presentation/http/modules/user/mappers/me-response.mapper"
import { ReadUserMapper } from "@presentation/http/modules/user/mappers/read-user.mapper"
import { UpdateUserMapper } from "@presentation/http/modules/user/mappers/update-user.mapper"
import { UserModel } from "@presentation/http/modules/user/model/user.model"

@ApiTags("User")
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

    @Inject(UPDATE_ME_USE_CASE)
    private readonly updateMeUseCase: UpdateMeUseCasePort,
  ) {}

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
  @apiErrorResponses([UserErrors.UserNotFound])
  async me(@GetUserId() requesterId: string): Promise<UserSimpleModel> {
    const output = await this.meUseCase.execute({ id: requesterId })
    return MeMapper.toDto(output)
  }

  @Post("updateMe")
  @ApiOperation({
    operationId: "updateMe",
    summary: "Update my own profile",
    description: "Lets any logged-in user update their own name/username (not role or active).",
  })
  @ApiBody({ type: UpdateMeRequestDto })
  @ApiResponse({
    type: UserModel,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(IsLoggedInGuard)
  @apiErrorResponses([UserErrors.UserNotFound, UserErrors.UsernameIsDuplicated])
  async updateMe(
    @GetUserId() requesterId: string,
    @Body() data: UpdateMeRequestDto,
  ): Promise<UserSimpleModel> {
    return await this.updateMeUseCase.execute({
      userId: requesterId,
      ...data,
    })
  }

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
  @apiErrorResponses([UserErrors.UsernameIsDuplicated])
  async createUser(@Body() data: CreateUserRequestDto): Promise<UserSimpleModel> {
    const output = await this.createUserUseCase.execute(data)
    return CreateUserMapper.toDto(output)
  }

  @Get()
  @ApiOperation({
    operationId: "readUsers",
    summary: "List users",
    description: "Returns users matching the optional query filters, with pagination and sorting.",
  })
  @ApiResponse({
    type: ReadUserResponseDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  async readUsers(@Query() query: ReadUserRequestDto): Promise<ReadUserResponseDto> {
    const output = await this.readUsersWithFilterUseCase.execute(
      ReadUserMapper.toUseCaseInput(query),
    )
    return ReadUserMapper.toDto(output)
  }

  @Post("updateUser")
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
  @apiErrorResponses([UserErrors.UserNotFound, UserErrors.UsernameIsDuplicated])
  async updateUser(@Body() data: UpdateUserRequestDto): Promise<UserSimpleModel> {
    const output = await this.updateUserUseCase.execute(data)
    return UpdateUserMapper.toDto(output)
  }

  @Delete(":id")
  @ApiOperation({
    operationId: "deleteUser",
    summary: "Delete user",
    description: "Soft-deletes the user identified by the path id (sets active to false).",
  })
  @ApiResponse({
    type: SuccessDto,
    status: 200,
  })
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  @apiErrorResponses([UserErrors.UserNotFound])
  async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<SuccessDto> {
    return await this.deleteUserUseCase.execute({ id })
  }
}

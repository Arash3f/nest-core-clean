import { ChangePasswordUseCase } from "@application/user/use-cases/change-password/change-password.usecase"
import { CHANGE_PASSWORD_USER_USE_CASE } from "@application/user/use-cases/change-password/change-password-usecase.port"
import { CreateUserUseCase } from "@application/user/use-cases/create-user/create-user.usecase"
import { CREATE_USER_USE_CASE } from "@application/user/use-cases/create-user/create-user-usecase.port"
import { DeleteUserUseCase } from "@application/user/use-cases/delete-user/delete-user.usecase"
import { DELETE_USER_USER_CASE } from "@application/user/use-cases/delete-user/delete-user-usecase.port"
import { MeUseCase } from "@application/user/use-cases/me/me.usecase"
import { ME_USE_CASE } from "@application/user/use-cases/me/me-usecase.port"
import { ReadUsersUseCase } from "@application/user/use-cases/read-users/read-users.usecase"
import { READ_USERS_USE_CASE } from "@application/user/use-cases/read-users/read-users-usecase.port"
import { ReadUsersWithFilterUseCase } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter.usecase"
import { READ_USERS_WITH_FILTER_USE_CASE } from "@application/user/use-cases/read-users-with-filter/read-users-with-filter-usecase.port"
import { UpdateMeUseCase } from "@application/user/use-cases/update-me/update-me.usecase"
import { UPDATE_ME_USE_CASE } from "@application/user/use-cases/update-me/update-me-usecase.port"
import { UpdateUserUseCase } from "@application/user/use-cases/update-user/update-user.usecase"
import { UPDATE_USER_USE_CASE } from "@application/user/use-cases/update-user/update-user-usecase.port"
import { AuthInfrastructureModule } from "@infrastructure/adapters/auth/auth-infrastructure.module"
import { UserInfrastructureModule } from "@infrastructure/adapters/user/user-infrastructure.module"
import { Module } from "@nestjs/common"

@Module({
  imports: [AuthInfrastructureModule, UserInfrastructureModule],
  providers: [
    CreateUserUseCase,
    {
      provide: CREATE_USER_USE_CASE,
      useExisting: CreateUserUseCase,
    },

    DeleteUserUseCase,
    {
      provide: DELETE_USER_USER_CASE,
      useExisting: DeleteUserUseCase,
    },

    MeUseCase,
    {
      provide: ME_USE_CASE,
      useExisting: MeUseCase,
    },

    ReadUsersUseCase,
    {
      provide: READ_USERS_USE_CASE,
      useExisting: ReadUsersUseCase,
    },

    ReadUsersWithFilterUseCase,
    {
      provide: READ_USERS_WITH_FILTER_USE_CASE,
      useExisting: ReadUsersWithFilterUseCase,
    },

    UpdateUserUseCase,
    {
      provide: UPDATE_USER_USE_CASE,
      useExisting: UpdateUserUseCase,
    },

    ChangePasswordUseCase,
    {
      provide: CHANGE_PASSWORD_USER_USE_CASE,
      useExisting: ChangePasswordUseCase,
    },

    UpdateMeUseCase,
    {
      provide: UPDATE_ME_USE_CASE,
      useExisting: UpdateMeUseCase,
    },
  ],
  exports: [
    CREATE_USER_USE_CASE,
    DELETE_USER_USER_CASE,
    ME_USE_CASE,
    READ_USERS_USE_CASE,
    READ_USERS_WITH_FILTER_USE_CASE,
    UPDATE_USER_USE_CASE,
    CHANGE_PASSWORD_USER_USE_CASE,
    UPDATE_ME_USE_CASE,
  ],
})
export class UserApplicationModule {}

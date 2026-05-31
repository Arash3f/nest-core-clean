import { ModuleNames } from "src/constants"

export const AuthErrors = {
  UserIsNotAuthorized: {
    code: 1,
    statusCode: 400,
    module: ModuleNames.AuthModule,
    message: "User is not authorized",
    persianTranslation: "ابتدا وارد شوید",
  },
  AccessDenied: {
    code: 2,
    statusCode: 400,
    module: ModuleNames.AuthModule,
    message: "Access denied",
    persianTranslation: "دسترسی داده نشد",
  },
  InactiveUser: {
    code: 3,
    statusCode: 400,
    module: ModuleNames.AuthModule,
    message: "User is inactive",
    persianTranslation: "کاربر غیر فعال است",
  },
  IncorrectUsernameOrPassword: {
    code: 4,
    statusCode: 400,
    module: ModuleNames.AuthModule,
    message: "The username or password is incorrect",
    persianTranslation: "نام کاربری یا پسورد اشتباه است",
  },
}

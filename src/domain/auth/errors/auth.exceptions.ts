import { HttpStatus } from "@nestjs/common"
import { ModuleNames } from "src/constants"

export const AuthErrors = {
  UserIsNotAuthorized: {
    code: 1,
    statusCode: HttpStatus.UNAUTHORIZED,
    module: ModuleNames.AuthModule,
    message: "User is not authorized",
    persianTranslation: "ابتدا وارد شوید",
  },
  AccessDenied: {
    code: 2,
    statusCode: HttpStatus.UNAUTHORIZED,
    module: ModuleNames.AuthModule,
    message: "Access denied",
    persianTranslation: "دسترسی داده نشد",
  },
  InactiveUser: {
    code: 3,
    statusCode: HttpStatus.BAD_REQUEST,
    module: ModuleNames.AuthModule,
    message: "User is inactive",
    persianTranslation: "کاربر غیر فعال است",
  },
  IncorrectUsernameOrPassword: {
    code: 4,
    statusCode: HttpStatus.BAD_REQUEST,
    module: ModuleNames.AuthModule,
    message: "The username or password is incorrect",
    persianTranslation: "نام کاربری یا پسورد اشتباه است",
  },
  DeviceMismatch: {
    code: 5,
    statusCode: HttpStatus.UNAUTHORIZED,
    module: ModuleNames.AuthModule,
    message: "This token was issued for a different device",
    persianTranslation: "این توکن برای دستگاه دیگری صادر شده است",
  },
  InValidRefreshToken: {
    code: 6,
    statusCode: HttpStatus.UNAUTHORIZED,
    module: ModuleNames.AuthModule,
    message: "user refreshtoken is incorrect",
    persianTranslation: "refresh توکن اشتباه است",
  },
  IncorrectCurrentPassword: {
    code: 7,
    statusCode: HttpStatus.BAD_REQUEST,
    module: ModuleNames.AuthModule,
    message: "The current password is incorrect",
    persianTranslation: "رمز عبور فعلی اشتباه است",
  },
}

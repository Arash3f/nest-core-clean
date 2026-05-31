import { ModuleNames } from "src/constants"

export const UserErrors = {
  UsernameIsDuplicated: {
    code: 1,
    statusCode: 400,
    module: ModuleNames.UserModule,
    message: "Username is duplicate",
    persianTranslation: "نام کاربری تکراری است",
  },
  UserNotFound: {
    code: 2,
    statusCode: 400,
    module: ModuleNames.UserModule,
    message: "User not found",
    persianTranslation: "کاربر پیدا نشد",
  },
}

import { AuthApplicationModule } from "@application/auth/auth-application.module"
import { UserApplicationModule } from "@application/user/user-application.module"
import { Module } from "@nestjs/common"
import { HttpCommonModule } from "@presentation/http/common/http-common.module"
import { AuthController } from "@presentation/http/modules/auth/auth.controller"

@Module({
  imports: [HttpCommonModule, AuthApplicationModule, UserApplicationModule],
  controllers: [AuthController],
})
export class AuthHttpModule {}

import { UserApplicationModule } from "@application/user/user-application.module"
import { Module } from "@nestjs/common"
import { HttpCommonModule } from "@presentation/http/common/http-common.module"
import { UserController } from "@presentation/http/modules/user/user.controller"

@Module({
  imports: [HttpCommonModule, UserApplicationModule],
  controllers: [UserController],
})
export class UserHttpModule {}

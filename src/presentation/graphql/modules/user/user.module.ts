import { UserApplicationModule } from "@application/user/user-application.module"
import { Module } from "@nestjs/common"
import { UserResolver } from "@presentation/graphql/modules/user/user.resolver"
import { HttpCommonModule } from "@presentation/http/common/http-common.module"

@Module({
  imports: [HttpCommonModule, UserApplicationModule],
  providers: [UserResolver],
})
export class UserGraphqlModule {}

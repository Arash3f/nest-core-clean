import { AuthApplicationModule } from "@application/auth/auth-application.module"
import { UserApplicationModule } from "@application/user/user-application.module"
import { Module } from "@nestjs/common"
import { AuthResolver } from "@presentation/graphql/modules/auth/auth.resolver"
import { HttpCommonModule } from "@presentation/http/common/http-common.module"

@Module({
  imports: [HttpCommonModule, AuthApplicationModule, UserApplicationModule],
  providers: [AuthResolver],
})
export class AuthGraphqlModule {}

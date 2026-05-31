import { InfrastructureModule } from "@infrastructure/infrastructure.module"
import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { TokenGuard } from "@presentation/http/common/guards/token.guard"
import { AuthHttpModule } from "@presentation/http/modules/auth/auth.module"
import { UserHttpModule } from "@presentation/http/modules/user/user.module"

@Module({
  imports: [InfrastructureModule, AuthHttpModule, UserHttpModule],
  providers: [
    {
      /**
       * Registers {@link TokenGuard} as a global application guard.
       *
       * @remarks
       * By using {@link APP_GUARD}, the guard is applied to all routes unless
       * explicitly bypassed or overridden.
       */
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
  ],
})
export class AppModule {}

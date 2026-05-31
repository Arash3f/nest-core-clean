import { USER_READER_PORT } from "@application/common/ports/user-reader.port"
import { PrismaUserReaderAdapter } from "@infrastructure/adapters/prisma-user-reader.adapter"
import { PrismaModule } from "@infrastructure/orm/prisma/prisma.module"
import { Module } from "@nestjs/common"
import { IsAdminGuard } from "@presentation/http/common/guards/is-admin.guard"
import { IsLoggedInGuard } from "@presentation/http/common/guards/is-logged-in.guard"
import { RequireAuthGuard } from "@presentation/http/common/guards/require-auth.guard"

@Module({
  imports: [PrismaModule],
  providers: [
    RequireAuthGuard,
    IsAdminGuard,
    IsLoggedInGuard,
    PrismaUserReaderAdapter,
    { provide: USER_READER_PORT, useExisting: PrismaUserReaderAdapter },
  ],
  exports: [RequireAuthGuard, IsAdminGuard, IsLoggedInGuard],
})
export class HttpCommonModule {}

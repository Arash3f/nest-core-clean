import type { UserReaderPort } from "@application/common/ports/user-reader.port"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { PRISMA_SERVICE } from "@infrastructure/orm/prisma/prisma.tokens"
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class PrismaUserReaderAdapter implements UserReaderPort {
  constructor(@Inject(PRISMA_SERVICE) private readonly prisma: PrismaService) {}

  async findActiveById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
      },
    })

    if (!user || !user.active) {
      return null
    }

    return {
      id: user.id,
      username: user.username ?? undefined,
      role: user.role,
    }
  }
}

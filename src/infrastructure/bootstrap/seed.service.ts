import { Role } from "@domain/common/value-objects/role.value-object"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common"
import * as argon2 from "argon2"

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  logger = new Logger(SeedService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly envConf: EnvConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (this.envConf.seedOnBoot !== true) return

    this.logger.verbose("Seed Admin user started ...")
    await this.seedAdmin()

    this.logger.verbose("Seed Member user started ...")
    await this.seedNormalUser()

    this.logger.verbose("Seed service finished :)")
  }

  private async seedAdmin() {
    const name = this.envConf.superUser.name
    const username = this.envConf.superUser.username
    const password = this.envConf.superUser.password

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: this.envConf.memoryCost,
      timeCost: this.envConf.timeCost,
      parallelism: this.envConf.parallelism,
    })

    await this.prisma.user.upsert({
      where: { username },
      update: {
        name,
        username,
        passwordHash,
        role: Role.Admin,
        active: true,
      },
      create: {
        name,
        username,
        passwordHash,
        role: Role.Admin,
        active: true,
      },
    })
  }

  private async seedNormalUser() {
    const memberUser = this.envConf.memberUser
    if (memberUser === null) return

    const { name, username, password } = memberUser

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: this.envConf.memoryCost,
      timeCost: this.envConf.timeCost,
      parallelism: this.envConf.parallelism,
    })

    await this.prisma.user.upsert({
      where: { username },
      update: {
        name,
        passwordHash,
        role: Role.Member,
        active: true,
      },
      create: {
        name,
        username,
        passwordHash,
        role: Role.Member,
        active: true,
      },
    })
  }
}

import { NodeEnv } from "@infrastructure/config/env.types"
import { EnvConfigService } from "@infrastructure/config/env-config.service"
import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { Injectable, Logger } from "@nestjs/common"
import { PrismaPg } from "@prisma/adapter-pg"
import { Prisma, PrismaClient } from "@prisma/client"
import { Pool } from "pg"

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, "query">
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)
  private readonly pool: Pool
  private readonly isDev: boolean

  // حذف private از env برای رفع خطای TS6138
  constructor(env: EnvConfigService) {
    const isDev = env.nodeEnv === NodeEnv.Development

    const log: Prisma.LogDefinition[] = isDev
      ? [
          { emit: "event", level: "query" },
          { emit: "stdout", level: "info" },
          { emit: "stdout", level: "warn" },
          { emit: "stdout", level: "error" },
        ]
      : [{ emit: "stdout", level: "error" }]

    const pool = new Pool({
      connectionString: env.database.connectionUrl,
    })

    const adapter = new PrismaPg(pool)

    super({
      adapter,
      log,
    })

    this.pool = pool
    this.isDev = isDev
  }

  async onModuleInit(): Promise<void> {
    await this.$connect()

    if (this.isDev) {
      this.$on("query", (event: Prisma.QueryEvent) => {
        this.logger.verbose({
          query: event.query,
          params: event.params,
          durationMs: event.duration,
        })
      })
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
    await this.pool.end()
  }
}

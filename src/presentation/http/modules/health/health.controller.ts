import { PrismaService } from "@infrastructure/orm/prisma/prisma.service"
import { Controller, Get, ServiceUnavailableException } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

/**
 * Liveness/readiness probe for orchestrators and load balancers.
 */
@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns OK when the process is up and the database is reachable.
   *
   * @returns Health status, database connectivity, and timestamp.
   * @throws {ServiceUnavailableException} When the database cannot be reached.
   */
  @Get()
  @ApiOperation({ operationId: "health", summary: "Health check" })
  @ApiResponse({
    status: 200,
    schema: {
      example: { status: "ok", database: "ok", timestamp: "2026-01-01T00:00:00.000Z" },
    },
  })
  @ApiResponse({ status: 503, description: "Database unreachable" })
  async check() {
    const timestamp = new Date().toISOString()

    try {
      await this.prisma.$queryRaw`SELECT 1`
      return { status: "ok", database: "ok", timestamp }
    } catch {
      throw new ServiceUnavailableException({
        status: "error",
        database: "down",
        timestamp,
      })
    }
  }
}

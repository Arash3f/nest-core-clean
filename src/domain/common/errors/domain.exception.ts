import type { DomainErrorDescriptor } from "@domain/common/errors/domain-error.interface"
import type { ModuleNames } from "src/constants"

export class DomainException extends Error {
  public readonly statusCode: number
  public readonly persianTranslation: string
  public readonly developerMessage?: string
  public readonly code: number
  public readonly module: ModuleNames

  constructor(public readonly error: DomainErrorDescriptor) {
    super(error.message)
    this.statusCode = error.statusCode
    this.persianTranslation = error.persianTranslation
    this.developerMessage = error.developerMessage
    this.code = error.code
    this.module = error.module

    Object.setPrototypeOf(this, DomainException.prototype)
  }
}

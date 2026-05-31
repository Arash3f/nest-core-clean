import type { ModuleNames } from "src/constants"

export interface DomainErrorDescriptor {
  message: string
  statusCode: number
  persianTranslation: string
  developerMessage?: string
  code: number
  module: ModuleNames
}

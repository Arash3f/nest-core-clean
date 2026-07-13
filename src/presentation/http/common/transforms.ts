import { Transform } from "class-transformer"

/**
 * Coerces a query/body string to a number for validation.
 */
export const ToNumber = (): PropertyDecorator =>
  Transform(({ value }): unknown => {
    if (typeof value === "number") return value
    if (typeof value !== "string" || value.trim() === "") return value
    const parsed = Number(value)
    return Number.isNaN(parsed) ? value : parsed
  })

/**
 * Coerces a query/body string to a boolean for validation.
 */
export const ToBoolean = (): PropertyDecorator =>
  Transform(({ value }): unknown => {
    if (typeof value === "boolean") return value
    if (value === "true" || value === "1") return true
    if (value === "false" || value === "0") return false
    return value
  })

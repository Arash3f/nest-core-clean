import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import { getRequest } from "@presentation/common/utils/get-request.util"
import { getDeviceFingerprint } from "@presentation/http/common/utils/device-fingerprint.util"

/**
 * Param decorator that returns the calling device's fingerprint, derived from
 * the request's `User-Agent` header via {@link getDeviceFingerprint}.
 *
 * @returns The hex-encoded SHA-256 fingerprint of the request's `User-Agent`.
 */
export const GetDeviceFingerprint = createParamDecorator<unknown, string>(
  (_data: unknown, context: ExecutionContext) => {
    const req = getRequest(context)
    return getDeviceFingerprint(req)
  },
)

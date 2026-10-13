import { NextFunction, Request, Response } from 'express'

/**
 * Local-only guard so the push demo can be exercised without wiring the real
 * session middleware. In production this MUST be replaced by the application's
 * authentication/authorization middleware, binding every subscription to the
 * authenticated user/store that owns it.
 *
 * ALLOW_UNAUTHENTICATED_DEMO is intentionally rejected in production (checked at
 * bootstrap by the module factory).
 */
export function requirePushApiAuth(_req: Request, res: Response, next: NextFunction): void {
  const allowDemo = process.env.ALLOW_UNAUTHENTICATED_DEMO === 'true'

  if (process.env.NODE_ENV !== 'production' && allowDemo) {
    next()
    return
  }

  res.status(501).json({
    message: 'Connect this route to your application authentication/authorization middleware before use.'
  })
}

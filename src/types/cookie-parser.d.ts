/**
 * Minimal type declaration for `cookie-parser`.
 *
 * The runtime package (cookie-parser@1.4.7) ships without types and
 * `@types/cookie-parser` is not installed. This declaration covers the single
 * usage in the app: `app.use(cookieParser())`, and augments Express `Request`
 * with the `cookies` map that the middleware populates.
 */
declare module 'cookie-parser' {
  import { RequestHandler } from 'express'

  interface CookieParseOptions {
    decode?(val: string): string
  }

  function cookieParser(
    secret?: string | string[],
    options?: CookieParseOptions
  ): RequestHandler

  export = cookieParser
}

declare namespace Express {
  interface Request {
    cookies: Record<string, string>
    signedCookies?: Record<string, string>
  }
}

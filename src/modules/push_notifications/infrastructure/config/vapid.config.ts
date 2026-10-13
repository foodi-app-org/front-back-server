/**
 * Reads and validates the VAPID configuration from the environment.
 * Secrets never leave infrastructure: the domain and application layers only
 * ever receive already-configured adapters.
 */
export interface VapidConfig {
  readonly subject: string
  readonly publicKey: string
  readonly privateKey: string
}

const requiredEnv = (key: string): string => {
  const value = process.env[key]?.trim()
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const getVapidConfig = (): VapidConfig => ({
  subject: requiredEnv('VAPID_SUBJECT'),
  publicKey: requiredEnv('VAPID_PUBLIC_KEY'),
  privateKey: requiredEnv('VAPID_PRIVATE_KEY')
})

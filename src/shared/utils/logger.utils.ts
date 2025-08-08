/* eslint-disable no-console */
import * as enum_ from '../constants/core-enum'

/**
 * Formats a message to a string.
 * @param msg - The message to format.
 * @returns The formatted message.
 */
const formatMessage = (msg: unknown): string =>
  typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg)

/**
 * Gets the current timestamp in CO time (UTC-5).
 * @returns The formatted timestamp.
 */
const getCOTimestamp = (): string => {
  const now = new Date()
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
  const COffset = -5 * 60 * 60 * 1000
  const COTime = new Date(utcTime + COffset)
  return COTime.toISOString().replace('Z', '-05:00')
}

/**
 * Logs a message with a given type.
 * @param logType - The log type (e.g., SUCCESS, INFO).
 * @param logColor - The log color from enum_.
 * @param msg - The message to log.
 */
export const logMessage = (logType: string, logColor: string, msg: unknown): void => {
  const timestamp = getCOTimestamp()
  console.log(logColor, `${timestamp} ${logType}: ${formatMessage(msg)}`)
}

export const LogSuccess = (msg: unknown): void =>
  logMessage('SUCCESS', enum_.GREEN_LOG, msg)

export const LogInfo = (msg: unknown): void =>
  logMessage('INFO', enum_.CYAN_LOG, msg)

export const LogWarning = (msg: unknown): void =>
  logMessage('WARNING', enum_.YELLOW_LOG, msg)

export const LogDanger = (msg: unknown): void =>
  logMessage('DANGER', enum_.RED_LOG, msg)

/**
 * Builds a response object.
 * @param status - The response status.
 * @param code - The response code.
 * @param message - The response message.
 * @param data - The response data.
 * @returns The response object.
 */
export const ResponseService = async (
  status: string,
  code: number,
  message: string,
  data: unknown
): Promise<{ status: string; response: { code: number; message: string; data: unknown } }> => {
  return {
    status,
    response: {
      code,
      message,
      data,
    },
  }
}

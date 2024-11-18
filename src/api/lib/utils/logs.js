/* eslint-disable no-console */
const enum_ = require('./core-enum')

/**
 * Formats a message to a string.
 * @param {any} msg - The message to format.
 * @returns {string} - The formatted message.
 */
function formatMessage (msg) {
  return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg
}

/**
 * Gets the current timestamp in CO time (UTC-5).
 * @returns {string} - The formatted timestamp.
 */
function getCOTimestamp () {
  const now = new Date()
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
  const COffset = -5 * 60 * 60 * 1000
  const COime = new Date(utcTime + COffset)
  return COime.toISOString().replace('Z', '-05:00')
}

/**
 * Logs a message with a given type.
 * @param {string} logType - The log type (e.g., SUCCESS, INFO).
 * @param {string} logColor - The log color from enum_.
 * @param {any} msg - The message to log.
 */
function logMessage (logType, logColor, msg) {
  const timestamp = getCOTimestamp()
  console.log(
    logColor,
    `${timestamp} ${logType}: ${formatMessage(msg)}`
  )
}

function LogSuccess (msg) {
  logMessage('SUCCESS', enum_.GREEN_LOG, msg)
}

function LogInfo (msg) {
  logMessage('INFO', enum_.CYAN_LOG, msg)
}

function LogWarning (msg) {
  logMessage('WARNING', enum_.YELLOW_LOG, msg)
}

function LogDanger (msg) {
  logMessage('DANGER', enum_.RED_LOG, msg)
}

/**
 * Builds a response object.
 * @param {string} status - The response status.
 * @param {number} code - The response code.
 * @param {string} message - The response message.
 * @param {any} data - The response data.
 * @returns {object} - The response object.
 */
async function ResponseService (status, code, message, data) {
  return { status, response: { code, message, data } }
}

module.exports = {
  ResponseService,
  LogSuccess,
  LogInfo,
  LogWarning,
  LogDanger
}

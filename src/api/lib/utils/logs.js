/* eslint-disable no-console */
const enum_ = require('./core-enum')

async function ResponseService (status, code, message, data) {
  return { status, response: { code, message, data } }
}
function formatMessage (msg) {
  return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg
}

function LogSuccess (msg) {
  const timestamp = new Date().toISOString()
  console.log(enum_.GREEN_LOG, `${timestamp} SUCCESS -- : ${formatMessage(msg)}`)
}

function LogInfo (msg) {
  const timestamp = new Date().toISOString()
  console.log(enum_.CYAN_LOG, `${timestamp} INFO -- : ${formatMessage(msg)}`)
}

function LogWarning (msg) {
  const timestamp = new Date().toISOString()
  console.log(enum_.YELLOW_LOG, `${timestamp} WARNING -- : ${formatMessage(msg)}`)
}

function LogDanger (msg) {
  const timestamp = new Date().toISOString()
  console.log(enum_.RED_LOG, `${timestamp} DANGER -- : ${formatMessage(msg)}`)
}

module.exports = {
  ResponseService,
  LogSuccess,
  LogInfo,
  LogWarning,
  LogDanger
}

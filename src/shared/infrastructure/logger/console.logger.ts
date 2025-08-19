import * as enum_ from '../../constants/core-enum'
import { Logger } from '../../domain/logger'
import { logMessage } from '../../utils/logger.utils'

export class ConsoleLogger implements Logger {
  info(message: unknown): void {
    logMessage('INFO', enum_.CYAN_LOG, message)
  }

  warn(message: unknown): void {
    logMessage('WARN', enum_.YELLOW_LOG, message)
  }

  error(message: unknown): void {
    logMessage('ERROR', enum_.RED_LOG, message)
  }

  success(message: unknown): void {
    logMessage('SUCCESS', enum_.GREEN_LOG, message)
  }

  debug(message: unknown): void {
    logMessage('DEBUG', enum_.MAGENTA_LOG ?? '\x1b[35m', message)
  }
}

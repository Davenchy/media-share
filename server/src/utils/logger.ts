import {
  LOG_CONSOLE,
  LOG_ERROR_FILE,
  LOG_EXCEPTIONS_FILE,
  LOG_FILE,
  LOG_LEVEL,
} from "@/config"
import { createLogger, format, transports } from "winston"

const logger = createLogger({
  level: LOG_LEVEL,
  format: format.json(),
  transports: [
    new transports.File({ level: "error", filename: LOG_ERROR_FILE }),
    new transports.File({ filename: LOG_FILE }),
    new transports.File({
      filename: LOG_EXCEPTIONS_FILE,
      handleExceptions: true, // handle uncaught exceptions
      handleRejections: true, // handle unhandled promise rejections
    }),
  ],
})

// print logs to stdout if not production environment
if (LOG_CONSOLE)
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      handleExceptions: true, // handle uncaught exceptions
      handleRejections: true, // handle unhandled promise rejections
    }),
  )

export default logger

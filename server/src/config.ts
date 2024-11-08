import DotEnv from "dotenv"

DotEnv.config()

// Server Config //
export const SERVER_HOST = process.env.SERVER_HOST || "localhost"
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000

// Mongo Database Config //
export const MONGO_DB = process.env.MONGO_DB || "media_share"
export const MONGO_HOST = process.env.MONGO_HOST || "localhost"
export const MONGO_PORT = Number(process.env.MONGO_PORT) || 27017
export const MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

// Environment Config //
export const ENV = process.env.NODE_ENV || "development"
export const IS_DEV = ENV === "development"
export const IS_PROD = ENV === "production"
export const IS_TEST = ENV === "test"

// Logging COnfig //
export const LOG_LEVEL = process.env.LOG_LEVEL || "info"
export const LOG_FILE = process.env.LOG_FILE || "server.log"
export const LOG_EXCEPTIONS_FILE = process.env.LOG_FILE || "exceptions.log"
export const LOG_ERROR_FILE = process.env.LOG_ERROR_FILE || "error.log"

const logConsole = process.env.LOG_CONSOLE
// if LOG_CONSOLE is not set, only print logs to stdout if not in production environment
// if LOG_CONSOLE is set, always print logs to stdout if its value is `enabled`
export const LOG_CONSOLE =
  logConsole === undefined ? !IS_PROD : logConsole === "enabled"

// Password Hasing Config //
export const PASSWORD_SALT_ROUNDS =
  Number(process.env.PASSWORD_SALT_ROUNDS) || 10

// JWT Config - time is in seconds //
const tokenSecret = process.env.TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

// make sure tokens secrets are set in the production environment

// the logger was imported here to ensure that LOG variables are set
import logger from "./utils/logger"

if (IS_PROD && !tokenSecret) {
  logger.error("A strong token secret must be set in production environment")
  process.exit(1)
}

if (IS_PROD && !refreshTokenSecret) {
  logger.error(
    "A strong refresh token secret must be set in production environment",
  )
  process.exit(1)
}

export const TOKEN_SECRET = tokenSecret || "super_strong_token_secret"
export const REFRESH_TOKEN_SECRET =
  refreshTokenSecret || "super_strong_refresh_token_secret"
export const TOKEN_EXPIRES_IN = Number(process.env.TOKEN_EXPIRES_IN) || 300 // 5 minutes
export const REFRESH_TOKEN_EXPIRES_IN =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 3600 // 1 hour

// Upload Config - Size in bytes //
export const UPLOAD_VIDEO_MAX_BYTES =
  Number(process.env.UPLOAD_VIDEO_MAX_BYTES) || 2e7 // 20 MegaBytes
export const UPLOAD_IMAGE_MAX_BYTES =
  Number(process.env.UPLOAD_IMAGE_MAX_BYTES) || 1e7 // 10 MegaBytes
export const UPLOAD_PATH = process.env.UPLOAD_PATH || "uploads"

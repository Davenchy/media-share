import DotEnv from "dotenv"

DotEnv.config()

// Server Config
export const SERVER_HOST = process.env.SERVER_HOST || "localhost"
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000

// Mongo Database Config
export const MONGO_DB = process.env.MONGO_DB || "media_share"
export const MONGO_HOST = process.env.MONGO_HOST || "localhost"
export const MONGO_PORT = Number(process.env.MONGO_PORT) || 27017
export const MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

// Environment Config
export const ENV = process.env.NODE_ENV || "development"
export const IS_DEV = ENV === "development"
export const IS_PROD = ENV === "production"
export const IS_TEST = ENV === "test"

// Logging COnfig
export const LOG_LEVEL = process.env.LOG_LEVEL || "info"
export const LOG_FILE = process.env.LOG_FILE || "server.log"
export const LOG_EXCEPTIONS_FILE = process.env.LOG_FILE || "exceptions.log"
export const LOG_ERROR_FILE = process.env.LOG_ERROR_FILE || "error.log"
export const LOG_CONSOLE = process.env.LOG_CONSOLE !== undefined || !IS_PROD

// Password Hasing Config //
export const PASSWORD_SALT_ROUNDS =
  Number(process.env.PASSWORD_SALT_ROUNDS) || 10


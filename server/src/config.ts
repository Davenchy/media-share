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
export const IS_DEV = process.env.NODE_ENV === "development"
export const IS_PROD = process.env.NODE_ENV === "production"
export const IS_TEST = process.env.NODE_ENV === "test"
export const ENV = process.env.NODE_ENV || "development"

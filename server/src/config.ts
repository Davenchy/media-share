import DotEnv from "dotenv"

DotEnv.config()

// Server Config
export const SERVER_HOST = process.env.SERVER_HOST || "localhost"
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000

// Environment Config
export const IS_DEV = process.env.NODE_ENV === "development"
export const IS_PROD = process.env.NODE_ENV === "production"
export const IS_TEST = process.env.NODE_ENV === "test"
export const ENV = process.env.NODE_ENV || "development"

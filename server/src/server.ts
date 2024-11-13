import { IS_TEST, MONGO_URI, SERVER_HOST, SERVER_PORT } from "@/config"
import api_router from "@/routes"
import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import { ErrorHandler, NotFoundHandler } from "./middlewares/error_handler"
import logger from "./utils/logger"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(api_router)

app.use(NotFoundHandler)
app.use(ErrorHandler)

async function run_server() {
  logger.info("connecting to MongoDB")
  await mongoose.connect(MONGO_URI)

  const serverInfo = await mongoose.connection.db?.admin().serverInfo()
  if (!serverInfo) {
    logger.error("failed to connect to MongoDB")
    process.exit(1)
  }

  logger.info(`MongoDB version: ${serverInfo.version}`)

  app.listen(SERVER_PORT, SERVER_HOST, () => {
    logger.info(`server is running on ${SERVER_HOST}:${SERVER_PORT}`)
  })
}

if (!IS_TEST) run_server()

// export for testing
export default app

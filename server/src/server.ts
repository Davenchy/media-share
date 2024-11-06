import express from "express"
import mongoose from "mongoose"
import { IS_TEST, MONGO_URI, SERVER_HOST, SERVER_PORT } from "@/config"
import api_router from "@/routes"

const app = express()

app.use(express.json())

app.use(api_router)

async function run_server() {
  try {
    console.log("connecting to MongoDB")
    await mongoose.connect(MONGO_URI)
  } catch (err) {
    console.error("failed to connect to MongoDB\n", err)
    process.exit(1)
  }

  const serverInfo = await mongoose.connection.db?.admin().serverInfo()
  if (!serverInfo) {
    console.error("failed to connect to MongoDB")
    process.exit(1)
  }

  console.log(`MongoDB version: ${serverInfo.version}`)

  app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`server is running on ${SERVER_HOST}:${SERVER_PORT}`)
  })
}

if (!IS_TEST) run_server()

// export for testing
export default app

import express from "express"
import { IS_TEST, MONGO_URI, SERVER_HOST, SERVER_PORT } from "@/config"

const app = express()

app.use(express.json())

async function run_server() {

  app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`server is running on ${SERVER_HOST}:${SERVER_PORT}`)
  })
}

if (!IS_TEST) run_server()

// export for testing
export default app

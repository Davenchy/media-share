import { AuthGuard } from "@/middlewares/auth_guard"
import logger from "@/utils/logger"
import serverSentEvents from "@/utils/server-sent-events"
import { Router } from "express"
import MediaRouter from "./MediaRouter"
import UsersRouter from "./UsersRouter"

const router = Router()

router.use(UsersRouter)
router.use("/media", AuthGuard, MediaRouter)

router.get("/events", AuthGuard, (req, res) => {
  const user = req.user
  if (!user) throw new Error("No user")

  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()

  logger.info(`events: connected: ${user.id}`)
  res.write("data: start\n\n")

  const killHandler = serverSentEvents.addListener(() =>
    res.write("data: update\n\n"),
  )

  res.on("close", () => {
    logger.info(`events: closed: ${user.id}`)
    killHandler()
    res.end()
  })
})

export default router

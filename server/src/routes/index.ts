import { AuthGuard } from "@/middlewares/auth_guard"
import { MediaGuard } from "@/middlewares/media_guard"
import { Router } from "express"
import MediaLikesRouter from "./MediaLikesRouter"
import MediaRouter from "./MediaRouter"
import UsersRouter from "./UsersRouter"
import { MediaAcccessGuard } from "@/middlewares/media_access_guard"

const router = Router()

router.use(UsersRouter)
router.use("/media", AuthGuard, MediaRouter)
router.use(
  "/media/:mediaId/likes",
  AuthGuard,
  MediaGuard,
  MediaAcccessGuard("OnlyIfPublic"),
  MediaLikesRouter,
)

export default router

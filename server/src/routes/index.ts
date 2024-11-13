import { AuthGuard } from "@/middlewares/auth_guard"
import { Router } from "express"
import MediaRouter from "./MediaRouter"
import UsersRouter from "./UsersRouter"

const router = Router()

router.use(UsersRouter)
router.use("/media", AuthGuard, MediaRouter)

export default router

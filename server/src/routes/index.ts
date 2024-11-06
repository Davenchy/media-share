import { Router } from "express"
import UsersRouter from "./UsersRouter"

const router = Router()

router.use(UsersRouter)

export default router

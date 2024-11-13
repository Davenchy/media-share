import { AuthGuard } from "@/middlewares/auth_guard"
import {
  RefreshTokenSchema,
  UserCredentialsSchema,
  UserRegisterationSchema,
} from "@/models/user"
import UsersController from "controller/UsersController"
import { Router } from "express"
import { ValidateBody } from "middleware/validate_body"

const router = Router()

router.get("/users/me", AuthGuard, UsersController.currentUserData)
router.get("/users/:userId", AuthGuard, UsersController.userData)

router.post(
  "/register",
  ValidateBody(UserRegisterationSchema),
  UsersController.register,
)
router.post(
  "/login",
  ValidateBody(UserCredentialsSchema),
  UsersController.login,
)
router.post(
  "/refresh-token",
  ValidateBody(RefreshTokenSchema),
  UsersController.refreshToken,
)

export default router

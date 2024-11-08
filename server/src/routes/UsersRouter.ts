import UsersController from "controller/UsersController"
import { ValidateBody } from "middleware/validate_body"
import { Router } from "express"
import {
  RefreshTokenSchema,
  UserCredentialsSchema,
  UserRegisterationSchema,
} from "@/models/user"

const router = Router()

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

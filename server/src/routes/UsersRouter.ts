import UsersController from "controller/UsersController"
import { ValidateBody } from "middleware/validate_body"
import { Router } from "express"
import {
  RefreshTokenSchema,
  UserCredentialsSchema,
  UserRegisterationSchema,
} from "@/models/user"

const router = Router()

router.get(
  "/register",
  ValidateBody(UserRegisterationSchema),
  UsersController.register,
)
router.get("/login", ValidateBody(UserCredentialsSchema), UsersController.login)
router.get(
  "/refresh-token",
  ValidateBody(RefreshTokenSchema),
  UsersController.refreshToken,
)

export default router

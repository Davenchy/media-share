import { AsyncHandler } from "@/decorators/async_error_handler"
import User from "@/models/user"
import type { RefreshToken, UserCredentials, UserDocument } from "@/models/user"
import type { Request, Response } from "express"

class UsersController {
  @AsyncHandler
  async register(req: Request, res: Response) {
    // check if email is taken
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      res.status(409).json({ error: "email already in use" })
      return
    }

    // create a new user
    user = new User({ ...req.body })
    await user.save()

    res.status(201).json(user.toJSON())
  }

  @AsyncHandler
  async login(req: Request, res: Response) {
    const { email, password } = req.body as UserCredentials
    const user = await User.findOne({ email })
    if (!user || !(await user.validatePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    res.json({
      accessToken: user.generateToken(),
      refreshToken: user.generateRefreshToken(),
    })
  }

  @AsyncHandler
  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body as RefreshToken

    let user: UserDocument | null

    try {
      user = await User.findByRefreshToken(refreshToken)
      if (!user) throw new Error()
    } catch (err) {
      res.status(401).json({ error: "invalid or expired refresh token" })
      return
    }

    res.json({
      accessToken: user.generateToken(),
      refreshToken: user.generateRefreshToken(),
    })
  }
}

export default new UsersController()

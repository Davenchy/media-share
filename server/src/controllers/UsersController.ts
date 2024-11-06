import type { Request, Response } from "express"
import User from "model/user"

class UsersController {
  async register(req: Request, res: Response) {
  }

  login(req: Request, res: Response) {}

  refreshToken(req: Request, res: Response) {}
}

export default new UsersController()

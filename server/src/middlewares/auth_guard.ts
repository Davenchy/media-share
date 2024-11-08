import User from "@/models/user"
import type { UserDocument } from "@/models/user"
import type { Request, Response, NextFunction } from "express"

const setAuthHeader = (res: Response, error: string, description: string) => {
  res.header(
    "WWW-Authenticate",
    `Bearer error="${error}", error_description="${description}"`,
  )
}

const setMissingTokenHeader = (res: Response) =>
  setAuthHeader(res, "missing_token", "Missing Authenticate token")
const setInvalidTokenFormatHeader = (res: Response) =>
  setAuthHeader(res, "invalid_request", "Invalid token format")
const setInvalidTokenHeader = (res: Response) =>
  setAuthHeader(res, "invalid_token", "Invalid or Expired token")

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user. It will be set by the AuthGuard.
       */
      user?: UserDocument
      /**
       * The token used to authenticate the user.
       * It will be set by the AuthGuard.
       */
      token?: string
    }
  }
}

/**
 * Protect routes and ensure that the user is authenticated
 * If not authenticated, returns status 401 and "Unauthorized",
 * also sets the `WWW-Authenticate` header with an error and a description
 */
export const AuthGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = (req.header("Authorization") || "").split(" ")

  // ensure that the header is set
  if (authHeader.length === 0) {
    setMissingTokenHeader(res)
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  // ensure that the header value is using the correct format
  if (
    authHeader.length !== 2 ||
    authHeader[0] !== "Bearer" ||
    authHeader[1].length === 0
  ) {
    setInvalidTokenFormatHeader(res)
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const token = authHeader[1]

  // ensure that the token is valid and not expired then decode it
  // and get the user document
  let user: UserDocument | null
  try {
    user = await User.findByToken(token)
    if (!user) throw new Error("no user")
  } catch (err) {
    setInvalidTokenHeader(res)
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  // set the token and the user document to the request object for future use
  req.token = token
  req.user = user

  next()
}

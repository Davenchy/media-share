import type { NextFunction, Request, Response } from "express"

export type MediaAccessLevel = "OnlyOwner" | "OnlyIfPublic"
export type RejectMessage = "NotFound" | "Forbidden"

/**
 * Express middleware that checks if the user is authorized to access this
 * media.
 *
 * If the user is owner, then it will pass.
 * If the media is private or only owners are allowed, then it will block.
 *
 * block if -> (onlyOwner || isPrivate) && !isOwner
 *
 * On rejection/AccessDenied: it will return a 404 if rejectMessage is set to
 * `NotFound` and 403 if set to `Forbidden`.
 */
export const MediaAcccessGuard =
  (accessLevel: MediaAccessLevel, rejectMessage: RejectMessage = "NotFound") =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      throw new Error("Use the MediaAccessGuard after the AuthGuard")
    if (!req.media)
      throw new Error("Use the MediaAccessGuard after the MediaGuard")

    const isPrivate = req.media.isPrivate
    const isOwner = req.user._id.equals(req.media.userId)
    const onlyOwner = accessLevel === "OnlyOwner"

    if ((onlyOwner || isPrivate) && !isOwner) {
      const status = rejectMessage === "NotFound" ? 404 : 403
      const error =
        rejectMessage === "NotFound" ? "Media not found" : "Access denied"
      res.status(status).json({ error })
      return
    }

    next()
  }

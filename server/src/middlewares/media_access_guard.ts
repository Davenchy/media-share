import type { NextFunction, Request, Response } from "express"

export type MediaAccessLevel = "OnlyOwner" | "OnlyIfPublic"

/**
 * Express middleware that checks if the user is authorized to access this
 * media.
 *
 * If the user is owner, then it will pass.
 * If the media is private or only owners are allowed, then it will block.
 *
 * block if -> (onlyOwner || isPrivate) && !isOwner
 */
export const MediaAcccessGuard =
  (accessLevel: MediaAccessLevel) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      throw new Error("Use the MediaAccessGuard after the AuthGuard")
    if (!req.media)
      throw new Error("Use the MediaAccessGuard after the MediaGuard")

    const isPrivate = req.media.isPrivate
    const isOwner = req.user._id.equals(req.media.userId)
    const onlyOwner = accessLevel === "OnlyOwner"

    if ((onlyOwner || isPrivate) && !isOwner) {
      res.status(404).json({ error: "Media not found" })
      return
    }

    next()
  }

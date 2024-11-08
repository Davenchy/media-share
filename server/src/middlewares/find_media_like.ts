import MediaLike from "@/models/media_like"
import type { MediaLikeDocument } from "@/models/media_like"
import type { Request, Response, NextFunction } from "express"

declare global {
  namespace Express {
    interface Request {
      /**
       * Is the current user liked the media?
       *
       * Will be set by the FindMediaLike middleware
       */
      isMediaLiked: boolean
      /**
       * If the current user liked the media, this object will represent the
       * like document.
       *
       * Will be set by the FindMediaLike middleware
       */
      mediaLike?: MediaLikeDocument
    }
  }
}

/**
 * Express middleware that checks if the user has liked the media
 * It depends on AuthGiard and MediaGuard middlewares
 *
 * Will set `req.isMediaLiked` boolean to true if the user liked the media.
 * Will set `req.mediaLike` to the media like document if exist
 */
export const FindMediaLike = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user) throw new Error("Use the FindMediaLike after the AuthGuard")
  if (!req.media) throw new Error("Use the FindMediaLike after the MediaGuard")

  try {
    req.mediaLike =
      (await MediaLike.findOne({
        userId: req.user._id,
        mediaId: req.media._id,
      })) ?? undefined
    req.isMediaLiked = true
  } catch (err) {
    req.isMediaLiked = false
  }

  next()
}

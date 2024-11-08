import type { NextFunction, Request, Response } from "express"
import Media from "model/media"
import type { MediaDocument } from "model/media"
import { isValidObjectId } from "mongoose"

declare global {
  namespace Express {
    interface Request {
      /**
       * The media document requested. It will be set by the MediaGuard
       * middleware.
       */
      media?: MediaDocument
    }
  }
}

/**
 * An express middleware that ensures the mediaId param is will set and
 * validates it.
 * If the media document with the same Id exist it is set in the request object.
 * if the media is not found, 404 is sent
 *
 * It depends on the user document which is set by the AuthGuard, ensure it is
 * used before this middleware
 *
 * To control user media access use the MediaAcccessGuard after.
 */
export const MediaGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { mediaId } = req.params

  // ensure the mediaId param is well set
  if (mediaId === undefined)
    throw new Error('Use the "MediaGuard" with "mediaId" route parameter')

  // validate media id
  if (!isValidObjectId(mediaId)) {
    res.status(404).json({ error: "media not found" })
    return
  }

  let media: MediaDocument | null

  try {
    media = await Media.findById(mediaId)
    if (!media) throw new Error("no media")
  } catch (err) {
    res.status(404).json({ error: "media not found" })
    return
  }

  req.media = media

  next()
}

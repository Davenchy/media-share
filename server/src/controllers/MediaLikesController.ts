import { AsyncHandler } from "@/decorators/async_error_handler"
import type { Request, Response } from "express"
import MediaLike from "model/media_like"

class MediaController {
  @AsyncHandler
  async like(req: Request, res: Response) {
    const { user, media, isMediaLiked } = req
    if (!user) throw new Error("Use the AuthGuard")
    if (!media) throw new Error("Use the MediaGuard")
    if (isMediaLiked === undefined) throw new Error("Use the FindMediaLike")

    // only set as liked if it is not set
    if (!isMediaLiked)
      await new MediaLike({ userId: user._id, mediaId: media._id }).save()

    res.json({ isLiked: true })
  }

  @AsyncHandler
  async unlike(req: Request, res: Response) {
    const { user, media, isMediaLiked, mediaLike } = req
    if (!user) throw new Error("Use the AuthGuard")
    if (!media) throw new Error("Use the MediaGuard")
    if (isMediaLiked === undefined || !mediaLike)
      throw new Error("Use the FindMediaLike")

    // only unset if it is set
    if (isMediaLiked) await MediaLike.findByIdAndDelete(mediaLike._id)

    res.json({ isLiked: false })
  }
}

export default new MediaController()

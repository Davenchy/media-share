import { AsyncHandler } from "@/decorators/async_error_handler"
import MediaLike from "model/media_like"
import type { Request, Response } from "express"
import mongoose from "mongoose"

class MediaController {
  getAllLikes(req: Request, res: Response) {}

  @AsyncHandler
  async like(req: Request, res: Response) {
    const { user, media, isMediaLiked } = req
    if (!user) throw new Error("Use the AuthGuard")
    if (!media) throw new Error("Use the MediaGuard")
    if (isMediaLiked === undefined) throw new Error("Use the FindMediaLike")

    // only set as liked if it is not set
    if (!isMediaLiked) {
      const session = await mongoose.startSession()

      // use transaction to ensure that the like is created and the media likes
      // field incremented
      session.withTransaction(async () => {
        await new MediaLike({
          userId: user._id,
          mediaId: media._id,
        }).save()

        media.likes++
        await media.save()
      })

      await session.endSession()
    }

    res.json({ isLiked: true })
  }

  @AsyncHandler
  async unlike(req: Request, res: Response) {
  }
}

export default new MediaController()

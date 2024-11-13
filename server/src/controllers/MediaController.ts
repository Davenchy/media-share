import { resolve } from "node:path"
import { AsyncHandler } from "@/decorators/async_error_handler"
class MediaController {
  upload() {}

  metadata() {}
  @AsyncHandler
  async update(req: Request, res: Response) {
    const { media, body } = req
    if (!media) throw new Error("Use MediaGuard")
    await media.updateOne({ $set: body })
    res.send()
  }

  @AsyncHandler
  async delete(req: Request, res: Response) {
    const media = req.media
    if (!media) throw new Error("Use MediaGuard")

    const session = await mongoose.startSession()
    await session.withTransaction(async () => {
      await MediaLike.deleteMany({ mediaId: media._id })
      await unlink(media.filePath)
      await media.deleteOne()
    })
    await session.endSession()

    res.status(204).send()
  }

  allMedia() {}

  @AsyncHandler
  async stream(req: Request, res: Response) {
    const media = req.media
    if (!media) throw new Error("Use MediaGuard")
    res.sendFile(resolve(media.filePath))
  }
}

export default new MediaController()

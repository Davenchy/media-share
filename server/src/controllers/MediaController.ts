import { unlink } from "node:fs/promises"
import { resolve } from "node:path"
import { AsyncHandler } from "@/decorators/async_error_handler"
import type { Request, Response } from "express"
import Media, { UpdateMediaSchema } from "model/media"
class MediaController {
  @AsyncHandler
  async upload(req: Request, res: Response) {
    const {
      u_file: file,
      user,
      fields: { caption, isPrivate },
    } = req

    // !TODO: validate fields
    // const result =   CreateMediaSchema.safeParse(fields)

    if (!user) throw new Error("Use the AuthGuard middleware")
    if (!file) throw new Error("Use the FileUpload middleware")

    const media = new Media({
      userId: user._id,
      filename: file.originalname,
      filePath: file.path,
      mimeType: file.mimeType,
      mediaType: file.mediaType,
      sizeInBytes: file.fileSize,
      isPrivate,
      caption,
    })

    await media.save()
    res.status(201).json(media.toJSON())
  }

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

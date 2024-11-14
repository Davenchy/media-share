import { unlink } from "node:fs/promises"
import { resolve } from "node:path"
import { AsyncHandler } from "@/decorators/async_error_handler"
import MediaLike from "@/models/media_like"
import {
  parseRequestPaginationQueries,
  useCleanMediaFields,
  useMediaLikes,
  useMediaOwner,
  useMediaPagination,
} from "@/utils/media_helpers"
import type { Request, Response } from "express"
import Media, { UpdateMediaSchema } from "model/media"
import mongoose from "mongoose"
import serverSentEvents from "@/utils/server-sent-events"

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
    serverSentEvents.push(user.id)

    res.status(201).json(media.toJSON())
  }

  @AsyncHandler
  async update(req: Request, res: Response) {
    const { user, media, body } = req
    if (!user) throw new Error("Use AuthGuard")
    if (!media) throw new Error("Use MediaGuard")

    await media.updateOne({ $set: body })
    serverSentEvents.push(user.id)

    res.send()
  }

  @AsyncHandler
  async delete(req: Request, res: Response) {
    const { user, media } = req
    if (!user) throw new Error("Use AuthGuard")
    if (!media) throw new Error("Use MediaGuard")

    const session = await mongoose.startSession()

    await session.withTransaction(async () => {
      await MediaLike.deleteMany({ mediaId: media._id })
      await unlink(media.filePath)
      await media.deleteOne()
    })

    await session.endSession()
    serverSentEvents.push(user.id)

    res.status(204).send()
  }

  @AsyncHandler
  async allMedia(req: Request, res: Response) {
    if (!req.user) throw new Error("Use AuthGuard")

    const { page, limit } = parseRequestPaginationQueries(req)
    const userId = req.user._id

    let mediaAggregate = Media.aggregate().match({
      $or: [{ isPrivate: false }, { userId }],
    })

    mediaAggregate = useMediaPagination(mediaAggregate, page, limit)
    mediaAggregate = useMediaOwner(mediaAggregate, userId)
    mediaAggregate = useMediaLikes(mediaAggregate, userId)
    mediaAggregate = useCleanMediaFields(mediaAggregate)

    const media = await mediaAggregate.exec()

    res.json(media)
  }

  @AsyncHandler
  async myMedia(req: Request, res: Response) {
    if (!req.user) throw new Error("Use AuthGuard")

    const { page, limit } = parseRequestPaginationQueries(req)
    const userId = req.user._id

    let mediaAggregate = Media.aggregate().match({ userId })

    mediaAggregate = useMediaPagination(mediaAggregate, page, limit)
    mediaAggregate = useMediaOwner(mediaAggregate, userId)
    mediaAggregate = useMediaLikes(mediaAggregate, userId)
    mediaAggregate = useCleanMediaFields(mediaAggregate)

    const media = await mediaAggregate.exec()

    res.json(media)
  }

  @AsyncHandler
  async likedMedia(req: Request, res: Response) {
    if (!req.user) throw new Error("Use AuthGuard")

    const { page, limit } = parseRequestPaginationQueries(req)
    const userId = req.user._id

    let mediaAggregate = MediaLike.aggregate()
      .match({ userId })
      .lookup({
        from: "media",
        localField: "mediaId",
        foreignField: "_id",
        as: "media",
      })
      .unwind("$media")
      .replaceRoot("$media")

    mediaAggregate = useMediaPagination(mediaAggregate, page, limit)
    mediaAggregate = useMediaOwner(mediaAggregate, userId)
    mediaAggregate = useMediaLikes(mediaAggregate, userId)
    mediaAggregate = useCleanMediaFields(mediaAggregate)

    const media = await mediaAggregate.exec()

    res.json(media)
  }

  @AsyncHandler
  async stream(req: Request, res: Response) {
    const media = req.media
    if (!media) throw new Error("Use MediaGuard")
    res.sendFile(resolve(media.filePath))
  }
}

export default new MediaController()

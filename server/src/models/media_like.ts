import { Schema, model } from "mongoose"
import type { HydratedDocument } from "mongoose"

interface IMediaLike {
  userId: Schema.Types.ObjectId
  mediaId: Schema.Types.ObjectId
}

export type MediaLikeDocument = HydratedDocument<IMediaLike>

const mediaLikeSchema = new Schema<IMediaLike>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mediaId: { type: Schema.Types.ObjectId, ref: "Media", required: true },
})

const MediaLike = model<IMediaLike>("MediaLike", mediaLikeSchema)
export default MediaLike

import { Schema, model } from "mongoose"
import type { HydratedDocument, Types } from "mongoose"
import { z } from "zod"

// Types //
export type MediaType = "image" | "video"

interface IMedia {
  userId: Types.ObjectId
  caption: string
  filename: string
  filePath: string
  mimeType: string
  sizeInBytes: number
  isPrivate: boolean
  get mediaType(): MediaType
}

export type MediaDocument = HydratedDocument<IMedia>
export type UpdateMediaPayload = z.infer<typeof UpdateMediaSchema>

// Schemas //
export const UpdateMediaSchema = z.object({
  caption: z.string().max(300, "media caption cannot exceed 300 characters"),
  isPrivate: z.boolean(),
})

const mediaSchema = new Schema<IMedia>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String, default: "", maxlength: 300 },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeInBytes: { type: Number, min: 0, required: true },
    filePath: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false, virtuals: true },
    virtuals: {
      mediaType: {
        get(): MediaType {
          return (this as never as IMedia).mimeType.startsWith("image")
            ? "image"
            : "video"
        },
      },
    },
  },
)

// Model //
const Media = model<IMedia>("Media", mediaSchema)
export default Media

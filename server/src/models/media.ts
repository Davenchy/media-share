import { model, Schema } from "mongoose"
import type { HydratedDocument } from "mongoose"
import { z } from "zod"

// Types //
export type MediaType = "image" | "video"

interface IMedia {
  userId: Schema.Types.ObjectId
  description: string
  likes: number
  extension: string
  mimeType: string
  sizeInBytes: number
  filePath: string
  isPrivate: boolean
  get mediaType(): MediaType
}

export type MediaDocument = HydratedDocument<IMedia>

// Schemas //
export const CreateMediaSchema = z.object({
  description: z
    .string()
    .max(300, "media description cannot exceed 300 characters")
    .optional(),
  isPrivate: z.boolean().optional(),
})

const mediaSchema = new Schema<IMedia>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, default: "", maxlength: 300 },
    likes: { type: Number, min: 0, default: 0 },
    extension: { type: String, required: true },
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
          return (this as never as IMedia).mediaType.startsWith("image")
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

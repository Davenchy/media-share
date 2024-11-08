import {
  UPLOAD_IMAGE_MAX_BYTES,
  UPLOAD_PATH,
  UPLOAD_VIDEO_MAX_BYTES,
} from "@/config"
import { join, extname } from "node:path"
import multer from "multer"

const imagesPath = join(UPLOAD_PATH, "images")
const videosPath = join(UPLOAD_PATH, "videos")
const otherPath = join(UPLOAD_PATH, "other")

const allowedImageExts = [".png", ".jpg", ".jpeg"]
const allowedVideoExts = [".mp4"]

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, imagesPath)
    } else if (file.mimetype.startsWith("video")) {
      cb(null, videosPath)
    } else {
      cb(new Error(`unsupported file type: ${file.mimetype}`), otherPath)
    }
  },
})

export const upload = multer({
  storage,
  limits: {
    fileSize: Math.max(UPLOAD_IMAGE_MAX_BYTES, UPLOAD_VIDEO_MAX_BYTES, 1e7),
  },
  fileFilter(_req, file, cb) {
    let fileExt = extname(file.originalname).toLowerCase()
    let sizeLimit = 0

    if (!fileExt) {
      fileExt = file.mimetype.startsWith("image")
        ? ".png"
        : file.mimetype.startsWith("video")
          ? ".mp4"
          : ""
      if (!fileExt) return cb(new Error("no file extension"))
    }

    if (allowedImageExts.indexOf(fileExt) !== -1)
      sizeLimit = UPLOAD_IMAGE_MAX_BYTES
    else if (allowedVideoExts.indexOf(fileExt) !== -1)
      sizeLimit = UPLOAD_VIDEO_MAX_BYTES
    else return cb(new Error(`unsupported file type: ${file.mimetype}`))

    if (file.size > sizeLimit)
      return cb(
        new Error(
          `file too large, expected: ${sizeLimit} bytes, got: ${file.size} bytes`,
        ),
      )

    cb(null, true)
  },
})

export const UploadSingle = upload.single("media")
export const UploadArray = upload.array("media", 10)

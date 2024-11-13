import { randomUUID } from "node:crypto"
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "node:fs"
import { extname, join } from "node:path"
import { UPLOAD_MAX_BYTES, UPLOAD_PATH } from "@/config"
import type { MediaType } from "@/models/media"
import logger from "@/utils/logger"
import busboy from "busboy"
import type { NextFunction, Request, Response } from "express"

// Ensure upload directory exists
mkdirSync(UPLOAD_PATH, { recursive: true })

interface UFile {
  filename: string
  originalname: string
  extension: string
  path: string
  mediaType: MediaType
  mimeType: string
  fileSize: number
}

declare global {
  namespace Express {
    interface Request {
      u_file: UFile | undefined
      // biome-ignore lint/suspicious/noExplicitAny:
      fields: { [key: string]: any }
    }
  }
}

export const allowedImageExts = ["image/png", "image/jpg", "image/jpeg"]
export const allowedVideoExts = ["video/mp4"]

/**
 * Returns media type if file mimetype is supported otherwise undefined
 */
const detectMediaType = (mimetype: string): MediaType | undefined => {
  const mediaType: MediaType | undefined = mimetype.startsWith("image/")
    ? "image"
    : mimetype.startsWith("video/")
      ? "video"
      : undefined

  if (!mediaType) return

  const src = mediaType === "image" ? allowedImageExts : allowedVideoExts
  for (const supportedMediaType of src)
    if (mimetype.startsWith(supportedMediaType)) return mediaType
}

export const FileUpload = (req: Request, res: Response, next: NextFunction) => {
  const bb = busboy({ headers: req.headers })
  let hasFile = false
  let fileSize = 0

  req.fields = {}
  req.u_file = undefined
  let aborted: { status: number; error: string } | undefined = undefined

  bb.on("file", (fieldname, file, info) => {
    // only accept one file which is set to the `media` field
    if (fieldname !== "media" || hasFile) return file.resume()

    // now we got a file
    hasFile = true

    // check file type
    const mediaType = detectMediaType(info.mimeType)
    if (!mediaType) {
      aborted = { status: 415, error: "Unsupported file type" }
      file.resume()
      return
    }

    // generate some metadata
    const filename = randomUUID()
    const savePath = join(UPLOAD_PATH, filename)
    const writeStream = createWriteStream(savePath)

    file.on("data", data => {
      if (aborted) return

      fileSize += data.length

      if (fileSize > UPLOAD_MAX_BYTES) {
        aborted = { status: 413, error: "File too large" }
        writeStream.destroy()
        unlinkSync(savePath)
      }

      if (!writeStream.destroyed) writeStream.write(data)
    })

    file.on("end", () => {
      writeStream.end()
      if (!aborted) {
        req.u_file = {
          filename,
          originalname: info.filename,
          extension: extname(info.filename),
          path: savePath,
          mediaType,
          fileSize: fileSize,
          mimeType: info.mimeType,
        }
      } else if (existsSync(savePath)) unlinkSync(savePath)
    })

    file.on("error", err => {
      logger.error("busboy file upload error:", err)
      if (aborted) return
      aborted = { status: 500, error: "Error processing file" }
      if (existsSync(savePath)) unlinkSync(savePath)
    })
  })

  bb.on("field", (fieldname, val) => {
    req.fields[fieldname] = val
  })

  bb.on("finish", () => {
    if (!aborted) {
      if (!req.u_file)
        return res.status(400).json({ error: "No file uploaded" })
      next()
    } else {
      res.status(aborted.status).json({ error: aborted.error })
    }
  })

  bb.on("error", err => {
    logger.error("busboy error:", err)
    res.status(500).json({ error: "Upload failed" })
  })

  req.pipe(bb)
}

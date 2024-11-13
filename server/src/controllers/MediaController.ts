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



  delete() {}

  allMedia() {}

  @AsyncHandler
  async stream(req: Request, res: Response) {
    const media = req.media
    if (!media) throw new Error("Use MediaGuard")
    res.sendFile(resolve(media.filePath))
  }
}

export default new MediaController()

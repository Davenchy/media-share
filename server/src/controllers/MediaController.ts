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

  stream() {}
}

export default new MediaController()

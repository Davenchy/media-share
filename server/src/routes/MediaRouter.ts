import { Router } from "express"
import MediaController from "controller/MediaController"
import { MediaGuard } from "@/middlewares/media_guard"
import { MediaAcccessGuard } from "@/middlewares/media_access_guard"
import { FileUpload } from "@/middlewares/file_upload"
import { FindMediaLike } from "@/middlewares/find_media_like"

const router = Router()

router.post("/", FileUpload, MediaController.upload)
router.get("/", MediaController.allMedia)

router.get(
  "/:mediaId",
  MediaGuard,
  MediaAcccessGuard("OnlyIfPublic"),
  FindMediaLike,
  MediaController.metadata,
)
router.patch(
  "/:mediaId",
  MediaGuard,
  MediaAcccessGuard("OnlyOwner"),
  MediaController.update,
)
router.delete(
  "/:mediaId",
  MediaGuard,
  MediaAcccessGuard("OnlyOwner"),
  FindMediaLike,
  MediaController.delete,
)

router.get(
  "/:mediaId/stream",
  MediaGuard,
  MediaAcccessGuard("OnlyIfPublic"),
  MediaController.stream,
)

export default router

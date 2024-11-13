import { Router } from "express"
import MediaController from "controller/MediaController"
import { MediaGuard } from "@/middlewares/media_guard"
import { MediaAcccessGuard } from "@/middlewares/media_access_guard"
import { FileUpload } from "@/middlewares/file_upload"
import { FindMediaLike } from "@/middlewares/find_media_like"
import { MediaAcccessGuard } from "@/middlewares/media_access_guard"
import { ValidateBody } from "@/middlewares/validate_body"
import { UpdateMediaSchema } from "@/models/media"

const router = Router()

router.post("/", FileUpload, MediaController.upload)
router.get("/", MediaController.allMedia)

router.put(
  "/:mediaId",
  MediaGuard,
  MediaAcccessGuard("OnlyOwner", "Forbidden"),
  ValidateBody(UpdateMediaSchema),
  MediaController.update,
)
router.delete(
  "/:mediaId",
  MediaGuard,
  MediaAcccessGuard("OnlyOwner", "Forbidden"),
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

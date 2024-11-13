import { Router } from "express"
export type { Request, Response, NextFunction } from "express"
import { FileUpload } from "@/middlewares/file_upload"
import { FindMediaLike } from "@/middlewares/find_media_like"
import { MediaAcccessGuard } from "@/middlewares/media_access_guard"
import { MediaGuard } from "@/middlewares/media_guard"
import MediaController from "controller/MediaController"
import MediaLikesRouter from "./MediaLikesRouter"
import { ValidateBody } from "@/middlewares/validate_body"
import { UpdateMediaSchema } from "@/models/media"

const router = Router()

router.post("/", FileUpload, MediaController.upload)
router.get("/", MediaController.allMedia)
router.get("/my", MediaController.myMedia)
router.get("/liked", MediaController.likedMedia)

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

router.use(
  "/:mediaId/likes",
  MediaGuard,
  MediaAcccessGuard("OnlyIfPublic"),
  MediaLikesRouter,
)

export default router

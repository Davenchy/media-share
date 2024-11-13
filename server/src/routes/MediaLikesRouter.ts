import MediaLikesController from "controller/MediaLikesController"
import { Router } from "express"
import { FindMediaLike } from "middleware/find_media_like"

const router = Router()

router.post("/", FindMediaLike, MediaLikesController.like)
router.delete("/", FindMediaLike, MediaLikesController.unlike)

export default router

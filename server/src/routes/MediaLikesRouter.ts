import { Router } from "express"
import MediaLikesController from "controller/MediaLikesController"
import { FindMediaLike } from "middleware/find_media_like"

const router = Router()

router.get("/likes", MediaLikesController.getAllLikes)
router.post("/likes", FindMediaLike, MediaLikesController.like)
router.delete("/likes", FindMediaLike, MediaLikesController.unlike)

export default router

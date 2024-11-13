import type mongoose from "mongoose"
import type { Request } from "express"

export const useMediaPagination = <T>(
  aggregate: mongoose.Aggregate<T>,
  page: number,
  limit: number,
): mongoose.Aggregate<T> =>
  aggregate
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit)

export const useMediaOwner = <T>(
  aggregate: mongoose.Aggregate<T>,
  userId: mongoose.Types.ObjectId,
): mongoose.Aggregate<T> =>
  aggregate
    .lookup({
      as: "owner",
      from: "users",
      localField: "userId",
      foreignField: "_id",
      pipeline: [{ $project: { username: 1, email: 1, id: "$_id", _id: 0 } }],
    })
    .unwind("owner")
    .addFields({ isOwner: { $eq: ["$owner.id", userId] } })
    .project({ userId: 0 })

export const useMediaLikes = <T>(
  aggregate: mongoose.Aggregate<T>,
  userId: mongoose.Types.ObjectId,
): mongoose.Aggregate<T> =>
  aggregate
    .lookup({
      from: "medialikes",
      let: { mediaId: "$_id", userId },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ["$mediaId", "$$mediaId"] }],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            as: "user",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { email: 1, username: 1, id: "$_id", _id: 0 } },
            ],
          },
        },
        { $unwind: "$user" },
        { $replaceRoot: { newRoot: "$user" } },
      ],
      as: "likedBy",
    })
    .addFields({
      id: "$_id",
      likes: { $size: "$likedBy" },
      isLiked: {
        $anyElementTrue: {
          $map: {
            input: "$likedBy",
            as: "user",
            in: { $eq: ["$$user.id", userId] },
          },
        },
      },
    })

export const useCleanMediaFields = <T>(
  aggregate: mongoose.Aggregate<T>,
): mongoose.Aggregate<T> =>
  aggregate.project({
    __v: 0,
    _id: 0,
    filePath: 0,
    userId: 0,
    updatedAt: 0,
  })

export const parseRequestPaginationQueries = (
  req: Request,
): { page: number; limit: number } => {
  // page must be a number >= 0. default is zero
  const page = Math.max(0, Number(req.query.page) || 0)
  // limit must be a number. 50 <= limit <= 10. default is 20
  const limit = Math.min(50, Math.max(10, Number(req.query.limit) || 20))

  return { page, limit }
}

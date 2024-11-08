import logger from "@/utils/logger"
import type { NextFunction, Request, Response } from "express"

export const NotFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: "route not found" })
}

export const ErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error("internal server error:", err)
  res.status(500).json({ message: "internal server error" })
}

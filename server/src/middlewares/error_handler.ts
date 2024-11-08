import logger from "@/utils/logger"
import type { NextFunction, Request, Response } from "express"

/**
 * Express middleware to handle not found routes
 * returns status 404 and "route not found" message
 */
export const NotFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: "route not found" })
}

/**
 * Express middleware to handle errors
 * it logs using winston and returns status 500 with "internal server error"
 * message
 */
export const ErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error("internal server error:", err)
  res.status(500).json({ message: "internal server error" })
}

import type { NextFunction, Request, Response } from "express"

export const AsyncHandler = (
  _target: object,
  _key: string,
  desc: PropertyDescriptor,
) => {
  const handler = desc.value
  desc.value = async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

import logger from "@/utils/logger"
import { logger as middleware } from "express-winston"

export const LoggerMiddleware = middleware({
  winstonInstance: logger,
  meta: false,
  msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
  expressFormat: true, // if **true**, disables `msg`
})

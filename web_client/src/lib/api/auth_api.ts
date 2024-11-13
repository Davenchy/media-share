import {
  EmailIsTaken,
  InvalidCredentialsError,
  LoginSuccess,
  OK,
  UnexpectedError,
  ValidationError,
  api,
} from "./api"
import type { APIResponse } from "./api"

export const login = async (
  email: string,
  password: string,
): Promise<APIResponse> =>
  api
    .post("/login", { email, password })
    .then(async res => {
      switch (res.status) {
        case 200:
          return new LoginSuccess(res.data.accessToken, res.data.refreshToken)
        case 400:
          return new ValidationError(res.data.errors)
        case 401:
          return new InvalidCredentialsError()
        default:
          return new UnexpectedError(undefined, res.status)
      }
    })
    .catch(err => new UnexpectedError(err, 0))

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<APIResponse> =>
  api
    .post("/register", { username, email, password })
    .then(async res => {
      switch (res.status) {
        case 201:
          return new OK()
        case 400:
          return new ValidationError(res.data.errors)
        case 401:
          return new InvalidCredentialsError()
        case 409:
          return new EmailIsTaken()
        default:
          return new UnexpectedError()
      }
    })
    .catch(() => new UnexpectedError())

export const refresh = async (refreshToken: string): Promise<APIResponse> =>
  api
    .post("/refresh-token", { refreshToken })
    .then(async res => {
      switch (res.status) {
        case 200:
          return new LoginSuccess(res.data.accessToken, res.data.refreshToken)
        default:
          return new UnexpectedError()
      }
    })
    .catch(() => new UnexpectedError())

import {
  EmailIsTaken,
  InvalidCredentialsError,
  LoginSuccess,
  UnexpectedError,
  ValidationError,
  api,
} from "./api"
import type { APIResponse, IUser } from "./api"

export const login = async (
  email: string,
  password: string,
): Promise<APIResponse> =>
  api
    .post("/login", { email, password })
    .then(
      async ({ data }) => new LoginSuccess(data.accessToken, data.refreshToken),
    )
    .catch(({ response: res }) => {
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

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<APIResponse> =>
  api
    .post("/register", { username, email, password })
    .then(async res => res.data)
    .catch(({ response: res }) => {
      switch (res.status) {
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

export const refresh = async (refreshToken: string): Promise<APIResponse> =>
  api
    .post("/refresh-token", { refreshToken })
    .then(({ data }) => new LoginSuccess(data.accessToken, data.refreshToken))

/**
 * API endpoint to fetch the user data
 * Returns user object if succeeded
 */
export const fetchUser = async (token: string): Promise<IUser> =>
  api
    .get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)

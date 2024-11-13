import { BASE_URL } from "@/constants"
import axios from "axios"

export const api = axios.create({
  baseURL: BASE_URL,
})

// types //
export interface IUser {
  id: string
  username: string
  email: string
}

export interface IMedia {
  id: string
  filename: string
  caption: string
  likes: number
  isPrivate: boolean
  mimeType: string
  sizeInBytes: number
  createdAt: string
  owner: IUser
  isOwner: boolean
  isLiked: boolean
}

// responses handling //

// !TODO: Use better solution for handling different responses
export abstract class APIResponse {}

export class OK extends APIResponse {}
export class ValidationError extends APIResponse {
  constructor(public errors: { [k: string]: string }) {
    super()
  }

  toPairs<T>(): [keyof T, string][] {
    return Object.entries(this.errors).map(([key, value]) => [key, value]) as [
      keyof T,
      string,
    ][]
  }
}
export class UnexpectedError extends APIResponse {
  constructor(
    public error?: Error,
    public status?: number,
  ) {
    super()
  }
}

export class LoginSuccess extends APIResponse {
  constructor(
    public token: string,
    public refreshToken: string,
  ) {
    super()
  }
}
export class InvalidCredentialsError extends APIResponse {}
export class EmailIsTaken extends APIResponse {}

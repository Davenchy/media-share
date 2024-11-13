import { api } from "./api"
import { OK, UnexpectedError, ValidationError } from "./api"
import type { APIResponse, IMedia } from "./api"

export const upload = async (
  token: string,
  media: File,
  caption?: string,
  isPrivate?: boolean,
): Promise<IMedia> => {
  const formData = new FormData()

  if (caption) formData.append("caption", caption)
  if (isPrivate) formData.append("isPrivate", String(isPrivate || false))
  formData.append("media", media)

  return api
    .post("/media", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      if (res.status === 201) return res.data
      throw res
    })
}

export const updateMedia = (
  token: string,
  mediaId: string,
  caption: string,
  isPrivate: boolean,
): Promise<APIResponse> =>
  api
    .put(
      `/media/${mediaId}`,
      { caption, isPrivate },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    .then(res => {
      if (res.status === 200) return new OK()
      if (res.status === 400) return new ValidationError(res.data)
      return new UnexpectedError(undefined, res.status)
    })
    .catch(err => new UnexpectedError(err))

export const allMedia = (token: string) =>
  api
    .get("/media", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.status === 200) return res.data
      throw res
    })

export const myMedia = (token: string) =>
  api
    .get("/media/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.status === 200) return res.data
      throw res
    })

export const likedMedia = (token: string) =>
  api
    .get("/media/liked", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.status === 200) return res.data
      throw res
    })

export const streamFile = (token: string, mediaId: string): Promise<Blob> =>
  api
    .get(`/media/${mediaId}/stream`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    })
    .then(res => {
      if (res.status === 200) return res.data
      throw res
    })

export const removeMedia = async (token: string, mediaId: string) =>
  api
    .delete(`/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.status === 204) return
      throw res
    })

export const like = async (token: string, mediaId: string) =>
  api
    .post(`/media/${mediaId}/likes`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.status === 200) return
      throw res
    })

export const unlike = async (token: string, mediaId: string) =>
  api
    .delete(`/media/${mediaId}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.status === 200) return
      throw res
    })

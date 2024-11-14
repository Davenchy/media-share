import { uploadMedia } from "@/lib/api/media_api"
import { useUser } from "./use-user"
import { useEffect, useState } from "react"

export interface UploadPayload {
  media: File
  caption?: string
  isPrivate?: boolean
}

export interface ProgressInfo {
  /** from 0% to 100% */
  progress: number
  /** in bytes */
  totalLength: number
  /** in bytes */
  uploaded: number
  /** in seconds */
  estimatedTime: number
  /** bytes per second */
  speed: number
}

const DEFAULT_PROGRESS_INFO: ProgressInfo = {
  progress: 0,
  totalLength: 0,
  uploaded: 0,
  estimatedTime: 0,
  speed: 0,
}

export type UploadState =
  | { state: "Idle" }
  | { state: "Finished" }
  | { state: "Error" }
  | {
      state: "Uploading"
      abortController: AbortController
      progressInfo: ProgressInfo
    }

let currentState: UploadState = { state: "Idle" }
const listeners: ((state: UploadState) => void)[] = []

const updateState = (newState: UploadState) => {
  currentState = newState
  for (const listener of listeners) listener(currentState)
}

export const upload = async (token: string, payload: UploadPayload) => {
  const abortController = new AbortController()

  updateState({
    state: "Uploading",
    abortController,
    progressInfo: DEFAULT_PROGRESS_INFO,
  })

  await uploadMedia(
    token,
    payload.media,
    payload.caption,
    payload.isPrivate,
    abortController.signal,
    ev => {
      updateState({
        state: "Uploading",
        abortController,
        progressInfo: {
          progress: (ev.progress ?? 0) * 100,
          estimatedTime: ev.estimated ?? 0,
          uploaded: ev.loaded ?? 0,
          totalLength: ev.total ?? 0,
          speed: ev.rate ?? 0,
        },
      })
    },
  )
    .then(() => {
      updateState({ state: "Finished" })
    })
    .catch(err => {
      updateState({ state: "Error" })
      throw err
    })
}

export const useUpload = () => {
  const { token } = useUser()
  const [state, setState] = useState<UploadState>(currentState)

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [state])

  return {
    upload: (payload: UploadPayload) => upload(token, payload),
    cancel() {
      if (currentState.state === "Uploading")
        currentState.abortController.abort()
    },
    get info(): ProgressInfo {
      if (currentState.state !== "Uploading") return DEFAULT_PROGRESS_INFO
      return currentState.progressInfo
    },
    isUploading: state.state === "Uploading",
    isError: state.state === "Error",
    isFinished: state.state === "Finished",
  }
}

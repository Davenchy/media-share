import type { GenericAbortSignal } from "axios"
import { api, OK, UnexpectedError } from "./api"
import type { APIResponse } from "./api"

export const serverSentEvents = async (
  token: string,
  abortSignal: GenericAbortSignal,
  onEvent: () => void,
): Promise<APIResponse> =>
  api
    .get("/events", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      responseType: "stream",
      adapter: "fetch",
      signal: abortSignal,
    })
    .then(async res => {
      console.log("connected to events channel")
      const stream = res.data as ReadableStream
      const reader = stream.getReader()

      while (true) {
        const { done } = await reader.read()
        if (done) break
        onEvent()
      }

      return new OK()
    })
    .catch(err => {
      console.error("EventsError", err.message)
      return new UnexpectedError(undefined, 0)
    })

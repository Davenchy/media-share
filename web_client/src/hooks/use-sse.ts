import { serverSentEvents } from "@/lib/api/events_api"
import { useEffect, useState } from "react"
import { useUser } from "./use-user"
import { useQueryClient } from "@tanstack/react-query"

export function useSSE() {
  const { token, isLoggedIn } = useUser()
  const [isConnected, setIsConnected] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isLoggedIn) return () => {}

    const abortController = new AbortController()

    const handler = () => queryClient.refetchQueries({ queryKey: ["media"] })

    serverSentEvents(token, abortController.signal, handler)
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false))

    return () => abortController.abort()
  }, [token, isLoggedIn, queryClient])

  return { isConnected }
}

import { useQuery } from "@tanstack/react-query"
import * as MediaAPI from "@/lib/api/media_api"
import { useEffect } from "react"
import { useUser } from "@/hooks/use-user"

export function MediaSource({
  mediaId,
  children,
}: { mediaId: string; children: (src: string) => React.ReactNode }) {
  const { token } = useUser()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["media-stream", mediaId, "stream"],
    queryFn: async () => {
      const blob = await MediaAPI.streamFile(token, mediaId)
      return URL.createObjectURL(blob)
    },
  })

  useEffect(() => {
    return () => {
      if (data) URL.revokeObjectURL(data)
    }
  }, [data])

  if (isLoading) {
    return <div className="bg-purple-900 animate-pulse h-64" />
  }

  if (isError || !data) {
    return (
      <div className="bg-red-900 h-64 flex place-items-center place-content-center">
        <p className="text-3xl font-bold ">Failed to load the media!</p>
      </div>
    )
  }

  return children(data)
}

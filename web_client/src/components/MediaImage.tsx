import { useQuery } from "@tanstack/react-query"
import * as MediaAPI from "@/lib/api/media_api"
import { useEffect } from "react"
import { useUser } from "@/hooks/use-user"

export function MediaImage({ mediaId, alt }: { mediaId: string; alt: string }) {
  const { token } = useUser()
  const { data } = useQuery({
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

  return <img className="w-full" src={data} alt={alt} />
}

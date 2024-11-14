import { useUpload } from "@/hooks/use-upload"
import { sizeFormat } from "@/lib/utils"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import { CircleX } from "lucide-react"

export function Metrics({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-bold">{label}</span>: {value}
    </div>
  )
}

export function UploaderMetrices() {
  const {
    info: { progress, estimatedTime, uploaded, totalLength, speed },
    isUploading,
    cancel,
  } = useUpload()

  if (!isUploading) return null

  return (
    <>
      <div className="w-full max-w-screen-md h-[2px] mx-auto my-2 bg-gray-800 rounded" />
      <div className="py-2 px-4 mx-auto w-full max-w-screen-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Metrics
            label="Uploaded"
            value={`${sizeFormat(uploaded)} / ${sizeFormat(totalLength)}`}
          />
          <Metrics label="Speed" value={`${sizeFormat(speed)}/s`} />
          <Metrics label="Est. Time" value={`${estimatedTime.toFixed(0)}s`} />
        </div>
        <div className="flex items-center gap-x-4">
          <Progress value={progress} />
          <p>{progress.toFixed(1)}%</p>
          <Button size="icon" variant="ghost" onClick={cancel} type="button">
            <CircleX color="#f00060" />
          </Button>
        </div>
      </div>
    </>
  )
}

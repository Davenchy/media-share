export function Media({ src, mimeType }: { src: string; mimeType: string }) {
  const isImage = mimeType.startsWith("image")
  const isVideo = mimeType.startsWith("video")

  if (isImage) {
    return <img src={src} alt="media" className="w-full h-full " />
  }

  if (isVideo) {
    // biome-ignore lint/a11y/useMediaCaption:
    return <video src={src} controls className="w-full h-full" />
  }

  return (
    <div className="bg-red-900 h-64 flex place-items-center place-content-center">
      <p className="text-1xl font-bold ">Unsupported Media Type {mimeType}</p>
    </div>
  )
}

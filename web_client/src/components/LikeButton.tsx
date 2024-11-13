import { Heart } from "lucide-react"
import { Button } from "./ui/button"

export function LikeButton({
  isLiked,
  onClick,
  disabled,
}: { isLiked: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      disabled={disabled}
      onClick={onClick}
    >
      <Heart
        size={36}
        color={isLiked ? "red" : "white"}
        fill={isLiked ? "red" : "transparent"}
        strokeWidth={3}
      />
    </Button>
  )
}

import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import type { IMedia } from "@/lib/api/api"
import * as MediaAPI from "@/lib/api/media_api"
import { likesFormat } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EllipsisVertical, LockKeyhole, Pencil, Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui/card"
import { LikeButton } from "../LikeButton"
import { UserAvatar } from "../UserAvatar"
import { Button } from "../ui/button"
import { DialogTrigger } from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MediaEditDialog } from "./EditMediaDialog"

function MediaCardActionsMenu({ media }: { media: IMedia }) {
  const { token } = useUser()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const removeMedia = async () => {
    await MediaAPI.removeMedia(token, media.id)
    await queryClient.refetchQueries({ queryKey: ["media"] })
    toast({
      title: "Media removed",
      description: "You just removed a memory",
      variant: "success",
      duration: 2000,
    })
  }

  return (
    <MediaEditDialog media={media}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger asChild>
            <DropdownMenuItem className="text-blue-500">
              <Pencil /> Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem className="text-red-500" onClick={removeMedia}>
            <Trash2 /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </MediaEditDialog>
  )
}

export function MediaCard({
  media,
  children,
}: { media: IMedia; children: React.ReactNode }) {
  const { token } = useUser()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: async ({ shouldSet }: { shouldSet: boolean }) => {
      const method = shouldSet ? MediaAPI.like : MediaAPI.unlike
      await method(token, media.id)
      await queryClient.refetchQueries({ queryKey: ["media"] })
    },
  })

  const onLike = async () => {
    likeMutation.mutate({ shouldSet: !media.isLiked })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <UserAvatar username={media.owner.username} />
          <div className="flex items-center gap-x-2">
            {media.isPrivate && (
              <p className="text-purple-500 text-sm flex items-center gap-x-2">
                <LockKeyhole />
                Private
              </p>
            )}
            {media.isOwner && <MediaCardActionsMenu media={media} />}
          </div>
        </CardTitle>
        {media.caption && (
          <CardDescription className="pt-4">{media.caption}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-0 h-[280px] sm:h-[400px] w-full overflow-hidden">
        {children}
      </CardContent>
      <CardFooter className="space-x-2 flex flex-row-reverse">
        <p>{likesFormat(media.likes)}</p>
        <LikeButton isLiked={media.isLiked} onClick={onLike} />
      </CardFooter>
    </Card>
  )
}

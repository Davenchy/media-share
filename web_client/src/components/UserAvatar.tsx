import { Avatar, AvatarFallback } from "./ui/avatar"

export function UserAvatar({ username }: { username: string }) {
  const avatar = username[0] + username[username.length - 1]

  return (
    <div className="flex items-center gap-x-4">
      <Avatar>
        <AvatarFallback>{avatar.toUpperCase()}</AvatarFallback>
      </Avatar>
      {username}
    </div>
  )
}

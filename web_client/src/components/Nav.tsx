import { useUser } from "@/hooks/use-user"
import { ChevronDown, LogOut } from "lucide-react"
import { UserAvatar } from "./UserAvatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function NavBar() {
  const { user, logout } = useUser()

  return (
    <nav className="flex flex-col sm:flex-row sm:justify-between gap-y-4 p-4 bg-primary items-center">
      <h1 className="font-bold text-3xl">MediaShare</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2">
          <UserAvatar username={user.username} />
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={logout}>
            <LogOut />
            LogOut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

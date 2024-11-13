import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { LogOut, ChevronDown } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { UserAvatar } from "./UserAvatar"

export function NavBar() {
  const { user, logout } = useUser()

  return (
    <nav className="flex justify-between p-4 bg-primary items-center">
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

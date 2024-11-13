import { Toaster } from "./components/ui/toaster"
import { useUser } from "./hooks/use-user"
import { AuthView } from "./views/AuthView"
function App() {
  const { isLoggedIn, isLoggedOut, isChecking, restoreSession, state } =
    useUser()

  // try to restore the last session if possible otherwise logout
  if (state === "IDLE") restoreSession()

  // Loading screen
  if (isChecking) {
    return (
      <div className="place-content-center h-lvh px-2">
        <div className="md:max-w-screen-sm mx-auto space-y-8">
          <p className="text-primary text-3xl md:text-6xl font-bold text-center animate-pulse">
            MediaShare
          </p>
        </div>
      </div>
    )
  }

  if (isLoggedIn) {
  }

  if (isLoggedOut)
    return (
      <>
        <Toaster />
        <AuthView />
      </>
    )

  const removeLocalStorage = () => {
    localStorage.clear()
    location.reload()
  }

  return (
    <div className="place-content-center h-lvh px-2">
      <div className="md:max-w-screen-sm mx-auto p-4 rounded space-y-8 bg-primary-foreground">
        <p className="text-red-600 text-3xl md:text-6xl font-bold text-center">
          Error
        </p>
        <p className="text-destructive text-center">
          Something went wrong, try to remove the app cache, then try again.
        </p>
        <div className="flex flex-row-reverse">
          <Button onClick={removeLocalStorage}>Clear Cached Data</Button>
        </div>
      </div>
    </div>
  )
}

export default App

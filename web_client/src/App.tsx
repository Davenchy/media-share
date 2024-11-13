import { MediaUploader } from "./components/MediaUploader"
import { Toaster } from "./components/ui/toaster"
import { useUser } from "./hooks/use-user"
import { AuthView } from "./views/AuthView"
import { ContentView } from "./views/ContentView"

function App() {
  const { isLoggedIn, isChecking, restoreSession, state } = useUser()

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
    return (
      <>
        <ContentView />
        <MediaUploader />
        <Toaster />
      </>
    )
  }

  return (
    <>
      <Toaster />
      <AuthView />
    </>
  )
}

export default App

import { ContentNav } from "@/components/ContentNav"
import * as MediaAPI from "@/lib/api/media_api"
import { useState } from "react"
import { NavBar } from "../components/Nav"
import { MediaView } from "./MediaView"

export function ContentView() {
  const [tabIndex, setTabIndex] = useState(0)

  const tabs = ["All Media", "My Media", "Liked Media"]

  return (
    <main className="mx-auto md:max-w-screen-sm h-full bg-secondary">
      <NavBar />
      <div className="p-4 h-full space-y-4">
        <ContentNav
          tabs={tabs}
          tabIndex={tabIndex}
          onTabIndexChange={setTabIndex}
        />
        {tabIndex === 0 && <MediaView endpoint={MediaAPI.allMedia} />}
        {tabIndex === 1 && <MediaView endpoint={MediaAPI.myMedia} />}
        {tabIndex === 2 && <MediaView endpoint={MediaAPI.likedMedia} />}
      </div>
    </main>
  )
}

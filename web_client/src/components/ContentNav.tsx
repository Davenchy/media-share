import { Button } from "./ui/button"

export function ContentNavButton({
  label,
  isActive,
  onActive,
}: { label: string; isActive?: boolean; onActive?: () => void }) {
  return (
    <Button
      className="w-full font-bold"
      variant={isActive ? "default" : "ghost"}
      onClick={onActive}
    >
      {label}
    </Button>
  )
}

export type OnTabIndexChange = (tabIndex: number) => void
export function ContentNav({
  tabs,
  tabIndex,
  onTabIndexChange,
}: {
  tabs: string[]
  tabIndex?: number
  onTabIndexChange?: OnTabIndexChange
}) {
  return (
    <div className="flex place-content-stretch bg-gray-700 space-x-2 p-2 rounded">
      {tabs.map((label, i) => (
        <ContentNavButton
          key={label}
          label={label}
          isActive={i === tabIndex}
          onActive={() => {
            if (onTabIndexChange && i !== tabIndex) onTabIndexChange(i)
          }}
        />
      ))}
    </div>
  )
}

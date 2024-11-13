import { Button } from "ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "ui/card"

export const FormCard = ({
  title,
  children,
  submitLabel,
  toggleLabel,
  isLoading,
  toggleAction,
}: {
  title: string
  children: React.ReactNode
  submitLabel: string
  toggleLabel: string
  isLoading: boolean
  toggleAction: () => void
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" disabled={isLoading}>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={toggleAction}
        >
          {toggleLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

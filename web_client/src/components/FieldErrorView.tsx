export const FieldErrorView = ({ error }: { error?: string }) => {
  if (!error) return null
  return <p className="text-red-600 text-sm">{error}</p>
}

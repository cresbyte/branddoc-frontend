// Create pages handle their own layout — no shared sidebar/header
export default function CreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

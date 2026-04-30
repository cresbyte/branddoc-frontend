// This layout intentionally has no sidebar or header —
// the Branddoc dashboard page renders its own top navigation bar.
export default function BranddocDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

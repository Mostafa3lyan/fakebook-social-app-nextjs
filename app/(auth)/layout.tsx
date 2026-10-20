export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 overflow-x-hidden">
      {children}
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { ThemeToggle } from "./theme-toggle"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      {/* Top bar with logo and theme toggle */}
      <header className="flex w-full max-w-lg items-center justify-between pb-6 pt-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading font-extrabold text-2xl text-primary tracking-tight transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md p-1"
          aria-label="Fakebook Home"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Image
              src="/facebook.png"
              alt="Fakebook Logo"
              width={36}
              height={36}
              priority
              className="size-9 rounded-full object-contain"
            />
          </div>
          <span>fakebook</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main card */}
      <main className="w-full flex-1 flex items-center justify-center py-2">
        <Card className={cn("w-full max-w-md shadow-md border-border/80 transition-all", className)}>
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle>
              <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
                {title}
              </h1>
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {children}
            {footer && <div className="pt-2">{footer}</div>}
          </CardContent>
        </Card>
      </main>

      {/* Footer spacer/copyright */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground">
        Fakebook &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}

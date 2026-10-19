import Link from "next/link"
import { LogIn, UserPlus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex min-h-[85vh] w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg space-y-6 text-center">
        {/* Logo / Brand header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Fakebook Social Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            Connect. Share. Express.
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Experience real-time reactions, rich media posts, threaded discussions, and seamless identity security.
          </p>
        </div>

        {/* Action card */}
        <Card className="border shadow-lg text-left">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Welcome to Fakebook</CardTitle>
            <CardDescription>
              Sign in with your verified credentials or create a new account to join the conversation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="flex-1 font-medium">
              <Link href="/login">
                <LogIn className="size-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 font-medium">
              <Link href="/signup">
                <UserPlus className="size-4 mr-2" />
                Create Account
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground">
          Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px]">d</kbd> anywhere to toggle dark mode
        </div>
      </div>
    </main>
  )
}

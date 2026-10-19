"use client"

import * as React from "react"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("[Application Error]", error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-6" />
          </div>
          <CardTitle className="text-xl font-semibold">Something went wrong</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            An unexpected error occurred while loading this page.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground font-mono break-all max-h-32 overflow-auto">
            {error.message || "Unknown error"}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="default" onClick={() => reset()} className="w-full sm:w-auto">
            <RotateCcw className="size-4 mr-2" />
            Try again
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="size-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

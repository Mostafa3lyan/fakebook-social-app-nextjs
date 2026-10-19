import Link from "next/link"
import { Home, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Compass className="size-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">404 - Page Not Found</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            The page or content you are looking for does not exist or may have been removed.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Check the link or return to the feed to explore the latest posts.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="size-4 mr-2" />
              Go to Feed
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

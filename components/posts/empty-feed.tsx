import { Sparkles, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyFeedProps {
  title?: string
  description?: string
}

export function EmptyFeed({
  title = "No posts to show yet",
  description = "When friends share updates or photos, they'll appear here on your feed.",
}: EmptyFeedProps) {
  return (
    <Card className="border-dashed border-border/80 bg-muted/20">
      <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-3">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
          <MessageSquare className="size-7" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground flex items-center justify-center gap-1.5">
            <span>{title}</span>
            <Sparkles className="size-4 text-amber-500" aria-hidden="true" />
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

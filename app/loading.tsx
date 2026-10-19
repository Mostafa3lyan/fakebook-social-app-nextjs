import { Loader2 } from "lucide-react"

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        <div className="size-12 rounded-full border-2 border-primary/20 animate-ping" />
        <Loader2 className="absolute size-6 animate-spin text-primary" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading Fakebook...
      </p>
    </div>
  )
}

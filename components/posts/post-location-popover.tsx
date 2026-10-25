"use client"

import * as React from "react"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface PostLocationPopoverProps {
  locationName: string
  onApplyLocation: (name: string) => void
  disabled?: boolean
}

export function PostLocationPopover({
  locationName,
  onApplyLocation,
  disabled,
}: PostLocationPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [tempLocation, setTempLocation] = React.useState(locationName)

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setTempLocation(locationName)
    }
    setOpen(isOpen)
  }

  const handleApply = () => {
    onApplyLocation(tempLocation.trim())
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="size-9 rounded-full text-rose-500 hover:bg-rose-500/10 cursor-pointer min-h-11 min-w-11"
          aria-label="Add or edit location"
        >
          <MapPin className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-3 space-y-2.5">
        <p className="text-xs font-semibold text-foreground">Where are you?</p>
        <div className="flex items-center gap-1.5">
          <Input
            placeholder="e.g. Cairo, Egypt"
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleApply()
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="h-8 px-2.5 text-xs font-semibold"
          >
            Set
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import { Globe, Users, Lock } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PostVisibilityEnum } from "@/lib/types"

interface PostVisibilitySelectProps {
  value: PostVisibilityEnum
  onChange: (value: PostVisibilityEnum) => void
  disabled?: boolean
}

export function PostVisibilitySelect({
  value,
  onChange,
  disabled,
}: PostVisibilitySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as PostVisibilityEnum)}
      disabled={disabled}
    >
      <SelectTrigger className="h-7 w-28.75 px-2 text-xs rounded-full bg-muted/60 hover:bg-muted border-border font-medium">
        <SelectValue placeholder="Audience" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={PostVisibilityEnum.PUBLIC}>
          <div className="flex items-center gap-1.5 text-xs">
            <Globe className="size-3 text-muted-foreground" />
            <span>Public</span>
          </div>
        </SelectItem>
        <SelectItem value={PostVisibilityEnum.FRIENDS}>
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="size-3 text-muted-foreground" />
            <span>Friends</span>
          </div>
        </SelectItem>
        <SelectItem value={PostVisibilityEnum.ONLY_ME}>
          <div className="flex items-center gap-1.5 text-xs">
            <Lock className="size-3 text-muted-foreground" />
            <span>Only Me</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

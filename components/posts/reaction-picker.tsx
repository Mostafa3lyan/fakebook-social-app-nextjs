"use client"

import * as React from "react"
import { ReactionTypeEnum } from "@/lib/types"
import { cn } from "@/lib/utils"

export const REACTION_CONFIG: Record<
  ReactionTypeEnum,
  {
    label: string
    emoji: string
    color: string
    activeColor: string
    bgColor: string
  }
> = {
  [ReactionTypeEnum.LIKE]: {
    label: "Like",
    emoji: "👍",
    color: "text-blue-600 dark:text-blue-400",
    activeColor: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]",
  },
  [ReactionTypeEnum.LOVE]: {
    label: "Love",
    emoji: "❤️",
    color: "text-rose-600 dark:text-rose-400",
    activeColor: "text-[#F02849]",
    bgColor: "bg-[#F02849]",
  },
  [ReactionTypeEnum.CARE]: {
    label: "Care",
    emoji: "🥰",
    color: "text-amber-500 dark:text-amber-400",
    activeColor: "text-[#F7B125]",
    bgColor: "bg-[#F7B125]",
  },
  [ReactionTypeEnum.HAHA]: {
    label: "Haha",
    emoji: "😂",
    color: "text-amber-500 dark:text-amber-400",
    activeColor: "text-[#F7B125]",
    bgColor: "bg-[#F7B125]",
  },
  [ReactionTypeEnum.WOW]: {
    label: "Wow",
    emoji: "😮",
    color: "text-amber-500 dark:text-amber-400",
    activeColor: "text-[#F7B125]",
    bgColor: "bg-[#F7B125]",
  },
  [ReactionTypeEnum.SAD]: {
    label: "Sad",
    emoji: "😢",
    color: "text-amber-500 dark:text-amber-400",
    activeColor: "text-[#F7B125]",
    bgColor: "bg-[#F7B125]",
  },
  [ReactionTypeEnum.ANGRY]: {
    label: "Angry",
    emoji: "😡",
    color: "text-orange-600 dark:text-orange-400",
    activeColor: "text-[#E9710F]",
    bgColor: "bg-[#E9710F]",
  },
}

const REACTIONS_ORDER: ReactionTypeEnum[] = [
  ReactionTypeEnum.LIKE,
  ReactionTypeEnum.LOVE,
  ReactionTypeEnum.CARE,
  ReactionTypeEnum.HAHA,
  ReactionTypeEnum.WOW,
  ReactionTypeEnum.SAD,
  ReactionTypeEnum.ANGRY,
]

interface ReactionPickerProps {
  currentReaction?: ReactionTypeEnum | null
  onSelect: (reaction: ReactionTypeEnum) => void
  onClose?: () => void
  className?: string
}

export function ReactionPicker({
  currentReaction,
  onSelect,
  onClose,
  className,
}: ReactionPickerProps) {
  const [hoveredReaction, setHoveredReaction] = React.useState<ReactionTypeEnum | null>(null)

  return (
    <div
      role="radiogroup"
      aria-label="Choose a reaction"
      className={cn(
        "flex items-center gap-1 rounded-full border border-border/80 bg-background/95 p-1 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-50",
        className
      )}
      onMouseLeave={onClose}
    >
      {REACTIONS_ORDER.map((reactionKey) => {
        const config = REACTION_CONFIG[reactionKey]
        const isSelected = currentReaction === reactionKey
        const isHovered = hoveredReaction === reactionKey

        return (
          <div key={reactionKey} className="relative group flex items-center justify-center">
            {/* Tooltip on hover */}
            {isHovered && (
              <span
                role="tooltip"
                className="absolute -top-7 px-2 py-0.5 rounded-full bg-foreground text-background text-[11px] font-semibold whitespace-nowrap shadow-md animate-in fade-in zoom-in-90 duration-100 pointer-events-none"
              >
                {config.label}
              </span>
            )}

            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={config.label}
              className={cn(
                "flex size-9 sm:size-10 items-center justify-center rounded-full text-2xl transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-11 min-w-11",
                "hover:scale-125 hover:-translate-y-1 active:scale-110",
                isSelected && "bg-muted"
              )}
              onMouseEnter={() => setHoveredReaction(reactionKey)}
              onMouseLeave={() => setHoveredReaction(null)}
              onClick={() => {
                onSelect(reactionKey)
                if (onClose) onClose()
              }}
            >
              <span aria-hidden="true">{config.emoji}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { IPublicUser, IUser } from "@/lib/types"

import { resolveMediaUrl } from "@/lib/utils/media"

interface UserAvatarProps extends Omit<React.ComponentProps<typeof Avatar>, "size"> {
  user?: Partial<IUser> | Partial<IPublicUser> | null
  src?: string | null
  name?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base font-semibold",
  xl: "size-24 text-2xl font-bold",
}

export function UserAvatar({
  user,
  src,
  name,
  size = "md",
  className,
  ...props
}: UserAvatarProps) {
  const displayName =
    name ||
    user?.fullName ||
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName) ||
    "User"

  const rawPicture = src !== undefined ? src : user?.profilePicture

  const imageSrc = React.useMemo(() => {
    return resolveMediaUrl(rawPicture) || undefined
  }, [rawPicture])

  const initials = React.useMemo(() => {
    if (!displayName) return "U"
    const parts = displayName.trim().split(/\s+/)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return displayName.slice(0, 2).toUpperCase()
  }, [displayName])

  return (
    <Avatar
      className={cn("shrink-0 ring-1 ring-border shadow-2xs", sizeClasses[size], className)}
      {...props}
    >
      {imageSrc && (
        <AvatarImage
          src={imageSrc}
          alt={`${displayName}'s profile picture`}
          className="aspect-square size-full object-cover"
        />
      )}
      <AvatarFallback className="bg-primary/10 font-medium text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

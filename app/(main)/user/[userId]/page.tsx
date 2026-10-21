"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { ArrowLeft, Eye, ShieldAlert } from "lucide-react"

import { userService } from "@/services/user.service"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PublicUserProfilePage() {
  const params = useParams<{ userId: string }>()
  const router = useRouter()
  const userId = params.userId

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: async () => {
      const response = await userService.shareProfile(userId)
      return response.data.account
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2,
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-4">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold font-heading text-foreground">
          Profile Not Found
        </h1>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "The requested profile does not exist or may have been removed."}
        </p>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/">
            <ArrowLeft className="size-4 mr-2" aria-hidden="true" />
            Back to Home Feed
          </Link>
        </Button>
      </div>
    )
  }

  const fullName = data.fullName || `${data.firstName} ${data.lastName}`

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground -ml-2 min-h-11 cursor-pointer"
      >
        <ArrowLeft className="size-4 mr-2" aria-hidden="true" />
        Back
      </Button>

      <Card className="border-border shadow-md overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-linear-to-r from-primary to-blue-600 relative" />

        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 sm:-mt-16 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <UserAvatar
                user={data}
                size="xl"
                className="size-28 sm:size-32 border-4 border-card shadow-md"
              />
              <div className="space-y-1 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
                  {fullName}
                </h1>
                {data.profileVisits !== undefined && (
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground">
                    <Eye className="size-3.5" aria-hidden="true" />
                    <span>{data.profileVisits} views</span>
                  </div>
                )}
              </div>
            </div>

            <Button asChild size="sm" className="min-h-11 font-medium w-full sm:w-auto">
              <Link href="/">
                Connect on Feed
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

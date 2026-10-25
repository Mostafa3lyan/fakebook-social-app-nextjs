"use client"

import * as React from "react"
import { Search, Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFriends } from "@/hooks/friends/use-friends"
import { FriendCard } from "./friend-card"

export function FriendsListTab() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
      setPage(1)
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm])

  const {
    friends,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    isLoading,
    isFetching,
  } = useFriends({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Search and header info */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search friends by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/60 min-h-10 text-sm"
            aria-label="Search friends by name"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto">
          {isFetching && <Loader2 className="size-3.5 animate-spin text-primary" aria-label="Loading" />}
          <span>{total} {total === 1 ? "friend" : "friends"}</span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" aria-busy="true" aria-label="Loading friends">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-xl border border-border bg-card/60 animate-pulse"
            />
          ))}
        </div>
      ) : friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/50">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Users className="size-6" aria-hidden="true" />
          </div>
          <h3 className="font-heading font-semibold text-base text-foreground mb-1">
            {debouncedSearch ? "No friends match your search" : "No friends yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {debouncedSearch
              ? `We couldn't find any friends matching "${debouncedSearch}".`
              : "When you connect with people and accept friend requests, they will show up here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevPage || isFetching}
              className="min-h-9"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4 mr-1" aria-hidden="true" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage || isFetching}
              className="min-h-9"
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight className="size-4 ml-1" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

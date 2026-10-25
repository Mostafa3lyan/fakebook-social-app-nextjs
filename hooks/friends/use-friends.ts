"use client"

import { useQuery } from "@tanstack/react-query"
import { friendService } from "@/services/friend.service"
import { FriendListParams } from "@/lib/types"

export function useFriends(params?: FriendListParams) {
  const query = useQuery({
    queryKey: ["friends", params],
    queryFn: async () => {
      const response = await friendService.getFriends(params)
      return response.data.friends
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  return {
    friends: query.data?.data ?? [],
    pagination: query.data,
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    page: query.data?.page ?? 1,
    hasNextPage: query.data?.hasNextPage ?? false,
    hasPrevPage: query.data?.hasPrevPage ?? false,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

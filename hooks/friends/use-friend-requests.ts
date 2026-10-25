"use client"

import { useQuery } from "@tanstack/react-query"
import { friendService } from "@/services/friend.service"
import { FriendRequestsParams } from "@/lib/types"

export function useReceivedFriendRequests(params?: FriendRequestsParams) {
  const query = useQuery({
    queryKey: ["friend-requests", "received", params],
    queryFn: async () => {
      const response = await friendService.getReceivedRequests(params)
      return response.data.requests
    },
    staleTime: 1000 * 60, // 1 minute
  })

  return {
    requests: query.data?.data ?? [],
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

export function useSentFriendRequests(params?: FriendRequestsParams) {
  const query = useQuery({
    queryKey: ["friend-requests", "sent", params],
    queryFn: async () => {
      const response = await friendService.getSentRequests(params)
      return response.data.requests
    },
    staleTime: 1000 * 60, // 1 minute
  })

  return {
    requests: query.data?.data ?? [],
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

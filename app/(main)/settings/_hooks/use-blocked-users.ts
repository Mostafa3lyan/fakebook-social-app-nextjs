"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { userService } from "@/services/user.service"
import { ApiError } from "@/lib/api/errors"
import { BlockedUser, IPagination } from "@/lib/types"

export function useBlockedUsers(page = 1, limit = 10) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["blocked-users", page, limit],
    queryFn: async () => {
      const response = await userService.getBlockedUsers({ page, limit })
      return response.data.blockedUsers
    },
  })

  const unblockMutation = useMutation<void, ApiError, string>({
    mutationFn: async (targetUserId: string) => {
      await userService.unblockUser(targetUserId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] })
      toast.success("User unblocked successfully.")
    },
    onError: (err) => {
      toast.error(err.message || "Failed to unblock user.")
    },
  })

  return {
    blockedUsers: query.data as IPagination<BlockedUser> | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    unblockUser: unblockMutation.mutate,
    isUnblocking: unblockMutation.isPending,
  }
}

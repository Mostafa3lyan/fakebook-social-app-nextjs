import { api } from "@/lib/api/client"
import {
  FriendListParams,
  FriendListResponseData,
  FriendReceivedRequestsResponseData,
  FriendRequestsParams,
  FriendSentRequestsResponseData,
  SendFriendRequestResponseData,
} from "@/lib/types"

export const friendService = {
  getFriends: (params?: FriendListParams) =>
    api<FriendListResponseData>("/friends/list", {
      method: "GET",
      params,
    }),

  getReceivedRequests: (params?: FriendRequestsParams) =>
    api<FriendReceivedRequestsResponseData>("/friends/requests/received", {
      method: "GET",
      params,
    }),

  getSentRequests: (params?: FriendRequestsParams) =>
    api<FriendSentRequestsResponseData>("/friends/requests/sent", {
      method: "GET",
      params,
    }),

  sendRequest: (receiverId: string) =>
    api<SendFriendRequestResponseData>(`/friends/request/${receiverId}`, {
      method: "POST",
    }),

  acceptRequest: (requestId: string) =>
    api<void>(`/friends/accept/${requestId}`, {
      method: "PATCH",
    }),

  rejectRequest: (requestId: string) =>
    api<void>(`/friends/reject/${requestId}`, {
      method: "DELETE",
    }),

  cancelRequest: (requestId: string) =>
    api<void>(`/friends/cancel/${requestId}`, {
      method: "DELETE",
    }),

  unfriend: (friendId: string) =>
    api<void>(`/friends/unfriend/${friendId}`, {
      method: "DELETE",
    }),
}

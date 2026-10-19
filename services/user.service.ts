import { api } from "@/lib/api/client"
import { IPublicUser, IUser } from "@/lib/types"

export const userService = {
  getProfile: () =>
    api<{ profile: IUser }>("/user", {
      method: "GET",
    }),

  shareProfile: (userId: string) =>
    api<{ account: IPublicUser }>(`/user/${userId}/share-profile`, {
      method: "GET",
    }),

  requestProfileImageUpload: (data: { contentType: string; originalname: string }) =>
    api<{ user: IUser; url: string }>("/user/profile-image", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeProfileImage: () =>
    api<void>("/user/remove-profile-image", {
      method: "DELETE",
    }),

  deleteAccount: () =>
    api<void>("/user/delete-account", {
      method: "DELETE",
    }),
}

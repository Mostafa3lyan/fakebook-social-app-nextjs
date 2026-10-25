import type { Metadata } from "next"

import { ProfileView } from "./_components/profile-view"

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your personal Fakebook profile.",
}

export default function ProfilePage() {
  return <ProfileView />
}

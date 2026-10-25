import type { Metadata } from "next"

import { SettingsContainer } from "./_components/settings-container"

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your personal information, security credentials, and session preferences.",
}

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-2 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information, security credentials, and session preferences.
        </p>
      </div>

      <SettingsContainer />
    </div>
  )
}

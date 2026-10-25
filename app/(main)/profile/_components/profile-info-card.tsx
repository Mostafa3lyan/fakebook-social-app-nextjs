import * as React from "react"
import { Mail, Phone, Calendar, User, Shield, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IUser } from "@/lib/types"
import { formatFullDate } from "@/lib/utils/date"

interface ProfileInfoCardProps {
  user: IUser
}

export function ProfileInfoCard({ user }: ProfileInfoCardProps) {
  const details = [
    {
      label: "Email Address",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: user.phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Gender",
      value: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not specified",
      icon: User,
    },
    {
      label: "Date of Birth",
      value: formatFullDate(user.dateOfBirth),
      icon: Calendar,
    },
    {
      label: "Account Status",
      value: user.emailConfirmedAt ? "Email Verified" : "Verification Pending",
      icon: Shield,
    },
  ]

  if (user.profileVisits !== undefined) {
    details.push({
      label: "Profile Visits",
      value: `${user.profileVisits} views`,
      icon: Eye,
    })
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold font-heading text-foreground">
          About & Personal Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {details.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/30"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-muted-foreground font-medium">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate">
                    {item.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

import * as React from "react"
import { MainHeader } from "@/components/layout/main-header"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MainHeader />
      <div className="flex-1 flex items-start max-w-7xl w-full mx-auto">
        <LeftSidebar />
        <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

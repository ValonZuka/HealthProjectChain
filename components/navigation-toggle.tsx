"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function NavigationToggle() {
  const { open, setOpen } = useSidebar()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setOpen(!open)}
      className="p-2 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 bg-white"
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle navigation</span>
    </Button>
  )
}

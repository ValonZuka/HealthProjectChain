"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function withRole(allowedRoles: string[], Component: React.ComponentType) {
  return function ProtectedPage(props: any) {
    const router = useRouter()

    useEffect(() => {
      const role = localStorage.getItem("role")
      if (!role || !allowedRoles.includes(role)) {
        router.push("/role-selection")
      }
    }, [router])

    return <Component {...props} />
  }
}

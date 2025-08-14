"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RoleTokenPage() {
  const [token, setToken] = useState("")
  const [role, setRole] = useState("")
  const router = useRouter()

  useEffect(() => {
    const savedRole = localStorage.getItem("role")
    if (!savedRole || (savedRole !== "doctor" && savedRole !== "nurse")) {
      router.push("/role-selection")
    }
    setRole(savedRole || "")
  }, [router])

  const handleVerify = () => {
    if (token === "hXL5iocF99") {
      router.push("/") // dashboard
    } else {
      alert("Invalid token")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {role ? `Enter Token for ${role}` : "Enter Token"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            className="border rounded p-2 w-full text-gray-800"
            placeholder="Enter secret token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleVerify}
          >
            Verify
          </Button>
          <Button
            className="w-full bg-gray-500 hover:bg-gray-600 text-white"
            onClick={() => router.push("/role-selection")}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
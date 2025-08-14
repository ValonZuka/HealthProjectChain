"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Search, Activity } from "lucide-react"
import Link from "next/link"
import { NavigationToggle } from "@/components/navigation-toggle"
import { formatDistanceToNow } from "date-fns"
import withRole from "@/utils/withRole"

type RecentPatient = {
  patientName: string
  receipt: string
  timestamp: string
}

function Dashboard() {
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("recentPatients")
    if (stored) {
      setRecentPatients(JSON.parse(stored))
    }
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <NavigationToggle />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600">Welcome to your medical records management system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-slate-800">Create New Record</CardTitle>
              <CardDescription>Upload and create a new medical record</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/create">Create Record</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-slate-800">My Records</CardTitle>
              <CardDescription>View and manage your medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
              >
                <Link href="/records">View Records</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-2">
                <Search className="w-6 h-6 text-rose-600" />
              </div>
              <CardTitle className="text-slate-800">Search Records</CardTitle>
              <CardDescription>Find records by receipt ID</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full border-rose-300 text-rose-700 hover:bg-rose-50 bg-transparent"
              >
                <Link href="/search">Search Records</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
  <div className="space-y-4">
    {recentPatients.length > 0 ? (
      recentPatients.map((patient, i) => (
        <Link
          key={i}
          href={`/records/${patient.receipt}`}
          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">New record created</p>
            <p className="text-xs text-slate-500">
              Patient: {patient.patientName} -{" "}
              {formatDistanceToNow(new Date(patient.timestamp), { addSuffix: true })}
            </p>
          </div>
        </Link>
      ))
    ) : (
      <p className="text-sm text-slate-500">No recent activity</p>
    )}
  </div>
</CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-slate-600">Total Records</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-slate-600">This Month</div>
                </div>
                <div className="text-center p-4 bg-rose-50 rounded-lg">
                  <div className="text-2xl font-bold text-rose-600">12</div>
                  <div className="text-sm text-slate-600">Shared Records</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-slate-600">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default withRole(["doctor", "nurse"], Dashboard)	
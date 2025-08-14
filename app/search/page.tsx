"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, FileText, AlertCircle } from "lucide-react"
import { NavigationToggle } from "@/components/navigation/navigation-toggle"
import { useToast } from "@/hooks/use-toast"

export default function SearchRecords() {
  const [receiptID, setReceiptID] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!receiptID.trim()) return

    setIsLoading(true)
    setError("")
    setSearchResult(null)

    try {
      // API Integration Point - GET /api/v1/TAR/receipt/raw/{receiptID}
      const response = await fetch(
        `https://registryapi-dev.azurewebsites.net/api/v1/TAR/receipt/raw/${encodeURIComponent(receiptID)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        setSearchResult(data)
        toast({
          title: "Record Found!",
          description: "Medical record retrieved successfully.",
        })
      } else if (response.status === 404) {
        setError("No record found with this receipt ID.")
      } else {
        throw new Error("Search failed")
      }
    } catch (error) {
      setError("Failed to search for record. Please try again.")
      toast({
        title: "Search Failed",
        description: "Unable to retrieve the record. Please check the receipt ID and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <NavigationToggle />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Search Medical Records</h1>
            <p className="text-slate-600">Find medical records using receipt ID</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Search className="w-5 h-5 text-rose-600" />
                Search by Receipt ID
              </CardTitle>
              <CardDescription>Enter the receipt ID to retrieve the raw medical record data</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptID" className="text-slate-700">
                    Receipt ID
                  </Label>
                  <Input
                    id="receiptID"
                    type="text"
                    placeholder="Enter receipt ID (e.g., RCP-12345)"
                    value={receiptID}
                    onChange={(e) => setReceiptID(e.target.value)}
                    required
                    className="border-slate-300 focus:border-rose-500"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !receiptID.trim()}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                >
                  {isLoading ? "Searching..." : "Search Record"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {searchResult && (
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FileText className="w-5 h-5 text-green-600" />
                  Search Result
                </CardTitle>
                <CardDescription>Raw medical record data for receipt ID: {receiptID}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(searchResult, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(searchResult, null, 2))
                      toast({
                        title: "Copied!",
                        description: "Record data copied to clipboard.",
                      })
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Copy Data
                  </Button>
                  <Button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(searchResult, null, 2)], { type: "application/json" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `medical-record-${receiptID}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Download JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

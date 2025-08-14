"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { NavigationToggle } from "@/components/navigation/navigation-toggle"
import apiClient from "@/utils/axios"

export default function CreateRecord() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientName: "",
    examDate: "",
    diagnosis: "",
    file: null as File | null,
  })
  const { toast } = useToast()

  // Helper: read file as base64 string
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        // Remove the "data:*/*;base64," prefix from reader.result
        const base64String = (reader.result as string).split(",")[1]
        resolve(base64String)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let base64File = ""
      if (formData.file) {
        base64File = await readFileAsBase64(formData.file)
      }

      // Construct the payload as your API expects
      const recordPayload = {
        id: crypto.randomUUID(),
        receipt: `receipt-${Date.now()}`,
        userAddress: "user@example.com", // TODO: replace with real user data
        data: JSON.stringify({
          patientName: formData.patientName,
          examDate: formData.examDate,
          diagnosis: formData.diagnosis,
          timestamp: new Date().toISOString(),
          fileBase64: base64File,
          fileName: formData.file?.name || null,
          fileType: formData.file?.type || null,
        }),
        checksum: btoa(formData.diagnosis + formData.examDate),
        version: 1,
        _sdHashes: [
          {
            key: "patientName",
            value: formData.patientName,
            salt: crypto.randomUUID().slice(0, 8),
            hash: btoa(formData.patientName),
          },
          {
            key: "examDate",
            value: formData.examDate,
            salt: crypto.randomUUID().slice(0, 8),
            hash: btoa(formData.examDate),
          },
        ],
      }

      const response = await apiClient.post("/v1/TAR", recordPayload, {
        headers: {
          "Content-Type": "application/json",
          "x-session-key": "hXL5iocF99", // Or your API key/header
        },
      })

      console.log("Record created:", response.data)
      const newRecent = {
      patientName: formData.patientName,
      receipt: response.data.receipt,
      timestamp: new Date().toISOString(),
    };

    const existingRecent = JSON.parse(localStorage.getItem("recentPatients") || "[]");
    localStorage.setItem(
      "recentPatients",
      JSON.stringify([newRecent, ...existingRecent].slice(0, 5)) // keep last 5 records
    );
      
      toast({
        title: "Record Created",
        description: "The medical record was successfully created.",
      })

      // Redirect after creation
      window.location.href = "/records"
    } catch (error) {
      console.error("Error creating record:", error)
      toast({
        title: "Error",
        description: "Failed to create the medical record.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <NavigationToggle />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Create New Medical Record
            </h1>
            <p className="text-slate-600">
              Upload and create a new patient medical record
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <FileText className="w-5 h-5 text-blue-600" />
                New Medical Record
              </CardTitle>
              <CardDescription>
                Fill in the patient information and upload the medical document
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="patientName"
                    className="flex items-center gap-2 text-slate-700"
                  >
                    <User className="w-4 h-4" />
                    Patient Full Name
                  </Label>
                  <Input
                    id="patientName"
                    type="text"
                    placeholder="Enter patient's full name"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, patientName: e.target.value }))
                    }
                    required
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="examDate"
                    className="flex items-center gap-2 text-slate-700"
                  >
                    <Calendar className="w-4 h-4" />
                    Date of Examination
                  </Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={formData.examDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, examDate: e.target.value }))
                    }
                    required
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis" className="text-slate-700">
                    Diagnosis Summary
                  </Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Enter diagnosis summary and notes..."
                    value={formData.diagnosis}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))
                    }
                    rows={4}
                    required
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="file"
                    className="flex items-center gap-2 text-slate-700"
                  >
                    <Upload className="w-4 h-4" />
                    Medical Document (PDF or JSON)
                  </Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      id="file"
                      type="file"
                      accept=".pdf,.json"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">
                        {formData.file ? formData.file.name : "Click to upload PDF or JSON file"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Maximum file size: 10MB</p>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isLoading ? "Creating..." : "Create Record"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                    onClick={() =>
                      setFormData({
                        patientName: "",
                        examDate: "",
                        diagnosis: "",
                        file: null,
                      })
                    }
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

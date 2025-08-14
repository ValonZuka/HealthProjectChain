"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavigationToggle } from "@/components/navigation/navigation-toggle";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface MedicalRecord {
  id: string;
  receiptID: string;
  patientName: string;
  examDate: string;
  diagnosis: string;
  version: number;
  timestamp: string;
  status: "active" | "archived";
}

export default function MyRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

useEffect(() => {
  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1️⃣ Get receipt IDs from localStorage
      const stored = localStorage.getItem("recentPatients");
      const recentPatients = stored ? JSON.parse(stored) : [];
      const receiptIDs = recentPatients.map((patient: any) => patient.receipt);

      console.log("receiptIDs:", receiptIDs);

      if (receiptIDs.length === 0) {
        setRecords([]);
        return;
      }

      const allRecords: MedicalRecord[] = [];

      for (const receiptID of receiptIDs) {
  try {
    const response = await axios.get(
      `https://registryapi-dev.azurewebsites.net/api/v1/TAR/receipt/${receiptID}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-session-key": "hXL5iocF99",
        },
      }
    );

    const item = response.data;

    // Extract inner JSON
    let parsedData: any = {};
    if (item.data && typeof item.data.data === "string") {
      parsedData = JSON.parse(item.data.data);
    }

    allRecords.push({
      id: item.receipt || receiptID,
      receiptID: item.receipt || receiptID,
      patientName: parsedData.patientName || "Unknown",
      examDate: parsedData.examDate || new Date().toISOString(),
      diagnosis: parsedData.diagnosis || "No diagnosis provided",
      version: item.version || 1,
      timestamp: parsedData.timestamp || new Date().toISOString(),
      status: item.status || "active",
    });
  } catch (err) {
    console.error(`Error fetching receipt ${receiptID}:`, err);
  }
}

      // 3️⃣ Update state
      setRecords(allRecords);
    } catch (error: any) {
      console.error("Error fetching records:", error);
      setError("Failed to load records. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load records. Please try again.",
        className: "text-black",
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchRecords();
}, []);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">My Medical Records</h1>
              <p className="text-slate-600">Loading your medical records...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <NavigationToggle />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Medical Records</h1>
            <p className="text-slate-600">View and manage your medical records</p>
          </div>
        </div>

        {error && (
          <p className="text-red-600 font-semibold mb-4">{error}</p>
        )}

        {records.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Records Found</h3>
              <p className="text-slate-600 mb-4">You haven't created any medical records yet.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/create">Create Your First Record</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-slate-800 text-sm">{record.id}</CardTitle>
                        <CardDescription className="text-xs">Version {record.version}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={record.status === "active" ? "default" : "secondary"}
                      className={
                        record.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-600"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-700 font-medium">{record.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600">
                      {new Date(record.examDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{record.diagnosis}</p>
                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Link href={`/records/${record.receiptID}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
                    >
                      <Link href={`/records/${record.receiptID}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
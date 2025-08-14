"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteTAR } from "@/lib/tarService";
import axios from "axios";

export default function ViewTAR() {
  const { id } = useParams();
  const receiptID = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!receiptID) return;

    const fetchRecord = async () => {
      setLoading(true);
      setError(null);

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

        let parsedData: any = {};
        if (item.data && typeof item.data.data === "string") {
          parsedData = JSON.parse(item.data.data);
        }

        setRecord({
          id: item.receipt || receiptID,
          receiptID: item.receipt || receiptID,
          patientName: parsedData.patientName || "Unknown",
          examDate: parsedData.examDate || "-",
          diagnosis: parsedData.diagnosis || "No diagnosis provided",
          version: item.version || 1,
          timestamp: parsedData.timestamp || new Date().toISOString(),
          status: item.status || "active",
          email: parsedData.email || "",
        });
      } catch (err) {
        console.error(`Error fetching receipt ${receiptID}:`, err);
        setError("Failed to load TAR.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [receiptID]);

  const handleDelete = async () => {
    if (!record?.id) return alert("TAR ID missing!");
    if (!confirm("Are you sure you want to delete this TAR?")) return;
    try {
      await deleteTAR(record.id);
      router.push("/records");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-black">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-black">{error}</p>;
  if (!record) return <p className="text-center mt-10 text-black">No TAR found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-6 border border-gray-300">
        <h1 className="text-2xl font-bold text-black mb-4">TAR Details</h1>

        <div className="mb-3 text-black"><strong>Patient Name:</strong> {record.patientName}</div>
        <div className="mb-3 text-black"><strong>Exam Date:</strong> {record.examDate}</div>
        <div className="mb-3 text-black"><strong>Diagnosis:</strong> {record.diagnosis}</div>
        {record.email && <div className="mb-3 text-black"><strong>Email:</strong> {record.email}</div>}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => router.push("/records")}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            Go Back
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

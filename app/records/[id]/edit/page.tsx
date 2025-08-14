"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { updateTAR } from "@/lib/tarService";

export default function EditTAR() {
  const { id: receiptIDParam } = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<any>(null);
  const [form, setForm] = useState({
    patientName: "",
    examDate: "",
    diagnosis: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTAR = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://registryapi-dev.azurewebsites.net/api/v1/TAR/receipt/${receiptIDParam}`,
          {
            headers: { 
              "Content-Type": "application/json", 
              "x-session-key": "hXL5iocF99" 
            },
          }
        );

        const item = response.data;
        let parsedData: any = {};
        if (item.data && typeof item.data.data === "string") {
          parsedData = JSON.parse(item.data.data);
        }

        // Use the correct TAR id for PUT
        const fetchedRecord = {
          id: item.id, // <-- TAR id
          patientName: parsedData.patientName || "",
          examDate: parsedData.examDate || "",
          diagnosis: parsedData.diagnosis || "",
        };

        setRecord(fetchedRecord);
        setForm({
          patientName: fetchedRecord.patientName,
          examDate: fetchedRecord.examDate,
          diagnosis: fetchedRecord.diagnosis,
        });
      } catch (err) {
        console.error(`Error fetching TAR ${receiptIDParam}:`, err);
        setError("Failed to load TAR.");
      } finally {
        setLoading(false);
      }
    };

    fetchTAR();
  }, [receiptIDParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!record?.id) {
      alert("TAR ID missing!");
      return;
    }

    const payload = {
      data: {
        patientName: form.patientName,
        examDate: form.examDate,
        diagnosis: form.diagnosis,
      },
    };

    try {
      await updateTAR(record.id, payload); // ✅ now uses TAR id
      router.push(`/record/${record.id}`);
    } catch (err: any) {
      console.error("Failed to update TAR:", err);
      alert(`Failed to update TAR: ${err.response?.data?.message || err.message || "Unknown error"}`);
    }
  };

  if (loading) return <p className="text-center mt-10 text-black">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-black">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-white">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-6 border border-pink-200">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Edit TAR</h1>

        <label className="block mb-3">
          <span className="text-gray-700">Patient Name</span>
          <input
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Exam Date</span>
          <input
            type="date"
            name="examDate"
            value={form.examDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Diagnosis</span>
          <input
            type="text"
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
          />
        </label>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

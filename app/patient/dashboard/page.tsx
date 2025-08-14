"use client";

import { useEffect, useState } from "react";

interface TARRecord {
  id: string;
  patientName: string;
  examDate: string;
  diagnosis: string;
  description: string;
  doctor: string;
}

export default function PatientDashboard() {
  const [records, setRecords] = useState<TARRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hardcodedRecords: TARRecord[] = [
      {
        id: "TAR-001",
        patientName: "Valon Zuka",
        examDate: "2025-07-10",
        diagnosis: "Chronic Migraine",
        description:
          "Patient has been experiencing recurring headaches for the past 6 months. MRI scan was recommended and preventive treatment initiated.",
        doctor: "Dr. John Peterson",
      },
      {
        id: "TAR-002",
        patientName: "Valon Zuka",
        examDate: "2025-06-05",
        diagnosis: "Type 2 Diabetes",
        description:
          "Blood tests confirmed elevated glucose levels. Patient advised to start a low-sugar diet and prescribed metformin.",
        doctor: "Dr. Sarah Thompson",
      },
      {
        id: "TAR-003",
        patientName: "Valon Zuka",
        examDate: "2025-05-22",
        diagnosis: "Mild Asthma",
        description:
          "Patient reports occasional shortness of breath. Inhaler prescribed and breathing exercises recommended.",
        doctor: "Dr. Ahmed Khan",
      },
    ];

    setRecords(hardcodedRecords);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      <h1 className="text-3xl font-bold text-black mb-4">
        TAR Records for Valon Zuka
      </h1>
      <p className="mb-6 text-black">
        Below are the stored TAR (Treatment and Assessment Report) records.
      </p>

      {loading ? (
        <p>Loading records...</p>
      ) : records.length > 0 ? (
        <div className="space-y-6">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white shadow rounded p-4 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-black mb-2">
                {rec.diagnosis}
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Patient:</strong> {rec.patientName}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Exam Date:</strong> {rec.examDate}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Description:</strong> {rec.description}
              </p>
              <p className="text-gray-700">
                <strong>Made by:</strong> {rec.doctor}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No records found.</p>
      )}

      {/* WHAT DO WE DO SECTION */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">💡 What Do We Do?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our healthcare system is built to revolutionize the way medical data
          is stored and accessed. By leveraging the power of{" "}
          <strong>blockchain technology</strong>, we ensure that your health
          records are immutable, tamper-proof, and accessible only by you and
          your authorized healthcare providers. Each piece of data is securely
          encrypted and stored in a distributed network — meaning there’s no
          single point of failure and no way for unauthorized individuals to
          alter or delete your information.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          With blockchain, transparency meets privacy. Only you and your
          trusted doctors have the keys to view or update your medical history.
          This ensures not only complete privacy but also the confidence that
          every update in your record is legitimate and verified.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our mission is simple: provide{" "}
          <strong>secure, reliable, and patient-centered</strong> access to
          healthcare data — so you can focus on getting better while we handle
          the safety of your information.
        </p>

        {/* Cartoon images row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
            alt="Health checkup"
            className="w-full h-40 object-contain"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/4320/4320354.png"
            alt="Secure health data"
            className="w-full h-40 object-contain"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/4225/4225690.png"
            alt="Medical consultation"
            className="w-full h-40 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

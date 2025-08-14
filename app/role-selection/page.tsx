"use client"

import { useRouter } from "next/navigation"
import { User, Stethoscope, HeartPulse } from "lucide-react"

export default function RoleSelectionPage() {
  const router = useRouter()

  const roles = [
    {
      title: "Patient",
      description: "View and manage your medical records securely.",
      icon: User,
      color: "from-green-400 to-emerald-500",
      route: "/auth/patient-login",
    },
    {
      title: "Doctor",
      description: "Access patient records and provide medical care.",
      icon: Stethoscope,
      color: "from-blue-400 to-indigo-500",
      route: "/auth/doctor-login",
    },
    {
      title: "Nurse",
      description: "Support patients and manage their health information.",
      icon: HeartPulse,
      color: "from-pink-400 to-rose-500",
      route: "/auth/nurse-login",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-500 to-blue-500 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
        Welcome to Health Record Chain
      </h1>
      <p className="text-white/90 text-lg mb-12 text-center max-w-2xl">
        Please select your role to continue. Your role determines your access and the tools available to you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {roles.map((role) => (
          <div
            key={role.title}
            onClick={() => router.push(role.route)}
            className={`cursor-pointer group bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-all hover:-translate-y-2 hover:shadow-2xl`}
          >
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 shadow-md`}
            >
              <role.icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {role.title}
            </h2>
            <p className="text-gray-600">{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

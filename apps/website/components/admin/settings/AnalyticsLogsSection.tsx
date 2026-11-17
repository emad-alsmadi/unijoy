"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart3, Users, CalendarCheck2, TicketCheck, Coins } from "lucide-react";

const stats = [
  { label: "Total Users", value: 4821, color: "bg-indigo-50 text-indigo-800 border-indigo-100", icon: Users },
  { label: "Active Events", value: 138, color: "bg-purple-50 text-purple-800 border-purple-100", icon: CalendarCheck2 },
  { label: "Total Bookings", value: 24210, color: "bg-blue-50 text-blue-800 border-blue-100", icon: TicketCheck },
  { label: "Revenue", value: 189230, color: "bg-green-50 text-green-800 border-green-100", icon: Coins },
];

const activity = [
  { id: 1, actor: "Admin • Noor", action: "Updated payment settings", time: "Today, 10:21" },
  { id: 2, actor: "Host • Sara", action: "Created a new event", time: "Today, 09:10" },
  { id: 3, actor: "Admin • Ali", action: "Deleted a disabled user", time: "Yesterday, 17:44" },
  { id: 4, actor: "System", action: "Automatic backup", time: "Yesterday, 02:00" },
];

export default function AnalyticsLogsSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className={`p-4 rounded-xl border ${color}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm">{label}</p>
              <Icon className="h-4 w-4 opacity-80" />
            </div>
            <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden lg:col-span-2">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="text-indigo-600" />
              Events/Bookings Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-56 flex items-end gap-2">
              {[40, 55, 35, 65, 50, 70, 60, 80, 45, 62, 58, 73].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-indigo-100 rounded-t-md" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-gray-500">{i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-lg">Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {activity.map((item) => (
                <li key={item.id} className="p-4">
                  <p className="text-sm text-gray-800">{item.actor}</p>
                  <p className="text-sm text-gray-500">{item.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

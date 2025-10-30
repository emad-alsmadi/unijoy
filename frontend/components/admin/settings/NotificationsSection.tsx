"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templates: Record<string, string> = {
  approval: "Hello {{name}},\n\nYour request has been approved.",
  registration: "Hello {{name}},\n\nYou have been registered for the event.",
  cancellation: "Hello {{name}},\n\nYour registration for the event has been cancelled.",
};

export default function NotificationsSection() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(true);
  const [selected, setSelected] = useState<keyof typeof templates>("approval");
  const [body, setBody] = useState(templates[selected]);

  const preview = useMemo(() => body.replace(/\{\{name\}\}/g, "Student"), [body]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Mail className="text-indigo-600" size={22} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
            <div>
              <p className="font-medium text-gray-800">Enable Email Notifications</p>
              <p className="text-sm text-gray-500">Automatically send emails to users</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Email Template</Label>
              <select value={selected} onChange={(e) => { const v = e.target.value as any; setSelected(v); setBody(templates[v]); }} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="approval">Approval</option>
                <option value="registration">Registration</option>
                <option value="cancellation">Cancellation</option>
              </select>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: "Saved", description: "Email templates updated", className: "bg-green-600 text-white border-0" })} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Template
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Live Preview</Label>
              <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 min-h-[240px] whitespace-pre-wrap text-gray-800">
                {preview}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogDescription, DialogFooter as DialogF, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image as ImageIcon, Settings, Save, Link2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

const schema = z.object({
  platformName: z.string().min(2),
  description: z.string().min(4),
  themeColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  smtpHost: z.string().min(2),
  smtpPort: z.coerce.number().min(1),
  smtpUser: z.string().min(2),
  smtpPass: z.string().min(2),
});

export type SystemSettingsValues = z.infer<typeof schema>;

export default function SystemSettingsSection() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const form = useForm<SystemSettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      platformName: "UniJoy",
      description: "University events management platform",
      themeColor: "#6b21a8",
      facebook: "",
      instagram: "",
      linkedin: "",
      smtpHost: "smtp.mailtrap.io",
      smtpPort: 2525,
      smtpUser: "user",
      smtpPass: "password",
    },
  });

  const onSubmit = (data: SystemSettingsValues) => {
    toast({ title: "Saved", description: "System settings updated", className: "bg-green-600 text-white border-0" });
  };

  const onUpload = (file: File, kind: "logo" | "favicon") => {
    const reader = new FileReader();
    reader.onload = () => {
      if (kind === "logo") setLogoPreview(reader.result as string);
      else setFaviconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
      <Card className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200/80 dark:border-white/10 overflow-hidden">
        <CardHeader className="border-b border-gray-200/70 dark:border-white/10 bg-gradient-to-r from-white/60 to-transparent dark:from-slate-900/40">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-slate-100">
            <Settings className="text-indigo-600" size={22} />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Mode */}
            <div className="space-y-3 md:col-span-2">
              <Label className="text-gray-700 dark:text-slate-200">Theme Mode</Label>
              <div className="flex items-center justify-between rounded-xl border border-gray-200/80 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/40">
                <div>
                  <p className="font-medium text-gray-800 dark:text-slate-100">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Toggle between Light and Dark appearance across the site</p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(val) => {
                    setTheme(val ? 'dark' : 'light');
                    toast({ title: 'Theme updated', description: `Switched to ${val ? 'Dark' : 'Light'} mode`, className: 'bg-green-600 text-white border-0' });
                  }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-slate-200">Platform Name</Label>
              <input {...form.register("platformName")} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-slate-200">Primary Color</Label>
              <input type="text" {...form.register("themeColor")} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-gray-700 dark:text-slate-200">Description</Label>
              <textarea {...form.register("description")} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-slate-200">Logo</Label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                  <ImageIcon className="h-4 w-4" />
                  Choose file
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], "logo")} />
                </label>
                {logoPreview && <img src={logoPreview} alt="logo" className="h-10 rounded-md border border-gray-200 dark:border-white/10" />}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-slate-200">Favicon</Label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                  <ImageIcon className="h-4 w-4" />
                  Choose file
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], "favicon")} />
                </label>
                {faviconPreview && <img src={faviconPreview} alt="favicon" className="h-10 w-10 rounded-md border border-gray-200 dark:border-white/10" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-200">Facebook</Label>
              <input {...form.register("facebook")} placeholder="https://facebook.com/unijoy" className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-200">Instagram</Label>
              <input {...form.register("instagram")} placeholder="https://instagram.com/unijoy" className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-200">LinkedIn</Label>
              <input {...form.register("linkedin")} placeholder="https://linkedin.com/company/unijoy" className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 dark:text-slate-200">SMTP Host</Label>
              <input {...form.register("smtpHost")} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-200">SMTP Port</Label>
              <input type="number" {...form.register("smtpPort", { valueAsNumber: true })} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-200">SMTP User</Label>
              <input {...form.register("smtpUser")} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-gray-700 dark:text-slate-200">SMTP Password</Label>
              <input type="password" {...form.register("smtpPass")} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200/80 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/40">
            <div>
              <p className="font-medium text-gray-800 dark:text-slate-100">Maintenance Mode</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">A maintenance message will be shown to users</p>
            </div>
            <Switch checked={maintenance} onCheckedChange={() => setMaintenanceOpen(true)} />
          </div>

          <Dialog open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-amber-600" /> Confirm enabling Maintenance Mode
                </DialogTitle>
                <DialogDescription>All users will be affected. Do you want to continue?</DialogDescription>
              </DialogHeader>
              <DialogF className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setMaintenanceOpen(false)}>Cancel</Button>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => { setMaintenance((v) => !v); setMaintenanceOpen(false); toast({ title: "Updated", description: "Maintenance mode changed" }); }}>Confirm</Button>
              </DialogF>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="p-6 border-t border-gray-200/70 dark:border-white/10 flex items-center justify-end bg-gradient-to-r from-transparent to-white/40 dark:to-slate-900/20">
          <Button onClick={form.handleSubmit(onSubmit)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="h-4 w-4 mr-2" /> Save Settings
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter as DialogF, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, SunMoon, KeyRound, RotateCcw, UploadCloud, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdvancedSettingsSection() {
  const { toast } = useToast();
  const [openConfirm, setOpenConfirm] = useState<null | "backup" | "restore" | "deleteKey" >(null);
  const [dark, setDark] = useState(false);
  const [tfa, setTfa] = useState(true);
  const [keys, setKeys] = useState<Array<{ id: string; name: string; lastUsed: string }>>([
    { id: "k_1", name: "Server CI", lastUsed: "اليوم" },
    { id: "k_2", name: "Admin Dashboard", lastUsed: "أمس" },
  ]);

  const addKey = () => {
    const id = `k_${Date.now()}`;
    setKeys((prev) => [{ id, name: `New Key ${prev.length + 1}`, lastUsed: "—" }, ...prev]);
    toast({ title: "تمت الإضافة", description: "تم إنشاء مفتاح API جديد", className: "bg-green-600 text-white border-0" });
  };

  const regenerate = (id: string) => {
    toast({ title: "تم التوليد", description: `تم توليد مفتاح جديد لـ ${id}`, className: "bg-green-600 text-white border-0" });
  };

  const remove = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setOpenConfirm(null);
    toast({ title: "تم الحذف", description: "تم حذف مفتاح API", className: "bg-green-600 text-white border-0" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-xl">
              <RotateCcw className="text-indigo-600" size={22} />
              Backup & Restore
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div>
                <p className="font-medium text-gray-800">Create Backup</p>
                <p className="text-sm text-gray-500">Download a copy of system data</p>
              </div>
              <Button onClick={() => setOpenConfirm("backup")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <UploadCloud className="h-4 w-4 mr-2" /> Backup
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div>
                <p className="font-medium text-gray-800">Restore Data</p>
                <p className="text-sm text-gray-500">Restore from a backup file</p>
              </div>
              <Button variant="outline" onClick={() => setOpenConfirm("restore")}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Restore
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-xl">
              <KeyRound className="text-indigo-600" size={22} />
              API Key Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-end">
              <Button onClick={addKey} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Key
              </Button>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-right text-xs text-gray-500">ID</th>
                    <th className="px-4 py-2 text-right text-xs text-gray-500">Name</th>
                    <th className="px-4 py-2 text-right text-xs text-gray-500">Last Used</th>
                    <th className="px-4 py-2 text-right text-xs text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keys.map((k) => (
                    <tr key={k.id}>
                      <td className="px-4 py-3 font-mono text-xs">{k.id}</td>
                      <td className="px-4 py-3">{k.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{k.lastUsed}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => regenerate(k.id)}>
                            <RefreshCcw className="h-4 w-4 mr-1" /> Regenerate
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setOpenConfirm("deleteKey")}> 
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="text-indigo-600" size={22} />
              Security (2FA)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div>
                <p className="font-medium text-gray-800">Enable Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Additional protection for accounts</p>
              </div>
              <Switch checked={tfa} onCheckedChange={(v) => { setTfa(v); }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-xl">
              <SunMoon className="text-indigo-600" size={22} />
              Theme (Light/Dark)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div>
                <p className="font-medium text-gray-800">Enable dark mode</p>
                <p className="text-sm text-gray-500">Smooth transition between modes</p>
              </div>
              <Switch checked={dark} onCheckedChange={setDark} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!openConfirm} onOpenChange={() => setOpenConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>Do you want to proceed?</DialogDescription>
          </DialogHeader>
          <DialogF className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpenConfirm(null)}>Cancel</Button>
            {openConfirm === "deleteKey" ? (
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => remove(keys[0]?.id)}>Delete</Button>
            ) : openConfirm === "backup" ? (
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => { setOpenConfirm(null); }}>Continue</Button>
            ) : (
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => { setOpenConfirm(null); }}>Continue</Button>
            )}
          </DialogF>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

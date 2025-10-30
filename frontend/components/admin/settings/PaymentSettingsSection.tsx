"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign, CreditCard, Wallet, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSettingsSection() {
  const { toast } = useToast();
  const [useStripe, setUseStripe] = useState(true);
  const [usePaypal, setUsePaypal] = useState(false);
  const [fee, setFee] = useState(5);
  const [currency, setCurrency] = useState<"USD" | "EUR" | "JOD">("JOD");

  const transactions = {
    total: 1240,
    revenue: 15890,
    refunds: 6,
  };

  const save = () => {
    toast({ title: "Saved", description: "Payment settings updated", className: "bg-green-600 text-white border-0" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.25 }}>
      <Card className="bg-white/90 dark:bg-slate-900/60 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200/80 dark:border-white/10 overflow-hidden">
        <CardHeader className="border-b border-gray-200/70 dark:border-white/10 bg-gradient-to-r from-white/60 to-transparent dark:from-slate-900/40">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-slate-100">
            <CreditCard className="text-indigo-600" size={22} />
            Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between rounded-xl border border-gray-200/80 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/40">
              <div>
                <p className="font-medium text-gray-800 dark:text-slate-100">Stripe</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Enable Stripe integration</p>
              </div>
              <Switch checked={useStripe} onCheckedChange={setUseStripe} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200/80 dark:border-white/10 p-4 bg-white/70 dark:bg-slate-900/40">
              <div>
                <p className="font-medium text-gray-800 dark:text-slate-100">PayPal</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Enable PayPal integration</p>
              </div>
              <Switch checked={usePaypal} onCheckedChange={setUsePaypal} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-200">Platform Fee (%)</Label>
              <input type="number" value={fee} onChange={(e) => setFee(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-slate-200">Currency</Label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JOD">JOD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20">
              <p className="text-sm">Total Transactions</p>
              <p className="text-2xl font-bold mt-1">{transactions.total.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-100 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20">
              <p className="text-sm">Revenue</p>
              <p className="text-2xl font-bold mt-1">{transactions.revenue.toLocaleString()} {currency}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20">
              <p className="text-sm">Refunds</p>
              <p className="text-2xl font-bold mt-1">{transactions.refunds}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Edit3, Eye, Trash2 } from "lucide-react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "host" | "user";
  active: boolean;
  avatar?: string;
};

export default function UserTable({ fetchUsers }: { fetchUsers: () => Promise<User[]> }) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | User["role"]>("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetchUsers().then(setUsers).catch(() => setUsers([]));
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    return users
      .filter((u) => (role === "all" ? true : u.role === role))
      .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  }, [users, search, role]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const view = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Input placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="h-9 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800/60 text-sm px-2"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="host">Host</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-slate-400">
              <th className="py-2">User</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Active</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {view.map((u) => (
              <motion.tr key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="border-t border-gray-200/70 dark:border-white/10 hover:bg-gray-50/60 dark:hover:bg-white/5">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <img src={u.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.name)}`} alt={u.name} className="h-8 w-8 rounded-full border border-gray-200/70 dark:border-white/10" />
                    <div>
                      <div className="text-gray-900 dark:text-slate-100 font-medium">{u.name}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">#{u.id.slice(0, 6)}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2 text-gray-700 dark:text-slate-200">{u.email}</td>
                <td className="py-2">
                  <Badge className={
                    u.role === 'admin' ? 'bg-purple-600 text-white' :
                    u.role === 'host' ? 'bg-amber-500 text-white' :
                    'bg-green-600 text-white'
                  }>
                    {u.role}
                  </Badge>
                </td>
                <td className="py-2">
                  <Switch checked={u.active} onCheckedChange={(val) => setUsers((prev) => prev.map(x => x.id === u.id ? { ...x, active: val } : x))} />
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="outline" size="sm" className="h-8 px-2"><Eye className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="h-8 px-2"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" className="h-8 px-2"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-500 dark:text-slate-400">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
        </div>
      </div>
    </div>
  );
}

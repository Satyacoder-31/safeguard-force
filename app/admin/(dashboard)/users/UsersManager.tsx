"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAdminUser } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../components/ui";
import type { Profile } from "@/types/database";
import { formatDate } from "@/lib/utils";

export default function UsersManager({ users, isSuper, currentUserId }: { users: Profile[]; isSuper: boolean; currentUserId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    fd.set("id", id);
    const res = await updateAdminUser(fd);
    showToast(res.ok ? "User updated" : res.error || "Update failed", res.ok);
    setSaving(false);
    if (res.ok) { setEditing(null); router.refresh(); }
  }

  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div key={u.id} className="border border-slate-200 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
            <div className="w-10 h-10 rounded-full bg-[#C5A253] text-[#0A1931] flex items-center justify-center font-black text-xs shrink-0">
              {(u.full_name || u.email).slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-[#0A1931]">{u.full_name || "—"} {u.id === currentUserId && <span className="text-[10px] text-[#C5A253] font-bold uppercase">(you)</span>}</div>
              <div className="text-xs text-slate-400">{u.email} · joined {formatDate(u.created_at)}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 border ${u.role === "super_admin" ? "bg-[#0A1931] text-white border-[#0A1931]" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                {u.role.replace("_", " ")}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 border ${u.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                {u.is_active ? "active" : "disabled"}
              </span>
              {isSuper && (
                <button onClick={() => setEditing(editing === u.id ? null : u.id)} className="border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:border-[#0A1931]">
                  {editing === u.id ? "Close" : "Edit"}
                </button>
              )}
            </div>
          </div>
          {isSuper && editing === u.id && (
            <form onSubmit={(e) => onSubmit(e, u.id)} className="border-t border-slate-100 p-5 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Full Name</label>
                  <input name="full_name" defaultValue={u.full_name} className="w-full border border-slate-200 px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">Role</label>
                  <select name="role" defaultValue={u.role} className="w-full border border-slate-200 px-3 py-2.5 text-sm bg-white">
                    <option value="editor">Editor</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <label className="flex items-end gap-2 text-sm text-slate-600 pb-2.5">
                  <input type="checkbox" name="is_active" defaultChecked={u.is_active} className="accent-[#C5A253] w-4 h-4" /> Account active
                </label>
              </div>
              <div className="flex justify-end">
                <SubmitButton className="bg-[#C5A253] text-[#0A1931] px-6 py-2.5 text-xs font-black uppercase tracking-widest" pendingLabel={saving ? "Saving…" : undefined}>
                  Save User
                </SubmitButton>
              </div>
            </form>
          )}
        </div>
      ))}
      {users.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No users found.</p>}
    </div>
  );
}

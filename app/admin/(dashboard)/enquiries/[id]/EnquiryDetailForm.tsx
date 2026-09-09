"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEnquiry, deleteEnquiry } from "@/lib/actions/admin";
import { SubmitButton, showToast } from "../../../components/ui";
import type { Enquiry } from "@/types/database";

const STATUSES = ["New", "Contacted", "In Progress", "Converted", "Closed", "Spam"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const input = "w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";
const label = "block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5";

export default function EnquiryDetailForm({ enquiry }: { enquiry: Enquiry }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    fd.set("id", enquiry.id);
    const res = await updateEnquiry(fd);
    showToast(res.ok ? "Enquiry updated" : res.error || "Update failed", res.ok);
    setSaving(false);
    if (res.ok) router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    const fd = new FormData();
    fd.set("id", enquiry.id);
    const res = await deleteEnquiry(fd);
    showToast(res.ok ? "Enquiry deleted" : res.error || "Delete failed", res.ok);
    if (res.ok) router.push("/admin/enquiries");
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-slate-200 p-6 space-y-4">
      <h2 className="text-xs font-black tracking-widest uppercase text-[#0A1931]">Manage Enquiry</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={label}>Status</label>
          <select name="status" defaultValue={enquiry.status} className={`${input} bg-white`}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Priority</label>
          <select name="priority" defaultValue={enquiry.priority} className={`${input} bg-white`}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Assigned To</label>
          <input name="assigned_to" defaultValue={enquiry.assigned_to} className={input} placeholder="Team member name" />
        </div>
      </div>
      <div>
        <label className={label}>Internal Notes</label>
        <textarea name="notes" defaultValue={enquiry.notes} rows={4} className={input} placeholder="Call logs, follow-ups, quotes sent…" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-2">
        <button type="button" onClick={remove} className="text-red-600 border border-red-200 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-red-50">
          Delete Enquiry
        </button>
        <SubmitButton className="bg-[#C5A253] hover:bg-[#B8941F] text-[#0A1931] px-8 py-3 text-xs tracking-widest uppercase font-black">
          Save Changes
        </SubmitButton>
      </div>
    </form>
  );
}

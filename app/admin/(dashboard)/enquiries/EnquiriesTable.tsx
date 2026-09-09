"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { StatusBadge } from "../../components/ui";
import type { Enquiry } from "@/types/database";
import { formatDate } from "@/lib/utils";

const STATUSES = ["New", "Contacted", "In Progress", "Converted", "Closed", "Spam"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export default function EnquiriesTable({
  enquiries,
  services,
  filters,
}: {
  enquiries: Enquiry[];
  services: string[];
  filters: { q?: string; status?: string; priority?: string; service?: string };
}) {
  const router = useRouter();
  const params = useSearchParams();

  function setParam(key: string, value: string) {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    router.push(url.pathname + "?" + url.searchParams.toString());
  }

  const select = "border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#C5A253]";

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border border-slate-200 p-4 mb-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setParam("q", String(fd.get("q") || ""));
          }}
          className="flex-1 min-w-0"
        >
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Search name, phone, email, company, location…"
            className={`${select} w-full`}
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <select value={filters.status ?? ""} onChange={(e) => setParam("status", e.target.value)} className={select}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.priority ?? ""} onChange={(e) => setParam("priority", e.target.value)} className={select}>
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filters.service ?? ""} onChange={(e) => setParam("service", e.target.value)} className={select}>
            <option value="">All services</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {(filters.q || filters.status || filters.priority || filters.service) && (
            <button onClick={() => router.push("/admin/enquiries")} className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#0A1931] px-2">
              Clear
            </button>
          )}
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white p-10 text-center text-slate-400 text-sm">
          No enquiries match. New website submissions appear here instantly.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-white border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  {["Name", "Phone", "Company", "Service", "Location", "Status", "Priority", "Created"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => router.push(`/admin/enquiries/${e.id}`)}>
                    <td className="px-4 py-3 font-bold text-[#0A1931] whitespace-nowrap">{e.full_name}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{e.phone}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">{e.company_name || "—"}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">{e.service_required}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{e.location || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3 text-slate-600">{e.priority}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{formatDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {enquiries.map((e) => (
              <Link key={e.id} href={`/admin/enquiries/${e.id}`} className="block bg-white border border-slate-200 p-4 active:bg-slate-50">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#0A1931]">{e.full_name}</span>
                  <StatusBadge status={e.status} />
                </div>
                <div className="text-xs text-slate-500 mt-1.5">{e.phone} · {e.service_required}</div>
                <div className="text-xs text-slate-400 mt-0.5">{e.location || e.company_name || "—"} · {formatDate(e.created_at)}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------------ */
/* Submit button with pending state                                          */
/* ------------------------------------------------------------------------ */
export function SubmitButton({
  children,
  className = "",
  pendingLabel = "Saving…",
  confirm,
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Red destructive submit for use inside plain <form action={serverAction}> */
export function DeleteButton({ label = "Delete", confirm = "Delete this item? This cannot be undone." }: { label?: string; confirm?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
      className="text-red-600 hover:text-red-800 disabled:opacity-50 text-xs font-bold uppercase tracking-wider px-2 py-1"
    >
      {pending ? "…" : label}
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* Page header                                                               */
/* ------------------------------------------------------------------------ */
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-[#0A1931] font-black text-xl sm:text-2xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Empty state                                                               */
/* ------------------------------------------------------------------------ */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-dashed border-slate-300 bg-white rounded-sm p-10 text-center">
      <div className="text-slate-400 text-sm font-semibold">{title}</div>
      {hint && <div className="text-slate-400 text-xs mt-1">{hint}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Status badge                                                              */
/* ------------------------------------------------------------------------ */
const STATUS_STYLES: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Contacted: "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress": "bg-purple-50 text-purple-700 border-purple-200",
  Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-slate-100 text-slate-600 border-slate-200",
  Spam: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Toast — listens for admin:toast events dispatched after actions            */
/* ------------------------------------------------------------------------ */
export function ToastHost() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { msg: string; ok: boolean };
      setToast(detail);
      setTimeout(() => setToast(null), 4000);
    };
    document.addEventListener("admin:toast", handler);
    return () => document.removeEventListener("admin:toast", handler);
  }, []);

  if (!toast) return null;
  return (
    <div className={`fixed bottom-5 right-5 z-[100] px-5 py-3 text-sm font-semibold shadow-xl border ${
      toast.ok ? "bg-emerald-600 text-white border-emerald-700" : "bg-red-600 text-white border-red-700"
    }`}>
      {toast.msg}
    </div>
  );
}

/** Client helper to dispatch toast events. */
export function showToast(msg: string, ok = true) {
  document.dispatchEvent(new CustomEvent("admin:toast", { detail: { msg, ok } }));
}

/* ------------------------------------------------------------------------ */
/* Collapsible card (for section-based editors)                              */
/* ------------------------------------------------------------------------ */
export function Collapsible({ title, meta, children, defaultOpen = false }: { title: string; meta?: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 transition"
      >
        <div className="min-w-0">
          <div className="font-bold text-sm text-[#0A1931] truncate">{title}</div>
          {meta && <div className="text-xs text-slate-400 truncate">{meta}</div>}
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 transition text-slate-400 ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && <div className="border-t border-slate-100 p-5">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Search input that syncs to URL query                                      */
/* ------------------------------------------------------------------------ */
export function SearchBox({ placeholder = "Search…", param = "q" }: { placeholder?: string; param?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        if (value) url.searchParams.set(param, value);
        else url.searchParams.delete(param);
        router.push(url.pathname + "?" + url.searchParams.toString());
      }}
      className="relative"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full sm:w-64 border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#C5A253]"
      />
      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0A1931]" aria-label="Search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      </button>
    </form>
  );
}

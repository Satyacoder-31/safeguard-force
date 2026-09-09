"use client";

import { useRef, useState, useEffect } from "react";
import type { MediaItem } from "@/types/database";

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "application/pdf",
];
const MAX_MB = 20;

/**
 * Reusable media field: shows preview, upload button (server-side upload to
 * Supabase Storage `website-media` bucket) and library selection.
 */
export default function MediaPicker({
  name,
  defaultValue = "",
  label,
  folder = "general",
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif",
}: {
  name: string;
  defaultValue?: string;
  label: string;
  folder?: string;
  accept?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [library, setLibrary] = useState<MediaItem[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  async function upload(file: File) {
    setError(null);
    if (!ALLOWED.includes(file.type) && !file.type.startsWith("image/")) {
      setError("Unsupported file type. Use JPG, PNG, WebP, GIF, SVG, AVIF or PDF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Maximum ${MAX_MB} MB.`);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      fd.append("alt", alt);
      const { uploadMediaFile } = await import("@/lib/actions/admin");
      const res = await uploadMediaFile(fd);
      if (!res.ok || !res.publicUrl) {
        throw new Error(res.error || "Upload failed");
      }
      setValue(res.publicUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function openLibrary() {
    if (library) return setLibrary(null);
    try {
      const { createClient } = await import("@/lib/supabase/browser");
      const supabase = createClient();
      const { data } = await supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      setLibrary((data as MediaItem[]) ?? []);
    } catch {
      setLibrary([]);
    }
  }

  return (
    <div>
      <label className="block text-[11px] tracking-[0.14em] uppercase font-bold text-slate-500 mb-1.5">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-24 h-24 border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center">
          {value ? (
            value.toLowerCase().endsWith(".pdf") ? (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-2xl">📄</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">PDF Document</span>
              </div>
            ) : (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            )
          ) : (
            <span className="text-slate-300 text-xs">No media</span>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <input type="hidden" name={name} value={value} />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Media URL or upload below"
            className="w-full border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-[#C5A253]"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="bg-[#0A1931] text-white px-3 py-2 text-[11px] tracking-widest uppercase font-bold disabled:opacity-60">
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button type="button" onClick={openLibrary}
              className="border border-slate-300 text-slate-700 px-3 py-2 text-[11px] tracking-widest uppercase font-bold hover:bg-slate-50">
              {library ? "Close Library" : "Select Media"}
            </button>
            {value && (
              <button type="button" onClick={() => setValue("")}
                className="text-red-500 px-2 py-2 text-[11px] font-bold uppercase tracking-widest">
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {library && (
        <div className="mt-3 border border-slate-200 bg-slate-50 p-3 max-h-72 overflow-y-auto">
          {library.length === 0 ? (
            <p className="text-slate-400 text-xs text-center py-4">No media uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {library.map((m) => (
                <button type="button" key={m.id} onClick={() => { setValue(m.public_url); setLibrary(null); }}
                  className={`aspect-square border overflow-hidden bg-white hover:border-[#C5A253] transition ${value === m.public_url ? "border-[#C5A253] ring-1 ring-[#C5A253]" : "border-slate-200"}`}
                  title={m.alt_text || m.file_name}>
                  <img src={m.public_url} alt={m.alt_text || m.file_name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

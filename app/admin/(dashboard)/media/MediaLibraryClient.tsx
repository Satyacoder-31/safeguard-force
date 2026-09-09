"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaItem } from "@/types/database";
import { deleteMedia, updateMediaAlt } from "@/lib/actions/admin";
import { showToast } from "../../components/ui";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
const MAX_MB = 5;

export default function MediaLibraryClient({
  items,
  uploadOnly = false,
}: {
  items: MediaItem[];
  uploadOnly?: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folder, setFolder] = useState("general");
  const [editing, setEditing] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");

  async function upload(file: File) {
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError("Unsupported file type. Use JPG, PNG, WebP, GIF, SVG or AVIF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Maximum ${MAX_MB} MB.`);
      return;
    }
    setUploading(true);
    try {
      const { createClient } = await import("@/lib/supabase/browser");
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
      const path = `${folder}/${Date.now()}-${base}.${ext}`;
      const { error: upErr } = await supabase.storage.from("website-media").upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("website-media").getPublicUrl(path);
      const { data: userData } = await supabase.auth.getUser();
      const { error: dbErr } = await supabase.from("media_library").insert({
        file_name: file.name,
        storage_path: path,
        public_url: publicUrl,
        mime_type: file.type,
        folder,
        alt_text: base.replace(/-/g, " "),
        uploaded_by: userData?.user?.id ?? null,
      });
      if (dbErr) throw dbErr;
      showToast("Image uploaded");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes("row-level security") ? "Upload blocked — insufficient permissions." : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteMedia(fd);
    showToast(res.ok ? "Media deleted" : res.error || "Delete failed", res.ok);
    router.refresh();
  }

  async function saveAlt(id: string) {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("alt_text", altDraft);
    const res = await updateMediaAlt(fd);
    showToast(res.ok ? "Alt text saved" : res.error || "Save failed", res.ok);
    setEditing(null);
    router.refresh();
  }

  if (uploadOnly) {
    return (
      <div className="border border-dashed border-slate-300 bg-white p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="border border-slate-200 px-3 py-2.5 text-sm bg-white">
            {["logos", "hero", "services", "industries", "about", "general"].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-[#C5A253] text-[#0A1931] px-6 py-2.5 text-xs tracking-widest uppercase font-black disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "⬆ Upload Image"}
          </button>
          <input ref={fileRef} type="file" accept={ALLOWED.join(",")} className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
        </div>
        {error && <p className="text-red-600 text-xs mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((m) => (
        <div key={m.id} className="bg-white border border-slate-200 overflow-hidden group">
          <div className="aspect-square bg-slate-100 overflow-hidden relative">
            <img src={m.public_url} alt={m.alt_text || m.file_name} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => { navigator.clipboard.writeText(m.public_url); showToast("URL copied"); }}
                className="bg-white/95 border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase"
                title="Copy URL"
              >Copy</button>
              <button
                onClick={() => remove(m.id)}
                className="bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase"
                title="Delete"
              >✕</button>
            </div>
          </div>
          <div className="p-3">
            <div className="text-xs font-bold text-[#0A1931] truncate" title={m.file_name}>{m.file_name}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{m.folder}</div>
            {editing === m.id ? (
              <div className="mt-2 space-y-1.5">
                <input
                  value={altDraft}
                  onChange={(e) => setAltDraft(e.target.value)}
                  className="w-full border border-slate-200 px-2 py-1.5 text-xs"
                  placeholder="Alt text"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button onClick={() => saveAlt(m.id)} className="bg-[#0A1931] text-white px-2 py-1 text-[10px] font-bold uppercase">Save</button>
                  <button onClick={() => setEditing(null)} className="border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setEditing(m.id); setAltDraft(m.alt_text); }}
                className="mt-2 text-[10px] text-slate-400 hover:text-[#0A1931] underline uppercase tracking-wider"
              >
                {m.alt_text ? `Alt: ${m.alt_text.slice(0, 28)}` : "+ Add alt text"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

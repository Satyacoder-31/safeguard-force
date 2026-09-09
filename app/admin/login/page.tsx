"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/browser");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Invalid email or password." : error.message);
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not sign in. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">{error}</div>
      )}
      <div>
        <label htmlFor="email" className="block text-[11px] tracking-[0.16em] uppercase font-bold text-white/60 mb-2">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/15 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A253] transition"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-[11px] tracking-[0.16em] uppercase font-bold text-white/60 mb-2">Password</label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/15 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A253] transition"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C5A253] hover:bg-[#B8941F] disabled:opacity-60 text-[#0A1931] py-3.5 text-xs tracking-[0.16em] uppercase font-black transition"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A1931] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <img src="/images/safelogo.png" alt="SAFE Guard FORCE" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight">Admin Console</h1>
          <p className="text-white/50 text-sm mt-1">SAFE Guard FORCE Content Management</p>
        </div>
        <div className="bg-white/[0.04] border border-white/10 p-8 backdrop-blur">
          <Suspense fallback={<div className="text-white/50 text-sm">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">
          Authorized personnel only.{" "}
          <Link href="/" className="text-[#C5A253] hover:underline">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}

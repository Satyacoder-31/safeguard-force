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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/browser");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Invalid email or password." : error.message);
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Could not sign in. Please verify your connection or Supabase settings.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off" className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs px-4 py-3 rounded flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-red-400">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-[11px] tracking-[0.16em] uppercase font-bold text-white/70 mb-2">
          Admin Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/15 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C5A253] focus:ring-1 focus:ring-[#C5A253] transition rounded-sm placeholder:text-white/30"
            placeholder="admin@safeguardforce.in"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-[11px] tracking-[0.16em] uppercase font-bold text-white/70 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/15 px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-[#C5A253] focus:ring-1 focus:ring-[#C5A253] transition rounded-sm placeholder:text-white/30"
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C5A253] hover:bg-[#d6b364] disabled:opacity-60 text-[#0A1931] py-3.5 text-xs tracking-[0.18em] uppercase font-black transition rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A253]/10"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-[#0A1931]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Authenticating…</span>
          </>
        ) : (
          <span>Sign In to Admin Portal</span>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A1931] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C5A253]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 mb-4 p-2 shadow-xl backdrop-blur">
            <img src="/images/safelogo.png" alt="SAFE Guard FORCE" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white font-black text-2xl sm:text-3xl tracking-tight">Admin Console</h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1.5 font-medium">SAFE Guard FORCE Control Portal</p>
        </div>

        <div className="bg-white/[0.05] border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl rounded-sm">
          <Suspense fallback={<div className="text-white/50 text-sm py-4 text-center">Loading form…</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 text-xs text-white/40">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/80">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Authorized Personnel Only • 256-bit Encrypted Session</span>
          </div>
          <Link href="/" className="text-[#C5A253] hover:text-[#d6b364] hover:underline font-semibold flex items-center gap-1">
            <span>← Return to SAFE Guard FORCE Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

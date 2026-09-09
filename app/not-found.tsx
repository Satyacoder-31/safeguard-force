import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-white">
      <div className="text-center py-16">
        <div className="text-[#C5A253] text-[11px] tracking-[0.24em] uppercase font-bold mb-3">404 — Page Not Found</div>
        <h1 className="text-[#0A1931] font-black text-3xl sm:text-4xl leading-tight">
          This Page Has Moved<br />
          <span className="italic font-light text-[#C5A253]">Or Never Existed.</span>
        </h1>
        <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto">
          The page you are looking for could not be found. Explore our services or contact our team for assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/" className="bg-[#0A1931] text-white px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-bold">
            Back to Home
          </Link>
          <Link href="/contact" className="border border-slate-300 text-[#0A1931] px-7 py-3.5 text-xs tracking-[0.16em] uppercase font-bold">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

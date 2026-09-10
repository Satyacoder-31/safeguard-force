import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import { getSiteSettings, getContactSettings } from "@/lib/cms/queries";
import { telHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Corporate Brochure — ${settings.site_name}`,
    description:
      "Explore the official SAFE Guard FORCE Corporate Profile. Over two decades of security & facility management excellence in Mumbai and across India.",
  };
}

export default async function BrochurePage() {
  const [settings, contact] = await Promise.all([getSiteSettings(), getContactSettings()]);
  const effectivePdfUrl = settings.brochure_url || "/brochure.pdf";

  return (
    <>
      <PageHero
        eyebrow="Official Corporate Profile"
        title="SAFE GUARD FORCE\nCorporate Brochure"
        subtitle="Explore our complete 13-page corporate profile, operational capabilities, leadership foreword, statutory compliance, and client portfolio."
        image="/images/hero-mumbai-security.png"
      />

      {/* Action Bar */}
      <section className="bg-[#070F1F] border-y border-white/10 text-white py-5 sticky top-0 z-30 shadow-lg">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              Official Corporate Profile • PASARA License No. 293 • Govt. of Maharashtra
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={effectivePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download="SAFE_GUARD_FORCE_Corporate_Brochure.pdf"
              className="bg-[#C5A253] hover:bg-[#D4AF37] active:bg-[#B8941F] text-[#070F1F] px-6 py-2.5 text-xs tracking-[0.16em] uppercase font-black transition inline-flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>📥</span> Download PDF Brochure (13 Pages)
            </a>
            <Link
              href="/contact"
              className="border border-white/30 hover:bg-white hover:text-[#070F1F] text-white px-6 py-2.5 text-xs tracking-[0.16em] uppercase font-bold transition"
            >
              Request Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Main Brochure Document Pages */}
      <section className="py-12 lg:py-20 bg-slate-100">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 space-y-12">
          
          {/* PAGE 1: COVER */}
          <div className="bg-[#070F1F] text-white p-8 sm:p-14 lg:p-20 rounded-sm shadow-2xl border-t-4 border-[#C5A253] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A253]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <img src={settings.logo_url || "/images/safelogo.png"} alt="Safe Guard Force Shield" className="w-20 h-20 sm:w-28 sm:h-28 object-contain" />
              </div>
              <div className="pt-6">
                <span className="text-[#C5A253] text-xs sm:text-sm tracking-[0.3em] font-black uppercase block mb-3">
                  SAFE GUARD FORCE
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                  CORPORATE PROFILE
                </h1>
                <p className="text-[#C5A253] text-base sm:text-xl italic mt-3 font-light">
                  &ldquo;{settings.tagline || "Your Security, Our Priority."}&rdquo;
                </p>
              </div>
              <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs sm:text-sm tracking-wider uppercase font-semibold text-white/70">
                <span>Industrial</span> • <span>Event Security</span> • <span>Corporate Security</span> • <span>Residential</span>
              </div>
            </div>
          </div>

          {/* PAGE 2: ABOUT & VISION & MISSION */}
          <div className="bg-white p-8 sm:p-12 rounded-sm shadow-xl border border-slate-200 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">Page 2 of 13</span>
              <span className="text-xs font-bold text-slate-400">ABOUT SAFE GUARD FORCE</span>
            </div>
            
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 bg-[#0A1931] text-white p-6 rounded-sm space-y-6">
                <img src={settings.logo_url || "/images/safelogo.png"} alt="Logo" className="w-16 h-16 object-contain" />
                <h3 className="text-lg font-black text-white">ABOUT SAFE GUARD FORCE</h3>
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-3xl font-black text-[#C5A253]">20+ Years</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">of industry experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#C5A253]">24 × 7</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">operational support</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-8 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                <p className="font-medium text-slate-900">
                  <strong>Safe Guard Force</strong> is a professional security services company dedicated to protecting people, property, and business assets through highly trained security personnel and modern security practices. With <strong>over two decades of industry experience</strong>, we deliver reliable, disciplined, and customer-focused security solutions tailored to the unique requirements of residential, commercial, industrial, and corporate establishments.
                </p>
                <p>
                  Our commitment is to deliver dependable security services with integrity, professionalism, and operational excellence — backed by rigorous personnel training, structured supervision, and full statutory compliance.
                </p>
                <p className="text-[#0A1931] font-bold italic bg-amber-50 p-4 border-l-4 border-[#C5A253]">
                  Every engagement is guided by one principle: your security is our priority, always.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm">
                    <h4 className="font-black text-[#0A1931] text-sm uppercase tracking-wider mb-2">Our Vision</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      To be India&apos;s most trusted security services provider by delivering reliable, professional, and customer-focused security solutions.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm">
                    <h4 className="font-black text-[#0A1931] text-sm uppercase tracking-wider mb-2">Our Mission</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      To deliver dependable security solutions through professionally trained personnel, operational excellence, and a commitment to protecting people, property, and businesses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 3: DIRECTOR'S FOREWORD */}
          <div className="bg-white p-8 sm:p-12 rounded-sm shadow-xl border border-slate-200 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">Page 3 of 13</span>
              <span className="text-xs font-bold text-slate-400">DIRECTOR’S FOREWORD</span>
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 bg-[#0A1931] text-white p-6 rounded-sm text-center space-y-4">
                <img src="/images/director-shashikant-shukla.png" alt="Mr. Shashikant Shukla - Founder & Director" className="w-52 h-60 mx-auto object-cover object-top rounded border-2 border-[#C5A253] shadow-md" />
                <div>
                  <h3 className="font-black text-lg text-white">Mr. Shashikant Shukla</h3>
                  <p className="text-xs text-[#C5A253] uppercase font-bold tracking-wider mt-1">Founder & Director</p>
                  <p className="text-[11px] text-white/60 mt-1">SAFE GUARD FORCE</p>
                </div>
                <p className="text-xs italic text-amber-200/90 pt-2 border-t border-white/10">
                  &ldquo;Your Security, Our Priority.&rdquo;
                </p>
              </div>

              <div className="md:col-span-8 space-y-5 text-slate-700 leading-relaxed">
                <h3 className="text-xl sm:text-2xl font-black text-[#0A1931]">DIRECTOR’S FOREWORD</h3>
                <p className="text-sm sm:text-base">
                  At Safeguard Force, our people are our greatest strength. Every guard who wears our uniform carries the responsibility of protecting lives, property, and peace of mind — and I take personal pride in ensuring they are trained, disciplined, and ready for that responsibility.
                </p>
                <p className="text-sm sm:text-base">
                  Over the past two decades, we have built our reputation not on promises, but on consistent, dependable performance across every site we serve. As we grow, our commitment remains unchanged: to put your safety first, always.
                </p>
                <p className="text-sm font-semibold italic text-[#0A1931]">
                  Thank you for trusting Safe Guard Force with what matters most to you.
                </p>
                <div className="pt-4 border-t border-slate-200">
                  <div className="font-bold text-[#0A1931]">Mr. Shashikant Shukla</div>
                  <div className="text-xs text-slate-500">Founder & Director, Safe Guard Force</div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 4 & 5: SERVICES & WHY CHOOSE US */}
          <div className="bg-white p-8 sm:p-12 rounded-sm shadow-xl border border-slate-200 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">Pages 4 & 5 of 13</span>
              <span className="text-xs font-bold text-slate-400">SERVICES & WHY CHOOSE US</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#0A1931] uppercase tracking-wide">OUR SERVICES</h3>
              <p className="text-xs text-slate-500 mt-1">Comprehensive, end-to-end security solutions across every sector</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {[
                  "Industrial Security", "Construction Site Security", "Corporate Security", "Residential & Township",
                  "Shopping Malls Security", "Hospital Security", "Warehouse & Logistics", "Event Security",
                  "CCTV & Surveillance", "Fire & Safety Support", "Access Control Management", "VIP Protection & Escorts"
                ].map((s) => (
                  <div key={s} className="bg-slate-50 border border-slate-200 p-3.5 text-xs font-bold text-[#0A1931] rounded-sm flex items-center gap-2">
                    <span className="text-[#C5A253]">🛡️</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xl font-black text-[#0A1931] uppercase tracking-wide">WHY CHOOSE SAFE GUARD FORCE</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  "Professionally trained & background-verified guards",
                  "24×7 operational support and monitoring",
                  "Quick deployment & replacement within 24 hours",
                  "Regular site supervision & surprise checks",
                  "Customer-oriented, relationship-first approach",
                  "Strong discipline & professional conduct",
                  "Emergency response preparedness",
                  "Full compliance with applicable labour laws"
                ].map((item) => (
                  <div key={item} className="flex gap-3 bg-amber-50/50 border border-amber-200/60 p-3.5 rounded-sm text-xs font-semibold text-slate-800">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 6 & 7: TRAINING & QUALITY ASSURANCE */}
          <div className="bg-[#0A1931] text-white p-8 sm:p-12 rounded-sm shadow-xl space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">Pages 6 & 7 of 13</span>
              <span className="text-xs font-bold text-white/60">TRAINING & QUALITY ASSURANCE</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wide">TRAINING & QUALITY ASSURANCE</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Personnel undergo a rigorous 30-day training program at our dedicated centres in Karjat and Gorakhpur, with monthly refresher sessions at every deployment site.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                {[
                  "Security Procedures", "Fire Fighting", "First Aid & CPR",
                  "Emergency Response & Evacuation", "Customer Service", "Soft Skills & Communication",
                  "Access Control", "Patrolling Techniques", "Incident Reporting"
                ].map((t) => (
                  <div key={t} className="bg-white/10 border border-white/15 p-3 text-xs font-semibold text-white rounded-sm text-center">
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-black text-[#C5A253] uppercase tracking-wide mb-4">TRAINING IN ACTION</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white text-slate-800 p-4 rounded-sm">
                  <div className="font-bold text-xs text-[#0A1931] uppercase">Parade Training</div>
                  <p className="text-[11px] text-slate-600 mt-1">Structured instruction on procedures, protocols, and site-specific SOPs.</p>
                </div>
                <div className="bg-white text-slate-800 p-4 rounded-sm">
                  <div className="font-bold text-xs text-[#0A1931] uppercase">Field & Drill Training</div>
                  <p className="text-[11px] text-slate-600 mt-1">Hands-on patrol drills, alertness checks, and emergency-response practice.</p>
                </div>
                <div className="bg-white text-slate-800 p-4 rounded-sm">
                  <div className="font-bold text-xs text-[#0A1931] uppercase">Director Addressing Team</div>
                  <p className="text-[11px] text-slate-600 mt-1">Leadership sets the tone — direct engagement builds a disciplined force.</p>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 8 & 9: INDUSTRIES & DAILY BRIEFING */}
          <div className="bg-white p-8 sm:p-12 rounded-sm shadow-xl border border-slate-200 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">Pages 8 & 9 of 13</span>
              <span className="text-xs font-bold text-slate-400">OPERATIONAL PROCESS & DAILY BRIEFING</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#0A1931] uppercase tracking-wide">INDUSTRIES WE SERVE</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
                {[
                  "Corporate Offices", "IT Parks", "Manufacturing", "Warehouses & Logistics", "Educational Inst.",
                  "Hospitals", "Hotels & Hospitality", "Shopping Malls", "Banks & Financial", "Residential Societies"
                ].map((i) => (
                  <div key={i} className="bg-slate-100 p-2.5 text-center text-xs font-bold text-slate-800 rounded-sm">
                    {i}
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-[#0A1931] text-white p-3 text-xs text-center font-bold tracking-wider uppercase rounded-sm">
                Our Work Process: Site Survey → Risk Assessment → Security Planning → Deployment → Monitoring → Continuous Improvement
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xl font-black text-[#0A1931] uppercase tracking-wide">DAILY BRIEFING PROTOCOLS</h3>
              <p className="text-xs text-slate-500 mt-1">Every shift starts with a briefing to sharpen alertness, reinforce standards, and keep guards prepared.</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-4 text-xs font-medium text-slate-700">
                {[
                  "Greeting visitors, seniors, guests & employees", "Behaviour with clients & visitors",
                  "Daily grooming & uniform standards", "Calling procedure on RT sets",
                  "Frisking & operating hand-held metal detectors", "Vigilance & monitoring of suspicious movement",
                  "Lift operating procedure", "Incident reporting protocols",
                  "Material movement logging", "Knowledge of gate passes",
                  "Lost & found record maintenance"
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-sm">
                    <span className="text-[#C5A253]">💬</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAGE 10, 11 & 12: CLIENTS, COMPLIANCE & CONTACT */}
          <div className="bg-white p-8 sm:p-12 rounded-sm shadow-xl border border-slate-200 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#C5A253]">Pages 10, 11 & 12 of 13</span>
              <span className="text-xs font-bold text-slate-400">STATUTORY COMPLIANCE & CLIENTS</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#0A1931] uppercase tracking-wide">OUR STRENGTH & STATUTORY COMPLIANCE</h3>
              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#C5A253]">Our Strength</h4>
                  {[
                    "Professional management team", "Experienced supervisors",
                    "Reliable, disciplined security personnel", "Prompt client support",
                    "Technology-driven operations", "Commitment to customer satisfaction"
                  ].map((st) => (
                    <div key={st} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#0A1931] text-white p-6 rounded-sm space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#C5A253]">Registered & Compliant</h4>
                  <div className="space-y-2 text-xs text-white/90">
                    <div><strong>PASARA:</strong> Govt. of Maharashtra, Police Commissionerate, Mumbai (Serial No. 293)</div>
                    <div><strong>Shop & Establishment:</strong> 760151487</div>
                    <div><strong>ESIC Scheme:</strong> 31001016590001018</div>
                    <div><strong>Provident Fund (P.F.):</strong> M.H./THN/204490</div>
                    <div><strong>PAN & GST:</strong> 27AZMPS0092F124</div>
                    <div><strong>Maharashtra Professional Tax:</strong> P.T.-R.C. No. 27815216502P</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xl font-black text-[#0A1931] uppercase tracking-wide">HEAD OFFICE & BRANCH LOCATIONS</h3>
              <div className="grid sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm">
                  <div className="font-black text-[#0A1931] uppercase">Head Office (Ghatkopar)</div>
                  <p className="text-slate-600 mt-1">C-517, Kailas Esplanade Premises, LBS Marg, Opp. Shreyas Cinema, Ghatkopar (W), Mumbai - 400 086</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm">
                  <div className="font-black text-[#0A1931] uppercase">Branch Office (Sakinaka)</div>
                  <p className="text-slate-600 mt-1">Santosh Nagar, Pipeline Road, Sakinaka, Andheri, Mumbai - 400 072</p>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 13: BACK COVER / THANK YOU */}
          <div className="bg-[#070F1F] text-white p-12 sm:p-16 text-center rounded-sm shadow-2xl border-b-4 border-[#C5A253] space-y-6">
            <img src={settings.logo_url || "/images/safelogo.png"} alt="Safe Guard Force Logo" className="w-24 h-24 mx-auto object-contain" />
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">THANK YOU</h2>
            <p className="text-white/80 text-sm sm:text-base max-w-[540px] mx-auto italic">
              You are a valuable partner to us, and your satisfaction is our top priority.
            </p>
            <p className="text-[#C5A253] font-bold text-lg italic pt-4">
              &ldquo;{settings.tagline || "Your Security, Our Priority."}&rdquo;
            </p>
            <div className="pt-6 flex justify-center gap-4">
              <Link href="/contact" className="bg-[#C5A253] text-[#0A1931] px-8 py-3.5 text-xs font-black uppercase tracking-widest shadow-md">
                Get In Touch With Us
              </Link>
              <a href={telHref(settings.primary_phone)} className="border border-white/30 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest">
                Call {settings.primary_phone}
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

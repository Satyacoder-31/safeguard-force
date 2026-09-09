import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import { getSiteSettings, getNavigation } from "@/lib/cms/queries";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL("https://safeguardforce.in"),
    title: {
      default: `${settings.site_name} – Your Security. Our Priority. | Integrated Security & Facility Management Mumbai`,
      template: `%s | ${settings.site_name}`,
    },
    description:
      "SAFE Guard FORCE - Your Security. Our Priority. Integrated security, facility management, housekeeping, technical maintenance, STP operations & confidential investigation services in Mumbai. 24/7 Professional Assistance.",
    keywords: [
      "security services Mumbai",
      "security guards Mumbai",
      "facility management Mumbai",
      "housekeeping services Mumbai",
      "STP operation Mumbai",
      "detective agency Mumbai",
      "bouncer services Mumbai",
      "fire safety services Mumbai",
    ],
    icons: {
      icon: settings.favicon_url || "/images/safelogo.png",
      apple: settings.favicon_url || "/images/safelogo.png",
    },
    openGraph: {
      images: [settings.logo_url || "/images/safelogo.png"],
      siteName: settings.site_name,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const navigation = await getNavigation();

  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-white antialiased pb-[60px] lg:pb-0">
        <Header settings={settings} navigation={navigation} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <FloatingActions settings={settings} />
        {/* Legal disclaimer bar */}
        <div className="hidden" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { buildSiteMetadata } from "@/lib/site-metadata";
import "./globals.css";
import "@/components/landing/prayer-light-divider.css";
import "@/components/landing/signature-transition.css";

const pretendard = localFont({ src: "../../public/fonts/PretendardVariable.woff2", display: "swap", variable: "--font-pretendard", weight: "100 900" });
const inter = localFont({ src: "../../public/fonts/InterVariable.woff2", display: "swap", variable: "--font-inter", weight: "100 900" });

const siteUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
export const metadata: Metadata = buildSiteMetadata(siteUrl);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" className={`${pretendard.variable} ${inter.variable}`}><body>{children}</body></html>;
}

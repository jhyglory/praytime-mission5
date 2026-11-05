import type { Metadata } from "next";
import localFont from "next/font/local";
import { buildSiteMetadata } from "@/lib/site-metadata";
import "./globals.css";

const pretendard = localFont({ src: "../../public/fonts/PretendardVariable.woff2", display: "swap", variable: "--font-pretendard", weight: "100 900" });
const inter = localFont({ src: "../../public/fonts/InterVariable.woff2", display: "swap", variable: "--font-inter", weight: "100 900" });

export const metadata: Metadata = buildSiteMetadata(process.env.SITE_URL);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" className={`${pretendard.variable} ${inter.variable}`}><body>{children}</body></html>;
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://hisaabi.co.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Hisaabi — Free AI Expense Tracker With Chat, No Cloud",
    template: "%s — Hisaabi",
  },
  description:
    "Track expenses by chatting. Hisaabi is a free, private AI expense tracker — no signup, no cloud, your data stays on your device. Bring your own AI key.",
  applicationName: "Hisaabi",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-180.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Hisaabi",
    title: "Hisaabi — Free AI Expense Tracker With Chat, No Cloud",
    description:
      "Chat your expenses. Keep your data. A private, local-first AI expense tracker.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hisaabi — Free AI Expense Tracker With Chat, No Cloud",
    description: "Chat your expenses. Keep your data.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-black`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

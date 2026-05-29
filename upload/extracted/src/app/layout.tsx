import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MatkaKing - India's Fastest Matka Platform",
  description: "Secure gaming experience with lightning-fast performance, instant updates, wallet system, live gameplay and seamless mobile access. Download MatkaKing APK now.",
  keywords: ["MatkaKing", "Matka", "Number Game", "Gaming Platform", "APK Download", "Mobile Gaming"],
  authors: [{ name: "MatkaKing" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%2310b981'/><text x='50' y='68' font-size='50' font-weight='900' fill='black' text-anchor='middle'>MK</text></svg>",
  },
  openGraph: {
    title: "MatkaKing - India's Fastest Matka Platform",
    description: "Secure gaming with lightning-fast performance, instant updates & wallet system.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

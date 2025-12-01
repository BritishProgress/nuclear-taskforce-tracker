import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nuclear-taskforce-tracker.vercel.app'),
  title: "Nuclear Taskforce Tracker | Centre for British Progress",
  description: "Tracking government progress on the UK Nuclear Regulatory Taskforce's 47 recommendations for regulatory reform. An independent monitoring initiative by the Centre for British Progress.",
  keywords: ["nuclear", "regulation", "UK", "taskforce", "energy", "policy", "government", "nuclear regulation", "regulatory reform"],
  authors: [{ name: "Centre for British Progress" }],
  creator: "Centre for British Progress",
  publisher: "Centre for British Progress",
  openGraph: {
    title: "Nuclear Taskforce Tracker | Centre for British Progress",
    description: "Tracking government progress on the UK Nuclear Regulatory Taskforce's 47 recommendations for regulatory reform.",
    type: "website",
    siteName: "Nuclear Taskforce Tracker",
    images: [
      {
        url: "/icon.svg",
        width: 400,
        height: 400,
        alt: "Nuclear Taskforce Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuclear Taskforce Tracker",
    description: "Tracking government progress on the UK Nuclear Regulatory Taskforce's 47 recommendations for regulatory reform.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

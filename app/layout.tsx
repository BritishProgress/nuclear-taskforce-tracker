import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { TWITTER_SITE_HANDLE, TWITTER_CREATOR_HANDLE } from "@/lib/constants";
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

// Get the base URL for metadata - use production URL by default, localhost in dev
import { getBaseUrl } from '@/lib/url-utils';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Nuclear Taskforce Tracker | Centre for British Progress",
  description: "Tracking government progress on implementing the UK Nuclear Regulatory Taskforce's recommendations. An independent monitoring initiative by the Centre for British Progress.",
  keywords: ["nuclear", "regulation", "UK", "taskforce", "energy", "policy", "government", "nuclear regulation", "regulatory reform"],
  authors: [{ name: "Centre for British Progress" }],
  creator: "Centre for British Progress",
  publisher: "Centre for British Progress",
  openGraph: {
    title: "Nuclear Taskforce Tracker | Centre for British Progress",
    description: "Tracking government progress on implementing the UK Nuclear Regulatory Taskforce's recommendations.",
    type: "website",
    siteName: "Nuclear Taskforce Tracker",
    images: [
      {
        url: "/icon_dark.svg",
        width: 400,
        height: 400,
        alt: "Nuclear Taskforce Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuclear Taskforce Tracker",
    description: "Tracking government progress on implementing the UK Nuclear Regulatory Taskforce's recommendations.",
    images: [
      {
        url: "/icon_dark.svg",
        alt: "Nuclear Taskforce Tracker logo",
      },
    ],
    ...(TWITTER_SITE_HANDLE && { site: TWITTER_SITE_HANDLE }),
    ...(TWITTER_CREATOR_HANDLE && { creator: TWITTER_CREATOR_HANDLE }),
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

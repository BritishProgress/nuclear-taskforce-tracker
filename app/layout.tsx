import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
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
  title: "Nuclear Taskforce Tracker | Centre for British Progress",
  description: "Tracking government progress on the UK Nuclear Regulatory Taskforce's 47 recommendations for regulatory reform.",
  keywords: ["nuclear", "regulation", "UK", "taskforce", "energy", "policy", "government"],
  authors: [{ name: "Centre for British Progress" }],
  openGraph: {
    title: "Nuclear Taskforce Tracker",
    description: "Tracking government progress on nuclear regulatory reform",
    type: "website",
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
      </body>
    </html>
  );
}

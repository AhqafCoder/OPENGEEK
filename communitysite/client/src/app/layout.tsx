import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";
import { Toaster } from "@/components/ui/toaster";
import { ConnectionStatus } from "@/components/ui/connection-status";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OPENGEEK Community",
  description: "Join our community of developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          <Toaster />
          <ConnectionStatus />
        </body>
      </html>
    </ClerkProvider>
  );
}

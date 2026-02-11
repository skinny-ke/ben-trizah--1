import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "BEN & Trizah Memory Vault",
  description: "Our memories, forever. A private space for Ben and Trizah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans romantic-gradient min-h-screen`}>
        <Navbar />
        <main className="pb-24 pt-4 md:pb-8">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
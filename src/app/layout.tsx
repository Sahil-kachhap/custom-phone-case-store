import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Provider";
import {ClerkProvider} from "@clerk/nextjs";

const poppins = Poppins({ subsets: ['latin'], weight: "400" });

export const metadata: Metadata = {
  title: "CaseCanvas",
  description: "Get your custom phone case",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)]">
          <div className="flex flex-col flex-1 h-full">
             <Providers>{children}</Providers>
            </div>
          <Footer />
        </main>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}

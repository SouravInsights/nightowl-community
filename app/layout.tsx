import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/app/components/header";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen bg-gradient-to-b from-slate-950 to-slate-900`}
        >
          <Header />
          <main className="pt-16">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

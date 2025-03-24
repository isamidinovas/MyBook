"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClientProvider from "@/components/ClientProvider";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

// export const metadata: Metadata = {
//   title: "Create Next App by Symbat",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noHeaderFooterPaths = pathname !== "/" && pathname.length > 1;
  ["/book"];

  return (
    <html lang="en">
      <body>
        <ClientProvider>
          {!noHeaderFooterPaths && <NavBar />}
          <main> {children}</main>
          {!noHeaderFooterPaths && <Footer />}
        </ClientProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

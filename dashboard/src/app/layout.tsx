import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { PublicEnvScript } from "next-runtime-env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sendhooks Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PublicEnvScript />
      <body className={inter.className}>
        <div className="container mx-auto py-10">{children}</div>
      </body>
    </html>
  );
}

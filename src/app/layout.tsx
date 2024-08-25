import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const author = [
  { name: "Saptakarya", url: "https://saptakarya.co.id" }
]

export const metadata: Metadata = {
  authors: author,
  title: "Data Automation Tool",
  description: "Collaboration project with saptakarya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

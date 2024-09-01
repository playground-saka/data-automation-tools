import type { Metadata } from "next";
import { Inter } from "next/font/google";

import NextTopLoader from 'nextjs-toploader';

import "../globals.css";

import Sidebar from "@/components/shared/sidebar";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/toaster";
import { Html } from "next/document";

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
    <>
      <NextTopLoader
        color="#4f46e5"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={true}
        easing="ease"
        speed={200}
        shadow="0 0 10px #4f46e5,0 0 5px #4f46e5"
        template='<div class="bar" role="bar"><div class="peg"></div></div> 
          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        zIndex={1600}
        showAtBottom={false}
      />
      <ReduxProvider>
        <main className="flex">
          <Sidebar />
          <div className="relative flex-1 ml-[18rem] min-h-screen">
            {children}

            <footer className="absolute bottom-0 flex items-center justify-center w-full px-16 py-4 border-t">
              <h1 className="text-xs text-stone-800/30">
                Daman &copy; 2024 Saptakarya Indonesia.
              </h1>
            </footer>
          </div>
        </main>
      </ReduxProvider>
      <Toaster />
    </>
  );
}

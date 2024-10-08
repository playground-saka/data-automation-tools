"use client";
import { Toaster } from "@/components/ui/toaster";
import React, { PropsWithChildren } from "react";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <>
      <ReduxProvider>
        <section className="text-[#475569] p-3 sm:px-8 relative h-screen lg:overflow-hidden xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600 before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400 after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700">
          <div className='container relative z-10 sm:px-10'>
            <div className='block grid-cols-2 gap-4 xl:grid'>
              {/* login info */}
              <div className='hidden min-h-screen flex-col xl:flex'>
                <a href='' className='-intro-x flex items-center pt-5'>
                  <span className='ml-3 text-3xl font-bold text-white'>
                    Data Automation Tool
                  </span>
                </a>
                <div className='my-auto'>
                  <Image
                    src='/images/illustration.svg'
                    className='-intro-x -mt-16 w-1/2'
                    alt='image-ilustration'
                    width={500}
                    height={500}
                  />
                  <div className='-intro-x mt-10 text-4xl font-medium leading-tight text-white max-w-[450px]'>
                    Selamat Datang di Daman <br />
                  </div>
                  <div className='-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400 max-w-[450px]'>
                    Masuk untuk mengidentifikasi dan menganalisis dengan cepat
                    perbedaan antara file manual dan file yang diimpor sistem.
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-10">
                <div className="flex justify-start ms-20">
                  <Image
                    src='/images/logo.png'
                    alt='logo'
                    width={200}
                    height={50}
                  />
                </div>
                <div className='my-10 flex h-screen py-5 xl:my-0 xl:h-auto xl:py-0'>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ReduxProvider>
      <Toaster />
    </>
  );
}

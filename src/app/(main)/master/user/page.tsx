"use client";

import React from "react";

import Breadcrumbs from "@/components/shared/breadcrumbs";
import Index from "@/components/pages/master/user";

type Props = {};

function Page({}: Props) {
  return (
    <section className="w-full h-full flex flex-col gap-6 px-6 py-6 pt-12 pb-20">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-3xl">Pengguna</h1>
        <Breadcrumbs />
      </div>
      <Index />
    </section>
  );
}

export default Page;

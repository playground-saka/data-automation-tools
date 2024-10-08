"use client";

import Index from "@/components/pages/dashboard";
import Breadcrumbs from "@/components/shared/breadcrumbs";

export default function Page() {
  return (
    <section className="w-full h-full flex flex-col gap-6 px-6 py-6 pt-12 pb-20">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-3xl">Dashboard</h1>
        <Breadcrumbs />
      </div>
      <Index />
    </section>
  );
}

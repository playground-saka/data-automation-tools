"use client";
import { useState } from "react";
import ManualChart from "./manual-chart";
import SistemChart from "./sistem-chart";
import SelisihChart from "./selisih-chart";
import { Sheet } from "lucide-react";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";

export const description = "A multiple bar chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export default function Index() {
  return (
    <div className="w-full grid grid-cols-3 gap-3">
      <ManualChart />
      <SistemChart />
      <SelisihChart />
    </div>
  );
}

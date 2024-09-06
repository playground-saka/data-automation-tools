"use client"
import { getLaporanGrafikManual } from "@/app/api/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { convertToYmd, formatDateTime } from "@/utils/formatter";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function ManualChart(){
  const chartConfig = {
    voltage: {
      label: "Voltage",
      color: "#fff",
    },
    current: {
      label: "Current",
      color: "hsl(var(--chart-2))",
    },
    totalPowerP: {
      label: "Total Power P",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;
  const [manualDatas, setManualDatas] = useState<
    Model.Grafik.GrafikManualData[]
  >([]);
  const fetchDataGrafikManual = async () => {
    await getLaporanGrafikManual()
      .then((response) => {
        setManualDatas(response);
      })
      .catch((error) => {})
      .finally(() => {});
  };

  useEffect(() => {
    fetchDataGrafikManual();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Rata-rata Manual</CardTitle>
        <CardDescription>{new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={manualDatas}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                formatDateTime(convertToYmd(value), "M")
              }
              tick={{ fill: "white" }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  nameKey="date"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Bar dataKey="voltage" name={"Voltage"} fill="#2596be" radius={20} />
            <Bar dataKey="current" name={"Current"} fill="#eeeee4" radius={20} />
            <Bar
              dataKey="totalPowerP"
              name={"Total Power P"}
              fill="#154c79"
              radius={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
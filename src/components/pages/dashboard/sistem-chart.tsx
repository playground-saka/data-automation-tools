"use client"
import {  getLaporanGrafikSistem } from "@/app/api/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { convertToYmd, formatDateTime } from "@/utils/formatter";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function SistemChart(){
  const chartConfig = {
    voltage: {
      label: "Voltage",
      color: "#fff",
    },
    current: {
      label: "Current",
      color: "hsl(var(--chart-2))",
    },
    whExport: {
      label: "Wh Export",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;
  const [sistemDatas, setSistemDatas] = useState<
    Model.Grafik.GrafikSistemData[]
  >([]);

  const fetchDataGrafikSistem = async () => {
    await getLaporanGrafikSistem()
      .then((response) => {
        setSistemDatas(response);
      })
      .catch((error) => {})
      .finally(() => {});
  };

  useEffect(() => {
    fetchDataGrafikSistem();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Rata-rata Wilis</CardTitle>
        <CardDescription>{new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={sistemDatas}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              interval="preserveStartEnd"
              tick={{ fill: "white" }}
              tickCount={6}
              tickFormatter={(value) =>
                formatDateTime(convertToYmd(value), "M")
              }
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
            <Bar
              dataKey="voltage"
              name={"Voltage"}
              fill="#2596be"
              radius={20}
            />
            <Bar
              dataKey="current"
              name={"Current"}
              fill="#eeeee4"
              radius={20}
            />
            <Bar
              dataKey="whExport"
              name={"Wh Export"}
              fill="#154c79"
              radius={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
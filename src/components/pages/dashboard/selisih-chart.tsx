"use client"
import { getLaporanGrafikSelisih } from "@/app/api/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { convertToYmd, formatDateTime } from "@/utils/formatter";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function SelisihChart(){
  const chartConfig = {
    selisihPowerP: {
      label: "Selisih Power P",
      color: "#fff",
    },
    selisihCurrentR: {
      label: "Selisih Current R",
      color: "hsl(var(--chart-2))",
    },
    selisihVoltageRS: {
      label: "Selisih Voltage RS",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;
  const [selisihDatas, setSelisihDatas] = useState<
    Model.Grafik.GrafikSelisihData[]
  >([]);

  const fetchDataGrafikSelisih = async () => {
    await getLaporanGrafikSelisih()
      .then((response) => {
        setSelisihDatas(response);
      })
      .catch((error) => {})
      .finally(() => {});
  };

  useEffect(() => {
    fetchDataGrafikSelisih();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Rata-rata Selisih</CardTitle>
        <CardDescription>2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={selisihDatas}>
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
            <Bar dataKey="selisihPowerP" name={"Selisih Power P"} fill="#2596be" radius={20} />
            <Bar dataKey="selisihCurrentR" name={"Selisih Current R"} fill="#eeeee4" radius={20} />
            <Bar dataKey="selisihVoltageRS" name={"Selisih Voltage RS"} fill="#154c79" radius={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
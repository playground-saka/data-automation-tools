import axiosInstance from "@/lib/axios";

export async function getLaporanGrafikManual(): Promise<Model.Grafik.GrafikManualData[]> {
  const response = await axiosInstance.get("/laporan-grafik-manual");
  return response.data;
}

export async function getLaporanGrafikSistem(): Promise<Model.Grafik.GrafikSistemData[]> {
  const response = await axiosInstance.get("/laporan-grafik-sistem");
  return response.data;
}

export async function getLaporanGrafikSelisih(): Promise<Model.Grafik.GrafikSelisihData[]> {
  const response = await axiosInstance.get("/laporan-grafik-selisih");
  return response.data;
}

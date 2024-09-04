import axiosInstance from "@/lib/axios";

export async function getLaporanGrafikManual(): Promise<Model.Formula.FormulaData[]> {
  const response = await axiosInstance.get("/formula");
  return response.data;
}

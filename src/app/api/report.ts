import axiosInstance from "@/lib/axios";

export async function getReportManual(page = 1, per_page = 10,pelanggan_id:number,date:string | null): Promise<Model.DataTable.ResponseDt<Model.ReportManual.ReportManualData[]>> {
  const response = await axiosInstance.get(
    `/laporan-manual?page=${page}&per_page=${per_page}&pelanggan_id=${pelanggan_id}&date=${date}`
  );
  return response.data;
}

export async function getReportSystem(page = 1, per_page = 10,pelanggan_id:number,date:string | null): Promise<Model.DataTable.ResponseDt<Model.ReportSystem.ReportSystemData[]>> {
  const response = await axiosInstance.get(
    `/laporan-sistem?page=${page}&per_page=${per_page}&pelanggan_id=${pelanggan_id}&date=${date}`
  );
  return response.data;
}

export async function getReportDifferent(page = 1, per_page = 10,pelanggan_id:number,date:string | null): Promise<Model.DataTable.ResponseDt<Model.ReportDifferent.ReportDifferentData[]>> {
  const response = await axiosInstance.get(
    `/laporan-selisih?page=${page}&per_page=${per_page}&pelanggan_id=${pelanggan_id}&date=${date}`
  );
  return response.data;
}
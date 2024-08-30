import axiosInstance from "@/lib/axios";

export async function getLogsheet(page = 1, per_page = 10): Promise<Model.DataTable.ResponseDt<Model.LogSheet.LogSheetData[]>> {
  const response = await axiosInstance.get(`/logsheet-status?page=${page}&per_page=${per_page}`);
  return response.data;
}

export async function postLogSheetData(payload:any): Promise<Model.DataTable.ResponseDt<Model.LogSheet.LogSheetData[]>> {
  const response = await axiosInstance.post(
    `/logsheet-status`
  ,{...payload});
  return response.data;
}

export async function postLogsheetManual(payload:FormData): Promise<any> {
  const response = await axiosInstance.post(
    "/import-logsheet-manual",payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function postLogsheetSistem(payload: FormData): Promise<any> {
  const response = await axiosInstance.post("/import-logsheet-sistem", payload,{
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return response.data;
}
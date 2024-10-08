import axiosInstance from "@/lib/axios";

export async function getLogsheet(page = 1, per_page = 10,month:string = "",search:string = ""): Promise<Model.DataTable.ResponseDt<Model.LogSheet.LogSheetData[]>> {
  const response = await axiosInstance.get(
    `/logsheet-status?page=${page}&per_page=${per_page}&date=${month}&search=${search}`
  );
  return response.data;
}

export async function detailLogsheet(id:string): Promise<Model.LogSheet.LogSheetData> {
  const response = await axiosInstance.get(`/logsheet-status/detail/${id}`);
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

export async function exportDifferentLogsheet(pelangganId:number,date:string): Promise<Blob> {
  const response = await axiosInstance.get(`/download-selisih?download=true&pelanggan_id=${pelangganId}&date=${date}`,{
    responseType: 'blob',
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  });
  
  return response.data;
}

export async function rollBackLogSheet(logsheet:Model.LogSheet.LogSheetData,rollBackType:string): Promise<any> {
  const body = {
    pelangganId: logsheet.pelanggan.id,
    date: logsheet.years+"-"+logsheet.month,
    type: rollBackType
  };  
  const response = await axiosInstance.post("/rollback-logsheet",body);
  return response.data;
}
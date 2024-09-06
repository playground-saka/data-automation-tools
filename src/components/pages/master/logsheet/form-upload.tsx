"use client"
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { Column, ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
import { TablePreview } from "./table-preview";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { postLogsheetManual, postLogsheetSistem } from "@/app/api/logsheet";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloudIcon, UploadCloudIcon } from "lucide-react";
import { formatDateTime } from "@/utils/formatter";


type Props = {
  pelangganId: any;
  pelangganCode: any;
  date: string;
  type: string;
};

function FormUpload(params:Props){

  const [excelFile, setExcelFileState] = useState<File | null>();
  const [column, setColumn] = useState<ColumnDef<any>[]>([]);
  const [data, setData] = useState<Column<any>[]>([]);
  const router = useRouter();
  const [titleExcel, setTitleExcel] = useState<string>("");
  const [namaPelanggan, setNamaPelanggan] = useState<string>("");
  const [pelangganId, setPelangganId] = useState<string>("");
  const [loading,setLoading] = useState(false);
  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
    
  });
  const setExcelFile = (file: File) => {
    setExcelFileState(file);
  }

  const handleUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget as HTMLInputElement;
    const fileExcel = fileInput.files?.[0] as File;
    if (!fileExcel) return;
    
    const allowFileTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    // VALIDASI FILE TIDAK DITEMUKAN
    if(!fileExcel) {
      toast({
        title: "Kesalahan",
        description: "File Tidak Ditemukan",
      });
      return false
    }

    //VALIDASI NAMA FILE
    const fileName = fileExcel.name.split('.').slice(0, -1).join('.');
    const regex = params.type == 'manual' ? /manual/i : /sistem/i;
    if (!regex.test(fileName)) {
      toast({
        title: "Kesalahan",
        description: "Nama File Tidak Sesuai",
        action: <ToastAction altText="Dismiss">Tutup</ToastAction>,
      });
      return false;
    }

    // VALIDASI FILE EXTENSION
    if (!allowFileTypes.includes(fileExcel?.type)){
      toast({
        title: "Kesalahan",
        description: "File type not allowed",
        action: <ToastAction altText="Dismiss">Tutup</ToastAction>,
      });
      return false;
    }

    let reader = new FileReader();
    reader.readAsArrayBuffer(fileExcel);
    reader.onload = (e) => {
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const dataExcel: any[] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
      });

      // Temukan baris pertama yang memiliki data
      let firstDataRowIndex = 0;
      for (let i = 0; i < dataExcel.length; i++) {
        if (
          dataExcel[i].some(
            (cell: any) =>
              cell !== undefined && cell !== null && cell !== ""
          )
        ) {
          firstDataRowIndex = i;
          break;
        }
      }

      const jsonData: any[] = dataExcel.splice(firstDataRowIndex);

      setTitleExcel(jsonData[0] ?? "");
      setPelangganId(jsonData[1] ?? "");
      setNamaPelanggan(jsonData[2] ?? "");
      
      if(((jsonData[1][0]).split(":")[1]).replace(" ","") != (params.pelangganCode).replace(" ","")){
        toast({
          title: "Kesalahan",
          description: "Terdapat perbedaan kode/pelanggan pada file yang diupload"
        })
        onCancelUpload();
        return false;
      }
      
      //VALIDASI JIKA DATE TIDAK SESUAI
      let lengthValidate = params.type == "sistem" ? ((jsonData.length) - 2) : jsonData.length;
      for (let i = 4; i < lengthValidate; i++) {
        
        if (formatDateTime(jsonData[i][1], "m-Y") != params.date) {
          toast({
            title: "Kesalahan",
            description:
              "Tanggal pada file excel tidak sesuai dengan data Logsheet Status",
          });
          onCancelUpload();
          return false;
        }
      }

      // VALIDASI COLUMN
      if (
        (jsonData.length !== 4 &&
          jsonData[3].length !== 14 &&
          params.type == "sistem") ||
        (jsonData.length !== 4 &&
          jsonData[3].length !== 12 &&
          params.type == "manual")
      ) {
        toast({
          title: "Kesalahan",
          description: "Terdapat data yang tidak sesuai",
        });
        return false;
      }

      let columnData: ColumnDef<any>[] = [];
      let tempData: any = [];

      jsonData[3].forEach((item: any, idx: any) => {
        columnData.push({
          accessorKey: item.toLowerCase().replace(/[.]/g, ""),
          header: ({ column }: { column: any }) => (
            <DataTableColumnHeader column={column} title={item} />
          ),
          cell: ({ row }: { row: any }) => {
            return (
              <div className="flex items-center">
                {row.getValue(item.toLowerCase().replace(/[.]/g, ""))}
              </div>
            );
          },
          enableSorting: false,
          enableHiding: false,
        });
      });
      setColumn(columnData);
      jsonData.forEach((items, idx) => {
        if (idx > 3 && idx < 14) {
          let data: any = {};
          items.forEach((item: any, i: number) => {
            data[jsonData[3][i].toLowerCase().replace(/[.]/g, "")] = item;
          });
          tempData.push(data);
        }
      });
      setData(tempData);
      setExcelFile(fileExcel);
    };
  }

  const onCancelUpload = () => {
    setExcelFileState(null);
    const inputElement = document.getElementById("upload") as HTMLInputElement | null;
    if (inputElement) {
      inputElement.value = "";
    }
  }

  const onSubmit = async() => {
    let formData = new FormData();
    formData.append("file", excelFile ?? "");
    formData.append("pelangganId", params.pelangganId);
    setLoading(true);
    if(params.type == "manual"){
      await postLogsheetManual(formData)
        .then((res) => {
          toast({
            title: "Sukses",
            description: "File berhasil diupload",
          });
          router.push("/master/logsheet");
        })
        .catch((err) => {
          // if (input) input.value = "";
          toast({
            title: "Kesalahan",
            description: err.response.data.message,
          });
        }).finally(()=>{
          setLoading(false);
        });
    }else{
      await postLogsheetSistem(formData)
        .then((res) => {
          toast({
            title: "Sukses",
            description: "File berhasil diupload",
          });
          router.push("/master/logsheet");
        })
        .catch((err) => {
          toast({
            title: "Kesalahan",
            description: err.response.data.message,
          });
        }).finally(()=>{
          setLoading(false);
        });
    }
  }
  const downloadFile = () => {
    const link = document.createElement("a");
    if (params.type == "sistem") {
      link.href = "/excel/LP PLTMH sistem.xlsx";
      link.download = "logsheet-wilis.xlsx";
    } else {
      link.href = "/excel/LP PLTMH manual.xlsx";
      link.download = "logsheet-manual.xlsx";
    }
    link.click();
  }
  return (
    <>
      {!excelFile ? (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="items-center justify-center">
                  <span className="text-lg font-bold rounded-full border px-5 py-3 text-center border-3">
                    1
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Unduh Format File</h1>
                  <span>
                    Untuk langkah pertama silakan unduh format file excel yang
                    sudah di sediakan
                  </span>
                </div>
              </CardContent>
              <CardFooter className="w-full flex items-center justify-center mt-14">
                <Button onClick={downloadFile} variant="outline" className="">
                  <DownloadCloudIcon />
                  &nbsp;Unduh Format File
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="items-center justify-center">
                  <span className="text-lg font-bold rounded-full border px-5 py-3 text-center border-3">
                    2
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Siapkan Data</h1>
                  <span>
                    Lengkapi data yang anda ingin di upload, ke dalam format file
                    excel yang telah anda download. Lalu simpan file di direktori
                  </span>
                </div>
              </CardContent>
              <CardFooter className="w-full flex items-center justify-center mt-14">
                <div className="h-[60px]"></div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="items-center justify-center">
                  <span className="text-lg font-bold rounded-full border px-5 py-3 text-center border-3">
                    3
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Upload File</h1>
                  <span>
                    Selanjutnya, jika anda sudah yakin dengan data yang anda
                    isikan sebelumnya dengan format yang sesuai, silakan klik
                    tombol Pilih File di bawah ini.
                  </span>
                </div>
              </CardContent>
              <CardFooter className="w-full flex items-center justify-center mt-14">
                <label htmlFor="upload" onClick={(e) => {
                  const input = e.currentTarget.nextElementSibling as HTMLInputElement;
                  input.click();
                }}>
                  <Button variant="outline">
                    <UploadCloudIcon /> &nbsp; Pilih File
                  </Button>
                </label>
                <input
                  className="hidden"
                  type="file"
                  name="upload"
                  id="upload"
                  onChange={handleUpload}
                  accept=".csv,.xlsx,.xls"
                />
              </CardFooter>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="w-full grid gap-3">
            <div className="w-full shadow-lg rounded-2xl p-5 flex flex-col gap-2 bg-[var(--sidebar-bg)]">
              <div className="w-full flex flex-col">
                <span>{titleExcel}</span>
                <span>{pelangganId}</span>
                <span>{namaPelanggan}</span>
              </div>
              <div className="w-full">
                <TablePreview table={table} totalRows={data.length} />
                <div className="w-full flex justify-center mt-2">
                  <span>Menampilkan data 10 baris pertama pada file</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex relative w-full mt-5">
            <div className="flex ml-auto gap-2">
              <Button
                disabled={loading}
                isLoading={loading}
                variant="outline"
                onClick={onCancelUpload}
                type="button"
              >
                Batal
              </Button>

              <Button
                type="button"
                disabled={loading}
                isLoading={loading}
                onClick={onSubmit}
              >
                Proses
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FormUpload
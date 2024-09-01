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


type Props = {
  pelangganId: string;
  type: string;
};

function FormUpload(params:Props){
  const [excelFile, setExcelFileState] = useState<File | null>();
  const [column, setColumn] = useState<ColumnDef<any>[]>([]);
  const [data, setData] = useState<Column<any>[]>([]);
  const router = useRouter();
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
    if(!fileExcel) {
      toast({
        title: "Error",
        description: "File Tidak Ditemukan",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
      return false
    }
    //ambil nama file tanpa extensionnya
    const fileName = fileExcel.name.split('.').slice(0, -1).join('.');
    const regex = params.type == 'manual' ? /manual/i : /sistem/i;
    if (!regex.test(fileName)) {
      toast({
        title: "Error",
        description: "Nama File Tidak Sesuai",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
      return 0;
    }

    if (!allowFileTypes.includes(fileExcel?.type)){
      toast({
        title: "Error",
        description: "File type not allowed",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
      return false;
    }
    setExcelFile(fileExcel);
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
      if (
        (jsonData.length !== 4 &&
          jsonData[3].length !== 14 &&
          params.type == "sistem") ||
        (jsonData.length !== 4 &&
          jsonData[3].length !== 12 &&
          params.type == "manual")
      ) {
        toast({
          title: "Gagal",
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
    };
  }

  const onCancelUpload = () => {
    setExcelFileState(null);
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
            title: "Gagal",
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
            title: "Gagal",
            description: err.response.data.message,
          });
        }).finally(()=>{
          setLoading(false);
        });
    }
  }
  return (
    <>
      {!excelFile ? (
        <>
          <label htmlFor="upload">
            <div className="w-full flex">
              <div className="w-full flex items-center justify-center shadow-lg rounded-2xl p-5 min-h-[300px] cursor-pointer">
                <span className="text-2xl">
                  Select or drop here your file .csv file
                </span>
              </div>
            </div>
          </label>
          <input
            className="hidden"
            type="file"
            name="upload"
            id="upload"
            onChange={handleUpload}
            accept="*.csv"
          />
        </>
      ) : (
        <>
          <div className="w-full grid gap-3">
            <div className="w-full shadow-lg rounded-2xl p-5 flex flex-col gap-2 bg-[var(--sidebar-bg)]">
              <div className="w-full flex text-lg font-semibold">
                <span>Displays the top 10 data from the uploaded file</span>
              </div>
              <div className="w-full">
                <TablePreview table={table} totalRows={data.length} />
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

              <Button type="button" disabled={loading} isLoading={loading} onClick={onSubmit}>
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
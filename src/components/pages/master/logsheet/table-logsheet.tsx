import React, { HTMLAttributes, HtmlHTMLAttributes, useContext, useEffect, useState } from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LogSheetontext } from '../../../providers/LogSheetProvider'
import { getLogsheet, postLogsheetManual, postLogsheetSistem } from '@/app/api/logsheet'
import { formatDateTime } from '@/utils/formatter'
import { ToastAction } from '@radix-ui/react-toast'
import { toast } from '@/components/ui/use-toast'
import * as XLSX from 'xlsx';

type Props = {}

function TableLogsheet({}: Props) {
  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    let id = e.currentTarget.id
    let selectedFile: File | null = null
    if (e.currentTarget && e.currentTarget.files && e.currentTarget.files.length > 0) selectedFile = e.currentTarget.files[0];
    let allowFileTypes = [ "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (selectedFile) {
      if (!allowFileTypes.includes(selectedFile.type)) {
        toast({
          title: "Error",
          description: "File type not allowed",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
      } else {
        let typeImport = e.currentTarget.id.split("_")[2];
        let pelangganId = e.currentTarget.id.split("_")[1];
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = async(e) => {
          const bstr = e.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const dataExcel:any[] = XLSX.utils.sheet_to_json(ws, {
            header: 1,
          });

          // Temukan baris pertama yang memiliki data
          let firstDataRowIndex = 0;
          for (let i = 0; i < dataExcel.length; i++) {
            if (dataExcel[i].some( (cell: any) => cell !== undefined && cell !== null && cell !== "")) {
              firstDataRowIndex = i;
              break;
            }
          }
          const jsonData: any[] = dataExcel.splice(firstDataRowIndex, 4);
          
          let formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("pelangganId", pelangganId);
          let input = document.getElementById(id) as HTMLInputElement | null;

          if (typeImport == "manual") {
            if (jsonData.length !== 4 && jsonData[3].length !== 12) {
              toast({
                title: "Gagal",
                description: "Terdapat data yang tidak sesuai"
              });
            }else{
              await postLogsheetManual(formData)
              .then((res) => {
                toast({
                  title: "Sukses",
                  description: "File berhasil diupload",
                });
                fetchData();
              }).catch((err) => {
                if (input) input.value = "";
                toast({
                  title: "Gagal",
                  description: err.response.data.message
                });
              })
            }
          } else {
            if (jsonData.length !== 4 && jsonData[3].length !== 14) {
               toast({
                title: "Gagal",
                description: "Terdapat data yang tidak sesuai"
              });
            }else{
              await postLogsheetSistem(formData)
              .then((res) => {
                toast({
                  title: "Sukses",
                  description: "File berhasil diupload"
                });
                fetchData();
              })
              .catch((err)=>{
                if (input) input.value = "";
                toast({
                  title: "Gagal",
                  description: err.response.data.message
                });
              })
            }
          }
        };
      }
  
    }else{
      toast({
        title: "Error",
        description: "File not found",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    }
  
  }
  const columns: ColumnDef<Model.LogSheet.LogSheetData>[] = [
    {
      accessorKey: "date",
      header: () => {
        return (
          <div className="flex flex-row gap-1 items-center text-xs">
            Tanggal
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-xs">
          {formatDateTime(row.getValue("date"), "m-Y")}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "namaPelanggan",
      accessorFn: (row) =>
        row.pelanggan.kategori.namaKategori +
        " - " +
        row.pelanggan.namaPelanggan,
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Pelanggan
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        const name = row.getValue("namaPelanggan");

        return <div className="text-xs">{name}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "logsheetManual",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Logsheet Manual
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div
          className={`
        rounded-md px-2 py-1 w-fit
        ${
          row.getValue("logsheetManual")
            ? "bg-indigo-100 text-indigo-700"
            : "bg-gray-100 text-gray-500"
        }
      `}
        >
          {row.getValue("logsheetManual") ? (
            <p className="capitalize text-xs text-center">Uploaded</p>
          ) : (
            <div className="cursor-pointer">
              <input
                id={`${row.original.id}_${row.original.pelanggan.id}_manual`}
                type="file"
                className="hidden"
                name={`${row.original.id}_${row.original.pelanggan.id}_manual`}
                onChange={onChangeFile}
              />
              <label
                htmlFor={`${row.original.id}_${row.original.pelanggan.id}_manual`}
                className="text-xs cursor-pointer"
              >
                Belum di Upload
              </label>
            </div>
          )}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "logsheetSistem",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Logsheet Sistem
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div
          className={`rounded-md px-2 py-1 w-fit
        ${
          row.getValue("logsheetSistem")
            ? "bg-indigo-100 text-indigo-700"
            : "bg-gray-100 text-gray-500"
        }
      `}
        >
          {row.getValue("logsheetSistem") ? (
            <p className="capitalize text-xs text-center">Uploaded</p>
          ) : (
            <div className="cursor-pointer">
              <input
                id={`${row.original.id}_${row.original.pelanggan.id}_sistem`}
                type="file"
                className="hidden"
                name={`${row.original.id}_${row.original.pelanggan.id}_sistem`}
                onChange={onChangeFile}
              />
              <label
                htmlFor={`${row.original.id}_${row.original.pelanggan.id}_sistem`}
                className="text-xs cursor-pointer"
              >
                Belum di Upload
              </label>
            </div>
          )}
        </div>
      ),
      enableSorting: true,
    },
  ];
  const [data,setData] = useState<Model.DataTable.ResponseDt<Model.LogSheet.LogSheetData[]>>()
  const { triggerFetch } = useContext(LogSheetontext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await getLogsheet(currentPage, perPage)
    .then((res) => {
      setData(res);
      setTotalPages(res.total_pages); 
    })
    .catch((err) => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    });
  };
useEffect(() => {
  fetchData();
}, [triggerFetch, currentPage, perPage]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="cari berdasarkan nama..."
          value={
            (table.getColumn("namaPelanggan")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("namaPelanggan")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type='button' variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(data?.prev_page ? data?.prev_page : 1)}
            disabled={!data?.per_page || data?.current_page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(data?.next_page ? data?.next_page : 1)}
            disabled={!data?.next_page}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableLogsheet
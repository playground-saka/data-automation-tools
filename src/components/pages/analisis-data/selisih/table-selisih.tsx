import React, { useEffect, useState } from 'react'

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
import { ArrowUpDown, ChevronDown, EyeOffIcon, FileDownIcon, LoaderIcon } from "lucide-react"

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
import { EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { exportDifferentLogsheet, getLogsheet } from '@/app/api/logsheet'
import { formatDateTime } from '@/utils/formatter'
import { toast } from '@/components/ui/use-toast'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";


type Props = {}


function TableSelisih({}: Props) {
  const [data,setData] = React.useState<Model.DataTable.ResponseDt<Model.LogSheet.LogSheetData[]>>()
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [perPage, setPerPage] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const columns: ColumnDef<Model.LogSheet.LogSheetData>[] = [
    {
      id: "date",
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
      id: "namaPelanggan",
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
        return <div className="text-xs">{row.getValue("namaPelanggan")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "status",
      accessorKey: "status",
      accessorFn: (row) =>
        row.logsheetManual && row.logsheetSistem ? "Selesai" : "Belum Selesai",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return (
          <div
            className={`rounded-md px-2 py-1 w-fit ${
              row.getValue("status") == "Selesai"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {row.getValue("status")}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const pelanggan_id = row.original.pelanggan.id;
        const status =
          row.original.logsheetManual && row.original.logsheetSistem;
        return (
          <>
            <div className="flex flex-row">
              {status ? (
                <Link
                  href={`/analisis-data/selisih/${pelanggan_id}?date=${row.original.month}-${row.original.years}`}
                  className="p-2 w-fit flex justify-end cursor-pointer"
                >
                  <EyeIcon className="w-4 h-4" />
                </Link>
              ) : (
                <div className="p-2 w-fit flex justify-end">
                  <EyeOffIcon className="w-4 h-4 text-stone-800/75" />
                </div>
              )}
              {(status) && (
                <div
                  className="p-2 w-fit flex justify-end cursor-pointer"
                  onClick={() => {
                    exportDifferentData(
                      row.original.pelanggan.id,
                      row.original.pelanggan.namaPelanggan,
                      `${row.original.years} - ${row.original.month}`
                    );
                  }}
                >
                  <FileDownIcon className="w-4 h-4 text-stone-800/75" />
                </div>
              )}
            </div>
          </>
        );
      },
    },
  ];
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [month, setMonth] = useState<string>("");

  const onChangeMonth = (date: Date | null) => {
    setStartDate(date);
    let d = new Date(date ?? new Date());

    // Get the month and year
    let month = String(d.getMonth() + 1).padStart(2, "0"); // Ensure two digits
    let year = d.getFullYear();

    // Format as MM-YYYY
    let formattedDate = `${month}-${year}`;
    setMonth(formattedDate);
  };


  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
  });
  useEffect(() => {
    let isMounted = true
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const res = await getLogsheet(currentPage, perPage,month)
        if (isMounted) {
          setData(res);
          setTotalPages(res.total_pages);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchDataAsync()
    return () => {
      isMounted = false
    }
  }, [currentPage, perPage, month]);

  const exportDifferentData = async (id:number,namaPelanggan:string,date:string):Promise<void> => {
    await exportDifferentLogsheet(id, date)
    .then(async (res) => {
      const url = window.URL.createObjectURL(res);
      // Buat elemen anchor (a) untuk mengunduh file
      const a = document.createElement("a");
      a.href = url;

      // Tentukan nama file yang akan diunduh
      a.download = `Laporan Selisih Logsheet ${namaPelanggan} (${date}).xlsx`;
      document.body.appendChild(a);
      a.click();

      // Hapus elemen anchor setelah selesai
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      toast({
        title: "Error",
        description: err.response.data.message,
      })
    })
    .finally(() => {
      
    });
  }
  
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
        <div className="ml-auto flex gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => onChangeMonth(date)}
            dateFormat="MM-yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            placeholderText="Select Month and Year"
            shouldCloseOnSelect={true}
            customInput={<Input placeholder="Pilih Bulan" value={month} />}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Filter Kolom <ChevronDown className="ml-2 h-4 w-4" />
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
                <TableCell colSpan={columns.length} className="h-24 w-full">
                  {loading ? (
                    <>
                      <div className="flex items-center justify-center">
                        <LoaderIcon className="animate-spin" /> &nbsp;Loading...
                      </div>
                    </>
                  ) : (
                    "Data Tidak Tersedia"
                  )}
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableSelisih
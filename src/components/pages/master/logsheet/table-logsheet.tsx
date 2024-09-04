import React, { useContext, useEffect, useState } from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { getLogsheet } from '@/app/api/logsheet'
import { formatDateTime } from '@/utils/formatter'
import { useRouter } from 'next/navigation'

type Props = {}

function TableLogsheet({}: Props) {
  const router = useRouter()
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
            <p className=" text-xs text-center">Selesai di Upload</p>
          ) : (
            <div
              className="cursor-pointer text-xs"
              onClick={() =>
                router.push(
                  `/master/logsheet/upload/${row.original.id}/manual`
                )
              }
            >
              Belum di Upload
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
            <p className="text-xs text-center">Selesai di Upload</p>
          ) : (
            <div className={`cursor-pointer text-xs ${!row.original.logsheetManual && 'cursor-not-allowed'}`} title={!row.original.logsheetManual ? 'File Manual Belum di Upload' : ''} onClick={row.original.logsheetManual ? () =>
                router.push(
                  `/master/logsheet/upload/${row.original.pelanggan.id}/sistem`
                )
              : ()=>{}}>
              Belum di Upload
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

  const fetchData = React.useCallback(async () => {
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
  }, [currentPage, perPage]);
  
  useEffect(() => {
    fetchData();
  }, [triggerFetch, fetchData]);

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
              Filter Kolom <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column:any) => {
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
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(data?.next_page ? data?.next_page : 1)}
            disabled={!data?.next_page}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableLogsheet
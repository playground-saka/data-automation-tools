import React, { useEffect } from 'react'

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
import { ArrowUpDown, ChevronDown, EyeOffIcon } from "lucide-react"

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
import { getLogsheet } from '@/app/api/logsheet'
import { formatDateTime } from '@/utils/formatter'

type Props = {}

type Logsheet = {
  id: number
  name: string
  kategori: "PLTM" | "PLTMH" | "PLTMS"
  date: string
  status: "ready" | "not-ready"
}

export const columns: ColumnDef<Model.LogSheet.LogSheetData>[] = [
  {
    accessorKey: "date",
    header: () => {
      return (
        <div className="flex flex-row gap-1 items-center text-xs">Tanggal</div>
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
      row.pelanggan.kategori.namaKategori + " - " + row.pelanggan.namaPelanggan,
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
      const name = row.getValue("name");
      const kategori = row.original.kategori;

      return <div className="text-xs">{row.getValue("namaPelanggan")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    accessorFn: (row) =>
      row.logsheetManual && row.logsheetSistem ? "Ready" : "Not Ready",
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
            row.getValue("statusPelanggan")
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
      const status = row.original.logsheetManual && row.original.logsheetSistem;

      return (
        <>
          {status || true ? (
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
        </>
      );
    },
  },
];

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
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
  const fetchData = async () => {
    setLoading(true);
    await getLogsheet(currentPage, perPage)
      .then((res) => {
        setData(res);
        setTotalPages(res.total_pages);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    fetchData() 
  }, [])
  
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="cari berdasarkan nama..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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
                )
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
                  )
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TableSelisih
import React, { useContext, useEffect, useState } from 'react'

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
import { ArrowUpDown, ChevronDown, LoaderIcon, Trash2Icon } from "lucide-react"

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
import { getFormulas } from '@/app/api/formula'
import { FormulaContext } from '../../../providers/FormulaProvider'
import { toast } from '@/components/ui/use-toast'
import { PencilIcon } from '@heroicons/react/24/outline'
import { checkPermission } from '@/utils/permissions'

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
}

type Formula = {
  id: number
  name: string
  kategori: "PLTM" | "PLTMH" | "PLTMS"
  formula: string
}


function TableFormula({setOpenForm}: Props) {
  const { triggerFetch, setFormula,setOpenDialogDelete } = useContext(FormulaContext);
  const columns: ColumnDef<Model.Formula.FormulaData>[] = [
    {
      accessorKey: "namaPelanggan",
      accessorFn: (row) => row.pelanggan.namaPelanggan,
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
      accessorKey: "faktorArus",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Faktor Arus
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("faktorArus")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "faktorTegangan",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Faktor Tegangan
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("faktorTegangan")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "faktorPower",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Faktor Power
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("faktorPower")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex flex-row">
              {checkPermission("master.formula.update") && (
                <div
                  onClick={() => {
                    setFormula(row.original);
                    setOpenForm(true);
                  }}
                  className="p-2 w-fit flex justify-end cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4" />
                </div>
              )}
              {checkPermission("master.formula.delete") && (
                <div
                  onClick={() => {
                    setFormula(row.original);
                    setOpenDialogDelete(true);
                  }}
                  className="p-2 w-fit flex justify-end cursor-pointer text-red-500"
                >
                  <Trash2Icon className="w-4 h-4" />
                </div>
              )}
            </div>
          </>
        );
      },
    },
  ];


  // const fetchData = async() => {
  //   setLoading(true);
  //   await getFormulas()
  //   .then((res) => {
  //     setData(res)
  //   })
  //   .catch((err) => {
  //     console.log(err);
      
  //     toast({
  //       title: "Error",
  //       description: err.response.data.message,
  //     })
  //   }).finally(() => {
  //     setLoading(false);
  //   })
  // }

  // useEffect(() => {
  //   fetchData();
  // }, [triggerFetch]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [data, setData] =
    useState<Model.DataTable.ResponseDt<Model.Formula.FormulaData[]>>();

  const [searchTerm, setSearchTerm] = useState("");

  const fetchDataFormulas = React.useCallback(async () => {
    setLoading(true);
    await getFormulas(perPage, currentPage, searchTerm)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, perPage, searchTerm]);

  useEffect(() => {
    fetchDataFormulas();
  }, [fetchDataFormulas, triggerFetch]);

  const table = useReactTable({
    data: data?.data || [],
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
  })
  
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="cari berdasarkan nama..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
          className="max-w-sm"
        />
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
                <TableCell colSpan={columns.length} className="h-24 w-full text-center">
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
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(data?.prev_page ? data?.prev_page : 1)
              }
              disabled={!data?.prev_page}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() =>
                setCurrentPage(data?.next_page ? data?.next_page : 1)
              }
              disabled={!data?.next_page}
            >
              Selanjutnya
            </Button>
          </div>
      </div>
    </div>
  );
}

export default TableFormula
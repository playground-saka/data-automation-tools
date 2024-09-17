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
import { PencilIcon } from '@heroicons/react/24/outline'
import { getCustomers } from '@/app/api/customer'
import { PelangganContext } from '../../../providers/PelangganProvider'

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}


function TablePelanggan({ setOpenForm }: Props) {
  const { triggerFetch, setPelanggan,setOpenDialogDelete } = useContext(PelangganContext);
  const columns: ColumnDef<Model.Customer.CustomerData>[] = [
    {
      id: "pelangganId",
      accessorKey: "pelangganId",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-xs">{row.getValue("pelangganId")}</div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "namaPelanggan",
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
        const kategori = row.getValue("pelangganId");
        return (
          <div className="text-xs">{`${
            row.original.kategori.namaKategori
          } - ${row.getValue("namaPelanggan")}`}</div>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "status",
      accessorKey: "status",
      accessorFn: (row) => row.statusPelanggan,
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
      cell: ({ row }) => (
        <div
          className={`
        rounded-md px-2 py-1 w-fit
        ${
          row.getValue("status")
            ? "bg-indigo-100 text-indigo-700"
            : "bg-gray-100 text-gray-500"
        }
      `}
        >
          <p className="capitalize text-xs text-center">
            {row.getValue("status") ? "Aktif" : "Tidak Aktif"}
          </p>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex flex-row">
              <div
                onClick={() => {
                  setPelanggan(row.original);
                  setOpenForm(true);
                }}
                className="p-2 w-fit flex justify-end cursor-pointer"
              >
                <PencilIcon className="w-4 h-4" />
              </div>
              <div
                onClick={() => {
                  setPelanggan(row.original);
                  setOpenDialogDelete(true);
                }}
                className="p-2 w-fit flex justify-end cursor-pointer text-red-500"
              >
                <Trash2Icon className="w-4 h-4" />
              </div>
            </div>
          </>
        );
      },
    },
  ];
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
    useState<Model.DataTable.ResponseDt<Model.Customer.CustomerData[]>>();

  const [searchTerm, setSearchTerm] = useState("");

  const fetchDataCustomer = React.useCallback(async () => {
    setLoading(true);
    await getCustomers(perPage, currentPage, searchTerm)
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
    fetchDataCustomer();
  }, [fetchDataCustomer, triggerFetch]);

  const table = useReactTable({
    data: data?.data || [],
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
  });

  return (
    <>
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
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan ? header.colSpan : 1}
                        className="justify-center"
                      >
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
                      className="h-24 w-full text-center"
                    >
                      {loading ? (
                        <>
                          <div className="flex items-center justify-center">
                            <LoaderIcon className="animate-spin" />{" "}
                            &nbsp;Loading...
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
    </>
  );
}

export default TablePelanggan
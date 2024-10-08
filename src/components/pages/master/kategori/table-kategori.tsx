import React, { useContext, useEffect } from "react";

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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, LoaderIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KategoriContext } from "../../../providers/KategoriProvider";
import { getCategories } from "@/app/api/category";
import { toast } from "@/components/ui/use-toast";
import { PencilIcon } from "@heroicons/react/24/outline";
import { checkPermission } from "@/utils/permissions";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
};
function TableKategori({ setOpenForm }: Props) {
  const { triggerFetch, setKategori, setOpenDialogDelete } = useContext(KategoriContext);
  const columns: ColumnDef<Model.Category.CategoryData>[] = [
    {
      id: "namaKategori",
      accessorKey: "namaKategori",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Kategori
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("namaKategori")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "status",
      accessorKey: "status",
      accessorFn: (row) => row.statusKategori,
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
        const status = row.getValue("status");
        return (
          <div
            className={`
            rounded-md px-2 py-1 w-fit
            ${
              status
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-500"
            }
          `}
          >
            <p className="capitalize text-xs text-center">
              {status ? "Aktif" : "Tidak Aktif"}
            </p>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <>
            <div className="flex flex-row">
              {checkPermission("master.kategori.update") && (
                <div
                  onClick={() => {
                    setKategori(row.original);
                    setOpenForm(true);
                  }}
                  className="p-2 w-fit flex justify-end cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4" />
                </div>
              )}
              {checkPermission("master.kategori.delete") && (
                <div
                  onClick={() => {
                    setKategori(row.original);
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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<Model.Category.CategoryData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchData = async () => {
    setLoading(true);
    await getCategories()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.response.data.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [triggerFetch]);

  const table = useReactTable({
    data,
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="cari berdasarkan nama..."
          value={
            (table.getColumn("namaKategori")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("namaKategori")?.setFilterValue(event.target.value)
          }
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            type="button"
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

export default TableKategori;

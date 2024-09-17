import React, { useContext, useEffect, useState } from "react";

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
import {
  ChevronDown,
  LoaderIcon,
  PencilIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";

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
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { formatDateTime } from "@/utils/formatter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { checkPermission } from "@/utils/permissions";
import { getRoles } from "@/app/api/role";
import { RoleContext } from "@/components/providers/RoleProvider";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
};

function TableRole({ setOpenForm }: Props) {
  const { triggerFetch, setRole, setOpenDialogDelete, setOpenDialogSettingRole } =
    useContext(RoleContext);
  const [data, setData] =
    React.useState<Model.DataTable.ResponseDt<Model.Role.RoleData[]>>();
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [perPage, setPerPage] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const columns: ColumnDef<Model.Role.RoleData>[] = [
    {
      id: "roleName",
      accessorKey: "roleName",
      header: () => {
        return (
          <div className="flex flex-row gap-1 items-center text-xs">Role</div>
        );
      },
      cell: ({ row }) => (
        <div className="text-xs">{row.getValue("roleName")}</div>
      ),
      enableHiding: false,
    },
    {
      id: "description",
      accessorKey: "description",
      header: () => {
        return (
          <div className="flex flex-row gap-1 items-center text-xs">
            Deskripsi
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-xs">{row.getValue("description")}</div>
      ),
      enableHiding: false,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: () => {
        return (
          <div className="flex flex-row gap-1 items-center text-xs">
            Created At
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-xs">
          {formatDateTime(row.getValue("createdAt"), "d-m-Y")}
        </div>
      ),
      enableHiding: false,
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => {
        return (
          <div className="flex flex-row gap-1 items-center text-xs">Aksi</div>
        );
      },
      cell: ({ row }) => {
        return (
          <>
            <div className="flex flex-row">
              {checkPermission("acl.role.update") && (
                <>
                  <div
                    onClick={() => {
                      setRole(row.original);
                      setOpenForm(true);
                    }}
                    className="p-2 w-fit flex justify-end cursor-pointer"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </div>
                </>
              )}
              {checkPermission("acl.role.delete") && (
                <div
                  onClick={() => {
                    setRole(row.original);
                    setOpenDialogDelete(true);
                  }}
                  className="p-2 w-fit flex justify-end cursor-pointer text-red-500"
                >
                  <Trash2Icon className="w-4 h-4" />
                </div>
              )}
              {checkPermission("acl.role.setting") && (
                <div
                  onClick={() => {
                    setRole(row.original);
                    setOpenDialogSettingRole(true);
                  }}
                  className="p-2 w-fit flex justify-end cursor-pointer text-orange-500"
                >
                  <Settings2Icon className="w-4 h-4" />
                </div>
              )}
            </div>
          </>
        );
      },
    },
  ];
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    let isMounted = true;
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const res = await getRoles();
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
    };
    fetchDataAsync();
    return () => {
      isMounted = false;
    };
  }, [triggerFetch,currentPage, perPage]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="cari berdasarkan role..."
          value={
            (table.getColumn("roleName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("roleName")?.setFilterValue(event.target.value)
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 w-full text-center"
                >
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

export default TableRole;

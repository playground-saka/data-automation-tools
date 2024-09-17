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
import { UserContext } from "../../../providers/UserProvider";
import { getUsers } from "@/app/api/user";
import { toast } from "@/components/ui/use-toast";
import { PencilIcon } from "@heroicons/react/24/outline";
import { checkPermission } from "@/utils/permissions";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
};
function TableUser({ setOpenForm }: Props) {
  const { triggerFetch, setUser, setOpenDialogDelete } = useContext(UserContext);
  
  const columns: ColumnDef<Model.User.UserData>[] = [
    {
      id: "fullName",
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("fullName")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "username",
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("username")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "roleName",
      accessorKey: "roleName",
      accessorFn: (row) => row.role[0].roleName,
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("roleName")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("email")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "status",
      accessorKey: "status",
      accessorFn: (row) => row.isActive,
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
              {checkPermission("master.user.update") && (
                <div
                  onClick={() => {
                    setUser(row.original);
                    setOpenForm(true);
                  }}
                  className="p-2 w-fit flex justify-end cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4" />
                </div>
              )}
              {checkPermission("master.user.delete") && (
                <div
                  onClick={() => {
                    setOpenDialogDelete(true);
                    setUser(row.original);
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
    useState<Model.DataTable.ResponseDt<Model.User.UserData[]>>();

  const [searchTerm, setSearchTerm] = useState("");

  const fetchDataUsers = React.useCallback(async () => {
    setLoading(true);
    await getUsers(perPage, currentPage, searchTerm)
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
    fetchDataUsers();
  }, [fetchDataUsers, triggerFetch]);

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
  });

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

export default TableUser;

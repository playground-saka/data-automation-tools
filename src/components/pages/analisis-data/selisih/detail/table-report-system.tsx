import { getLogsheet } from "@/app/api/logsheet";
import { getReportSystem } from "@/app/api/report";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/utils/formatter";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  id: number;
  date: string | null;
}
const columns: ColumnDef<Model.ReportSystem.ReportSystemData>[] = [
  {
    id: "dateTime",
    accessorKey: "dateTime",
    header: () => {
      return (
        <div className="flex flex-row gap-1 items-center text-xs">Tanggal</div>
      );
    },
    cell: ({ row }) => (
      <div className="text-xs">
        {formatDateTime(row.getValue("dateTime"), "d-m-Y H:i:s", true)}
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "voltageR",
    accessorKey: "voltageR",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row gap-1 items-center cursor-pointer text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Voltage (Phasa R)
          <ArrowUpDown className="h-3 w-3" />
        </div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="text-xs">{row.getValue("voltageR")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "voltageS",
    accessorKey: "voltageS",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row gap-1 items-center cursor-pointer text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Voltage (Phasa S)
          <ArrowUpDown className="h-3 w-3" />
        </div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="text-xs">{row.getValue("voltageS")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "voltageT",
    accessorKey: "voltageT",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row gap-1 items-center cursor-pointer text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Voltage (Phasa T)
          <ArrowUpDown className="h-3 w-3" />
        </div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="text-xs">{row.getValue("voltageT")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "currentR",
    accessorKey: "currentR",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row gap-1 items-center cursor-pointer text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current (Phasa R)
          <ArrowUpDown className="h-3 w-3" />
        </div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="text-xs">{row.getValue("currentR")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "currentS",
    accessorKey: "currentS",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row gap-1 items-center cursor-pointer text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current (Phasa S)
          <ArrowUpDown className="h-3 w-3" />
        </div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="text-xs">{row.getValue("currentS")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "currentT",
    accessorKey: "currentT",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row gap-1 items-center cursor-pointer text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current (Phasa T)
          <ArrowUpDown className="h-3 w-3" />
        </div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="text-xs">{row.getValue("currentT")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "currentT",
    accessorKey: "currentT",
    header: ({ column }) => {
      return (
        <div
          className="flex flex-row gap-1 items-center cursor-pointer text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          WH Export
          <ArrowUpDown className="h-3 w-3" />
        </div>
      );
    },
    cell: ({ row }: any) => {
      return <div className="text-xs">{row.getValue("currentT")}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
];
function TableReportSystem({id,date}: Props) {
  const [data, setData] = useState<Model.DataTable.ResponseDt<Model.ReportSystem.ReportSystemData[]>>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const res = await getReportSystem(currentPage, perPage, id, date);
        setData(res);
        setTotalPages(res.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }, [currentPage, perPage, id, date]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={index}>
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={index}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={index}>
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
                  {loading ? (
                    <>
                      <LoaderIcon className="animate-spin" /> Loading...
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
      <div className="flex items-center space-x-2 py-4">
        <div className="w-full text-center">Logsheet Sistem Wilis</div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(data?.prev_page ? data?.prev_page : 1)
            }
            disabled={!data?.per_page || data?.current_page === 1}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
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

export default TableReportSystem;
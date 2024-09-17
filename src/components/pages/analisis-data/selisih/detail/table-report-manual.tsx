import { getReportManual } from "@/app/api/report";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/formatter";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  date: string | null;
  id: number;
};
function TableReportManual({date,id}: Props) {
  const columns: ColumnDef<Model.ReportManual.ReportManualData>[] = [
    {
      accessorKey: "dateTime",
      header: () => {
        return (
          <div className="flex flex-row gap-1 items-center text-xs">
            Tanggal
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-xs">
          {formatDateTime(row.getValue("dateTime"), "d-m-Y H:i:s",true)}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "totalPowerP",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Power P
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("totalPowerP")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "totalPowerQ",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Power Q
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("totalPowerQ")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "powerFactor",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Power Factor
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("powerFactor")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "frequency",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Frequency
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("frequency")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "currentR",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Current R
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
      accessorKey: "currentS",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Current S
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
      accessorKey: "currentT",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Current T
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
      accessorKey: "voltageRS",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Voltage RS
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("voltageRS")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "voltageST",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Voltage ST
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("voltageST")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "voltageTR",
      header: ({ column }) => {
        return (
          <div
            className="flex flex-row gap-1 items-center cursor-pointer text-xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Voltage TR
            <ArrowUpDown className="h-3 w-3" />
          </div>
        );
      },
      cell: ({ row }: any) => {
        return <div className="text-xs">{row.getValue("voltageTR")}</div>;
      },
      enableSorting: true,
      enableHiding: false,
    },
  ];
  const [data, setData] =
    useState<Model.DataTable.ResponseDt<Model.ReportManual.ReportManualData[]>>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const res = await getReportManual(currentPage, perPage, id, date);
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
        <div className="w-full text-center p-5">Logsheet Manual</div>
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
      <div className="flex items-center space-x-2 py-4">
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

export default TableReportManual;

import { getLogsheet } from "@/app/api/logsheet";
import { getReportDifferent, getReportSystem } from "@/app/api/report";
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
import { formatDateTime } from "@/utils/formatter";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  GroupColumnDef,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  id: number;
  date: string | null;
};
const columns = [
  {
    columnDef: {
      header: "Nama",
      accessor: "nama",
      meta: {
        colSpan: 2,
        rowSpan: 1,
      },
    },
  },
  {
    columnDef: {
      header: "Alamat",
      accessor: "alamat",
      meta: {
        colSpan: 1,
        rowSpan: 2,
      },
    },
  },
  // ...
];

function TableReportDifferent({ id, date }: Props) {
  const [data, setData] =
    useState<
      Model.DataTable.ResponseDt<Model.ReportDifferent.ReportDifferentData[]>
    >();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const fetchData = async () => {
    setLoading(true);
    await getReportDifferent(currentPage, perPage, id, date)
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
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, perPage]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={3} className="text-center">
                DateTime
              </TableHead>
              <TableHead colSpan={3} className="text-center">
                Power P
              </TableHead>
              <TableHead colSpan={3} className="text-center">
                Curent R
              </TableHead>
              <TableHead colSpan={3} className="text-center">
                Voltage RS
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center">Wilis</TableHead>
              <TableHead className="text-center">Log Manual</TableHead>
              <TableHead className="text-center">Selisih</TableHead>
              <TableHead className="text-center">Wilis</TableHead>
              <TableHead className="text-center">Log Manual</TableHead>
              <TableHead className="text-center">Selisih</TableHead>
              <TableHead className="text-center">Wilis</TableHead>
              <TableHead className="text-center">Log Manual</TableHead>
              <TableHead className="text-center">Selisih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map(
              (row: Model.ReportDifferent.ReportDifferentData, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {formatDateTime(row.dateTime, "d-m-Y H:i:s")}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.totalPowerPDifference}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.logsheetManual.totalPowerP}
                  </TableCell>
                  <TableCell className="text-center">
                    {(
                      row.totalPowerPDifference - row.logsheetManual.totalPowerP
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.currentRDifference}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.logsheetManual.currentR}
                  </TableCell>
                  <TableCell className="text-center">
                    {(
                      row.currentRDifference - row.logsheetManual.currentR
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.voltageRDifference}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.logsheetManual.voltageRS}
                  </TableCell>
                  <TableCell className="text-center">
                    {(
                      row.voltageRDifference - row.logsheetManual.voltageRS
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-2 py-4">
        <div className="w-full text-center">Selisih</div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(data?.prev_page ? data?.prev_page : 1)
            }
            disabled={!data?.per_page || data?.current_page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(data?.next_page ? data?.next_page : 1)
            }
            disabled={!data?.next_page}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableReportDifferent;

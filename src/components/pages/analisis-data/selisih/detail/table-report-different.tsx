import { getReportDifferent, getReportSystem } from "@/app/api/report";
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
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

type Props = {
  id: number;
  date: string | null;
};

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

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const res = await getReportDifferent(currentPage, perPage, id, date);
        setData(res);
        setTotalPages(res.total_pages);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }, [currentPage, perPage, id, date]);

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={3} className="text-center">
                Tanggal
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
                    {row.whExportHourly}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.totalPowerPManual}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.selisihPowerP < 0 ? (
                      <span className="text-red-500">
                        {row.selisihPowerP}
                      </span>
                    ) : (
                      <span className="text-green-400">
                        {row.selisihPowerP}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.currentRHourly}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.currentRManual}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.selisihCurrentR < 0 ? (
                      <span className="text-red-500">
                        {row.selisihCurrentR}
                      </span>
                    ) : (
                      <span className="text-green-400">
                        {row.selisihCurrentR}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.voltageRHourly}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.voltageRSManual}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.selisihVoltageRS < 0 ? (
                      <span className="text-red-500">
                        {row.selisihVoltageRS}
                      </span>
                    ) : (
                      <span className="text-green-400">
                        {row.selisihVoltageRS}
                      </span>
                    )}
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

export default TableReportDifferent;

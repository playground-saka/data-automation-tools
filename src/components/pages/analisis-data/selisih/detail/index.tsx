import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import TableReportSystem from './table-report-system';
import TableReportManual from './table-report-manual';
import TableReportDifferent from './table-report-different';

type Props = {
  id:number
}

function Index({ id }: Props) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date")?.toString() ?? null;
  
  return (
    <div className="flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border">
      <div className="flex flex-col">
        <div className="flex flex-col">
          {/* <h1 className='mb-3'>Generate Analis Data</h1> */}
        </div>
        <TableReportDifferent id={id} date={date}/>
        <TableReportSystem id={id} date={date}  />
        <TableReportManual id={id} date={date} />
      </div>
    </div>
  );
}

export default Index
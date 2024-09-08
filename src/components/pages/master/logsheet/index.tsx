import React from 'react'

import { Button } from '@/components/ui/button'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'

import TableLogsheet from './table-logsheet'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import FormLogSheet from './form-logsheet'
import { LogSheetProvider } from '../../../providers/LogSheetProvider'
import DialogRollBackLogSheet from './rollback-logsheet'

type Props = {}

function Index({}: Props) {
  const [openForm, setOpenForm] = React.useState(false)
  return (
    <LogSheetProvider>
      <Sheet open={openForm}>
        <div className="flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border">
          <SheetContent>
            <SheetTitle>Form Logsheet</SheetTitle>
            <SheetDescription>
              Isi detail di bawah ini di setiap langkah nya.
            </SheetDescription>
            <FormLogSheet setOpenForm={setOpenForm}/>
          </SheetContent>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1>Daftar Logsheet</h1>
              <p className="text-xs text-stone-800/65">
                Logsheet yang mencakup data manual dan data sistem untuk pemantauan dan pelaporan
              </p>
            </div>
            <SheetTrigger asChild>
              <Button type='button' onClick={() => setOpenForm(true)} className="flex flex-row gap-2 items-center">
                <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                Generate bulan baru
              </Button>
            </SheetTrigger>
          </div>
          <TableLogsheet />
          <DialogRollBackLogSheet/>
        </div>
      </Sheet>
    </LogSheetProvider>
  );
}

export default Index
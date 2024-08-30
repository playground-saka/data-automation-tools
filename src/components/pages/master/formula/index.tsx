import React, { createContext, useContext, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { PlusIcon } from '@heroicons/react/24/outline'

import TableFormula from './table-formula'
import FormFormula from './form-formula'
import { FormulaContext, FormulaProvider } from '../../../providers/FormulaProvider'

type Props = {}

function Index({}: Props) {
  const [openForm, setOpenForm] = useState(false)
  return (
    <FormulaProvider>
      <Sheet open={openForm}>
        <div className="flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border">
          <SheetContent className="w-[500px]">
            <SheetTitle>Formula Baru</SheetTitle>
            <SheetDescription>
              Isi detail di bawah ini di setiap langkah nya.
            </SheetDescription>
            <FormFormula setOpenForm={setOpenForm} />
          </SheetContent>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1>Daftar Formula</h1>
              <p className="text-xs text-stone-800/65">
                Formula perhitungan untuk report sistem.
              </p>
            </div>
            <SheetTrigger asChild>
              <Button
                type='button'
                onClick={() => setOpenForm(true)}
                className="flex flex-row gap-2 items-center"
              >
                <PlusIcon className="w-4 h-4" />
                Buat formula baru
              </Button>
            </SheetTrigger>
          </div>
          <TableFormula />
        </div>
      </Sheet>
    </FormulaProvider>
  );
}

export default Index
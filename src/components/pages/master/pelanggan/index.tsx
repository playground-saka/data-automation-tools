import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { PlusIcon } from '@heroicons/react/24/outline'

import FormPelanggan from './form-pelanggan'
import TablePelanggan from './table-pelanggan'

type Props = {}

function Index({}: Props) {
  return (
    <Sheet>
      <div className='flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border'>
        <SheetContent className='w-[500px]'>
          <FormPelanggan />
        </SheetContent>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-col'>
            <h1>List of Pelanggan</h1>
            <p className='text-xs text-stone-800/65'>PLTM, PLTMH, dan PLTMS</p>
          </div>
          <SheetTrigger asChild>
            <Button
              className='flex flex-row gap-2 items-center'
            >
              <PlusIcon className='w-4 h-4' />
              Buat pelanggan baru
            </Button>
          </SheetTrigger>
        </div>
        <TablePelanggan />
      </div>
    </Sheet>
  )
}

export default Index
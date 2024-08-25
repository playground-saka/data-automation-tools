import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { PlusIcon } from '@heroicons/react/24/outline'

import TableFormula from './table-formula'

type Props = {}

function Index({}: Props) {
  return (
    <Sheet>
      <div className='flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border'>
        <SheetContent className='w-[500px]'>
          
        </SheetContent>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-col'>
            <h1>List of Formula</h1>
            <p className='text-xs text-stone-800/65'>Formula perhitungan untuk report sistem.</p>
          </div>
          <SheetTrigger asChild>
            <Button
              className='flex flex-row gap-2 items-center'
            >
              <PlusIcon className='w-4 h-4' />
              Buat formula baru
            </Button>
          </SheetTrigger>
        </div>
        <TableFormula />
      </div>
    </Sheet>
  )
}

export default Index
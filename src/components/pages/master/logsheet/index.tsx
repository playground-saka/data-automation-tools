import React from 'react'

import { Button } from '@/components/ui/button'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'

import TableLogsheet from './table-logsheet'

type Props = {}

function Index({}: Props) {
  return (
    <div className='flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col'>
          <h1>List of Logsheet</h1>
          <p className='text-xs text-stone-800/65'>Logsheet manual dan sistem</p>
        </div>
        <Button
          className='flex flex-row gap-2 items-center'
        >
          <ArrowRightEndOnRectangleIcon className='w-4 h-4' />
          Generate bulan baru
        </Button>
      </div>
      <TableLogsheet />
    </div>
  )
}

export default Index
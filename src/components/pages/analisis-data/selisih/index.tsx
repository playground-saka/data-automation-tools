import React from 'react'

import TableSelisih from './table-selisih'

type Props = {}

function Index({}: Props) {
  return (
    <div className='flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col'>
          <h1>List of Pelanggan</h1>
        </div>
      </div>
      <TableSelisih />
    </div>
  )
}

export default Index
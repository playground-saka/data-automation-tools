import React from 'react'

import TableSelisih from './table-selisih'

type Props = {}

function Index({}: Props) {
  return (
    <div className='flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col'>
          <h1>Daftar Selisih Data Pelanggan</h1>
          <p className="text-xs text-stone-800/65">
            Perbandingan data pelanggan antara sumber manual dan sistem untuk identifikasi perbedaan
          </p>
        </div>
      </div>
      <TableSelisih />
    </div>
  )
}

export default Index
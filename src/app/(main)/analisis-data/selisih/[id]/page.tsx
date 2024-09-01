'use client'

import React from 'react'

import Breadcrumbs from '@/components/shared/breadcrumbs'
import Index from '@/components/pages/analisis-data/selisih/detail'
import { useRouter } from 'next/router'

type Props = {
  params:{
    id: number
  }
}

function Page({ params }: Props) {
  
  return (
    <section className="w-full h-full flex flex-col gap-6 px-6 py-6 pt-12 pb-20">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-3xl">Analisis Data Selisih</h1>
        <Breadcrumbs />
      </div>
      <p className="text-md text-stone-800/65">
        Logsheet yang mencakup data manual dan data sistem untuk pemantauan dan pelaporan
      </p>
      <Index id={params.id}/>
    </section>
  );
}

export default Page
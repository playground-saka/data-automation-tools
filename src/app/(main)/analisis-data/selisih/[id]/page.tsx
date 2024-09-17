'use client'

import React, { useEffect, useState } from 'react'

import Breadcrumbs from '@/components/shared/breadcrumbs'
import Index from '@/components/pages/analisis-data/selisih/detail'
import { useRouter } from 'next/router'
import { detailCustomer } from '@/app/api/customer'

type Props = {
  params:{
    id: number
  }
}

function Page({ params }: Props) {
  const [customer, setCustomer] = useState<Model.Customer.CustomerData>(
    {} as Model.Customer.CustomerData
  );
  useEffect(() => {
    const fetchDataCustomer = async () => {
      await detailCustomer(params.id)
        .then((res) => {
          setCustomer(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchDataCustomer();
  }, [params.id]);
  return (
    <section className="w-full h-full flex flex-col gap-6 px-6 py-6 pt-12 pb-20">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-xl">Analisis Data Selisih - {customer.namaPelanggan}</h1>
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
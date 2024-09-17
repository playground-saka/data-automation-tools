import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { PlusIcon } from '@heroicons/react/24/outline'

import FormPelanggan from './form-pelanggan'
import TablePelanggan from './table-pelanggan'
import { PelangganProvider } from '../../../providers/PelangganProvider'
import DialogDeletePelanggan from './delete-pelanggan'
import { checkPermission } from '@/utils/permissions'


type Props = {}

function Index({}: Props) {
  const [openForm, setOpenForm] = useState(false);
  return (
    <PelangganProvider>
      <Sheet open={openForm}>
        <div className="flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border">
          {(checkPermission("master.pelanggan.create") || checkPermission("master.pelanggan.update"))  && (
              <SheetContent className="w-[500px]">
                <SheetTitle>Pelanggan Baru</SheetTitle>
                <SheetDescription>
                  Isi detail di bawah ini di setiap langkah nya.
                </SheetDescription>
                <FormPelanggan setOpenForm={setOpenForm} />
              </SheetContent>
            )}
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1>Daftar Pelanggan</h1>
              <p className="text-xs text-stone-800/65">
                Kelola dan cari daftar pelanggan yang tersedia dengan mudah.
              </p>
            </div>
            {checkPermission("master.pelanggan.delete") && (
              <SheetTrigger asChild>
                <Button
                  onClick={() => setOpenForm(true)}
                  className="flex flex-row gap-2 items-center"
                >
                  <PlusIcon className="w-4 h-4" />
                  Buat Pelanggan Baru
                </Button>
              </SheetTrigger>
            )}
          </div>
          <TablePelanggan setOpenForm={setOpenForm} />
          {checkPermission("master.pelanggan.delete") && (
            <DialogDeletePelanggan />
          )}
        </div>
      </Sheet>
    </PelangganProvider>
  );
}

export default Index
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import FormKategori from "./form-kategori";
import TableKategori from "./table-kategori";
import { KategoriProvider } from "../../../providers/KategoriProvider";
import DialogDeleteKategori from "./delete-kategori";

type Props = {};

function Index({}: Props) {
  const [openForm, setOpenForm] = useState(false);
  return (
    <KategoriProvider>
      <Sheet open={openForm}>
        <div className="flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border">
          <SheetContent className="w-[500px]">
            <SheetTitle>Form Kategori</SheetTitle>
            <SheetDescription>
              Isi detail di bawah ini di setiap langkah nya.
            </SheetDescription>
            <FormKategori setOpenForm={setOpenForm} />
          </SheetContent>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1>Daftar Kategori Pelanggan</h1>
              <p className="text-xs text-stone-800/65">
                Kelola dan cari kategori pelanggan yang tersedia dengan mudah.
              </p>
            </div>
            <SheetTrigger asChild>
              <Button
                type="button"
                onClick={() => setOpenForm(true)}
                className="flex flex-row gap-2 items-center"
              >
                <PlusIcon className="w-4 h-4" />
                Buat Kategori Baru
              </Button>
            </SheetTrigger>
          </div>
          <TableKategori setOpenForm={setOpenForm}/>
          <DialogDeleteKategori/>
        </div>
      </Sheet>
    </KategoriProvider>
  );
}

export default Index;

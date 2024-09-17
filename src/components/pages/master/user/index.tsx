import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import FormUser from "./form-user";
import TableUser from "./table-user";
import { UserProvider } from "../../../providers/UserProvider";
import DialogDeleteUser from "./delete-user";
import { checkPermission } from "@/utils/permissions";

type Props = {};

function Index({}: Props) {
  const [openForm, setOpenForm] = useState(false);
  return (
    <UserProvider>
      <Sheet open={openForm}>
        <div className="flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border">
            <SheetContent className="w-[500px]">
              <SheetTitle>Form Pengguna</SheetTitle>
              <SheetDescription>
                Isi detail di bawah ini di setiap langkah nya.
              </SheetDescription>
            {(checkPermission("master.user.create") || checkPermission("master.user.update")) && (
              <FormUser setOpenForm={setOpenForm} />
            )}
            </SheetContent>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1>Daftar Pengguna</h1>
              <p className="text-xs text-stone-800/65">
                Kelola dan cari pengguna yang tersedia dengan mudah.
              </p>
            </div>
            <SheetTrigger asChild>
              <Button
                type="button"
                onClick={() => setOpenForm(true)}
                className="flex flex-row gap-2 items-center"
              >
                <PlusIcon className="w-4 h-4" />
                Buat Pengguna Baru
              </Button>
            </SheetTrigger>
          </div>
          <TableUser setOpenForm={setOpenForm} />
          {checkPermission("master.user.delete") && <DialogDeleteUser />}
        </div>
      </Sheet>
    </UserProvider>
  );
}

export default Index;

import React, { useState } from "react";

import TableRole from "./table-role";
import { RoleProvider } from "@/components/providers/RoleProvider";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { checkPermission } from "@/utils/permissions";
import FormRole from "./form-role";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import DialogDeleteRole from "./delete-role";
import DialogSettingRole from "./setting-role";

type Props = {};

function Index({}: Props) {
  const [openForm, setOpenForm] = useState(false);
  return (
    <RoleProvider>
      <Sheet open={openForm}>
        <div className="flex flex-col gap-4 px-6 py-6 w-full h-fit bg-white rounded-xl border">
          {(checkPermission("acl.role.create") ||
            checkPermission("acl.role.update")) && (
            <SheetContent className="w-[500px]">
              <SheetTitle>Form Role</SheetTitle>
              <SheetDescription>
                Isi detail di bawah ini di setiap langkah nya.
              </SheetDescription>
              <FormRole setOpenForm={setOpenForm} />
            </SheetContent>
          )}
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h1>Daftar Role</h1>
              <p className="text-xs text-stone-800/65">
                Kelola dan cari role yang tersedia dengan mudah.
              </p>
            </div>
            {checkPermission("acl.role.create") && (
              <SheetTrigger asChild>
                <Button
                  type="button"
                  onClick={() => setOpenForm(true)}
                  className="flex flex-row gap-2 items-center"
                >
                  <PlusIcon className="w-4 h-4" />
                  Buat Role
                </Button>
              </SheetTrigger>
            )}
          </div>
          <TableRole setOpenForm={setOpenForm} />
          {checkPermission("acl.role.delete") && (
            <DialogDeleteRole />
          )}
          {checkPermission("acl.role.setting") && (
            <DialogSettingRole/>
          )}
        </div>
      </Sheet>
    </RoleProvider>
  );
}

export default Index;

"use client";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetFooter } from "@/components/ui/sheet";
import { RoleContext } from "../../../providers/RoleProvider";
import { TypeOf } from "zod";
import { Formik,ErrorMessage, Form } from 'formik';
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "@/components/ui/use-toast";
import { schemaFormRole } from "@/schemas/role-schemas";
import { postRole, putRole } from "@/app/api/role";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
};
function FormRole({setOpenForm}: Props) {
  const { triggerFetchData,role,setRole } = useContext(RoleContext);
  const [loading, setLoading] = useState(false);
  type RoleFormInputs = TypeOf<typeof schemaFormRole>;
  return (
    <Formik<RoleFormInputs>
      initialValues={{
        roleName: role ? role?.roleName : "",
        description: role ? role?.description : "",
      }}
      onSubmit={async (values) => {
        setLoading(true);
        if (!role) {
          await postRole(values)
            .then((res) => {
              setOpenForm(false);
              triggerFetchData();
              toast({
                title: "Sukses",
                description: "Role berhasil ditambahkan",
                duration: 3000,
              });
            })
            .catch((err) => {
              toast({
                title: "Gagal",
                description: err.response.data.message,
                duration: 3000,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          await putRole(role.id, values)
            .then((res) => {
              setOpenForm(false);
              setRole(null);
              triggerFetchData();
              toast({
                title: "Sukses",
                description: "Role berhasil diubah",
                duration: 3000,
              });
            })
            .catch((err) => {
              toast({
                title: "Gagal",
                description: err.respons.data.message,
                duration: 3000,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }}
      validateOnChange={true}
      validationSchema={toFormikValidationSchema(schemaFormRole)}
    >
      {({ setFieldValue, values, touched, isValid, errors }) => (
        <Form className="flex flex-col gap-6">
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="roleName" className="text-xs">
                Nama Role
              </Label>
              <Input
                id="roleName"
                type="text"
                name="name"
                value={values.roleName}
                onChange={(e) => setFieldValue("roleName", e.target.value)}
                className="col-span-3"
              />
              {touched.roleName && errors.roleName && (
                <ErrorMessage
                  name="roleName"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="description" className="text-xs">
                Deskripsi
              </Label>
              <Input
                id="description"
                type="text"
                name="name"
                value={values.description || ""}
                onChange={(e) => setFieldValue("description", e.target.value)}
                className="col-span-3"
              />
              {touched.description && errors.description && (
                <ErrorMessage
                  name="description"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
          </div>
          <SheetFooter>
            <div className="flex flex-row gap-2 justify-end">
              <Button
                type="button"
                disabled={loading}
                isLoading={loading}
                onClick={() => {
                  setOpenForm(false);
                  setRole(null);
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-700 to-fuchsia-500"
                disabled={!isValid || loading}
                isLoading={loading}
              >
                Simpan
              </Button>
            </div>
          </SheetFooter>
        </Form>
      )}
    </Formik>
  );
}

export default FormRole;

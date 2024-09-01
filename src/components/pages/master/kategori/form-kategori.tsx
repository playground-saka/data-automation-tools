"use client";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  postCategory, putCategory } from "@/app/api/category";
import { SheetFooter } from "@/components/ui/sheet";
import { KategoriContext } from "../../../providers/KategoriProvider";
import { TypeOf } from "zod";
import { Formik,ErrorMessage, Form } from 'formik';
import { schemaFormcategory } from "@/schemas/category-schemas";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "@/components/ui/use-toast";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
};
function FormKategori({setOpenForm}: Props) {
  const { triggerFetchData,kategori,setKategori } = useContext(KategoriContext);
  const [loading, setLoading] = useState(false);
  type CategoryFormInputs = TypeOf<typeof schemaFormcategory>;
  return (
    <Formik<CategoryFormInputs>
      initialValues={{ 
        namaKategori: kategori ? kategori?.namaKategori : "",
        statusKategori: true 
      }}
      onSubmit={async (values) => {
        setLoading(true);
        if(!kategori){
          await postCategory(values)
          .then((res) => {
            setOpenForm(false);
            triggerFetchData();
            toast({
              title: "Sukses",
              description: "Kategori berhasil ditambahkan",
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
        }else{
          await putCategory(kategori.id,values)
          .then((res) => {
            setOpenForm(false);
            setKategori(null)
            triggerFetchData();
            toast({
              title: "Sukses",
              description: "Kategori berhasil diubah",
              duration: 3000,
            });
          })
          .catch((err) => {
            toast({
              title: "Gagal",
              description: err.respons.data.message,
              duration: 3000,
            });
          }).finally(()=>{
            setLoading(false);
          })
        }
      }}
      validateOnChange={true}
      validationSchema={toFormikValidationSchema(schemaFormcategory)}
    >
      {({ setFieldValue, values, touched, isValid, errors }) => (
        <Form className="flex flex-col gap-6">
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="namaKategori" className="text-xs">
                Nama Kategori
              </Label>
              <Input
                id="namaKategori"
                type="text"
                name="name"
                value={values.namaKategori}
                onChange={(e) => setFieldValue("namaKategori", e.target.value)}
                className="col-span-3"
              />
              {touched.namaKategori && errors.namaKategori && (
                <ErrorMessage
                  name="name"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
          </div>
          <SheetFooter>
            <div className="flex flex-row gap-2 justify-end">
              <Button type="button" disabled={loading} isLoading={loading} onClick={() => {
                setOpenForm(false)
                setKategori(null)
              }}>
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

export default FormKategori;

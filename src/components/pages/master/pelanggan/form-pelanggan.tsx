import React, { useContext, useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { postCustomer, putCustomer } from '@/app/api/customer';
import { PelangganContext } from '../../../providers/PelangganProvider';
import { SheetFooter } from '@/components/ui/sheet';
import { schemaFormCustomer } from '@/schemas/customer-schemas';
import { TypeOf } from 'zod';
import { ErrorMessage, Form, Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { getCategories } from '@/app/api/category';
import { toast } from '@/components/ui/use-toast';

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
}

function FormPelanggan({setOpenForm}: Props) {
  const { triggerFetchData, setPelanggan,pelanggan } = useContext(PelangganContext);
  type CustomerFormInputs = TypeOf<typeof schemaFormCustomer>;
  const [categories, setCategory] = useState<Model.Category.CategoryData[]>([]);
  const fetchDataCategory = async () =>
    await getCategories().then((res) => {
      setCategory(res);
    });
  useEffect(() => {
    fetchDataCategory();
  }, []);
  return (
    <Formik<CustomerFormInputs>
      initialValues={{
        pelangganId: pelanggan?.pelangganId ? pelanggan?.pelangganId.toString() : "",
        namaPelanggan: pelanggan?.namaPelanggan ? pelanggan?.namaPelanggan : "",
        kategoriId: pelanggan?.kategori ? (pelanggan.kategori.id).toString() : "",
        statusPelanggan: true,
      }}
      onSubmit={async (values) => {
        if (!pelanggan) {
          await postCustomer(values)
            .then((res) => {
              setOpenForm(false);
              triggerFetchData();
              toast({
                title: "Success",
                description: "Data berhasil disimpan",
              });
            })
            .catch((err) => {
              toast({
                title: "Error",
                description: err.response.data.error,
              });
            })
            .finally(() => {});
        } else {
          await putCustomer(pelanggan.id,values)
          .then((res) => {
            setOpenForm(false);
            triggerFetchData();
            toast({
              title: "Success",
              description: "Data berhasil disimpan",
            });
          }).catch((err) => {
            toast({
              title: "Error",
              description: err.response.data.error,
            });
          })
          .finally(() => {});
        }
      }}
      validateOnChange={true}
      validateOnBlur={true}
      validationSchema={toFormikValidationSchema(schemaFormCustomer)}
    >
      {({ setFieldValue, values, touched, isValid, errors }) => (
        <Form className="flex flex-col gap-6">
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="pelangganId" className="text-xs">
                ID Pelanggan
              </Label>
              <Input
                id="pelangganId"
                onChange={(e) => setFieldValue("pelangganId", e.target.value)}
                name="pelangganId"
                type="text"
                value={values.pelangganId}
                className="col-span-3"
              />
              {touched.pelangganId && errors.pelangganId && (
                <ErrorMessage
                  name="pelangganId"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="namaPelanggan" className="text-xs">
                Nama Pelanggan
              </Label>
              <Input
                id="namaPelanggan"
                name="namaPelanggan"
                onChange={(e) => setFieldValue("namaPelanggan", e.target.value)}
                type="text"
                value={values.namaPelanggan}
                className="col-span-3"
              />
              {touched.namaPelanggan && errors.namaPelanggan && (
                <ErrorMessage
                  name="namaPelanggan"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="kategoriId" className="text-xs">
                Kategori Pelanggan
              </Label>
              <Select
                name="kategoriId"
                onValueChange={(value) => setFieldValue("kategoriId", value)}
                value={values.kategoriId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.namaKategori}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {touched.kategoriId && errors.kategoriId && (
                <ErrorMessage
                  name="kategoriId"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
          </div>
          <SheetFooter>
            <div className="flex flex-row gap-2 justify-end">
              <Button type="button" onClick={() => {setOpenForm(false);setPelanggan(null)}}>
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-700 to-fuchsia-500"
                disabled={!isValid}
              >
                Submit
              </Button>
            </div>
          </SheetFooter>
        </Form>
      )}
    </Formik>
  );
}

export default FormPelanggan
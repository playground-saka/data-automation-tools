import React, { useContext, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllCustomers } from "@/app/api/customer";
import { postFormula } from "@/app/api/formula";
import { FormulaContext } from "../../../providers/FormulaProvider";
import { toast } from "@/components/ui/use-toast";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { schemaFormFormula } from "@/schemas/formula-schemas";
import { TypeOf } from "zod";
import { Formik,Form, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
};

function FormFormula({ setOpenForm }: Props) {
  const { triggerFetchData } = useContext(FormulaContext);
  type FormulaFormInputs = TypeOf<typeof schemaFormFormula>;
  const [allCustomers,setAllCustomer] = useState<Model.Customer.CustomerAllData[]>([])

  const getCustomers = async () => {
    await getAllCustomers()
      .then((res) => {
        setAllCustomer(res);
      })
      .catch((err) => {})
      .finally(() => {});
  };
  useEffect(() => {
    getCustomers(); 
  }, []);
  return (
    <Formik<FormulaFormInputs>
      initialValues={{
        pelangganId: "",
        faktorArus: "",
        faktorTegangan: "",
        faktorPower: "",
      }}
      onSubmit={async (values) => {
        await postFormula(values)
          .then((res) => {
            setOpenForm(false);
            triggerFetchData();
            toast({
              title: "Success",
              description: "Data Berhasil disimpan",
            });
          })
          .catch((err) => {
            toast({
              title: "Error",
              description: err.response.data.error,
            });
          })
          .finally(() => {});
      }}
      validateOnChange={true}
      validationSchema={toFormikValidationSchema(schemaFormFormula)}
    >
      {({ setFieldValue, values, touched, isValid, errors }) => (
        <Form className="flex flex-col gap-6">
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="pelangganId" className="text-xs">
                Pelanggan
              </Label>
              <Select
                name="pelangganId"
                onValueChange={(value) => setFieldValue("pelangganId", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allCustomers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
                        {customer.namaPelanggan}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {touched.pelangganId && errors.pelangganId && (
                <ErrorMessage
                  name="pelangganId"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="faktorTegangan" className="text-xs">
                Formula Tegangan
              </Label>
              <Input
                id="faktorTegangan"
                name="faktorTegangan"
                onChange={(e) =>
                  setFieldValue("faktorTegangan", e.target.value)
                }
                value={values.faktorTegangan}
                type="text"
                className="col-span-3"
              />
              {touched.faktorTegangan && errors.faktorTegangan && (
                <ErrorMessage
                  name="faktorTegangan"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="faktorArus" className="text-xs">
                Formula Arus
              </Label>
              <Input
                id="faktorArus"
                name="faktorArus"
                onChange={(e) => setFieldValue("faktorArus", e.target.value)}
                type="text"
                value={values.faktorArus}
                className="col-span-3"
              />
              {touched.faktorArus && errors.faktorArus && (
                <ErrorMessage
                  name="faktorArus"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="faktorPower" className="text-xs">
                Formula Power
              </Label>
              <Input
                id="faktorPower"
                name="faktorPower"
                onChange={(e) => setFieldValue("faktorPower", e.target.value)}
                value={values.faktorPower}
                type="text"
                className="col-span-3"
              />
              {touched.faktorPower && errors.faktorPower && (
                <ErrorMessage
                  name="faktorPower"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
          </div>
          <SheetFooter>
            <div className="flex flex-row gap-2 justify-end">
              <Button type="button" onClick={() => setOpenForm(false)}>
                Cancel
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

export default FormFormula;

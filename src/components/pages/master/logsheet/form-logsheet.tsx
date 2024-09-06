import React, { useContext, useEffect } from "react";

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
import { SheetFooter } from "@/components/ui/sheet";
import { LogSheetontext } from "../../../providers/LogSheetProvider";
import { toast } from "@/components/ui/use-toast";
import { ErrorMessage, Form, Formik } from "formik";
import { schemaFormLogSheet } from "@/schemas/logsheet-schemas";
import { TypeOf } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { postLogSheetData } from "@/app/api/logsheet";
import { CURRENT_YEAR, months } from "@/lib/statics";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
};

function FormLogSheet({setOpenForm}: Props) {
  const { triggerFetchData } = useContext(LogSheetontext);
  type LogSheetFormInputs = TypeOf<typeof schemaFormLogSheet>;
  return (
    <Formik<LogSheetFormInputs>
      initialValues={{
        bulanId: "",
      }}
      onSubmit={async (values) => {
        const formattedDate = `${CURRENT_YEAR}-${values.bulanId}-01`; // Concatenate the date in the desired format
        const payloads = {
          ...values,
          fullDate: formattedDate, // Use the concatenated date
          year: CURRENT_YEAR,  // Add the year from the constant
        };

        
        await postLogSheetData(payloads)
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
              description: err.response.data.message,
            });
          });
      }}
      validateOnChange={true}
      validationSchema={toFormikValidationSchema(schemaFormLogSheet)}
    >
      {({ setFieldValue, values, touched, isValid, errors }:any) => (
        <Form className="flex flex-col gap-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bulanId" className="text-right text-xs">
                  Pilih Bulan
                </Label>
                <div className="col-span-3">
                  <Select
                    name="bulanId"
                    onValueChange={(value) => setFieldValue("bulanId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {touched.bulanId && errors.bulanId && (
                    <ErrorMessage
                      name="bulanId"
                      className="grid grid-cols-2 text-red-400 text-xs mt-2"
                      component="div"
                    />
                  )}
                </div>
              </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-xs">
                Tahun
              </Label>
              <Input
                id="namaKategori"
                type="text"
                name="year"
                value={CURRENT_YEAR} // Set the current year as the value
                disabled // Make the input read-only
                className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter>
            <div className="flex flex-row gap-2 justify-end">
              <Button type="button" onClick={() => setOpenForm(false)}>Batal</Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-700 to-fuchsia-500"
                disabled={!isValid}
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

export default FormLogSheet;

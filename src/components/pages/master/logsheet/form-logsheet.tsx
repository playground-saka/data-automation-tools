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
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { FormControl } from "@/components/ui/form";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SheetFooter } from "@/components/ui/sheet";
import { LogSheetontext } from "../../../providers/LogSheetProvider";
import { postFormula } from "@/app/api/formula";
import { getAllCustomers } from "@/app/api/customer";
import { toast } from "@/components/ui/use-toast";
import { ErrorMessage, Form, Formik } from "formik";
import { schemaFormLogSheet } from "@/schemas/logsheet-schemas";
import { TypeOf } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { postLogSheetData } from "@/app/api/logsheet";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
};

function FormLogSheet({setOpenForm}: Props) {
  const [allCustomers,setAllCustomer] = useState<Model.Customer.CustomerAllData[]>([])
  const [date, setDate] = React.useState<Date>();
  const { triggerFetchData } = useContext(LogSheetontext);
  type LogSheetFormInputs = TypeOf<typeof schemaFormLogSheet>;

  const fetchAllCustomers = async()=>{
    await getAllCustomers()
    .then((res)=>{
      setAllCustomer(res)
    })
    .catch((err)=>{
      toast({
        title: "Error",
        description: err.message,
      })
    })
    .finally(()=>{

    })
  }
  useEffect(()=>{
    fetchAllCustomers();
  },[])
  return (
    <Formik<LogSheetFormInputs>
      initialValues={{
        date: "",
        pelangganId: "",
      }}
      onSubmit={async (values) => {
        await postLogSheetData(values)
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
      validationSchema={toFormikValidationSchema(schemaFormLogSheet)}
    >
      {({ setFieldValue, values, touched, isValid, errors }) => (
        <Form className="flex flex-col gap-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-xs">
                Tanggal
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy-MM") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    id="date"
                    mode="single"
                    className="bg-white"
                    selected={date}
                    onSelect={(date:any) => {setFieldValue("date", format(date, "yyyy-MM")); setDate(date)}}
                    showOutsideDays={true}
                    initialFocus={true}
                    formatters={{
                      formatMonthCaption: (date: Date) =>
                        format(date, "yyyy-MM"),
                    }}
                  />
                </PopoverContent>
              </Popover>
              {touched.date && errors.date && (
                <ErrorMessage
                  name="date"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pelangganId" className="text-right text-xs">
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
          </div>
          <SheetFooter>
            <div className="flex flex-row gap-2 justify-end">
              <Button type="button" onClick={() => setOpenForm(false)}>Cancel</Button>
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

export default FormLogSheet;

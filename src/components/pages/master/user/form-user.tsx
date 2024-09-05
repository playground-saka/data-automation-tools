"use client";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postUser, putUser } from "@/app/api/user";
import { SheetFooter } from "@/components/ui/sheet";
import { UserContext } from "../../../providers/UserProvider";
import { TypeOf } from "zod";
import { Formik,ErrorMessage, Form } from 'formik';
import { schemaFormUser } from "@/schemas/user-schemas";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { toast } from "@/components/ui/use-toast";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
};
function FormUser({setOpenForm}: Props) {
  const { triggerFetchData, user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  type UserFormInputs = TypeOf<typeof schemaFormUser>;
  return (
    <Formik<UserFormInputs>
      initialValues={{
        username: user ? user?.username : "",
        fullName: user ? user?.fullName : "",
        email: user ? user?.email : "",
        password: "",
      }}
      onSubmit={async (values) => {
        setLoading(true);
        if (!user) {
          await postUser(values)
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
        } else {
          await putUser(user.id, values)
            .then((res) => {
              setOpenForm(false);
              setUser(null);
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
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }}
      validateOnChange={true}
      validationSchema={toFormikValidationSchema(schemaFormUser)}
    >
      {({ setFieldValue, values, touched, isValid, errors }) => (
        <Form className="flex flex-col gap-6">
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="fullName" className="text-xs">
                Nama Lengkap
              </Label>
              <Input
                id="fullName"
                type="fullName"
                name="fullName"
                value={values.fullName}
                onChange={(e) => setFieldValue("fullName", e.target.value)}
                className="col-span-3"
              />
              {touched.fullName && errors.fullName && (
                <ErrorMessage
                  name="fullName"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="username" className="text-xs">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={values.username}
                onChange={(e) => setFieldValue("username", e.target.value)}
                className="col-span-3"
              />
              {touched.username && errors.username && (
                <ErrorMessage
                  name="username"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
                className="col-span-3"
              />
              {touched.email && errors.email && (
                <ErrorMessage
                  name="email"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="password" className="text-xs">
                Kata Sandi
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={values.password ?? ""}
                onChange={(e) => setFieldValue("password", e.target.value)}
                className="col-span-3"
              />
              {touched.password && errors.password && (
                <ErrorMessage
                  name="password"
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
                  setUser(null);
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

export default FormUser;

"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { getAllRole } from "@/app/api/role";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
};
function FormUser({setOpenForm}: Props) {
  const { triggerFetchData, user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [allRole, setAllRole] = useState<Model.Role.RoleData[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const fetchDataRole = async () =>
    await getAllRole().then((res) => {
      setAllRole(res);
    });
  useEffect(() => {
    fetchDataRole();
    if (user) {
      setIsEdit(true);
    }
  }, [user]);
  return (
    <Formik
      validationSchema={schemaFormUser(isEdit)}
      initialValues={{
        username: user ? user?.username : "",
        isActive: user ? (user?.isActive ? "1" : "0") : "",
        roleId: user ? user?.role[0].id.toString() : "",
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
                description: "User berhasih ditambahkan",
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
                description: "User berhasil diubah",
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
              <Label htmlFor="isActive" className="text-xs">
                Status
              </Label>
              <Select
                name="isActive"
                onValueChange={(value) => setFieldValue("isActive", value)}
                value={values.isActive ?? ""}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem key={"active"} value={"1"}>
                      Aktif
                    </SelectItem>
                    <SelectItem key={"nonactive"} value={"0"}>
                      Non Aktif
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {touched.isActive && errors.isActive && (
                <ErrorMessage
                  name="isActive"
                  className="w-full text-red-400 text-xs"
                  component="div"
                />
              )}
            </div>
            <div className="grid items-center gap-2">
              <Label htmlFor="roleId" className="text-xs">
                Role
              </Label>
              <Select
                name="roleId"
                onValueChange={(value) => setFieldValue("roleId", value)}
                value={values.roleId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allRole.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.roleName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {touched.roleId && errors.roleId && (
                <ErrorMessage
                  name="roleId"
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

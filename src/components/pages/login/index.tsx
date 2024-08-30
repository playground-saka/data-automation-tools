"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/app/api/auth";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/lib/hooks";
import { setLogin } from "@/store/slices/authSlice";
import { Toaster } from "@/components/ui/toaster";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();

  console.log(process.env.NEXT_PUBLIC_BASE_URL);
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await login({ email, password })
    .then((res) => {
      dispatch(setLogin(res));
      router.push("/dashboard");
    })
    .catch((err) => {
      toast({
        title: "Unauthorized",
        description: err.response.data.message,
      });
    })
    .finally(() => setLoading(false));
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-auto w-full rounded-md bg-white px-5 py-8 shadow-md dark:bg-darkmode-600 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-20 xl:w-auto xl:bg-transparent xl:p-0 xl:shadow-none"
      >
        <h2 className="intro-x text-center text-2xl font-bold xl:text-left xl:text-3xl">
          Masuk
        </h2>
        <div className="intro-x mt-2 text-center text-slate-400 xl:hidden"></div>
        <div className="intro-x mt-8 flex flex-col gap-2 min-w-[350px]">
          <label htmlFor="username" className="font-rethink text-[.8rem]">
            Email
          </label>
          <Input
            className="bg-white"
            type="text"
            id="username"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <label htmlFor="password" className="font-rethink text-[.8rem]">
            Kata Sandi
          </label>
          <Input
            className="bg-white"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="intro-x mt-5 text-center xl:mt-8 xl:text-left">
          <Button
            type="submit"
            disabled={loading}
            className="w-full xl:w-32 xl:mr-3"
          >
            {loading ?? "Loading..."}
            Masuk
          </Button>
        </div>
      </form>
    </>
  );
}

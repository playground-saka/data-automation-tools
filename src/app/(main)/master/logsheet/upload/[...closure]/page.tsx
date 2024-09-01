"use client"
import FormUpload from "@/components/pages/master/logsheet/form-upload";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { log } from "console";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page () {
  const params = useParams();
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [type, setType] = useState<string>("");

  useEffect(() => {
    if (params.closure && Array.isArray(params.closure)) {
      const [idParam, typeParam] = params.closure;
      setId(idParam || "");
      setType(typeParam || "");

      if (typeof idParam === 'undefined' || (typeof typeParam === 'undefined' || !["manual","sistem"].includes(typeParam))) {
        router.push("/master/logsheet");
      }
    }
  }, [params]);
  
  return (
    <section className="w-full h-full flex flex-col gap-6 px-6 py-6 pt-12 pb-20">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-3xl">{type == "manual" ? "Upload File Manual" : "Upload File Sistem"}</h1>
        <Breadcrumbs />
      </div>
      <FormUpload pelangganId={id} type={type}/>
    </section>
  );
}

export default Page
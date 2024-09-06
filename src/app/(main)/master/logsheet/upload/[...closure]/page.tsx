"use client"
import { detailLogsheet } from "@/app/api/logsheet";
import FormUpload from "@/components/pages/master/logsheet/form-upload";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { formatDateTime } from "@/utils/formatter";
import { log } from "console";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { datetimeRegex } from "zod";

function Page () {
  const params = useParams();
  const router = useRouter();
  const [pelangganId, setPelangganId] = useState<any>("");
  const [codePelanggan, setCodePelanggan] = useState<any>("");
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<string>("");

  const fetchDetailLogSheet = async (id:string) =>{
    await detailLogsheet(id)
    .then((res) => {
      setPelangganId(res.pelanggan.id);
      setCodePelanggan(res.pelanggan.pelangganId);
      setDate(formatDateTime(res.date,"m-Y"))
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(()=>{
      
    })
  }

  useEffect(() => {
    if (params.closure && Array.isArray(params.closure)) {
      const [idParam, typeParam] = params.closure;
      setType(typeParam || "");
      fetchDetailLogSheet(idParam)
      if (typeof idParam === 'undefined' || (typeof typeParam === 'undefined' || !["manual","sistem"].includes(typeParam))) {
        router.push("/master/logsheet");
      }
    }
  }, [params, router]);
  
  return (
    <section className="w-full h-full flex flex-col gap-6 px-6 py-6 pt-12 pb-20">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-3xl">
          {type == "manual" ? "Upload File Manual" : "Upload File Sistem"}
        </h1>
        <Breadcrumbs />
      </div>
      <FormUpload pelangganId={pelangganId} pelangganCode={codePelanggan} date={date} type={type} />
    </section>
  );
}

export default Page
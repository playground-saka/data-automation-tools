import { deleteCustomer } from "@/app/api/customer";
import { PelangganContext } from "@/components/providers/PelangganProvider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
type Props = {}
function DialogDeletePelanggan({}:Props) {
  const { triggerFetchData, setPelanggan,pelanggan, openDialogDelete, setOpenDialogDelete } =
    useContext(PelangganContext);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await deleteCustomer(pelanggan?.id)
    .then(() => {
      toast({
        title: "Berhasil",
        description: "Data pelanggan berhasil di hapus"
      })
      setOpenDialogDelete(false)
      setPelanggan(null)
      triggerFetchData()
    })
    .catch((err) => {
      toast({
        title: "Gagal",
        description: err.response.data.message,
      })
    })
    .finally(() => {
      setLoading(false);
    })
  };
  return (
    <AlertDialog open={openDialogDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin menghapus Data {pelanggan?.namaPelanggan}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Data ini akan di hapus secara permanen dan tidak dapat dikembalikan
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={() => {
              setOpenDialogDelete(false);
              setPelanggan(null);
            }}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                &nbsp; Loading
              </>
            ) : (
              "Batal"
            )}
          </AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleDelete}>
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                &nbsp; Loading
              </>
            ) : (
              "Ya, Saya Yakin"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DialogDeletePelanggan;
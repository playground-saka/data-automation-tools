import { rollBackLogSheet } from "@/app/api/logsheet";
import { LogSheetontext } from "@/components/providers/LogSheetProvider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { formatDateTime } from "@/utils/formatter";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
type Props = {}
function DialogRollBackLogSheet({}:Props) {
  const {
    triggerFetchData,
    setLogSheet,
    logsheet,
    rollBackType,
    setRollBackType,
  } = useContext(LogSheetontext);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await rollBackLogSheet(logsheet, rollBackType)
      .then(() => {
        toast({
          title: "Berhasil",
          description: `Data import logsheet ${rollBackType == 'manual' ? 'Manual' : 'Wilis'} berhasil di rollback`,
        });
        setRollBackType(null);
        setLogSheet(null);
        triggerFetchData();
      })
      .catch((err) => {
        toast({
          title: "Gagal",
          description: err.response.data.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AlertDialog open={rollBackType}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah anda yakin ingin mengembalikan data import{" "}
            {rollBackType == "manual" ? "Manual" : "Wilis"} pada{" "}
            {logsheet?.pelanggan.kategori.namaKategori} - {logsheet?.pelanggan.namaPelanggan} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Data pada bulan {formatDateTime(logsheet?.date, "m-Y")} akan di
            kembalikan secara permanen dan tidak dapat dikembalikan lagi
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={() => {
              setRollBackType(null);
              setLogSheet(null);
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
export default DialogRollBackLogSheet;
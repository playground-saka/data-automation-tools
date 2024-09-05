import { deleteUser } from "@/app/api/user";
import { UserContext } from "@/components/providers/UserProvider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
type Props = {}
function DialogDeleteUser({}:Props) {
  const { triggerFetchData, setUser,user, openDialogDelete, setOpenDialogDelete } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await deleteUser(user?.id)
    .then(() => {
      toast({
        title: "Berhasil",
        description: "Data user berhasil di hapus"
      })
      setOpenDialogDelete(false)
      setUser(null)
      triggerFetchData()
    })
    .catch((err) => {
      toast({
        title: "Gagal",
        description: err.response.data.message,
      });
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
            Apakah anda yakin ingin menghapus pengguna {user?.fullName}?
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
              setUser(null);
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
export default DialogDeleteUser;
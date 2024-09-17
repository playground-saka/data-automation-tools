import { getPermissions } from "@/app/api/permission";
import { putRolePermission } from "@/app/api/role";
import { RoleContext } from "@/components/providers/RoleProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import React, { useContext, useEffect, useState } from "react";

type Props = {};

function DialogSettingRole({}: Props) {
  const {
    triggerFetchData,
    setRole,
    role,
    openDialogSettingRole,
    setOpenDialogSettingRole,
  } = useContext(RoleContext);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<
    Model.Permission.PermissionData[]
  >([]);
  const [checkedPermissionIds, setCheckedPermissionIds] = useState<number[]>([]);

  const fetchPermission = async (id: any) => {
    setPermissions([]);
    if (typeof id !== "undefined") {
      setLoading(true);
      await getPermissions(id)
        .then((res) => {
          setPermissions(
            res.map((permission) => ({
              ...permission,
              checked: !!permission.rolePermission,
              children: permission.children.map((child) => ({
                ...child,
                checked: !!child.rolePermission,
                children: child.children.map((grandchild) => ({
                  ...grandchild,
                  checked: !!grandchild.rolePermission,
                })),
              })),
            }))
          );
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.response?.data?.message || "Something went wrong",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSavePermission = async () => {
    await putRolePermission(role?.id, checkedPermissionIds)
      .then((res) => {
        setOpenDialogSettingRole(false);
        triggerFetchData();
        toast({
          title: "Sukses",
          description: "Role berhasil diubah",
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
  }

  useEffect(() => {
    if (role?.id) fetchPermission(role.id);
  }, [openDialogSettingRole, role?.id]);

 useEffect(() => {
   // Fungsi untuk mengumpulkan ID permission yang checked
   const updateCheckedPermissions = (
     permissionList: Model.Permission.PermissionData[]
   ): number[] => {
     const ids: number[] = [];

     const collectCheckedIds = (list: Model.Permission.PermissionData[]) => {
       list.forEach((permission) => {
         if (permission.checked) {
           ids.push(permission.id);
         }
         if (permission.children && permission.children.length > 0) {
           collectCheckedIds(permission.children);
         }
       });
     };

     collectCheckedIds(permissionList);
     return ids;
   };

   // Update state dengan ID permission yang checked
   setCheckedPermissionIds(updateCheckedPermissions(permissions));
 }, [permissions]);

  // Recursive function to toggle the checked state of a permission and its children
  const togglePermissionByRoot = (
    id: number,
    checked: boolean,
    permissionList: Model.Permission.PermissionData[]
  ): Model.Permission.PermissionData[] => {
    return permissionList.map((permission) => {
      if (permission.id === id) {
        // Set checked status untuk permission yang dipilih
        permission.checked = checked;

        // Jika parent di-uncheck, uncheck semua child-nya
        if (!checked && permission.children) {
          permission.children = toggleAllChildren(permission.children, false);
        }

        // Update children secara rekursif
        if (permission.children && permission.children.length > 0) {
          permission.children = togglePermissionByRoot(
            id,
            checked,
            permission.children
          );
        }
      } else {
        // Update children secara rekursif
        if (permission.children && permission.children.length > 0) {
          permission.children = togglePermissionByRoot(
            id,
            checked,
            permission.children
          );
        }
      }

      return permission;
    });
  };  
  const toggleAllChildren = (
    children: Model.Permission.PermissionData[],
    checked: boolean
  ): Model.Permission.PermissionData[] => {
    return children.map((child) => {
      child.checked = checked;
      if (child.children && child.children.length > 0) {
        child.children = toggleAllChildren(child.children, checked);
      }
      return child;
    });
  };
  const toggleParentChainByRoot = (
    root: string,
    permissionList: Model.Permission.PermissionData[],
    checked: boolean
  ): Model.Permission.PermissionData[] => {
    const parentIds = root.split(".").slice(0, -1); // Ambil semua parent ID dari root

    return permissionList.map((permission) => {
      if (parentIds.includes(permission.id.toString())) {
        permission.checked = checked;

        // Update children secara rekursif
        if (permission.children && permission.children.length > 0) {
          permission.children = toggleParentChainByRoot(
            root,
            permission.children,
            checked
          );
        }
      } else {
        // Update children secara rekursif
        if (permission.children && permission.children.length > 0) {
          permission.children = toggleParentChainByRoot(
            root,
            permission.children,
            checked
          );
        }
      }

      return permission;
    });
  };
  const handleSwitchChange = (id: number, root: string, checked: boolean) => {
    setPermissions((prevPermissions) => {
      let updatedPermissions = togglePermissionByRoot(
        id,
        checked,
        prevPermissions
      );

      // Jika checked, pastikan parent chain di-check
      if (checked) {
        updatedPermissions = toggleParentChainByRoot(
          root,
          updatedPermissions,
          true
        );
      } else {
        // Jika parent di-uncheck, uncheck semua child
        updatedPermissions = togglePermissionByRoot(
          id,
          false,
          updatedPermissions
        );
      }

      return updatedPermissions;
    });
  };

  // Recursive function to render permissions and their children
  const renderPermissions = (
    permissionList: Model.Permission.PermissionData[],
    depth: number = 0
  ) => {
    return permissionList.map((permission) => (
      <React.Fragment key={permission.id}>
        <TableRow>
          <TableCell className={`pl-${depth * 4}`}>
            {permission.alias}
          </TableCell>
          <TableCell className="text-center">
            <Switch
              checked={permission.checked || false}
              onCheckedChange={(checked) =>
                handleSwitchChange(permission.id, permission.root, checked)
              }
            />
          </TableCell>
        </TableRow>
        {permission.children?.length > 0 &&
          renderPermissions(permission.children, depth + 1)}
      </React.Fragment>
    ));
  };

  return (
    <Dialog open={openDialogSettingRole}>
      <DialogContent className="max-w-[50vw] max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            Setting Hak Akses Pada Role {role?.roleName}
          </DialogTitle>
          <DialogDescription>
            Di sini anda dapat mengatur hak akses pada role {role?.roleName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-full">
          <Table>
            <TableHeader className="text-xs">
              <TableRow>
                <TableHead className="text-left">Hak Akses</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {!loading && permissions.length > 0 ? (
                renderPermissions(permissions, 0)
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpenDialogSettingRole(false);
              setRole(null);
            }}
          >
            Batal
          </Button>
          <Button onClick={handleSavePermission}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogSettingRole;

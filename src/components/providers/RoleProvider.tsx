import React, { createContext, useState, useCallback } from "react";

export const RoleContext = createContext({} as any);

export const RoleProvider = ({ children }:{children: React.ReactNode}) => {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogSettingRole, setOpenDialogSettingRole] = useState(false);
  const [role, setRole] = useState<Model.Role.RoleData | null>(null);



  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  return (
    <RoleContext.Provider
      value={{ triggerFetchData, triggerFetch, setRole, role, setOpenDialogDelete, openDialogDelete, setOpenDialogSettingRole, openDialogSettingRole }}
    >
      {children}
    </RoleContext.Provider>
  );
};

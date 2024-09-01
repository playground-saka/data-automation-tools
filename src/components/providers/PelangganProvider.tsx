import React, { createContext, useState, useCallback } from "react";

export const PelangganContext = createContext({} as any);

export const PelangganProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [pelanggan, setPelanggan] = useState<Model.Customer.CustomerData | null>(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  return (
    <PelangganContext.Provider
      value={{ triggerFetchData, triggerFetch, setPelanggan, pelanggan,setOpenDialogDelete, openDialogDelete }}
    >
      {children}
    </PelangganContext.Provider>
  );
};

import React, { createContext, useState, useCallback } from "react";

export const KategoriContext = createContext({} as any);

export const KategoriProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [kategori, setKategori] = useState<Model.Category.CategoryData | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  const triggerOpenForm = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  return (
    <KategoriContext.Provider
      value={{ triggerFetchData, triggerFetch, triggerOpenForm, setKategori, kategori, setOpenDialogDelete, openDialogDelete }}
    >
      {children}
    </KategoriContext.Provider>
  );
};

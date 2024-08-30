import React, { createContext, useState, useCallback } from "react";

export const KategoriContext = createContext({} as any);

export const KategoriProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  const triggerOpenForm = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  return (
    <KategoriContext.Provider
      value={{ triggerFetchData, triggerFetch, triggerOpenForm, openForm }}
    >
      {children}
    </KategoriContext.Provider>
  );
};

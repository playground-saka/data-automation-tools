import React, { createContext, useState, useCallback } from "react";

export const FormulaContext = createContext({} as any);

export const FormulaProvider = ({ children }:{children: React.ReactNode}) => {
  const [openForm, setOpenForm] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  const triggerOpenForm = useCallback(() => {
    setOpenForm((prev) => !prev);
  }, []);

  return (
    <FormulaContext.Provider
      value={{ triggerFetchData, triggerFetch,triggerOpenForm, openForm }}
    >
      {children}
    </FormulaContext.Provider>
  );
};

import React, { createContext, useState, useCallback } from "react";

export const FormulaContext = createContext({} as any);

export const FormulaProvider = ({ children }:{children: React.ReactNode}) => {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [formula, setFormula] = useState<Model.Formula.FormulaData | null>(null);



  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  return (
    <FormulaContext.Provider
      value={{ triggerFetchData, triggerFetch, setFormula, formula, setOpenDialogDelete, openDialogDelete }}
    >
      {children}
    </FormulaContext.Provider>
  );
};

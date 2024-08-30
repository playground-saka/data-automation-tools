import React, { createContext, useState, useCallback } from "react";

export const PelangganContext = createContext({} as any);

export const PelangganProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [triggerFetch, setTriggerFetch] = useState(false);

  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  return (
    <PelangganContext.Provider
      value={{ triggerFetchData, triggerFetch }}
    >
      {children}
    </PelangganContext.Provider>
  );
};

import React, { createContext, useState, useCallback } from "react";

export const LogSheetontext = createContext({} as any);

export const LogSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);
  return (
    <LogSheetontext.Provider
      value={{ triggerFetchData, triggerFetch }}
    >
      {children}
    </LogSheetontext.Provider>
  );
};

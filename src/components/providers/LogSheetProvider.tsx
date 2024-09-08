import React, { createContext, useState, useCallback } from "react";

export const LogSheetontext = createContext({} as any);

export const LogSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [logsheet, setLogSheet] = useState<Model.LogSheet.LogSheetData | null>(
    null
  );
  const [rollBackType, setRollBackType] = useState<string | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);
  return (
    <LogSheetontext.Provider
      value={{
        triggerFetchData,
        triggerFetch,
        setLogSheet,
        logsheet,
        setRollBackType,
        rollBackType,
      }}
    >
      {children}
    </LogSheetontext.Provider>
  );
};

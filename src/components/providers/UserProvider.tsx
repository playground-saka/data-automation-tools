import React, { createContext, useState, useCallback } from "react";

export const UserContext = createContext({} as any);

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<Model.User.UserData | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  const triggerFetchData = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  const triggerOpenForm = useCallback(() => {
    setTriggerFetch((prev) => !prev);
  }, []);

  return (
    <UserContext.Provider
      value={{ triggerFetchData, triggerFetch, triggerOpenForm, setUser, user, setOpenDialogDelete, openDialogDelete }}
    >
      {children}
    </UserContext.Provider>
  );
};

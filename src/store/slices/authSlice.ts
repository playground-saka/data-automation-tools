import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

export const initialState: Model.Auth.AuthData = {
  token: Cookie.get("token") || "",
  user: {
    id: null,
    username: "",
    fullName: "",
    email: "",
    isActive: false,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<Model.Auth.AuthData>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      Cookie.set("auth.token", state.token);
      Cookie.set("auth.user", JSON.stringify(state.user));
    },

    setLogout(state) {
      state.token = "";
      state.user = {
        id: null,
        username: "",
        email: "",
        isActive: false,
      };
      localStorage.removeItem("persist:");
      Cookie.remove("auth.token");
      Cookie.remove("auth.user");
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

export const initialState: Model.Auth.AuthData = {
  token: Cookie.get("token") || "",
  user: {
    id: null,
    username: "",
    fullName: "",
    email: "",
    isActive: false,
    role: "",
  },
  permissions: [],
  menus: [],
};

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Remove cookies and localStorage items
    Cookie.remove("auth.token");
    Cookie.remove("auth.user");
    Cookie.remove("auth.permissions");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("menus");
    localStorage.removeItem("permissions");

    // Dispatch setLogout to update the state
    dispatch(setLogout());
  }
);



export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<Model.Auth.AuthData>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.menus = action.payload.menus;

      Cookie.set("auth.token", state.token);
      Cookie.set("auth.user", JSON.stringify(state.user));
      Cookie.set("auth.permissions", JSON.stringify(state.permissions));
      localStorage.setItem("permissions", JSON.stringify(state.permissions));
      localStorage.setItem("menus", JSON.stringify(state.menus));
    },
    logout: () => initialState,

    setLogout(state) {
      // Reset state to initial values
      state.token = "";
      state.user = {
        id: null,
        username: "",
        fullName: "",
        email: "",
        role:"",
        isActive: false,
      };
      state.permissions = [];
      state.menus = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      return initialState; // Reset state on logout fulfilled
    });
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;

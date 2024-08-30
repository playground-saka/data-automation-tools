import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer
} from "redux-persist";
import storage from "@/store/storage";
import persistStore from "redux-persist/es/persistStore";
import rootReducer from "@/store/rootReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

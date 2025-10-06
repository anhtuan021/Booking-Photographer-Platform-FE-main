"use client";
import { Provider } from "react-redux";
import { createStore } from "../store/store";
import { useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
export default function ReduxProvider({ children }) {
  // create store once on the client
  const store = useMemo(() => createStore(), []);
  // rehydrate auth state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem("admin_user"));
      } catch {}
      if (token) {
        store.dispatch(setAuth({ token, user }));
      }
    }
  }, [store]);
  return <Provider store={store}>{children}</Provider>;
}

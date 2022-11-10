import { REFRESH_TOKEN_URL } from "./constants";
import React from "react";
import axios from "../../api/axios";
import useAuth from "./useAuth";

export default function useRefresh() {
  const { auth, setAuth, isValid, canRefresh } = useAuth();

  const refreshCallback = React.useCallback(() => {
    if (canRefresh) {
      axios
        .post(REFRESH_TOKEN_URL, {
          refreshToken: auth?.refresh_token,
        })
        .then((response) => {
          setAuth(response.data);
        })
        .catch((err) => {
          setAuth(undefined);
        })
        .finally(() => {});
    }
  }, [auth?.refresh_token, canRefresh, setAuth]);

  const syncRefresh = async () => {
    if (canRefresh) {
      const response = await axios.post(REFRESH_TOKEN_URL, {
        refreshToken: auth?.refresh_token,
      });
      return response.data;
    }
  };

  return { refreshCallback, syncRefresh, needsRefreshing: auth && auth.refresh_token && !isValid };
}

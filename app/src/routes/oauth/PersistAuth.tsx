import { Outlet } from "react-router-dom";
import React from "react";
import useRefresh from "../../hooks/oauth/useRefreshToken";

const PersistAuth = () => {
  const { refreshCallback, needsRefreshing } = useRefresh();

  React.useEffect(() => {
    console.log("🚀 ~ file: PersistAuth.tsx ~ line 11 ~ React.useEffect ~ needsRefreshing", needsRefreshing);
    if (needsRefreshing) {
      refreshCallback();
    }
  }, [needsRefreshing, refreshCallback]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return <>{needsRefreshing ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistAuth;

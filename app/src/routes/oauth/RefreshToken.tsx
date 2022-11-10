import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/oauth/useAuth";
import useRefresh from "../../hooks/oauth/useRefreshToken";

const RefreshToken = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { refreshCallback } = useRefresh();
  const { canRefresh } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        refreshCallback();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    canRefresh ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default RefreshToken;

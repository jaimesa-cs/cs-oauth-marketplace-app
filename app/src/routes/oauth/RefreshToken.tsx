import { useEffect, useState } from "react";

import { Button } from "@contentstack/venus-components";
import { Outlet } from "react-router-dom";
import { useAppConfig } from "../../hooks/useAppConfig";
import useAuth from "../../hooks/oauth/useAuth";
import { useOAuth2Token } from "../../hooks/oauth/useOAuth2Token";
import useRefresh from "../../hooks/oauth/useRefreshToken";

const RefreshToken = () => {
  const [config] = useAppConfig();
  const [isLoading, setIsLoading] = useState(true);
  const { asyncRefresh } = useRefresh();
  const { canRefresh, isValid } = useAuth();

  const loadUserCode = useOAuth2Token({
    authorizeUrl: config?.oAuthExampleConfig?.oauth?.authorizeUrl, //"https://app.contentstack.com/#!/apps/6336f43b57469b0019995038/authorize",
    clientId: config?.oAuthExampleConfig?.oauth?.clientId, //"Yo1twKPJ9uaQle-a",
    responseType: config?.oAuthExampleConfig?.oauth?.responseType, // "code",
    redirectUri: config?.oAuthExampleConfig?.oauth?.redirectUri, //"http://localhost:3000/callback",
  });

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        asyncRefresh();
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

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isValid ? (
            <Outlet />
          ) : (
            <Button
              onClick={() => {
                loadUserCode();
              }}
            >
              Authorize
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default RefreshToken;

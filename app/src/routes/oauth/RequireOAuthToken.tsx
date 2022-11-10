import { Button } from "@contentstack/venus-components";
import { Outlet } from "react-router-dom";
import React from "react";
import { useAppConfig } from "../../hooks/useAppConfig";
import useAuth from "../../hooks/oauth/useAuth";
import { useOAuth2Token } from "../../hooks/oauth/useOAuth2Token";

const RequireOAuthToken = () => {
  const [config] = useAppConfig();
  const loadUserCode = useOAuth2Token({
    authorizeUrl: config?.oAuthExampleConfig?.oauth?.authorizeUrl, //"https://app.contentstack.com/#!/apps/6336f43b57469b0019995038/authorize",
    clientId: config?.oAuthExampleConfig?.oauth?.clientId, //"Yo1twKPJ9uaQle-a",
    responseType: config?.oAuthExampleConfig?.oauth?.responseType, // "code",
    redirectUri: config?.oAuthExampleConfig?.oauth?.redirectUri, //"http://localhost:3000/callback",
  });
  const { isValid } = useAuth();

  return isValid ? (
    <Outlet />
  ) : (
    // <Navigate to="/login" state={{ from: location }} replace />
    <>
      <Button
        onClick={() => {
          loadUserCode();
        }}
      >
        Authorize
      </Button>
    </>
  );
};

export default RequireOAuthToken;

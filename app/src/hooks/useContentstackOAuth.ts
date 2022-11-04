import { OAuthCode, OAuthToken, getUserCode, setCode, setToken, useOAuth2Token } from "./oauth";

import { IBulkPublishingConfig } from "../types";
import React from "react";
import { useAppConfig } from "./useAppConfig";

/**
 * Returns the location name (eg: CustomField) and the location instance from the SDK
 * based on active location
 * @return {locationName, location}
 */

interface IBulkPublishingUtils {
  oauthConfig: any;
  loadUserCode: getUserCode;
  code: OAuthCode | undefined;
  setCode: setCode;
  token: OAuthToken | undefined;
  setToken: setToken;
}
export const useContentstackOAuth = (): IBulkPublishingUtils => {
  const [extensionConfig] = useAppConfig();

  // React.useEffect(() => {
  //   console.log("🚀 ~ file: useContentstackOAuth.ts ~ useEffect", extensionConfig);
  // }, [extensionConfig]);

  const { token, setToken, getUserCode, code, setCode } = useOAuth2Token({
    authorizeUrl: extensionConfig?.bulkPublishingConfig?.oauth?.authorizeUrl, //"https://app.contentstack.com/#!/apps/6336f43b57469b0019995038/authorize",
    clientId: extensionConfig?.bulkPublishingConfig?.oauth?.clientId, //"Yo1twKPJ9uaQle-a",
    responseType: extensionConfig?.bulkPublishingConfig?.oauth?.responseType, // "code",
    redirectUri: extensionConfig?.bulkPublishingConfig?.oauth?.redirectUri, //"http://localhost:3000/callback",
  });

  return {
    oauthConfig: extensionConfig?.bulkPublishingConfig?.oauth,
    loadUserCode: getUserCode,
    code,
    setCode,
    token,
    setToken,
  };
};

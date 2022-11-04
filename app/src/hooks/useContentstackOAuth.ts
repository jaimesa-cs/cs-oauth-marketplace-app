import { getUserCode, useOAuth2Token } from "./oauth/useOAuth2Token";

import { useAppConfig } from "./useAppConfig";

/**
 * Returns the location name (eg: CustomField) and the location instance from the SDK
 * based on active location
 * @return {locationName, location}
 */

interface IOAuthExampleUtils {
  oauthConfig: any;
  loadUserCode: getUserCode;
  tokenIsActive: boolean;
  tokenIsAvailable: boolean;
  clearTokens: () => void;
}
export const useContentstackOAuth = (): IOAuthExampleUtils => {
  const [extensionConfig] = useAppConfig();

  const { tokenIsAvailable, getUserCode, tokenIsActive, clearTokens } = useOAuth2Token({
    authorizeUrl: extensionConfig?.oAuthExampleConfig?.oauth?.authorizeUrl, //"https://app.contentstack.com/#!/apps/6336f43b57469b0019995038/authorize",
    clientId: extensionConfig?.oAuthExampleConfig?.oauth?.clientId, //"Yo1twKPJ9uaQle-a",
    responseType: extensionConfig?.oAuthExampleConfig?.oauth?.responseType, // "code",
    redirectUri: extensionConfig?.oAuthExampleConfig?.oauth?.redirectUri, //"http://localhost:3000/callback",
  });

  return {
    oauthConfig: extensionConfig?.oAuthExampleConfig?.oauth,
    loadUserCode: getUserCode,
    tokenIsAvailable,
    tokenIsActive,
    clearTokens,
  };
};

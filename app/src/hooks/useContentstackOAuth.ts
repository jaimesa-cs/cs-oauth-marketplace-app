import { useAppConfig } from "./useAppConfig";
import { useOAuth2Token } from "./oauth/useOAuth2Token";

/**
 * Returns the location name (eg: CustomField) and the location instance from the SDK
 * based on active location
 * @return {locationName, location}
 */

export const useContentstackOAuth = (): (() => void) => {
  const [extensionConfig] = useAppConfig();

  return useOAuth2Token({
    authorizeUrl: extensionConfig?.oAuthExampleConfig?.oauth?.authorizeUrl, //"https://app.contentstack.com/#!/apps/6336f43b57469b0019995038/authorize",
    clientId: extensionConfig?.oAuthExampleConfig?.oauth?.clientId, //"Yo1twKPJ9uaQle-a",
    responseType: extensionConfig?.oAuthExampleConfig?.oauth?.responseType, // "code",
    redirectUri: extensionConfig?.oAuthExampleConfig?.oauth?.redirectUri, //"http://localhost:3000/callback",
  });
};

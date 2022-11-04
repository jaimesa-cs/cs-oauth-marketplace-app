/**
 * @module react-oauth2-hook
 */

/**
 *
 */

import * as PropTypes from "prop-types";
import * as React from "react";

import useLocalStorage, { SetValue } from "../useLocalStorage";

import { Map } from "immutable";
import axios from "axios";

// react-storage-hook.d.ts

axios.defaults.withCredentials = true;

/**
 * @hidden
 */
const storagePrefix = "react-oauth2-hook";
const storageCodePrefix = `${storagePrefix}-code`;
const storageTokenPrefix = `${storagePrefix}-token`;

/**
 * @hidden
 */
const oauthStateName = `${storagePrefix}-state-token-challenge`;

export interface Options {
  /**
   * The OAuth authorize URL to retrieve the token from.
   */
  authorizeUrl: string;
  /**
   * The OAuth scopes to request.
   */
  scope?: string[];
  /**
   * The OAuth `redirect_uri` callback.
   */
  redirectUri: string;
  /**
   * The OAuth `client_id` corresponding to the requesting client.
   */
  clientId: string;
  /**
   * The OAuth `response_type` corresponding to the requesting client.
   */
  responseType?: string;
  /**
   * The  `fromUrl` that we will need to redirect to after authorization.
   */
  fromUrl?: string;
}

/**
 * useOAuth2Token is a React hook providing an OAuth2 implicit grant token.
 *
 * When useToken is called, it will attempt to retrieve an existing
 * token by the criteria of `{ authorizeUrl, scopes, clientID }`.
 * If a token by these specifications does not exist, the first
 * item in the returned array will be `undefined`.
 *
 * If the user wishes to retrieve a new token, they can call `getToken()`,
 * a function returned by the second parameter. When called, the function
 * will open a window for the user to confirm the OAuth grant, and
 * pass it back as expected via the hook.
 *
 * The OAuth token must be passed to a static endpoint. As
 * such, the `callbackUrl` must be passed with this endpoint.
 * The `callbackUrl` should render the [[OAuthCallback]] component,
 * which will securely verify the token and pass it back,
 * before closing the window.
 *
 * All instances of this hook requesting the same token and scopes
 * from the same place are synchronized. In concrete terms,
 * if you have many components waiting for a Facebook OAuth token
 * to make a call, they will all immediately update when any component
 * gets a token.
 *
 * Finally, in advanced cases the user can manually overwrite any
 * stored token by capturing and calling the third item in
 * the reponse array with the new value.
 *
 * @param authorizeUrl The OAuth authorize URL to retrieve the token from.
 * @param scope The OAuth scopes to request.
 * @param redirectUri The OAuth redirect_uri callback URL.
 * @param clientId The OAuth client_id corresponding to the requesting client.
 * @example
 
 */
export const useOAuth2Token = (options: Options): IOauth2TokenResult => {
  const target = {
    authorizeUrl: options.authorizeUrl,
    scope: options.scope,
    clientId: options.clientId,
  };

  const [token, setToken] = useLocalStorage<string>(storageTokenPrefix + "-" + JSON.stringify(target), "");
  const [code, setCode] = useLocalStorage<string>(storageCodePrefix + "-" + JSON.stringify(target), "");

  let [state, setState] = useLocalStorage<string>(oauthStateName, "");

  const getUserCode = () => {
    setState(
      (state = JSON.stringify({
        nonce: cryptoRandomString(),
        target,
      }))
    );
    const url = OAuth2AuthorizeURL(options, state);

    window.open(url);
  };
  return {
    token,
    setToken,
    code,
    setCode,
    getUserCode,
  };
};

/**
 * @hidden
 */
const OAuth2AuthorizeURL = (options: Options, state: string) => {
  // console.log("OAuth2AuthorizeURL", options);
  const obj: any = {
    client_id: options.clientId,
    state,
    redirect_uri: options.redirectUri,
    response_type: options.responseType,
  };
  if (options.scope && options.scope.length > 0) {
    obj.scope = options.scope.join(" ");
  }

  const oAuthUrl = `${options.authorizeUrl}?${Object.entries<any>(obj)
    .map(([k, v]) => [k, v].map(encodeURIComponent).join("="))
    .join("&")}`;
  // console.log("oAuthUrl", oAuthUrl);
  return oAuthUrl;
  // eslint-disable-next-line react-hooks/exhaustive-deps
};

/**
 *
 * OAuthToken represents an OAuth2 implicit grant token.
 */
export type OAuthToken = string;

/**
 * OAuthToken represents an OAuth2 implicit grant token.
 */
export type OAuthCode = string;

/**
 * getToken is returned by [[useOAuth2Token]].
 * When called, it prompts the user to authorize.
 */
export type getUserCode = () => void;

/**
 * setToken is returned by [[useOAuth2Token]].
 * When called, it overwrites any stored OAuth token.
 * `setToken(undefined)` can be used to synchronously
 * invalidate all instances of this OAuth token.
 */
export type setToken = SetValue<string | undefined>;

/**
 * setCode is returned by [[useOAuth2Token]].
 * When called, it overwrites any stored Code.
 * `setCode(undefined)` can be used to synchronously
 * invalidate all instances of this Code token.
 */
export type setCode = SetValue<string | undefined>;

export interface IOauth2TokenResult {
  getUserCode: getUserCode;
  setToken: setToken;
  token: OAuthToken | undefined;
  setCode: setCode;
  code: OAuthCode | undefined;
}

/**
 * @hidden
 */
const cryptoRandomString = () => {
  const entropy = new Uint32Array(10);
  window.crypto.getRandomValues(entropy);

  return window.btoa([...entropy].join(","));
};

/**
 * This error is thrown by the [[OAuthCallback]]
 * when the state token recieved is incorrect or does not exist.
 */
export const ErrIncorrectStateToken = new Error("incorrect state token");

/**
 * This error is thrown by the [[OAuthCallback]]
 * if no access_token is recieved.
 */
export const ErrNoAccessToken = new Error("no access_token");

/**
 * @hidden
 */
const urlDecode = (urlString: string): Map<string, string> =>
  Map(
    urlString.split("&").map<[string, string]>((param: string): [string, string] => {
      const sepIndex = param.indexOf("=");
      const k = decodeURIComponent(param.slice(0, sepIndex));
      const v = decodeURIComponent(param.slice(sepIndex + 1));
      return [k, v];
    })
  );

/**
 * @hidden
 */
const OAuthCallbackHandler: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const [state] = useLocalStorage<string | undefined>(oauthStateName);

  const { target } = JSON.parse(state || "");

  const [, /* token */ setToken] = useLocalStorage<string>(storageTokenPrefix + "-" + JSON.stringify(target));
  const [, /* code */ setCode] = useLocalStorage<string>(storageCodePrefix + "-" + JSON.stringify(target));

  React.useEffect(() => {
    const params: Map<string, string> = Map([
      ...urlDecode(window.location.search.slice(1)),
      ...urlDecode(window.location.hash.slice(1)),
    ]);

    //? Do we need this?
    // if (state !== params.get("state")) throw ErrIncorrectStateToken;

    const code: string | undefined = params.get("code");
    if (code === undefined) throw ErrNoAccessToken;
    setCode(code);
    axios("http://localhost:8080/api/initialize-session", {
      method: "POST",
      data: {
        code: code,
        userId: "jaime",
      },
    })
      .then((res) => {
        setToken(res.data.access_token);
        window.close();
      })
      .catch((err) => {
        console.log("🚀 ~ file: BulkPublishingSidebar.tsx ~ line 51 ~ BulkPublishingSidebarExtension ~ err", err);
      });
  }, [setToken, setCode, state]);

  return <React.Fragment>{children || "please wait..."}</React.Fragment>;
};

/**
 * OAuthCallback is a React component that handles the callback
 * step of the OAuth2 protocol.
 *
 * OAuth2Callback is expected to be rendered on the url corresponding
 * to your redirect_uri.
 *
 * By default, this component will deal with errors by closing the window,
 * via its own React error boundary. Pass `{ errorBoundary: false }`
 * to handle this functionality yourself.
 *
 * @example
 * <Route exact path="/callback" component={OAuthCallback} />} />
 */
export const OAuthCallback: React.FunctionComponent<{
  errorBoundary?: boolean;
  children?: React.ReactNode;
}> = ({
  /**
   * When set to true, errors are thrown
   * instead of just closing the window.
   */
  errorBoundary = true,
  children,
}) => {
  if (errorBoundary === false) return <OAuthCallbackHandler>{children}</OAuthCallbackHandler>;
  return (
    <ClosingErrorBoundary>
      <OAuthCallbackHandler>{children}</OAuthCallbackHandler>
    </ClosingErrorBoundary>
  );
};

OAuthCallback.propTypes = {
  errorBoundary: PropTypes.bool,
  children: PropTypes.node,
};

/**
 * @hidden
 */
class ClosingErrorBoundary extends React.PureComponent<{ children: React.ReactNode }> {
  state = { errored: false };

  static getDerivedStateFromError(error: string) {
    console.log(error);
    // window.close()
    return { errored: true };
  }

  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  render() {
    return this.state.errored ? null : this.props.children;
  }
}

const defaultExportsMessage = "this module has no default export.";
export default defaultExportsMessage;

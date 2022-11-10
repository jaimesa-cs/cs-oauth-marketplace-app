/**
 * @module react-oauth2-hook
 */

/**
 *
 */

import * as PropTypes from "prop-types";
import * as React from "react";

import { INITIALIZE_SESSION_URL } from "./constants";
import { Map } from "immutable";
import axios from "../../api/axios";
import useAuth from "./useAuth";

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
export const useOAuth2Token = (options: Options): (() => void) => {
  const getUserCode = () => {
    const url = OAuth2AuthorizeURL(options);
    window.open(url);
  };

  return getUserCode;
};

/**
 * @hidden
 */
const OAuth2AuthorizeURL = (options: Options) => {
  // console.log("OAuth2AuthorizeURL", options);
  const obj: any = {
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: options.responseType,
  };
  if (options.scope && options.scope.length > 0) {
    obj.scope = options.scope.join(" ");
  }

  const oAuthUrl = `${options.authorizeUrl}?${Object.entries<any>(obj)
    .map(([k, v]) => [k, v].map(encodeURIComponent).join("="))
    .join("&")}`;
  return oAuthUrl;
};

export const ErrNoCode = new Error("no code available");

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
  const { setAuth } = useAuth();

  React.useEffect(() => {
    const params: Map<string, string> = Map([
      ...urlDecode(window.location.search.slice(1)),
      ...urlDecode(window.location.hash.slice(1)),
    ]);

    //? Do we need this?
    // if (state !== params.get("state")) throw ErrIncorrectStateToken;

    const code: string | undefined = params.get("code");
    if (code === undefined) throw ErrNoCode;

    axios(INITIALIZE_SESSION_URL, {
      method: "POST",
      data: {
        code: code,
      },
    })
      .then((res) => {
        console.log("🚀 ~ file: useOAuth2Token.tsx ~ line 264 ~ .then ~ res", res.data);
        setAuth(res.data);
        window.close();
      })
      .catch((err) => {
        console.log("🚀 ~ Error while initializing session", err);
      });
  }, [setAuth]);

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

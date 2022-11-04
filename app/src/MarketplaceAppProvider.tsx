import React, { useEffect, useState } from "react";
import { get, isNull } from "lodash";

import { AppFailed } from "./components/AppFailed";
import ContentstackAppSDK from "@contentstack/app-sdk";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import { KeyValueObj } from "./types";
import { getAppLocation } from "./functions";
import { useAppConfig } from "./hooks/useAppConfig";
import { useAppSdk } from "./hooks/useAppSdk";
import { useLocation } from "react-router-dom";

const MARKETPLACE_APP_NAME: string = process.env.REACT_APP_MARKETPLACE_APP_NAME as string;

type ProviderProps = {
  children?: React.ReactNode;
  ignoreRoutes?: string[];
};

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children, ignoreRoutes }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useAppSdk();
  const [, setConfig] = useAppConfig();
  const location = useLocation();

  // Initialize the SDK and track analytics event
  // useEffect(() => {
  //   (async () => {
  //     if (ignoreRoutes === undefined || ignoreRoutes.indexOf(location.pathname) === -1) {
  //       try {
  //         const appSdk: Extension = await ContentstackAppSDK.init();
  //         setAppSdk(appSdk);

  //         const appConfig: KeyValueObj = await appSdk.getConfig();
  //         setConfig(appConfig);
  //       } catch (err) {
  //         setFailed(true);
  //       }
  //     }
  //   })();
  // }, [setFailed, setAppSdk, setConfig, ignoreRoutes, location.pathname]);

  // Initialize the SDK and track analytics event
  useEffect(() => {
    if (ignoreRoutes === undefined || ignoreRoutes.indexOf(location.pathname) === -1) {
      ContentstackAppSDK.init()
        .then((appSdk: Extension) => {
          appSdk
            .getConfig()
            .then((appConfig: KeyValueObj) => {
              setAppSdk(appSdk);
              // console.log("🚀 ~ file: MarketplaceAppProvider.tsx ~ line 56 ~ .then ~ appSdk", appSdk);
              setConfig(appConfig);
              // console.log("🚀 ~ file: MarketplaceAppProvider.tsx ~ line 57 ~ .then ~ appConfig", appConfig);
            })
            .catch(() => {
              setFailed(true);
            });
        })
        .catch(() => {
          setFailed(true);
        });
    }
  }, [setFailed, setAppSdk, setConfig, ignoreRoutes, location.pathname]);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk atom.
  if (ignoreRoutes && ignoreRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  if (failed) {
    return <AppFailed />;
  }

  return <>{children}</>;
};

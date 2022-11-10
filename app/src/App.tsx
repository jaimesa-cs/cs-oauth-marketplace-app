import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Provider as BulkPublishingProvider } from "jotai";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Layout from "./routes/Layout";
import { MarketplaceAppProvider } from "./MarketplaceAppProvider";
import { OAuthCallback } from "./hooks/oauth/useOAuth2Token";
import RefreshToken from "./routes/oauth/RefreshToken";
import RequireAuth from "./routes/oauth/RequireAuth";

/**
 * All the routes are Lazy loaded.
 * This will ensure the bundle contains only the core code and respective route bundle
 */

const AppConfigurationExtension = React.lazy(() => import("./routes/AppConfiguration"));
const OAuthExampleSidebarExtension = React.lazy(() => import("./routes/OAuthExampleSidebar"));
const baseUrl = "";

function App() {
  return (
    <ErrorBoundary>
      <BulkPublishingProvider>
        <MarketplaceAppProvider ignoreRoutes={["/callback", "/ping"]} baseUrl={baseUrl}>
          <Routes>
            <Route path={`${baseUrl}`} element={<div>Nothing to show here</div>} />
            <Route path={`${baseUrl}/callback`} element={<OAuthCallback />} />
            <Route
              path={`/${baseUrl}/app-configuration`}
              element={
                <Suspense>
                  <AppConfigurationExtension />
                </Suspense>
              }
            />
            <Route element={<Layout />}>
              <Route element={<RefreshToken />}>
                <Route element={<RequireAuth />}>
                  <Route
                    path={`/${baseUrl}/oauth-example`}
                    element={
                      <Suspense>
                        <OAuthExampleSidebarExtension />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>
            </Route>
          </Routes>
        </MarketplaceAppProvider>
      </BulkPublishingProvider>
    </ErrorBoundary>
  );
}

export default App;

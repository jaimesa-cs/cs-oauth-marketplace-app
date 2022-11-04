import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Provider as BulkPublishingProvider } from "jotai";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MarketplaceAppProvider } from "./MarketplaceAppProvider";
import { OAuthCallback } from "./hooks/oauth";

/**
 * All the routes are Lazy loaded.
 * This will ensure the bundle contains only the core code and respective route bundle
 */
const CustomFieldExtension = React.lazy(() => import("./routes/CustomField"));
// const EntrySidebarExtension = React.lazy(() => import("./routes/EntrySidebar"));
const BulkPublishingSidebarExtension = React.lazy(() => import("./routes/BulkPublishingSidebar"));
const AppConfigurationExtension = React.lazy(() => import("./routes/AppConfiguration"));
const AssetSidebarExtension = React.lazy(() => import("./routes/AssetSidebar"));
const StackDashboardExtension = React.lazy(() => import("./routes/StackDashboard"));

function App() {
  return (
    <ErrorBoundary>
      <BulkPublishingProvider>
        <MarketplaceAppProvider ignoreRoutes={["/callback"]}>
          <Routes>
            <Route path="/" element={<div>Nothing to show here</div>} />
            <Route path="/callback" element={<OAuthCallback />} />
            <Route
              path="/custom-field"
              element={
                <Suspense>
                  <CustomFieldExtension />
                </Suspense>
              }
            />
            <Route
              path="/bulk-publishing"
              element={
                <Suspense>
                  <BulkPublishingSidebarExtension />
                </Suspense>
              }
            />
            <Route
              path="/app-configuration"
              element={
                <Suspense>
                  <AppConfigurationExtension />
                </Suspense>
              }
            />
            <Route
              path="/asset-sidebar"
              element={
                <Suspense>
                  <AssetSidebarExtension />
                </Suspense>
              }
            />
            <Route
              path="/stack-dashboard"
              element={
                <Suspense>
                  <StackDashboardExtension />
                </Suspense>
              }
            />
          </Routes>
        </MarketplaceAppProvider>
      </BulkPublishingProvider>
    </ErrorBoundary>
  );
}

export default App;

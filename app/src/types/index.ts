import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

export interface IBulkPublishingConfig extends KeyValueObj {}

export interface IBulkPublishingState {
  name: string;
  config?: IBulkPublishingConfig;
}

export interface KeyValueObj {
  [key: string]: any;
}

export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  location: any;
  appSdkInitialized: boolean;
}

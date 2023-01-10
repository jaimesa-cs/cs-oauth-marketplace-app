declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      CS_CM_TOKEN: string;
      CS_API_KEY: string;
      CS_API_HOST: string;
      CS_POST_REDIRECT_URI: string;
      CS_GET_REDIRECT_URI: string;
      DATA_STORAGE_PATH: string;
    }
  }
}
export {};

// import session from "express-session";

import { IUserTokenData } from "index";

declare module "express-session" {
  export interface SessionData {
    tokenData?: IUserTokenData;
    userId?: string;
    access_token?: string;
    views?: number;
  }
}

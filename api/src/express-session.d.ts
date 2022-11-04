// import session from "express-session";

import { IUserTokenData } from "index";

declare module "express-session" {
  export interface SessionData {
    tokenData?: IUserTokenData;
    access_token?: string;
    views?: number;
  }
}

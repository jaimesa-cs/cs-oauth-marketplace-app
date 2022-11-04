export interface IAccessTokenData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  location: string;
  organization_uid: string;
  authorization_type: string;
}

export interface IUserTokenData {
  access_token_data?: IAccessTokenData;
  created_at?: string;
}

export interface ITokensDictionary {
  [key: string]: IUserTokenData;
}

import { IAccessTokenData, ITokensDictionary, IUserTokenData } from "index";
import axios, { AxiosRequestConfig } from "axios";

import express from "express";

require("dotenv").config();

export class CsWithOAuthService {
  private DEFAULT_AXIOS_OPTIONS = (token: string, options: AxiosRequestConfig<any>): AxiosRequestConfig<any> => {
    const o: AxiosRequestConfig<any> = {
      ...options,
      headers: {
        authorization: `Bearer ${token}`,
        api_key: process.env.CS_API_KEY,
        ...options.headers,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    return o;
  };
  private async refreshToken(req: express.Request): Promise<IAccessTokenData | null> {
    try {
      if (!req.session.tokenData?.access_token_data?.refresh_token) {
        return null;
      }
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("client_id", process.env.CS_CLIENT_ID || "");
      params.append("client_secret", process.env.CS_CLIENT_SECRET || "");
      params.append("redirect_uri", process.env.CS_REDIRECT_URI || "");
      params.append("refresh_token", req.session.tokenData.access_token_data.refresh_token);

      // console.log("Params", params);
      const response = await axios.post("https://app.contentstack.com/apps-api/apps/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      req.session.access_token = response.data.access_token;
      req.session.tokenData.access_token_data = response.data;
      return response.data;
    } catch (e) {
      console.log("Error refreshing token", e);
      return null;
    }
  }

  public async initializeSession(req: express.Request, res: express.Response): Promise<void> {
    let data = null;
    try {
      const { code } = req.body;
      data = await this.exchange(code);
      const token = data.access_token;
      req.session.access_token = token;
      req.session.tokenData = {
        access_token_data: data,
        created_at: new Date().toISOString(),
      };

      res.json({ initialized: true, access_token: data.access_token });
    } catch (e) {
      res.json({ initialized: false, access_token: "error", error: data });
    }
  }

  public async isTokenActive(req: express.Request, res: express.Response): Promise<void> {
    res.json({ active: this.isActive(req) });
  }

  public async tokenData(req: express.Request, res: express.Response): Promise<void> {
    req.session.views = (req.session.views || 0) + 1;
    res.json({
      access_token: req.session.access_token,
      tokenData: req.session.tokenData,
      views: req.session.views,
    });
  }

  private isActive(req: express.Request): boolean {
    if (
      !req.session.access_token ||
      !req.session.tokenData ||
      !req.session.tokenData.created_at ||
      !req.session.tokenData.access_token_data
    ) {
      return false;
    }
    const now = new Date();

    const createdAt = new Date(req.session.tokenData.created_at);
    const expiresAt = new Date(createdAt.getTime() + req.session.tokenData.access_token_data.expires_in * 1000);
    const active = now < expiresAt;
    return active;
  }

  public async contenstackApiProxy(req: express.Request, res: express.Response): Promise<void> {
    if (!req.session.access_token) {
      res.status(404).send("Access token has not been initialized!");
      return;
    }
    if (!this.isActive(req)) {
      const refreshedTokenData = await this.refreshToken(req);
      if (refreshedTokenData && refreshedTokenData.access_token) {
        req.session.access_token = refreshedTokenData.access_token;
      }
    }
    const url = req.originalUrl;
    const newUrl = `${process.env.CS_API_HOST}${url.replace("/api/proxy", "")}`;
    // console.log("URL: ", newUrl);
    const options: AxiosRequestConfig<any> = this.DEFAULT_AXIOS_OPTIONS(req.session.access_token, {
      method: req.method,
      data: req.body,
      url: newUrl,
    });
    console.log(
      "🚀 ~ file: cs-with-oauth-service.ts ~ line 116 ~ CsWithOAuthService ~ contenstackApiProxy ~ options",
      options
    );
    axios(options)
      .then((response) => {
        // console.log("Response.data", response.data);
        res.send(response.data);
      })
      .catch((error) => {
        // console.log("error", error);
        res.status(500).send(
          JSON.stringify({
            error: "Error calling Contentstack's API",
            details: {
              url: newUrl,
              data: req.body,
              error: error.response.data,
            },
          })
        );
      });
  }

  private async exchange(code: string): Promise<IAccessTokenData> {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.CS_CLIENT_ID || "");
    params.append("client_secret", process.env.CS_CLIENT_SECRET || "");
    params.append("redirect_uri", process.env.CS_REDIRECT_URI || "");
    params.append("code", code);

    try {
      const response = await axios.post("https://app.contentstack.com/apps-api/apps/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data;
    } catch (errorResponse: any) {
      return errorResponse.response.data;
    }
  }
}

import { CsWithOAuthService } from "@service/cs-oauth-service";
import express from "express";
import { Inject } from "typescript-ioc";

export class CsWithOAuthController {
  private csWithOAuthService: CsWithOAuthService;

  constructor(@Inject csWithoauthService: CsWithOAuthService) {
    this.csWithOAuthService = csWithoauthService;
  }

  public async initializeSession(req: express.Request, res: express.Response, redirect_uri: string): Promise<void> {
    this.csWithOAuthService.exchangeCode(req, res, redirect_uri);
  }

  public async refreshToken(req: express.Request, res: express.Response): Promise<void> {
    this.csWithOAuthService.refreshToken(req, res);
  }
}

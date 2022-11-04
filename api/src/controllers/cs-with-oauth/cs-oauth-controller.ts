import { CsWithOAuthService } from "@service/cs-with-oauth-service";
import express from "express";
import { Inject } from "typescript-ioc";

export class CsWithOAuthController {
  private csWithOAuthService: CsWithOAuthService;

  constructor(@Inject csWithoauthService: CsWithOAuthService) {
    this.csWithOAuthService = csWithoauthService;
  }

  public async initializeSession(req: express.Request, res: express.Response): Promise<void> {
    this.csWithOAuthService.initializeSession(req, res);
  }

  public async isTokenActive(req: express.Request, res: express.Response): Promise<void> {
    this.csWithOAuthService.isTokenActive(req, res);
  }
  public async contenstackApiProxy(req: express.Request, res: express.Response): Promise<void> {
    this.csWithOAuthService.contenstackApiProxy(req, res);
  }

  //!TODO: Remove in production
  public async getTokens(req: express.Request, res: express.Response): Promise<void> {
    this.csWithOAuthService.tokenData(req, res);
  }
}

import { Container } from "typescript-ioc";
import { CsWithOAuthController } from "./cs-oauth-controller";
import express from "express";

const router = express.Router();

const csWithOAuthController = Container.get(CsWithOAuthController);

router.post(`/exchange-code`, (req, res) => {
  csWithOAuthController.initializeSession(req, res, process.env.CS_POST_REDIRECT_URI);
});

router.get(`/exchange-code`, (req, res) => {
  csWithOAuthController.initializeSession(req, res, process.env.CS_GET_REDIRECT_URI);
});

router.post(`/refresh-token`, (req, res) => {
  csWithOAuthController.refreshToken(req, res);
});

export { router as csWithOauthRouter };

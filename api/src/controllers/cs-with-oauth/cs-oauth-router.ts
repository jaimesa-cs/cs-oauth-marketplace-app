import { Container } from "typescript-ioc";
import { CsWithOAuthController } from "./cs-oauth-controller";
import express from "express";

const router = express.Router();

const csWithOAuthController = Container.get(CsWithOAuthController);

router.get(`/is-token-active`, (req, res) => {
  csWithOAuthController.isTokenActive(req, res);
});

router.post(`/initialize-session`, (req, res) => {
  csWithOAuthController.initializeSession(req, res);
});

//!TODO: Remove in production
// router.get(`/tokens`, (req, res) => {
//   csWithOAuthController.getTokens(req, res);
// });

router.all(`/proxy*`, (req, res) => {
  csWithOAuthController.contenstackApiProxy(req, res);
});

export { router as csWithOauthRouter };

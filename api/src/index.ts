import "module-alias/register";

import cookieParser from "cookie-parser";
import cors from "cors";
import { csWithOauthRouter } from "./controllers/cs-with-oauth";
import express from "express";
import http from "http";
import session from "express-session";

// import * as fs from "fs";

// import https from "https";

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/api", csWithOauthRouter);

const port = process.env.PORT; // default port to listen
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

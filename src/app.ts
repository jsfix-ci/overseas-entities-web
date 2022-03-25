import express from "express";
import cookieParser from 'cookie-parser';
import Redis from 'ioredis';
import * as nunjucks from "nunjucks";
import * as path from "path";
import {
  SessionStore,
  SessionMiddleware
} from '@companieshouse/node-session-handler';

import * as config from "./config";
import { logger } from "./utils/logger";
import router from "./routes";

const app = express();

// set some app variables from the environment
app.set("port", config.PORT);
app.set("dev", config.NODE_ENV === "development");

// set up the template engine
const nunjucksEnv = nunjucks.configure([
  "views",
  "node_modules/govuk-frontend/",
  "node_modules/govuk-frontend/components",
], {
  autoescape: true,
  express: app,
});
nunjucksEnv.addGlobal("CDN_HOST", config.CDN_HOST);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const cookieConfig = { cookieName: '__SID', cookieSecret: config.COOKIE_SECRET, cookieDomain: config.COOKIE_DOMAIN };
const sessionStore = new SessionStore(new Redis(`redis://${config.CACHE_SERVER}`));
app.use(SessionMiddleware(cookieConfig, sessionStore));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// apply our default router to /
app.use("/", router);

logger.info("Register an overseas entity has started");
export default app;
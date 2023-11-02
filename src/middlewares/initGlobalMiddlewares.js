import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initSwagger } from "./initSwagger";
import { logMiddleware } from "./logMiddleware";

/**
 * @param {express.Express} app
 */
export function initGlobalMiddlewares(app) {
  app.use(logMiddleware);
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  initSwagger(app);
}

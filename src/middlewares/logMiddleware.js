import qs from "querystring";
import express from "express";
import { log } from "helpers";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export function logMiddleware(req, res, next) {
  const start = new Date().getTime();

  res.on("finish", () => {
    const end = new Date().getTime();

    log({
      path: req.path,
      query: qs.encode(/** @type {qs.ParsedUrlQueryInput} */ (req.query)),
      method: req.method,
      status: res.statusCode,
      useragent: req.headers["user-agent"],
      ip: req.ip,
      latency: (end - start) / 1000,
    });
  });

  next();
}

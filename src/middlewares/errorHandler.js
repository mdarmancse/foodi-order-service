import express from "express";
import { sendError } from "helpers";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { FileTypeError } from "./storage";

/**
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next

 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof multer.MulterError || err instanceof FileTypeError) {
    sendError(res, {
      status: StatusCodes.BAD_REQUEST,
      message: err.message,
    });
    return;
  }
  sendError(res, {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Sorry, Something went wrong!",
  });
}

// @ts-nocheck
import asyncHandler from "express-async-handler";
import { sendData, sendPage } from "helpers";
import { StatusHistory } from "models";

/**
 * Get All Status Histories
 */
export const getStatusHistories = asyncHandler(async (req, res) => {
  const results = await StatusHistory.getPage(req);
  sendPage(res, results);
});

/**
 * Get Order Status Histories
 */
export const getOrderStatusHistories = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await StatusHistory.find({ orderId: id });
  sendData(res, results);
});

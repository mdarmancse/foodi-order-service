// @ts-nocheck
import asyncHandler from "express-async-handler";
import { sendData, sendPage } from "helpers";
import { AmountThreshold } from "models";
import { amountThreshold } from "../config/rmqConfig";
import * as rabbitMQ from "../helpers/rabbitMQueue/rabbitMQueue";

/**
 * Get All Amount Thresholds
 */
export const getAmountThresholds = asyncHandler(async (req, res) => {
  const results = await AmountThreshold.getPage(req);
  sendPage(res, results);
});

/**
 * Create Amount Threshold
 */
export const createAmountThreshold = asyncHandler(async (req, res) => {
  const results = await AmountThreshold.create({
    ...req.body,
    isActive: true,
    createdBy: req.user.id,
    deletedAt: null,
  });

  rabbitMQ.publish(
    amountThreshold.EXCHANGE_KEY.foodi_exchange,
    amountThreshold.QUEUE.amount_threshold_add_queue,
    amountThreshold.ROUTING_KEY.amount_threshold_add,
    results,
  );

  sendData(res, results);
});

/**
 * Update Amount Threshold
 */
export const updateAmountThreshold = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await AmountThreshold.findByIdAndUpdate(
    id,
    { ...req.body, updatedBy: req.user.id },
    {
      new: true,
    },
  );

  rabbitMQ.publish(
    amountThreshold.EXCHANGE_KEY.foodi_exchange,
    amountThreshold.QUEUE.amount_threshold_edit_queue,
    amountThreshold.ROUTING_KEY.amount_threshold_edit,
    results,
  );

  sendData(res, results);
});

/**
 * Amount Threshold Details
 */
export const getAmountThresholdDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await AmountThreshold.findById(id);
  sendData(res, results);
});

/**
 * Delete Amount Threshold
 */
export const deleteAmountThreshold = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await AmountThreshold.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    {
      new: true,
    },
  );
  sendData(res, results);
});

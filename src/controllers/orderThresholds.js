// @ts-nocheck
import asyncHandler from "express-async-handler";
import { sendData, sendPage } from "helpers";
import { OrderThreshold } from "models";

import * as rabbitMQ from "../helpers/rabbitMQueue/rabbitMQueue";
import { orderThreshold } from "../config/rmqConfig";

/**
 * Get All Order Thresholds
 */
export const getOrderThresholds = asyncHandler(async (req, res) => {
  const results = await OrderThreshold.getPage(req);
  sendPage(res, results);
});

/**
 * Create Order Threshold
 */
export const createOrderThreshold = asyncHandler(async (req, res) => {
  const results = await OrderThreshold.create({
    ...req.body,
    isActive: true,
    createdBy: req.user.id,
    deletedAt: null,
  });

  rabbitMQ.publish(
    orderThreshold.EXCHANGE_KEY.foodi_exchange,
    orderThreshold.QUEUE.order_threshold_add_queue,
    orderThreshold.ROUTING_KEY.order_threshold_add,
    results,
  );

  sendData(res, results);
});

/**
 * Update Order Threshold
 */
export const updateOrderThreshold = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await OrderThreshold.findByIdAndUpdate(
    id,
    { ...req.body, updatedBy: req.user.id },
    {
      new: true,
    },
  );

  rabbitMQ.publish(
    orderThreshold.EXCHANGE_KEY.foodi_exchange,
    orderThreshold.QUEUE.order_threshold_edit_queue,
    orderThreshold.ROUTING_KEY.order_threshold_edit,
    results,
  );

  sendData(res, results);
});

/**
 * Order Threshold Details
 */
export const getOrderThresholdDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await OrderThreshold.findById(id);
  sendData(res, results);
});

/**
 * Delete Order Threshold
 */
export const deleteOrderThreshold = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await OrderThreshold.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    {
      new: true,
    },
  );
  sendData(res, results);
});

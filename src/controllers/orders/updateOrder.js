// @ts-nocheck
import asyncHandler from "express-async-handler";
import { Order, StatusHistory } from "../../models";
import { sendData } from "helpers";
import { paymentStatus } from "../../config/rmqConfig";
import * as rabbitMQ from "../../helpers/rabbitMQueue/rabbitMQueue";

/**
 * Order Update
 */
export const orderUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { orderStatus, riderId } = req.body;
  const results = await Order.findByIdAndUpdate(
    id,
    {
      ...req.body,
      updatedBy: req.user.id,
    },
    {
      new: true,
    },
  );

  // Status History Create
  if (results) {
    await StatusHistory.create({
      orderId: id,
      branchId: results.branchId,
      riderId: riderId ? riderId : 0,
      status: orderStatus,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });
  }

  sendData(res, results);
});

/**
 * Payment Status Update
 */
export const paymentStatusUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await Order.findByIdAndUpdate(
    id,
    { paymentStatus: req.body.paymentStatus, updatedBy: req.user.id },
    {
      new: true,
    },
  );

  rabbitMQ.publish(
    paymentStatus.EXCHANGE_KEY.foodi_exchange,
    paymentStatus.QUEUE.payment_status_edit_queue,
    paymentStatus.ROUTING_KEY.payment_status_edit,
    results,
  );

  sendData(res, results);
});

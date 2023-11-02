// @ts-nocheck
import asyncHandler from "express-async-handler";
import { Order, StatusHistory } from "../../models";
import { ErrorLog, log, sendData, WarningLog } from "helpers";
import * as rabbitMQ from "../../helpers/rabbitMQueue/rabbitMQueue";
import { riderAccept } from "../../config/rmqConfig";
import {
  insertUserWiseBranchOrderAsync,
  orderDeliveredByRiderAsync,
  setOrderDeliveredAsync,
  userRewardPointAsync,
} from "../../grpc";
import { toTimestamp } from "helpers/grpcToDate";

/**
 * Order Rider Accept
 */
export const orderRiderAccept = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { orderStatus, riderId } = req.body;

  let updateFields = {};
  if (req.file?.key) {
    updateFields = { ...updateFields, proofImage: req.file.key };
  }

  const results = await Order.findByIdAndUpdate(
    id,
    {
      ...updateFields,
      orderStatus,
      riderId,
      isDelivered:
        orderStatus === "delivered"
          ? true
          : orderStatus === "not_delivered"
          ? false
          : false,
      inProgress:
        orderStatus === "delivered"
          ? false
          : orderStatus === "not_delivered"
          ? false
          : true,
      deliveredAt: orderStatus === "delivered" ? new Date() : null,
      updatedBy: req.user.id,
    },
    {
      new: true,
    },
  );

  /**
   * Trigger and Update User Reward Point on User Accounting Service
   * Trigger and Update Rider info on Rider Service
   * Trigger Rider Auto Assigner for rider free status
   * Trigger Restaurant Service
   */

  if (results.orderStatus === "delivered" && results) {
    const { _id, userId, branchId, totalAmount, deliveredAt } = results;

    const allPromise = Promise.allSettled([
      userRewardPointAsync({
        userId,
        totalAmount,
        orderId: _id,
      }),
      orderDeliveredByRiderAsync({
        rider_id: riderId,
        order_id: _id,
        delivered_at: toTimestamp(results.deliveredAt.toISOString()),
      }),
      setOrderDeliveredAsync({
        riderId: riderId,
        orderId: _id,
        deliveredAt: toTimestamp(results.deliveredAt.toISOString()),
      }),
      insertUserWiseBranchOrderAsync({
        BranchId: branchId,
        UserId: userId,
        OrderId: _id,
      }),
    ]);
    try {
      await allPromise.then((results) => {
        results.map((result) => {
          if (result.status === "rejected") {
            log({
              message: result.reason,
              level: WarningLog,
              caller: "orderRiderAccept",
            });
          }
        });
      });
    } catch (error) {
      log({
        message: error.message,
        level: ErrorLog,
        caller: "orderRiderAccept",
      });
    }
  }

  // Status History Create
  if (results && orderStatus) {
    await StatusHistory.create({
      orderId: id,
      branchId: results.branchId,
      riderId: riderId ? riderId : 0,
      status: orderStatus,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });
  }

  // @TODO Trigger notification service
  if (orderStatus === "rider_arrived_at_restaurant") {
  }

  rabbitMQ.publish(
    riderAccept.EXCHANGE_KEY.foodi_exchange,
    riderAccept.QUEUE.rider_accept_edit_queue,
    riderAccept.ROUTING_KEY.rider_accept_edit,
    results,
  );

  sendData(res, results);
});

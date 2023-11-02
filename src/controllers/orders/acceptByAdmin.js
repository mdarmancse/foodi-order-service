// @ts-nocheck
import asyncHandler from "express-async-handler";
import { Order, StatusHistory } from "../../models";
import { ErrorLog, log, sendData, WarningLog } from "helpers";
import * as rabbitMQ from "../../helpers/rabbitMQueue/rabbitMQueue";
import { adminAccept } from "../../config/rmqConfig";
import { riderManuallyAssignedAsync } from "../../grpc";
import { toDate, toTimestamp } from "helpers/grpcToDate";

/**
 * Order Admin Accept
 */
export const orderAdminAccept = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { orderStatus, riderId, isVerified } = req.body;

  const results = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
      isVerified:
        isVerified && isVerified === true
          ? true
          : !isVerified && isVerified === false
          ? false
          : true,
      riderId: riderId ? riderId : null,
      isDelivered:
        orderStatus === "delivered"
          ? true
          : orderStatus === "cancelled"
          ? false
          : orderStatus === "not_delivered"
          ? false
          : false,
      inProgress:
        orderStatus === "delivered"
          ? false
          : orderStatus === "cancelled"
          ? false
          : orderStatus === "not_delivered"
          ? false
          : true,
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

  // Trigger Rider Auto Assigner Service to inform about this rider
  // @TODO Trigger notification service
  if (riderId && results) {
    const allPromise = Promise.allSettled([
      riderManuallyAssignedAsync({
        orderId: id,
        orderPlacedAt: toTimestamp(results.createdAt.toISOString()),
        branchId: results.branchId,
        riderId: results.riderId,
      }),
    ]);
    try {
      await allPromise.then((results) => {
        results.map((result) => {
          if (result.status === "rejected") {
            log({
              message: result.reason,
              level: WarningLog,
              caller: "orderAdminAccept",
            });
          }
        });
      });
    } catch (error) {
      log({
        message: error.message,
        level: ErrorLog,
        caller: "orderAdminAccept",
      });
    }
  }

  rabbitMQ.publish(
    adminAccept.EXCHANGE_KEY.foodi_exchange,
    adminAccept.QUEUE.admin_accept_edit_queue,
    adminAccept.ROUTING_KEY.admin_accept_edit,
    results,
  );

  sendData(res, results);
});

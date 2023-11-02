// @ts-nocheck
import asyncHandler from "express-async-handler";
import { Order, StatusHistory } from "../../models";
import { ErrorLog, log, sendData } from "helpers";
import * as rabbitMQ from "../../helpers/rabbitMQueue/rabbitMQueue";
import { restaurantAccept } from "../../config/rmqConfig";
import { startAssigningAsync } from "../../grpc";
import { toTimestamp } from "helpers/grpcToDate";

/**
 * Order Restaurant Accept
 */
export const orderRestaurantAccept = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { orderStatus } = req.body;
  const results = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
      updatedBy: req.user.id,
    },
    {
      new: true,
    },
  );

  // Status History Create
  await StatusHistory.create({
    orderId: id,
    branchId: results.branchId,
    riderId: 0,
    status: orderStatus,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  });

  // Trigger Rider Auto Assigner Service for Assign Rider
  if (orderStatus === "restaurant_accepted") {
    try {
      const response = await startAssigningAsync({
        orderId: id,
        orderPlacedAt: toTimestamp(results.createdAt.toISOString()),
        branchId: results.branchId,
        branchLocation: {
          long: results.branchLong,
          lat: results.branchLat,
        },
        branchZoneId: results.branchZoneId,
        deliveryLocation: {
          long: results.deliveryLong,
          lat: results.deliveryLat,
        },
        deliveryZoneId: results.deliveryZoneId,
        deliveryDistance: results.deliveryDistance,
      });

      if (!response.status) {
        await Order.findByIdAndUpdate(
          id,
          {
            orderStatus: "rider_not_assigned",
            updatedBy: req.user.id,
          },
          {
            new: true,
          },
        );
        // Status History Create
        await StatusHistory.create({
          orderId: id,
          branchId: results.branchId,
          riderId: 0,
          status: "rider_not_assigned",
          createdBy: req.user.id,
          updatedBy: req.user.id,
        });
      }
    } catch (error) {
      log({
        message: error.message,
        level: ErrorLog,
        caller: "orderRestaurantAccept",
      });

      await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: "rider_not_assigned",
          updatedBy: req.user.id,
        },
        {
          new: true,
        },
      );
      // Status History Create
      await StatusHistory.create({
        orderId: id,
        branchId: results.branchId,
        riderId: 0,
        status: "rider_not_assigned",
        createdBy: req.user.id,
        updatedBy: req.user.id,
      });
    }
  }

  rabbitMQ.publish(
    restaurantAccept.EXCHANGE_KEY.foodi_exchange,
    restaurantAccept.QUEUE.restaurant_accept_edit_queue,
    restaurantAccept.ROUTING_KEY.restaurant_accept_edit,
    results,
  );

  sendData(res, results);
});

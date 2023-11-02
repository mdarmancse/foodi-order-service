// @ts-nocheck
import asyncHandler from "express-async-handler";
import {
  Order,
  StatusHistory,
  OrderThreshold,
  AmountThreshold,
} from "../../models";
import { sendData } from "helpers";
import * as rabbitMQ from "../../helpers/rabbitMQueue/rabbitMQueue";
import { order, preOrder } from "../../config/rmqConfig";

/**
 * Create Order
 */
export const createOrder = asyncHandler(async (req, res) => {
  const {
    totalAmount,
    branchZoneId,
    deliveryZoneId,
    isPreOrder,
    preOrderDate,
    branchId,
  } = req.body;
  let isVerified = true;

  // User Undelivered Order Count
  const userUndeliveredOrder = await Order.find({
    userId: req.user.id,
    inProgress: { $eq: true },
  }).count();

  // Order Threshold Checking
  const orderThresholdInfo = OrderThreshold.findOne({
    isActive: true,
    deletedAt: null,
  });
  const orderThreshold = orderThresholdInfo.thershold;
  if (orderThreshold >= userUndeliveredOrder) {
    isVerified = false;
  }

  // Threshold Amount Checking
  const amountThresholdInfo = AmountThreshold.findOne({
    zoneId: deliveryZoneId,
    deletedAt: null,
  });
  const amountThreshold = amountThresholdInfo.amount;
  if (totalAmount > amountThreshold) {
    isVerified = false;
  }

  let orders = [];

  if (isPreOrder) {
    // Pre orders
    preOrderDate.map(async (date) => {
      orders = await Order.create({
        ...req.body,
        isVerified: false,
        isDelivered: false,
        inProgress: true,
        orderStatus: "placed",
        preOrderDate: date,
        orderId: `Z${branchZoneId}B${branchId}D${new Date().getTime()}`,
      });

      // RMQ Publish Pre Order
      rabbitMQ.publish(
        preOrder.EXCHANGE_KEY.foodi_exchange,
        preOrder.QUEUE.pre_order_add_queue,
        preOrder.ROUTING_KEY.pre_order_add,
        orders,
      );

      // Status History Create
      if (orders) {
        await StatusHistory.create({
          orderId: orders._id,
          branchId: orders.branchId,
          riderId: 0,
          status: "placed",
          createdBy: req.user.id,
          updatedBy: req.user.id,
        });
      }
    });
  } else {
    // Regular Order
    orders = await Order.create({
      ...req.body,
      isVerified,
      isDelivered: false,
      inProgress: true,
      orderStatus: "placed",
      preOrderDate: null,
      orderId: `Z${branchZoneId}B${branchId}D${new Date().getTime()}`,
    });

    // RMQ Publish Order
    rabbitMQ.publish(
      order.EXCHANGE_KEY.foodi_exchange,
      order.QUEUE.order_add_queue,
      order.ROUTING_KEY.order_add,
      orders,
    );

    // Status History Create
    if (orders) {
      await StatusHistory.create({
        orderId: orders._id,
        branchId: orders.branchId,
        riderId: 0,
        status: "placed",
        createdBy: req.user.id,
        updatedBy: req.user.id,
      });
    }
  }

  // @TODO Trigger notification service

  sendData(res, orders);
});

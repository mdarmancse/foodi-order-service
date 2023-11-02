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
import { order as orderRMQ } from "../../config/rmqConfig";

/**
 * Place Order
 */
export const placeOrder = asyncHandler(async (req, res) => {
  let isVerified = true;

  // Order Info
  const order = await Order.findById(req.params.id).select("-_id");
  const {
    totalAmount,
    branchZoneId,
    deliveryZoneId,
    isPreOrder,
    preOrderDate,
    branchId,
    userId,
  } = order;

  let response = [];

  if (isPreOrder) {
    const orderDates = preOrderDate;
    const orderDateFristDate = orderDates.splice(0, 1);

    // Pre orders
    if (orderDates.length > 0) {
      orderDates.map(async (date) => {
        response = await Order.create({
          ...order.toObject(),
          isVerified: false,
          isDelivered: false,
          inProgress: false,
          orderStatus: "placed",
          preOrderDate: date,
          orderId: `Z${branchZoneId}B${branchId}D${new Date().getTime()}`,
        });
        // Status History Create
        if (response) {
          await StatusHistory.create({
            orderId: response._id,
            branchId: response.branchId,
            riderId: 0,
            status: "placed",
            createdBy: req.user.id,
            updatedBy: req.user.id,
          });
        }

        rabbitMQ.publish(
          orderRMQ.EXCHANGE_KEY.FOODI_EXCHANGE,
          orderRMQ.QUEUE.ORDER_ADD_QUEUE,
          orderRMQ.ROUTING_KEY.ORDER_ADD,
          response,
        );
      });
    }
    if (orderDateFristDate.length > 0) {
      response = await Order.findByIdAndUpdate(
        req.params.id,
        {
          isVerified: false,
          isDelivered: false,
          inProgress: false,
          orderStatus: "placed",
          preOrderDate: orderDateFristDate[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true },
      );

      // Status History Create
      if (response) {
        await StatusHistory.create({
          orderId: response._id,
          branchId: response.branchId,
          riderId: 0,
          status: "placed",
          createdBy: req.user.id,
          updatedBy: req.user.id,
        });
      }

      rabbitMQ.publish(
        orderRMQ.EXCHANGE_KEY.FOODI_EXCHANGE,
        orderRMQ.QUEUE.ORDER_ADD_QUEUE,
        orderRMQ.ROUTING_KEY.ORDER_ADD,
        response,
      );
    }
  } else {
    // Regular Order

    // User Undelivered Order Count
    const userUndeliveredOrder = await Order.find({
      userId: userId,
      inProgress: { $eq: true },
    }).count();

    // Order Threshold Checking
    const orderThresholdInfo = await OrderThreshold.findOne({
      isActive: true,
      deletedAt: null,
    });

    if (
      ((orderThresholdInfo && orderThresholdInfo.threshold) || 0) >=
      userUndeliveredOrder
    ) {
      isVerified = false;
    }

    // Threshold Amount Checking
    const amountThresholdInfo = await AmountThreshold.findOne({
      zoneId: deliveryZoneId,
      isActive: true,
      deletedAt: null,
    });

    if (
      totalAmount > ((amountThresholdInfo && amountThresholdInfo.amount) || 0)
    ) {
      isVerified = false;
    }

    response = await Order.findByIdAndUpdate(
      req.params.id,
      {
        isVerified,
        isDelivered: false,
        inProgress: isVerified ? true : false,
        orderStatus: "placed",
        preOrderDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true },
    );

    // Status History Create
    if (response) {
      await StatusHistory.create({
        orderId: response._id,
        branchId: response.branchId,
        riderId: 0,
        status: "placed",
        createdBy: req.user.id,
        updatedBy: req.user.id,
      });
    }

    rabbitMQ.publish(
      orderRMQ.EXCHANGE_KEY.FOODI_EXCHANGE,
      orderRMQ.QUEUE.ORDER_ADD_QUEUE,
      orderRMQ.ROUTING_KEY.ORDER_ADD,
      response,
    );
  }

  // @TODO Trigger notification service

  sendData(res, response);
});

// @ts-nocheck
import asyncHandler from "express-async-handler";
import { Order } from "../../models";
import { sendData } from "helpers";

/**
 * Add To Card
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { branchZoneId, branchId } = req.body;

  const orders = await Order.create({
    ...req.body,
    isVerified: false,
    isDelivered: false,
    inProgress: false,
    orderStatus: "cart",
    orderId: `Z${branchZoneId}B${branchId}D${new Date().getTime()}`,
  });

  sendData(res, orders);
});

/**
 * Update To Cart
 */
export const updateToCart = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const results = await Order.findByIdAndUpdate(
    id,
    {
      ...req.body,
      isVerified: false,
      isDelivered: false,
      inProgress: false,
      orderStatus: "cart",
    },
    { new: true },
  );

  sendData(res, results);
});

// @ts-nocheck
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Order } from "../models";
import Decimal from "decimal.js";
import { pick } from "lodash";
import { ErrorLog, log, sendData, WarningLog } from "helpers";
import { getBranchInfoForInvoiceAsync, getUserProfileAsync } from "../grpc";

/**
 * Get User Invoice
 */
const userGet = [
  "orderId",
  "userId",
  "branchId",
  "deliveryAddress",
  "paymentMethod",
  "totalAmount",
  "menus",
  "vat",
  "supplementaryDuty",
  "discountAmount",
  "deliveryCharge",
];

export const getUserInvoice = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findOrder = await Order.findById(id);

  // get user info from user accounting service
  // and get branch info from restaurant service
  let userProfile;
  let branchInfo;

  const allPromise = Promise.allSettled([
    getUserProfileAsync(findOrder.userId),
    getBranchInfoForInvoiceAsync(findOrder.branchId),
  ]);

  try {
    await allPromise.then((results) => {
      results.map((result, index) => {
        if (result.status === "rejected") {
          log({
            message: result.reason,
            level: WarningLog,
            caller: "getUserInvoice",
          });
        }
        if (result.status === "fulfilled") {
          if (index === 0) {
            userProfile = result.value;
          }
          if (index === 1) {
            branchInfo = result.value;
          }
        }
      });
    });
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "getUserInvoice",
    });
  }

  if (!findOrder) {
    res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      message: "Order not found",
    });
    return;
  }

  const results = {
    ...pick(findOrder.toObject(), userGet),
    branchInfo: branchInfo,
    userInfo: userProfile,
    orderDate: findOrder.createdAt.toISOString(),
  };

  sendData(res, results);
});

const riderGet = [
  "orderId",
  "userId",
  "branchId",
  "deliveryAddress",
  "paymentMethod",
  "menuTotalAmount",
  "menus",
  "vat",
  "supplementaryDuty",
  "discountAmount",
  "deliveryCharge",
  "riderDeliveryCharge",
  "foodiCommissionRateInPercent",
];

/**
 * Get Rider Invoice
 */
export const getRiderInvoice = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const findOrder = await Order.findById(id);

  if (!findOrder) {
    res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      message: "Order not found",
    });
    return;
  }

  const DTotalAmount = new Decimal(findOrder.totalAmount);
  const DFoodiCommissionAmount = new Decimal(findOrder.foodiCommissionAmount);
  const restaurantPayable = DTotalAmount.minus(DFoodiCommissionAmount);
  const foodiPayable = DTotalAmount.minus(restaurantPayable);

  // get user info from user accounting service
  // and get branch info from restaurant service
  let userProfile;
  let branchInfo;

  const allPromise = Promise.allSettled([
    getUserProfileAsync(findOrder.userId),
    getBranchInfoForInvoiceAsync(findOrder.branchId),
  ]);

  try {
    await allPromise.then((results) => {
      results.map((result, index) => {
        if (result.status === "rejected") {
          log({
            message: result.reason,
            level: WarningLog,
            caller: "getRiderInvoice",
          });
        }
        if (result.status === "fulfilled") {
          if (index === 0) {
            userProfile = result.value;
          }
          if (index === 1) {
            branchInfo = result.value;
          }
        }
      });
    });
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "getRiderInvoice",
    });
  }

  const results = {
    ...pick(findOrder.toObject(), riderGet),
    branchInfo: branchInfo,
    userInfo: userProfile,
    orderDate: findOrder.createdAt.toISOString(),
    restaurantPayable,
    foodiPayable,
  };

  sendData(res, results);
});

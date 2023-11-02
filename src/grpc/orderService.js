// @ts-nocheck
// import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { Order, StatusHistory } from "../models";
import { StatusCodes } from "http-status-codes";
import { ErrorLog, log } from "../helpers";

/**
 * Update Payment Status
 */
export const updatePaymentStatus = async (call, callback) => {
  const id = call.request.orderId;

  try {
    const results = await Order.findByIdAndUpdate(
      id,
      { paymentStatus: call.request.paymentStatus },
      { new: true },
    );
    callback(null, {
      status: results ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: results ? "Success" : "Data not found!",
    });
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "updatePaymentStatus",
    });

    callback(null, {
      status: StatusCodes.BAD_REQUEST,
      message: "Something went wrong!",
    });
  }
};

/**
 * Rider Accepted
 */
export const riderAccepted = async (call, callback) => {
  const { orderId, riderId, riderName, riderDeliveryCharge } = call.request;

  try {
    const results = await Order.findByIdAndUpdate(
      orderId,
      {
        riderId,
        riderName,
        riderDeliveryCharge,
        orderStatus: "rider_assigned",
      },
      { new: true },
    );

    // Status History Create
    if (results) {
      await StatusHistory.create({
        orderId: orderId,
        branchId: results.branchId,
        riderId,
        status: "rider_assigned",
        createdBy: 0,
        updatedBy: 0,
      });
    }

    callback(null, {
      status: results ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: results ? "Success" : "Data not found!",
    });
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "riderAccepted",
    });

    callback(null, {
      status: StatusCodes.BAD_REQUEST,
      message: "Something went wrong!",
    });
  }
};

/**
 * Rider Assignment Failed
 */
export const riderAssignmentFailed = async (call, callback) => {
  const id = call.request.orderId;
  const cause = call.request.cause;

  try {
    const results = await Order.findByIdAndUpdate(
      id,
      { orderStatus: "rider_not_assigned" },
      { new: true },
    );

    // Status History Create
    if (results) {
      await StatusHistory.create({
        orderId: id,
        branchId: results.branchId,
        riderId: 0,
        status: "rider_not_assigned",
        cause,
        createdBy: 0,
        updatedBy: 0,
      });
    }

    // @TODO Trigger notification service

    callback(null, {
      status: results ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: results ? "Success" : "Data not found!",
    });
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "riderAssignmentFailed",
    });

    callback(null, {
      status: StatusCodes.BAD_REQUEST,
      message: "Something went wrong!",
    });
  }
};

/**
 * User List Between From And To Date In Success Order
 */
export const userListBetweenFromAndToDateInSuccessOrder = async (
  call,
  callback,
) => {
  const { fromDate, toDate } = call.request;

  try {
    const orders = await Order.find({
      deliveredAt: {
        $lte: DateTime.fromISO(toDate).endOf("day").toUTC().toISO(),
        $gte: DateTime.fromISO(fromDate).toUTC().toISO(),
      },
    });

    const userIds = orders.map((odr) => odr.userId).flat();

    callback(null, {
      status: userIds.length > 0 ? StatusCodes.OK : StatusCodes.NOT_FOUND,
      message: userIds.length > 0 ? "Success" : "User Not found!",
      userIds: Array.from(new Set(userIds)),
    });
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "userListBetweenFromAndToDateInSuccessOrder",
    });

    callback(null, {
      status: StatusCodes.BAD_REQUEST,
      message: "Something went wrong!",
      userIds: [],
    });
  }
};

/**
 * Get Order Threshold
 */
// export const getOrderThreshold = async (call, callback) => {
//   const results = await OrderThreshold.find(call.request);

//   // Verify JWT token from metadata
//   const token = call.metadata.get("authorization")[0];

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return callback(null, {
//         status: StatusCodes.UNAUTHORIZED,
//         message: "Invalid token",
//         data: null,
//       });
//     }

//     // Token is valid, continue processing the request
//     callback(null, {
//       status: StatusCodes.OK,
//       message: "Success",
//       data: results,
//     });
//   });
// };

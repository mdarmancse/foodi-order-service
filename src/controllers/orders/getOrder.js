// @ts-nocheck
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Order, StatusHistory } from "../../models";
import { sendData, sendPage } from "helpers";
import { DateTime } from "luxon";

/**
 * Get All Orders
 */
export const getOrders = asyncHandler(async (req, res) => {
  const results = await Order.getPage(req);
  sendPage(res, results);
});

/**
 * Order Details
 */
export const getOrderDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const results = await Order.findById(id);
  sendData(res, results);
});

/**
 * User order List
 */
export const getUserOrders = asyncHandler(async (req, res) => {
  const results = await Order.getUserPage(req);
  sendPage(res, results);
});

/**
 * Restaurant order List
 */
export const getRestaurantOrders = asyncHandler(async (req, res) => {
  const results = await Order.getRestaurantPage(req);
  sendPage(res, results);
});

/**
 * Restaurant Accepted order List
 */
export const getRestaurantAcceptedOrders = asyncHandler(async (req, res) => {
  const branchId = req.params.branchId;

  const acceptedOrders = await StatusHistory.find({
    branchId: Number(branchId),
    status: "restaurant_accepted",
  });
  const orderIds = acceptedOrders.map((d) => d.orderId).flat();

  const results = await Order.getRestaurantAcceptedOrdersPage(req, orderIds);

  sendPage(res, results);
});

/**
 * Restaurant Rejected order List
 */
export const getRestaurantRejectedOrders = asyncHandler(async (req, res) => {
  const branchId = req.params.branchId;

  const rejectedOrders = await StatusHistory.find({
    branchId: Number(branchId),
    status: "restaurant_rejected",
  });
  const orderIds = rejectedOrders.map((d) => d.orderId).flat();

  const results = await Order.getRestaurantRejectedOrdersPage(req, orderIds);

  sendPage(res, results);
});

/**
 * Rider order list
 */
export const getRiderOrders = asyncHandler(async (req, res) => {
  const riderId = req.params.riderId;
  const { orderStatus, fromDate, toDate } = req.query;

  let query = { riderId };

  if (fromDate && toDate) {
    query = {
      ...query,
      deliveredAt: {
        $lte: toDate,
        $gte: fromDate,
      },
    };
  }
  if (orderStatus) {
    query = {
      ...query,
      orderStatus,
    };
  }

  const results = await Order.find(query);
  sendData(res, results);
});

/**
 * Restaurant Lat Long list for specific time
 */
export const getRestaurantsLatLongWithZoneAndDateTime = asyncHandler(
  async (req, res) => {
    const { zoneIds, fromDateTime, toDateTime } = req.query;

    const results = await Order.find({
      branchZoneId: { $in: zoneIds },
      deliveredAt: {
        $lte: toDateTime, // DateTime.local().toISO(),
        $gte: fromDateTime, // DateTime.local().minus({ hours: 1 }).toISO(),
      },
    }).select("-_id branchLat branchLong");

    sendData(res, results);
  },
);

/**
 * Restaurant Performance
 */
export const getRestaurantOrdersPerformance = asyncHandler(async (req, res) => {
  const branchId = req.params.branchId;

  const results = await StatusHistory.aggregate([
    {
      $match: {
        branchId: Number(branchId),
        status: { $in: ["restaurant_rejected", "restaurant_accepted"] },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalOrder = results.reduce(
    (accumulator, currentValue) => accumulator + currentValue.count,
    0,
  );

  const totalAccept = results.filter((el) => el._id === "restaurant_accepted");
  const totalReject = results.filter((el) => el._id === "restaurant_rejected");

  const acceptanceRatio = (totalAccept[0].count / totalOrder) * 100;
  const cancelledRatio = (totalReject[0].count / totalOrder) * 100;

  sendData(res, { totalOrder, acceptanceRatio, cancelledRatio });
});

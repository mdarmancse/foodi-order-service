// @ts-nocheck
import express from "express";
import mongoose, { SchemaTypes } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { preparePaginationQuery } from "../helpers";
import { statusEnum } from "helpers";
import { v4 } from "uuid";
const { DateTime } = require("luxon");

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: SchemaTypes.UUID,
      default: v4,
    },
    orderId: {
      type: String,
    },
    userId: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    deliveryZoneId: {
      type: Number,
      required: true,
    },
    deliveryLat: {
      type: Number,
      required: true,
    },
    deliveryLong: {
      type: Number,
      required: true,
    },
    deliveryDistance: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
    },
    deliveryApartmentName: {
      type: String,
    },
    deliveryRoadOrFlatNumber: {
      type: String,
    },
    isItGift: {
      type: Boolean,
      default: false,
    },
    giftReceiverName: {
      type: String,
    },
    giftReceiverMobile: {
      type: String,
    },
    riderId: {
      type: Number,
      default: null,
    },
    riderName: {
      type: String,
    },
    branchId: {
      type: Number,
      require: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    branchZoneId: {
      type: Number,
      required: true,
    },
    branchLat: {
      type: Number,
      required: true,
    },
    branchLong: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: Number,
    },
    proofImage: {
      type: String,
    },
    orderStatus: {
      type: String,
      default: "placed",
      enum: statusEnum,
    },
    paymentStatus: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "DECLINED", "CANCELED"],
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
    },
    orderType: {
      type: String,
      default: "delivery",
      enum: ["delivery", "pickup", "dine_in"],
    },
    isDelivered: {
      type: Boolean,
      default: true,
    },
    inProgress: {
      type: Boolean,
      default: true,
    },
    promoCodeId: {
      type: Number,
    },
    promoCodeAmount: {
      type: SchemaTypes.Decimal128,
      default: 0,
      get: (value) => {
        return value?.toString();
      },
    },
    voucherId: {
      type: Number,
    },
    voucherAmount: {
      type: SchemaTypes.Decimal128,
      default: 0,
      get: (value) => {
        return value?.toString();
      },
    },
    walletAmount: {
      type: SchemaTypes.Decimal128,
      default: 0,
      get: (value) => {
        return value?.toString();
      },
    },
    vat: {
      type: SchemaTypes.Decimal128,
      default: 0,
      get: (value) => {
        return value?.toString();
      },
    },
    supplementaryDuty: {
      type: SchemaTypes.Decimal128,
      default: 0,
      get: (value) => {
        return value?.toString();
      },
    },
    discountAmount: {
      type: SchemaTypes.Decimal128,
      default: 0,
      get: (value) => {
        return value?.toString();
      },
    },
    deliveryCharge: {
      type: SchemaTypes.Decimal128,
      required: true,
      get: (value) => {
        return value?.toString();
      },
    },
    riderDeliveryCharge: {
      type: SchemaTypes.Decimal128,
      get: (value) => {
        return value?.toString();
      },
    },
    menuTotalAmount: {
      type: SchemaTypes.Decimal128,
      required: true,
      get: (value) => {
        return value?.toString();
      },
    },
    foodiCommissionRateInPercent: {
      type: Number,
    },
    foodiCommissionAmount: {
      type: SchemaTypes.Decimal128,
      default: 0,
      get: (value) => {
        return value?.toString();
      },
    },
    totalAmount: {
      type: SchemaTypes.Decimal128,
      required: true,
      get: (value) => {
        return value?.toString();
      },
    },
    riderPaidToRestaurant: {
      type: SchemaTypes.Decimal128,
      get: (value) => {
        return value?.toString();
      },
    },
    isCutleryNeeded: {
      type: Boolean,
      default: false,
    },
    isPreOrder: {
      type: Boolean,
      default: false,
    },
    preOrderDate: [
      {
        type: Date,
      },
    ],
    isThresholdCrossed: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deliveredAt: {
      type: Date,
    },
    avgDeliveryTime: {
      type: String,
    },
    highestRecipeTime: {
      type: String,
    },
    riderArrivedRestaurantAt: {
      type: String,
    },
    instruction: {
      type: String,
    },
    menus: [
      {
        menuId: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
        },
        price: {
          type: SchemaTypes.Decimal128,
          get: (value) => {
            return value?.toString();
          },
        },
        quantity: {
          type: Number,
          default: 0,
        },
        categoryId: {
          type: Number,
          required: true,
        },
        variation: {
          type: String,
        },
        addons: [
          {
            addonId: {
              type: Number,
            },
            name: {
              type: String,
            },
            price: {
              type: SchemaTypes.Decimal128,
              get: (value) => {
                return value?.toString();
              },
            },
            categoryId: {
              type: Number,
            },
          },
        ],
      },
    ],
  },
  {
    model: "Order",
    collection: "orders",
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
    id: false,
    versionKey: false,
  },
);

OrderSchema.plugin(mongoosePaginate);

OrderSchema.statics = {
  /**
   * @param {express.Request} req - Express request instance
   * @returns {Promise<Object>}
   */
  async getPage(req, filters = []) {
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [...filters, { orderStatus: { $ne: "cart" } }],
      searchables: ["orderId", "userId"],
      sortables: [
        "createdAt",
        "updatedAt",
        "userId",
        "branchId",
        "riderId",
        "branchZoneId",
        "deliveryZoneId",
      ],
      getFilterQueries: async (req) => {
        const {
          orderId,
          userId,
          branchId,
          riderId,
          branchZoneId,
          deliveryZoneId,
          orderStatus,
          orderType,
          paymentMethod,
          paymentStatus,
          isThresholdCrossed,
          isVerified,
          isPreOrder,
          isDelivered,
          isItGift,
          fromDate,
          toDate,
        } = req.query;

        const queries = [];

        if (orderId) {
          queries.push({ orderId });
        }
        if (userId) {
          queries.push({ userId });
        }
        if (branchId) {
          queries.push({ branchId });
        }
        if (riderId) {
          queries.push({ riderId });
        }
        if (fromDate && toDate) {
          queries.push({
            createdAt: {
              $lte: DateTime.fromISO(toDate).endOf("day").toUTC().toISO(),
              $gte: DateTime.fromISO(fromDate).toUTC().toISO(),
            },
          });
        }
        if (branchZoneId) {
          queries.push({ branchZoneId });
        }
        if (deliveryZoneId) {
          queries.push({ deliveryZoneId });
        }
        if (orderStatus) {
          queries.push({ orderStatus });
        }
        if (orderType) {
          queries.push({ orderType });
        }
        if (paymentMethod) {
          queries.push({ paymentMethod });
        }
        if (paymentStatus) {
          queries.push({ paymentStatus });
        }
        if (isThresholdCrossed) {
          queries.push({ isThresholdCrossed });
        }
        if (isVerified) {
          queries.push({ isVerified });
        }
        if (isPreOrder) {
          queries.push({ isPreOrder });
        }
        if (isDelivered) {
          queries.push({ isDelivered });
        }
        if (isItGift) {
          queries.push({ isItGift });
        }

        return queries;
      },
    });

    if ("paginate" in this && typeof this.paginate === "function") {
      return this.paginate(query, {
        ...rest,
      });
    }

    return {};
  },

  // Get user orders
  async getUserPage(req) {
    const userId = req.params.userId;
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [{ userId: { $eq: userId }, orderStatus: { $ne: "cart" } }],
      searchables: [""],
      sortables: [
        "createdAt",
        "updatedAt",
        "userId",
        "branchId",
        "riderId",
        "branchZoneId",
        "deliveryZoneId",
      ],
      getFilterQueries: async (req) => {
        const { orderStatus, fromDate, toDate } = req.query;

        const queries = [];
        if (fromDate && toDate) {
          queries.push({
            createdAt: {
              $lte: DateTime.fromISO(toDate).endOf("day").toUTC().toISO(),
              $gte: DateTime.fromISO(fromDate).toUTC().toISO(),
            },
          });
        }
        if (orderStatus) {
          queries.push({ orderStatus });
        }

        return queries;
      },
    });

    if ("paginate" in this && typeof this.paginate === "function") {
      return this.paginate(query, {
        ...rest,
      });
    }

    return {};
  },

  // Get Restaurant Orders
  async getRestaurantPage(req) {
    const branchId = req.params.branchId;
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [{ branchId: { $eq: branchId }, orderStatus: { $ne: "cart" } }],
      searchables: [""],
      sortables: [
        "createdAt",
        "updatedAt",
        "userId",
        "branchId",
        "riderId",
        "branchZoneId",
        "deliveryZoneId",
      ],
      getFilterQueries: async (req) => {
        const { orderStatus, fromDate, toDate } = req.query;

        const queries = [];
        if (fromDate && toDate) {
          queries.push({
            createdAt: {
              $lte: DateTime.fromISO(toDate).endOf("day").toUTC().toISO(),
              $gte: DateTime.fromISO(fromDate).toUTC().toISO(),
            },
          });
        }
        if (orderStatus) {
          queries.push({ orderStatus });
        }

        return queries;
      },
    });

    if ("paginate" in this && typeof this.paginate === "function") {
      return this.paginate(query, {
        ...rest,
      });
    }

    return {};
  },

  // Get Restaurant Accepted Orders
  async getRestaurantAcceptedOrdersPage(req, orderIds) {
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [{ _id: { $in: orderIds } }],
      searchables: [""],
      sortables: [
        "createdAt",
        "updatedAt",
        "userId",
        "branchId",
        "riderId",
        "branchZoneId",
        "deliveryZoneId",
      ],
      getFilterQueries: async (req) => {
        const { orderStatus, fromDate, toDate } = req.query;

        const queries = [];
        if (fromDate && toDate) {
          queries.push({
            createdAt: {
              $lte: DateTime.fromISO(toDate).endOf("day").toUTC().toISO(),
              $gte: DateTime.fromISO(fromDate).toUTC().toISO(),
            },
          });
        }
        if (orderStatus) {
          queries.push({ orderStatus });
        }

        return queries;
      },
    });

    if ("paginate" in this && typeof this.paginate === "function") {
      return this.paginate(query, {
        ...rest,
      });
    }

    return {};
  },

  // Get Restaurant Rejected Orders
  async getRestaurantRejectedOrdersPage(req, orderIds) {
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [{ _id: { $in: orderIds } }],
      searchables: [""],
      sortables: [
        "createdAt",
        "updatedAt",
        "userId",
        "branchId",
        "riderId",
        "branchZoneId",
        "deliveryZoneId",
      ],
      getFilterQueries: async (req) => {
        const { orderStatus, fromDate, toDate } = req.query;

        const queries = [];
        if (fromDate && toDate) {
          queries.push({
            createdAt: {
              $lte: DateTime.fromISO(toDate).endOf("day").toUTC().toISO(),
              $gte: DateTime.fromISO(fromDate).toUTC().toISO(),
            },
          });
        }
        if (orderStatus) {
          queries.push({ orderStatus });
        }

        return queries;
      },
    });

    if ("paginate" in this && typeof this.paginate === "function") {
      return this.paginate(query, {
        ...rest,
      });
    }

    return {};
  },

  // Get Pre-Orders
  async getPreOrderPage(req) {
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [{ isPreOrder: { $eq: true }, orderStatus: { $ne: "cart" } }],
      searchables: [""],
      sortables: [
        "createdAt",
        "updatedAt",
        "userId",
        "branchId",
        "riderId",
        "branchZoneId",
        "deliveryZoneId",
      ],
      getFilterQueries: async (req) => {
        const {
          orderId,
          userId,
          branchId,
          riderId,
          deliveryZoneId,
          orderStatus,
          orderType,
          paymentMethod,
          paymentStatus,
          isThresholdCrossed,
          isVerified,
          isDelivered,
          isItGift,
          fromDate,
          toDate,
        } = req.query;

        const queries = [];

        if (orderId) {
          queries.push({ orderId });
        }
        if (userId) {
          queries.push({ userId });
        }
        if (branchId) {
          queries.push({ branchId });
        }
        if (riderId) {
          queries.push({ riderId });
        }
        if (fromDate && toDate) {
          queries.push({
            createdAt: {
              $lte: DateTime.fromISO(toDate).endOf("day").toUTC().toISO(),
              $gte: DateTime.fromISO(fromDate).toUTC().toISO(),
            },
          });
        }
        if (deliveryZoneId) {
          queries.push({ deliveryZoneId });
        }
        if (orderStatus) {
          queries.push({ orderStatus });
        }
        if (orderType) {
          queries.push({ orderType });
        }
        if (paymentMethod) {
          queries.push({ paymentMethod });
        }
        if (paymentStatus) {
          queries.push({ paymentStatus });
        }
        if (isThresholdCrossed) {
          queries.push({ isThresholdCrossed });
        }
        if (isVerified) {
          queries.push({ isVerified });
        }
        if (isDelivered) {
          queries.push({ isDelivered });
        }
        if (isItGift) {
          queries.push({ isItGift });
        }

        return queries;
      },
    });

    if ("paginate" in this && typeof this.paginate === "function") {
      return this.paginate(query, {
        ...rest,
      });
    }

    return {};
  },
};

OrderSchema.plugin(mongoosePaginate);

export const Order = mongoose.model("Order", OrderSchema);

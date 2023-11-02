import express from "express";
import mongoose, { SchemaTypes } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { preparePaginationQuery } from "../helpers";
import { v4 } from "uuid";

const orderThresholdSchema = new mongoose.Schema(
  {
    _id: {
      type: SchemaTypes.UUID,
      default: v4,
    },
    threshold: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Number,
      default: null,
    },
    updatedBy: {
      type: Number,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    model: "OrderThreshold",
    collection: "order-thresholds",
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

orderThresholdSchema.plugin(mongoosePaginate);

orderThresholdSchema.statics = {
  /**
   * @param {express.Request} req - Express request instance
   * @returns {Promise<Object>}
   */
  async getPage(req) {
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [{ deletedAt: { $eq: null } }],
      searchables: [""],
      sortables: ["createdAt", "updatedAt", "threshold"],
      filterables: [""],
    });

    if ("paginate" in this && typeof this.paginate === "function") {
      return this.paginate(query, {
        ...rest,
      });
    }

    return {};
  },
};

orderThresholdSchema.plugin(mongoosePaginate);

export const OrderThreshold = mongoose.model(
  "OrderThreshold",
  orderThresholdSchema,
);

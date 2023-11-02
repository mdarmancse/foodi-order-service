// @ts-nocheck
import express from "express";
import mongoose, { SchemaTypes } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { preparePaginationQuery } from "../helpers";
import { v4 } from "uuid";

const amountThresholdSchema = new mongoose.Schema(
  {
    _id: {
      type: SchemaTypes.UUID,
      default: v4,
    },
    zoneId: {
      type: Number,
      required: true,
    },
    amount: {
      type: SchemaTypes.Decimal128,
      required: true,
      get: (value) => {
        return value?.toString();
      },
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
    model: "AmountThreshold",
    collection: "amount-thresholds",
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

amountThresholdSchema.plugin(mongoosePaginate);

amountThresholdSchema.statics = {
  /**
   * @param {express.Request} req - Express request instance
   * @returns {Promise<Object>}
   */
  async getPage(req, filters = []) {
    const { query, ...rest } = await preparePaginationQuery(req, {
      queries: [...filters, { deletedAt: { $eq: null } }],
      searchables: [""],
      sortables: ["createdAt", "updatedAt", "zoneId", "amount"],
      filterables: [""],
      getFilterQueries: async (req) => {
        const { zoneId, amount, isActive } = req.query;

        const queries = [];

        if (zoneId) {
          queries.push({ zoneId });
        }
        if (amount) {
          queries.push({ amount });
        }
        if (isActive) {
          queries.push({ isActive });
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

amountThresholdSchema.plugin(mongoosePaginate);

export const AmountThreshold = mongoose.model(
  "AmountThreshold",
  amountThresholdSchema,
);

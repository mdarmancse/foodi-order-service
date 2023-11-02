import express from "express";
import mongoose, { SchemaTypes } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { preparePaginationQuery } from "../helpers";
import { statusEnum } from "helpers";
import { v4 } from "uuid";

const statusHistorySchema = new mongoose.Schema(
  {
    _id: {
      type: SchemaTypes.UUID,
      default: v4,
    },
    orderId: {
      type: SchemaTypes.UUID,
    },
    riderId: {
      type: Number,
    },
    branchId: {
      type: Number,
    },
    status: {
      type: String,
      default: "placed",
      enum: statusEnum,
    },
    cause: {
      type: String,
    },
    createdBy: {
      type: Number,
      default: null,
    },
    updatedBy: {
      type: Number,
      default: null,
    },
  },
  {
    model: "StatusHistory",
    collection: "status_histories",
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  },
);

statusHistorySchema.plugin(mongoosePaginate);

statusHistorySchema.statics = {
  /**
   * @param {express.Request} req - Express request instance
   * @returns {Promise<Object>}
   */
  async getPage(req) {
    const { query, ...rest } = await preparePaginationQuery(req, {
      searchables: [""],
      sortables: ["createdAt", "updatedAt"],
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

statusHistorySchema.plugin(mongoosePaginate);

export const StatusHistory = mongoose.model(
  "StatusHistory",
  statusHistorySchema,
);

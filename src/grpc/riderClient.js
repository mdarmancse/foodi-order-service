// @ts-nocheck
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const PROTO_PATH = path.join(__dirname, "protos", "rider.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);
const RiderPackage = grpc.loadPackageDefinition(packageDef).RiderPackage;

const client = new RiderPackage.GrpcRiderService(
  process.env.RIDER_GRPC_URL,
  grpc.credentials.createInsecure(),
);

/**
 * Order Delivered By Rider
 */
export function orderDeliveredByRiderAsync(payload) {
  return new Promise((resolve, reject) => {
    client.OrderDeliveredByRider(payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

/**
 * Rider Delivery Charge
 */
export function riderDeliveryChargeAsync(payload) {
  return new Promise((resolve, reject) => {
    client.RiderDeliveryCharge(payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

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
const PROTO_PATH = path.join(__dirname, "protos", "rider-assigner.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);
const riderAssigner = grpc.loadPackageDefinition(packageDef).riderAssigner;

const client = new riderAssigner.RiderAssigner(
  process.env.RIDER_AUTO_ASSIGNER_GRPC_URL,
  grpc.credentials.createInsecure(),
);

/**
 * Start Assigning
 */
export function startAssigningAsync(payload) {
  return new Promise((resolve, reject) => {
    client.startAssigning(payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

/**
 * Set Order Delivered when rider delivered the order
 */
export function setOrderDeliveredAsync(payload) {
  return new Promise((resolve, reject) => {
    client.setOrderDelivered(payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

/**
 * Rider Manually Assigned
 */
export function riderManuallyAssignedAsync(payload) {
  return new Promise((resolve, reject) => {
    client.riderManuallyAssigned(payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

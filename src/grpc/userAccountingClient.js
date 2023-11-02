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
const PROTO_PATH = path.join(__dirname, "protos", "userAccounting.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);
const userAccountingPackage =
  grpc.loadPackageDefinition(packageDef).userAccountingPackage;

const client = new userAccountingPackage.userAccounting(
  process.env.USER_ACCOUNTING_GRPC_URL,
  grpc.credentials.createInsecure(),
);

/**
 * Get User Info
 */
export function getUserProfileAsync(userId) {
  return new Promise((resolve, reject) => {
    client.getUserProfile({ userId }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

/**
 * Update User Reward Point
 */
export function userRewardPointAsync(payload) {
  return new Promise((resolve, reject) => {
    client.userRewardPoint(payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

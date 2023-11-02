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
const PROTO_PATH = path.join(__dirname, "protos", "restaurant.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);
const RestaurantPackage =
  grpc.loadPackageDefinition(packageDef).RestaurantPackage;

const client = new RestaurantPackage.GrpcRestaurantService(
  process.env.RESTAURANT_GRPC_URL,
  grpc.credentials.createInsecure(),
);

/**
 * Get Branches By Id
 */
export function getBranchInfoForInvoiceAsync(branchId) {
  return new Promise((resolve, reject) => {
    client.GetBranchInfoForInvoice({ Id: branchId }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

/**
 * Get Menus Price Info By MenuIds
 */
export function getMenusByMenuIdsForPriceInfoAsync(menuIds) {
  return new Promise((resolve, reject) => {
    client.GetMenusByMenuIdsForPriceInfo({ Ids: menuIds }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

/**
 * Insert User Wise Branch Order
 */
export function insertUserWiseBranchOrderAsync(payload) {
  return new Promise((resolve, reject) => {
    client.InsertUserWiseBranchOrder(payload, (err, response) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

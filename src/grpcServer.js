// @ts-nocheck
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import {
  updatePaymentStatus,
  riderAccepted,
  riderAssignmentFailed,
  userListBetweenFromAndToDateInSuccessOrder,
} from "./grpc";
import { ErrorLog, log } from "./helpers";

export async function grpcServer() {
  /**
   * Declaration
   */
  const PROTO_PATH = path.join(__dirname, "grpc", "protos", "orders.proto");
  const loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };
  const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);
  const orderPackage = grpc.loadPackageDefinition(packageDef).orderPackage;
  const server = new grpc.Server();

  /**
   * Add Function to Service
   */
  server.addService(orderPackage.Orders.service, {
    updatePaymentStatus,
    riderAccepted,
    riderAssignmentFailed,
    userListBetweenFromAndToDateInSuccessOrder,
  });

  /**
   * Server Call
   */
  server.bindAsync(
    `0.0.0.0:${process.env.GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (!error) {
        server.start();
        log({
          message: `gRPC listening on port ${port}`,
          caller: "bindAsync",
        });
      } else {
        log({
          message: error.message,
          level: ErrorLog,
          caller: "bindAsync",
        });
      }
    },
  );
}

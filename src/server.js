import { initRoutes } from "controllers";
import express from "express";
import { grpcServer } from "./grpcServer";
import { initErrorHandler, initGlobalMiddlewares } from "middlewares";
import connectMongoDB from "mongo";
import { initRMQ } from "./helpers/rabbitMQueue/initRMQ";
import { log } from "./helpers";
export async function runServer() {
  // connect to db
  connectMongoDB().then(() => {
    const app = express();
    const port = process.env.PORT || 3333;

    // add global middlewares
    initGlobalMiddlewares(app);

    // initialize routes
    initRoutes(app);

    initRMQ();

    // initialize global error handler
    initErrorHandler(app);

    app.listen(port, () => {
      log({
        message: `Running server at ${port} port`,
        caller: "runServer",
      });
    });

    grpcServer();
  });
}

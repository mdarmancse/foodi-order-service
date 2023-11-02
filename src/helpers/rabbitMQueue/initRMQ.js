import * as amqp from "amqplib";
import { ErrorLog, log } from "../log";

let channel = null;

export async function initRMQ() {
  reconnect();
}

export function getChannel() {
  if (!channel) {
    throw new Error("Channel is not initialized.");
  }
  return channel;
}

function initializeChannels(conn) {
  return conn.createChannel().then(function (ch) {
    conn.on("close", reconnect);

    return ch;
  });
}

export function reconnect() {
  amqp
    .connect(`${process.env.RABBITMQ_URI}`)
    .then(initializeChannels)
    .then(main)
    .catch((err) => {
      log({
        message: err.message,
        level: ErrorLog,
        caller: "reconnect",
      });
      setTimeout(reconnect, 5000);
    });
}

function main(ch) {
  log({
    message: "Successfully connected to the rabbitmq server",
    caller: "main",
  });
  channel = ch;
}

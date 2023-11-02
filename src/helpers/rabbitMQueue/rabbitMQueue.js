import { getChannel } from "./initRMQ";
import { ErrorLog, log } from "../log";

export async function publish(exchangeName, queueName, routerKey, message) {
  const channel = getChannel();

  try {
    await channel.assertExchange(exchangeName, "topic", { durable: true });
    const q = await channel.assertQueue(queueName, {
      durable: true,
      exclusive: false,
    });

    await channel.bindQueue(q.queue, exchangeName, routerKey);

    channel.publish(
      exchangeName,
      routerKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "publish",
    });
  }
}

export async function createConsumer(
  exchangeName,
  queueName,
  routerKey,
  onMessageReceived,
) {
  try {
    const channel = getChannel();
    await channel.assertExchange(exchangeName, "topic", { durable: true });

    const q = await channel.assertQueue(queueName, {
      durable: true,
      exclusive: false,
    });

    await channel.bindQueue(q.queue, exchangeName, routerKey);

    log({
      message: `Consumer is listening ${q.queue} queue. To exit press CTRL+C`,
      caller: "createConsumer",
    });

    // Consume messages from the queue
    channel.consume(
      q.queue,
      async (msg) => {
        if (msg) {
          try {
            // process the message here

            await Promise.resolve(onMessageReceived(msg.content.toString()));

            // console.log("message ack");
            channel.ack(msg);
          } catch (error) {
            log({
              message: error.message,
              level: ErrorLog,
              caller: "consume",
            });

            channel.reject(msg, false);
          }
        }
      },
      { noAck: false },
    );
  } catch (error) {
    log({
      message: error.message,
      level: ErrorLog,
      caller: "createConsumer",
    });
  }
}

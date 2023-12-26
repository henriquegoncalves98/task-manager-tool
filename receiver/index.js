require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');

const app = express();
const RECEIVER_PORT = process.env.RECEIVER_PORT || 3001;

let channel, connection;

const exchangeName = 'notifications-exchange';
const exchangeType = 'fanout';
const queueName = 'notification-queue';

connectToRabbitMQ();
async function connectToRabbitMQ () {
  try {
    connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();

    connectToQueue();
  } catch (error) {
    console.log(error);
  }
}

async function connectToQueue () {
  await channel.assertExchange(exchangeName, exchangeType, {
    durable: false
  });

  const q = await channel.assertQueue(queueName, { exclusive: true });

  // binding the queue
  const bindingKey = 'notification-key';
  channel.bindQueue(q.queue, exchangeName, bindingKey);

  console.log('Consuming messages from queue: ', q.queue);
  channel.consume(
    q.queue,
    (msg) => {
      if (msg) {
        console.log(`\nReceived message: ${msg.content.toString()}`);
      }
    },
    { noAck: true }
  );
}

app.listen(RECEIVER_PORT, () => console.log('Notification Server running at port ' + RECEIVER_PORT));
